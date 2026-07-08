import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { PageHeader } from "@/components/shared/PageHeader";
import { Panel, Metric } from "@/components/shared/Panel";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { usePlaybooks } from "@/hooks/useAutomation";
import type { Playbook } from "@/types";
import {
  Search,
  RefreshCw,
  Plus,
  Play,
  Copy,
  Pause,
  Archive,
  Trash2,
  Filter,
  ArrowUpDown,
} from "lucide-react";

export const Route = createFileRoute("/playbooks")({
  head: () => ({
    meta: [
      { title: "Playbooks — Hermes" },
      { name: "description", content: "Automation playbook management and execution." },
    ],
  }),
  component: () => (
    <ErrorBoundary>
      <PlaybooksPage />
    </ErrorBoundary>
  ),
});

type StatusFilter = "all" | "active" | "inactive" | "archived";
type RiskFilter = "all" | "low" | "medium" | "high" | "critical";

const columnHelper = createColumnHelper<Playbook>();

function PlaybooksPage() {
  const { data: playbooks = [], isLoading, refetch } = usePlaybooks();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [riskFilter, setRiskFilter] = useState<RiskFilter>("all");

  // Filter data
  const filteredData = useMemo(() => {
    let filtered = playbooks;

    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    if (riskFilter !== "all") {
      filtered = filtered.filter((p) => p.risk === riskFilter);
    }

    return filtered;
  }, [playbooks, statusFilter, riskFilter]);

  // Calculate summary metrics
  const totalPlaybooks = playbooks.length;
  const activePlaybooks = playbooks.filter((p) => p.status === "active").length;
  const inactivePlaybooks = playbooks.filter((p) => p.status === "inactive").length;
  const archivedPlaybooks = playbooks.filter((p) => p.status === "archived").length;

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            Name
            <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
        cell: (info) => (
          <div className="flex flex-col gap-1">
            <span className="font-mono text-sm font-medium text-foreground">{info.getValue()}</span>
            <span className="text-xs text-muted-foreground">{info.row.original.description}</span>
          </div>
        ),
      }),
      columnHelper.accessor("version", {
        header: "Version",
        cell: (info) => (
          <span className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            {info.getValue() || "N/A"}
          </span>
        ),
      }),
      columnHelper.accessor("risk", {
        header: "Risk",
        cell: (info) => {
          const risk = info.getValue();
          const colors = {
            low: "text-healthy border-healthy/30 bg-healthy/10",
            medium: "text-warning border-warning/30 bg-warning/10",
            high: "text-critical border-critical/30 bg-critical/10",
            critical: "text-critical border-critical/50 bg-critical/20",
          };
          return (
            <span
              className={`inline-flex items-center border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest ${
                colors[risk || "low"]
              }`}
            >
              {risk || "N/A"}
            </span>
          );
        },
      }),
      columnHelper.accessor("tags", {
        header: "Tags",
        cell: (info) => (
          <div className="flex flex-wrap gap-1">
            {(info.getValue() || []).slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground"
              >
                {tag}
              </span>
            ))}
            {(info.getValue() || []).length > 2 && (
              <span className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
                +{(info.getValue() || []).length - 2}
              </span>
            )}
          </div>
        ),
      }),
      columnHelper.accessor("owner", {
        header: "Owner",
        cell: (info) => (
          <span className="font-mono text-xs text-muted-foreground">{info.getValue() || "N/A"}</span>
        ),
      }),
      columnHelper.accessor("executions", {
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            Executions
            <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
        cell: (info) => (
          <span className="font-mono text-sm text-foreground">{info.getValue().toLocaleString()}</span>
        ),
      }),
      columnHelper.accessor("successRate", {
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            Success Rate
            <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
        cell: (info) => {
          const rate = info.getValue();
          const color = rate >= 98 ? "text-healthy" : rate >= 95 ? "text-warning" : "text-critical";
          return <span className={`font-mono text-sm font-medium ${color}`}>{rate.toFixed(1)}%</span>;
        },
      }),
      columnHelper.accessor("lastRun", {
        header: "Last Execution",
        cell: (info) => {
          const lastRun = info.getValue();
          if (!lastRun) return <span className="text-xs text-muted-foreground">Never</span>;
          const minutesAgo = Math.floor((Date.now() - new Date(lastRun).getTime()) / 60000);
          if (minutesAgo < 60) {
            return <span className="text-xs text-muted-foreground">{minutesAgo}m ago</span>;
          } else if (minutesAgo < 1440) {
            return <span className="text-xs text-muted-foreground">{Math.floor(minutesAgo / 60)}h ago</span>;
          } else {
            return (
              <span className="text-xs text-muted-foreground">{Math.floor(minutesAgo / 1440)}d ago</span>
            );
          }
        },
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const status = info.getValue();
          const colors = {
            active: "bg-healthy/20 text-healthy border-healthy/30",
            inactive: "bg-zinc-800 text-muted-foreground border-border",
            archived: "bg-zinc-900 text-muted-foreground/50 border-border",
          };
          return (
            <span
              className={`inline-flex items-center gap-1.5 border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest ${colors[status]}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${status === "active" ? "bg-healthy" : "bg-muted-foreground"}`}
              />
              {status}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex items-center gap-1">
            <button
              className="flex h-7 w-7 items-center justify-center border-2 border-border-strong bg-surface text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              title="Execute playbook"
            >
              <Play className="h-3 w-3" />
            </button>
            <button
              className="flex h-7 w-7 items-center justify-center border-2 border-border-strong bg-surface text-muted-foreground transition-colors hover:border-info hover:text-info"
              title="Duplicate playbook"
            >
              <Copy className="h-3 w-3" />
            </button>
            {info.row.original.status === "active" ? (
              <button
                className="flex h-7 w-7 items-center justify-center border-2 border-border-strong bg-surface text-muted-foreground transition-colors hover:border-warning hover:text-warning"
                title="Disable playbook"
              >
                <Pause className="h-3 w-3" />
              </button>
            ) : (
              <button
                className="flex h-7 w-7 items-center justify-center border-2 border-border-strong bg-surface text-muted-foreground transition-colors hover:border-warning hover:text-warning"
                title="Archive playbook"
              >
                <Archive className="h-3 w-3" />
              </button>
            )}
            <button
              className="flex h-7 w-7 items-center justify-center border-2 border-border-strong bg-surface text-muted-foreground transition-colors hover:border-critical hover:text-critical"
              title="Delete playbook"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div className="h-20 animate-pulse bg-zinc-800" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse bg-zinc-800" />
          ))}
        </div>
        <div className="h-96 animate-pulse bg-zinc-800" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHeader
        eyebrow="automation"
        title="Playbooks"
        description="Automation playbook management and execution"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => refetch()}
              className="flex h-8 items-center gap-1.5 border-2 border-border-strong bg-surface px-2 font-mono text-[10.5px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className="h-3 w-3" />
              refresh
            </button>
            <button className="flex h-8 items-center gap-1.5 border-2 border-primary bg-primary px-3 font-mono text-[10.5px] uppercase tracking-widest text-primary-foreground hover:bg-primary/90">
              <Plus className="h-3 w-3" />
              Create Playbook
            </button>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Metric label="Total Playbooks" value={totalPlaybooks} delta="" deltaTone="neutral" />
        <Metric label="Active" value={activePlaybooks} delta="" deltaTone="positive" />
        <Metric label="Inactive" value={inactivePlaybooks} delta="" deltaTone="neutral" />
        <Metric label="Archived" value={archivedPlaybooks} delta="" deltaTone="neutral" />
      </div>

      {/* Main Table */}
      <Panel
        title="Playbooks"
        action={
          <span className="font-mono text-[10.5px] text-muted-foreground">
            {table.getFilteredRowModel().rows.length} of {playbooks.length}
          </span>
        }
      >
        <div className="flex flex-col gap-3">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="flex flex-1 items-center gap-2 border-2 border-border-strong bg-surface px-2">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search playbooks..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="h-8 flex-1 bg-transparent font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 border-2 border-border-strong">
              <span className="px-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                status:
              </span>
              {(["all", "active", "inactive", "archived"] as StatusFilter[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`h-7 px-2 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                    statusFilter === status
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Risk Filter */}
            <div className="flex items-center gap-1 border-2 border-border-strong">
              <span className="px-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                risk:
              </span>
              {(["all", "low", "medium", "high", "critical"] as RiskFilter[]).map((risk) => (
                <button
                  key={risk}
                  onClick={() => setRiskFilter(risk)}
                  className={`h-7 px-2 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                    riskFilter === risk
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {risk}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 z-10 border-b-2 border-border-strong bg-surface">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="border-b-2 border-border-strong px-3 py-2 text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Filter className="h-10 w-10 text-muted-foreground/30" />
                        <p className="text-sm text-muted-foreground">No playbooks match your filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="group cursor-pointer border-b border-border transition-colors hover:bg-zinc-800/50"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-3 py-3">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Panel>
    </div>
  );
}
