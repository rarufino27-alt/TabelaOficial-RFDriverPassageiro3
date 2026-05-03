import type { BibleReference, ScriptureAnalysis } from "@/types/content";

/* ============================================================
   Analisador semântico simulado.
   Lê o texto bíblico real selecionado, extrai palavras-chave
   relevantes, identifica tema central e gera insights.
   ============================================================ */

const STOPWORDS = new Set<string>([
  "a","o","e","de","da","do","das","dos","em","no","na","nos","nas","um","uma","uns","umas",
  "que","se","por","para","com","sem","sobre","ao","à","aos","às","mas","ou","como","seu","sua","seus","suas",
  "ele","ela","eles","elas","isso","este","esta","esse","essa","aquilo","aquele","aquela","tu","te","ti","vos","nos",
  "meu","minha","meus","minhas","teu","tua","seus","seu","sua","ser","é","são","foi","foram","será","tem","têm","tinha",
  "ainda","antes","depois","quando","onde","então","muito","mais","menos","já","também","porque","pois","pela","pelo","pelas","pelos",
  "não","sim","só","todo","toda","todos","todas","cada","quem","qual","quais","de","entre","até","sob","após","contra",
  "estar","estou","está","estão","esteve","estava","ter","ter","houve","havia","haverá","ir","vai","vão","veio","vieram",
  "lhe","lhes","seu","disse","diz","disse","dizia","fez","fazer","faça","faz","seja","sejam","sois",
]);

const KEYWORD_FAMILIES: Record<string, string[]> = {
  graça: ["graça", "favor", "misericórdia", "perdão", "perdoado", "perdoa", "perdoar", "compaixão"],
  fé: ["fé", "crer", "crendo", "crente", "crido", "creia", "confiança", "confiar"],
  esperança: ["esperança", "esperar", "esperamos", "porvir", "futuro", "promessa", "prometeu", "prometido"],
  amor: ["amor", "amado", "amada", "amou", "amados", "ama", "amando", "querido"],
  salvação: ["salvação", "salvo", "salvos", "salvar", "salvador", "redimido", "redenção", "remido"],
  santidade: ["santo", "santa", "santos", "santidade", "consagrado", "puro", "pura"],
  paz: ["paz", "tranquilo", "tranquilas", "repousa", "descanso", "consola", "consolam", "sossego"],
  juízo: ["juízo", "julgamento", "julgar", "ímpio", "ímpios", "pecador", "pecadores", "perecerá", "condenação"],
  obediência: ["lei", "mandamento", "mandamentos", "obedecer", "guarda", "preceito", "preceitos", "estatuto"],
  oração: ["oração", "súplica", "súplicas", "petição", "petições", "clamor", "clamai", "clamo"],
  alegria: ["alegre", "alegrem", "regozijai", "regozijo", "júbilo", "louvor", "louvai", "exultai"],
  vida: ["vida", "viver", "vivente", "vivos", "eterna", "eternamente"],
  caminho: ["caminho", "caminhos", "vereda", "veredas", "andar", "anda", "andou", "anda"],
  pastor: ["pastor", "pasto", "ovelhas", "rebanho", "guia", "guiar"],
  espírito: ["espírito", "espiritual", "consolador", "ungido", "unção"],
  cristo: ["cristo", "jesus", "filho", "messias", "cordeiro", "salvador", "senhor"],
};

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents for matching
    .replace(/[^a-zà-ú0-9\s-]/gi, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

function familyHits(tokens: string[]): Map<string, number> {
  const hits = new Map<string, number>();
  for (const [family, words] of Object.entries(KEYWORD_FAMILIES)) {
    let count = 0;
    for (const w of words) {
      const norm = w
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      for (const t of tokens) if (t === norm || t.startsWith(norm)) count++;
    }
    if (count > 0) hits.set(family, count);
  }
  return hits;
}

const THEME_LABEL: Record<string, string> = {
  graça: "Graça e perdão",
  fé: "Fé que confia",
  esperança: "Esperança em Deus",
  amor: "Amor de Deus",
  salvação: "Salvação em Cristo",
  santidade: "Santidade prática",
  paz: "Paz que sustenta",
  juízo: "Justiça e juízo de Deus",
  obediência: "Obediência à Palavra",
  oração: "Vida de oração",
  alegria: "Alegria no Senhor",
  vida: "Vida abundante",
  caminho: "O caminho do justo",
  pastor: "O Senhor é pastor",
  espírito: "Vida no Espírito",
  cristo: "Cristo, centro de tudo",
};

const INSIGHT_BANK: Record<string, string[]> = {
  graça: [
    "A graça aparece como dádiva imerecida que precede qualquer mérito humano.",
    "O texto recusa a lógica de troca: Deus age por amor, não por barganha.",
  ],
  fé: [
    "A fé descrita é confiança ativa, não crença passiva.",
    "Crer, no texto, envolve abandonar-se inteiramente nas mãos de Deus.",
  ],
  esperança: [
    "A esperança aqui não é otimismo: é certeza fundada nas promessas de Deus.",
    "O futuro já é presente para quem confia, porque Deus já decidiu o desfecho.",
  ],
  amor: [
    "O amor é mostrado como iniciativa divina antes de ser resposta humana.",
    "Esse amor é encarnado: prova-se em ações concretas, não em sentimentos vagos.",
  ],
  salvação: [
    "A salvação é apresentada como obra de Deus, recebida pela fé.",
    "Não há nuance de auto-resgate: somente Cristo salva integralmente.",
  ],
  santidade: [
    "A santidade não é distância do mundo, mas pertencer inteiramente a Deus.",
    "O texto liga santidade à conduta cotidiana, não a um estado místico.",
  ],
  paz: [
    "A paz oferecida é repouso em meio à tormenta, não ausência dela.",
    "Essa paz nasce da presença de Deus, não da mudança das circunstâncias.",
  ],
  juízo: [
    "O juízo de Deus é palavra séria que protege os justos e expõe os ímpios.",
    "A advertência convive com o convite: ainda há tempo para retornar.",
  ],
  obediência: [
    "A obediência aparece como resposta amorosa, não obrigação fria.",
    "Guardar a Palavra é deixar-se moldar por ela.",
  ],
  oração: [
    "A oração é o canal natural da fé: confiança que se expressa em diálogo.",
    "Petição e gratidão aparecem juntas, formando o ritmo do crente.",
  ],
  alegria: [
    "A alegria proposta não é euforia: é raiz teológica que sustenta a alma.",
    "Regozijar-se é uma decisão da fé antes de ser estado emocional.",
  ],
  vida: [
    "A vida descrita é qualitativa: comunhão com Deus, agora e para sempre.",
    "O texto opõe vida verdadeira a uma existência apenas biológica.",
  ],
  caminho: [
    "Há dois caminhos no texto, e a escolha é diária, não pontual.",
    "O caminho do justo é desenhado por hábitos pequenos e sustentados.",
  ],
  pastor: [
    "Deus é apresentado como pastor que assume o cuidado pessoal de cada ovelha.",
    "Vale do sombra e mesa farta convivem: o pastor está em ambos.",
  ],
  espírito: [
    "O Espírito Santo é o agente que torna a verdade do texto experiência viva.",
    "Sem dependência do Espírito, qualquer aplicação vira moralismo.",
  ],
  cristo: [
    "Cristo é a chave hermenêutica: o texto se ilumina à luz dEle.",
    "Toda promessa converge para a pessoa e obra de Jesus.",
  ],
};

const APPLICATION_BANK: Record<string, string[]> = {
  graça: ["Acolher hoje o perdão de Deus e estendê-lo a quem te feriu."],
  fé: ["Confiar a Deus uma área específica em que você ainda tenta resolver sozinho."],
  esperança: ["Reescrever sua leitura do futuro à luz das promessas de Deus."],
  amor: ["Materializar o amor em um gesto concreto esta semana."],
  salvação: ["Descansar de qualquer tentativa de auto-justificação diante de Deus."],
  santidade: ["Identificar um hábito que precisa morrer para que outro nasça."],
  paz: ["Levar a Deus, em oração detalhada, o que tem te tirado o sono."],
  juízo: ["Fazer um exame honesto da consciência e responder onde for confrontado."],
  obediência: ["Escolher uma ordem do texto e obedecer ainda hoje."],
  oração: ["Reservar um horário fixo de oração diária nesta semana."],
  alegria: ["Cultivar gratidão escrita por sete dias seguidos."],
  vida: ["Trocar tempo de tela por tempo com Deus em algum momento do dia."],
  caminho: ["Escolher conscientemente os ambientes e companhias desta semana."],
  pastor: ["Entregar ao Pastor o medo concreto que você tem tentado domar."],
  espírito: ["Pedir, em oração simples, para ser cheio do Espírito Santo hoje."],
  cristo: ["Reler o texto perguntando: o que isto me revela de Cristo?"],
};

export function analyzeScripture(refs: BibleReference[]): ScriptureAnalysis {
  const fullText = refs.map((r) => r.text).join(" ");
  const tokens = tokenize(fullText);
  const hits = familyHits(tokens);

  const ranked = [...hits.entries()].sort((a, b) => b[1] - a[1]);
  const topFamilies = ranked.slice(0, 4).map(([f]) => f);

  const mainTheme = topFamilies.length > 0
    ? THEME_LABEL[topFamilies[0]]
    : "A voz de Deus na Escritura";

  const keywords: string[] = [];
  for (const f of topFamilies) {
    const family = KEYWORD_FAMILIES[f];
    for (const w of family.slice(0, 2)) if (!keywords.includes(w)) keywords.push(w);
  }
  // adiciona termos brutos relevantes
  const freq = new Map<string, number>();
  for (const t of tokens) freq.set(t, (freq.get(t) ?? 0) + 1);
  const topRaw = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([w]) => w);
  for (const w of topRaw) if (!keywords.includes(w)) keywords.push(w);

  const insights: string[] = [];
  for (const f of topFamilies) insights.push(...(INSIGHT_BANK[f] ?? []).slice(0, 1));
  if (insights.length === 0) {
    insights.push("O texto convida à leitura paciente: cada palavra carrega peso teológico.");
  }

  const applications: string[] = [];
  for (const f of topFamilies) applications.push(...(APPLICATION_BANK[f] ?? []).slice(0, 1));
  if (applications.length === 0) {
    applications.push("Volte ao texto durante a semana e pergunte: o que muda em mim?");
  }

  return {
    mainTheme,
    keywords: keywords.slice(0, 8),
    insights: insights.slice(0, 4),
    applications: applications.slice(0, 4),
  };
}

export { KEYWORD_FAMILIES };
