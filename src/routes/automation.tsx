import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { RefreshCw, Play, Clock, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Panel } from "@/components/shared/Panel";
import { Metric } from "@/components/shared/Panel";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { getAutomationMetrics, getWorkflows, getJobs } from "@/services";
import type { AutomationMetric, Workflow, Job } from "@/types";

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
  const [metrics, setMetrics] = useState<AutomationMetric[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    Promise.all([getAutomationMetrics(), getWorkflows(), getJobs()]).then(
      ([metricsData, workflowsData, jobsData]) => {
        setMetrics(metricsData);
        setWorkflows(workflowsData);
        setJobs(jobsData);
        setLoading(false);
      }
    );
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
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
            disabled={isRefreshing}
            className="flex h-8 items-center gap-1.5 border-2 border-border-strong bg-surface px-2 font-mono text-[10.5px] uppercase tracking-widest text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
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
            <div className="flex flex-col items-center gap-2 py-8">
              <CheckCircle2 className="h-10 w-10 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No workflows running</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {runningWorkflows.map((workflow) => (
                <div
                  key={workflow.id}
                  className="flex flex-col gap-2 border-2 border-border-strong bg-surface p-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-sm font-medium text-foreground">
                        {workflow.name}
                      </span>
                      <span className="text-xs text-muted-foreground">{workflow.description}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Play className="h-3 w-3 text-info" />
                      <span className="font-mono text-xs text-info">running</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-mono text-foreground">{workflow.progress}%</span>
                    </div>
                    <div className="h-1 w-full bg-zinc-800">
                      <div
                        className="h-full bg-info transition-all"
                        style={{ width: `${workflow.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="flex flex-wrap gap-1.5">
                    {workflow.steps.map((step) => (
                      <div
                        key={step.id}
                        className={`rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest ${
                          step.status === "completed"
                            ? "bg-healthy/20 text-healthy"
                            : step.status === "running"
                              ? "bg-info/20 text-info"
                              : step.status === "failed"
                                ? "bg-critical/20 text-critical"
                                : "bg-zinc-800 text-muted-foreground"
                        }`}
                      >
                        {step.name}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 border-t border-border-strong pt-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>
                      Started{" "}
                      {Math.floor((Date.now() - new Date(workflow.startTime).getTime()) / 60000)}m
                      ago
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        {/* Recent Executions */}
        <Panel
          title="Recent Executions"
          action={
            <span className="font-mono text-[10.5px] text-muted-foreground">{jobs.length} jobs</span>
          }
        >
          <div className="flex flex-col gap-2">
            {jobs.slice(0, 6).map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between border-2 border-border-strong bg-surface p-2.5 text-xs"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-sm text-foreground">{job.workflowName}</span>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>
                      {Math.floor((Date.now() - new Date(job.startTime).getTime()) / 60000)}m ago
                    </span>
                    {job.duration && <span>· {job.duration}</span>}
                  </div>
                  {job.result && <span className="text-muted-foreground">{job.result}</span>}
                </div>

                <div className="flex items-center gap-1.5">
                  {job.status === "success" && (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-healthy" />
                      <span className="font-mono text-xs text-healthy">success</span>
                    </>
                  )}
                  {job.status === "failed" && (
                    <>
                      <XCircle className="h-4 w-4 text-critical" />
                      <span className="font-mono text-xs text-critical">failed</span>
                    </>
                  )}
                  {job.status === "running" && (
                    <>
                      <Play className="h-4 w-4 text-info" />
                      <span className="font-mono text-xs text-info">running</span>
                    </>
                  )}
                  {job.status === "pending" && (
                    <>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono text-xs text-muted-foreground">pending</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Failed Executions Alert */}
      {failedJobs.length > 0 && (
        <Panel
          title="Failed Executions"
          action={
            <span className="font-mono text-[10.5px] text-critical">{failedJobs.length} failed</span>
          }
        >
          <div className="flex flex-col gap-2">
            {failedJobs.map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between border-2 border-critical/30 bg-critical/5 p-2.5"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-sm text-foreground">{job.workflowName}</span>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>
                      {Math.floor((Date.now() - new Date(job.startTime).getTime()) / 60000)}m ago
                    </span>
                    <span>· {job.duration}</span>
                  </div>
                  {job.result && <span className="text-sm text-critical">{job.result}</span>}
                </div>

                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-critical" />
                  <span className="font-mono text-xs text-critical">failed</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}
