import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import { PageHeader } from "@/components/shared/PageHeader";
import { SevPill, StatusBadge } from "@/components/shared/StatusBadge";
import { Panel } from "@/components/shared/Panel";
import { Search, Filter, Plus, ArrowUpDown } from "lucide-react";

export const Route = createFileRoute("/incidents/")({
  head: () => ({
    meta: [
      { title: "Incidents — Hermes Control Center" },
      {
        name: "description",
        content:
          "Active, acknowledged, and resolved incidents with severity, ownership, and SLA burn.",
      },
    ],
  }),
  component: IncidentsList,
});

type Incident = {
  id: string;
  sev: "SEV1" | "SEV2" | "SEV3" | "SEV4";
  title: string;
  service: string;
  status: "open" | "acknowledged" | "investigating" | "mitigated" | "resolved";
  owner: string;
  opened: string;
  age: string;
  sla: string;
};

const DATA: Incident[] = [
  {
    id: "INC-4821",
    sev: "SEV1",
    title: "Elevated 5xx on api-gateway (v2.14.1 rollout)",
    service: "api-gateway",
    status: "investigating",
    owner: "sre-oncall",
    opened: "14:04 UTC",
    age: "00:14:22",
    sla: "38m remaining",
  },
  {
    id: "INC-4818",
    sev: "SEV2",
    title: "Kafka lag on billing-events > 12k",
    service: "billing-events",
    status: "acknowledged",
    owner: "data-plat",
    opened: "12:36 UTC",
    age: "01:42:08",
    sla: "OK",
  },
  {
    id: "INC-4815",
    sev: "SEV2",
    title: "Postgres replica lag us-east-1b",
    service: "rds-billing",
    status: "mitigated",
    owner: "db-ops",
    opened: "10:07 UTC",
    age: "03:11:47",
    sla: "OK",
  },
  {
    id: "INC-4802",
    sev: "SEV3",
    title: "Intermittent DNS resolution eu-west",
    service: "coredns",
    status: "open",
    owner: "netops",
    opened: "Yesterday 21:12 UTC",
    age: "18:22:11",
    sla: "OK",
  },
  {
    id: "INC-4791",
    sev: "SEV3",
    title: "Search index rebuild stuck",
    service: "search-svc",
    status: "resolved",
    owner: "search-team",
    opened: "Yesterday 08:41 UTC",
    age: "resolved",
    sla: "—",
  },
  {
    id: "INC-4784",
    sev: "SEV4",
    title: "Prometheus scrape gaps · staging",
    service: "prometheus",
    status: "resolved",
    owner: "obs-team",
    opened: "2d ago",
    age: "resolved",
    sla: "—",
  },
];

function IncidentsList() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setFilter] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const columns = useMemo(() => {
    const h = createColumnHelper<Incident>();
    return [
      h.display({
        id: "select",
        header: () => (
          <input
            type="checkbox"
            className="h-3 w-3 accent-primary"
            onChange={(e) =>
              setSelected(e.target.checked ? new Set(DATA.map((d) => d.id)) : new Set())
            }
            checked={selected.size === DATA.length}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            className="h-3 w-3 accent-primary"
            checked={selected.has(row.original.id)}
            onChange={(e) => {
              setSelected((prev) => {
                const next = new Set(prev);
                e.target.checked ? next.add(row.original.id) : next.delete(row.original.id);
                return next;
              });
            }}
          />
        ),
        size: 32,
      }),
      h.accessor("id", {
        header: "ID",
        cell: (info) => (
          <Link
            to="/incidents/$id"
            params={{ id: info.getValue() }}
            className="font-mono text-[11.5px] font-medium text-primary hover:underline"
          >
            {info.getValue()}
          </Link>
        ),
      }),
      h.accessor("sev", {
        header: "Sev",
        cell: (info) => <SevPill sev={info.getValue()} />,
      }),
      h.accessor("title", {
        header: "Title",
        cell: (info) => (
          <span className="text-[12.5px] text-foreground">{info.getValue()}</span>
        ),
      }),
      h.accessor("service", {
        header: "Service",
        cell: (info) => (
          <span className="font-mono text-[11px] text-muted-foreground">
            {info.getValue()}
          </span>
        ),
      }),
      h.accessor("status", {
        header: "Status",
        cell: (info) => <StatusBadge status={info.getValue()} />,
      }),
      h.accessor("owner", {
        header: "Owner",
        cell: (info) => (
          <span className="font-mono text-[11px] text-muted-foreground">
            {info.getValue()}
          </span>
        ),
      }),
      h.accessor("age", {
        header: "Age",
        cell: (info) => (
          <span className="font-mono text-[11px] text-muted-foreground">
            {info.getValue()}
          </span>
        ),
      }),
      h.accessor("sla", {
        header: "SLA",
        cell: (info) => (
          <span
            className={
              "font-mono text-[11px] " +
              (info.getValue().includes("remaining")
                ? "text-warning"
                : "text-muted-foreground")
            }
          >
            {info.getValue()}
          </span>
        ),
      }),
    ];
  }, [selected]);

  const table = useReactTable({
    data: DATA,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="flex flex-col">
      <PageHeader
        eyebrow="operations · incident management"
        title="Incidents"
        description="All declared incidents across production, staging, and dev environments."
        actions={
          <>
            <button className="flex h-8 items-center gap-1.5 border-2 border-border-strong bg-surface px-2 font-mono text-[10.5px] uppercase tracking-widest text-muted-foreground hover:text-foreground">
              <Filter className="h-3 w-3" /> filters
            </button>
            <button className="flex h-8 items-center gap-1.5 border-2 border-primary bg-primary px-3 font-mono text-[10.5px] uppercase tracking-widest text-primary-foreground hover:bg-primary/90">
              <Plus className="h-3 w-3" /> declare
            </button>
          </>
        }
      />

      <div className="p-4 md:p-6">
        <Panel dense>
          <div className="flex items-center gap-2 border-b-2 border-border bg-background px-3 py-2">
            <div className="flex h-7 flex-1 items-center gap-2 border-2 border-border bg-surface px-2 text-[12px]">
              <Search className="h-3 w-3 text-muted-foreground" />
              <input
                value={globalFilter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter incidents…"
                className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
              />
            </div>
            <span className="font-mono text-[10.5px] uppercase tracking-widest text-muted-foreground">
              {table.getRowModel().rows.length} rows
              {selected.size > 0 && ` · ${selected.size} selected`}
            </span>
          </div>
          <div className="overflow-auto">
            <table className="w-full text-[12px]">
              <thead className="sticky top-0 z-10 bg-surface">
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id} className="border-b-2 border-border">
                    {hg.headers.map((header) => (
                      <th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className="cursor-pointer select-none px-2 py-1.5 text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground first:pl-3 hover:text-foreground"
                      >
                        <span className="inline-flex items-center gap-1">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {header.column.getCanSort() && (
                            <ArrowUpDown className="h-2.5 w-2.5 opacity-50" />
                          )}
                        </span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-border transition-colors hover:bg-muted"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-2 py-1.5 first:pl-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </div>
  );
}
