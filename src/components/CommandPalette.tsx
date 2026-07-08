import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { search, type SearchResult, type SearchCategory } from "@/services/search";
import {
  Home,
  AlertCircle,
  Activity,
  Server,
  Boxes,
  GitBranch,
  FileText,
  Play,
  Briefcase,
  Settings,
  FileBarChart,
  Search,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Moon,
  Sun,
  Command,
} from "lucide-react";

interface Command {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: "navigation" | "actions" | "search" | "automation" | "infrastructure" | "ai" | "administration";
  shortcut?: string;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mode, setMode] = useState<"commands" | "search">("commands");

  // Navigation commands
  const navigationCommands: Command[] = useMemo(() => [
    {
      id: "nav-dashboard",
      title: "Go to Dashboard",
      description: "Platform overview and metrics",
      icon: <Home className="h-4 w-4" />,
      category: "navigation",
      action: () => { navigate({ to: "/" }); onClose(); },
    },
    {
      id: "nav-incidents",
      title: "Go to Incidents",
      description: "Active incidents and alerts",
      icon: <AlertCircle className="h-4 w-4" />,
      category: "navigation",
      action: () => { navigate({ to: "/incidents" }); onClose(); },
    },
    {
      id: "nav-monitoring",
      title: "Go to Monitoring",
      description: "Real-time system monitoring",
      icon: <Activity className="h-4 w-4" />,
      category: "navigation",
      action: () => { navigate({ to: "/monitoring" }); onClose(); },
    },
    {
      id: "nav-infrastructure",
      title: "Go to Infrastructure",
      description: "Nodes, clusters, and resources",
      icon: <Server className="h-4 w-4" />,
      category: "navigation",
      action: () => { navigate({ to: "/infrastructure" }); onClose(); },
    },
    {
      id: "nav-services",
      title: "Go to Services",
      description: "Service catalog and health",
      icon: <Boxes className="h-4 w-4" />,
      category: "navigation",
      action: () => { navigate({ to: "/services" }); onClose(); },
    },
    {
      id: "nav-automation",
      title: "Go to Automation",
      description: "Automation overview",
      icon: <GitBranch className="h-4 w-4" />,
      category: "navigation",
      action: () => { navigate({ to: "/automation" }); onClose(); },
    },
    {
      id: "nav-playbooks",
      title: "Go to Playbooks",
      description: "Automation playbooks",
      icon: <FileText className="h-4 w-4" />,
      category: "navigation",
      action: () => { navigate({ to: "/playbooks" }); onClose(); },
    },
    {
      id: "nav-workflows",
      title: "Go to Workflows",
      description: "Workflow designer and execution",
      icon: <GitBranch className="h-4 w-4" />,
      category: "navigation",
      action: () => { navigate({ to: "/workflows" }); onClose(); },
    },
    {
      id: "nav-jobs",
      title: "Go to Jobs",
      description: "Job execution history",
      icon: <Play className="h-4 w-4" />,
      category: "navigation",
      action: () => { navigate({ to: "/jobs" }); onClose(); },
    },
    {
      id: "nav-ai",
      title: "Go to AI Workspace",
      description: "AI-powered operations",
      icon: <Briefcase className="h-4 w-4" />,
      category: "navigation",
      action: () => { navigate({ to: "/ai" }); onClose(); },
    },
    {
      id: "nav-settings",
      title: "Go to Settings",
      description: "Platform configuration",
      icon: <Settings className="h-4 w-4" />,
      category: "navigation",
      action: () => { navigate({ to: "/settings" }); onClose(); },
    },
    {
      id: "nav-reports",
      title: "Go to Reports",
      description: "Analytics and reporting",
      icon: <FileBarChart className="h-4 w-4" />,
      category: "navigation",
      action: () => { navigate({ to: "/reports" }); onClose(); },
    },
  ], [navigate, onClose]);

  // Action commands
  const actionCommands: Command[] = useMemo(() => [
    {
      id: "action-create-incident",
      title: "Create Incident",
      description: "Report a new incident",
      icon: <Plus className="h-4 w-4" />,
      category: "actions",
      action: () => { navigate({ to: "/incidents" }); onClose(); },
    },
    {
      id: "action-run-playbook",
      title: "Run Playbook",
      description: "Execute automation playbook",
      icon: <Play className="h-4 w-4" />,
      category: "automation",
      shortcut: "⌘P",
      action: () => { navigate({ to: "/playbooks" }); onClose(); },
    },
    {
      id: "action-restart-service",
      title: "Restart Service",
      description: "Restart a service",
      icon: <RefreshCw className="h-4 w-4" />,
      category: "actions",
      action: () => { navigate({ to: "/services" }); onClose(); },
    },
    {
      id: "action-open-workflow",
      title: "Open Workflow",
      description: "View workflow designer",
      icon: <GitBranch className="h-4 w-4" />,
      category: "automation",
      action: () => { navigate({ to: "/workflows" }); onClose(); },
    },
    {
      id: "action-failed-jobs",
      title: "View Failed Jobs",
      description: "Show recent failures",
      icon: <AlertTriangle className="h-4 w-4" />,
      category: "automation",
      action: () => { navigate({ to: "/jobs" }); onClose(); },
    },
    {
      id: "action-alerts",
      title: "Open Alerts",
      description: "View active alerts",
      icon: <AlertCircle className="h-4 w-4" />,
      category: "actions",
      action: () => { navigate({ to: "/alerts" }); onClose(); },
    },
    {
      id: "action-refresh",
      title: "Refresh Current Screen",
      description: "Reload current data",
      icon: <RefreshCw className="h-4 w-4" />,
      category: "actions",
      shortcut: "⌘R",
      action: () => { window.location.reload(); onClose(); },
    },
    {
      id: "action-health-check",
      title: "Health Check",
      description: "Run platform health check",
      icon: <CheckCircle2 className="h-4 w-4" />,
      category: "infrastructure",
      action: () => { navigate({ to: "/infrastructure" }); onClose(); },
    },
    {
      id: "action-toggle-theme",
      title: "Toggle Theme",
      description: "Switch between light and dark",
      icon: <Moon className="h-4 w-4" />,
      category: "administration",
      shortcut: "⌘T",
      action: () => { /* Theme toggle logic */ onClose(); },
    },
  ], [navigate, onClose]);

  const allCommands = useMemo(() => [...navigationCommands, ...actionCommands], [navigationCommands, actionCommands]);

  // Filter commands based on query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return allCommands;
    const lowerQuery = query.toLowerCase();
    return allCommands.filter(cmd =>
      cmd.title.toLowerCase().includes(lowerQuery) ||
      cmd.description.toLowerCase().includes(lowerQuery)
    );
  }, [query, allCommands]);

  // Debounced search
  useEffect(() => {
    if (mode !== "search" || !query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await search({ query, limit: 20 });
        setSearchResults(results);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [query, mode]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const items = mode === "commands" ? filteredCommands : searchResults;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % items.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (mode === "commands" && filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        } else if (mode === "search" && searchResults[selectedIndex]) {
          const result = searchResults[selectedIndex];
          if (result.route) {
            navigate({ to: result.route });
            onClose();
          }
        }
      } else if (e.key === "Escape") {
        onClose();
      } else if (e.key === "/" && e.ctrlKey) {
        e.preventDefault();
        setMode(mode === "commands" ? "search" : "commands");
        setQuery("");
        setSelectedIndex(0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, mode, filteredCommands, searchResults, selectedIndex, navigate, onClose]);

  // Reset on open/close
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setMode("commands");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const displayItems = mode === "commands" ? filteredCommands : searchResults;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/80"
        onClick={onClose}
      />

      {/* Command Palette */}
      <div className="fixed left-1/2 top-[20%] z-50 w-full max-w-2xl -translate-x-1/2">
        <div className="border-2 border-border-strong bg-surface shadow-2xl">
          {/* Search Input */}
          <div className="flex items-center border-b-2 border-border-strong p-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={mode === "commands" ? "Type a command or search..." : "Search everything..."}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent px-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              autoFocus
            />
            <button
              onClick={() => {
                setMode(mode === "commands" ? "search" : "commands");
                setQuery("");
                setSelectedIndex(0);
              }}
              className="rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:bg-zinc-800 hover:text-foreground"
            >
              {mode === "commands" ? "⌃/ search" : "⌃/ cmds"}
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {displayItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="h-10 w-10 text-muted-foreground/30" />
                <p className="mt-2 text-sm text-muted-foreground">
                  {isSearching ? "Searching..." : "No results found"}
                </p>
              </div>
            ) : mode === "commands" ? (
              filteredCommands.map((cmd, index) => (
                <button
                  key={cmd.id}
                  onClick={cmd.action}
                  className={`flex w-full items-center gap-3 border-b border-border p-3 text-left transition-colors ${
                    index === selectedIndex ? "bg-primary/10 border-l-4 border-l-primary" : "hover:bg-zinc-800/50"
                  }`}
                >
                  <div className="flex h-8 w-8 items-center justify-center border-2 border-border-strong bg-background text-foreground">
                    {cmd.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-sm font-medium text-foreground">{cmd.title}</div>
                    <div className="text-xs text-muted-foreground">{cmd.description}</div>
                  </div>
                  {cmd.shortcut && (
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {cmd.shortcut}
                    </div>
                  )}
                </button>
              ))
            ) : (
              searchResults.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => {
                    if (result.route) {
                      navigate({ to: result.route });
                      onClose();
                    }
                  }}
                  className={`flex w-full items-center gap-3 border-b border-border p-3 text-left transition-colors ${
                    index === selectedIndex ? "bg-primary/10 border-l-4 border-l-primary" : "hover:bg-zinc-800/50"
                  }`}
                >
                  <div className="flex h-8 w-8 items-center justify-center border-2 border-border-strong bg-background text-foreground">
                    {getIconForCategory(result.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium text-foreground">{result.title}</span>
                      {result.badge && (
                        <span className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                          {result.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{result.subtitle}</div>
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {result.category}
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t-2 border-border-strong bg-zinc-900 p-2 px-3">
            <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <span>↑↓ navigate</span>
              <span>↵ select</span>
              <span>esc close</span>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {displayItems.length} results
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function getIconForCategory(category: SearchCategory) {
  const iconMap: Record<SearchCategory, React.ReactNode> = {
    incidents: <AlertCircle className="h-4 w-4" />,
    services: <Boxes className="h-4 w-4" />,
    playbooks: <FileText className="h-4 w-4" />,
    workflows: <GitBranch className="h-4 w-4" />,
    jobs: <Play className="h-4 w-4" />,
    nodes: <Server className="h-4 w-4" />,
    knowledge: <FileText className="h-4 w-4" />,
    users: <Plus className="h-4 w-4" />,
    settings: <Settings className="h-4 w-4" />,
    navigation: <Command className="h-4 w-4" />,
    actions: <Play className="h-4 w-4" />,
  };
  return iconMap[category] || <Search className="h-4 w-4" />;
}

// Global hook for keyboard shortcut
export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return { isOpen, setIsOpen };
}
