import { useCallback, useEffect, useState } from "react";
import type { GeneratedContent, HistoryEntry } from "@/types/content";

const KEY = "biblebuilder:history:v1";
const MAX = 50;

function read(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setEntries(read());
  }, []);

  const persist = (list: HistoryEntry[]) => {
    setEntries(list);
    try {
      localStorage.setItem(KEY, JSON.stringify(list));
    } catch {
      /* ignore */
    }
  };

  const add = useCallback((c: GeneratedContent) => {
    const entry: HistoryEntry = {
      id: c.id,
      createdAt: c.createdAt,
      title: c.title,
      type: c.meta.type,
      scriptureLabel: c.scriptureLabel,
      content: c,
    };
    const next = [entry, ...read().filter((e) => e.id !== c.id)].slice(0, MAX);
    persist(next);
  }, []);

  const remove = useCallback((id: string) => {
    persist(read().filter((e) => e.id !== id));
  }, []);

  const clear = useCallback(() => persist([]), []);

  return { entries, add, remove, clear };
}
