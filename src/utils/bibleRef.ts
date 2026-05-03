import type { BibleReference, SelectionMode, BibleVersion } from "@/types/content";
import { getMultipleVerses, getVerseRange } from "@/data/bible";

function formatVerses(verses: number[], mode: SelectionMode): string {
  if (verses.length === 0) return "";
  if (mode === "single") return String(verses[0]);
  if (mode === "range") return `${verses[0]}-${verses[verses.length - 1]}`;
  return verses.join(",");
}

export function buildReference(params: {
  version: BibleVersion;
  book: string;
  chapter: number;
  mode: SelectionMode;
  startVerse?: number;
  endVerse?: number;
  verseList?: number[];
}): BibleReference {
  const { version, book, chapter, mode } = params;
  let verseList: Array<{ verse: number; text: string }> = [];
  let verses: number[] = [];

  if (mode === "single") {
    const v = Math.max(1, params.startVerse ?? 1);
    verseList = getVerseRange(version, book, chapter, v, v);
    verses = [v];
  } else if (mode === "range") {
    const s = Math.max(1, params.startVerse ?? 1);
    const e = Math.max(s, params.endVerse ?? s);
    verseList = getVerseRange(version, book, chapter, s, e);
    verses = verseList.map((v) => v.verse);
  } else {
    const list = (params.verseList ?? []).filter((n) => n > 0);
    verseList = getMultipleVerses(version, book, chapter, list);
    verses = verseList.map((v) => v.verse);
  }

  const label = `${book} ${chapter}:${formatVerses(verses, mode)}`;
  const text = verseList.map((v) => `${v.verse} ${v.text}`).join(" ");

  return {
    id: `${book}-${chapter}-${verses.join("_")}-${version}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    version,
    book,
    chapter,
    verses,
    text,
    verseList,
    label,
    mode,
  };
}

export function combineLabels(refs: BibleReference[]): string {
  return refs.map((r) => r.label).join(" · ");
}

export function combineText(refs: BibleReference[]): string {
  return refs.map((r) => `[${r.label}] ${r.text}`).join("\n\n");
}
