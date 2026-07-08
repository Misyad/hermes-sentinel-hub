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
import { Panel } from "@/components/shared/Panel";
import { mockAlerts } from "@/mock";
import type { Alert } from "@/mock/types";
import { Search, Filter, Bell, BellOff, Check, X, ArrowUpDown } from "lucide-react";

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: "Alerts — Hermes" },
      { name: "description", content: "Alert management and alerting rules." },
    ],
  }),
  component: AlertsPage,
});

type SeverityFilter = "all" | "critical" | "high" | "medium" | "low";
type StatusFilter = "all" | "firing" | "pending" | "resolved";

function AlertsPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // Filter data based on severity and status
  const filteredData = useMemo(() => {
    let filtered = mockAlerts;
    
    if (severityFilter !== "all") {
      filtered = filtered.filter((a) => a.severity === severityFilter);
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter((a) => a.status === statusFilter);
    }
    
    return filtered;
  }, [severityFilter, statusFilter]);

  // Count alerts by status
  const alertCounts = useMemo(() => {
    return {
      firing: mockAlerts.filter((a) => a.status === "firing").length,
      pending: mockAlerts.filter((a) => a.status === "pending").length,
      resolved: mockAlerts.filter((a) => a.status === "resolved").length,
      total: mockAlerts.length,
    };
  }, []);

  const columnHelper = createColumnHelper<Alert>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("severity", {
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center gap-1 font-mono text-[10.5px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            severity
            <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
        cell: (info) => {
          const severity = info.getValue();
          return (
            <span
              className={`inline-block rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest ${
                severity === "critical"
                  ? "bg-critical text-white"
                  : severity === "high"
                    ? "bg-warning text-zinc-900"
                    : severity === "medium"
                      ? "bg-info text-white"
                      : "bg-zinc-600 text-white"
              }`}
            >
              {severity}
            </span>
          );
        },
        size: 100,
      }),
      columnHelper.accessor("title", {
        header: () => (
          <span className="font-mono text-[10.5px] uppercase tracking-widest text-muted-foreground">
            alert
          </span>
        ),
        cell: (info) => (
          <span className="text-sm font-medium text-foreground">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("service", {
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center gap-1 font-mono text-[10.5px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            service
            <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
        cell: (info) => (
          <span className="font-mono text-xs text-muted-foreground">{info.getValue()}</span>
        ),
        size: 150,
      }),
      columnHelper.accessor("status", {
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center gap-1 font-mono text-[10.5px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            status
            <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
        cell: (info) => {
          const status = info.getValue();
          return (
            <span
              className={`inline-block rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest ${
                status === "firing"
                  ? "bg-critical/20 text-critical"
                  : status === "pending"
                    ? "bg-warning/20 text-warning"
                    : "bg-healthy/20 text-healthy"
              }`}
            >
              {status}
            </span>
          );
        },
        size: 100,
      }),
      columnHelper.accessor("duration", {
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center gap-1 font-mono text-[10.5px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            duration
            <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
        cell: (info) => (
          <span className="font-mono text-xs text-muted-foreground">{info.getValue()}</span>
        ),
        size: 100,
      }),
      columnHelper.display({
        id: "actions",
        header: () => (
          <span className="font-mono text-[10.5px] uppercase tracking-widest text-muted-foreground">
            actions
          </span>
        ),
        cell: (info) => {
          const status = info.row.original.status;
          return (
            <div className="flex gap-1">
              {status === "firing" && (
                <>
                  <button
                    className="flex h-7 items-center gap-1 border border-border-strong bg-surface px-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
                    title="Acknowledge"
                  >
                    <Check className="h-3 w-3" />
                  </button>
                  <button
                    className="flex h-7 items-center gap-1 border border-border-strong bg-surface px-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
                    title="Silence"
                  >
                    <BellOff className="h-3 w-3" />
                  </button>
                </>
              )}
              {status === "pending" && (
                <button
                  className="flex h-7 items-center gap-1 border border-border-strong bg-surface px-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
                  title="Resolve"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          );
        },
        size: 120,
      }),
    ],
    [columnHelper]
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

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHeader
        eyebrow="alerting"
        title="Alerts"
        description="Alert management and alerting rules"
        actions={
          <button className="flex h-8 items-center gap-1.5 border-2 border-primary bg-primary px-3 font-mono text-[10.5px] uppercase tracking-widest text-primary-foreground hover:bg-primary/90">
            <Plus className="h-3 w-3" />
            create rule
          </button>
        }
      />

      {/* Alert Count Summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="flex flex-col gap-1 border-2 border-border-strong bg-surface p-3">
          <span className="font-mono text-[10.5px] uppercase tracking-widest text-muted-foreground">
            firing
          </span>
          <span className="font-mono text-2xl font-bold text-critical">{alertCounts.firing}</span>
        </div>
        <div className="flex flex-col gap-1 border-2 border-border-strong bg-surface p-3">
          <span className="font-mono text-[10.5px] uppercase tracking-widest text-muted-foreground">
            pending
          </span>
          <span className="font-mono text-2xl font-bold text-warning">{alertCounts.pending}</span>
        </div>
        <div className="flex flex-col gap-1 border-2 border-border-strong bg-surface p-3">
          <span className="font-mono text-[10.5px] uppercase tracking-widest text-muted-foreground">
            resolved
          </span>
          <span className="font-mono text-2xl font-bold text-healthy">{alertCounts.resolved}</span>
        </div>
        <div className="flex flex-col gap-1 border-2 border-border-strong bg-surface p-3">
          <span className="font-mono text-[10.5px] uppercase tracking-widest text-muted-foreground">
            total
          </span>
          <span className="font-mono text-2xl font-bold text-foreground">{alertCounts.total}</span>
        </div>
      </div>

      {/* Filters & Search */}
      <Panel
        title="Alerts"
        action={
          <span className="font-mono text-[10.5px] text-muted-foreground">
            {table.getFilteredRowModel().rows.length} of {mockAlerts.length}
          </span>
        }
      >
        <div className="flex flex-col gap-3">
          {/* Filter Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search alerts..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="h-8 w-full border-2 border-border-strong bg-surface pl-7 pr-2 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            {/* Severity Filter */}
            <div className="flex items-center gap-1 border-2 border-border-strong">
              <span className="px-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                sev:
              </span>
              {(["all", "critical", "high", "medium", "low"] as SeverityFilter[]).map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`h-7 px-2 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                    severityFilter === sev
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 border-2 border-border-strong">
              <span className="px-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                status:
              </span>
              {(["all", "firing", "pending", "resolved"] as StatusFilter[]).map((status) => (
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
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b-2 border-border-strong">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-3 py-2 text-left"
                        style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="px-3 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Bell className="h-12 w-12 text-muted-foreground/30" />
                        <p className="text-sm text-muted-foreground">No alerts match your filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-border-strong transition-all hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-sm"
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
