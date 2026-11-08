import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Debate Grêmio Estudantil',
  description: 'Plataforma oficial de debate ao vivo entre chapas do Grêmio com turnos cronometrados de 2 minutos, sorteio em tempo real, mediação automática e exportação de ata em TXT.',
  openGraph: {
    title: 'Debate Grêmio Estudantil',
    description: 'Plataforma oficial de debate ao vivo entre chapas do Grêmio com turnos cronometrados de 2 minutos, sorteio em tempo real, mediação automática e exportação de ata em TXT.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Debate Grêmio Estudantil',
    description: 'Plataforma oficial de debate ao vivo entre chapas do Grêmio com turnos cronometrados de 2 minutos, sorteio em tempo real, mediação automática e exportação de ata em TXT.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-amber-500/30 selection:text-amber-200">
        {children}
      </body>
    </html>
  );
}
