import type { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { TopNav } from "./TopNav";
import { CommandPaletteProvider } from "../command/CommandPaletteProvider";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <CommandPaletteProvider>
      <div className="flex h-dvh w-full overflow-hidden bg-background text-foreground">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopNav />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </CommandPaletteProvider>
  );
}
