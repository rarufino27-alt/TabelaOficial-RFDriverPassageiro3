import { useState } from "react";
import {
  Copy, Check, BookOpen, Quote, Lightbulb, MessageSquare, Sparkles, FileText, Download, FileDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import type { GeneratedContent } from "@/types/content";
import { formatAsPlainText } from "@/utils/generator";
import { exportAsPdf } from "@/utils/exportPdf";
import { SpiritualBanner } from "@/components/SpiritualBanner";

interface Props {
  content: GeneratedContent | null;
  loading: boolean;
}

function Section({
  icon: Icon, label, children, animateDelay = 0,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
  animateDelay?: number;
}) {
  return (
    <section
      className="space-y-3 animate-fade-in"
      style={{ animationDelay: `${animateDelay}ms`, animationFillMode: "backwards" }}
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="text-[15px] leading-relaxed text-foreground/90">{children}</div>
    </section>
  );
}

export function ContentResult({ content, loading }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(formatAsPlainText(content));
    setCopied(true);
    toast({ title: "Conteúdo copiado", description: "Pronto para colar onde quiser." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportText = () => {
    if (!content) return;
    const blob = new Blob([formatAsPlainText(content)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${content.title.replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Texto exportado" });
  };

  const handleExportPdf = async () => {
    if (!content) return;
    try {
      await exportAsPdf(content);
      toast({ title: "PDF gerado" });
    } catch {
      toast({ title: "Erro ao gerar PDF", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-elegant">
        <div className="space-y-4 p-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full gradient-primary shadow-glow">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="font-display text-base font-medium">Tecendo as palavras...</p>
              <p className="text-xs text-muted-foreground">Estruturando teologia, contexto e aplicação.</p>
            </div>
          </div>
          <div className="space-y-3 pt-4">
            <ShimmerLine className="h-8 w-3/4" />
            <ShimmerLine className="h-4 w-1/3" />
            <div className="h-px bg-border" />
            <ShimmerLine className="h-4 w-full" />
            <ShimmerLine className="h-4 w-11/12" />
            <ShimmerLine className="h-4 w-10/12" />
            <div className="h-px bg-border" />
            <ShimmerLine className="h-4 w-full" />
            <ShimmerLine className="h-4 w-5/6" />
            <ShimmerLine className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 p-8 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft">
          <FileText className="h-6 w-6 text-primary" />
        </div>
        <p className="font-display text-xl font-semibold">Seu conteúdo aparecerá aqui</p>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Preencha o formulário ao lado e nossa engenharia textual entregará uma estrutura completa,
          com profundidade teológica e clareza pastoral.
        </p>
      </div>
    );
  }

  return (
    <article className="animate-fade-in-up overflow-hidden rounded-3xl border border-border bg-card shadow-elegant">
      <header className="relative gradient-hero border-b border-border px-6 py-8 md:px-10 md:py-10">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">{content.meta.type}</span>
          <Pill>{content.meta.audience}</Pill>
          <Pill>{content.meta.duration} min</Pill>
          <Pill>{content.meta.style}</Pill>
          <Pill>{content.meta.tone}</Pill>
          <Pill>{content.meta.version}</Pill>
        </div>
        <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight md:text-4xl">{content.title}</h2>
        <p className="mt-3 flex items-center gap-2 text-sm font-medium text-primary">
          <BookOpen className="h-4 w-4" />
          {content.scriptureLabel}
        </p>
        <p className="mt-1 max-w-2xl text-xs italic text-muted-foreground">{content.scriptureQuote}</p>

        <div className="absolute right-4 top-4 flex items-center gap-2 md:right-6 md:top-6">
          <Button onClick={handleCopy} variant="outline" size="sm" className="rounded-full">
            {copied ? <><Check className="mr-1.5 h-3.5 w-3.5" />Copiado</> : <><Copy className="mr-1.5 h-3.5 w-3.5" />Copiar</>}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-full">
                <Download className="mr-1.5 h-3.5 w-3.5" />Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleExportText}>
                <FileText className="mr-2 h-4 w-4" />Texto formatado (.txt)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportPdf}>
                <FileDown className="mr-2 h-4 w-4" />PDF (.pdf)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="space-y-8 px-6 py-8 md:px-10 md:py-10">
        <SpiritualBanner variant="inline" />

        <Section icon={BookOpen} label="Texto bíblico base" animateDelay={20}>
          <div className="space-y-3">
            {content.references.map((r) => (
              <div key={r.id} className="rounded-2xl border border-primary/20 bg-primary-soft/40 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
                  <BookOpen className="h-3.5 w-3.5" /> {r.label}
                  <span className="rounded-full bg-background/70 px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">{r.version}</span>
                </div>
                <div className="space-y-1 text-[15px] leading-relaxed text-foreground/90">
                  {r.verseList.map((v) => (
                    <p key={v.verse}>
                      <sup className="mr-1 text-xs font-bold text-primary">{v.verse}</sup>
                      {v.text}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section icon={Sparkles} label="Análise temática" animateDelay={40}>
          <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Tema central</p>
              <p className="font-display text-base font-semibold">{content.analysis.mainTheme}</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {content.analysis.keywords.map((k) => (
                <span key={k} className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  {k}
                </span>
              ))}
            </div>
            {content.analysis.insights.length > 0 && (
              <ul className="space-y-1.5 text-sm text-foreground/85">
                {content.analysis.insights.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Section>

        <hr className="border-border" />

        <Section icon={FileText} label="Introdução" animateDelay={50}>
          {content.introduction.split("\n\n").map((p, i) => (
            <p key={i} className={i > 0 ? "mt-3 text-xs text-muted-foreground" : ""}>{p}</p>
          ))}
        </Section>

        <hr className="border-border" />

        <Section icon={BookOpen} label="Contexto histórico-teológico" animateDelay={100}>
          <p>{content.context}</p>
        </Section>

        <hr className="border-border" />

        <Section icon={Sparkles} label="Desenvolvimento" animateDelay={150}>
          <ol className="space-y-5">
            {content.development.map((p, i) => (
              <li
                key={i}
                className="flex gap-4 animate-fade-in"
                style={{ animationDelay: `${200 + i * 80}ms`, animationFillMode: "backwards" }}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft font-display text-sm font-semibold text-primary">
                  {i + 1}
                </span>
                <div>
                  <h4 className="font-display text-base font-semibold">{p.title}</h4>
                  {p.anchor && (
                    <p className="mt-0.5 text-[11px] uppercase tracking-wider text-primary/70">{p.anchor}</p>
                  )}
                  <p className="mt-1.5 text-foreground/80">{p.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <hr className="border-border" />

        <Section icon={Lightbulb} label="Aplicação prática" animateDelay={250}>
          <p>{content.application}</p>
        </Section>

        <Section icon={Quote} label="Conclusão" animateDelay={300}>
          <p>{content.conclusion}</p>
        </Section>

        <hr className="border-border" />

        <Section icon={BookOpen} label="Referências cruzadas" animateDelay={350}>
          <div className="flex flex-wrap gap-2">
            {content.crossReferences.map((v) => (
              <span key={v} className="rounded-full border border-primary/30 bg-primary-soft px-3 py-1.5 text-sm font-medium text-primary">
                {v}
              </span>
            ))}
          </div>
        </Section>

        <Section icon={Lightbulb} label="Ilustração" animateDelay={400}>
          <p className="italic text-foreground/85">{content.illustration}</p>
        </Section>

        <div className="rounded-2xl gradient-primary p-[1.5px] shadow-glow animate-fade-in-up" style={{ animationDelay: "450ms", animationFillMode: "backwards" }}>
          <div className="rounded-2xl bg-card px-6 py-6">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <Quote className="h-3.5 w-3.5" /> Frase de impacto
            </div>
            <p className="font-display text-xl font-medium leading-snug md:text-2xl">{content.impactPhrase}</p>
          </div>
        </div>

        <Section icon={MessageSquare} label="Perguntas para reflexão" animateDelay={500}>
          <ul className="space-y-2.5">
            {content.questions.map((q, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </Section>

        <hr className="border-border" />

        <Section icon={Sparkles} label="Chamada à ação" animateDelay={550}>
          <p className="font-medium text-foreground">{content.callToAction}</p>
        </Section>
      </div>
    </article>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-border bg-background/80 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
      {children}
    </span>
  );
}

function ShimmerLine({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-md bg-muted ${className}`}
    >
      <div
        className="absolute inset-0 animate-shimmer"
        style={{
          backgroundImage:
            "linear-gradient(90deg, transparent 0%, hsl(var(--primary) / 0.10) 50%, transparent 100%)",
          backgroundSize: "200% 100%",
        }}
      />
    </div>
  );
}
