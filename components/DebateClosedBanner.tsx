'use client';

import { FileText, Lock, CheckCircle2, Download, Eye, Sparkles } from 'lucide-react';
import { DebateState, SpeechRecord } from '@/hooks/use-debate';

interface DebateClosedBannerProps {
  debate: DebateState | null;
  speechesCount: number;
  onDownloadTxt: () => void;
  onViewTranscript: () => void;
  isMediator: boolean;
  onReopenDebate?: () => void;
}

export function DebateClosedBanner({
  debate,
  speechesCount,
  onDownloadTxt,
  onViewTranscript,
  isMediator,
  onReopenDebate,
}: DebateClosedBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 p-6 sm:p-8 text-center shadow-2xl">
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-4 shadow-inner">
        <Lock className="w-6 h-6" />
      </div>

      <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-950/40 px-3 py-1 text-xs font-semibold text-amber-400 mb-3">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>Transmissão Oficial de 1h Encerrada</span>
      </div>

      <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-2">
        Debate das Eleições do Grêmio Concluído
      </h2>

      <p className="mx-auto max-w-xl text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
        Conforme estabelecido pelo regimento, após 1 hora ininterrupta de debate democrático no dia 08/11 (18h às 19h), a página de falas do púlpito foi fechada. Todas as intervenções foram catalogadas e auditadas em tempo real no banco de dados.
      </p>

      {/* Summary stats */}
      <div className="mx-auto max-w-md grid grid-cols-3 gap-3 mb-6 text-center">
        <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-3">
          <div className="text-base font-bold text-white tabular-nums">
            {speechesCount}
          </div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">
            Falas Registradas
          </div>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-3">
          <div className="text-base font-bold text-amber-400 tabular-nums">
            3 Rodadas
          </div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">
            Livre, Fixa e Sorteada
          </div>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-3">
          <div className="text-base font-bold text-blue-400 tabular-nums">
            2 Chapas
          </div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">
            Até 3 debateres cada
          </div>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onDownloadTxt}
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-xs sm:text-sm font-bold text-slate-950 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-900/20"
        >
          <Download className="w-4 h-4" />
          <span>Baixar Histórico Bruto em TXT (ATA Oficial)</span>
        </button>

        <button
          onClick={onViewTranscript}
          className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span>Visualizar no Navegador</span>
        </button>

        {isMediator && onReopenDebate && (
          <button
            onClick={onReopenDebate}
            className="text-xs text-slate-400 hover:text-amber-400 underline py-2 px-3"
          >
            Reabrir Debate (Comissão)
          </button>
        )}
      </div>
    </div>
  );
}
