// Mock authentication data

import type { AuthUser, LoginResponse, UserRole } from "@/types/auth";

// Mock users for different roles
export const MOCK_USERS: Record<string, { password: string; user: AuthUser }> = {
  "admin@hermes.dev": {
    password: "admin",
    user: {
      id: "usr_001",
      email: "admin@hermes.dev",
      name: "Admin User",
      avatar: undefined,
      role: "super_admin",
      permissions: ["*"],
      createdAt: "2024-01-01T00:00:00Z",
      lastLogin: new Date().toISOString()
    }
  },
  "platform@hermes.dev": {
    password: "platform",
    user: {
      id: "usr_002",
      email: "platform@hermes.dev",
      name: "Platform Engineer",
      avatar: undefined,
      role: "platform_engineer",
      permissions: [
        "infrastructure:read",
        "infrastructure:write",
        "automation:read",
        "automation:write",
        "monitoring:read",
        "incidents:read",
        "incidents:write"
      ],
      createdAt: "2024-01-15T00:00:00Z",
      lastLogin: new Date().toISOString()
    }
  },
  "devops@hermes.dev": {
    password: "devops",
    user: {
      id: "usr_003",
      email: "devops@hermes.dev",
      name: "DevOps Engineer",
      avatar: undefined,
      role: "devops",
      permissions: [
        "automation:read",
        "automation:write",
        "infrastructure:read",
        "monitoring:read",
        "incidents:read"
      ],
      createdAt: "2024-02-01T00:00:00Z",
      lastLogin: new Date().toISOString()
    }
  },
  "sre@hermes.dev": {
    password: "sre",
    user: {
      id: "usr_004",
      email: "sre@hermes.dev",
      name: "SRE Engineer",
      avatar: undefined,
      role: "sre",
      permissions: [
        "incidents:read",
        "incidents:write",
        "alerts:read",
        "alerts:write",
        "monitoring:read",
        "infrastructure:read"
      ],
      createdAt: "2024-02-15T00:00:00Z",
      lastLogin: new Date().toISOString()
    }
  },
  "developer@hermes.dev": {
    password: "developer",
    user: {
      id: "usr_005",
      email: "developer@hermes.dev",
      name: "Developer",
      avatar: undefined,
      role: "developer",
      permissions: [
        "monitoring:read",
        "services:read",
        "incidents:read"
      ],
      createdAt: "2024-03-01T00:00:00Z",
      lastLogin: new Date().toISOString()
    }
  },
  "viewer@hermes.dev": {
    password: "viewer",
    user: {
      id: "usr_006",
      email: "viewer@hermes.dev",
      name: "Read-Only Viewer",
      avatar: undefined,
      role: "viewer",
      permissions: [
        "dashboard:read",
        "monitoring:read",
        "services:read"
      ],
      createdAt: "2024-03-15T00:00:00Z",
      lastLogin: new Date().toISOString()
    }
  }
};

// Generate mock tokens
function generateToken(userId: string, type: "access" | "refresh"): string {
  const prefix = type === "access" ? "acc" : "ref";
  const random = Math.random().toString(36).substring(2, 15);
  return `${prefix}_${userId}_${random}`;
}

// Mock login response
export function mockLogin(email: string, password: string): LoginResponse | null {
  const userRecord = MOCK_USERS[email];
  
  if (!userRecord || userRecord.password !== password) {
    return null;
  }

  const user = { ...userRecord.user, lastLogin: new Date().toISOString() };
  
  return {
    user,
    accessToken: generateToken(user.id, "access"),
    refreshToken: generateToken(user.id, "refresh"),
    expiresIn: 3600 // 1 hour
  };
}

// Mock current user (validate token)
export function mockCurrentUser(token: string): AuthUser | null {
  // Extract user ID from token (simplified)
  const match = token.match(/_(usr_\d+)_/);
  if (!match) return null;
  
  const userId = match[1];
  const userRecord = Object.values(MOCK_USERS).find(u => u.user.id === userId);
  
  return userRecord ? userRecord.user : null;
}

// Mock refresh token
export function mockRefreshToken(refreshToken: string): { accessToken: string; expiresIn: number } | null {
  // Extract user ID from token
  const match = refreshToken.match(/_(usr_\d+)_/);
  if (!match) return null;
  
  const userId = match[1];
  
  return {
    accessToken: generateToken(userId, "access"),
    expiresIn: 3600
  };
}
