
import { Outlet, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AnalyticsAppSidebar } from "@/features/analytics-hub/components/app-sidebar";

export function AnalyticsHubLayout() {
  const style: React.CSSProperties = {
  "--sidebar-width": "16rem",
  "--sidebar-width-icon": "3rem",
} as React.CSSProperties;


  return (
    <SidebarProvider style={style}>
      <div className="flex h-screen w-full">
        <AnalyticsAppSidebar />
        <SidebarInset className="flex flex-1 flex-col">
          <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-2 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-2">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <span className="text-sm text-muted-foreground">E-commerce Analytics Platform</span>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </header>
          <main className="flex-1 overflow-auto bg-[radial-gradient(60%_60%_at_10%_0%,rgba(254,243,199,0.7)_0%,rgba(255,255,255,0)_60%),radial-gradient(45%_45%_at_100%_0%,rgba(219,234,254,0.7)_0%,rgba(255,255,255,0)_55%),radial-gradient(50%_50%_at_0%_100%,rgba(220,252,231,0.6)_0%,rgba(255,255,255,0)_60%)] p-6 dark:bg-background">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
