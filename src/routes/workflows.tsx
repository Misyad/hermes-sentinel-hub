import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Panel, Metric } from "@/components/shared/Panel";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { useWorkflows } from "@/hooks/useAutomation";
import type { Workflow } from "@/types";
import {
  RefreshCw,
  Plus,
  Upload,
  Play,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  ArrowRight,
  GitBranch,
} from "lucide-react";

export const Route = createFileRoute("/workflows")({
  component: () => (
    <ErrorBoundary>
      <WorkflowsPage />
    </ErrorBoundary>
  ),
});

type StatusFilter = "all" | "running" | "completed" | "failed" | "pending" | "queued";

function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    getWorkflows().then((data) => {
      setWorkflows(data);
      if (data.length > 0 && !selectedWorkflow) {
        setSelectedWorkflow(data[0]);
      }
      setLoading(false);
    });
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    getWorkflows().then((data) => {
      setWorkflows(data);
      setIsRefreshing(false);
    });
  };

  const filteredWorkflows = workflows.filter((wf) => {
    const matchesStatus = statusFilter === "all" || wf.status === statusFilter;
    const matchesSearch = wf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          wf.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const runningCount = workflows.filter((w) => w.status === "running").length;
  const completedCount = workflows.filter((w) => w.status === "completed").length;
  const failedCount = workflows.filter((w) => w.status === "failed").length;
  const queuedCount = workflows.filter((w) => w.status === "queued").length;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="border-b-2 border-border-strong bg-surface p-4">
        <PageHeader
          eyebrow="automation"
          title="Workflows"
          description="Enterprise workflow execution and monitoring"
          actions={
            <div className="flex items-center gap-2">
              <button
                onClick={() => refetch()}
                className="flex h-8 items-center gap-1.5 border-2 border-border-strong bg-surface px-2 font-mono text-[10.5px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className="h-3 w-3" />
                refresh
              </button>
              <button className="flex h-8 items-center gap-1.5 border-2 border-border-strong bg-surface px-2 font-mono text-[10.5px] uppercase tracking-widest text-muted-foreground hover:text-foreground">
                <Upload className="h-3 w-3" />
                import
              </button>
              <button className="flex h-8 items-center gap-1.5 border-2 border-primary bg-primary px-3 font-mono text-[10.5px] uppercase tracking-widest text-primary-foreground hover:bg-primary/90">
                <Plus className="h-3 w-3" />
                Create
              </button>
            </div>
          }
        />

        {/* Summary Metrics */}
        <div className="mt-4 grid grid-cols-4 gap-3">
          <Metric label="Running" value={runningCount} delta="" deltaTone="neutral" />
          <Metric label="Completed" value={completedCount} delta="" deltaTone="positive" />
          <Metric label="Failed" value={failedCount} delta="" deltaTone="negative" />
          <Metric label="Queued" value={queuedCount} delta="" deltaTone="neutral" />
        </div>
      </div>

      {/* Main Layout: Sidebar + Center + Right Panel */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Workflow List */}
        <div className="w-80 border-r-2 border-border-strong bg-surface">
          <div className="flex h-full flex-col">
            {/* Search & Filters */}
            <div className="border-b-2 border-border-strong p-3">
              <input
                type="text"
                placeholder="Search workflows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-2 w-full border-2 border-border-strong bg-background px-2 py-1.5 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              
              {/* Status Filter Buttons */}
              <div className="flex flex-wrap gap-1">
                {(["all", "running", "completed", "failed", "queued"] as StatusFilter[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest transition-colors ${
                      statusFilter === status
                        ? "bg-primary text-primary-foreground"
                        : "bg-zinc-800 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Workflow List */}
            <div className="flex-1 overflow-y-auto">
              {filteredWorkflows.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <GitBranch className="h-10 w-10 text-muted-foreground/30" />
                  <p className="mt-2 text-sm text-muted-foreground">No workflows found</p>
                </div>
              ) : (
                filteredWorkflows.map((workflow) => (
                  <button
                    key={workflow.id}
                    onClick={() => setSelectedWorkflow(workflow)}
                    className={`w-full border-b border-border p-3 text-left transition-colors hover:bg-zinc-800/50 ${
                      selectedWorkflow?.id === workflow.id ? "bg-zinc-800 border-l-4 border-l-primary" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-mono text-sm font-medium text-foreground">
                            {workflow.name}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {workflow.description}
                        </p>
                        <div className="mt-1.5 flex items-center gap-1.5">
                          {workflow.status === "running" && <Loader2 className="h-3 w-3 animate-spin text-info" />}
                          {workflow.status === "completed" && <CheckCircle2 className="h-3 w-3 text-healthy" />}
                          {workflow.status === "failed" && <XCircle className="h-3 w-3 text-critical" />}
                          {workflow.status === "queued" && <Clock className="h-3 w-3 text-warning" />}
                          {workflow.status === "pending" && <Clock className="h-3 w-3 text-muted-foreground" />}
                          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                            {workflow.status}
                          </span>
                        </div>
                      </div>
                      {workflow.progress > 0 && (
                        <span className="font-mono text-[10px] text-muted-foreground">{workflow.progress}%</span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Center Workspace */}
        <div className="flex-1 overflow-y-auto bg-background p-6">
          {!selectedWorkflow ? (
            <div className="flex h-full flex-col items-center justify-center">
              <GitBranch className="h-16 w-16 text-muted-foreground/20" />
              <p className="mt-4 text-muted-foreground">Select a workflow to view details</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Workflow Overview */}
              <Panel title="Overview">
                <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-4">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Status
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      {selectedWorkflow.status === "running" && <Loader2 className="h-4 w-4 animate-spin text-info" />}
                      {selectedWorkflow.status === "completed" && <CheckCircle2 className="h-4 w-4 text-healthy" />}
                      {selectedWorkflow.status === "failed" && <XCircle className="h-4 w-4 text-critical" />}
                      {selectedWorkflow.status === "queued" && <Clock className="h-4 w-4 text-warning" />}
                      <span className="font-mono text-sm font-medium text-foreground">
                        {selectedWorkflow.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Progress
                    </div>
                    <div className="mt-1 font-mono text-sm font-medium text-foreground">
                      {selectedWorkflow.progress}%
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Owner
                    </div>
                    <div className="mt-1 font-mono text-sm text-foreground">
                      {selectedWorkflow.owner || "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Environment
                    </div>
                    <div className="mt-1">
                      <span className="inline-flex border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-foreground">
                        {selectedWorkflow.environment || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Version
                    </div>
                    <div className="mt-1 font-mono text-sm text-muted-foreground">
                      {selectedWorkflow.version || "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Executions
                    </div>
                    <div className="mt-1 font-mono text-sm text-foreground">
                      {selectedWorkflow.executions?.toLocaleString() || 0}
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Success Rate
                    </div>
                    <div className="mt-1 font-mono text-sm text-healthy">
                      {selectedWorkflow.successRate?.toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Avg Duration
                    </div>
                    <div className="mt-1 font-mono text-sm text-muted-foreground">
                      {selectedWorkflow.avgDuration || "N/A"}
                    </div>
                  </div>
                </div>
                
                {selectedWorkflow.tags && selectedWorkflow.tags.length > 0 && (
                  <div className="border-t-2 border-border-strong p-4">
                    <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Tags
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedWorkflow.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-zinc-800 px-2 py-0.5 font-mono text-[9px] text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedWorkflow.dependencies && selectedWorkflow.dependencies.length > 0 && (
                  <div className="border-t-2 border-border-strong p-4">
                    <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Dependencies
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedWorkflow.dependencies.map((dep) => (
                        <span
                          key={dep}
                          className="inline-flex items-center gap-1 border border-border bg-surface px-2 py-0.5 font-mono text-[9px] text-foreground"
                        >
                          <GitBranch className="h-2.5 w-2.5" />
                          {dep}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Panel>

              {/* Workflow Steps */}
              <Panel title="Steps" action={<span className="font-mono text-[10px] text-muted-foreground">{selectedWorkflow.steps.length} steps</span>}>
                <div className="p-4">
                  <div className="space-y-3">
                    {selectedWorkflow.steps.map((step, idx) => (
                      <div
                        key={step.id}
                        className="relative flex items-start gap-3 rounded border-2 border-border-strong bg-surface p-3"
                      >
                        {/* Step Number */}
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center border-2 border-border-strong bg-background font-mono text-xs font-bold text-foreground">
                          {idx + 1}
                        </div>

                        {/* Step Content */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-sm font-medium text-foreground">{step.name}</span>
                                {step.type && (
                                  <span className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                                    {step.type}
                                  </span>
                                )}
                              </div>
                              
                              {step.output && (
                                <div className="mt-2 border-l-2 border-info pl-2 font-mono text-xs text-info">
                                  {step.output}
                                </div>
                              )}
                              
                              {step.error && (
                                <div className="mt-2 border-l-2 border-critical pl-2 font-mono text-xs text-critical">
                                  {step.error}
                                </div>
                              )}

                              {step.dependencies && step.dependencies.length > 0 && (
                                <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                                  <GitBranch className="h-3 w-3" />
                                  <span className="font-mono">depends on: {step.dependencies.join(", ")}</span>
                                </div>
                              )}
                            </div>

                            {/* Step Status & Duration */}
                            <div className="flex flex-col items-end gap-1.5">
                              <div className="flex items-center gap-1.5">
                                {step.status === "running" && <Loader2 className="h-3.5 w-3.5 animate-spin text-info" />}
                                {step.status === "completed" && <CheckCircle2 className="h-3.5 w-3.5 text-healthy" />}
                                {step.status === "failed" && <XCircle className="h-3.5 w-3.5 text-critical" />}
                                {step.status === "pending" && <Clock className="h-3.5 w-3.5 text-muted-foreground" />}
                                {step.status === "skipped" && <AlertTriangle className="h-3.5 w-3.5 text-warning" />}
                                <span
                                  className={`font-mono text-[10px] uppercase tracking-widest ${
                                    step.status === "completed"
                                      ? "text-healthy"
                                      : step.status === "failed"
                                      ? "text-critical"
                                      : step.status === "running"
                                      ? "text-info"
                                      : step.status === "skipped"
                                      ? "text-warning"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {step.status}
                                </span>
                              </div>
                              {step.duration && (
                                <span className="font-mono text-[10px] text-muted-foreground">{step.duration}</span>
                              )}
                              {step.retryCount !== undefined && step.retryCount > 0 && (
                                <span className="font-mono text-[10px] text-warning">
                                  retry: {step.retryCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Connection Line to Next Step */}
                        {idx < selectedWorkflow.steps.length - 1 && (
                          <div className="absolute bottom-0 left-4 top-12 w-0.5 bg-border" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Panel>

              {/* Execution Timeline */}
              <Panel title="Execution Timeline">
                <div className="p-4">
                  <div className="flex items-center gap-4 font-mono text-xs">
                    <div>
                      <span className="text-muted-foreground">Started:</span>{" "}
                      <span className="text-foreground">
                        {new Date(selectedWorkflow.startTime).toLocaleString()}
                      </span>
                    </div>
                    {selectedWorkflow.estimatedCompletion && (
                      <div>
                        <span className="text-muted-foreground">ETA:</span>{" "}
                        <span className="text-foreground">
                          {new Date(selectedWorkflow.estimatedCompletion).toLocaleTimeString()}
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="text-muted-foreground">Triggered by:</span>{" "}
                      <span className="text-foreground">{selectedWorkflow.triggeredBy}</span>
                    </div>
                    {selectedWorkflow.retryCount !== undefined && selectedWorkflow.maxRetries !== undefined && (
                      <div>
                        <span className="text-muted-foreground">Retries:</span>{" "}
                        <span className="text-foreground">
                          {selectedWorkflow.retryCount}/{selectedWorkflow.maxRetries}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Panel>
            </div>
          )}
        </div>

        {/* Right Panel - AI Assistant (placeholder for future) */}
        {selectedWorkflow && (
          <div className="w-80 border-l-2 border-border-strong bg-surface p-4">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              AI Assistant
            </div>
            <div className="rounded border-2 border-border-strong bg-background p-4">
              <div className="text-center">
                <AlertTriangle className="mx-auto h-8 w-8 text-muted-foreground/30" />
                <p className="mt-2 text-xs text-muted-foreground">AI insights coming soon</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
