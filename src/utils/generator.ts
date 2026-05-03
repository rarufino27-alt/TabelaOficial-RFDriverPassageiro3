import type {
  Audience,
  BibleVersion,
  ContentType,
  DevelopmentPoint,
  GeneratedContent,
  GeneratorFormData,
  IntroStyle,
  ScriptureAnalysis,
  Style,
  Tone,
} from "@/types/content";
import { combineLabels } from "@/utils/bibleRef";
import { analyzeScripture } from "@/utils/analyzer";
import { getCrossReferences } from "@/utils/crossReferences";

/* ============================================================
   BibleBuilder — Engine teológica baseada em texto bíblico real.
   Camadas: Analyzer → ContextBuilder → ContentComposer
            → LanguageAdapter → VariationEngine
   ============================================================ */

/* ---------- 1. Variation Engine ---------- */

const hash = (s: string) => {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
};

class Rng {
  private state: number;
  private used = new Set<string>();
  constructor(seed: number) { this.state = seed || 1; }
  next() {
    this.state = (Math.imul(this.state, 1664525) + 1013904223) >>> 0;
    return this.state / 0xffffffff;
  }
  pick<T>(arr: readonly T[]): T { return arr[Math.floor(this.next() * arr.length)]; }
  pickUnique<T>(arr: readonly T[], bucket: string): T {
    for (let i = 0; i < 6; i++) {
      const v = this.pick(arr);
      const key = `${bucket}::${String(v).slice(0, 24)}`;
      if (!this.used.has(key)) { this.used.add(key); return v; }
    }
    return this.pick(arr);
  }
  shuffle<T>(arr: readonly T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}

/* ---------- 2. Context Builder (mapa de livros) ---------- */

interface BookMeta { author: string; audience: string; setting: string; purpose: string; }

const BOOKS: Record<string, BookMeta> = {
  "gênesis": { author: "Moisés (tradicionalmente)", audience: "Israel no deserto", setting: "origens do mundo e dos patriarcas", purpose: "revelar o Deus criador e iniciador da aliança" },
  "êxodo": { author: "Moisés", audience: "Israel libertado do Egito", setting: "saída do Egito e formação do povo", purpose: "mostrar o Deus que liberta e habita no meio do seu povo" },
  "salmos": { author: "Davi e outros salmistas", audience: "Israel reunido em adoração", setting: "vida espiritual e culto de Israel", purpose: "ensinar a orar com sinceridade diante de Deus" },
  "provérbios": { author: "Salomão (em sua maior parte)", audience: "jovens e líderes em formação", setting: "tradição sapiencial de Israel", purpose: "formar caráter à luz do temor do Senhor" },
  "isaías": { author: "Isaías, filho de Amoz", audience: "Judá em crise", setting: "séculos VIII–VI a.C., ameaça assíria e babilônica", purpose: "anunciar juízo e a esperança messiânica" },
  "mateus": { author: "Mateus, o publicano", audience: "leitores judaicos", setting: "primeira geração cristã", purpose: "apresentar Jesus como o Messias prometido" },
  "marcos": { author: "João Marcos", audience: "cristãos romanos sob pressão", setting: "Roma, meados do século I", purpose: "mostrar Jesus como o Servo que age" },
  "lucas": { author: "Lucas, o médico", audience: "Teófilo e leitores gentios", setting: "mundo greco-romano do século I", purpose: "narrar com cuidado histórico a obra de Cristo" },
  "joão": { author: "João, o discípulo amado", audience: "igreja já estabelecida no fim do século I", setting: "Éfeso, fim do século I", purpose: "levar o leitor a crer que Jesus é o Cristo" },
  "atos": { author: "Lucas", audience: "Teófilo e a igreja", setting: "expansão do evangelho de Jerusalém a Roma", purpose: "mostrar como o Espírito conduz a missão" },
  "romanos": { author: "Paulo", audience: "igreja em Roma, mista de judeus e gentios", setting: "preparação da viagem a Roma, c. 57 d.C.", purpose: "expor o evangelho da justificação pela fé" },
  "1 coríntios": { author: "Paulo", audience: "igreja em Corinto, dividida e imatura", setting: "cidade portuária greco-romana, c. 55 d.C.", purpose: "corrigir desvios e exaltar o amor cristão" },
  "filipenses": { author: "Paulo (preso em Roma)", audience: "igreja amada em Filipos", setting: "carta do cárcere", purpose: "exortar à alegria, à humildade e à perseverança" },
  "efésios": { author: "Paulo (na prisão)", audience: "igreja em Éfeso e região", setting: "carta circular do cárcere romano", purpose: "celebrar a obra de Cristo e a unidade da igreja" },
  "hebreus": { author: "autor anônimo, próximo de Paulo", audience: "cristãos de origem judaica tentados a recuar", setting: "antes da queda de Jerusalém em 70 d.C.", purpose: "mostrar a superioridade de Cristo" },
  "tiago": { author: "Tiago, irmão do Senhor", audience: "doze tribos dispersas", setting: "primeiras décadas da igreja", purpose: "unir fé e prática no cotidiano" },
  "1 pedro": { author: "Pedro, o apóstolo", audience: "cristãos peregrinos sob hostilidade", setting: "Ásia Menor, perseguição crescente", purpose: "fortalecer a fé no sofrimento" },
  "apocalipse": { author: "João, exilado em Patmos", audience: "sete igrejas da Ásia sob pressão imperial", setting: "fim do século I, perseguição romana", purpose: "anunciar a vitória final do Cordeiro" },
};

function getBookMeta(book: string): BookMeta {
  const k = book.toLowerCase().trim();
  if (BOOKS[k]) return BOOKS[k];
  for (const key of Object.keys(BOOKS)) if (k.includes(key) || key.includes(k)) return BOOKS[key];
  return {
    author: "um servo inspirado pelo Espírito Santo",
    audience: "uma comunidade real de fé",
    setting: "um momento concreto da caminhada do povo de Deus",
    purpose: "registrar uma palavra viva que continua falando hoje",
  };
}

/* ---------- 3. Banks ---------- */

const CONNECTORS = ["Mais do que isso,", "Note bem:", "E aqui está o ponto:", "Repare comigo:", "Não por acaso,", "Diante disso,"];
const TRANSITIONS = ["E não para por aí.", "Mas há uma camada mais profunda.", "Agora, observe a virada do texto.", "É justamente aí que o Espírito nos convida a parar."];

const POINT_TITLES = {
  fundamento: ["O fundamento bíblico:", "A raiz teológica:", "O que o texto realmente diz:", "Voltando ao texto:", "O alicerce:"],
  contraste: ["O contraste com a lógica do mundo:", "Onde a cultura se engana:", "O equívoco mais comum:"],
  cristo: ["Cristo como chave de leitura:", "O Evangelho ilumina o texto:", "Tudo aponta para Jesus:"],
  espirito: ["A vida no Espírito:", "Sem o Espírito, não há fruto:", "O Consolador no centro:"],
  igreja: ["Implicações para a comunidade:", "A igreja como lugar:", "Vivendo em comunidade:"],
  pratico: ["O passo prático:", "Onde isso encosta na vida real:", "A pergunta concreta:"],
} as const;

const CTA_VERBS = ["Comprometa-se", "Dê o próximo passo", "Decida hoje", "Reserve um tempo", "Convide alguém"];

/* ---------- 4. Language Adapter ---------- */

function audienceVoice(a: Audience): { register: string; example: string } {
  switch (a) {
    case "Criança": return { register: "linguagem simples, com imagens visuais e exemplos concretos", example: "Imagine uma semente bem pequenininha que vira uma árvore enorme — assim é o que Deus faz no nosso coração." };
    case "Jovem": return { register: "linguagem direta, conectada à realidade contemporânea", example: "Numa rotina cheia de notificações e cobranças, essa palavra interrompe o scroll e propõe outro ritmo." };
    case "Igreja": return { register: "linguagem teológica acessível, com densidade pastoral", example: "A comunidade dos santos, congregada em torno da Palavra, é o lugar onde essa verdade ganha rosto e nome." };
    case "Geral": return { register: "linguagem clara e acolhedora", example: "Seja você quem chega pela primeira vez ou quem caminha há anos, esta palavra é para você." };
  }
}
function styleAdj(s: Style) { return ({ "Motivacional": "encorajador", "Didático": "claro e progressivo", "Evangelístico": "com apelo direto à fé", "Profundo": "com densidade exegética" })[s]; }
function toneAdj(t: Tone) { return ({ "Encorajador": "com calor e ânimo", "Confrontador": "com franqueza pastoral", "Pastoral": "com cuidado e paciência", "Reflexivo": "com pausa e ponderação", "Celebrativo": "com gratidão" })[t]; }
function versionFlavor(v: BibleVersion) { return ({ ARC: "na sonoridade clássica da ARC", ARA: "no português da ARA", NVI: "na clareza da NVI", NTLH: "na linguagem cotidiana da NTLH" })[v]; }

function versionQuote(v: BibleVersion, label: string): string {
  switch (v) {
    case "ARC": return `Eco devocional inspirado em ${label}, na sonoridade clássica da Almeida Revista e Corrigida.`;
    case "ARA": return `Conforme lemos em ${label}, a Palavra se faz presente com firmeza e clareza.`;
    case "NVI": return `Como nos lembra ${label}, há uma verdade que Deus deseja fazer chegar até você.`;
    case "NTLH": return `Em ${label}, Deus fala de um jeito direto e simples, como quem se senta ao seu lado.`;
  }
}

/* ---------- 5. Composer ---------- */

function pickIntroStyle(rng: Rng): IntroStyle {
  return rng.pick(["pergunta", "afirmacao", "historico", "cotidiano", "contraste"] as IntroStyle[]);
}

function generateTitle(rng: Rng, form: GeneratorFormData, theme: string): string {
  const banks: Record<ContentType, string[]> = {
    "Pregação": ["A verdade sobre", "O poder de", "Vivendo em", "Quando Deus fala sobre", "O coração de"],
    "Estudo Bíblico": ["Estudo:", "Compreendendo", "As riquezas de", "Um olhar atento sobre", "Mergulhando em"],
    "Devocional": ["Hoje, sobre", "Reflexão pela manhã:", "Caminhando em", "Repouso em", "Uma palavra sobre"],
    "Saudação": ["Palavra de boas-vindas:", "Saudação sobre", "Acolhimento em", "Bênção sobre"],
  };
  const prefix = rng.pickUnique(banks[form.type], "title");
  return `${prefix} ${theme}`.trim();
}

function generateIntroduction(rng: Rng, form: GeneratorFormData, label: string, voice: ReturnType<typeof audienceVoice>): { text: string; style: IntroStyle } {
  const t = form.theme;
  const chosen = pickIntroStyle(rng);
  const variants: Record<IntroStyle, string[]> = {
    pergunta: [
      `O que significa, de fato, viver "${t}" num tempo como o nosso? A pergunta parece simples, mas a resposta exige humildade. ${label} é o lugar onde o texto sagrado nos encontra com essa mesma indagação.`,
      `Já se perguntou por que "${t}" toca tanto o coração humano? ${label} oferece um ângulo que a cultura raramente alcança.`,
    ],
    afirmacao: [
      `Há verdades que, uma vez ouvidas, não podem mais ser ignoradas. "${t}" é uma delas, e ${label} as coloca diante de nós com a sobriedade de quem fala da parte de Deus.`,
      `Deus não fala em vão. Em ${label}, "${t}" ganha o peso de palavra eterna.`,
    ],
    historico: [
      `Quando ${label} foi originalmente escrito, o povo de Deus enfrentava desafios bem concretos — não conceitos abstratos. É nesse pano de fundo que "${t}" começa a brilhar.`,
      `A história importa. ${label} nasceu num tempo, num lugar, no meio de pessoas reais. Compreender isso abre a porta para "${t}".`,
    ],
    cotidiano: [
      `${voice.example} É exatamente desse cotidiano que ${label} se aproxima quando fala de "${t}".`,
      `No meio das contas e dos prazos, ${label} se faz pão para hoje. "${t}" não é tema de domingo apenas.`,
    ],
    contraste: [
      `O mundo tem muito a dizer sobre "${t}", quase tudo em forma de atalhos. ${label} caminha na direção contrária: aponta para uma profundidade que só a graça produz.`,
      `Existe a versão da cultura sobre "${t}", e existe a versão da Escritura. Em ${label}, somos firmemente conduzidos da primeira para a segunda.`,
    ],
  };
  return { text: rng.pickUnique(variants[chosen], `intro-${chosen}`), style: chosen };
}

function generateContext(rng: Rng, form: GeneratorFormData, label: string, primaryBook: string): string {
  const m = getBookMeta(primaryBook);
  const lead = rng.pickUnique([
    `Quem escreve é ${m.author}. O texto se dirige a ${m.audience}, em ${m.setting}.`,
    `Por trás de ${label} está ${m.author}, falando a ${m.audience}, em meio a ${m.setting}.`,
    `${m.author} dirige estas palavras a ${m.audience}, num cenário marcado por ${m.setting}.`,
  ], "ctx-lead");
  const purpose = `O propósito do escrito é ${m.purpose}.`;
  const bridge = rng.pickUnique([
    `Lendo ${label} dentro desse fluxo, "${form.theme}" deixa de ser tópico isolado e se integra ao plano maior das Escrituras.`,
    `Compreender esse contexto reorganiza nosso ouvido: "${form.theme}" agora é palavra encarnada num momento real.`,
  ], "ctx-bridge");
  return `${lead} ${purpose} ${bridge}`;
}

/* Pontos nascem dos versículos — cada ponto ancora numa frase real do texto. */
function generatePoints(
  rng: Rng,
  form: GeneratorFormData,
  analysis: ScriptureAnalysis,
  voice: ReturnType<typeof audienceVoice>,
): DevelopmentPoint[] {
  // monta blocos textuais (cada referência → frases)
  type Block = { ref: string; sentence: string };
  const blocks: Block[] = [];
  for (const r of form.references) {
    for (const v of r.verseList) {
      const sentence = v.text.split(/(?<=[.!?])\s+/)[0]; // primeira sentença
      if (sentence && sentence.length > 10) {
        blocks.push({ ref: `${r.book} ${r.chapter}:${v.verse}`, sentence });
      }
    }
  }
  // se não há blocos suficientes, usa labels
  while (blocks.length < form.points) {
    blocks.push({ ref: form.references[blocks.length % form.references.length]?.label ?? "", sentence: form.theme });
  }

  const buckets: Array<keyof typeof POINT_TITLES> = ["fundamento", "contraste", "cristo", "espirito", "igreja", "pratico"];
  const order = rng.shuffle(buckets).slice(0, form.points);
  if (!order.includes("fundamento")) order[0] = "fundamento";

  const chosenBlocks = rng.shuffle(blocks).slice(0, form.points);

  const ref0 = form.references[0];
  const v = ref0?.version ?? "ARC";

  return order.map((b, i) => {
    const block = chosenBlocks[i] ?? blocks[i % blocks.length];
    const titlePrefix = rng.pickUnique(POINT_TITLES[b], `pt-${b}`);
    const title = `${titlePrefix} ${form.theme}`.trim();
    const intro = i > 0 ? rng.pickUnique(CONNECTORS, "conn") + " " : "";
    let body = "";
    switch (b) {
      case "fundamento":
        body = `${intro}Quando ${block.ref} declara: "${block.sentence}", encontramos o alicerce de "${form.theme}". Não impomos sentidos — escutamos ${versionFlavor(v)}.`;
        break;
      case "contraste":
        body = `${intro}Em ${block.ref}, lemos: "${block.sentence}". Onde o mundo oferece atalhos, a Palavra propõe transformação que começa de dentro.`;
        break;
      case "cristo":
        body = `${intro}À luz do Evangelho, "${block.sentence}" (${block.ref}) só revela seu núcleo a partir da pessoa e obra de Cristo. Sem Ele, "${form.theme}" vira moral; com Ele, vira graça.`;
        break;
      case "espirito":
        body = `${intro}Não basta entender ${block.ref}; é preciso viver. O Espírito Santo é quem opera em nós o querer e o realizar a partir de "${block.sentence}".`;
        break;
      case "igreja":
        body = `${intro}A fé nunca é solitária. ${block.ref} (\"${block.sentence}\") encontra seu pleno sentido dentro do Corpo de Cristo, onde a Palavra é proclamada e os santos se servem.`;
        break;
      case "pratico":
        body = `${intro}${voice.example} A pergunta concreta a partir de ${block.ref} é simples: o que muda em mim, hoje, à luz de "${block.sentence}"?`;
        break;
    }
    if (analysis.insights[i]) body += ` ${analysis.insights[i]}`;
    return { title, body, anchor: block.ref };
  });
}

function generateApplication(rng: Rng, form: GeneratorFormData, analysis: ScriptureAnalysis, label: string): string {
  const seed = analysis.applications[0] ?? `Volte a ${label} esta semana e responda com ações concretas.`;
  const variants = [
    `${seed} Comece pelo pequeno: reserve um tempo diário com o texto, deixando-o moldar seus pensamentos. Pergunte: o que muda em mim quando levo a sério "${form.theme}"?`,
    `Aplicar "${form.theme}" não é fazer mais — é fazer diferente. ${seed}`,
    `${rng.pickUnique(TRANSITIONS, "app-trans")} ${seed} A Palavra encontra a agenda quando deixamos de ser apenas ouvintes.`,
  ];
  return rng.pickUnique(variants, "app");
}

function generateConclusion(rng: Rng, form: GeneratorFormData, label: string): string {
  const variants = [
    `Chegamos ao fim deste ${form.type.toLowerCase()}, mas o caminho está apenas começando. "${form.theme}" não é tópico a ser arquivado — é chamado a ser respondido. Que ${label} ressoe nos próximos dias.`,
    `A Bíblia não termina onde fechamos o livro. Que "${form.theme}" continue te visitando, em pequenas pausas e decisões silenciosas.`,
    `Encerramos com a sobriedade de quem apenas tocou a superfície. ${label} é mar profundo: volte e mergulhe de novo.`,
  ];
  return rng.pickUnique(variants, "concl");
}

function generateIllustration(rng: Rng, form: GeneratorFormData): string {
  const variants = [
    `Conta-se a história de um relojoeiro que, ao restaurar uma peça antiga, percebeu que cada engrenagem só fazia sentido integrada ao todo. Assim é "${form.theme}" na vida de fé.`,
    `Um lavrador costumava dizer: "a terra só dá fruto a quem espera". Não há atalho entre semente e colheita — "${form.theme}" funciona do mesmo modo.`,
    `Numa cidade litorânea, um farol manteve-se aceso durante uma noite de tempestade. "${form.theme}" se parece com isso: alguém vela enquanto dormimos — e esse alguém é Deus.`,
  ];
  return rng.pickUnique(variants, "ilust");
}

function generateImpact(rng: Rng, form: GeneratorFormData, label: string): string {
  const variants = [
    `"${form.theme}" não é destino — é o caminho que Deus abre diante de quem ousa crer.`,
    `Quando a Palavra encontra a vida, nasce um novo tempo.`,
    `Há verdades que não se aprendem: se vivem.`,
    `O Evangelho não acrescenta peso à vida — ele a sustenta.`,
    `${label} não pede admiração. Pede resposta.`,
  ];
  return rng.pickUnique(variants, "impact");
}

function generateQuestions(rng: Rng, form: GeneratorFormData, label: string, n: number): string[] {
  const pool = [
    `O que ${label} revela sobre o caráter de Deus em relação a "${form.theme.toLowerCase()}"?`,
    `Em que área da minha vida preciso aplicar essa verdade hoje?`,
    `Qual obstáculo tem me impedido de viver plenamente o que esta Palavra ensina?`,
    `Como posso compartilhar essa mensagem com alguém esta semana?`,
    `Que resposta concreta o Espírito Santo está pedindo de mim agora?`,
    `Onde, na minha rotina, "${form.theme}" deixou de ser prática viva?`,
    `Quem em volta de mim precisa ouvir essa palavra através da minha vida?`,
  ];
  return rng.shuffle(pool).slice(0, n);
}

function generateCallToAction(rng: Rng, form: GeneratorFormData, label: string): string {
  const verb = rng.pickUnique(CTA_VERBS, "cta-verb");
  const variants = [
    `${verb} a uma única verdade desta mensagem e leve-a até o fim da semana. Escreva-a, ore sobre ela, viva-a.`,
    `${verb} hoje: escolha uma atitude concreta diante de "${form.theme}" e dê o primeiro passo antes que o impulso passe.`,
    `${verb} a ouvir o Espírito Santo nesta semana com mais atenção. ${label} é apenas a porta — o convite é a uma caminhada inteira.`,
  ];
  return rng.pickUnique(variants, "cta");
}

/* ---------- 6. Public API ---------- */

export async function generateContent(form: GeneratorFormData): Promise<GeneratedContent> {
  if (!form.references || form.references.length === 0) {
    throw new Error("Selecione ao menos um texto bíblico base.");
  }

  await new Promise((r) => setTimeout(r, 1200));

  const label = combineLabels(form.references);
  const seedKey = `${form.theme}|${label}|${form.type}|${form.style}|${form.tone}|${form.audience}|${form.duration}|${form.points}|${Date.now() & 0xffff}`;
  const seed = hash(seedKey);
  const rng = new Rng(seed);
  const voice = audienceVoice(form.audience);

  const analysis = analyzeScripture(form.references);
  const theme = form.theme.trim() || analysis.mainTheme;
  const primaryRef = form.references[0];

  const title = generateTitle(rng, { ...form, theme }, theme);
  const intro = generateIntroduction(rng, { ...form, theme }, label, voice);
  const context = generateContext(rng, { ...form, theme }, label, primaryRef.book);
  const development = generatePoints(rng, { ...form, theme }, analysis, voice);
  const application = generateApplication(rng, { ...form, theme }, analysis, label);
  const conclusion = generateConclusion(rng, { ...form, theme }, label);
  const crossReferences = getCrossReferences(analysis.keywords, 5);
  const illustration = generateIllustration(rng, { ...form, theme });
  const impactPhrase = generateImpact(rng, { ...form, theme }, label);
  const questions = generateQuestions(rng, { ...form, theme }, label, Math.max(3, form.points));
  const callToAction = generateCallToAction(rng, { ...form, theme }, label);
  const scriptureQuote = versionQuote(primaryRef.version, label);

  const signature = `Texto produzido ${styleAdj(form.style)}, ${toneAdj(form.tone)}, ${voice.register}.`;
  const id = `${Date.now().toString(36)}-${seed.toString(36)}`;

  return {
    id,
    createdAt: new Date().toISOString(),
    title,
    references: form.references,
    scriptureLabel: label,
    scriptureQuote,
    introduction: `${intro.text}\n\n${signature}`,
    introStyle: intro.style,
    context,
    analysis,
    development,
    application,
    conclusion,
    crossReferences,
    illustration,
    impactPhrase,
    questions,
    callToAction,
    meta: {
      type: form.type,
      audience: form.audience,
      duration: form.duration,
      style: form.style,
      tone: form.tone,
      version: primaryRef.version,
      points: form.points,
    },
  };
}

/* ---------- 7. Export helpers ---------- */

export function formatAsPlainText(c: GeneratedContent): string {
  const lines: string[] = [];
  lines.push(c.title.toUpperCase());
  lines.push(`Texto base: ${c.scriptureLabel} (${c.meta.version})`);
  lines.push("");
  for (const r of c.references) {
    lines.push(`— ${r.label} —`);
    for (const v of r.verseList) lines.push(`${v.verse} ${v.text}`);
    lines.push("");
  }
  lines.push("TEMA CENTRAL: " + c.analysis.mainTheme);
  lines.push("PALAVRAS-CHAVE: " + c.analysis.keywords.join(", "));
  lines.push("");
  lines.push("INTRODUÇÃO"); lines.push(c.introduction); lines.push("");
  lines.push("CONTEXTO BÍBLICO"); lines.push(c.context); lines.push("");
  lines.push("DESENVOLVIMENTO");
  c.development.forEach((p, i) => {
    lines.push(`${i + 1}. ${p.title}${p.anchor ? ` (${p.anchor})` : ""}`);
    lines.push(p.body); lines.push("");
  });
  lines.push("APLICAÇÃO"); lines.push(c.application); lines.push("");
  lines.push("CONCLUSÃO"); lines.push(c.conclusion); lines.push("");
  lines.push("REFERÊNCIAS CRUZADAS: " + c.crossReferences.join(" • "));
  lines.push("");
  lines.push("ILUSTRAÇÃO"); lines.push(c.illustration); lines.push("");
  lines.push("FRASE DE IMPACTO"); lines.push(c.impactPhrase); lines.push("");
  lines.push("PERGUNTAS PARA REFLEXÃO");
  c.questions.forEach((q, i) => lines.push(`${i + 1}. ${q}`));
  lines.push("");
  lines.push("CHAMADA À AÇÃO"); lines.push(c.callToAction); lines.push("");
  lines.push("—");
  lines.push("Este conteúdo é um apoio para seu estudo. A direção verdadeira vem de Deus.");
  lines.push("Busque sempre a orientação do Espírito Santo.");
  return lines.join("\n");
}
