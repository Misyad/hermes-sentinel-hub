import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { Panel } from "@/components/shared/Panel";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Hermes" },
      { name: "description", content: "Workspace preferences and profile." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        eyebrow="workspace"
        title="Settings"
        description="Manage your profile, workspace defaults, notifications, keyboard shortcuts, and theme."
      />
      <div className="grid gap-3 p-4 md:p-6 lg:grid-cols-2">
        <Panel title="Profile">
          <div className="space-y-3 text-[12.5px]">
            {[
              ["Name", "Jordan Doe"],
              ["Handle", "j.doe"],
              ["Email", "j.doe@acme.com"],
              ["Timezone", "America/New_York"],
              ["Role", "Platform SRE · Admin"],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[140px_1fr] items-center gap-3">
                <label className="font-mono text-[10.5px] uppercase tracking-widest text-muted-foreground">
                  {k}
                </label>
                <input
                  defaultValue={v}
                  className="h-8 border-2 border-border bg-background px-2 text-foreground outline-none focus:border-primary"
                />
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Preferences">
          <ul className="divide-y divide-border text-[12.5px]">
            {[
              ["Compact tables", true],
              ["Live tail on incidents", true],
              ["Auto-run AI on new incidents", false],
              ["Confirm destructive actions", true],
              ["Send weekly ops digest", true],
            ].map(([k, on]) => (
              <li key={k as string} className="flex items-center justify-between py-2">
                <span>{k}</span>
                <span
                  className={
                    "h-5 w-9 border-2 " +
                    (on
                      ? "border-primary bg-primary/40"
                      : "border-border-strong bg-muted")
                  }
                />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Keyboard Shortcuts" className="lg:col-span-2">
          <div className="grid gap-2 md:grid-cols-2">
            {[
              ["Open command palette", ["⌘", "K"]],
              ["Declare incident", ["G", "I"]],
              ["Focus search", ["/"]],
              ["Toggle sidebar", ["⌘", "B"]],
              ["Jump to dashboard", ["G", "D"]],
              ["Open notifications", ["⌘", "N"]],
              ["Run playbook", ["R"]],
              ["Acknowledge alert", ["A"]],
            ].map(([label, keys]) => (
              <div
                key={label as string}
                className="flex items-center justify-between border-2 border-border bg-background px-3 py-1.5 text-[12px]"
              >
                <span>{label}</span>
                <span className="flex gap-1">
                  {(keys as string[]).map((k) => (
                    <span key={k} className="kbd">
                      {k}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
