import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { BibleReference, BibleVersion, SelectionMode } from "@/types/content";
import { BIBLE_BOOKS } from "@/data/bible";
import { buildReference } from "@/utils/bibleRef";
import { cn } from "@/lib/utils";

interface Props {
  references: BibleReference[];
  onChange: (refs: BibleReference[]) => void;
  globalVersion: BibleVersion;
  onVersionChange: (v: BibleVersion) => void;
}

const VERSIONS: { v: BibleVersion; label: string }[] = [
  { v: "ARC", label: "ARC — Almeida Revista e Corrigida" },
  { v: "ARA", label: "ARA — Almeida Revista e Atualizada" },
  { v: "NVI", label: "NVI — Nova Versão Internacional" },
  { v: "NTLH", label: "NTLH — Nova Tradução na Linguagem de Hoje" },
];

const MODES: { value: SelectionMode; label: string }[] = [
  { value: "single", label: "Versículo único" },
  { value: "range", label: "Intervalo" },
  { value: "multiple", label: "Versículos múltiplos" },
];

export function BibleSelector({ references, onChange, globalVersion, onVersionChange }: Props) {
  const [book, setBook] = useState<string>("João");
  const [chapter, setChapter] = useState<number>(3);
  const [mode, setMode] = useState<SelectionMode>("range");
  const [startVerse, setStartVerse] = useState<number>(16);
  const [endVerse, setEndVerse] = useState<number>(17);
  const [verseListRaw, setVerseListRaw] = useState<string>("1, 5, 10");

  const bookMeta = useMemo(() => BIBLE_BOOKS.find((b) => b.name === book), [book]);

  useEffect(() => {
    if (bookMeta && chapter > bookMeta.chapters) setChapter(1);
  }, [bookMeta, chapter]);

  const preview = useMemo(() => {
    if (!bookMeta) return null;
    try {
      const verseList = mode === "multiple"
        ? verseListRaw.split(/[,\s]+/).map((n) => parseInt(n, 10)).filter(Boolean)
        : undefined;
      return buildReference({
        version: globalVersion, book, chapter, mode,
        startVerse, endVerse, verseList,
      });
    } catch {
      return null;
    }
  }, [bookMeta, globalVersion, book, chapter, mode, startVerse, endVerse, verseListRaw]);

  const handleAdd = () => {
    if (!preview || preview.verses.length === 0) return;
    onChange([...references, preview]);
  };

  const handleRemove = (id: string) => {
    onChange(references.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-5">
      {/* Step 1: Versão */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">1</span>
          Versão bíblica
        </Label>
        <Select value={globalVersion} onValueChange={(v) => onVersionChange(v as BibleVersion)}>
          <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            {VERSIONS.map((v) => <SelectItem key={v.v} value={v.v}>{v.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Step 2: Texto base */}
      <div className="space-y-3 rounded-2xl border border-border bg-background/40 p-4">
        <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">2</span>
          Texto(s) base
        </Label>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5 col-span-2">
            <Label className="text-xs">Livro</Label>
            <Select value={book} onValueChange={setBook}>
              <SelectTrigger className="h-10 rounded-lg"><SelectValue /></SelectTrigger>
              <SelectContent className="max-h-72">
                {BIBLE_BOOKS.map((b) => (
                  <SelectItem key={b.name} value={b.name}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Capítulo</Label>
            <Input
              type="number" min={1} max={bookMeta?.chapters ?? 1}
              value={chapter}
              onChange={(e) => setChapter(Math.max(1, parseInt(e.target.value || "1", 10)))}
              className="h-10 rounded-lg"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Tipo</Label>
            <Select value={mode} onValueChange={(v) => setMode(v as SelectionMode)}>
              <SelectTrigger className="h-10 rounded-lg"><SelectValue /></SelectTrigger>
              <SelectContent>
                {MODES.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {mode !== "multiple" && (
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label className="text-xs">{mode === "single" ? "Versículo" : "Início"}</Label>
              <Input
                type="number" min={1} value={startVerse}
                onChange={(e) => setStartVerse(Math.max(1, parseInt(e.target.value || "1", 10)))}
                className="h-10 rounded-lg"
              />
            </div>
            {mode === "range" && (
              <div className="space-y-1.5">
                <Label className="text-xs">Fim</Label>
                <Input
                  type="number" min={1} value={endVerse}
                  onChange={(e) => setEndVerse(Math.max(1, parseInt(e.target.value || "1", 10)))}
                  className="h-10 rounded-lg"
                />
              </div>
            )}
          </div>
        )}

        {mode === "multiple" && (
          <div className="space-y-1.5">
            <Label className="text-xs">Versículos (separe por vírgula)</Label>
            <Input
              value={verseListRaw}
              onChange={(e) => setVerseListRaw(e.target.value)}
              placeholder="Ex.: 1, 5, 10"
              className="h-10 rounded-lg"
            />
          </div>
        )}

        {preview && preview.text && (
          <div className="rounded-xl border border-primary/20 bg-primary-soft/40 p-3 text-xs leading-relaxed text-foreground/85">
            <div className="mb-1 flex items-center gap-1.5 font-semibold text-primary">
              <BookOpen className="h-3 w-3" /> {preview.label}
            </div>
            <p className="line-clamp-4 italic">{preview.text}</p>
          </div>
        )}

        <Button
          type="button" variant="outline" onClick={handleAdd}
          className="w-full rounded-xl border-dashed"
          disabled={!preview || preview.verses.length === 0}
        >
          <Plus className="mr-1.5 h-4 w-4" /> Adicionar texto base
        </Button>
      </div>

      {/* Lista de referências */}
      {references.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {references.length} {references.length === 1 ? "texto selecionado" : "textos selecionados"}
          </Label>
          <ul className="space-y-2">
            {references.map((r) => (
              <li
                key={r.id}
                className={cn(
                  "group flex items-start gap-3 rounded-xl border border-border bg-card px-3 py-2.5 text-sm transition-colors",
                  "hover:border-primary/40",
                )}
              >
                <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{r.label}</span>
                    <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                      {r.version}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs italic text-muted-foreground">{r.text}</p>
                </div>
                <button
                  type="button" onClick={() => handleRemove(r.id)}
                  className="rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                  aria-label="Remover"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
