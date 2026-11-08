export interface ExportSpeech {
  id: string;
  round: number;
  roundType: string;
  eixo?: string;
  topic?: string;
  chapaId: string;
  chapaName: string;
  speakerName: string;
  content: string;
  durationSeconds?: number;
  createdAt: string;
  wasModerated?: boolean;
}

export interface ExportDebateData {
  title: string;
  status: string;
  scheduledDate: string;
  chapa1Name: string;
  chapa2Name: string;
  chapa1Members?: string[];
  chapa2Members?: string[];
  lotteryWinner?: string;
  speeches: ExportSpeech[];
}

export function generateTranscriptText(data: ExportDebateData): string {
  const line = '='.repeat(80);
  const subline = '-'.repeat(80);

  const lines: string[] = [];

  lines.push(line);
  lines.push('ATA OFICIAL E HISTÓRICO BRUTO DO DEBATE DO GRÊMIO ESTUDANTIL');
  lines.push('ELEIÇÕES 2026 - GESTÃO ESCOLAR');
  lines.push(line);
  lines.push(`Título: ${data.title}`);
  lines.push(`Data: 08 de Novembro de 2026`);
  lines.push(`Horário: 18:00 às 19:00 (1 hora de duração)`);
  lines.push(`Regulamento: Turnos de 2 minutos (120s) por fala`);
  lines.push(`Limite por Chapa: Até 3 membros debatedores oficiais`);
  lines.push('');
  lines.push('CHAPAS PARTICIPANTES:');
  lines.push(`- CHAPA 1: ${data.chapa1Name}`);
  if (data.chapa1Members && data.chapa1Members.length > 0) {
    lines.push(`  Integrantes: ${data.chapa1Members.join(', ')}`);
  } else {
    lines.push(`  Integrantes: Debatedores credenciados`);
  }
  lines.push(`- CHAPA 2: ${data.chapa2Name}`);
  if (data.chapa2Members && data.chapa2Members.length > 0) {
    lines.push(`  Integrantes: ${data.chapa2Members.join(', ')}`);
  } else {
    lines.push(`  Integrantes: Debatedores credenciados`);
  }

  lines.push('');
  lines.push(`SORTEIO INICIAL:`);
  lines.push(`- Início da fala: ${data.lotteryWinner ? (data.lotteryWinner === 'chapa1' ? data.chapa1Name : data.chapa2Name) : 'Sorteio aleatório ao vivo'}`);
  lines.push('');
  lines.push(subline);
  lines.push('HISTÓRICO CRONOLÓGICO DE TODAS AS FALAS (EXTRAÇÃO DIRETA DO FIREBASE)');
  lines.push(subline);
  lines.push('');

  if (!data.speeches || data.speeches.length === 0) {
    lines.push('(Nenhum pronunciamento registrado durante o período deste debate)');
  } else {
    // Group speeches by round
    const round1 = data.speeches.filter(s => s.round === 1);
    const round2 = data.speeches.filter(s => s.round === 2);
    const round3 = data.speeches.filter(s => s.round === 3);

    if (round1.length > 0) {
      lines.push('=== 1ª RODADA: RODADA LIVRE ===');
      lines.push('Apresentação das chapas, propostas gerais e considerações livres.');
      lines.push('');
      round1.forEach((s, idx) => {
        lines.push(`[FALA ${idx + 1}] ${s.chapaName.toUpperCase()} - Orador(a): ${s.speakerName}`);
        lines.push(`Horário: ${s.createdAt} | Duração: ${s.durationSeconds || 120}s`);
        lines.push(`Discurso:`);
        lines.push(s.content);
        lines.push('');
      });
      lines.push(subline);
    }

    if (round2.length > 0) {
      lines.push('=== 2ª RODADA: TEMAS FIXOS POR EIXO TEMÁTICO ===');
      lines.push('Eixos temáticos: Cultura, Eventos, Democracia, Saúde, Fiscalização Ativa, Esportes, Tecnologia.');
      lines.push('');
      round2.forEach((s, idx) => {
        lines.push(`[FALA ${idx + 1}] ${s.chapaName.toUpperCase()} - Orador(a): ${s.speakerName}`);
        lines.push(`Eixo Temático: ${s.eixo || 'Geral'} | Tema: ${s.topic || 'Tema do Eixo'}`);
        lines.push(`Horário: ${s.createdAt} | Duração: ${s.durationSeconds || 120}s`);
        lines.push(`Discurso:`);
        lines.push(s.content);
        lines.push('');
      });
      lines.push(subline);
    }

    if (round3.length > 0) {
      lines.push('=== 3ª RODADA (FINAL): TEMAS SORTEADOS (50 QUESTÕES) ===');
      lines.push('Perguntas e temas sorteados ao vivo.');
      lines.push('');
      round3.forEach((s, idx) => {
        lines.push(`[FALA ${idx + 1}] ${s.chapaName.toUpperCase()} - Orador(a): ${s.speakerName}`);
        lines.push(`Eixo Temático: ${s.eixo || 'Geral'} | Questão Sorteada: ${s.topic || 'Tema Sorteado'}`);
        lines.push(`Horário: ${s.createdAt} | Duração: ${s.durationSeconds || 120}s`);
        lines.push(`Discurso:`);
        lines.push(s.content);
        lines.push('');
      });
      lines.push(subline);
    }
  }

  lines.push('');
  lines.push(line);
  lines.push('FIM DA TRANSMISSÃO E ENCERRAMENTO REGULAMENTAR');
  lines.push(`Documento extraído do Firebase em: ${new Date().toLocaleString('pt-BR')}`);
  lines.push(line);

  return lines.join('\n');
}

export function downloadTranscriptFile(data: ExportDebateData) {
  const content = generateTranscriptText(data);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `ATA_DEBATE_GREMIO_08112026.txt`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
