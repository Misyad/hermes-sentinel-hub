import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { PageHeader } from "@/components/shared/PageHeader";
import { Panel } from "@/components/shared/Panel";
import { Metric } from "@/components/shared/Panel";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { useJobs } from "@/hooks/useAutomation";
import type { Job } from "@/types";
import {
  Search,
  RefreshCw,
  Play,
  XCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Loader2,
  Clock,
  Filter,
} from "lucide-react";

export const Route = createFileRoute("/jobs")({
  component: () => (
    <ErrorBoundary>
      <JobsPage />
    </ErrorBoundary>
  ),
});

type StatusFilter = "all" | "success" | "failed" | "running" | "pending" | "cancelled";
type EnvironmentFilter = "all" | "production" | "staging";

const columnHelper = createColumnHelper<Job>();

function JobsPage() {
  const { data: jobs = [], isLoading, refetch } = useJobs();
  const [sorting, setSorting] = useState<SortingState>([{ id: "startTime", desc: true }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [environmentFilter, setEnvironmentFilter] = useState<EnvironmentFilter>("all");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showLogs, setShowLogs] = useState(false);

  const filteredData = useMemo(() => {
    let filtered = jobs;

    if (statusFilter !== "all") {
      filtered = filtered.filter((j) => j.status === statusFilter);
    }

    if (environmentFilter !== "all") {
      filtered = filtered.filter((j) => j.environment === environmentFilter);
    }

    return filtered;
  }, [jobs, statusFilter, environmentFilter]);

  const successCount = jobs.filter((j) => j.status === "success").length;
  const failedCount = jobs.filter((j) => j.status === "failed").length;
  const runningCount = jobs.filter((j) => j.status === "running").length;
  const pendingCount = jobs.filter((j) => j.status === "pending").length;

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "Job ID",
        cell: (info) => (
          <span className="font-mono text-xs text-muted-foreground">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("workflowName", {
        header: "Workflow",
        cell: (info) => (
          <div className="flex flex-col gap-0.5">
            <span className="font-mono text-sm font-medium text-foreground">{info.getValue()}</span>
            {info.row.original.workflowId && (
              <span className="font-mono text-[10px] text-muted-foreground">
                {info.row.original.workflowId}
              </span>
            )}
          </div>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const status = info.getValue();
          const colors = {
            success: "bg-healthy/20 text-healthy border-healthy/30",
            failed: "bg-critical/20 text-critical border-critical/30",
            running: "bg-info/20 text-info border-info/30",
            pending: "bg-zinc-800 text-muted-foreground border-border",
            cancelled: "bg-warning/20 text-warning border-warning/30",
          };
          const icons = {
            success: <CheckCircle2 className="h-3 w-3" />,
            failed: <XCircle className="h-3 w-3" />,
            running: <Loader2 className="h-3 w-3 animate-spin" />,
            pending: <Clock className="h-3 w-3" />,
            cancelled: <XCircle className="h-3 w-3" />,
          };
          return (
            <span
              className={`inline-flex items-center gap-1.5 border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest ${colors[status]}`}
            >
              {icons[status]}
              {status}
            </span>
          );
        },
      }),
      columnHelper.accessor("environment", {
        header: "Environment",
        cell: (info) => {
          const env = info.getValue();
          if (!env) return <span className="text-xs text-muted-foreground">N/A</span>;
          return (
            <span
              className={`inline-flex border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest ${
                env === "production"
                  ? "border-critical/30 bg-critical/10 text-critical"
                  : "border-border bg-surface text-muted-foreground"
              }`}
            >
              {env}
            </span>
          );
        },
      }),
      columnHelper.accessor("worker", {
        header: "Worker",
        cell: (info) => (
          <span className="font-mono text-xs text-muted-foreground">{info.getValue() || "N/A"}</span>
        ),
      }),
      columnHelper.accessor("triggeredBy", {
        header: "Triggered By",
        cell: (info) => (
          <span className="font-mono text-xs text-foreground">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("startTime", {
        header: "Start Time",
        cell: (info) => {
          const date = new Date(info.getValue());
          const now = Date.now();
          const diff = now - date.getTime();
          const minutes = Math.floor(diff / 60000);
          if (minutes < 60) {
            return <span className="text-xs text-muted-foreground">{minutes}m ago</span>;
          } else if (minutes < 1440) {
            return <span className="text-xs text-muted-foreground">{Math.floor(minutes / 60)}h ago</span>;
          } else {
            return (
              <span className="text-xs text-muted-foreground">{Math.floor(minutes / 1440)}d ago</span>
            );
          }
        },
      }),
      columnHelper.accessor("duration", {
        header: "Duration",
        cell: (info) => (
          <span className="font-mono text-xs text-muted-foreground">{info.getValue() || "—"}</span>
        ),
      }),
      columnHelper.accessor("exitCode", {
        header: "Exit Code",
        cell: (info) => {
          const code = info.getValue();
          if (code === undefined) return <span className="text-xs text-muted-foreground">—</span>;
          return (
            <span
              className={`font-mono text-xs font-medium ${code === 0 ? "text-healthy" : "text-critical"}`}
            >
              {code}
            </span>
          );
        },
      }),
      columnHelper.accessor("retryCount", {
        header: "Retries",
        cell: (info) => {
          const count = info.getValue() || 0;
          return (
            <span className={`font-mono text-xs ${count > 0 ? "text-warning" : "text-muted-foreground"}`}>
              {count}
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
              onClick={() => {
                setSelectedJob(info.row.original);
                setShowLogs(true);
              }}
              className="flex h-6 w-6 items-center justify-center border-2 border-border-strong bg-surface text-muted-foreground transition-colors hover:border-info hover:text-info"
              title="View logs"
            >
              <FileText className="h-3 w-3" />
            </button>
            {info.row.original.status === "failed" && (
              <button
                className="flex h-6 w-6 items-center justify-center border-2 border-border-strong bg-surface text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                title="Re-run job"
              >
                <Play className="h-3 w-3" />
              </button>
            )}
            {info.row.original.status === "running" && (
              <button
                className="flex h-6 w-6 items-center justify-center border-2 border-border-strong bg-surface text-muted-foreground transition-colors hover:border-critical hover:text-critical"
                title="Cancel job"
              >
                <XCircle className="h-3 w-3" />
              </button>
            )}
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
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div className="h-20 animate-pulse bg-zinc-800" />
        <div className="grid grid-cols-4 gap-3">
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
        title="Jobs"
        description="Job execution history and monitoring"
        actions={
          <button
            onClick={() => refetch()}
            className="flex h-8 items-center gap-1.5 border-2 border-border-strong bg-surface px-2 font-mono text-[10.5px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="h-3 w-3" />
            refresh
          </button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Metric label="Success" value={successCount} delta="" deltaTone="positive" />
        <Metric label="Failed" value={failedCount} delta="" deltaTone="negative" />
        <Metric label="Running" value={runningCount} delta="" deltaTone="neutral" />
        <Metric label="Pending" value={pendingCount} delta="" deltaTone="neutral" />
      </div>

      {/* Main Table */}
      <Panel title="Execution History" action={
        <span className="font-mono text-[10.5px] text-muted-foreground">
          {table.getFilteredRowModel().rows.length} jobs
        </span>
      }>
        <div className="flex flex-col gap-3">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="flex flex-1 items-center gap-2 border-2 border-border-strong bg-surface px-2">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search jobs..."
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
              {(["all", "success", "failed", "running", "pending"] as StatusFilter[]).map((status) => (
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

            {/* Environment Filter */}
            <div className="flex items-center gap-1 border-2 border-border-strong">
              <span className="px-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                env:
              </span>
              {(["all", "production", "staging"] as EnvironmentFilter[]).map((env) => (
                <button
                  key={env}
                  onClick={() => setEnvironmentFilter(env)}
                  className={`h-7 px-2 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                    environmentFilter === env
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {env}
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
                        <p className="text-sm text-muted-foreground">No jobs match your filters</p>
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
                        <td key={cell.id} className="px-3 py-2.5">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {table.getPageCount() > 1 && (
            <div className="flex items-center justify-between border-t-2 border-border-strong pt-3">
              <span className="font-mono text-xs text-muted-foreground">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="flex h-7 w-7 items-center justify-center border-2 border-border-strong bg-surface text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="flex h-7 w-7 items-center justify-center border-2 border-border-strong bg-surface text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </Panel>

      {/* Logs Modal */}
      {showLogs && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="flex max-h-[80vh] w-full max-w-3xl flex-col border-2 border-border-strong bg-surface">
            <div className="flex items-center justify-between border-b-2 border-border-strong p-3">
              <div>
                <div className="font-mono text-sm font-medium text-foreground">{selectedJob.workflowName}</div>
                <div className="font-mono text-[10px] text-muted-foreground">Job ID: {selectedJob.id}</div>
              </div>
              <button
                onClick={() => setShowLogs(false)}
                className="flex h-7 w-7 items-center justify-center border-2 border-border-strong bg-background text-muted-foreground hover:text-foreground"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto bg-black p-4 font-mono text-xs text-green-400">
              {selectedJob.logs ? (
                <pre className="whitespace-pre-wrap">{selectedJob.logs}</pre>
              ) : (
                <div className="space-y-1">
                  <div>[{new Date(selectedJob.startTime).toISOString()}] Job started</div>
                  <div>[{new Date(selectedJob.startTime).toISOString()}] Worker: {selectedJob.worker}</div>
                  <div>[{new Date(selectedJob.startTime).toISOString()}] Environment: {selectedJob.environment}</div>
                  <div>[{new Date(selectedJob.startTime).toISOString()}] Triggered by: {selectedJob.triggeredBy}</div>
                  {selectedJob.endTime && (
                    <>
                      <div>[{new Date(selectedJob.endTime).toISOString()}] Job completed</div>
                      <div>[{new Date(selectedJob.endTime).toISOString()}] Duration: {selectedJob.duration}</div>
                      <div>[{new Date(selectedJob.endTime).toISOString()}] Exit code: {selectedJob.exitCode}</div>
                      {selectedJob.result && (
                        <div>[{new Date(selectedJob.endTime).toISOString()}] Result: {selectedJob.result}</div>
                      )}
                      {selectedJob.error && (
                        <div className="text-red-400">[{new Date(selectedJob.endTime).toISOString()}] Error: {selectedJob.error}</div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
