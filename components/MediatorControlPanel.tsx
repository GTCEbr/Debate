'use client';

import { useState } from 'react';
import { Sliders, Play, Square, RotateCcw, Dices, Shield, PlusCircle, CheckCircle } from 'lucide-react';
import { DebateState } from '@/hooks/use-debate';
import { ROUND_3_DRAWN_TOPICS } from '@/lib/debate-data';

interface MediatorControlPanelProps {
  debate: DebateState | null;
  onSetStatus: (status: 'waiting' | 'live' | 'finished' | 'closed') => void;
  onTriggerLotteryChapa: () => void;
  onTriggerLotteryTopic: (topic: any) => void;
  onResetTimer: () => void;
  onSeedDemoData: () => Promise<void>;
  isMediator: boolean;
}

export function MediatorControlPanel({
  debate,
  onSetStatus,
  onTriggerLotteryChapa,
  onTriggerLotteryTopic,
  onResetTimer,
  onSeedDemoData,
  isMediator,
}: MediatorControlPanelProps) {
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);

  if (!isMediator) return null;

  const handleSeed = async () => {
    try {
      setSeeding(true);
      await onSeedDemoData();
      setSeedSuccess(true);
      setTimeout(() => setSeedSuccess(false), 3000);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-950/10 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/20 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Painel da Comissão Eleitoral & Moderação (Mediador)
          </h4>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Estado Atual:</span>
          <span className="font-bold text-white uppercase px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
            {debate?.status || 'live'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Status toggles */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-300">
            Estado do Debate (1h):
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSetStatus('live')}
              className={`flex-1 rounded px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${
                debate?.status === 'live'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Ao Vivo
            </button>
            <button
              onClick={() => onSetStatus('closed')}
              className={`flex-1 rounded px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${
                debate?.status === 'closed'
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Fechar Página (1h)
            </button>
          </div>
        </div>

        {/* Live Lotteries */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-300">
            Sorteios em Tempo Real:
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onTriggerLotteryChapa}
              className="flex-1 flex items-center justify-center gap-1 rounded bg-amber-500 px-2 py-1.5 text-[11px] font-bold text-slate-950 hover:bg-amber-400"
            >
              <Dices className="w-3.5 h-3.5" />
              <span>Chapa Inicial</span>
            </button>
            <button
              onClick={() => {
                const random = ROUND_3_DRAWN_TOPICS[Math.floor(Math.random() * ROUND_3_DRAWN_TOPICS.length)];
                onTriggerLotteryTopic(random);
              }}
              className="flex-1 flex items-center justify-center gap-1 rounded border border-amber-500/50 bg-slate-900 px-2 py-1.5 text-[11px] font-bold text-amber-300 hover:bg-amber-950/40"
            >
              <Dices className="w-3.5 h-3.5" />
              <span>Tema 3ª Rod.</span>
            </button>
          </div>
        </div>

        {/* Turn Timer Reset */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-300">
            Controle do Cronômetro:
          </span>
          <button
            onClick={onResetTimer}
            className="w-full flex items-center justify-center gap-1.5 rounded border border-slate-700 bg-slate-900 py-1.5 text-[11px] font-medium text-slate-200 hover:bg-slate-800"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Resetar 2 minutos (120s)</span>
          </button>
        </div>

        {/* Test Simulator */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-300">
            Simulador de Testes:
          </span>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="w-full flex items-center justify-center gap-1.5 rounded border border-slate-700 bg-slate-900 py-1.5 text-[11px] font-medium text-slate-200 hover:bg-slate-800 disabled:opacity-50"
          >
            {seedSuccess ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Falas Inseridas!</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{seeding ? 'Populando...' : 'Inserir Falas de Teste'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
