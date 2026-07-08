// Protected route wrapper components

import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { Panel } from "@/components/shared/Panel";
import { AlertTriangle, Lock, Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.navigate({ to: "/" as any });
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <LoadingSession />;
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return <>{children}</>;
}

export function GuestRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.navigate({ to: "/" });
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <LoadingSession />;
  }

  if (isAuthenticated) {
    return null; // Will redirect
  }

  return <>{children}</>;
}

export function LoadingSession() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Panel className="w-full max-w-md">
        <div className="flex flex-col items-center gap-4 p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div className="text-center">
            <h2 className="text-lg font-semibold text-foreground">Loading Session</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Verifying authentication...
            </p>
          </div>
        </div>
      </Panel>
    </div>
  );
}

export function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Panel className="w-full max-w-md">
        <div className="flex flex-col items-center gap-4 p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-critical bg-critical/10">
            <Lock className="h-6 w-6 text-critical" />
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-foreground">Access Denied</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              You don't have permission to access this resource.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.history.back()}
              className="rounded-lg border-2 border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Go Back
            </button>
            <button
              onClick={() => router.navigate({ to: "/" })}
              className="rounded-lg border-2 border-primary bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Go Home
            </button>
          </div>
        </div>
      </Panel>
    </div>
  );
}

export function SessionExpiredPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Panel className="w-full max-w-md">
        <div className="flex flex-col items-center gap-4 p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-warning bg-warning/10">
            <AlertTriangle className="h-6 w-6 text-warning" />
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-foreground">Session Expired</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your session has expired. Please log in again.
            </p>
          </div>
          <button
            onClick={() => (window.location.href = "/login")}
            className="w-full rounded-lg border-2 border-primary bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Log In
          </button>
        </div>
      </Panel>
    </div>
  );
}
