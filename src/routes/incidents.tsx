import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/incidents")({
  component: () => <Outlet />,
});

// keep unused imports referenced
void Link;
