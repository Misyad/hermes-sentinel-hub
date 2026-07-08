// Login form component

import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { Panel } from "@/components/shared/Panel";
import { Terminal, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ email, password, rememberMe });
      router.navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Panel className="w-full max-w-md">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-primary bg-primary/10">
            <Terminal className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Hermes Sentinel Hub</h1>
            <p className="text-sm text-muted-foreground">Platform Engineering Console</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 flex items-start gap-2 rounded-lg border-2 border-critical bg-critical/10 p-3">
            <AlertCircle className="h-4 w-4 shrink-0 text-critical" />
            <p className="text-sm text-critical">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              autoFocus
              disabled={isSubmitting}
              className="w-full rounded-lg border-2 border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground transition-colors focus:border-primary focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="admin@hermes.dev"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-foreground">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={isSubmitting}
                className="w-full rounded-lg border-2 border-border bg-background px-3 py-2 pr-10 text-sm text-foreground placeholder-muted-foreground transition-colors focus:border-primary focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2">
            <input
              id="remember"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isSubmitting}
              className="h-4 w-4 rounded border-2 border-border bg-background text-primary transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <label htmlFor="remember" className="text-sm text-foreground">
              Remember me
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-primary bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Log In</span>
            )}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 rounded-lg border-2 border-border bg-muted/50 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Demo Credentials
          </p>
          <div className="space-y-1 text-xs text-foreground">
            <p><span className="font-mono">admin@hermes.dev</span> / <span className="font-mono">admin</span></p>
            <p><span className="font-mono">platform@hermes.dev</span> / <span className="font-mono">platform</span></p>
            <p><span className="font-mono">devops@hermes.dev</span> / <span className="font-mono">devops</span></p>
          </div>
        </div>
      </div>
    </Panel>
  );
}
