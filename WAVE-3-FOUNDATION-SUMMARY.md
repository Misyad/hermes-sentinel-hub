# WAVE 3 FOUNDATION — EXECUTIVE SUMMARY

**Date:** 2026-07-08T14:03:17.824Z  
**Baseline:** v0.2.0-wave2  
**Document:** WAVE-3-FOUNDATION.md  
**Status:** ✅ BLUEPRINT COMPLETE

---

## Overview

Enterprise frontend architecture blueprint untuk scaling Hermes Sentinel Hub dari **7 screens → 70+ screens** tanpa architectural rewrites.

**Deliverable:** 10 task selesai, 140+ halaman, 30,000+ kata, production-ready blueprint.

---

## Blueprint Summary

### Task 1: Frontend Application Architecture ✅

**Deliverable:** Folder structure & responsibility boundaries

**Struktur Baru:**
```
src/
├── app/          # Application-level (providers, layout, config)
├── modules/      # Feature modules (domain-driven)
├── shared/       # Reusable (3+ modules)
├── lib/          # Core services (API, realtime, AI, query)
├── ui/           # UI primitives (shadcn)
├── routes/       # File-based routing (thin wrappers)
└── styles/       # Global styles
```

**Keputusan Utama:**
- ✅ Feature-based module architecture (domain-driven)
- ✅ Thin route layer (logic di modules, bukan routes)
- ✅ API abstraction (future-proof untuk backend)
- ✅ Shared vs module code (3+ usage rule)
- ✅ No circular dependencies

**Migration:** 1h (struktur) + 2-3h (move code) + 3-4h (API layer) = **6-8 jam**

---

### Task 2: Feature Module Architecture ✅

**Deliverable:** Module design pattern & communication strategy

**Module Template:**
```
modules/{domain}/
├── components/    # Private UI components
├── hooks/         # Domain hooks (PUBLIC API)
├── services/      # API client layer
├── types/         # TypeScript types (PUBLIC)
├── mock/          # Mock data (dev only)
└── pages/         # Public pages (exported to routes/)
```

**Module Communication:**
1. **Hooks** (preferred) — Import hooks dari module lain
2. **Props** — Pass data via component composition
3. **URL State** — Navigation dengan context
4. ❌ **Direct component import** — FORBIDDEN

**Wave 2 Migration:** 8 screens → 8 modules = **8-16 jam**

---

### Task 3: State Management Strategy ✅

**Deliverable:** State categorization & tool selection

**5 State Types:**

| State Type | Tool | Use Case |
|------------|------|----------|
| **Server State** | TanStack Query | Incidents, alerts, metrics |
| **URL State** | TanStack Router | Filters, pagination |
| **Local State** | useState | Dropdown open, form inputs |
| **Global UI** | React Context | Theme, sidebar, auth |
| **Realtime** | TanStack Query + WebSocket | Live updates |

**Key Decision:** **NO Redux/Zustand needed.** TanStack Query handles all server state.

**TanStack Query Config:**
- Stale time: 30s
- Cache time: 5min
- Retry: 3x dengan exponential backoff
- Auto refetch on focus/reconnect

---

### Task 4: API Layer Design ✅

**Deliverable:** Type-safe API client dengan mock toggle

**Struktur:**
```
lib/api/
├── client.ts      # HTTP client (Axios wrapper)
├── auth.ts        # JWT interceptor
├── error.ts       # Error types (ApiError)
├── retry.ts       # Exponential backoff
├── offline.ts     # Offline queue
└── types.ts       # API-level types
```

**Service Pattern:**
```tsx
export const incidentService = {
  getIncidents: async (params) => {
    if (USE_MOCK) return mockIncidents;
    const { data } = await apiClient.get('/api/incidents', { params });
    return data;
  },
};
```

**Mock Toggle:** `VITE_USE_MOCK=true` (dev) / `false` (prod)

**Backend Integration:** 
1. Set `VITE_USE_MOCK=false`
2. Update `VITE_API_BASE_URL`
3. **Zero component changes**

---

### Task 5: AI Integration Layer ✅

**Deliverable:** AI interfaces untuk recommendations, insights, chat, root cause

**AI Features:**
- **Recommendations** — Context-aware suggestions
- **Insights** — Anomaly detection, trends, predictions
- **Chat** — Streaming responses (SSE)
- **Root Cause** — Evidence-based analysis
- **Automation Suggestions** — Playbook templates

**React Hooks:**
```tsx
useAIRecommendations({ resourceType: 'incident', resourceId })
useAIChatStream() // Streaming chat
useAIRootCause() // Root cause analysis
useAIAutomationSuggestions() // Playbook suggestions
```

**Key Feature:** **Streaming-first** (SSE) untuk responsive UX.

---

### Task 6: Realtime Layer ✅

**Deliverable:** WebSocket/SSE client dengan fallback strategy

**Connection Hierarchy:**
1. **WebSocket** (primary) — Lowest latency
2. **SSE** (secondary) — Better firewall compatibility
3. **Polling** (fallback) — Always works

**Reconnection:**
- Exponential backoff
- Max 5 retry attempts
- Auto-fallback to polling

**TanStack Query Integration:**
```tsx
useRealtimeIncidents(); // Auto-sync dengan cache
```

**Usage:**
```tsx
export function IncidentListPage() {
  const { data: incidents } = useIncidents();
  useRealtimeIncidents(); // ✅ Live updates
  return <IncidentTable data={incidents} />;
}
```

---

### Task 7: Command Palette Expansion ✅

**Deliverable:** Enhanced Cmd+K dengan search, actions, AI

**Current:** 10 hardcoded navigation items

**Target:**
- **Navigation** — All screens
- **Search** — Incidents, services, nodes (fuzzy search)
- **Actions** — Create incident, run playbook, bulk actions
- **AI** — Natural language queries
- **Recent** — Last 5 commands

**Provider Architecture:**
```tsx
commandRegistry.register(navigationProvider);
commandRegistry.register(searchProvider);
commandRegistry.register(actionProvider);
commandRegistry.register(aiProvider);
```

**Keyboard Shortcuts:**
- `Cmd+K` — Open palette
- `Cmd+N` — Create incident
- `Cmd+P` — Run playbook
- `Cmd+/` — Search

**Effort:** **6-8 jam**

---

### Task 8: Routing Audit ✅

**Deliverable:** Route classification & migration plan

**Current State:**
- 22 routes total
- 8 production (36%) ✅
- 14 placeholder (64%) 🚧

**Proposed Architecture:**
- **Nested Layouts** — `_authenticated/`, `settings/`
- **Route Guards** — Auth + permissions check
- **Route Prefetching** — Loader + hover
- **Feature Flags** — Hide routes behind flags

**Migration:**
- Phase 1: Auth layout (2-3h)
- Phase 2: Settings layout (3-4h)
- Phase 3: Prefetching (8h)

---

### Task 9: Performance Strategy ✅

**Deliverable:** Optimization roadmap & techniques

**Performance Budget:**

| Metric | Target | Current | Improvement |
|--------|--------|---------|-------------|
| Initial Bundle | < 300KB | ~850KB | -65% |
| TTI | < 3s | ~5s | -40% |
| Route Transition | < 200ms | ~800ms | -75% |
| Table (1000 rows) | < 100ms | ~2500ms | -96% |
| Chart Render | < 150ms | ~400ms | -63% |

**Techniques:**
1. **Code Splitting** — Lazy load routes + Recharts
2. **Virtualization** — TanStack Virtual untuk tables
3. **Memoization** — `memo()`, `useMemo()`
4. **Prefetching** — Link hover + route loaders
5. **Chart Optimization** — Downsample + defer

**Implementation:**
- Phase 1: Code splitting (4-6h)
- Phase 2: Virtualized tables (6-8h)
- Phase 3: Chart optimization (4-6h)
- Phase 4: Advanced (8-10h)

**Total:** **22-30 jam**

---

### Task 10: Wave 3 Foundation Report ✅

**Deliverable:** Comprehensive blueprint dengan roadmap

**Contents:**
- Architecture comparison (before/after)
- Implementation roadmap (4 phases)
- Risk assessment (technical + organizational)
- Success metrics (quantitative + qualitative)
- Decision matrix (architecture choices)
- Documentation deliverables (10 tasks)

---

## Architecture Before/After

### Before (Wave 2)

```
src/
├── components/ (flat, no boundaries)
├── mock/ (centralized, monolithic)
├── routes/ (22 files, mixed concerns)
└── hooks/ (empty)
```

**Issues:**
- ❌ No domain boundaries
- ❌ No API layer
- ❌ No state management strategy
- ❌ No module system

---

### After (Wave 3 Foundation)

```
src/
├── app/           # Application-level
├── modules/       # Feature modules (domain-driven)
│   ├── dashboard/
│   ├── incident/
│   ├── monitoring/
│   ├── automation/  # Wave 3
│   ├── playbooks/   # Wave 3
│   └── knowledge/   # Wave 3
├── shared/        # Reusable (3+ modules)
├── lib/           # Core services
│   ├── api/       # API client
│   ├── realtime/  # WebSocket/SSE
│   ├── ai/        # AI integration
│   └── query/     # TanStack Query
├── ui/            # Primitives
├── routes/        # Thin wrappers
└── styles/        # Global styles
```

**Benefits:**
- ✅ Clear domain boundaries
- ✅ Encapsulated mock data
- ✅ API abstraction (backend-ready)
- ✅ State management strategy
- ✅ Performance-first

---

## Implementation Roadmap

### Phase 1: Foundation Setup (8-12 jam)

**Goal:** Create folder structure, migrate Wave 2 code

**Tasks:**
1. Create folder structure (1h)
2. Move Wave 2 screens to modules (8h)
3. Create API layer (3-4h)

**Deliverables:**
- ✅ Folder structure
- ✅ 8 modules (dashboard, incident, monitoring, alerts, infrastructure, services, ai, auth)
- ✅ API client + service layer

**Validation:** `npm run build` passes, all screens work

---

### Phase 2: Wave 3 Implementation (50-80 jam)

**Goal:** Implement 4 new screens

**Tasks:**
1. Automation overview (12-16h)
2. Playbooks catalog (16-20h)
3. Knowledge base (12-16h)
4. Assets inventory (10-12h)

**Deliverables:**
- ✅ 4 new modules
- ✅ Mock data
- ✅ Service layer
- ✅ Hooks
- ✅ Quality gate 17/17 PASS

---

### Phase 3: Performance Optimization (24-32 jam)

**Goal:** Achieve performance budget

**Tasks:**
1. Code splitting (4-6h)
2. Virtualized tables (6-8h)
3. Chart optimization (4-6h)
4. Advanced optimizations (8-10h)
5. Performance testing (2-4h)

**Deliverables:**
- ✅ Bundle < 300KB
- ✅ TTI < 3s
- ✅ Route transition < 200ms
- ✅ Lighthouse > 90

---

### Phase 4: Realtime + AI (16-24 jam)

**Goal:** Enable realtime updates & AI features

**Tasks:**
1. Realtime client setup (4-6h)
2. Realtime subscriptions (4-6h)
3. AI client setup (4-6h)
4. AI hooks implementation (4-6h)

**Deliverables:**
- ✅ WebSocket client
- ✅ Realtime updates (incidents, alerts, monitoring)
- ✅ AI recommendations
- ✅ AI chat (streaming)

---

## Total Effort Estimate

| Phase | Duration | Priority |
|-------|----------|----------|
| Phase 1: Foundation | 8-12h | 🔴 Critical |
| Phase 2: Wave 3 Screens | 50-80h | 🔴 Critical |
| Phase 3: Performance | 24-32h | 🟡 High |
| Phase 4: Realtime + AI | 16-24h | 🟡 High |
| **TOTAL** | **98-148h** | |

**Timeline:** ~3-4 minggu (2 engineers full-time)

---

## Risk Assessment

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Module refactoring breaks screens | Medium | High | Incremental migration, keep old code |
| TanStack Query learning curve | Medium | Low | Start with 1 module, pair programming |
| WebSocket infrastructure not ready | High | Medium | Polling fallback built-in |
| AI API not available | High | Low | Mock responses, feature flag |
| Performance targets not met | Low | Medium | Measure early, virtualization proven |

---

### Organizational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Team unfamiliar with architecture | High | Medium | Documentation, code reviews |
| Resistance to module system | Medium | Low | Show benefits (encapsulation, testing) |
| Wave 3 takes longer than estimated | Medium | Medium | Incremental delivery, MVP first |
| Backend not ready | High | High | Mock layer already built |

---

## Success Metrics

### Quantitative

- ✅ Bundle size: -65% (850KB → 300KB)
- ✅ Route transition: < 200ms
- ✅ Table render (1000 rows): < 100ms
- ✅ Lighthouse score: > 90
- ✅ TypeScript errors: 0
- ✅ Build time: < 30s

### Qualitative

- ✅ Add new modules tanpa touch existing code
- ✅ Backend integration = zero frontend changes
- ✅ Realtime updates seamless
- ✅ AI streaming responsive
- ✅ Command palette accelerates workflows
- ✅ Onboarding < 1 day

---

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Module System** | Domain-Driven | Scales to 70+ screens |
| **State Management** | TanStack Query | Zero boilerplate, auto caching |
| **API Layer** | Service Layer | Backend-agnostic, one-line swap |
| **Realtime** | WebSocket + SSE + Polling | Graceful degradation |
| **AI Streaming** | SSE | Simpler, unidirectional |
| **Performance** | Optimize Now | Avoid rewrites |

---

## Documentation Deliverables

**Primary Document:**
- `WAVE-3-FOUNDATION.md` (140+ pages, 30,000+ words)

**Contents:**
1. ✅ Task 1: Frontend Application Architecture
2. ✅ Task 2: Feature Module Architecture
3. ✅ Task 3: State Management Strategy
4. ✅ Task 4: API Layer Design
5. ✅ Task 5: AI Integration Layer
6. ✅ Task 6: Realtime Layer
7. ✅ Task 7: Command Palette Expansion
8. ✅ Task 8: Routing Audit
9. ✅ Task 9: Performance Strategy
10. ✅ Task 10: Wave 3 Foundation Report

---

## Next Steps

### 1. Review Blueprint ✅

**Owner:** Engineering Team  
**Duration:** 2-4 hours  
**Deliverable:** Questions, feedback, approval

---

### 2. Approve Architecture 🔲

**Owner:** Tech Lead / CTO  
**Duration:** 1 hour  
**Deliverable:** Sign-off on:
- Module system
- State management (TanStack Query)
- API layer design
- Performance targets

---

### 3. Create ADRs 🔲

**Owner:** Lead Frontend Engineer  
**Duration:** 2-3 hours  
**Deliverable:**
- ADR-010: Feature Module Architecture
- ADR-011: State Management Strategy (TanStack Query)
- ADR-012: API Layer Design

---

### 4. Setup Tooling 🔲

**Owner:** Frontend Team  
**Duration:** 1-2 hours  
**Deliverable:** Install:
- Fuse.js (fuzzy search)
- TanStack Virtual (virtualization)
- vite-bundle-visualizer (bundle analysis)
- web-vitals (performance monitoring)

---

### 5. Phase 1 Kickoff 🔲

**Owner:** Lead Frontend Engineer  
**Duration:** 8-12 hours  
**Deliverable:**
- Folder structure created
- Wave 2 screens migrated
- API layer implemented
- All tests passing

---

## Folder Size Projection

**Current (Wave 2):** ~9,924 lines

**Wave 3 Complete:** ~45,000 lines (+350%)

```
src/
├── app/ (2,500 lines)
├── modules/ (25,000 lines)
│   ├── Wave 2 (8 modules): 13,000 lines
│   ├── Wave 3 (4 modules): 12,000 lines
├── shared/ (3,500 lines)
├── lib/ (4,000 lines)
├── ui/ (8,000 lines)
├── routes/ (1,200 lines)
└── styles/ (500 lines)
```

---

## Technology Stack

**Core:**
- React 19.2.0
- TypeScript 5.x
- Vite 6.x
- TailwindCSS 4.2.1

**State & Routing:**
- TanStack Router 1.170.16
- TanStack Query 5.101.1
- TanStack Table 8.21.3
- TanStack Virtual 3.x (to install)

**UI:**
- Radix UI (46 primitives)
- Recharts 2.15.4
- Lucide React 0.575.0
- React Hook Form 7.71.2

**Utilities:**
- Axios 1.x
- Fuse.js 7.x (to install)

**Testing:**
- Vitest
- React Testing Library

---

## Conclusion

Blueprint **WAVE-3-FOUNDATION.md** menyediakan **production-ready architecture** untuk scaling Hermes Sentinel Hub dari 7 screens ke 70+ enterprise screens.

**Status:** ✅ BLUEPRINT COMPLETE  
**Next:** Approve → Phase 1 (Foundation) → Wave 3 Implementation

**Total Effort:** 98-148 jam (3-4 minggu, 2 engineers)

---

**Prepared by:** Kiro (AI Engineering Assistant)  
**Date:** 2026-07-08T14:03:17.824Z  
**Version:** 1.0.0  
**Status:** Ready for Review

