export interface TopicItem {
  id: number;
  eixo: string;
  eixoIcon: string;
  title: string;
  description: string;
}

export const ROUND_2_FIXED_EIXOS = [
  { id: 'cultura', name: 'Cultura', icon: 'palette', description: 'Artes, literatura, patrimônio e diversidade cultural na escola.' },
  { id: 'eventos', name: 'Eventos', icon: 'party-popper', description: 'Festividades, sustentabilidade, inclusão e integração estudantil.' },
  { id: 'democracia', name: 'Democracia', icon: 'vote', description: 'Participação, transparência, grêmio, assembleias e representatividade.' },
  { id: 'saude', name: 'Saúde', icon: 'heart-pulse', description: 'Saúde mental, dignidade menstrual, cantina e primeiros socorros.' },
  { id: 'fiscalizacao', name: 'Fiscalização Ativa', icon: 'search-check', description: 'Infraestrutura, merenda, laboratórios e contas do Grêmio.' },
  { id: 'esportes', name: 'Esportes', icon: 'trophy', description: 'Inclusão esportiva, igualdade de gênero, torneios e esports.' },
  { id: 'tecnologia', name: 'Tecnologia', icon: 'laptop', description: 'IA na educação, uso de celular, fake news e inclusão digital.' },
];

export const ROUND_3_DRAWN_TOPICS: TopicItem[] = [
  // Eixo 1: Cultura
  {
    id: 1,
    eixo: 'Cultura',
    eixoIcon: 'palette',
    title: 'Combate à evasão cultural',
    description: 'Como aproximar os estudantes de museus, teatros e cinemas locais?'
  },
  {
    id: 2,
    eixo: 'Cultura',
    eixoIcon: 'palette',
    title: 'Espaço para arte urbana',
    description: 'A viabilidade e a regulamentação do grafite e do muralismo nos muros da escola.'
  },
  {
    id: 3,
    eixo: 'Cultura',
    eixoIcon: 'palette',
    title: 'Representatividade na literatura',
    description: 'A inclusão obrigatória de autores negros, indígenas e LGBTQIA+ na biblioteca escolar.'
  },
  {
    id: 4,
    eixo: 'Cultura',
    eixoIcon: 'palette',
    title: 'Cultura digital vs. tradicional',
    description: 'O impacto do TikTok e das redes sociais na perda do hábito de leitura dos jovens.'
  },
  {
    id: 5,
    eixo: 'Cultura',
    eixoIcon: 'palette',
    title: 'Valorização da cultura local',
    description: 'Como resgatar o folclore e a história do bairro/município dentro da comunidade escolar.'
  },
  {
    id: 6,
    eixo: 'Cultura',
    eixoIcon: 'palette',
    title: 'Mostras independentes',
    description: 'Incentivo à produção de curtas-metragens e podcasts autorais feitos por alunos.'
  },
  {
    id: 7,
    eixo: 'Cultura',
    eixoIcon: 'palette',
    title: 'Patrimônio escolar',
    description: 'Campanhas de conscientização para evitar o vandalismo contra carteiras e paredes da escola.'
  },

  // Eixo 2: Eventos
  {
    id: 8,
    eixo: 'Eventos',
    eixoIcon: 'party-popper',
    title: 'Inclusão em festas escolares',
    description: 'Como garantir que eventos e formaturas sejam financeiramente acessíveis para todos os alunos.'
  },
  {
    id: 9,
    eixo: 'Eventos',
    eixoIcon: 'party-popper',
    title: 'Sustentabilidade em grandes eventos',
    description: 'Redução drástica do uso de plásticos descartáveis em feiras de ciências e festas juninas.'
  },
  {
    id: 10,
    eixo: 'Eventos',
    eixoIcon: 'party-popper',
    title: 'Feira de profissões descentralizada',
    description: 'Trazer profissionais de áreas técnicas e operacionais, e não apenas de cursos universitários tradicionais.'
  },
  {
    id: 11,
    eixo: 'Eventos',
    eixoIcon: 'party-popper',
    title: 'Festivais de talentos inclusivos',
    description: 'Como abrir espaço para alunos neuroatípicos ou com deficiência se apresentarem de forma confortável.'
  },
  {
    id: 12,
    eixo: 'Eventos',
    eixoIcon: 'party-popper',
    title: 'Campanhas de arrecadação',
    description: 'O papel do Grêmio na organização de eventos focados em ajudar famílias vulneráveis da comunidade ao redor.'
  },
  {
    id: 13,
    eixo: 'Eventos',
    eixoIcon: 'party-popper',
    title: 'Intercâmbio entre escolas',
    description: 'Organização de gincanas e eventos culturais em parceria com outras escolas da região.'
  },

  // Eixo 3: Democracia
  {
    id: 14,
    eixo: 'Democracia',
    eixoIcon: 'vote',
    title: 'Voto aos 16 anos',
    description: 'Como a escola pode incentivar a emissão do título de eleitor e a conscientização política.'
  },
  {
    id: 15,
    eixo: 'Democracia',
    eixoIcon: 'vote',
    title: 'Transparência na gestão escolar',
    description: 'A criação de canais diretos para que alunos possam opinar na aplicação de verbas da escola.'
  },
  {
    id: 16,
    eixo: 'Democracia',
    eixoIcon: 'vote',
    title: 'Liberdade de expressão vs. Discurso de ódio',
    description: 'Os limites da opinião dos estudantes nos grupos de WhatsApp da escola.'
  },
  {
    id: 17,
    eixo: 'Democracia',
    eixoIcon: 'vote',
    title: 'Combate ao bullying e cyberbullying',
    description: 'Criação de comissões de mediação de conflitos formadas por alunos.'
  },
  {
    id: 18,
    eixo: 'Democracia',
    eixoIcon: 'vote',
    title: 'Coletivos estudantis',
    description: 'O direito e a importância de criar coletivos (feministas, antirracistas, etc.) independentes do Grêmio.'
  },
  {
    id: 19,
    eixo: 'Democracia',
    eixoIcon: 'vote',
    title: 'Assembleias gerais eficazes',
    description: 'Estratégias para aumentar a participação dos alunos nas decisões, combatendo a apatia estudantil.'
  },
  {
    id: 20,
    eixo: 'Democracia',
    eixoIcon: 'vote',
    title: 'Diversidade nos cargos de liderança',
    description: 'Como garantir a presença de minorias na própria chapa do Grêmio e nas lideranças de sala.'
  },

  // Eixo 4: Saúde
  {
    id: 21,
    eixo: 'Saúde',
    eixoIcon: 'heart-pulse',
    title: 'Saúde mental em foco',
    description: 'Como a escola e o Grêmio podem lidar com a ansiedade e a pressão pré-vestibular/provas.'
  },
  {
    id: 22,
    eixo: 'Saúde',
    eixoIcon: 'heart-pulse',
    title: 'Educação sexual e prevenção',
    description: 'Campanhas de conscientização sobre ISTs e gravidez na adolescência sem tabus.'
  },
  {
    id: 23,
    eixo: 'Saúde',
    eixoIcon: 'heart-pulse',
    title: 'Dignidade menstrual',
    description: 'Distribuição gratuita de absorventes nos banheiros da escola para combater a pobreza menstrual.'
  },
  {
    id: 24,
    eixo: 'Saúde',
    eixoIcon: 'heart-pulse',
    title: 'Alimentação saudável na cantina',
    description: 'Regulação ou conscientização sobre a venda de ultraprocessados no ambiente escolar.'
  },
  {
    id: 25,
    eixo: 'Saúde',
    eixoIcon: 'heart-pulse',
    title: 'Ergonomia e carga pesada',
    description: 'O impacto do peso das mochilas e do tempo sentado na saúde física dos estudantes.'
  },
  {
    id: 26,
    eixo: 'Saúde',
    eixoIcon: 'heart-pulse',
    title: 'Primeiros socorros',
    description: 'Obrigatoriedade de treinamentos básicos para alunos e funcionários em casos de emergência.'
  },
  {
    id: 27,
    eixo: 'Saúde',
    eixoIcon: 'heart-pulse',
    title: 'Sono e rendimento escolar',
    description: 'O debate sobre o horário de início das aulas no período matutino e a privação de sono dos jovens.'
  },

  // Eixo 5: Fiscalização Ativa
  {
    id: 28,
    eixo: 'Fiscalização Ativa',
    eixoIcon: 'search-check',
    title: 'Infraestrutura e acessibilidade',
    description: 'Fiscalização da acessibilidade da escola para alunos com mobilidade reduzida ou deficiência visual/auditiva.'
  },
  {
    id: 29,
    eixo: 'Fiscalização Ativa',
    eixoIcon: 'search-check',
    title: 'Qualidade da merenda',
    description: 'Criação de uma comissão de alunos para fiscalizar o cardápio, a higiene e o desperdício de comida.'
  },
  {
    id: 30,
    eixo: 'Fiscalização Ativa',
    eixoIcon: 'search-check',
    title: 'Manutenção de laboratórios e computadores',
    description: 'Cobrança ativa para que as salas de tecnologia e ciências funcionem de verdade.'
  },
  {
    id: 31,
    eixo: 'Fiscalização Ativa',
    eixoIcon: 'search-check',
    title: 'Segurança no entorno escolar',
    description: 'Fiscalização e cobrança às autoridades sobre a iluminação e o policiamento na entrada e saída das aulas.'
  },
  {
    id: 32,
    eixo: 'Fiscalização Ativa',
    eixoIcon: 'search-check',
    title: 'Cumprimento do Estatuto do Estudante',
    description: 'Como o Grêmio pode garantir que os direitos dos alunos (como revisão de prova e respeito) sejam cumpridos.'
  },
  {
    id: 33,
    eixo: 'Fiscalização Ativa',
    eixoIcon: 'search-check',
    title: 'Auditoria de contas do Grêmio',
    description: 'A importância de prestar contas mensalmente para os estudantes para evitar desconfianças.'
  },

  // Eixo 6: Esportes
  {
    id: 34,
    eixo: 'Esportes',
    eixoIcon: 'trophy',
    title: 'Igualdade de gênero no esporte',
    description: 'Garantia de mesmo tempo de quadra, investimentos e campeonatos para as modalidades masculinas e femininas.'
  },
  {
    id: 35,
    eixo: 'Esportes',
    eixoIcon: 'trophy',
    title: 'Esports na escola',
    description: 'A inclusão e regulamentação de campeonatos de jogos eletrônicos (Free Fire, LoL, FC) organizados pelo Grêmio.'
  },
  {
    id: 36,
    eixo: 'Esportes',
    eixoIcon: 'trophy',
    title: 'Esporte como inclusão',
    description: 'Adaptação de práticas esportivas para que alunos que não têm aptidão física ou têm deficiência participem ativamente.'
  },
  {
    id: 37,
    eixo: 'Esportes',
    eixoIcon: 'trophy',
    title: 'Torcidas organizadas escolares',
    description: 'Como incentivar o apoio aos times da escola proibindo cantos ofensivos e violência.'
  },
  {
    id: 38,
    eixo: 'Esportes',
    eixoIcon: 'trophy',
    title: 'Além do futebol e vôlei',
    description: 'Introdução de modalidades alternativas na escola (como xadrez, tênis de mesa, handebol ou basquete 3x3).'
  },
  {
    id: 39,
    eixo: 'Esportes',
    eixoIcon: 'trophy',
    title: 'Sedentarismo juvenil',
    description: 'Como o esporte escolar pode combater o vício em telas e o isolamento dos estudantes.'
  },

  // Eixo 7: Tecnologia
  {
    id: 40,
    eixo: 'Tecnologia',
    eixoIcon: 'laptop',
    title: 'Uso de Inteligência Artificial',
    description: 'Regras e ética para o uso do ChatGPT e outras IAs na realização de trabalhos escolares.'
  },
  {
    id: 41,
    eixo: 'Tecnologia',
    eixoIcon: 'laptop',
    title: 'Celular em sala de aula',
    description: 'Proibição total, uso livre ou regulamentação pedagógica? Qual o papel do estudante nesse debate.'
  },
  {
    id: 42,
    eixo: 'Tecnologia',
    eixoIcon: 'laptop',
    title: 'Letramento digital e Fake News',
    description: 'Projetos para ensinar os alunos a identificarem notícias falsas e golpes na internet.'
  },
  {
    id: 43,
    eixo: 'Tecnologia',
    eixoIcon: 'laptop',
    title: 'Inclusão digital interna',
    description: 'Como ajudar alunos que não possuem internet estável ou computador em casa a entregarem trabalhos virtuais.'
  },
  {
    id: 44,
    eixo: 'Tecnologia',
    eixoIcon: 'laptop',
    title: 'Pegada de carbono digital',
    description: 'Conscientização sobre o lixo eletrônico gerado pelo descarte incorreto de celulares e computadores na comunidade.'
  },
  {
    id: 45,
    eixo: 'Tecnologia',
    eixoIcon: 'laptop',
    title: 'Presença digital do Grêmio',
    description: 'O uso de canais oficiais (Instagram/TikTok) para além do entretenimento, focando em informação e serviços úteis.'
  },

  // Eixo 8: Temas Interdisciplinares / Futuro e Sociedade
  {
    id: 46,
    eixo: 'Temas Interdisciplinares / Futuro e Sociedade',
    eixoIcon: 'globe',
    title: 'Projeto de Vida e Empreendedorismo',
    description: 'Como a escola pode preparar o aluno para o mercado de trabalho atual (home office, economia gig).'
  },
  {
    id: 47,
    eixo: 'Temas Interdisciplinares / Futuro e Sociedade',
    eixoIcon: 'globe',
    title: 'Mudanças climáticas no dia a dia',
    description: 'A criação de hortas escolares e sistemas de captação de água da chuva geridos por alunos.'
  },
  {
    id: 48,
    eixo: 'Temas Interdisciplinares / Futuro e Sociedade',
    eixoIcon: 'globe',
    title: 'Resolução de conflitos sem punição',
    description: 'Trocar a suspensão tradicional por práticas de justiça restaurativa e conversas mediadas.'
  },
  {
    id: 49,
    eixo: 'Temas Interdisciplinares / Futuro e Sociedade',
    eixoIcon: 'globe',
    title: 'Orientação Vocacional precoce',
    description: 'O papel do Grêmio em cobrar suporte psicológico e testes de aptidão antes do último ano do Ensino Médio.'
  },
  {
    id: 50,
    eixo: 'Temas Interdisciplinares / Futuro e Sociedade',
    eixoIcon: 'globe',
    title: 'O Grêmio do Futuro',
    description: 'Como garantir o legado da chapa atual para que a próxima gestão não comece o trabalho do zero.'
  }
];

export const GLOBAL_GATEKEEPER_PASSCODE = '081126';
export const ADMIN_EMAIL = 'lucianesilvadeoliveira76@gmail.com';
export const TURN_DURATION_SECONDS = 120; // 2 minutes

export const CHAPA_CREDENTIALS = {
  chapa1: {
    id: 'chapa1',
    name: 'Chapa Vincere',
    email: 'vincerechapa@gmail.com',
    defaultPassword: 'vincere081126',
    color: 'blue',
  },
  chapa2: {
    id: 'chapa2',
    name: 'Chapa Aegre',
    email: 'chapaaegre@gmail.com',
    defaultPassword: 'aegre081126',
    color: 'amber',
  },
  mediador: {
    id: 'mediador',
    name: 'Comissão Eleitoral / Mediador',
    email: 'lucianesilvadeoliveira76@gmail.com',
    defaultPassword: 'mediador081126',
    color: 'emerald',
  },
};

