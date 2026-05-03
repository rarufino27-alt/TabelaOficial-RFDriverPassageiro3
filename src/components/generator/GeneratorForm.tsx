import { useState } from "react";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type {
  Audience, BibleReference, BibleVersion, ContentType, Duration,
  GeneratorFormData, PointsCount, Style, Tone,
} from "@/types/content";
import { BibleSelector } from "./BibleSelector";
import { cn } from "@/lib/utils";

const types: ContentType[] = ["Pregação", "Estudo Bíblico", "Devocional", "Saudação"];
const audiences: Audience[] = ["Criança", "Jovem", "Igreja", "Geral"];
const durations: Duration[] = [5, 10, 20, 40];
const styles: Style[] = ["Motivacional", "Didático", "Evangelístico", "Profundo"];
const tones: Tone[] = ["Encorajador", "Confrontador", "Pastoral", "Reflexivo", "Celebrativo"];
const pointOptions: PointsCount[] = [3, 4, 5];

interface Props {
  onGenerate: (data: GeneratorFormData) => void;
  loading: boolean;
}

export function GeneratorForm({ onGenerate, loading }: Props) {
  const [type, setType] = useState<ContentType>("Pregação");
  const [theme, setTheme] = useState("");
  const [audience, setAudience] = useState<Audience>("Igreja");
  const [duration, setDuration] = useState<Duration>(20);
  const [style, setStyle] = useState<Style>("Profundo");
  const [tone, setTone] = useState<Tone>("Pastoral");
  const [points, setPoints] = useState<PointsCount>(4);
  const [version, setVersion] = useState<BibleVersion>("ARC");
  const [references, setReferences] = useState<BibleReference[]>([]);
  const [errors, setErrors] = useState<{ theme?: string; refs?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!theme.trim()) newErrors.theme = "Informe o tema do conteúdo.";
    if (references.length === 0) newErrors.refs = "Adicione ao menos um texto bíblico base.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    onGenerate({ type, theme, audience, duration, style, tone, points, references });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-border bg-card/80 p-6 shadow-elegant backdrop-blur-sm md:p-7"
    >
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-soft">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold">Novo conteúdo</h2>
          <p className="text-sm text-muted-foreground">
            Escolha versão, texto(s) base e configure os parâmetros.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <BibleSelector
          references={references}
          onChange={(r) => { setReferences(r); setErrors((p) => ({ ...p, refs: undefined })); }}
          globalVersion={version}
          onVersionChange={setVersion}
        />
        {errors.refs && (
          <p className="flex items-center gap-1.5 text-xs text-destructive">
            <AlertCircle className="h-3.5 w-3.5" />{errors.refs}
          </p>
        )}

        <div className="h-px bg-border" />

        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">3</span>
            Configuração
          </Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Tipo de conteúdo</Label>
          <Select value={type} onValueChange={(v) => setType(v as ContentType)}>
            <SelectTrigger id="type" className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              {types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="theme">Tema <span className="text-destructive">*</span></Label>
          <Input
            id="theme" value={theme}
            onChange={(e) => { setTheme(e.target.value); setErrors((p) => ({ ...p, theme: undefined })); }}
            placeholder="Ex.: A graça que transforma"
            className={cn(
              "h-11 rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-primary/40",
              errors.theme && "border-destructive focus-visible:ring-destructive/40",
            )}
          />
          {errors.theme && (
            <p className="flex items-center gap-1.5 text-xs text-destructive">
              <AlertCircle className="h-3.5 w-3.5" />{errors.theme}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Público alvo</Label>
            <Select value={audience} onValueChange={(v) => setAudience(v as Audience)}>
              <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>{audiences.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Tempo estimado</Label>
            <Select value={String(duration)} onValueChange={(v) => setDuration(Number(v) as Duration)}>
              <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>{durations.map((d) => <SelectItem key={d} value={String(d)}>{d} minutos</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Tom adicional</Label>
            <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
              <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>{tones.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Quantidade de pontos</Label>
            <div className="flex gap-2">
              {pointOptions.map((p) => {
                const active = points === p;
                return (
                  <button
                    key={p} type="button" onClick={() => setPoints(p)}
                    className={cn(
                      "h-11 flex-1 rounded-xl border text-sm font-medium transition-all",
                      active
                        ? "border-primary bg-primary-soft text-primary shadow-sm"
                        : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
                    )}
                  >{p}</button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Estilo</Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {styles.map((s) => {
              const active = style === s;
              return (
                <button
                  key={s} type="button" onClick={() => setStyle(s)}
                  className={cn(
                    "rounded-xl border px-3 py-2.5 text-sm font-medium transition-all",
                    active
                      ? "border-primary bg-primary-soft text-primary shadow-sm"
                      : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
                  )}
                >{s}</button>
              );
            })}
          </div>
        </div>

        <Button
          type="submit" disabled={loading}
          className="group relative h-12 w-full overflow-hidden rounded-xl gradient-primary text-base font-medium text-primary-foreground shadow-premium transition-all hover:shadow-glow disabled:opacity-80"
        >
          {loading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Gerando conteúdo...</>
          ) : (
            <><Sparkles className="mr-2 h-4 w-4" />Gerar conteúdo</>
          )}
        </Button>
      </div>
    </form>
  );
}
