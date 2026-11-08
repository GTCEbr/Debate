'use client';

import { useState } from 'react';
import { Layers } from 'lucide-react';
import { ROUND_2_FIXED_EIXOS, ROUND_3_DRAWN_TOPICS, TopicItem } from '@/lib/debate-data';

interface RoundsTrackerProps {
  currentRound: number;
  currentEixo: string;
  currentTopic: string;
  onSelectRound: (roundNum: number, roundName: string, eixo?: string, topic?: string) => void;
  onSelectTopic: (topic: TopicItem) => void;
}

export function RoundsTracker({
  currentRound,
  currentEixo,
  currentTopic,
  onSelectRound,
  onSelectTopic,
}: RoundsTrackerProps) {
  const [activeTab, setActiveTab] = useState<'round1' | 'round2' | 'round3'>('round2');
  const [selectedEixoFilter, setSelectedEixoFilter] = useState<string>('all');

  const filteredTopics =
    selectedEixoFilter === 'all'
      ? ROUND_3_DRAWN_TOPICS
      : ROUND_3_DRAWN_TOPICS.filter((t) => t.eixo.toLowerCase().includes(selectedEixoFilter.toLowerCase()));

  return (
    <div id="rodadas" className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Estrutura das Rodadas & Eixos Temáticos
          </h3>
        </div>

        <span className="text-xs text-amber-400 font-medium">
          Rodada Atual: {currentRound}ª
        </span>
      </div>

      {/* ROUND SELECTION TABS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {/* TAB 1 */}
        <button
          onClick={() => setActiveTab('round1')}
          className={`flex flex-col items-start p-3.5 rounded-lg border text-left transition-all ${
            activeTab === 'round1'
              ? 'border-amber-500 bg-amber-950/20 shadow-md'
              : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              1ª Rodada
            </span>
            {currentRound === 1 && (
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            )}
          </div>
          <span className="text-sm font-semibold text-white">Rodada Livre</span>
          <span className="text-xs text-slate-400 mt-0.5">
            Apresentação das chapas, propostas livres e considerações iniciais.
          </span>

          <div
            onClick={(e) => {
              e.stopPropagation();
              onSelectRound(1, '1ª Rodada: Livre', 'Considerações Iniciais', 'Apresentação e Propostas Livres');
            }}
            className="mt-2.5 text-[10px] text-amber-400 hover:text-amber-300 font-semibold underline"
          >
            Iniciar 1ª Rodada
          </div>
        </button>

        {/* TAB 2 */}
        <button
          onClick={() => setActiveTab('round2')}
          className={`flex flex-col items-start p-3.5 rounded-lg border text-left transition-all ${
            activeTab === 'round2'
              ? 'border-amber-500 bg-amber-950/20 shadow-md'
              : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              2ª Rodada
            </span>
            {currentRound === 2 && (
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            )}
          </div>
          <span className="text-sm font-semibold text-white">Temas Fixos (7 Eixos)</span>
          <span className="text-xs text-slate-400 mt-0.5">
            Cultura, Eventos, Democracia, Saúde, Fiscalização, Esportes e Tecnologia.
          </span>

          <div
            onClick={(e) => {
              e.stopPropagation();
              onSelectRound(2, '2ª Rodada: Temas Fixos', 'Cultura', 'Debate sobre os 7 Eixos Estratégicos');
            }}
            className="mt-2.5 text-[10px] text-amber-400 hover:text-amber-300 font-semibold underline"
          >
            Iniciar 2ª Rodada
          </div>
        </button>

        {/* TAB 3 */}
        <button
          onClick={() => setActiveTab('round3')}
          className={`flex flex-col items-start p-3.5 rounded-lg border text-left transition-all ${
            activeTab === 'round3'
              ? 'border-amber-500 bg-amber-950/20 shadow-md'
              : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              3ª Rodada (Final)
            </span>
            {currentRound === 3 && (
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            )}
          </div>
          <span className="text-sm font-semibold text-white">Temas Sorteados (50 Questões)</span>
          <span className="text-xs text-slate-400 mt-0.5">
            Sorteio ao vivo de perguntas com réplicas e tréplicas.
          </span>

          <div
            onClick={(e) => {
              e.stopPropagation();
              onSelectRound(3, '3ª Rodada (Final): Temas Sorteados', 'Temas Sorteados', 'Perguntas Sorteadas ao Vivo');
            }}
            className="mt-2.5 text-[10px] text-amber-400 hover:text-amber-300 font-semibold underline"
          >
            Iniciar 3ª Rodada
          </div>
        </button>
      </div>

      {/* CONTENT FOR TAB 1: LIVRE */}
      {activeTab === 'round1' && (
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
          <h4 className="text-sm font-semibold text-white mb-2">
            Regras da 1ª Rodada: Apresentação e Propostas Gerais
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            Cada chapa dispõe de turnos alternados de 2 minutos para apresentar seus membros oficiais (até 3 debatedores), valores, visão de gestão e principais bandeiras eleitorais.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-400">
            <div className="rounded border border-slate-800/80 bg-slate-900/60 p-3">
              <span className="font-semibold text-white">Foco:</span>
              <p className="mt-1">
                Apresentação da chapa, plano de gestão e prioridades para a escola.
              </p>
            </div>
            <div className="rounded border border-slate-800/80 bg-slate-900/60 p-3">
              <span className="font-semibold text-white">Ordem inicial:</span>
              <p className="mt-1">
                Definida pelo sorteio aleatório ao vivo no painel de sorteio.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CONTENT FOR TAB 2: TEMAS FIXOS (7 EIXOS) */}
      {activeTab === 'round2' && (
        <div className="space-y-3">
          <p className="text-xs text-slate-400">
            Na 2ª Rodada, os debatedores abordam os 7 eixos prioritários definidos no regimento:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ROUND_2_FIXED_EIXOS.map((eixo, idx) => (
              <div
                key={eixo.id}
                className="rounded-lg border border-slate-800 bg-slate-950/60 p-3.5 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-amber-400">
                    Eixo {idx + 1}
                  </span>
                  <button
                    onClick={() =>
                      onSelectRound(
                        2,
                        '2ª Rodada: Temas Fixos',
                        eixo.name,
                        `Debate sobre o Eixo: ${eixo.name}`
                      )
                    }
                    className="text-[10px] text-amber-400 hover:text-amber-300 underline font-medium"
                  >
                    Pautar
                  </button>
                </div>
                <h5 className="text-sm font-bold text-white mb-1">
                  {eixo.name}
                </h5>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {eixo.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONTENT FOR TAB 3: TEMAS SORTEADOS (50 QUESTÕES) */}
      {activeTab === 'round3' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-slate-400">
              Banco oficial de 50 temas da rodada final (divididos em 8 eixos temáticos):
            </span>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-1">
              {['all', 'Cultura', 'Eventos', 'Democracia', 'Saúde', 'Fiscalização', 'Esportes', 'Tecnologia', 'Futuro'].map(
                (filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedEixoFilter(filter)}
                    className={`px-2 py-0.5 text-[10px] font-medium rounded transition-colors ${
                      selectedEixoFilter === filter
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'border border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    {filter === 'all' ? 'Todos (50)' : filter}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
            {filteredTopics.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-slate-800/80 bg-slate-950/60 p-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-semibold text-amber-400">
                    {item.eixo} · Questão {item.id}
                  </span>
                  <button
                    onClick={() => onSelectTopic(item)}
                    className="text-[10px] text-amber-400 hover:text-amber-300 underline font-medium"
                  >
                    Pautar Esta
                  </button>
                </div>

                <h6 className="text-xs font-bold text-white mb-1">
                  {item.title}
                </h6>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
