'use client';

import { useState } from 'react';
import { Lock, ShieldAlert, X, ArrowRight } from 'lucide-react';
import { GLOBAL_GATEKEEPER_PASSCODE } from '@/lib/debate-data';

interface PasscodeLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginCredentials: (email: string, password: string, debaterName: string) => Promise<any>;
  onLoginGoogle: () => Promise<any>;
}

export function PasscodeLoginModal({
  isOpen,
  onClose,
  onLoginCredentials,
  onLoginGoogle,
}: PasscodeLoginModalProps) {
  const [globalCode, setGlobalCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [debaterName, setDebaterName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (globalCode.trim() !== GLOBAL_GATEKEEPER_PASSCODE) {
      setErrorMsg('Senha global incorreta.');
      return;
    }

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Informe o e-mail e a senha da chapa.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onLoginCredentials(email, password, debaterName);
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Falha na autenticação da chapa.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsSubmitting(true);
      setErrorMsg('');
      await onLoginGoogle();
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Falha na conexão com Google.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-slate-100">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">
              Acesso das Chapas
            </h3>
            <p className="text-xs text-slate-400">
              Sessão restrita · O público não assiste
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Senha Global de Acesso
            </label>
            <input
              type="password"
              required
              placeholder="Digite a senha de 6 dígitos"
              value={globalCode}
              onChange={(e) => setGlobalCode(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              E-mail da Chapa
            </label>
            <input
              type="email"
              required
              placeholder="seu-email@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Senha da Chapa
            </label>
            <input
              type="password"
              required
              placeholder="Sua senha da chapa"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Nome do(a) Debatedor(a)
            </label>
            <input
              type="text"
              required
              placeholder="Seu nome oficial"
              value={debaterName}
              onChange={(e) => setDebaterName(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 rounded-lg bg-red-950/40 border border-red-900/50 p-2.5 text-xs text-red-300">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-amber-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Verificando...' : 'Entrar no Púlpito'}
          </button>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="w-full mt-2 rounded-lg border border-slate-700 bg-slate-950 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Entrar com Google
          </button>
        </form>
      </div>
    </div>
  );
}
