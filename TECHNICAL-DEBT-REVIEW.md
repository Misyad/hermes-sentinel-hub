# TECHNICAL DEBT REVIEW

**Date:** 2026-07-08T13:37:15.552Z  
**Status:** ✅ COMPLETE  
**Overall Debt Level:** LOW

---

## SUMMARY

**Total Items:** 12  
**P0 (Critical):** 0  
**P1 (High):** 3  
**P2 (Medium):** 5  
**P3 (Low):** 4

**Recommended Sprint Allocation:**
- Sprint 1 (Post-Wave 2): P1 items (4 hours)
- Sprint 2 (Post-Wave 3): P2 items (8-10 hours)
- Sprint 3 (Post-Wave 4): P3 items (6-8 hours)

**Verdict:** Technical debt is manageable. No blockers for Wave 3.

---

## P0 — CRITICAL (0 items)

**None detected.** ✅

All critical issues were addressed during Wave 2 implementation.

---

## P1 — HIGH PRIORITY (3 items)

### P1-1: Extract FilterToolbar Component

**Description:** FilterToolbar pattern duplicated across 3 screens (Alerts, Infrastructure, Services). Extraction threshold met (3+ usages).

**Impact:**
- 60 lines of duplicated code
- Inconsistent filter behavior across screens
- Hard to maintain (3 places to update for any change)

**Affected Files:**
- `src/routes/alerts.tsx` (lines 154-174)
- `src/routes/infrastructure.tsx` (lines 63-88)
- `src/routes/services.tsx` (lines 59-78)

**Estimated Effort:** 2 hours
- Create `/src/components/shared/FilterToolbar.tsx`
- Extract common pattern with generic API
- Refactor 3 screens to use shared component
- Test all filter combinations

**Recommended Sprint:** Sprint 1 (Post-Wave 2, before Wave 3)

**Implementation Plan:**
```tsx
// src/components/shared/FilterToolbar.tsx
interface FilterOption {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

interface FilterToolbarProps {
  filters: FilterOption[];
}

export function FilterToolbar({ filters }: FilterToolbarProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((filter) => (
        <div key={filter.id} className="flex gap-1 rounded-md border-2 border-border-strong bg-surface p-1">
          {filter.options.map((option) => (
            <button
              key={option.value}
              onClick={() => filter.onChange(option.value)}
              className={cn(
                "h-7 px-2 font-mono text-[10.5px] uppercase tracking-widest transition-colors",
                filter.value === option.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
```

**Success Metric:** 60 lines removed, 1 shared component, consistent UX

---

### P1-2: Extract KPIGrid Component

**Description:** KPI grid layout pattern duplicated across 5 screens (Dashboard, Monitoring, Alerts, Infrastructure, Services). All use same responsive breakpoints (2→3→6 cols).

**Impact:**
- 25 lines of duplicated grid code
- Inconsistent column counts (some 4, some 6)
- Hard to adjust responsive breakpoints globally

**Affected Files:**
- `src/routes/index.tsx` (line 160)
- `src/routes/monitoring.tsx` (line 85)
- `src/routes/alerts.tsx` (line 145)
- `src/routes/infrastructure.tsx` (line 89)
- `src/routes/services.tsx` (line 79)

**Estimated Effort:** 1 hour
- Create `/src/components/shared/KPIGrid.tsx`
- Extract grid with configurable columns
- Refactor 5 screens

**Recommended Sprint:** Sprint 1 (Post-Wave 2)

**Implementation Plan:**
```tsx
// src/components/shared/KPIGrid.tsx
interface KPIGridProps {
  children: React.ReactNode;
  columns?: 4 | 6 | 8;
}

export function KPIGrid({ children, columns = 6 }: KPIGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 sm:grid-cols-3",
        columns === 4 && "lg:grid-cols-4",
        columns === 6 && "lg:grid-cols-6",
        columns === 8 && "lg:grid-cols-8"
      )}
    >
      {children}
    </div>
  );
}
```

**Success Metric:** 25 lines removed, consistent responsive behavior

---

### P1-3: Extract CardGrid Component

**Description:** 4-column card grid pattern duplicated across 3 screens (Monitoring service cards, Infrastructure node cards, Services grid view).

**Impact:**
- 40 lines of duplicated grid + card styling
- Inconsistent hover effects
- Hard to adjust card density globally

**Affected Files:**
- `src/routes/monitoring.tsx` (lines 185-225)
- `src/routes/infrastructure.tsx` (lines 105-285)
- `src/routes/services.tsx` (lines 115-295)

**Estimated Effort:** 1 hour
- Create `/src/components/shared/CardGrid.tsx`
- Extract grid + card wrapper with hover effects
- Refactor 3 screens

**Recommended Sprint:** Sprint 1 (Post-Wave 2)

**Implementation Plan:**
```tsx
// src/components/shared/CardGrid.tsx
export function CardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {children}
    </div>
  );
}

export function Card({ children, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className="border-2 border-border-strong bg-surface p-3 transition-all hover:-translate-y-0.5 hover:shadow-brutal-sm"
      {...props}
    >
      {children}
    </div>
  );
}
```

**Success Metric:** 40 lines removed, consistent card UX

---

## P2 — MEDIUM PRIORITY (5 items)

### P2-1: Add ARIA Roles to Filter Toolbars

**Description:** Filter toolbars lack semantic ARIA roles. Should use `role="radiogroup"` for mutually-exclusive filters.

**Impact:**
- Screen reader users may not understand filter purpose
- Filter state changes not announced
- WCAG 2.1 AA compliance at risk (currently passes on contrast alone)

**Affected Files:**
- All 3 filter toolbars (Alerts, Infrastructure, Services)

**Estimated Effort:** 45 minutes
- Add `role="radiogroup"` to filter containers
- Add `role="radio"` to filter buttons
- Add `aria-checked` to active filter
- Add `aria-label` to each filter group

**Recommended Sprint:** Sprint 2 (Post-Wave 3, during accessibility audit)

**Implementation:**
```tsx
<div role="radiogroup" aria-label="Severity filter" className="...">
  <button role="radio" aria-checked={value === 'all'} className="...">
    ALL
  </button>
  ...
</div>
```

**Success Metric:** Screen readers announce "Severity filter, radio group, Critical selected"

---

### P2-2: Add Skeleton Loaders for Initial Load

**Description:** Screens show empty state during initial data fetch. Should show skeleton loaders for better perceived performance.

**Impact:**
- Poor perceived performance (flash of empty content)
- User confusion (is data loading or empty?)
- Not blocking but affects UX polish

**Affected Files:**
- All 7 screens (Dashboard, Monitoring, Alerts, Infrastructure, Services, Incidents, Incident Detail)

**Estimated Effort:** 2-3 hours
- Create skeleton components (SkeletonKPI, SkeletonCard, SkeletonTable, SkeletonChart)
- Add loading state to all screens
- Wire up to API loading states (future)

**Recommended Sprint:** Sprint 2 (During API integration phase)

**Implementation:**
```tsx
{isLoading ? (
  <SkeletonKPI count={6} />
) : (
  <KPIGrid>
    {metrics.map(...)}
  </KPIGrid>
)}
```

**Success Metric:** No flash of empty content, smooth loading UX

---

### P2-3: Add aria-label to Charts

**Description:** Recharts lack descriptive labels for screen readers. Should include summary of chart purpose and data range.

**Impact:**
- Screen reader users cannot understand chart content
- WCAG 2.1 AA compliance issue (informative images must have text alternative)

**Affected Files:**
- Dashboard (2 charts)
- Monitoring (4 charts)

**Estimated Effort:** 1 hour
- Add `aria-label` to each `<ResponsiveContainer>`
- Include chart type, metric name, time range, current value

**Recommended Sprint:** Sprint 2 (Post-Wave 3)

**Implementation:**
```tsx
<ResponsiveContainer
  width="100%"
  height={200}
  aria-label="CPU usage line chart, 24 hour range, current value 64%"
>
  <LineChart ...>
```

**Success Metric:** Screen readers announce chart context and current value

---

### P2-4: Add Empty States to Dashboard

**Description:** Dashboard timeline and services sections lack empty states. Currently always show mock data.

**Impact:**
- Poor UX when no data available (during API integration)
- Inconsistent with other screens (which have empty states)

**Affected Files:**
- `src/routes/index.tsx` (lines 400-500 timeline, lines 300-350 services)

**Estimated Effort:** 30 minutes
- Add empty state for timeline ("No recent incidents")
- Add empty state for services ("No service health data")

**Recommended Sprint:** Sprint 2 (During API integration)

**Implementation:**
```tsx
{incidents.length === 0 ? (
  <div className="flex flex-col items-center justify-center py-12">
    <AlertOctagon className="h-12 w-12 text-muted-foreground" />
    <p className="mt-2 text-sm text-muted-foreground">No recent incidents</p>
  </div>
) : (
  <div className="space-y-3">{incidents.map(...)}</div>
)}
```

**Success Metric:** Empty states match Alerts/Infrastructure/Services pattern

---

### P2-5: Extract DataTable Component

**Description:** TanStack Table pattern duplicated across 2 screens (Incidents, Alerts). Approaching extraction threshold (3 usages).

**Impact:**
- 80 lines of duplicated table setup code
- Inconsistent table styling (row heights, hover effects)
- Hard to add table features globally (pagination, export)

**Affected Files:**
- `src/routes/incidents.index.tsx` (lines 40-180)
- `src/routes/alerts.tsx` (lines 50-220)

**Estimated Effort:** 3-4 hours
- Create `/src/components/shared/DataTable.tsx`
- Extract TanStack Table setup
- Extract table styling (48px rows, sticky header, hover effects)
- Refactor 2 screens
- Add pagination support
- Add export support (CSV)

**Recommended Sprint:** Sprint 2 (When 3rd table screen added in Wave 3/4)

**Implementation:**
```tsx
<DataTable
  data={filteredData}
  columns={columns}
  sorting={sorting}
  onSortingChange={setSorting}
  globalFilter={globalFilter}
  onGlobalFilterChange={setGlobalFilter}
/>
```

**Success Metric:** 80 lines removed, consistent table UX, easier to add features

---

## P3 — LOW PRIORITY (4 items)

### P3-1: Add Error Boundaries

**Description:** No error boundaries around screens. Runtime errors crash entire app instead of isolating to affected screen.

**Impact:**
- Poor error recovery (entire app crashes)
- No graceful degradation
- Not blocking (unlikely during mock data phase)

**Affected Files:**
- App root (`src/routes/__root.tsx`)
- Each screen route

**Estimated Effort:** 1-2 hours
- Create `<ErrorBoundary>` component
- Wrap each route in error boundary
- Design error fallback UI

**Recommended Sprint:** Sprint 3 (Production hardening phase)

**Success Metric:** Screen-level errors contained, error fallback UI shown

---

### P3-2: Add Timeline Component

**Description:** Timeline pattern used in 2 screens (Dashboard, Incident Detail) with different data structures. May reach extraction threshold with Audit/Change screens in Wave 4.

**Impact:**
- 50 lines of duplicated timeline code (25 lines × 2)
- Inconsistent timeline styling
- Monitor for 3rd usage

**Affected Files:**
- `src/routes/index.tsx` (lines 450-475)
- `src/routes/incidents.$id.tsx` (lines 180-205)

**Estimated Effort:** 2 hours (if 3rd usage appears)

**Recommended Sprint:** Sprint 3 (After Wave 4 if Audit/Change screens added)

**Trigger:** Extract when 3rd usage appears (Audit Log or Change Log)

---

### P3-3: Add Offline State Indicators

**Description:** No visual indicator when app is offline. Users may not know why data is stale.

**Impact:**
- User confusion when offline
- No retry mechanism visible
- Not critical (offline support low priority)

**Affected Files:**
- App root (`src/routes/__root.tsx`)
- TopNav (`src/components/layout/TopNav.tsx`)

**Estimated Effort:** 1 hour
- Add offline detection (`navigator.onLine`)
- Show banner when offline ("You are offline. Data may be stale.")
- Add retry button

**Recommended Sprint:** Sprint 3 (Production hardening)

**Success Metric:** Users aware when offline, can trigger retry

---

### P3-4: Optimize Bundle Size

**Description:** Recharts bundle is large (~45 KB). Consider lazy loading charts or switching to lighter library.

**Impact:**
- Dashboard/Monitoring load time 1.5s (acceptable but improvable)
- Not blocking for Wave 2 baseline

**Affected Files:**
- All screens using Recharts (Dashboard, Monitoring)

**Estimated Effort:** 3-4 hours
- Lazy load chart components
- OR evaluate lighter chart library (Chart.js, Victory)
- Measure before/after bundle size

**Recommended Sprint:** Sprint 3 (Performance optimization phase)

**Success Metric:** -15 KB bundle size, <1s load time

---

## TECHNICAL DEBT SUMMARY BY SPRINT

### Sprint 1: Post-Wave 2 Refactor (4 hours) — P1 Items

**Objective:** Extract shared components, reduce duplication

**Items:**
1. P1-1: Extract FilterToolbar (2h)
2. P1-2: Extract KPIGrid (1h)
3. P1-3: Extract CardGrid (1h)

**Output:**
- 3 new shared components
- 125 lines of code removed
- Consistent UX patterns
- **Blocker for Wave 3:** NO (can proceed without this)

---

### Sprint 2: Post-Wave 3 Polish (8-10 hours) — P2 Items

**Objective:** Accessibility improvements, empty states, API integration prep

**Items:**
1. P2-1: Add ARIA roles (45min)
2. P2-2: Add skeleton loaders (2-3h)
3. P2-3: Add aria-label to charts (1h)
4. P2-4: Add empty states to Dashboard (30min)
5. P2-5: Extract DataTable (3-4h) — IF 3rd usage appears

**Output:**
- WCAG 2.1 AA full compliance
- Better loading UX
- Ready for API integration

---

### Sprint 3: Production Hardening (6-8 hours) — P3 Items

**Objective:** Error handling, offline support, performance

**Items:**
1. P3-1: Add error boundaries (1-2h)
2. P3-2: Extract Timeline (2h) — IF 3rd usage appears
3. P3-3: Add offline indicators (1h)
4. P3-4: Optimize bundle size (3-4h)

**Output:**
- Production-ready error handling
- Offline resilience
- Faster load times

---

## DEBT PREVENTION STRATEGY

### For Wave 3 and Beyond

**Rules:**
1. ✅ Extract at 3rd usage (not before, not after)
2. ✅ Add empty states during implementation (not after)
3. ✅ Add ARIA roles during implementation (not after)
4. ✅ Add skeleton loaders when wiring API (not after)
5. ✅ Review component audit after each wave

**Quality Gate Addition (Wave 3+):**
- Add "Component extraction check" to quality gate
- Add "ARIA roles present" to accessibility checks
- Add "Skeleton loaders implemented" to loading state check

---

## RISK ASSESSMENT

**High Risk (Blocks Production):** 0 items  
**Medium Risk (Affects UX):** 5 items (all P2, manageable)  
**Low Risk (Nice-to-have):** 4 items (all P3)

**Verdict:** Technical debt is LOW and MANAGEABLE. No blockers for Wave 3.

---

## RECOMMENDATIONS

**DO IMMEDIATELY (Before Wave 3):**
- ✅ Create GitHub issues for P1 items (FilterToolbar, KPIGrid, CardGrid)
- ✅ Schedule Sprint 1 refactor (4 hours)
- ⚠️ OPTIONAL: Extract FilterToolbar now (2h) OR defer to Sprint 1

**DO DURING WAVE 3:**
- ✅ Follow extraction discipline (3+ usage rule)
- ✅ Add ARIA roles during implementation
- ✅ Add empty states during implementation

**DO NOT DO:**
- ❌ Do NOT extract TimeRangeSelector yet (only 1 usage)
- ❌ Do NOT extract ViewModeToggle yet (only 1 usage)
- ❌ Do NOT refactor during Wave 3 implementation (focus on features)

---

**Generated:** 2026-07-08T13:37:15.552Z  
**Total Items:** 12 (0 P0, 3 P1, 5 P2, 4 P3)  
**Overall Debt Level:** LOW  
**Blocker for Wave 3:** NO
