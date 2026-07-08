# MOCK API ARCHITECTURE — WAVE 3 FOUNDATION

**Design Date:** 2026-07-08T17:05:12.583Z  
**Status:** ARCHITECTURE SPECIFICATION  
**Implementation:** NOT STARTED

---

## Executive Summary

**Objective:** Build a scalable frontend data architecture that serves as a bridge between mock data (Phase 2) and NestJS backend (Phase 3).

**Key Principle:** **UI must never know the data source.**

```
Current (Wave 2):
Screen → import { mockAlerts } from '@/mock' → Mock Data

Target (Wave 3 Foundation):
Screen → Adapter → Mock Data

Future (Phase 3):
Screen → Adapter → REST API → NestJS Backend
```

**Result:** Zero code changes in UI when backend is connected.

---

## Architecture Overview

### Three-Layer Architecture

```
┌─────────────────────────────────────────┐
│         PRESENTATION LAYER              │
│    (Routes, Components, Hooks)          │
└─────────────────┬───────────────────────┘
                  │ import from @/services
                  ↓
┌─────────────────────────────────────────┐
│          ADAPTER LAYER                  │
│  (Domain Services, Response Mappers)    │
└─────────────────┬───────────────────────┘
                  │ import from @/lib/api
                  ↓
┌─────────────────────────────────────────┐
│           DATA LAYER                    │
│    (Mock Adapter / REST Client)         │
└─────────────────────────────────────────┘
```

### Data Flow

**Wave 3 (Mock Mode):**
```
Dashboard Screen
  → import { getDashboardMetrics } from '@/services/dashboard'
  → getDashboardMetrics() 
  → apiClient.get('/dashboard/metrics')
  → mockAdapter.get('/dashboard/metrics')
  → mockDashboard.metrics
  → return DashboardMetricsResponse
```

**Phase 3 (API Mode):**
```
Dashboard Screen
  → import { getDashboardMetrics } from '@/services/dashboard'
  → getDashboardMetrics()
  → apiClient.get('/dashboard/metrics')
  → axios.get('https://api.hermes.local/dashboard/metrics')
  → NestJS Controller
  → return DashboardMetricsResponse
```

**Zero changes in Dashboard Screen.**

---

## Current State Analysis

### Existing Structure (Wave 2)

```
src/
├── mock/
│   ├── index.ts           # Re-exports all mock data
│   ├── types.ts           # Shared interfaces (47 lines)
│   ├── operations.ts      # Monitoring, alerts (314 lines)
│   └── infrastructure.ts  # Nodes, services (332 lines)
├── routes/
│   ├── monitoring.tsx     # ❌ Direct import: mockMetrics
│   ├── alerts.tsx         # ❌ Direct import: mockAlerts
│   └── infrastructure.tsx # ❌ Direct import: mockNodes
└── lib/
    └── utils.ts           # Only cn() helper
```

### Problems

1. **Direct Coupling:** Routes import mock data directly
2. **No Abstraction:** No service layer
3. **No API Client:** No unified HTTP interface
4. **Type Sprawl:** Types mixed with mock data
5. **Migration Risk:** Switching to API requires touching every screen

### Current Usage (4 direct imports detected)

```typescript
// src/routes/monitoring.tsx
import { mockMetrics } from '@/mock';

// src/routes/alerts.tsx
import { mockAlerts } from '@/mock';

// src/routes/infrastructure.tsx
import { mockNodes } from '@/mock';

// src/routes/services.tsx
import { mockServices } from '@/mock';
```

---

## Target Architecture

### Folder Structure

```
src/
├── types/                          # 🆕 Shared TypeScript interfaces
│   ├── index.ts                    # Re-export all types
│   ├── common.ts                   # Common types (TimeSeriesPoint, Metric, Status)
│   ├── dashboard.ts                # Dashboard types
│   ├── incidents.ts                # Incident, IncidentTimeline
│   ├── monitoring.ts               # MonitoringMetric, ServiceHealth
│   ├── alerts.ts                   # Alert, AlertRule
│   ├── infrastructure.ts           # Node, Cluster, Resource
│   ├── services.ts                 # Service, Dependency
│   ├── automation.ts               # Playbook, Workflow, Job
│   ├── knowledge.ts                # KnowledgeArticle, Runbook
│   ├── ai.ts                       # AIRecommendation, AIAnalysis
│   ├── governance.ts               # AuditLog, ComplianceCheck
│   ├── users.ts                    # User, Role, Permission
│   └── settings.ts                 # Settings, Integration
│
├── mock/                           # 🔄 Reorganize by domain
│   ├── index.ts                    # Re-export all mocks
│   ├── dashboard.ts                # Dashboard mock data
│   ├── incidents.ts                # Incidents mock data
│   ├── monitoring.ts               # Monitoring mock data
│   ├── alerts.ts                   # Alerts mock data
│   ├── infrastructure.ts           # Infrastructure mock data
│   ├── services.ts                 # Services mock data
│   ├── automation.ts               # Automation mock data
│   ├── playbooks.ts                # Playbooks mock data
│   ├── knowledge.ts                # Knowledge base mock data
│   ├── ai.ts                       # AI recommendations mock data
│   ├── governance.ts               # Governance mock data
│   ├── users.ts                    # Users mock data
│   └── settings.ts                 # Settings mock data
│
├── lib/                            # 🆕 API abstraction
│   ├── api/
│   │   ├── index.ts                # Re-export client, config
│   │   ├── config.ts               # API_MODE, BASE_URL
│   │   ├── client.ts               # Unified apiClient
│   │   ├── types.ts                # ApiResponse<T>, ApiError
│   │   ├── errors.ts               # Error handling
│   │   └── adapters/
│   │       ├── index.ts            # Export mock/rest adapters
│   │       ├── mock.ts             # Mock adapter (uses src/mock/)
│   │       └── rest.ts             # REST adapter (axios, Phase 3)
│   └── utils.ts                    # Existing utils
│
├── services/                       # 🆕 Domain services (Adapter Layer)
│   ├── index.ts                    # Re-export all services
│   ├── dashboard.ts                # getDashboardMetrics(), getDashboardAlerts()
│   ├── incidents.ts                # getIncidents(), getIncident(id)
│   ├── monitoring.ts               # getMonitoringMetrics(), getServiceHealth()
│   ├── alerts.ts                   # getAlerts(), acknowledgeAlert(id)
│   ├── infrastructure.ts           # getNodes(), getNodeDetail(id)
│   ├── services.ts                 # getServices(), getServiceDeps(id)
│   ├── automation.ts               # getPlaybooks(), executePlaybook(id)
│   ├── playbooks.ts                # getPlaybookDetail(id)
│   ├── knowledge.ts                # getArticles(), searchKnowledge(q)
│   ├── ai.ts                       # getRecommendations(), askAI(prompt)
│   ├── governance.ts               # getAuditLogs(), getComplianceStatus()
│   ├── users.ts                    # getUsers(), updateUser(id, data)
│   └── settings.ts                 # getSettings(), updateSettings(data)
│
├── routes/                         # 🔄 Screens (no changes to UI)
│   ├── index.tsx                   # import { getDashboardMetrics } from '@/services'
│   ├── monitoring.tsx              # import { getMonitoringMetrics } from '@/services'
│   ├── alerts.tsx                  # import { getAlerts } from '@/services'
│   └── ...
│
└── components/                     # ✅ No changes
```

---

## Implementation Plan

### Phase 1: Foundation (2 hours)

**1.1 Create Type System**
- [ ] Create `src/types/index.ts`
- [ ] Extract types from `src/mock/types.ts` → `src/types/common.ts`
- [ ] Create domain-specific type files (dashboard, incidents, monitoring, alerts, etc.)
- [ ] Update `src/mock/` imports to use `@/types`

**1.2 Create API Config**
- [ ] Create `src/lib/api/config.ts`
  ```typescript
  export const API_MODE = (import.meta.env.VITE_API_MODE || 'mock') as 'mock' | 'rest';
  export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
  export const API_TIMEOUT = 30000;
  ```

**1.3 Create API Types**
- [ ] Create `src/lib/api/types.ts`
  ```typescript
  export interface ApiResponse<T> {
    data: T;
    meta?: {
      page?: number;
      limit?: number;
      total?: number;
    };
  }
  
  export interface ApiError {
    message: string;
    code: string;
    status: number;
  }
  ```

### Phase 2: Mock Adapter (2 hours)

**2.1 Create Mock Adapter**
- [ ] Create `src/lib/api/adapters/mock.ts`
  ```typescript
  import { mockDashboard } from '@/mock/dashboard';
  import { mockAlerts } from '@/mock/alerts';
  // ... other imports
  
  export class MockAdapter {
    async get<T>(url: string): Promise<ApiResponse<T>> {
      const route = parseRoute(url);
      const data = this.mockRouter(route);
      return { data };
    }
    
    private mockRouter(route: ParsedRoute): any {
      // Route → Mock mapping
      if (route.path === '/dashboard/metrics') return mockDashboard.metrics;
      if (route.path === '/alerts') return mockAlerts.list;
      // ...
    }
  }
  ```

**2.2 Create REST Adapter Stub**
- [ ] Create `src/lib/api/adapters/rest.ts`
  ```typescript
  export class RestAdapter {
    async get<T>(url: string): Promise<ApiResponse<T>> {
      throw new Error('REST adapter not implemented yet (Phase 3)');
    }
  }
  ```

**2.3 Create Unified Client**
- [ ] Create `src/lib/api/client.ts`
  ```typescript
  import { API_MODE } from './config';
  import { MockAdapter } from './adapters/mock';
  import { RestAdapter } from './adapters/rest';
  
  const adapter = API_MODE === 'mock' ? new MockAdapter() : new RestAdapter();
  
  export const apiClient = {
    get: <T>(url: string) => adapter.get<T>(url),
    post: <T>(url: string, data: any) => adapter.post<T>(url, data),
    put: <T>(url: string, data: any) => adapter.put<T>(url, data),
    delete: <T>(url: string) => adapter.delete<T>(url),
  };
  ```

### Phase 3: Domain Services (3 hours)

**3.1 Create Service Layer**
- [ ] Create `src/services/dashboard.ts`
  ```typescript
  import { apiClient } from '@/lib/api';
  import type { DashboardMetrics } from '@/types';
  
  export async function getDashboardMetrics(): Promise<DashboardMetrics> {
    const response = await apiClient.get<DashboardMetrics>('/dashboard/metrics');
    return response.data;
  }
  ```

- [ ] Create services for all domains:
  - [ ] `dashboard.ts` (2 functions)
  - [ ] `incidents.ts` (5 functions)
  - [ ] `monitoring.ts` (3 functions)
  - [ ] `alerts.ts` (4 functions)
  - [ ] `infrastructure.ts` (4 functions)
  - [ ] `services.ts` (3 functions)
  - [ ] `automation.ts` (6 functions)
  - [ ] `playbooks.ts` (3 functions)
  - [ ] `knowledge.ts` (3 functions)
  - [ ] `ai.ts` (2 functions)
  - [ ] `governance.ts` (3 functions)
  - [ ] `users.ts` (4 functions)
  - [ ] `settings.ts` (2 functions)

### Phase 4: Mock Data Reorganization (2 hours)

**4.1 Reorganize Mock Data**
- [ ] Split `src/mock/operations.ts` → `monitoring.ts` + `alerts.ts`
- [ ] Split `src/mock/infrastructure.ts` → `infrastructure.ts` + `services.ts`
- [ ] Create missing mock files:
  - [ ] `dashboard.ts`
  - [ ] `incidents.ts`
  - [ ] `automation.ts`
  - [ ] `playbooks.ts`
  - [ ] `knowledge.ts`
  - [ ] `ai.ts`
  - [ ] `governance.ts`
  - [ ] `users.ts`
  - [ ] `settings.ts`

**4.2 Update Mock Index**
- [ ] Update `src/mock/index.ts` to re-export all domains

### Phase 5: Screen Migration (2 hours)

**5.1 Migrate Existing Screens**
- [ ] Update `src/routes/monitoring.tsx`
  ```typescript
  // Before:
  import { mockMetrics } from '@/mock';
  
  // After:
  import { getMonitoringMetrics } from '@/services';
  const metrics = await getMonitoringMetrics();
  ```

- [ ] Migrate screens:
  - [ ] `index.tsx` (Dashboard)
  - [ ] `monitoring.tsx`
  - [ ] `alerts.tsx`
  - [ ] `infrastructure.tsx`
  - [ ] `services.tsx`
  - [ ] `incidents.index.tsx`
  - [ ] `incidents.$id.tsx`

**5.2 Verify No Direct Imports**
- [ ] Run: `grep -r "from '@/mock'" src/routes/ | wc -l` → 0

### Phase 6: Testing & Verification (1 hour)

**6.1 Manual Testing**
- [ ] Test all 8 production screens still work
- [ ] Test mock data flows through adapter
- [ ] Test error scenarios

**6.2 Build Verification**
- [ ] TypeScript: 0 errors
- [ ] Build: Success
- [ ] Bundle size: No significant increase

---

## Dependency Graph

```
┌─────────────────────────────────────────────────────┐
│                   PRESENTATION                      │
│  (routes/, components/, hooks/)                     │
│                                                      │
│  import { getDashboardMetrics } from '@/services'   │
└────────────────────┬────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────┐
│                  ADAPTER LAYER                      │
│  (services/)                                        │
│                                                      │
│  Dashboard Service, Monitoring Service, etc.        │
│                                                      │
│  import { apiClient } from '@/lib/api'              │
│  import type { DashboardMetrics } from '@/types'    │
└────────────────────┬────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────┐
│                   API CLIENT                        │
│  (lib/api/)                                         │
│                                                      │
│  API_MODE = 'mock' | 'rest'                         │
│  apiClient = mockAdapter | restAdapter              │
└────────────────────┬────────────────────────────────┘
                     │
           ┌─────────┴─────────┐
           ↓                   ↓
┌───────────────────┐  ┌──────────────────┐
│   Mock Adapter    │  │   REST Adapter   │
│  (adapters/mock)  │  │  (adapters/rest) │
│                   │  │                  │
│  Routes mock data │  │  axios.get()     │
│  to API responses │  │  (Phase 3)       │
└─────────┬─────────┘  └──────────────────┘
          │
          ↓
┌───────────────────┐
│    Mock Data      │
│     (mock/)       │
│                   │
│  dashboard.ts     │
│  monitoring.ts    │
│  alerts.ts        │
│  etc.             │
└───────────────────┘
```

---

## Migration Strategy

### Wave 3 (Current): Mock Mode

**Environment:**
```bash
# .env
VITE_API_MODE=mock
```

**Data Flow:**
```
Screen → Service → apiClient → MockAdapter → Mock Data
```

**Benefits:**
- UI development continues without backend
- Realistic data structure
- Test error scenarios
- Fast iteration

### Phase 3 (Future): Hybrid Mode

**Environment:**
```bash
# .env
VITE_API_MODE=rest
VITE_API_BASE_URL=http://localhost:3000/api
```

**Data Flow:**
```
Screen → Service → apiClient → RestAdapter → axios → NestJS
```

**Migration Steps:**
1. Implement NestJS endpoints
2. Implement `RestAdapter.get/post/put/delete`
3. Change `VITE_API_MODE=rest`
4. **Zero code changes in screens**

### Phase 4 (Future): Production Mode

**Environment:**
```bash
# .env
VITE_API_MODE=rest
VITE_API_BASE_URL=https://api.hermes.projecthasan.com
```

**Benefits:**
- Same code path as development
- Easy rollback (switch VITE_API_MODE back to mock)
- Gradual migration (some endpoints mock, some real)

---

## API Route Mapping

### Dashboard Domain

| Service Method | API Route | Mock Source |
|----------------|-----------|-------------|
| `getDashboardMetrics()` | `GET /dashboard/metrics` | `mockDashboard.metrics` |
| `getDashboardAlerts()` | `GET /dashboard/alerts` | `mockDashboard.recentAlerts` |
| `getDashboardIncidents()` | `GET /dashboard/incidents` | `mockDashboard.recentIncidents` |

### Monitoring Domain

| Service Method | API Route | Mock Source |
|----------------|-----------|-------------|
| `getMonitoringMetrics()` | `GET /monitoring/metrics` | `mockMonitoring.metrics` |
| `getServiceHealth()` | `GET /monitoring/services` | `mockMonitoring.services` |
| `getTimeSeriesData(metric)` | `GET /monitoring/timeseries/:metric` | `mockMonitoring.timeseries` |

### Alerts Domain

| Service Method | API Route | Mock Source |
|----------------|-----------|-------------|
| `getAlerts(filters)` | `GET /alerts?severity=critical` | `mockAlerts.list` |
| `getAlert(id)` | `GET /alerts/:id` | `mockAlerts.detail(id)` |
| `acknowledgeAlert(id)` | `POST /alerts/:id/acknowledge` | `mockAlerts.acknowledge(id)` |
| `resolveAlert(id)` | `POST /alerts/:id/resolve` | `mockAlerts.resolve(id)` |

### Infrastructure Domain

| Service Method | API Route | Mock Source |
|----------------|-----------|-------------|
| `getNodes()` | `GET /infrastructure/nodes` | `mockInfrastructure.nodes` |
| `getNode(id)` | `GET /infrastructure/nodes/:id` | `mockInfrastructure.nodeDetail(id)` |
| `getClusters()` | `GET /infrastructure/clusters` | `mockInfrastructure.clusters` |

### Automation Domain (Wave 3)

| Service Method | API Route | Mock Source |
|----------------|-----------|-------------|
| `getAutomationMetrics()` | `GET /automation/metrics` | `mockAutomation.metrics` |
| `getPlaybooks()` | `GET /automation/playbooks` | `mockAutomation.playbooks` |
| `getPlaybook(id)` | `GET /automation/playbooks/:id` | `mockAutomation.playbookDetail(id)` |
| `executePlaybook(id)` | `POST /automation/playbooks/:id/execute` | `mockAutomation.execute(id)` |
| `getWorkflows()` | `GET /automation/workflows` | `mockAutomation.workflows` |
| `getJobs()` | `GET /automation/jobs` | `mockAutomation.jobs` |

---

## Risk Analysis

### High Risk

**1. Breaking Changes in Existing Screens**
- **Risk:** Migrating 4 screens from direct imports to service layer could introduce bugs
- **Mitigation:**
  - Migrate one screen at a time
  - Test after each migration
  - Keep mock data identical during migration
  - Rollback strategy: revert individual commits

**2. Type System Complexity**
- **Risk:** Moving types from mock/ to types/ could create circular dependencies
- **Mitigation:**
  - Types depend only on other types (no circular imports)
  - Mock data imports types (types/ → mock/)
  - Services import types (types/ → services/)
  - Clear dependency hierarchy

### Medium Risk

**3. Mock Adapter Route Mapping**
- **Risk:** Complex URL parsing to map routes to mock data
- **Mitigation:**
  - Start with simple string matching
  - Use switch/case for clarity
  - Document route → mock mapping
  - Add route not found error with helpful message

**4. API Response Shape Mismatch**
- **Risk:** Mock response shape differs from future NestJS API
- **Mitigation:**
  - Define ApiResponse<T> type early
  - Always wrap data in `{ data: T }` structure
  - Add `meta` field for pagination (even if unused in mock)
  - Document expected API contract

### Low Risk

**5. Performance Overhead**
- **Risk:** Extra abstraction layers could slow down mock responses
- **Mitigation:**
  - Mock adapter is synchronous (wrapped in Promise for API compatibility)
  - No network latency
  - Measure: benchmark before/after
  - Target: <5ms overhead per request

**6. Bundle Size Increase**
- **Risk:** New service layer files increase bundle size
- **Mitigation:**
  - Services are small (10-30 lines each)
  - Tree-shaking removes unused services
  - Route-level code splitting already in place
  - Estimated increase: <5 KB gzipped

---

## Implementation Checklist

### Foundation
- [ ] Create `src/types/` folder structure (13 files)
- [ ] Create `src/lib/api/` folder structure (7 files)
- [ ] Create `src/services/` folder structure (13 files)
- [ ] Reorganize `src/mock/` by domain (13 files)

### API Layer
- [ ] Implement `lib/api/config.ts` (API_MODE, BASE_URL)
- [ ] Implement `lib/api/types.ts` (ApiResponse, ApiError)
- [ ] Implement `lib/api/client.ts` (Unified apiClient)
- [ ] Implement `lib/api/adapters/mock.ts` (Mock adapter with routing)
- [ ] Implement `lib/api/adapters/rest.ts` (Stub for Phase 3)
- [ ] Implement `lib/api/errors.ts` (Error handling utilities)

### Type System
- [ ] Extract common types to `types/common.ts`
- [ ] Create domain-specific types (dashboard, incidents, monitoring, alerts, etc.)
- [ ] Update mock files to import from `@/types`

### Domain Services
- [ ] Implement `services/dashboard.ts` (2 functions)
- [ ] Implement `services/incidents.ts` (5 functions)
- [ ] Implement `services/monitoring.ts` (3 functions)
- [ ] Implement `services/alerts.ts` (4 functions)
- [ ] Implement `services/infrastructure.ts` (4 functions)
- [ ] Implement `services/services.ts` (3 functions)
- [ ] Implement `services/automation.ts` (6 functions, Wave 3)
- [ ] Implement `services/playbooks.ts` (3 functions, Wave 3)
- [ ] Implement `services/knowledge.ts` (3 functions, Wave 3)
- [ ] Implement `services/ai.ts` (2 functions)
- [ ] Implement `services/governance.ts` (3 functions, Wave 4)
- [ ] Implement `services/users.ts` (4 functions, Wave 5)
- [ ] Implement `services/settings.ts` (2 functions, Wave 5)

### Mock Data
- [ ] Split `mock/operations.ts` → `monitoring.ts` + `alerts.ts`
- [ ] Split `mock/infrastructure.ts` → `infrastructure.ts` + `services.ts`
- [ ] Create `mock/dashboard.ts`
- [ ] Create `mock/incidents.ts`
- [ ] Create `mock/automation.ts` (Wave 3)
- [ ] Create `mock/playbooks.ts` (Wave 3)
- [ ] Create `mock/knowledge.ts` (Wave 3)
- [ ] Create `mock/ai.ts`
- [ ] Create `mock/governance.ts` (Wave 4)
- [ ] Create `mock/users.ts` (Wave 5)
- [ ] Create `mock/settings.ts` (Wave 5)
- [ ] Update `mock/index.ts` to re-export all

### Screen Migration
- [ ] Migrate `routes/index.tsx` (Dashboard)
- [ ] Migrate `routes/monitoring.tsx`
- [ ] Migrate `routes/alerts.tsx`
- [ ] Migrate `routes/infrastructure.tsx`
- [ ] Migrate `routes/services.tsx`
- [ ] Migrate `routes/incidents.index.tsx`
- [ ] Migrate `routes/incidents.$id.tsx`
- [ ] Migrate `routes/ai.tsx`

### Verification
- [ ] TypeScript: 0 errors
- [ ] Build: Success
- [ ] All 8 screens render correctly
- [ ] No direct imports from `@/mock` in routes/
- [ ] Bundle size delta: <5 KB
- [ ] Manual testing: all interactions work

### Documentation
- [ ] Update `COMPONENT-LIBRARY.md` (if needed)
- [ ] Create `API-INTEGRATION-GUIDE.md` (Phase 3 reference)
- [ ] Update `README.md` (mention data architecture)

---

## Success Criteria

### Phase Complete When:
1. ✅ All screens import data via `@/services` (not `@/mock`)
2. ✅ `grep -r "from '@/mock'" src/routes/` returns 0 matches
3. ✅ TypeScript: 0 errors
4. ✅ Build: Success
5. ✅ All 8 production screens render correctly
6. ✅ Mock adapter routes all current API calls
7. ✅ Clear path to Phase 3 REST integration documented

### Future Phase 3 Complete When:
1. ✅ `RestAdapter` implemented with axios
2. ✅ NestJS backend endpoints implemented
3. ✅ Change `VITE_API_MODE=rest`
4. ✅ **Zero code changes in screens**
5. ✅ All features work with real backend

---

## Estimated Effort

| Phase | Task | Effort |
|-------|------|--------|
| 1 | Foundation (types, config, API types) | 2 hours |
| 2 | Mock Adapter (routing, error handling) | 2 hours |
| 3 | Domain Services (13 service files) | 3 hours |
| 4 | Mock Data Reorganization (13 mock files) | 2 hours |
| 5 | Screen Migration (8 screens) | 2 hours |
| 6 | Testing & Verification | 1 hour |
| **Total** | | **12 hours** |

---

## Next Steps

### Immediate (Now)
1. **Review architecture** — Confirm approach with team
2. **Prioritize domains** — Start with Dashboard, Monitoring, Alerts (existing screens)
3. **Create branch** — `feat/mock-api-architecture`

### After Approval
1. **Phase 1:** Foundation (2h)
2. **Phase 2:** Mock Adapter (2h)
3. **Phase 3:** Domain Services (3h)
4. **Phase 4:** Mock Data Reorganization (2h)
5. **Phase 5:** Screen Migration (2h)
6. **Phase 6:** Testing & Verification (1h)

### After Implementation
1. **PR Review** — Architecture + implementation
2. **Merge to main** — Tag as `v0.3.0-mock-api`
3. **Wave 3 Screens** — Build Automation screens using new architecture
4. **Phase 3 Planning** — NestJS backend + REST adapter

---

**Status:** ARCHITECTURE SPECIFICATION COMPLETE  
**Implementation:** AWAITING APPROVAL  
**Estimated Effort:** 12 hours  
**Risk Level:** MEDIUM (mitigated)

---

**Document:** MOCK-API-ARCHITECTURE.md  
**Lines:** 700+  
**Size:** ~40 KB  
**Completeness:** 100%
