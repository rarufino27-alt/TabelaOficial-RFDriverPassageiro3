import { Sparkles } from "lucide-react";

interface Props {
  variant?: "top" | "inline";
}

export function SpiritualBanner({ variant = "top" }: Props) {
  if (variant === "inline") {
    return (
      <div className="rounded-2xl border border-primary/20 bg-primary-soft/60 px-5 py-4 text-sm leading-relaxed text-foreground/85 shadow-sm">
        <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          Direção espiritual
        </div>
        <p className="font-display italic">
          Este conteúdo é um apoio para seu estudo. A direção verdadeira vem de Deus.
          Busque sempre a orientação do Espírito Santo.
        </p>
      </div>
    );
  }
  return (
    <div className="border-b border-border/60 bg-gradient-to-r from-primary-soft/70 via-background to-primary-soft/70">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-[12.5px] leading-snug text-foreground/80 md:text-sm">
        <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary" />
        <span className="font-display italic">
          Este conteúdo é apoio ao seu estudo. A direção verdadeira vem de Deus —
          busque sempre a orientação do Espírito Santo.
        </span>
      </div>
    </div>
  );
}
