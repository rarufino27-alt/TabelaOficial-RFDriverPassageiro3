import { BookOpen } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Sparkles, History, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Gerador", url: "/", icon: Sparkles },
  { title: "Histórico", url: "/historico", icon: History, disabled: true },
  { title: "Configurações", url: "/configuracoes", icon: Settings, disabled: true },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const isActive = (path: string) => pathname === path;

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2.5 px-2 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl gradient-primary shadow-glow">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="font-display text-lg font-semibold tracking-tight">BibleBuilder</span>
              <span className="text-[11px] text-muted-foreground">Estudos &amp; Pregações</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild={!item.disabled}
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    className="data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:font-medium"
                  >
                    {item.disabled ? (
                      <button
                        type="button"
                        disabled
                        className="flex w-full items-center gap-2 opacity-50 cursor-not-allowed"
                        title="Em breve"
                      >
                        <item.icon className="h-4 w-4" />
                        {!collapsed && (
                          <span className="flex w-full items-center justify-between">
                            {item.title}
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">soon</span>
                          </span>
                        )}
                      </button>
                    ) : (
                      <NavLink to={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
