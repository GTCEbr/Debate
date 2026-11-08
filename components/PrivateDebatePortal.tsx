'use client';

import { useState } from 'react';
import { Lock, ShieldAlert, ArrowRight, EyeOff, ShieldCheck } from 'lucide-react';
import { GLOBAL_GATEKEEPER_PASSCODE } from '@/lib/debate-data';

interface PrivateDebatePortalProps {
  onLoginCredentials: (email: string, password: string, debaterName: string) => Promise<any>;
  onLoginGoogle: () => Promise<any>;
}

export function PrivateDebatePortal({
  onLoginCredentials,
  onLoginGoogle,
}: PrivateDebatePortalProps) {
  const [globalCode, setGlobalCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [debaterName, setDebaterName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (globalCode.trim() !== GLOBAL_GATEKEEPER_PASSCODE) {
      setErrorMsg('Código global de acesso inválido.');
      return;
    }

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Informe o e-mail e a senha da chapa.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onLoginCredentials(email, password, debaterName);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Credenciais inválidas. Verifique os dados informados.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsSubmitting(true);
      setErrorMsg('');
      await onLoginGoogle();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Falha no login com Google.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="w-full max-w-md z-10">
        {/* Notice Badge: Public Does Not Watch */}
        <div className="mb-6 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-950/40 px-3.5 py-1.5 text-xs font-semibold text-amber-300">
            <EyeOff className="w-3.5 h-3.5 text-amber-400" />
            <span>Sala Fechada · O público não assiste</span>
          </div>
        </div>

        {/* Portal Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/95 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Debate do Grêmio Estudantil 2026
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
              Área de acesso restrito aos debatedores credenciados. Insira suas credenciais oficiais para entrar.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 1. Global Security Passcode */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Senha Global de Acesso
              </label>
              <input
                type="password"
                required
                placeholder="Insira a senha de 6 dígitos"
                value={globalCode}
                onChange={(e) => setGlobalCode(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* 2. Chapa Email */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                E-mail da Chapa
              </label>
              <input
                type="email"
                required
                placeholder="exemplo@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* 3. Chapa Password */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Senha da Chapa
              </label>
              <input
                type="password"
                required
                placeholder="Insira a senha da chapa"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* 4. Debater Name */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Nome do(a) Debatedor(a) (Até 3 por chapa)
              </label>
              <input
                type="text"
                required
                placeholder="Seu nome"
                value={debaterName}
                onChange={(e) => setDebaterName(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 rounded-lg bg-red-950/40 border border-red-900/50 p-3 text-xs text-red-300">
                <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-xs sm:text-sm font-bold text-slate-950 hover:bg-amber-400 transition-all shadow-lg shadow-amber-950/20 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Verificando...' : 'Entrar no Púlpito'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Alternative: Google Login */}
          <div className="mt-5 pt-4 border-t border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 block mb-3">
              Ou acesse com a conta Google da chapa:
            </span>

            <button
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-950 py-2.5 text-xs font-medium text-slate-200 hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Conectar com Conta Google</span>
            </button>
          </div>
        </div>

        <div className="mt-4 text-center text-[11px] text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Sessão autenticada e auditada no Firebase</span>
        </div>
      </div>
    </div>
  );
}
