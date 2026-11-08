'use client';

import { useState, useEffect, useRef } from 'react';
import { Clock, RotateCcw, Volume2, VolumeX, AlertCircle, CheckCircle, ArrowRightLeft } from 'lucide-react';
import { sound } from '@/lib/audio';
import { TURN_DURATION_SECONDS } from '@/lib/debate-data';

interface TurnTimerProps {
  startedAt: number;
  durationSeconds: number;
  activeSpeakerChapaId: string;
  activeSpeakerName: string;
  chapa1Name: string;
  chapa2Name: string;
  isCurrentUserSpeaker: boolean;
  onConcludeSpeech: () => void;
  onResetTimer?: () => void;
  onHandoffTurn?: (targetChapa: string) => void;
}

export function TurnTimer({
  startedAt,
  durationSeconds = TURN_DURATION_SECONDS,
  activeSpeakerChapaId,
  activeSpeakerName,
  chapa1Name,
  chapa2Name,
  isCurrentUserSpeaker,
  onConcludeSpeech,
  onResetTimer,
  onHandoffTurn,
}: TurnTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(durationSeconds);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const warned30s = useRef(false);
  const warnedExpired = useRef(false);

  useEffect(() => {
    sound.setSoundEnabled(audioEnabled);
  }, [audioEnabled]);

  useEffect(() => {
    warned30s.current = false;
    warnedExpired.current = false;

    if (!activeSpeakerChapaId) {
      return;
    }

    sound.playTurnStart();

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startedAt) / 1000);
      const remaining = Math.max(0, durationSeconds - elapsed);
      setTimeLeft(remaining);

      // 30 seconds alert
      if (remaining === 30 && !warned30s.current) {
        warned30s.current = true;
        sound.playWarning30s();
      }

      // Expired alert
      if (remaining === 0 && !warnedExpired.current) {
        warnedExpired.current = true;
        sound.playTurnExpired();
      }
    }, 250);

    return () => clearInterval(interval);
  }, [startedAt, durationSeconds, activeSpeakerChapaId]);

  const effectiveTime = activeSpeakerChapaId ? timeLeft : durationSeconds;
  const minutes = Math.floor(effectiveTime / 60);
  const seconds = effectiveTime % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progressPercent = Math.max(0, Math.min(100, (effectiveTime / durationSeconds) * 100));

  const isWarning = effectiveTime <= 30 && effectiveTime > 10;
  const isDanger = effectiveTime <= 10;
  const isExpired = effectiveTime === 0;

  const currentChapaName =
    activeSpeakerChapaId === 'chapa1'
      ? chapa1Name
      : activeSpeakerChapaId === 'chapa2'
      ? chapa2Name
      : null;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Cronômetro de Fala (2 min)
          </span>
        </div>

        <button
          onClick={() => setAudioEnabled(!audioEnabled)}
          title={audioEnabled ? 'Desativar avisos sonoros' : 'Ativar avisos sonoros'}
          className="text-slate-400 hover:text-white p-1 rounded transition-colors"
        >
          {audioEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      <div className="py-6 flex flex-col items-center justify-center">
        {/* Speaker Name Header */}
        <div className="mb-2 text-center">
          {activeSpeakerChapaId ? (
            <div className="space-y-1">
              <span
                className={`inline-block text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  activeSpeakerChapaId === 'chapa1'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}
              >
                {currentChapaName}
              </span>
              <h4 className="text-sm font-semibold text-white">
                Na fala: {activeSpeakerName || 'Debatedor da Chapa'}
              </h4>
            </div>
          ) : (
            <span className="text-xs text-slate-400">
              Púlpito em espera · Aguardando orador
            </span>
          )}
        </div>

        {/* Large Digital Clock with Tabular Figures */}
        <div
          className={`font-mono text-5xl sm:text-6xl font-bold tracking-tight tabular-nums transition-colors ${
            isDanger
              ? 'text-red-500 animate-pulse'
              : isWarning
              ? 'text-amber-400'
              : activeSpeakerChapaId
              ? 'text-emerald-400'
              : 'text-slate-500'
          }`}
        >
          {formattedTime}
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-xs mt-4 h-2 rounded-full bg-slate-800 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isDanger
                ? 'bg-red-500'
                : isWarning
                ? 'bg-amber-400'
                : 'bg-emerald-400'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Status text */}
        <div className="mt-3 text-center">
          {isExpired && activeSpeakerChapaId ? (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-red-400">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Tempo de fala de 2min esgotado! Passe a palavra.</span>
            </div>
          ) : isDanger && activeSpeakerChapaId ? (
            <span className="text-xs font-medium text-red-400">
              Últimos 10 segundos! Conclua o raciocínio.
            </span>
          ) : isWarning && activeSpeakerChapaId ? (
            <span className="text-xs text-amber-300">
              Aviso: 30 segundos restantes.
            </span>
          ) : (
            <span className="text-xs text-slate-400">
              {activeSpeakerChapaId ? 'Discurso em andamento' : 'Turno regulamentar de 120s'}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons for debaters */}
      <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
        {isCurrentUserSpeaker && activeSpeakerChapaId ? (
          <button
            onClick={onConcludeSpeech}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition-colors shadow-sm"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Concluir Minha Fala (Passar a Palavra)</span>
          </button>
        ) : null}

        <div className="w-full flex items-center justify-between gap-2">
          {onResetTimer && (
            <button
              onClick={onResetTimer}
              className="flex items-center gap-1.5 rounded border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-[11px] font-medium text-slate-300 hover:text-white hover:bg-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Resetar 2min</span>
            </button>
          )}

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onHandoffTurn && onHandoffTurn('chapa1')}
              className="rounded border border-blue-500/40 bg-blue-950/40 px-2.5 py-1.5 text-[11px] font-medium text-blue-300 hover:bg-blue-900/50"
            >
              Vez Chapa 1
            </button>
            <button
              onClick={() => onHandoffTurn && onHandoffTurn('chapa2')}
              className="rounded border border-amber-500/40 bg-amber-950/40 px-2.5 py-1.5 text-[11px] font-medium text-amber-300 hover:bg-amber-900/50"
            >
              Vez Chapa 2
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
