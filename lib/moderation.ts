/**
 * Automated mediation and filtering for student council democratic debates.
 * Enforces civil discourse, anti-harassment, and respectful decorum.
 */

const BLOCKED_TERMS = [
  // Invectives and ad-hominem insults
  'ladrao', 'ladra', 'ladrão', 'idiota', 'burro', 'burra', 'imbecil', 'otario', 'otária', 'otário',
  'palhaço', 'palhaco', 'palhaça', 'corrupto', 'corrupta', 'mentiroso', 'mentirosa', 'calunia',
  'descarado', 'safado', 'safada', 'vagabundo', 'vagabunda', 'moleque', 'canalha', 'lixo', 'merda',
  'bosta', 'porra', 'caralho', 'filho da puta', 'fdp', 'arrombado', 'babaca', 'escroto', 'escrota',
  'estupido', 'estúpido', 'imbecis', 'cretino', 'retardado', 'desgraçado', 'foda-se', 'fodasse',
  'vsf', 'pqp', 'nazista', 'fascistóide', 'genocida', 'assassino', 'criminoso'
];

export interface ModerationResult {
  isClean: boolean;
  flaggedWords: string[];
  warningReason?: string;
  sanitizedText: string;
  isShouting: boolean;
}

export function moderateSpeech(text: string): ModerationResult {
  if (!text || !text.trim()) {
    return {
      isClean: true,
      flaggedWords: [],
      sanitizedText: '',
      isShouting: false,
    };
  }

  const normalized = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const flaggedWords: string[] = [];

  for (const term of BLOCKED_TERMS) {
    const termNormalized = term
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const regex = new RegExp(`\\b${termNormalized}\\b`, 'gi');
    if (regex.test(normalized)) {
      if (!flaggedWords.includes(term)) {
        flaggedWords.push(term);
      }
    }
  }

  // Check shouting (all caps) if text is long enough
  const lettersOnly = text.replace(/[^a-zA-Z]/g, '');
  const isShouting = lettersOnly.length > 20 && (lettersOnly === lettersOnly.toUpperCase());

  // Mask flagged words in sanitized version
  let sanitized = text;
  for (const word of flaggedWords) {
    const regex = new RegExp(word, 'gi');
    sanitized = sanitized.replace(regex, '***[expressão moderada]***');
  }

  const isClean = flaggedWords.length === 0 && !isShouting;

  let warningReason = undefined;
  if (flaggedWords.length > 0) {
    warningReason = `Termos ofensivos ou ad-hominem detectados: "${flaggedWords.join(', ')}". Mantenha o decoro estudantil.`;
  } else if (isShouting) {
    warningReason = 'Discurso integralmente em caixa alta detectado (grito virtual). O decoro recomenda tom propositivo.';
  }

  return {
    isClean,
    flaggedWords,
    warningReason,
    sanitizedText: sanitized,
    isShouting,
  };
}
