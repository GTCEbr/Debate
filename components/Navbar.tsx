'use client';

import { LogOut, Lock } from 'lucide-react';
import { DebaterMember, DebateState, ChapaSession } from '@/hooks/use-debate';

interface NavbarProps {
  user: any;
  chapaSession: ChapaSession | null;
  isAuthenticated: boolean;
  debaterProfile: DebaterMember | null;
  debate: DebateState | null;
  onOpenLogin: () => void;
  onOpenTranscript: () => void;
  onLogout: () => void;
  isDebater: boolean;
}

export function Navbar({
  user,
  chapaSession,
  isAuthenticated,
  debaterProfile,
  debate,
  onOpenLogin,
  onOpenTranscript,
  onLogout,
}: NavbarProps) {
  const activeName =
    debaterProfile?.displayName ||
    chapaSession?.debaterName ||
    user?.displayName ||
    'Debatedor';

  const activeChapa =
    debaterProfile?.chapaName ||
    chapaSession?.chapaName ||
    'Chapa Credenciada';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 font-black shadow-md shadow-amber-900/20">
            G
          </div>
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
            Debate Grêmio 2026
          </span>
          <span className="hidden sm:inline-block text-[11px] font-semibold uppercase tracking-wider text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded">
            Sala Fechada
          </span>
        </div>

        {/* Zone 2: Navigation Links (single line, no wrapping) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <a
            href="#pulpito"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Púlpito Ao Vivo
          </a>
          <a
            href="#sorteio"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Sorteio em Tempo Real
          </a>
          <a
            href="#rodadas"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Eixos & Temas
          </a>
          <button
            onClick={onOpenTranscript}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 text-left"
          >
            Histórico & ATA (TXT)
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action Area */}
        <div className="flex items-center gap-3 shrink-0">
          {!isAuthenticated ? (
            <button
              onClick={onOpenLogin}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-400 transition-colors whitespace-nowrap shadow-sm"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Entrar no Debate</span>
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-200 truncate max-w-[140px]">
                  {activeName}
                </span>
                <span className="text-[10px] text-amber-400">
                  {activeChapa}
                </span>
              </div>
              <button
                onClick={onLogout}
                title="Sair da sala de debate"
                className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
