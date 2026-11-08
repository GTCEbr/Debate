'use client';

import { useState } from 'react';
import { Download, Copy, Check, X, FileText } from 'lucide-react';
import { generateTranscriptText, downloadTranscriptFile, ExportDebateData } from '@/lib/export-transcript';

interface TranscriptViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  exportData: ExportDebateData;
}

export function TranscriptViewerModal({
  isOpen,
  onClose,
  exportData,
}: TranscriptViewerModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const rawText = generateTranscriptText(exportData);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadTranscriptFile(exportData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative flex flex-col w-full max-w-4xl max-h-[90vh] rounded-xl border border-slate-800 bg-slate-900 shadow-2xl text-slate-100 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-4 sm:px-6">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                ATA Oficial do Debate · Histórico Bruto (TXT)
              </h3>
              <p className="text-[11px] text-slate-400">
                Extração direta dos registros auditados no Firebase Firestore
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar TXT'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar Arquivo .TXT</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Raw text display */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-950">
          <pre className="font-mono text-xs sm:text-[13px] text-slate-300 leading-relaxed whitespace-pre-wrap select-all">
            {rawText}
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-800 px-6 py-3 bg-slate-900 flex items-center justify-between text-xs text-slate-400">
          <span>Total de intervenções catalogadas: {exportData.speeches.length}</span>
          <span className="text-[11px]">Autenticado digitalmente para a Comissão Eleitoral do Grêmio</span>
        </div>
      </div>
    </div>
  );
}
