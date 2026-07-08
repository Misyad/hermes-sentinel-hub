import { createFileRoute } from "@tanstack/react-router";
import { RefreshCw, Play, Clock, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Panel } from "@/components/shared/Panel";
import { Metric } from "@/components/shared/Panel";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { useAutomationMetrics, useWorkflows, useJobs } from "@/hooks/useAutomation";

export const Route = createFileRoute("/automation")({
  head: () => ({
    meta: [
      { title: "Automation — Hermes" },
      { name: "description", content: "Automation workflows, playbooks, and scheduled jobs." },
    ],
  }),
  component: () => (
    <ErrorBoundary>
      <AutomationPage />
    </ErrorBoundary>
  ),
});

function AutomationPage() {
  const { data: metrics = [], isLoading: metricsLoading, refetch: refetchMetrics } = useAutomationMetrics();
  const { data: workflows = [], isLoading: workflowsLoading, refetch: refetchWorkflows } = useWorkflows();
  const { data: jobs = [], isLoading: jobsLoading, refetch: refetchJobs } = useJobs();

  const loading = metricsLoading || workflowsLoading || jobsLoading;

  const handleRefresh = () => {
    refetchMetrics();
    refetchWorkflows();
    refetchJobs();
  };

  const runningWorkflows = workflows.filter((w) => w.status === "running");
  const failedJobs = jobs.filter((j) => j.status === "failed");

  if (loading) {
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
        title="Automation"
        description="Workflows, playbooks, and scheduled jobs"
        actions={
          <button
            onClick={handleRefresh}
            className="flex h-8 items-center gap-1.5 border-2 border-border-strong bg-surface px-2 font-mono text-[10.5px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="h-3 w-3" />
            refresh
          </button>
        }
      />

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {metrics.map((metric) => (
          <Metric
            key={metric.id}
            label={metric.label}
            value={metric.unit ? `${metric.value}${metric.unit}` : metric.value}
            delta={metric.change}
            deltaTone={
              metric.change.startsWith("+") && !metric.label.includes("Failed")
                ? "positive"
                : metric.change.startsWith("-") && !metric.label.includes("Failed")
                  ? "negative"
                  : "neutral"
            }
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Running Workflows */}
        <Panel
          title="Running Workflows"
          action={
            <span className="font-mono text-[10.5px] text-muted-foreground">
              {runningWorkflows.length} active
            </span>
          }
        >
          {runningWorkflows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="h-10 w-10 text-healthy/30" />
              <p className="mt-2 text-sm text-muted-foreground">No workflows running</p>
            </div>
          ) : (
            <div className="space-y-3">
              {runningWorkflows.map((workflow) => (
                <div
                  key={workflow.id}
                  className="flex items-start justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Play className="h-3.5 w-3.5 flex-shrink-0 text-info" />
                      <span className="truncate font-mono text-sm font-medium text-foreground">
                        {workflow.name}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {workflow.description}
                    </p>
                    <div className="mt-2 h-1 w-full bg-zinc-800">
                      <div
                        className="h-full bg-info transition-all duration-300"
                        style={{ width: `${workflow.progress}%` }}
                      />
                    </div>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">{workflow.progress}%</span>
                </div>
              ))}
            </div>
          )}
        </Panel>

        {/* Recent Executions */}
        <Panel
          title="Recent Executions"
          action={
            <span className="font-mono text-[10.5px] text-muted-foreground">
              last {jobs.slice(0, 5).length}
            </span>
          }
        >
          <div className="space-y-2">
            {jobs.slice(0, 5).map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between gap-3 border-b border-border pb-2 last:border-0 last:pb-0"
              >
                <div className="flex flex-1 items-center gap-2 min-w-0">
                  {job.status === "success" && <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-healthy" />}
                  {job.status === "failed" && <XCircle className="h-3.5 w-3.5 flex-shrink-0 text-critical" />}
                  {job.status === "running" && <Clock className="h-3.5 w-3.5 flex-shrink-0 text-info" />}
                  <span className="truncate font-mono text-xs text-foreground">{job.workflowName}</span>
                </div>
                <span className="font-mono text-xs text-muted-foreground">{job.duration || "running"}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Failed Jobs Alert */}
      {failedJobs.length > 0 && (
        <Panel
          title="Failed Executions"
          action={
            <span className="font-mono text-[10.5px] text-critical">
              {failedJobs.length} failed
            </span>
          }
        >
          <div className="space-y-2">
            {failedJobs.map((job) => (
              <div
                key={job.id}
                className="flex items-start justify-between gap-3 border-l-4 border-critical bg-critical/5 p-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 text-critical" />
                    <span className="truncate font-mono text-sm font-medium text-foreground">
                      {job.workflowName}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {job.result || "Execution failed"}
                  </p>
                </div>
                <button className="flex-shrink-0 rounded border border-critical px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-critical hover:bg-critical hover:text-critical-foreground">
                  retry
                </button>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}
