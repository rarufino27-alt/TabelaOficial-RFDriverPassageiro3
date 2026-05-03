import type { BibleVersion } from "@/types/content";

/* ============================================================
   BibleBuilder — Base bíblica (mock estruturada)
   bibleData[version][book][chapter][verse] = text
   Estrutura pronta para expansão / substituição por API real.
   ============================================================ */

export interface BibleBook {
  name: string;
  abbrev: string;
  chapters: number;
  testament: "AT" | "NT";
}

export const BIBLE_BOOKS: BibleBook[] = [
  // Antigo Testamento
  { name: "Gênesis", abbrev: "Gn", chapters: 50, testament: "AT" },
  { name: "Êxodo", abbrev: "Êx", chapters: 40, testament: "AT" },
  { name: "Levítico", abbrev: "Lv", chapters: 27, testament: "AT" },
  { name: "Números", abbrev: "Nm", chapters: 36, testament: "AT" },
  { name: "Deuteronômio", abbrev: "Dt", chapters: 34, testament: "AT" },
  { name: "Josué", abbrev: "Js", chapters: 24, testament: "AT" },
  { name: "Juízes", abbrev: "Jz", chapters: 21, testament: "AT" },
  { name: "Rute", abbrev: "Rt", chapters: 4, testament: "AT" },
  { name: "1 Samuel", abbrev: "1Sm", chapters: 31, testament: "AT" },
  { name: "2 Samuel", abbrev: "2Sm", chapters: 24, testament: "AT" },
  { name: "1 Reis", abbrev: "1Rs", chapters: 22, testament: "AT" },
  { name: "2 Reis", abbrev: "2Rs", chapters: 25, testament: "AT" },
  { name: "1 Crônicas", abbrev: "1Cr", chapters: 29, testament: "AT" },
  { name: "2 Crônicas", abbrev: "2Cr", chapters: 36, testament: "AT" },
  { name: "Esdras", abbrev: "Ed", chapters: 10, testament: "AT" },
  { name: "Neemias", abbrev: "Ne", chapters: 13, testament: "AT" },
  { name: "Ester", abbrev: "Et", chapters: 10, testament: "AT" },
  { name: "Jó", abbrev: "Jó", chapters: 42, testament: "AT" },
  { name: "Salmos", abbrev: "Sl", chapters: 150, testament: "AT" },
  { name: "Provérbios", abbrev: "Pv", chapters: 31, testament: "AT" },
  { name: "Eclesiastes", abbrev: "Ec", chapters: 12, testament: "AT" },
  { name: "Cantares", abbrev: "Ct", chapters: 8, testament: "AT" },
  { name: "Isaías", abbrev: "Is", chapters: 66, testament: "AT" },
  { name: "Jeremias", abbrev: "Jr", chapters: 52, testament: "AT" },
  { name: "Lamentações", abbrev: "Lm", chapters: 5, testament: "AT" },
  { name: "Ezequiel", abbrev: "Ez", chapters: 48, testament: "AT" },
  { name: "Daniel", abbrev: "Dn", chapters: 12, testament: "AT" },
  { name: "Oséias", abbrev: "Os", chapters: 14, testament: "AT" },
  { name: "Joel", abbrev: "Jl", chapters: 3, testament: "AT" },
  { name: "Amós", abbrev: "Am", chapters: 9, testament: "AT" },
  { name: "Obadias", abbrev: "Ob", chapters: 1, testament: "AT" },
  { name: "Jonas", abbrev: "Jn", chapters: 4, testament: "AT" },
  { name: "Miquéias", abbrev: "Mq", chapters: 7, testament: "AT" },
  { name: "Naum", abbrev: "Na", chapters: 3, testament: "AT" },
  { name: "Habacuque", abbrev: "Hc", chapters: 3, testament: "AT" },
  { name: "Sofonias", abbrev: "Sf", chapters: 3, testament: "AT" },
  { name: "Ageu", abbrev: "Ag", chapters: 2, testament: "AT" },
  { name: "Zacarias", abbrev: "Zc", chapters: 14, testament: "AT" },
  { name: "Malaquias", abbrev: "Ml", chapters: 4, testament: "AT" },
  // Novo Testamento
  { name: "Mateus", abbrev: "Mt", chapters: 28, testament: "NT" },
  { name: "Marcos", abbrev: "Mc", chapters: 16, testament: "NT" },
  { name: "Lucas", abbrev: "Lc", chapters: 24, testament: "NT" },
  { name: "João", abbrev: "Jo", chapters: 21, testament: "NT" },
  { name: "Atos", abbrev: "At", chapters: 28, testament: "NT" },
  { name: "Romanos", abbrev: "Rm", chapters: 16, testament: "NT" },
  { name: "1 Coríntios", abbrev: "1Co", chapters: 16, testament: "NT" },
  { name: "2 Coríntios", abbrev: "2Co", chapters: 13, testament: "NT" },
  { name: "Gálatas", abbrev: "Gl", chapters: 6, testament: "NT" },
  { name: "Efésios", abbrev: "Ef", chapters: 6, testament: "NT" },
  { name: "Filipenses", abbrev: "Fp", chapters: 4, testament: "NT" },
  { name: "Colossenses", abbrev: "Cl", chapters: 4, testament: "NT" },
  { name: "1 Tessalonicenses", abbrev: "1Ts", chapters: 5, testament: "NT" },
  { name: "2 Tessalonicenses", abbrev: "2Ts", chapters: 3, testament: "NT" },
  { name: "1 Timóteo", abbrev: "1Tm", chapters: 6, testament: "NT" },
  { name: "2 Timóteo", abbrev: "2Tm", chapters: 4, testament: "NT" },
  { name: "Tito", abbrev: "Tt", chapters: 3, testament: "NT" },
  { name: "Filemom", abbrev: "Fm", chapters: 1, testament: "NT" },
  { name: "Hebreus", abbrev: "Hb", chapters: 13, testament: "NT" },
  { name: "Tiago", abbrev: "Tg", chapters: 5, testament: "NT" },
  { name: "1 Pedro", abbrev: "1Pe", chapters: 5, testament: "NT" },
  { name: "2 Pedro", abbrev: "2Pe", chapters: 3, testament: "NT" },
  { name: "1 João", abbrev: "1Jo", chapters: 5, testament: "NT" },
  { name: "2 João", abbrev: "2Jo", chapters: 1, testament: "NT" },
  { name: "3 João", abbrev: "3Jo", chapters: 1, testament: "NT" },
  { name: "Judas", abbrev: "Jd", chapters: 1, testament: "NT" },
  { name: "Apocalipse", abbrev: "Ap", chapters: 22, testament: "NT" },
];

type VerseMap = Record<number, Record<number, string>>;
type BookMap = Record<string, VerseMap>;
type BibleData = Record<BibleVersion, BookMap>;

/* ---------- Conteúdo (passagens-âncora populadas; demais passagens
              retornam placeholder honesto, sem fingir texto bíblico) ---------- */

const ARC: BookMap = {
  "Gênesis": {
    1: {
      1: "No princípio criou Deus os céus e a terra.",
      2: "E a terra era sem forma e vazia; e havia trevas sobre a face do abismo; e o Espírito de Deus se movia sobre a face das águas.",
      3: "E disse Deus: Haja luz; e houve luz.",
      4: "E viu Deus que era boa a luz; e fez Deus separação entre a luz e as trevas.",
      5: "E Deus chamou à luz Dia; e às trevas chamou Noite. E foi a tarde e a manhã, o dia primeiro.",
    },
  },
  "Salmos": {
    1: {
      1: "Bem-aventurado o varão que não anda segundo o conselho dos ímpios, nem se detém no caminho dos pecadores, nem se assenta na roda dos escarnecedores.",
      2: "Antes tem o seu prazer na lei do Senhor, e na sua lei medita de dia e de noite.",
      3: "Pois será como a árvore plantada junto a ribeiros de águas, a qual dá o seu fruto no seu tempo; as suas folhas não cairão, e tudo quanto fizer prosperará.",
      4: "Não são assim os ímpios; mas são como a moinha que o vento espalha.",
      5: "Por isso os ímpios não subsistirão no juízo, nem os pecadores na congregação dos justos.",
      6: "Porque o Senhor conhece o caminho dos justos; porém o caminho dos ímpios perecerá.",
    },
    23: {
      1: "O Senhor é o meu pastor, nada me faltará.",
      2: "Deitar-me faz em verdes pastos, guia-me mansamente a águas tranquilas.",
      3: "Refrigera a minha alma; guia-me pelas veredas da justiça, por amor do seu nome.",
      4: "Ainda que eu andasse pelo vale da sombra da morte, não temeria mal algum, porque tu estás comigo; a tua vara e o teu cajado me consolam.",
      5: "Preparas uma mesa perante mim na presença dos meus inimigos, unges a minha cabeça com óleo, o meu cálice transborda.",
      6: "Certamente que a bondade e a misericórdia me seguirão todos os dias da minha vida; e habitarei na casa do Senhor por longos dias.",
    },
  },
  "João": {
    3: {
      16: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.",
      17: "Porque Deus enviou o seu Filho ao mundo, não para que condenasse o mundo, mas para que o mundo fosse salvo por ele.",
    },
  },
  "Romanos": {
    5: {
      1: "Tendo sido, pois, justificados pela fé, temos paz com Deus, por nosso Senhor Jesus Cristo;",
      2: "Pelo qual também temos entrada pela fé a esta graça, na qual estamos firmes; e nos gloriamos na esperança da glória de Deus.",
      3: "E não somente isto, mas também nos gloriamos nas tribulações; sabendo que a tribulação produz a paciência;",
      4: "E a paciência a experiência, e a experiência a esperança.",
      5: "E a esperança não traz confusão, porquanto o amor de Deus está derramado em nossos corações pelo Espírito Santo que nos foi dado.",
      8: "Mas Deus prova o seu amor para conosco, em que Cristo morreu por nós, sendo nós ainda pecadores.",
    },
  },
  "Filipenses": {
    4: {
      4: "Regozijai-vos sempre no Senhor; outra vez digo, regozijai-vos.",
      6: "Não estejais inquietos por coisa alguma; antes as vossas petições sejam em tudo conhecidas diante de Deus pela oração e súplicas, com ação de graças.",
      7: "E a paz de Deus, que excede todo o entendimento, guardará os vossos corações e os vossos sentimentos em Cristo Jesus.",
      8: "Quanto ao mais, irmãos, tudo o que é verdadeiro, tudo o que é honesto, tudo o que é justo, tudo o que é puro, tudo o que é amável, tudo o que é de boa fama, se há alguma virtude, e se há algum louvor, nisso pensai.",
      13: "Posso todas as coisas naquele que me fortalece.",
    },
  },
};

/* Variações de versão = pequenas adaptações estilísticas a partir da ARC.
   Em produção isso virá de uma API/banco real. */
function flavorize(version: BibleVersion, text: string): string {
  if (version === "ARC") return text;
  if (version === "ARA")
    return text
      .replace(/varão/g, "homem")
      .replace(/Bem-aventurado/g, "Bem-aventurado")
      .replace(/porquanto/g, "pois");
  if (version === "NVI")
    return text
      .replace(/varão/g, "homem")
      .replace(/Bem-aventurado/g, "Como é feliz")
      .replace(/porquanto/g, "porque")
      .replace(/Regozijai-vos/g, "Alegrem-se");
  // NTLH
  return text
    .replace(/varão/g, "pessoa")
    .replace(/Bem-aventurado/g, "Feliz é")
    .replace(/Regozijai-vos/g, "Alegrem-se")
    .replace(/porquanto/g, "porque");
}

function buildVersion(v: BibleVersion): BookMap {
  const out: BookMap = {};
  for (const [book, chapters] of Object.entries(ARC)) {
    out[book] = {};
    for (const [ch, verses] of Object.entries(chapters)) {
      out[book][Number(ch)] = {};
      for (const [vn, text] of Object.entries(verses)) {
        out[book][Number(ch)][Number(vn)] = flavorize(v, text);
      }
    }
  }
  return out;
}

export const bibleData: BibleData = {
  ARC,
  ARA: buildVersion("ARA"),
  NVI: buildVersion("NVI"),
  NTLH: buildVersion("NTLH"),
};

/* ---------- Utilitários ---------- */

export function getVerse(version: BibleVersion, book: string, chapter: number, verse: number): string | null {
  return bibleData[version]?.[book]?.[chapter]?.[verse] ?? null;
}

export function getVerseRange(version: BibleVersion, book: string, chapter: number, start: number, end: number): Array<{ verse: number; text: string }> {
  const out: Array<{ verse: number; text: string }> = [];
  for (let v = start; v <= end; v++) {
    const text = getVerse(version, book, chapter, v);
    out.push({ verse: v, text: text ?? `[${book} ${chapter}:${v} — texto não disponível neste mock]` });
  }
  return out;
}

export function getMultipleVerses(version: BibleVersion, book: string, chapter: number, verses: number[]): Array<{ verse: number; text: string }> {
  return verses
    .slice()
    .sort((a, b) => a - b)
    .map((v) => ({ verse: v, text: getVerse(version, book, chapter, v) ?? `[${book} ${chapter}:${v} — texto não disponível neste mock]` }));
}

export function isPassageAvailable(version: BibleVersion, book: string, chapter: number): boolean {
  return Boolean(bibleData[version]?.[book]?.[chapter]);
}

export function findBook(name: string): BibleBook | undefined {
  return BIBLE_BOOKS.find((b) => b.name.toLowerCase() === name.toLowerCase() || b.abbrev.toLowerCase() === name.toLowerCase());
}
