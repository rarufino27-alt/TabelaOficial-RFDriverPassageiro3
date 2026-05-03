export type ContentType = "Pregação" | "Estudo Bíblico" | "Devocional" | "Saudação";
export type Audience = "Criança" | "Jovem" | "Igreja" | "Geral";
export type Duration = 5 | 10 | 20 | 40;
export type Style = "Motivacional" | "Didático" | "Evangelístico" | "Profundo";
export type Tone = "Encorajador" | "Confrontador" | "Pastoral" | "Reflexivo" | "Celebrativo";
export type BibleVersion = "ARC" | "ARA" | "NVI" | "NTLH";
export type PointsCount = 3 | 4 | 5;
export type IntroStyle = "pergunta" | "afirmacao" | "historico" | "cotidiano" | "contraste";

export type SelectionMode = "single" | "range" | "multiple";

export interface BibleVerse {
  verse: number;
  text: string;
}

export interface BibleReference {
  id: string;
  version: BibleVersion;
  book: string;
  chapter: number;
  /** Lista canônica de versículos selecionados (ordenada). */
  verses: number[];
  /** Texto completo do trecho (juntando versículos selecionados). */
  text: string;
  /** Versículos com seu texto individual. */
  verseList: BibleVerse[];
  /** Referência formatada legível: "João 3:16-17" ou "Salmos 23:1,3,5". */
  label: string;
  /** Modo usado na seleção. */
  mode: SelectionMode;
}

export interface GeneratorFormData {
  type: ContentType;
  theme: string;
  references: BibleReference[];
  audience: Audience;
  duration: Duration;
  style: Style;
  tone: Tone;
  points: PointsCount;
}

export interface DevelopmentPoint {
  title: string;
  body: string;
  /** Referência da qual o ponto nasceu (ex.: "João 3:16"). */
  anchor?: string;
}

export interface ScriptureAnalysis {
  mainTheme: string;
  keywords: string[];
  insights: string[];
  applications: string[];
}

export interface GeneratedContent {
  id: string;
  createdAt: string;
  title: string;
  references: BibleReference[];
  /** Resumo legível das referências, ex: "João 3:16-17 · Romanos 5:1-5". */
  scriptureLabel: string;
  scriptureQuote: string;
  introduction: string;
  introStyle: IntroStyle;
  context: string;
  analysis: ScriptureAnalysis;
  development: DevelopmentPoint[];
  application: string;
  conclusion: string;
  crossReferences: string[];
  illustration: string;
  impactPhrase: string;
  questions: string[];
  callToAction: string;
  meta: {
    type: ContentType;
    audience: Audience;
    duration: Duration;
    style: Style;
    tone: Tone;
    version: BibleVersion;
    points: PointsCount;
  };
}

export interface HistoryEntry {
  id: string;
  createdAt: string;
  title: string;
  type: ContentType;
  scriptureLabel: string;
  content: GeneratedContent;
}
