import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  Fingerprint,
  Gauge,
  History,
  LayoutDashboard,
  ListChecks,
  ScanFace,
  Settings2,
  ShieldAlert,
  TriangleAlert,
  VenetianMask,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const SECTIONS = [
  { hash: "overview", label: "Overview", icon: BarChart3 },
  { hash: "status", label: "System status", icon: Gauge },
  { hash: "authenticate", label: "Authentication", icon: ScanFace },
  { hash: "scenarios", label: "Scenarios", icon: VenetianMask },
  { hash: "decision", label: "Decision", icon: ShieldAlert },
  { hash: "history", label: "History", icon: History },
  { hash: "activity", label: "Activity", icon: Activity },
  { hash: "checklist", label: "Checklist", icon: ListChecks },
  { hash: "limitations", label: "Limitations", icon: TriangleAlert },
] as const;

export function TriveraMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground ${className}`}
    >
      <Fingerprint aria-hidden className="size-4.5" />
    </span>
  );
}

export function AppSidebar() {
  const { isMobile, setOpenMobile } = useSidebar();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hash = useRouterState({ select: (s) => s.location.hash });
  const close = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar collapsible="icon" aria-label="Main navigation">
      <SidebarHeader>
        <Link
          to="/"
          onClick={close}
          className="flex items-center gap-2.5 rounded-md p-1.5 group-data-[collapsible=icon]:p-0"
        >
          <TriveraMark />
          <span className="min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="block font-display text-base leading-tight font-semibold text-sidebar-foreground">
              Trivera
            </span>
            <span className="block text-xs text-muted-foreground">HID Hackathon prototype</span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/"} tooltip="Dashboard">
                  <Link to="/" onClick={close}>
                    <LayoutDashboard aria-hidden />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/setup"} tooltip="Setup">
                  <Link to="/setup" onClick={close}>
                    <Settings2 aria-hidden />
                    <span>Setup</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Dashboard sections</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SECTIONS.map((s) => (
                <SidebarMenuItem key={s.hash}>
                  <SidebarMenuButton
                    asChild
                    size="sm"
                    tooltip={s.label}
                    isActive={pathname === "/" && hash === s.hash}
                  >
                    <Link to="/" hash={s.hash} onClick={close}>
                      <s.icon aria-hidden />
                      <span>{s.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="group-data-[collapsible=icon]:hidden">
        <div className="rounded-xl border border-warning/45 bg-warning-soft p-3 text-xs text-warning-strong">
          <p className="font-semibold">M0 demo shell</p>
          <p className="mt-0.5">Outcomes are simulations. API integration pending.</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
