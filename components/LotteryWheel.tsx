'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Dices, Award, HelpCircle } from 'lucide-react';
import { sound } from '@/lib/audio';
import { ROUND_3_DRAWN_TOPICS, TopicItem } from '@/lib/debate-data';

interface LotteryWheelProps {
  isSpinning?: boolean;
  winnerChapaId?: string;
  chapa1Name: string;
  chapa2Name: string;
  currentRound: number;
  lotteryItem?: string;
  isMediator: boolean;
  onSpinChapa: () => void;
  onSpinTopic: (topic: TopicItem) => void;
}

export function LotteryWheel({
  isSpinning = false,
  winnerChapaId,
  chapa1Name,
  chapa2Name,
  currentRound,
  lotteryItem,
  isMediator,
  onSpinChapa,
  onSpinTopic,
}: LotteryWheelProps) {
  const [displayChapa, setDisplayChapa] = useState<string>('chapa1');
  const [displayTopicIndex, setDisplayTopicIndex] = useState<number>(0);
  const [internalSpinning, setInternalSpinning] = useState(false);
  const [mode, setMode] = useState<'chapa' | 'topic'>('chapa');
  const lastSpinRef = useRef<boolean>(false);

  const startVisualSpin = useCallback(() => {
    setInternalSpinning(true);
    let count = 0;
    const maxTicks = 28;
    let delay = 60;

    const tick = () => {
      count++;
      // Alternate chapas or topics
      setDisplayChapa((prev) => (prev === 'chapa1' ? 'chapa2' : 'chapa1'));
      setDisplayTopicIndex((prev) => (prev + 1) % ROUND_3_DRAWN_TOPICS.length);
      sound.playTick();

      if (count < maxTicks) {
        delay += 8; // deceleration
        setTimeout(tick, delay);
      } else {
        setInternalSpinning(false);
        sound.playWin();
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
          });
        } catch {
          // ignore
        }
      }
    };

    tick();
  }, []);

  // Sync with Firestore spin state
  useEffect(() => {
    if (isSpinning && !lastSpinRef.current) {
      startVisualSpin();
    }
    lastSpinRef.current = isSpinning;
  }, [isSpinning, startVisualSpin]);

  const handleManualChapaSpin = () => {
    onSpinChapa();
    startVisualSpin();
  };

  const handleManualTopicSpin = () => {
    const randomIndex = Math.floor(Math.random() * ROUND_3_DRAWN_TOPICS.length);
    const chosenTopic = ROUND_3_DRAWN_TOPICS[randomIndex];
    onSpinTopic(chosenTopic);
    startVisualSpin();
  };

  const activeWinner = winnerChapaId || displayChapa;
  const isChapa1 = activeWinner === 'chapa1';

  return (
    <div id="sorteio" className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Dices className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Sorteio em Tempo Real (Visível a Todos)
          </h3>
        </div>

        {/* Tab switch for raffle type */}
        <div className="flex items-center rounded-lg bg-slate-950 p-1 border border-slate-800">
          <button
            onClick={() => setMode('chapa')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
              mode === 'chapa'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ordem de Fala
          </button>
          <button
            onClick={() => setMode('topic')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
              mode === 'topic'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Pergunta (50 Temas)
          </button>
        </div>
      </div>

      <div className="py-6">
        {mode === 'chapa' ? (
          /* CHAPA RAFFLE DISPLAY */
          <div className="flex flex-col items-center text-center">
            <span className="text-xs text-slate-400 mb-2">
              Quem começa a falar é sorteado totalmente ao vivo
            </span>

            <div
              className={`w-full max-w-md rounded-xl border p-6 transition-all duration-300 ${
                internalSpinning
                  ? 'border-amber-400 bg-amber-950/20 shadow-lg shadow-amber-500/10 scale-105'
                  : isChapa1
                  ? 'border-blue-500 bg-blue-950/30'
                  : 'border-amber-500 bg-amber-950/30'
              }`}
            >
              <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {internalSpinning ? 'Sorteando...' : 'Chapa Sorteada para Iniciar'}
                </span>
              </div>

              <div
                className={`text-xl sm:text-2xl font-black tracking-tight ${
                  isChapa1 ? 'text-blue-300' : 'text-amber-300'
                }`}
              >
                {isChapa1 ? chapa1Name : chapa2Name}
              </div>

              <div className="mt-2 text-xs text-slate-400">
                {internalSpinning
                  ? 'Calculando semente aleatória...'
                  : 'Garante igualdade e neutralidade no debate'}
              </div>
            </div>

            <button
              onClick={handleManualChapaSpin}
              disabled={internalSpinning}
              className="mt-4 flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors disabled:opacity-50 shadow-sm"
            >
              <Dices className="w-4 h-4" />
              <span>Sortear Quem Começa Agora</span>
            </button>
          </div>
        ) : (
          /* TOPIC RAFFLE DISPLAY (50 TOPICS) */
          <div className="flex flex-col items-center text-center">
            <span className="text-xs text-slate-400 mb-2">
              3ª Rodada: 50 questões sorteadas ao vivo entre os 8 Eixos Temáticos
            </span>

            <div
              className={`w-full max-w-lg rounded-xl border p-5 transition-all duration-300 ${
                internalSpinning
                  ? 'border-amber-400 bg-amber-950/20 shadow-lg shadow-amber-500/10 scale-102'
                  : 'border-slate-700 bg-slate-950/80'
              }`}
            >
              <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-semibold text-amber-400 mb-1">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>
                  Eixo:{' '}
                  {ROUND_3_DRAWN_TOPICS[displayTopicIndex]?.eixo || 'Democracia'}
                </span>
              </div>

              <div className="text-base sm:text-lg font-bold text-white mb-2">
                Tema {ROUND_3_DRAWN_TOPICS[displayTopicIndex]?.id}:{' '}
                {ROUND_3_DRAWN_TOPICS[displayTopicIndex]?.title}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
                &ldquo;{ROUND_3_DRAWN_TOPICS[displayTopicIndex]?.description}&rdquo;
              </p>
            </div>

            <button
              onClick={handleManualTopicSpin}
              disabled={internalSpinning}
              className="mt-4 flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors disabled:opacity-50 shadow-sm"
            >
              <Dices className="w-4 h-4" />
              <span>Sortear Pergunta da 3ª Rodada</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
