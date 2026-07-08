import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  AlertOctagon,
  Activity,
  Server,
  Workflow,
  Sparkles,
  ShieldCheck,
  Users,
  Cog,
  TerminalSquare,
  BookOpen,
  Bell,
  Plus,
  RefreshCw,
  Power,
} from "lucide-react";

type Ctx = { open: () => void; close: () => void; isOpen: boolean };
const CommandPaletteContext = createContext<Ctx | null>(null);

export function useCommandPalette() {
  const ctx = useContext(CommandPaletteContext);
  if (!ctx) throw new Error("CommandPaletteProvider missing");
  return ctx;
}

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const navigate = useNavigate();

  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const go = (to: string) => {
    setOpen(false);
    navigate({ to });
  };

  return (
    <CommandPaletteContext.Provider value={{ open, close, isOpen }}>
      {children}
      <CommandDialog open={isOpen} onOpenChange={setOpen}>
        <CommandInput placeholder="Search resources, run commands, jump to…" />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup heading="Navigate">
            <CommandItem onSelect={() => go("/")}>
              <LayoutDashboard /> Dashboard
            </CommandItem>
            <CommandItem onSelect={() => go("/incidents")}>
              <AlertOctagon /> Incidents
            </CommandItem>
            <CommandItem onSelect={() => go("/monitoring")}>
              <Activity /> Monitoring
            </CommandItem>
            <CommandItem onSelect={() => go("/alerts")}>
              <Bell /> Alert Center
            </CommandItem>
            <CommandItem onSelect={() => go("/infrastructure")}>
              <Server /> Infrastructure
            </CommandItem>
            <CommandItem onSelect={() => go("/automation")}>
              <Workflow /> Automation
            </CommandItem>
            <CommandItem onSelect={() => go("/ai")}>
              <Sparkles /> AI Workspace
            </CommandItem>
            <CommandItem onSelect={() => go("/knowledge")}>
              <BookOpen /> Knowledge Base
            </CommandItem>
            <CommandItem onSelect={() => go("/audit")}>
              <ShieldCheck /> Audit
            </CommandItem>
            <CommandItem onSelect={() => go("/identity")}>
              <Users /> Identity & Access
            </CommandItem>
            <CommandItem onSelect={() => go("/admin")}>
              <Cog /> Administration
            </CommandItem>
            <CommandItem onSelect={() => go("/developer")}>
              <TerminalSquare /> Developer Hub
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => go("/incidents")}>
              <Plus /> Declare incident
            </CommandItem>
            <CommandItem onSelect={() => go("/automation")}>
              <Workflow /> Run playbook…
            </CommandItem>
            <CommandItem onSelect={() => go("/change")}>
              <RefreshCw /> New change request
            </CommandItem>
            <CommandItem onSelect={() => go("/infrastructure")}>
              <Power /> Restart service…
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </CommandPaletteContext.Provider>
  );
}
