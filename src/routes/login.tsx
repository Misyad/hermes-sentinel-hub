// Login page route

import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "@/components/auth/LoginForm";
import { GuestRoute } from "@/components/auth/ProtectedRoute";

export const Route = createFileRoute("/login")({
  component: LoginPage
});

function LoginPage() {
  return (
    <GuestRoute>
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <LoginForm />
      </div>
    </GuestRoute>
  );
}
