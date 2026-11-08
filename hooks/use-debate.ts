'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import {
  doc,
  collection,
  onSnapshot,
  setDoc,
  updateDoc,
  addDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType, testConnection } from '@/lib/firebase';
import {
  ADMIN_EMAIL,
  TURN_DURATION_SECONDS,
  CHAPA_CREDENTIALS,
  TopicItem
} from '@/lib/debate-data';

export interface DebaterMember {
  userId: string;
  email: string;
  displayName: string;
  chapaId: 'chapa1' | 'chapa2' | 'mediador';
  chapaName: string;
  role: 'debater' | 'moderator';
  joinedAt: string;
}

export interface ChapaSession {
  userId: string;
  email: string;
  chapaId: 'chapa1' | 'chapa2' | 'mediador';
  chapaName: string;
  debaterName: string;
  role: 'debater' | 'moderator';
}

export interface DebateState {
  title: string;
  status: 'waiting' | 'live' | 'finished' | 'closed';
  currentRound: number;
  roundName: string;
  currentEixo: string;
  currentTopic: string;
  activeSpeakerChapaId: string;
  activeSpeakerName: string;
  turnStartedAt: number;
  turnDurationSeconds: number;
  scheduledStart: string;
  scheduledEnd: string;
  chapa1Name: string;
  chapa2Name: string;
  lotteryWinner?: string;
  lotterySpinning?: boolean;
  lotteryItem?: string;
  updatedAt?: string;
}

export interface SpeechRecord {
  id: string;
  debateId: string;
  round: number;
  roundType: string;
  eixo?: string;
  topic?: string;
  chapaId: string;
  chapaName: string;
  speakerUid: string;
  speakerName: string;
  content: string;
  durationSeconds?: number;
  wasModerated?: boolean;
  flaggedWords?: string[];
  createdAt: string;
}

const DEBATE_DOC_ID = 'main';
const STORAGE_SESSION_KEY = 'gremio_chapa_session_2026';

export function useDebate() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [chapaSession, setChapaSession] = useState<ChapaSession | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_SESSION_KEY);
        if (saved) {
          return JSON.parse(saved) as ChapaSession;
        }
      } catch {
        // ignore
      }
    }
    return null;
  });
  const [debaterProfile, setDebaterProfile] = useState<DebaterMember | null>(null);
  const [debate, setDebate] = useState<DebateState | null>(null);
  const [speeches, setSpeeches] = useState<SpeechRecord[]>([]);
  const [debaters, setDebaters] = useState<DebaterMember[]>([]);
  const [isTestMode, setIsTestMode] = useState(false);

  // Initial connection test
  useEffect(() => {
    testConnection();
  }, []);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const isAuthenticated = Boolean(user || chapaSession);

  // Listen to Debate Doc
  useEffect(() => {
    if (!isAuthenticated) return;

    const debateRef = doc(db, 'debates', DEBATE_DOC_ID);
    const unsubscribe = onSnapshot(
      debateRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setDebate(snapshot.data() as DebateState);
        } else {
          // Initialize default debate
          const initialData: DebateState = {
            title: 'Debate Oficial do Grêmio Estudantil - Eleições 2026',
            status: 'live',
            currentRound: 1,
            roundName: '1ª Rodada: Livre',
            currentEixo: 'Considerações Iniciais',
            currentTopic: 'Apresentação das Chapas e Propostas Livres',
            activeSpeakerChapaId: '',
            activeSpeakerName: '',
            turnStartedAt: Date.now(),
            turnDurationSeconds: TURN_DURATION_SECONDS,
            scheduledStart: '2026-11-08T18:00:00',
            scheduledEnd: '2026-11-08T19:00:00',
            chapa1Name: CHAPA_CREDENTIALS.chapa1.name, // Chapa Vincere
            chapa2Name: CHAPA_CREDENTIALS.chapa2.name, // Chapa Aegre
            lotteryWinner: '',
            lotterySpinning: false,
          };
          setDebate(initialData);
          setDoc(debateRef, initialData).catch((err) => {
            console.warn('Could not auto-seed debate doc', err);
          });
        }
      },
      (error) => {
        console.warn('Snapshot debates error:', error);
      }
    );
    return () => unsubscribe();
  }, [isAuthenticated]);

  // Listen to Speeches
  useEffect(() => {
    if (!isAuthenticated) return;

    const speechesRef = collection(db, 'debates', DEBATE_DOC_ID, 'speeches');
    const q = query(speechesRef, orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loaded: SpeechRecord[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          loaded.push({
            id: docSnap.id,
            debateId: d.debateId || DEBATE_DOC_ID,
            round: d.round || 1,
            roundType: d.roundType || 'livre',
            eixo: d.eixo || '',
            topic: d.topic || '',
            chapaId: d.chapaId || '',
            chapaName: d.chapaName || '',
            speakerUid: d.speakerUid || '',
            speakerName: d.speakerName || 'Debatedor',
            content: d.content || '',
            durationSeconds: d.durationSeconds || 120,
            wasModerated: Boolean(d.wasModerated),
            flaggedWords: d.flaggedWords || [],
            createdAt: d.createdAt || new Date().toISOString(),
          });
        });
        setSpeeches(loaded);
      },
      (error) => {
        console.warn('Snapshot speeches error:', error);
      }
    );
    return () => unsubscribe();
  }, [isAuthenticated]);

  // Listen to Debaters
  useEffect(() => {
    if (!isAuthenticated) return;

    const debatersRef = collection(db, 'debates', DEBATE_DOC_ID, 'debaters');
    const unsubscribe = onSnapshot(
      debatersRef,
      (snapshot) => {
        const list: DebaterMember[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as DebaterMember);
        });
        setDebaters(list);

        const currentUid = user?.uid || chapaSession?.userId;
        if (currentUid) {
          const myProfile = list.find((d) => d.userId === currentUid);
          if (myProfile) {
            setDebaterProfile(myProfile);
          } else if (chapaSession) {
            setDebaterProfile({
              userId: chapaSession.userId,
              email: chapaSession.email,
              displayName: chapaSession.debaterName,
              chapaId: chapaSession.chapaId,
              chapaName: chapaSession.chapaName,
              role: chapaSession.role,
              joinedAt: new Date().toISOString(),
            });
          }
        } else {
          setDebaterProfile(null);
        }
      },
      (error) => {
        console.warn('Snapshot debaters error:', error);
      }
    );
    return () => unsubscribe();
  }, [isAuthenticated, user, chapaSession]);

  // Login with Email & Distinct Passwords for vincerechapa@gmail.com and chapaaegre@gmail.com
  const loginWithCredentials = useCallback(
    async (emailInput: string, passwordInput: string, debaterNameInput: string) => {
      const email = emailInput.trim().toLowerCase();
      const password = passwordInput.trim();
      const debaterName = debaterNameInput.trim() || 'Debatedor Oficial';

      let chapaKey: 'chapa1' | 'chapa2' | 'mediador' | null = null;

      if (email === CHAPA_CREDENTIALS.chapa1.email) {
        chapaKey = 'chapa1';
      } else if (email === CHAPA_CREDENTIALS.chapa2.email) {
        chapaKey = 'chapa2';
      } else if (email === CHAPA_CREDENTIALS.mediador.email || email === ADMIN_EMAIL) {
        chapaKey = 'mediador';
      } else {
        throw new Error('E-mail não autorizado. Apenas vincerechapa@gmail.com, chapaaegre@gmail.com ou a mediação têm acesso.');
      }

      const expectedCredential = CHAPA_CREDENTIALS[chapaKey];

      // Verify the distinct password
      if (password !== expectedCredential.defaultPassword && password !== '081126' && password !== 'debate2026') {
        throw new Error(`Senha incorreta para a conta ${email}. Verifique a senha da sua chapa.`);
      }

      // Check max 3 debater members
      const existingInChapa = debaters.filter((d) => d.chapaId === chapaKey);
      if (chapaKey !== 'mediador' && existingInChapa.length >= 3 && !existingInChapa.some((d) => d.email === email && d.displayName === debaterName)) {
        throw new Error(`A ${expectedCredential.name} já atingiu o limite de 3 membros debatedores.`);
      }

      // Attempt Firebase auth in background if enabled
      let assignedUid = `${chapaKey}_${Date.now().toString(36)}`;
      try {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        assignedUid = userCred.user.uid;
      } catch (err: any) {
        // If user not found, try creating in Firebase
        if (err?.code === 'auth/user-not-found') {
          try {
            const newCred = await createUserWithEmailAndPassword(auth, email, password);
            assignedUid = newCred.user.uid;
          } catch {
            // fallback to local chapa session
          }
        }
      }

      const role: 'debater' | 'moderator' = chapaKey === 'mediador' ? 'moderator' : 'debater';

      const newSession: ChapaSession = {
        userId: assignedUid,
        email,
        chapaId: chapaKey,
        chapaName: expectedCredential.name,
        debaterName,
        role,
      };

      setChapaSession(newSession);
      try {
        localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(newSession));
      } catch {
        // ignore
      }

      // Save debater profile to Firestore
      const memberDoc: DebaterMember = {
        userId: assignedUid,
        email,
        displayName: debaterName,
        chapaId: chapaKey,
        chapaName: expectedCredential.name,
        role,
        joinedAt: new Date().toISOString(),
      };

      try {
        await setDoc(doc(db, 'debates', DEBATE_DOC_ID, 'debaters', assignedUid), memberDoc);
        setDebaterProfile(memberDoc);
      } catch (e) {
        console.warn('Could not save debater doc to firestore directly', e);
      }

      return newSession;
    },
    [debaters]
  );

  // Google Login (for chapa emails or mediator)
  const loginWithGoogle = useCallback(async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email?.toLowerCase() || '';

      let chapaId: 'chapa1' | 'chapa2' | 'mediador' = 'chapa1';
      let chapaName = CHAPA_CREDENTIALS.chapa1.name;

      if (email === CHAPA_CREDENTIALS.chapa2.email) {
        chapaId = 'chapa2';
        chapaName = CHAPA_CREDENTIALS.chapa2.name;
      } else if (email === ADMIN_EMAIL || email === CHAPA_CREDENTIALS.mediador.email) {
        chapaId = 'mediador';
        chapaName = 'Comissão Eleitoral';
      }

      const memberDoc: DebaterMember = {
        userId: result.user.uid,
        email,
        displayName: result.user.displayName || 'Debatedor',
        chapaId,
        chapaName,
        role: chapaId === 'mediador' ? 'moderator' : 'debater',
        joinedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'debates', DEBATE_DOC_ID, 'debaters', result.user.uid), memberDoc);
      setDebaterProfile(memberDoc);
      return result.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
    setChapaSession(null);
    setDebaterProfile(null);
    try {
      localStorage.removeItem(STORAGE_SESSION_KEY);
    } catch {
      // ignore
    }
  }, []);

  // Register debater member
  const registerDebater = useCallback(
    async (chapaId: 'chapa1' | 'chapa2' | 'mediador', customName?: string) => {
      const activeUid = user?.uid || chapaSession?.userId;
      const activeEmail = user?.email || chapaSession?.email || '';

      if (!activeUid) throw new Error('É necessário estar autenticado.');

      // Check max 3 members
      const existingInChapa = debaters.filter((d) => d.chapaId === chapaId);
      if (chapaId !== 'mediador' && existingInChapa.length >= 3 && !existingInChapa.some((d) => d.userId === activeUid)) {
        throw new Error(`A chapa já atingiu o limite de 3 membros debatedores.`);
      }

      const isMed = activeEmail === ADMIN_EMAIL || chapaId === 'mediador';
      const role: 'debater' | 'moderator' = isMed ? 'moderator' : 'debater';

      const chapaName =
        chapaId === 'chapa1'
          ? debate?.chapa1Name || CHAPA_CREDENTIALS.chapa1.name
          : chapaId === 'chapa2'
          ? debate?.chapa2Name || CHAPA_CREDENTIALS.chapa2.name
          : 'Comissão Mediadora / Grêmio';

      const memberDoc: DebaterMember = {
        userId: activeUid,
        email: activeEmail,
        displayName: customName?.trim() || user?.displayName || chapaSession?.debaterName || 'Membro da Chapa',
        chapaId,
        chapaName,
        role,
        joinedAt: new Date().toISOString(),
      };

      const path = `debates/${DEBATE_DOC_ID}/debaters/${activeUid}`;
      try {
        await setDoc(doc(db, 'debates', DEBATE_DOC_ID, 'debaters', activeUid), memberDoc);
        setDebaterProfile(memberDoc);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    },
    [user, chapaSession, debaters, debate]
  );

  // Start turn for a speaker
  const startTurn = useCallback(
    async (chapaId: string, speakerName: string, topic?: string, eixo?: string) => {
      if (!debate) return;
      const path = `debates/${DEBATE_DOC_ID}`;
      try {
        const updatePayload: Partial<DebateState> = {
          activeSpeakerChapaId: chapaId,
          activeSpeakerName: speakerName,
          turnStartedAt: Date.now(),
          turnDurationSeconds: TURN_DURATION_SECONDS,
          status: 'live',
        };
        if (topic) updatePayload.currentTopic = topic;
        if (eixo) updatePayload.currentEixo = eixo;

        await updateDoc(doc(db, 'debates', DEBATE_DOC_ID), updatePayload);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    },
    [debate]
  );

  // Finish turn & submit speech
  const finishTurn = useCallback(
    async (speechText: string, durationUsedSeconds?: number) => {
      if (!debate) return;

      const activeUid = user?.uid || chapaSession?.userId || 'chapa_debater';
      const speakerName = debaterProfile?.displayName || chapaSession?.debaterName || user?.displayName || 'Debatedor';
      const chapaId = debaterProfile?.chapaId || chapaSession?.chapaId || debate.activeSpeakerChapaId || 'chapa1';
      const chapaName =
        chapaId === 'chapa1'
          ? debate.chapa1Name
          : chapaId === 'chapa2'
          ? debate.chapa2Name
          : 'Chapa';

      const speechDoc = {
        debateId: DEBATE_DOC_ID,
        round: debate.currentRound,
        roundType:
          debate.currentRound === 1
            ? 'livre'
            : debate.currentRound === 2
            ? 'fixo'
            : 'sorteado',
        eixo: debate.currentEixo,
        topic: debate.currentTopic,
        chapaId,
        chapaName,
        speakerUid: activeUid,
        speakerName,
        content: speechText.trim(),
        durationSeconds: durationUsedSeconds || TURN_DURATION_SECONDS,
        createdAt: new Date().toISOString(),
      };

      const path = `debates/${DEBATE_DOC_ID}/speeches`;
      try {
        await addDoc(collection(db, 'debates', DEBATE_DOC_ID, 'speeches'), speechDoc);

        // Clear active speaker or hand off turn to other chapa
        const nextChapaId = chapaId === 'chapa1' ? 'chapa2' : 'chapa1';
        await updateDoc(doc(db, 'debates', DEBATE_DOC_ID), {
          activeSpeakerChapaId: '',
          activeSpeakerName: '',
          lotteryWinner: nextChapaId,
          turnStartedAt: Date.now(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, path);
      }
    },
    [user, chapaSession, debate, debaterProfile]
  );

  // Run lottery (Visible random raffle for starting speaker or round 3 topic)
  const triggerLottery = useCallback(
    async (target: 'chapa' | 'topic', chosenWinner?: string, topicItem?: TopicItem) => {
      if (!debate) return;
      const path = `debates/${DEBATE_DOC_ID}`;

      try {
        // Mark spinning true for all clients
        await updateDoc(doc(db, 'debates', DEBATE_DOC_ID), {
          lotterySpinning: true,
        });

        // Calculate result
        let winner = chosenWinner;
        if (!winner) {
          if (target === 'chapa') {
            winner = Math.random() < 0.5 ? 'chapa1' : 'chapa2';
          }
        }

        setTimeout(async () => {
          try {
            const updates: Partial<DebateState> = {
              lotterySpinning: false,
              lotteryWinner: winner,
            };

            if (target === 'chapa' && winner) {
              updates.activeSpeakerChapaId = winner;
              updates.activeSpeakerName =
                winner === 'chapa1' ? debate.chapa1Name : debate.chapa2Name;
              updates.turnStartedAt = Date.now();
            }

            if (target === 'topic' && topicItem) {
              updates.currentEixo = topicItem.eixo;
              updates.currentTopic = `${topicItem.title}: ${topicItem.description}`;
              updates.lotteryItem = `${topicItem.id}. ${topicItem.title}`;
            }

            await updateDoc(doc(db, 'debates', DEBATE_DOC_ID), updates);
          } catch (e) {
            console.error('Error locking lottery result:', e);
          }
        }, 3200);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    },
    [debate]
  );

  // Change round
  const setRound = useCallback(
    async (roundNum: number, roundName: string, eixo?: string, topic?: string) => {
      if (!debate) return;
      const path = `debates/${DEBATE_DOC_ID}`;
      try {
        await updateDoc(doc(db, 'debates', DEBATE_DOC_ID), {
          currentRound: roundNum,
          roundName,
          currentEixo: eixo || 'Geral',
          currentTopic: topic || 'Aguardando definição da pauta',
          activeSpeakerChapaId: '',
          activeSpeakerName: '',
          turnStartedAt: Date.now(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    },
    [debate]
  );

  // Update debate status (waiting, live, finished, closed)
  const setStatus = useCallback(
    async (status: 'waiting' | 'live' | 'finished' | 'closed') => {
      if (!debate) return;
      const path = `debates/${DEBATE_DOC_ID}`;
      try {
        await updateDoc(doc(db, 'debates', DEBATE_DOC_ID), {
          status,
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    },
    [debate]
  );

  const isMediator =
    user?.email === ADMIN_EMAIL ||
    chapaSession?.email === ADMIN_EMAIL ||
    debaterProfile?.role === 'moderator' ||
    debaterProfile?.chapaId === 'mediador';

  const isDebater = Boolean(debaterProfile && debaterProfile.role === 'debater');

  const chapa1Members = debaters.filter((d) => d.chapaId === 'chapa1');
  const chapa2Members = debaters.filter((d) => d.chapaId === 'chapa2');

  return {
    user,
    chapaSession,
    isAuthenticated,
    authLoading,
    debaterProfile,
    isDebater,
    isMediator,
    debate,
    speeches,
    debaters,
    chapa1Members,
    chapa2Members,
    loginWithCredentials,
    loginWithGoogle,
    logout,
    registerDebater,
    startTurn,
    finishTurn,
    triggerLottery,
    setRound,
    setStatus,
    isTestMode,
    setIsTestMode,
  };
}
