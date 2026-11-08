'use client';

import { useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { DebaterMember } from '@/hooks/use-debate';

interface SpeechComposerProps {
  debaterProfile: DebaterMember | null;
  activeSpeakerChapaId: string;
  currentRound: number;
  currentTopic: string;
  onSubmitSpeech: (text: string) => Promise<void>;
}

export function SpeechComposer({
  debaterProfile,
  activeSpeakerChapaId,
  currentRound,
  currentTopic,
  onSubmitSpeech,
}: SpeechComposerProps) {
  const [speechText, setSpeechText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If no specific speaker is locked or if it's the debater's chapa turn
  const isMyTurn = debaterProfile && (!activeSpeakerChapaId || debaterProfile.chapaId === activeSpeakerChapaId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!speechText.trim()) return;

    try {
      setIsSubmitting(true);
      await onSubmitSpeech(speechText);
      setSpeechText('');
    } catch (err) {
      console.error('Error submitting speech:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Púlpito de Pronunciamento
          </h3>
        </div>

        {debaterProfile && (
          <span className="text-xs text-amber-400 font-medium">
            {debaterProfile.displayName} ({debaterProfile.chapaName})
          </span>
        )}
      </div>

      {!isMyTurn ? (
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-5 text-center">
          <span className="text-xs text-slate-400">
            Aguardando a vez de fala da sua chapa.
          </span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="text-xs text-slate-300">
            <span className="font-semibold text-white">Tema em debate: </span>
            {currentTopic || 'Tema livre da rodada'}
          </div>

          <div className="relative">
            <textarea
              rows={4}
              value={speechText}
              onChange={(e) => setSpeechText(e.target.value)}
              placeholder="Digite o pronunciamento da sua chapa durante o turno de 2 minutos..."
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />

            <span className="absolute bottom-2 right-2 text-[10px] text-slate-500 tabular-nums">
              {speechText.length} / 4000
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="text-[11px] text-slate-400">
              Turno máximo: 2 minutos por fala
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !speechText.trim()}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition-colors disabled:opacity-40 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Registrando...' : 'Registrar Fala na ATA'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
