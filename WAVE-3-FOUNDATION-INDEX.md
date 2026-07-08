# WAVE 3 FOUNDATION — DOCUMENT INDEX

**Generated:** 2026-07-08T14:04:51.302Z  
**Baseline:** v0.2.0-wave2  
**Status:** ✅ COMPLETE

---

## Documents Overview

### Primary Documentation

| Document | Size | Purpose | Audience |
|----------|------|---------|----------|
| **WAVE-3-FOUNDATION.md** | 178 KB, 728 lines | Full architectural blueprint | Engineering Team |
| **WAVE-3-FOUNDATION-SUMMARY.md** | 16 KB, 489 lines | Executive summary (Bahasa Indonesia) | Tech Lead, CTO |
| **WAVE-3-FOUNDATION-INDEX.md** | This file | Navigation guide | All Stakeholders |

---

## WAVE-3-FOUNDATION.md Structure

**Total:** 11 major sections, 28 subsections, 728 lines, ~27,000 words

### Section 1: Executive Summary
- Problem statement (Wave 2 limitations)
- Current architecture issues (8 pain points)
- Proposed solution (feature-based modules)
- Expected outcome (10x scalability)

### Section 2: Current State Analysis
- Repository structure (80+ files)
- Architecture strengths (8 items)
- Architecture weaknesses (10 items)

### Section 3: Task 1 — Frontend Application Architecture
- Proposed folder structure
- Architecture principles (5 core principles)
- Folder responsibilities
- Migration path (4 phases)

### Section 4: Task 2 — Feature Module Architecture
- Module design pattern
- Module template (6 folders)
- Module responsibilities (6 sections)
- Module communication (4 strategies)
- Wave 2 migration plan

### Section 5: Task 3 — State Management Strategy
- 5 state categories (server, URL, local, global, realtime)
- State decision matrix
- TanStack Query configuration
- Query key factory
- Optimistic updates
- Anti-patterns (3 examples)

### Section 6: Task 4 — API Layer Design
- API client architecture
- Authentication interceptor
- Error handling (typed errors)
- Retry logic (exponential backoff)
- Offline support
- Module service pattern
- Request/response types
- Mock data toggle
- Backend integration checklist

### Section 7: Task 5 — AI Integration Layer
- AI types (10 interfaces)
- AI client (6 methods)
- Streaming support (SSE)
- React hooks (6 hooks)
- Usage examples (4 scenarios)
- Provider adapters (future)

### Section 8: Task 6 — Realtime Layer
- Realtime client (WebSocket/SSE)
- Connection manager
- Event types (7 events)
- React hooks (4 hooks)
- Polling fallback
- Lifecycle integration
- Message ordering

### Section 9: Task 7 — Command Palette Expansion
- Command types
- Command registry
- 4 providers (navigation, search, action, AI)
- Enhanced component
- Recent commands
- Keyboard shortcuts

### Section 10: Task 8 — Routing Audit
- Current route inventory (22 routes)
- Route classification (stable, enhancement, placeholder)
- Route architecture analysis
- Proposed route architecture (4 improvements)
- Migration plan (3 phases)
- Route documentation template
- Route naming conventions
- Route hierarchy (target state)

### Section 11: Task 9 — Performance Strategy
- Performance budget (7 metrics)
- Code splitting strategy
- Lazy loading strategy
- Virtualized tables (TanStack Virtual)
- Chart optimization (3 solutions)
- Prefetching strategy
- Memoization strategy
- Image optimization
- Font optimization
- Bundle analysis
- Performance monitoring

### Section 12: Task 10 — Wave 3 Foundation Report
- Blueprint deliverables (10 tasks)
- Architecture comparison (before/after)
- Implementation roadmap (4 phases)
- Risk assessment (technical + organizational)
- Success metrics (quantitative + qualitative)
- Decision matrix
- Documentation deliverables
- Next steps
- Appendices (A-D)

---

## Quick Reference

### Key Architecture Decisions

**Page Reference:** Task 10 → Decision Matrix

| Decision | Choice |
|----------|--------|
| Module System | Domain-Driven (Feature-based) |
| State Management | TanStack Query (No Redux) |
| API Layer | Service Layer Pattern |
| Realtime | WebSocket → SSE → Polling |
| AI Streaming | SSE (Server-Sent Events) |
| Routing | Nested Layouts + Guards |
| Performance | Optimize Early (Code Split + Virtualize) |

---

### Implementation Effort

**Page Reference:** Task 10 → Implementation Roadmap

| Phase | Duration | Priority |
|-------|----------|----------|
| Phase 1: Foundation | 8-12h | 🔴 Critical |
| Phase 2: Wave 3 Screens | 50-80h | 🔴 Critical |
| Phase 3: Performance | 24-32h | 🟡 High |
| Phase 4: Realtime + AI | 16-24h | 🟡 High |
| **TOTAL** | **98-148h** | |

---

### Technology Stack

**Page Reference:** Task 10 → Appendix A

**Core:**
- React 19.2.0 + TypeScript 5.x + Vite 6.x

**State & Routing:**
- TanStack Router 1.170.16
- TanStack Query 5.101.1
- TanStack Table 8.21.3
- TanStack Virtual 3.x (new)

**UI:**
- TailwindCSS 4.2.1
- Radix UI (46 primitives)
- Recharts 2.15.4
- Lucide React 0.575.0

**Utilities:**
- Axios 1.x (HTTP)
- Fuse.js 7.x (fuzzy search, new)

---

### Folder Structure

**Page Reference:** Task 1 → Proposed Folder Structure

```
src/
├── app/              # Application-level (providers, layout, config, command)
├── modules/          # Feature modules (12+ domains)
├── shared/           # Reusable components/hooks (3+ usage)
├── lib/              # Core services (api, realtime, ai, query)
├── ui/               # UI primitives (shadcn/ui)
├── routes/           # File-based routing (thin wrappers)
└── styles/           # Global styles + design tokens
```

---

### Module Template

**Page Reference:** Task 2 → Module Template

```
modules/{domain}/
├── components/       # Private UI components (module-only)
├── hooks/            # Domain hooks (PUBLIC API for other modules)
├── services/         # API client (single source of truth)
├── types/            # TypeScript types (PUBLIC)
├── mock/             # Mock data (development only)
└── pages/            # Public pages (exported to routes/)
```

---

### State Management Matrix

**Page Reference:** Task 3 → State Decision Matrix

| State Type | Tool | Example |
|------------|------|---------|
| Server State | TanStack Query | `useIncidents()` |
| URL State | TanStack Router | `?severity=critical&page=2` |
| Local State | useState | `const [open, setOpen] = useState(false)` |
| Global UI | React Context | `const { isOpen } = useSidebar()` |
| Realtime | Query + WebSocket | `useRealtimeIncidents()` |

---

### Performance Targets

**Page Reference:** Task 9 → Performance Budget

| Metric | Current | Target | Improvement |
|--------|---------|--------|-------------|
| Initial Bundle | ~850KB | < 300KB | -65% |
| TTI | ~5s | < 3s | -40% |
| Route Transition | ~800ms | < 200ms | -75% |
| Table (1000 rows) | ~2500ms | < 100ms | -96% |
| Chart Render | ~400ms | < 150ms | -63% |

---

## Navigation Guide

### For Tech Leads / CTOs

**Read:**
1. WAVE-3-FOUNDATION-SUMMARY.md (Executive summary)
2. WAVE-3-FOUNDATION.md → Task 10 (Full report)
3. WAVE-3-FOUNDATION.md → Risk Assessment
4. WAVE-3-FOUNDATION.md → Decision Matrix

**Time:** 30-45 minutes

---

### For Frontend Engineers

**Read:**
1. WAVE-3-FOUNDATION.md → Task 1 (Architecture)
2. WAVE-3-FOUNDATION.md → Task 2 (Modules)
3. WAVE-3-FOUNDATION.md → Task 3 (State Management)
4. WAVE-3-FOUNDATION.md → Task 4 (API Layer)
5. WAVE-3-FOUNDATION.md → Task 9 (Performance)

**Time:** 2-3 hours

---

### For Backend Engineers

**Read:**
1. WAVE-3-FOUNDATION.md → Task 4 (API Layer Design)
2. WAVE-3-FOUNDATION.md → Task 6 (Realtime Layer)
3. WAVE-3-FOUNDATION.md → Task 5 (AI Integration Layer)

**Time:** 1-2 hours

**Key Takeaway:** Frontend has mock layer, backend integration is **one environment variable change**.

---

### For Product Managers

**Read:**
1. WAVE-3-FOUNDATION-SUMMARY.md (Overview)
2. WAVE-3-FOUNDATION.md → Implementation Roadmap
3. WAVE-3-FOUNDATION.md → Success Metrics

**Time:** 20-30 minutes

---

### For QA Engineers

**Read:**
1. WAVE-3-FOUNDATION.md → Task 9 (Performance Strategy)
2. WAVE-3-FOUNDATION.md → Performance Testing Checklist
3. WAVE-3-FOUNDATION.md → Task 8 (Route Testing Strategy)

**Time:** 1 hour

---

## Key Principles (Quick Reference)

### 1. Feature-Based Modules
- Every domain is a self-contained module
- Module owns all its code (components, hooks, services, types, mock)
- No cross-module component imports
- Hooks are the public API

**Example:** `modules/incident/` owns everything incident-related.

---

### 2. Thin Route Layer
- Routes are 5-10 line wrappers
- All logic lives in modules
- Routes just import and export pages

**Example:**
```tsx
// routes/incidents.tsx
export const Route = createFileRoute('/incidents')({
  component: IncidentListPage, // From modules/incident/pages/
});
```

---

### 3. Service Layer Pattern
- Never import mock data directly
- Always go through service layer
- Backend integration is one-line change

**Example:**
```tsx
// Component uses hook
const { data } = useIncidents();

// Hook uses service
export function useIncidents() {
  return useQuery({
    queryKey: ['incidents'],
    queryFn: incidentService.getIncidents, // Service layer
  });
}

// Service uses API client (or mock)
export const incidentService = {
  getIncidents: () => USE_MOCK ? mockData : apiClient.get('/incidents'),
};
```

---

### 4. State Management by Type
- Server state → TanStack Query
- URL state → TanStack Router
- Local state → useState
- Global UI → React Context
- Realtime → TanStack Query + WebSocket

**Don't use Redux/Zustand.** TanStack Query handles 90% of state needs.

---

### 5. Performance First
- Code split by route (lazy load)
- Virtualize large tables (TanStack Virtual)
- Memoize expensive components
- Prefetch on hover
- Downsample chart data

**Don't optimize later.** Bake performance in from Day 1.

---

## Migration Checklist

### Phase 1: Foundation Setup

- [ ] Create folder structure (`app/`, `modules/`, `shared/`, `lib/`)
- [ ] Move `components/layout/` → `app/layout/`
- [ ] Move `components/shared/` → `shared/components/`
- [ ] Move `components/ui/` → `ui/`
- [ ] Create 8 modules for Wave 2 screens
- [ ] Move route logic to module pages
- [ ] Create service layer for each module
- [ ] Create hooks for each module
- [ ] Refactor components to use hooks (not direct imports)
- [ ] Test: All Wave 2 screens work
- [ ] Test: `npm run build` passes
- [ ] Test: TypeScript 0 errors

---

### Phase 2: Wave 3 Implementation

- [ ] Create `modules/automation/`
- [ ] Create `modules/playbooks/`
- [ ] Create `modules/knowledge/`
- [ ] Create `modules/assets/`
- [ ] Implement mock data for each
- [ ] Implement service layer for each
- [ ] Implement hooks for each
- [ ] Implement pages for each
- [ ] Quality gate 17/17 for each screen
- [ ] Test: All Wave 3 screens work

---

### Phase 3: Performance Optimization

- [ ] Install TanStack Virtual
- [ ] Virtualize incident table
- [ ] Virtualize alert table
- [ ] Virtualize service table
- [ ] Lazy load Recharts
- [ ] Add route-based code splitting
- [ ] Add link hover prefetch
- [ ] Memoize chart components
- [ ] Downsample chart data
- [ ] Install vite-bundle-visualizer
- [ ] Run bundle analysis
- [ ] Install web-vitals
- [ ] Add performance monitoring
- [ ] Test: Bundle < 300KB
- [ ] Test: TTI < 3s
- [ ] Test: Route transition < 200ms
- [ ] Test: Table render < 100ms
- [ ] Test: Lighthouse > 90

---

### Phase 4: Realtime + AI

- [ ] Implement `lib/realtime/client.ts`
- [ ] Implement `lib/realtime/manager.ts`
- [ ] Implement `lib/realtime/hooks.ts`
- [ ] Add `RealtimeProvider` to app
- [ ] Add `useRealtimeIncidents()`
- [ ] Add `useRealtimeAlerts()`
- [ ] Add `useRealtimeMonitoring()`
- [ ] Test: Realtime updates work
- [ ] Test: Reconnection works
- [ ] Test: Polling fallback works
- [ ] Implement `lib/ai/client.ts`
- [ ] Implement `lib/ai/streaming.ts`
- [ ] Implement `lib/ai/hooks.ts`
- [ ] Add AI recommendations to incident detail
- [ ] Add AI chat to AI workspace
- [ ] Test: AI streaming works
- [ ] Test: AI recommendations work

---

## Glossary

**Module** — Self-contained feature domain (e.g., `modules/incident/`)

**Service Layer** — API client abstraction (e.g., `incidentService.ts`)

**Query Key** — TanStack Query cache identifier (e.g., `['incidents', 'list']`)

**Optimistic Update** — Update UI before server confirms

**Virtualization** — Render only visible rows (performance technique)

**Code Splitting** — Lazy load routes/components to reduce bundle size

**Prefetching** — Load data before user navigates

**SSE** — Server-Sent Events (one-way realtime)

**WebSocket** — Bi-directional realtime communication

**Realtime Fallback** — Polling when WebSocket/SSE unavailable

**TanStack Query** — React library for server state management

**TanStack Router** — File-based routing library

**TanStack Table** — Headless table library

**TanStack Virtual** — Headless virtualization library

**Radix UI** — Accessible UI primitive library

**shadcn/ui** — Copy-paste UI components built on Radix

---

## References

### Wave 2 Documentation

- `WAVE-2-RELEASE.md` — Wave 2 release report
- `WAVE-2-QUALITY-REVIEW.md` — Quality audit (7 screens, 95% avg)
- `TECHNICAL-DEBT-REVIEW.md` — Technical debt assessment (LOW)
- `COMPONENT-AUDIT.md` — Component reuse analysis

### Repository Health

- `REPOSITORY-HEALTH.md` — Build status, Git status
- `PUSH-RESULT.md` — Git push log
- `GIT-TAG-RESULT.md` — Tag creation (v0.2.0-wave2)

### ADRs (Future)

- ADR-010: Feature Module Architecture (to be created)
- ADR-011: State Management Strategy (to be created)
- ADR-012: API Layer Design (to be created)

---

## Contact

**Questions about this blueprint?**

1. Review WAVE-3-FOUNDATION-SUMMARY.md first
2. Search WAVE-3-FOUNDATION.md for specific topics
3. Consult with Lead Frontend Engineer
4. Schedule architecture review session

---

**Document Status:** ✅ COMPLETE  
**Last Updated:** 2026-07-08T14:04:51.302Z  
**Version:** 1.0.0  
**Prepared by:** Kiro (AI Engineering Assistant)

