'use client';

import { Users, Award, Shield, CheckCircle, Volume2, Mic } from 'lucide-react';
import { DebateState, DebaterMember, SpeechRecord } from '@/hooks/use-debate';
import { TurnTimer } from './TurnTimer';

interface DebateStageProps {
  debate: DebateState | null;
  debaters: DebaterMember[];
  chapa1Members: DebaterMember[];
  chapa2Members: DebaterMember[];
  speeches: SpeechRecord[];
  isCurrentUserSpeaker: boolean;
  onConcludeSpeech: () => void;
  onResetTimer: () => void;
  onHandoffTurn: (targetChapa: string) => void;
  onSelectSpeaker: (chapaId: string, debaterName: string) => void;
}

export function DebateStage({
  debate,
  debaters,
  chapa1Members,
  chapa2Members,
  speeches,
  isCurrentUserSpeaker,
  onConcludeSpeech,
  onResetTimer,
  onHandoffTurn,
  onSelectSpeaker,
}: DebateStageProps) {
  const chapa1Name = debate?.chapa1Name || 'Chapa Vincere';
  const chapa2Name = debate?.chapa2Name || 'Chapa Aegre';
  const activeSpeakerChapaId = debate?.activeSpeakerChapaId || '';
  const isChapa1Speaking = activeSpeakerChapaId === 'chapa1';
  const isChapa2Speaking = activeSpeakerChapaId === 'chapa2';

  return (
    <div id="pulpito" className="space-y-6">
      {/* STAGE HEADER: CURRENT ROUND & TOPIC */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
              <span>{debate?.roundName || '1ª Rodada: Livre'}</span>
              <span>·</span>
              <span>Eixo: {debate?.currentEixo || 'Apresentação'}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {debate?.currentTopic || 'Tema livre da rodada: Apresentação e considerações iniciais'}
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-slate-200">Sessão Ativa</span>
            <span>·</span>
            <span>Turnos de 2 minutos</span>
          </div>
        </div>
      </div>

      {/* 3-COLUMN STAGE: CHAPA 1 PODIUM - CENTER TIMER - CHAPA 2 PODIUM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* PODIUM 1: CHAPA 1 */}
        <div
          className={`lg:col-span-3 rounded-xl border p-5 flex flex-col justify-between transition-all duration-300 ${
            isChapa1Speaking
              ? 'border-blue-500 bg-blue-950/20 shadow-xl shadow-blue-900/20 ring-1 ring-blue-500'
              : 'border-slate-800 bg-slate-900/60'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Púlpito Azul
              </span>
              {isChapa1Speaking && (
                <div className="flex items-center gap-1 text-[11px] font-semibold text-blue-400 animate-pulse">
                  <Mic className="w-3.5 h-3.5" />
                  <span>Na Palavra</span>
                </div>
              )}
            </div>

            <h3 className="text-base font-bold text-white mb-1">
              {chapa1Name}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Debatedores ({chapa1Members.length}/3)
            </p>

            {/* Debaters list */}
            <div className="space-y-2">
              {chapa1Members.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-800 p-3 text-center text-xs text-slate-500">
                  Nenhum debatedor registrado ainda.
                </div>
              ) : (
                chapa1Members.map((member) => (
                  <div
                    key={member.userId}
                    className="flex items-center justify-between rounded-lg border border-slate-800/80 bg-slate-950/50 p-2.5 text-xs text-slate-200"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                      <span className="font-medium truncate max-w-[120px]">
                        {member.displayName}
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectSpeaker('chapa1', member.displayName)}
                      className="text-[10px] text-blue-400 hover:text-blue-300 underline"
                    >
                      Assumir Fala
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>Máximo: 3 debatedores</span>
            <span className="font-mono">{chapa1Members.length} / 3</span>
          </div>
        </div>

        {/* CENTER: TURN TIMER (2 MINUTES) */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <TurnTimer
            startedAt={debate?.turnStartedAt || 0}
            durationSeconds={debate?.turnDurationSeconds || 120}
            activeSpeakerChapaId={debate?.activeSpeakerChapaId || ''}
            activeSpeakerName={debate?.activeSpeakerName || ''}
            chapa1Name={chapa1Name}
            chapa2Name={chapa2Name}
            isCurrentUserSpeaker={isCurrentUserSpeaker}
            onConcludeSpeech={onConcludeSpeech}
            onResetTimer={onResetTimer}
            onHandoffTurn={onHandoffTurn}
          />
        </div>

        {/* PODIUM 2: CHAPA 2 */}
        <div
          className={`lg:col-span-3 rounded-xl border p-5 flex flex-col justify-between transition-all duration-300 ${
            isChapa2Speaking
              ? 'border-amber-500 bg-amber-950/20 shadow-xl shadow-amber-900/20 ring-1 ring-amber-500'
              : 'border-slate-800 bg-slate-900/60'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Púlpito Âmbar
              </span>
              {isChapa2Speaking && (
                <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 animate-pulse">
                  <Mic className="w-3.5 h-3.5" />
                  <span>Na Palavra</span>
                </div>
              )}
            </div>

            <h3 className="text-base font-bold text-white mb-1">
              {chapa2Name}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Debatedores ({chapa2Members.length}/3)
            </p>

            {/* Debaters list */}
            <div className="space-y-2">
              {chapa2Members.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-800 p-3 text-center text-xs text-slate-500">
                  Nenhum debatedor registrado ainda.
                </div>
              ) : (
                chapa2Members.map((member) => (
                  <div
                    key={member.userId}
                    className="flex items-center justify-between rounded-lg border border-slate-800/80 bg-slate-950/50 p-2.5 text-xs text-slate-200"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="font-medium truncate max-w-[120px]">
                        {member.displayName}
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectSpeaker('chapa2', member.displayName)}
                      className="text-[10px] text-amber-400 hover:text-amber-300 underline"
                    >
                      Assumir Fala
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>Máximo: 3 debatedores</span>
            <span className="font-mono">{chapa2Members.length} / 3</span>
          </div>
        </div>
      </div>

      {/* RECENT SPEECHES TRANSCRIPT FEED */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Histórico das Falas Registradas ({speeches.length})
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Gravação direta no Firebase
          </span>
        </div>

        {speeches.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            Nenhuma fala registrada até o momento. O debate aguarda o primeiro orador.
          </div>
        ) : (
          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
            {speeches.map((sp) => {
              const isChapa1 = sp.chapaId === 'chapa1';
              return (
                <div
                  key={sp.id}
                  className="rounded-lg border border-slate-800/80 bg-slate-950/70 p-4 transition-colors hover:border-slate-700"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          isChapa1
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {sp.chapaName}
                      </span>
                      <span className="text-xs font-semibold text-white">
                        {sp.speakerName}
                      </span>
                      <span className="text-slate-500 text-xs">·</span>
                      <span className="text-xs text-slate-400">
                        {sp.round}ª Rodada ({sp.roundType})
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500">
                      <span>Duração: {sp.durationSeconds || 120}s</span>
                    </div>
                  </div>

                  {sp.topic && (
                    <div className="text-[11px] text-amber-400/90 font-medium mb-1.5">
                      Pauta: {sp.topic}
                    </div>
                  )}

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {sp.content}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
