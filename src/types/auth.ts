// Authentication domain types

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  permissions: string[];
  createdAt: string;
  lastLogin?: string;
}

export type UserRole = 
  | "super_admin"
  | "platform_engineer"
  | "devops"
  | "sre"
  | "developer"
  | "viewer";

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: AuthUser;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  session: AuthSession | null;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshResponse {
  accessToken: string;
  expiresIn: number;
}

export interface AuthError {
  code: string;
  message: string;
  statusCode: number;
}

// Role metadata for UI display
export const ROLE_METADATA: Record<UserRole, { label: string; color: string; description: string }> = {
  super_admin: {
    label: "Super Admin",
    color: "text-critical",
    description: "Full system access, all permissions"
  },
  platform_engineer: {
    label: "Platform Engineer",
    color: "text-primary",
    description: "Infrastructure, automation, deployments"
  },
  devops: {
    label: "DevOps",
    color: "text-info",
    description: "CI/CD, infrastructure, monitoring"
  },
  sre: {
    label: "SRE",
    color: "text-warning",
    description: "Reliability, incidents, alerts"
  },
  developer: {
    label: "Developer",
    color: "text-healthy",
    description: "Read-only access, limited actions"
  },
  viewer: {
    label: "Viewer",
    color: "text-muted-foreground",
    description: "Read-only access"
  }
};
