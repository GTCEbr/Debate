'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Calendar,
  Clock,
  FileText,
  EyeOff
} from 'lucide-react';
import { useDebate } from '@/hooks/use-debate';
import { Navbar } from '@/components/Navbar';
import { DebateStage } from '@/components/DebateStage';
import { LotteryWheel } from '@/components/LotteryWheel';
import { SpeechComposer } from '@/components/SpeechComposer';
import { RoundsTracker } from '@/components/RoundsTracker';
import { DebateClosedBanner } from '@/components/DebateClosedBanner';
import { PasscodeLoginModal } from '@/components/PasscodeLoginModal';
import { TranscriptViewerModal } from '@/components/TranscriptViewerModal';
import { PrivateDebatePortal } from '@/components/PrivateDebatePortal';
import { downloadTranscriptFile, ExportDebateData } from '@/lib/export-transcript';
import { TopicItem } from '@/lib/debate-data';

export default function Home() {
  const {
    user,
    chapaSession,
    isAuthenticated,
    debaterProfile,
    isDebater,
    debate,
    speeches,
    debaters,
    chapa1Members,
    chapa2Members,
    loginWithCredentials,
    loginWithGoogle,
    logout,
    startTurn,
    finishTurn,
    triggerLottery,
    setRound,
    setStatus,
  } = useDebate();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isTranscriptModalOpen, setIsTranscriptModalOpen] = useState(false);

  const activeChapaKey = debaterProfile?.chapaId || chapaSession?.chapaId;
  const isCurrentUserSpeaker = Boolean(
    isAuthenticated &&
      (activeChapaKey === debate?.activeSpeakerChapaId || !debate?.activeSpeakerChapaId)
  );

  const isDebateClosed = debate?.status === 'closed';

  const chapa1DisplayName = debate?.chapa1Name || 'Chapa Vincere';
  const chapa2DisplayName = debate?.chapa2Name || 'Chapa Aegre';

  const exportData: ExportDebateData = {
    title: debate?.title || 'Debate do Grêmio Estudantil - Eleições 2026',
    status: debate?.status || 'live',
    scheduledDate: '08 de Novembro de 2026 (18:00 às 19:00)',
    chapa1Name: chapa1DisplayName,
    chapa2Name: chapa2DisplayName,
    chapa1Members: chapa1Members.map((m) => m.displayName),
    chapa2Members: chapa2Members.map((m) => m.displayName),
    lotteryWinner: debate?.lotteryWinner,
    speeches: speeches.map((s) => ({
      id: s.id,
      round: s.round,
      roundType: s.roundType,
      eixo: s.eixo,
      topic: s.topic,
      chapaId: s.chapaId,
      chapaName: s.chapaName,
      speakerName: s.speakerName,
      content: s.content,
      durationSeconds: s.durationSeconds,
      createdAt: s.createdAt,
    })),
  };

  const handleDownloadTxt = () => {
    downloadTranscriptFile(exportData);
  };

  // RULE 1: O PÚBLICO NÃO ASSISTE
  // If not authenticated, render private gatekeeper portal only!
  if (!isAuthenticated) {
    return (
      <PrivateDebatePortal
        onLoginCredentials={loginWithCredentials}
        onLoginGoogle={loginWithGoogle}
      />
    );
  }

  // Once authenticated as one of the chapas, render the live private debate room:
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Bar */}
      <Navbar
        user={user}
        chapaSession={chapaSession}
        isAuthenticated={isAuthenticated}
        debaterProfile={debaterProfile}
        debate={debate}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onOpenTranscript={() => setIsTranscriptModalOpen(true)}
        onLogout={logout}
        isDebater={isDebater}
      />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden border-b border-slate-800 bg-slate-950 py-10 sm:py-14">
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero_debate_stage.jpg"
              alt="Palco do debate oficial do grêmio estudantil"
              fill
              priority
              className="object-cover opacity-20 filter blur-[1px]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/60" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-amber-400 mb-3">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>08/11 às 18:00</span>
                </span>
                <span className="text-slate-600">·</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Duração: 1 Hora Regulamentar</span>
                </span>
                <span className="text-slate-600">·</span>
                <span className="flex items-center gap-1.5 text-blue-400">
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Sala Privada (Sem público)</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight mb-4">
                Debate Oficial: {chapa1DisplayName} vs. {chapa2DisplayName}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mb-6">
                Turnos de 2 minutos cronometrados entre falas com ordem e temas sorteados em tempo real. Ao fim de 1 hora de debate, a página é fechada e a ATA em TXT é gerada diretamente a partir dos registros do Firebase.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#pulpito"
                  className="rounded-lg bg-amber-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors shadow-sm"
                >
                  Púlpito Ao Vivo
                </a>

                <button
                  onClick={() => setIsTranscriptModalOpen(true)}
                  className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>Baixar ATA em TXT ({speeches.length} falas)</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN DEBATE CONTAINER */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* CLOSED STATE BANNER (WHEN 1H FINISHES ON NOV 8) */}
          {isDebateClosed && (
            <DebateClosedBanner
              debate={debate}
              speechesCount={speeches.length}
              onDownloadTxt={handleDownloadTxt}
              onViewTranscript={() => setIsTranscriptModalOpen(true)}
              isMediator={false}
              onReopenDebate={() => setStatus('live')}
            />
          )}

          {/* THE DEBATE STAGE (PODIUMS + TIMER + RECENT SPEECHES) */}
          <DebateStage
            debate={debate}
            debaters={debaters}
            chapa1Members={chapa1Members}
            chapa2Members={chapa2Members}
            speeches={speeches}
            isCurrentUserSpeaker={isCurrentUserSpeaker}
            onConcludeSpeech={() => finishTurn('Turno concluído.', 120)}
            onResetTimer={() => startTurn(debate?.activeSpeakerChapaId || 'chapa1', debate?.activeSpeakerName || '')}
            onHandoffTurn={(targetChapa) => {
              const name = targetChapa === 'chapa1' ? chapa1DisplayName : chapa2DisplayName;
              startTurn(targetChapa, name);
            }}
            onSelectSpeaker={(chapaId, name) => startTurn(chapaId, name)}
          />

          {/* TWO-COLUMN LOWER SECTION: SPEECH COMPOSER + REAL-TIME LOTTERY */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7">
              <SpeechComposer
                debaterProfile={debaterProfile}
                activeSpeakerChapaId={debate?.activeSpeakerChapaId || ''}
                currentRound={debate?.currentRound || 1}
                currentTopic={debate?.currentTopic || ''}
                onSubmitSpeech={finishTurn}
              />
            </div>

            <div className="lg:col-span-5">
              <LotteryWheel
                isSpinning={debate?.lotterySpinning}
                winnerChapaId={debate?.lotteryWinner}
                chapa1Name={chapa1DisplayName}
                chapa2Name={chapa2DisplayName}
                currentRound={debate?.currentRound || 1}
                lotteryItem={debate?.lotteryItem}
                isMediator={false}
                onSpinChapa={() => triggerLottery('chapa')}
                onSpinTopic={(topic: TopicItem) => triggerLottery('topic', undefined, topic)}
              />
            </div>
          </div>

          {/* ROUNDS & THEMES EXPLORER (RODADA LIVRE, 7 EIXOS, 50 TEMAS DA FINAL) */}
          <RoundsTracker
            currentRound={debate?.currentRound || 1}
            currentEixo={debate?.currentEixo || ''}
            currentTopic={debate?.currentTopic || ''}
            onSelectRound={(roundNum, roundName, eixo, topic) => {
              setRound(roundNum, roundName, eixo, topic);
            }}
            onSelectTopic={(topic) => {
              setRound(3, '3ª Rodada (Final): Temas Sorteados', topic.eixo, `${topic.id}. ${topic.title}: ${topic.description}`);
            }}
          />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>
            Eleições do Grêmio Estudantil 2026 · Sala Fechada Exclusiva das Chapas
          </span>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsTranscriptModalOpen(true)}
              className="hover:text-amber-400 transition-colors"
            >
              Exportar ATA em TXT
            </button>
            <span>·</span>
            <span>Regulamento 08/11 · 18h às 19h</span>
          </div>
        </div>
      </footer>

      {/* PASSCODE LOGIN MODAL */}
      <PasscodeLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginCredentials={loginWithCredentials}
        onLoginGoogle={loginWithGoogle}
      />

      {/* TRANSCRIPT TXT VIEWER & DOWNLOAD MODAL */}
      <TranscriptViewerModal
        isOpen={isTranscriptModalOpen}
        onClose={() => setIsTranscriptModalOpen(false)}
        exportData={exportData}
      />
    </div>
  );
}
