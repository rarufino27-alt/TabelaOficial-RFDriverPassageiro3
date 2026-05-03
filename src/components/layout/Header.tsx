import { SidebarTrigger } from "@/components/ui/sidebar";
import { Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl md:px-8">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
      <div className="flex flex-1 items-center justify-between gap-3">
        <div className="flex flex-col leading-tight">
          <h1 className="font-display text-xl font-semibold tracking-tight md:text-2xl">{title}</h1>
          {subtitle && <p className="text-xs text-muted-foreground md:text-sm">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-sm md:flex">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Premium</span>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
