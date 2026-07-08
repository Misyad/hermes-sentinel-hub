# FRONTEND ENGINEERING GUIDE v1.0

**Project:** Hermes Sentinel Hub  
**Baseline:** v0.2.0-wave2  
**Date:** 2026-07-08  
**Status:** Official Engineering Standard  
**Audience:** Senior Frontend Engineers

---

## Document Overview

This is the **official Frontend Engineering Standard** for Hermes Sentinel Hub.

**Purpose:** Define HOW the frontend must be implemented.

**Not Covered:**
- ❌ Design decisions (see Design System v1.1)
- ❌ UI specifications (see UI Specification)
- ❌ Component library (see Component Library)
- ❌ Information architecture (see Information Architecture)

**Covered:**
- ✅ Engineering principles
- ✅ Project structure
- ✅ Naming conventions
- ✅ Code organization
- ✅ State management
- ✅ Performance standards
- ✅ Accessibility requirements
- ✅ Testing strategy
- ✅ Quality gates

**Authority:** This document supersedes all informal conventions. When in doubt, refer here.

**Updates:** Major changes require ADR. Minor clarifications via PR with architect approval.

---

## Table of Contents

1. [Engineering Principles](#section-1-engineering-principles)
2. [Project Structure](#section-2-project-structure)
3. [Feature Module Standard](#section-3-feature-module-standard)
4. [Naming Conventions](#section-4-naming-conventions)
5. [Component Engineering Rules](#section-5-component-engineering-rules)
6. [Hooks Convention](#section-6-hooks-convention)
7. [TanStack Query Standard](#section-7-tanstack-query-standard)
8. [API Layer](#section-8-api-layer)
9. [Mock Strategy](#section-9-mock-strategy)
10. [State Management](#section-10-state-management)
11. [Forms](#section-11-forms)
12. [Styling Standards](#section-12-styling-standards)
13. [Performance](#section-13-performance)
14. [Accessibility](#section-14-accessibility)
15. [Routing](#section-15-routing)
16. [Realtime](#section-16-realtime)
17. [AI Integration](#section-17-ai-integration)
18. [Testing](#section-18-testing)
19. [Git Workflow](#section-19-git-workflow)
20. [Code Review Checklist](#section-20-code-review-checklist)
21. [Definition of Done](#section-21-definition-of-done)
22. [Engineering Anti-Patterns](#section-22-engineering-anti-patterns)
23. [Migration Guide](#section-23-migration-guide)
24. [Appendices](#section-24-appendices)

---

# SECTION 1: Engineering Principles

## Core Principles

These principles guide every engineering decision in Hermes Sentinel Hub.

---

### 1.1 Simplicity

**Definition:** Choose the simplest solution that solves the problem completely.

**Rules:**
- Prefer fewer abstractions over more abstractions
- Prefer inline code over premature extraction
- Prefer explicit over clever
- Prefer obvious over terse

**Example — Simplicity:**

```tsx
// ❌ BAD: Over-abstracted
const useDataFetcher = <T,>(key: string, fetcher: () => Promise<T>) => {
  return useQuery({ queryKey: [key], queryFn: fetcher });
};

// ✅ GOOD: Direct and obvious
const { data: incidents } = useQuery({
  queryKey: ['incidents', 'list'],
  queryFn: () => incidentService.getIncidents(),
});
```

**Why:** Abstractions have a cost. Only pay it when you get value back (reuse, clarity, maintainability).

---

### 1.2 Consistency

**Definition:** The same thing should look the same everywhere.

**Rules:**
- Use established patterns, don't invent new ones
- Follow conventions in this guide
- Match existing code style in the module
- When patterns conflict, prefer the one in this guide

**Example — Consistency:**

```tsx
// If the codebase uses named exports:
export function IncidentCard() { /* ... */ }

// Don't suddenly switch to default exports:
// ❌ BAD
export default function IncidentCard() { /* ... */ }
```

**Why:** Consistency reduces cognitive load. Engineers can focus on logic, not syntax variations.

---

### 1.3 Predictability

**Definition:** Code behavior should match expectations without surprises.

**Rules:**
- No hidden side effects
- No implicit global state changes
- No magic behavior
- Input → Output should be obvious

**Example — Predictability:**

```tsx
// ❌ BAD: Hidden side effect
function useIncidents() {
  const { data } = useQuery(/* ... */);
  
  // Surprise! This hook modifies global state
  useEffect(() => {
    globalIncidentCount.set(data?.length || 0);
  }, [data]);
  
  return data;
}

// ✅ GOOD: Explicit and predictable
function useIncidents() {
  return useQuery({
    queryKey: ['incidents', 'list'],
    queryFn: () => incidentService.getIncidents(),
  });
}
```

**Why:** Predictable code is debuggable code. Side effects should be explicit and intentional.

---

### 1.4 Scalability

**Definition:** Architecture should support 10x growth without rewrites.

**Rules:**
- Design for 100 screens, not 10
- Avoid monolithic files (max 500 lines)
- Clear module boundaries
- No circular dependencies

**Example — Scalability:**

```tsx
// ❌ BAD: Everything in one file
// routes/incidents.tsx (2000 lines)
function IncidentListPage() { /* 500 lines */ }
function IncidentCard() { /* 300 lines */ }
function IncidentFilters() { /* 200 lines */ }
// ... 15 more components

// ✅ GOOD: Clear boundaries
// modules/incident/pages/IncidentListPage.tsx (100 lines)
// modules/incident/components/IncidentCard.tsx (80 lines)
// modules/incident/components/IncidentFilters.tsx (60 lines)
```

**Why:** Hermes will grow from 7 screens to 70+. Architecture must support this without collapsing.

---

### 1.5 Performance First

**Definition:** Performance is not an afterthought. It's baked into every decision.

**Rules:**
- Measure before optimizing, but don't ignore obvious problems
- Virtualize large lists (>100 items)
- Lazy load routes and heavy dependencies
- Memoize expensive computations

**Example — Performance First:**

```tsx
// ❌ BAD: Render 10,000 DOM nodes
<table>
  {incidents.map(incident => <IncidentRow key={incident.id} incident={incident} />)}
</table>

// ✅ GOOD: Virtualize (render ~20 visible rows)
import { useVirtualizer } from '@tanstack/react-virtual';

const virtualizer = useVirtualizer({
  count: incidents.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 48,
});
```

**Why:** Users expect sub-200ms interactions. Slow UI = bad UX, regardless of features.

---

### 1.6 Accessibility First

**Definition:** Accessibility is not optional. Every UI must be usable by everyone.

**Rules:**
- Keyboard navigation required
- Screen reader support required
- WCAG 2.1 AA minimum
- Focus management explicit
- Semantic HTML preferred

**Example — Accessibility First:**

```tsx
// ❌ BAD: div button (not keyboard accessible, no semantics)
<div onClick={handleClick}>Click me</div>

// ✅ GOOD: Proper button element
<button onClick={handleClick}>Click me</button>

// ✅ BETTER: With accessible label
<button 
  onClick={handleClick}
  aria-label="Delete incident INC-001"
>
  <TrashIcon />
</button>
```

**Why:** 15% of users have disabilities. Accessible UI = more users, better UX for everyone.

---

### 1.7 Composition over Inheritance

**Definition:** Build complex UIs by composing simple components, not inheritance hierarchies.

**Rules:**
- Prefer React composition (children, render props)
- No class inheritance for UI
- Use hooks for behavior sharing
- Slots over props when flexible layout needed

**Example — Composition:**

```tsx
// ❌ BAD: Inheritance (fragile, hard to change)
class BaseCard extends React.Component { /* ... */ }
class IncidentCard extends BaseCard { /* override render */ }
class AlertCard extends BaseCard { /* override render */ }

// ✅ GOOD: Composition (flexible, explicit)
<Card>
  <CardHeader>
    <CardTitle>Incident INC-001</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Custom content */}
  </CardContent>
</Card>
```

**Why:** Composition is flexible. Inheritance is rigid. React's component model rewards composition.

---

### 1.8 Convention over Configuration

**Definition:** Reduce decisions by establishing clear conventions.

**Rules:**
- Follow folder structure conventions (see Section 2)
- Follow naming conventions (see Section 4)
- Don't create custom build configs without reason
- Use defaults when they work

**Example — Convention:**

```tsx
// ❌ BAD: Custom organization (where does this go?)
src/stuff/incident-things/incident-card-component.jsx

// ✅ GOOD: Follows convention (obvious location)
src/modules/incident/components/IncidentCard.tsx
```

**Why:** Conventions reduce onboarding time. New engineers know where things go without asking.

---

## Principle Priority

When principles conflict, use this priority order:

1. **Accessibility** — Users with disabilities can't use inaccessible UI
2. **Simplicity** — Complex code is unmaintainable
3. **Predictability** — Surprising behavior causes bugs
4. **Performance** — Slow UI frustrates users
5. **Consistency** — Inconsistency confuses engineers
6. **Scalability** — Growth is inevitable
7. **Composition** — Flexibility over rigidity
8. **Convention** — Reduce cognitive load

**Example Conflict:**

*Scenario:* A pattern would be more consistent but less performant.

*Resolution:* Choose performance (priority 4) over consistency (priority 5). Add a comment explaining the deviation.

```tsx
// Usually we memo components at 3+ usage, but this component
// has expensive rendering (chart with 10k points), so we memo
// at first usage for performance.
const ExpensiveChart = memo(function ExpensiveChart({ data }: Props) {
  /* ... */
});
```

---

## Engineering Values

Beyond principles, these values guide our engineering culture:

**Bias to Action** — Ship iteratively. Perfect is the enemy of good.

**Evidence-Based** — Measure before claiming. Lighthouse scores over gut feelings.

**Incremental** — Small PRs. Small changes. Small risks.

**Ownership** — You build it, you own it, you fix it.

**Documentation** — Code explains HOW. Comments explain WHY.

**Quality** — Tests pass. Types check. Lint passes. No exceptions.

**Long-Term Thinking** — Optimize for 5 years, not 5 days.

---

**END OF SECTION 1**

---

# SECTION 2: Project Structure

## Folder Structure

This is the **canonical folder structure** for Hermes Sentinel Hub.

Every folder has a clear responsibility. Do not create new top-level folders without architectural approval.

---

## Root Structure

```
hermes-sentinel-hub/
├── .github/              # GitHub workflows, templates
├── .husky/               # Git hooks (pre-commit, pre-push)
├── public/               # Static assets (favicon, images)
├── src/                  # Source code (see below)
├── .env.example          # Environment variables template
├── .eslintrc.cjs         # ESLint configuration
├── .gitignore            # Git ignore rules
├── .prettierrc           # Prettier configuration
├── index.html            # HTML entry point
├── package.json          # Dependencies and scripts
├── postcss.config.js     # PostCSS configuration
├── tailwind.config.ts    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
└── README.md             # Project documentation
```

---

## src/ Structure

```
src/
├── app/                  # Application-level code
│   ├── command/          # Command palette (Cmd+K)
│   ├── config/           # Application configuration
│   ├── layout/           # Application shell layout
│   └── providers/        # Global providers (theme, query, realtime)
│
├── modules/              # Feature modules (domain-driven)
│   ├── dashboard/        # Dashboard module
│   ├── incident/         # Incident management module
│   ├── monitoring/       # Monitoring module
│   ├── alerts/           # Alerts module
│   ├── infrastructure/   # Infrastructure module
│   ├── services/         # Services module
│   ├── automation/       # Automation module
│   ├── playbooks/        # Playbooks module
│   ├── knowledge/        # Knowledge base module
│   ├── ai/               # AI workspace module
│   ├── auth/             # Authentication module
│   └── settings/         # Settings module
│
├── shared/               # Shared code (3+ module usage)
│   ├── components/       # Shared UI components
│   ├── hooks/            # Shared React hooks
│   ├── types/            # Shared TypeScript types
│   └── utils/            # Shared utility functions
│
├── lib/                  # Core infrastructure
│   ├── api/              # API client and configuration
│   ├── query/            # TanStack Query configuration
│   ├── realtime/         # WebSocket/SSE client
│   ├── ai/               # AI integration layer
│   ├── router/           # TanStack Router configuration
│   └── utils/            # Core utility functions
│
├── ui/                   # UI primitives (shadcn/ui)
│   ├── button.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   └── [45 more primitives...]
│
├── routes/               # File-based routing (TanStack Router)
│   ├── __root.tsx        # Root layout
│   ├── index.tsx         # Dashboard route
│   ├── incidents.tsx     # Incidents list route
│   ├── incidents.$id.tsx # Incident detail route
│   └── [more routes...]
│
├── styles/               # Global styles
│   ├── globals.css       # Global CSS and Tailwind directives
│   └── tokens.css        # Design tokens (colors, spacing, etc.)
│
├── types/                # Global TypeScript types
│   ├── api.ts            # API-level types
│   ├── env.d.ts          # Environment variables types
│   └── global.d.ts       # Global type augmentations
│
└── main.tsx              # Application entry point
```

---

## Folder Responsibilities

### app/

**Purpose:** Application-level concerns that don't belong to any specific feature.

**Contents:**
- Command palette
- Application configuration
- Application shell layout (AppShell, Navbar, Sidebar)
- Global providers (QueryClientProvider, RealtimeProvider, ThemeProvider)

**Rules:**
- ❌ No business logic
- ❌ No feature-specific code
- ✅ Only application-wide infrastructure

**Example:**
```
app/
├── command/
│   ├── CommandPalette.tsx
│   ├── CommandRegistry.ts
│   └── providers/
│       ├── NavigationProvider.ts
│       ├── SearchProvider.ts
│       └── ActionProvider.ts
├── config/
│   ├── features.ts         # Feature flags
│   ├── constants.ts        # Application constants
│   └── env.ts              # Environment configuration
├── layout/
│   ├── AppShell.tsx        # Main application shell
│   ├── Navbar.tsx          # Top navigation bar
│   ├── Sidebar.tsx         # Side navigation
│   └── Footer.tsx          # Footer (if any)
└── providers/
    ├── QueryProvider.tsx   # TanStack Query setup
    ├── RealtimeProvider.tsx # WebSocket/SSE setup
    └── ThemeProvider.tsx   # Theme context
```

---

### modules/

**Purpose:** Feature modules. Each module is a self-contained domain.

**Contents:**
- One module per feature domain (incident, monitoring, alerts, etc.)
- Each module owns all its code
- Modules are the PRIMARY organization unit

**Rules:**
- ✅ Each module is self-contained
- ✅ Modules export hooks (public API)
- ✅ Modules can import hooks from other modules
- ❌ Modules cannot import components from other modules
- ❌ Modules cannot import services from other modules

**Module Structure (see Section 3 for details):**
```
modules/incident/
├── components/       # Private UI components
├── pages/            # Public pages (exported to routes/)
├── hooks/            # Public hooks (module's API)
├── services/         # API calls
├── queries/          # TanStack Query wrappers
├── types/            # Module types
├── mock/             # Mock data
├── utils/            # Module-specific utilities
└── index.ts          # Public exports
```

---

### shared/

**Purpose:** Code used by 3 or more modules.

**Contents:**
- Shared UI components
- Shared hooks
- Shared types
- Shared utilities

**Rules:**
- ✅ Extract to `shared/` when used by 3+ modules
- ✅ Extract to `shared/` when clearly generic
- ❌ Don't extract prematurely (wait for 3rd usage)
- ❌ Don't put feature-specific code here

**Example:**
```
shared/
├── components/
│   ├── PageHeader.tsx      # Used by 8 modules
│   ├── Panel.tsx           # Used by 12 modules
│   ├── EmptyState.tsx      # Used by 6 modules
│   └── LoadingSpinner.tsx  # Used by 10 modules
├── hooks/
│   ├── useDebounce.ts      # Used by 5 modules
│   ├── useLocalStorage.ts  # Used by 3 modules
│   └── useMediaQuery.ts    # Used by 4 modules
├── types/
│   ├── common.ts           # Common types
│   └── pagination.ts       # Pagination types
└── utils/
    ├── date.ts             # Date formatting
    ├── string.ts           # String utilities
    └── number.ts           # Number utilities
```

---

### lib/

**Purpose:** Core infrastructure. Framework-level code.

**Contents:**
- API client
- TanStack Query configuration
- Realtime client (WebSocket/SSE)
- AI integration layer
- Router configuration
- Core utilities

**Rules:**
- ✅ Framework-level code only
- ✅ No business logic
- ✅ No UI components
- ❌ No feature-specific code

**Example:**
```
lib/
├── api/
│   ├── client.ts           # Axios client setup
│   ├── auth.ts             # JWT interceptor
│   ├── error.ts            # Error handling
│   ├── retry.ts            # Retry logic
│   └── types.ts            # API types
├── query/
│   ├── client.ts           # QueryClient configuration
│   ├── keys.ts             # Query key factory
│   └── defaults.ts         # Default query options
├── realtime/
│   ├── client.ts           # WebSocket/SSE client
│   ├── manager.ts          # Connection manager
│   ├── hooks.ts            # Realtime hooks
│   └── types.ts            # Realtime types
├── ai/
│   ├── client.ts           # AI client
│   ├── streaming.ts        # SSE streaming
│   ├── hooks.ts            # AI hooks
│   └── types.ts            # AI types
├── router/
│   ├── guards.ts           # Route guards (auth, permissions)
│   └── config.ts           # Router configuration
└── utils/
    ├── cn.ts               # clsx + tailwind-merge
    ├── format.ts           # Formatters
    └── validation.ts       # Validators
```

---

### ui/

**Purpose:** UI primitives from shadcn/ui (Radix UI wrappers).

**Contents:**
- 46 UI primitives (button, dialog, dropdown, etc.)
- Copy-pasted from shadcn/ui
- Styled with Tailwind
- Accessible (WCAG 2.1 AA)

**Rules:**
- ✅ Copy from shadcn/ui, don't write from scratch
- ✅ Customize styles if needed
- ❌ Don't add business logic
- ❌ Don't add feature-specific variants

**Example:**
```
ui/
├── button.tsx
├── dialog.tsx
├── dropdown-menu.tsx
├── input.tsx
├── label.tsx
├── select.tsx
├── table.tsx
├── tabs.tsx
└── [38 more primitives...]
```

---

### routes/

**Purpose:** File-based routing (TanStack Router).

**Contents:**
- Route files (thin wrappers)
- Route layouts
- Route loaders

**Rules:**
- ✅ Routes are thin (5-20 lines)
- ✅ Routes import pages from `modules/`
- ✅ Routes define loaders for prefetching
- ❌ No business logic in routes
- ❌ No UI components in routes

**Example:**
```
routes/
├── __root.tsx                      # Root layout
├── _authenticated.tsx              # Auth guard layout
├── _authenticated/
│   ├── index.tsx                   # Dashboard
│   ├── incidents.tsx               # Incidents list
│   ├── incidents.$id.tsx           # Incident detail
│   ├── monitoring.tsx              # Monitoring
│   └── [more authenticated routes...]
├── login.tsx                       # Login page
└── 404.tsx                         # Not found
```

**Route File Example:**
```tsx
// routes/_authenticated/incidents.tsx
import { createFileRoute } from '@tanstack/react-router';
import { IncidentListPage } from '@/modules/incident/pages/IncidentListPage';
import { queryClient } from '@/lib/query/client';
import { incidentQueries } from '@/modules/incident/queries';

export const Route = createFileRoute('/_authenticated/incidents')({
  loader: ({ context }) => {
    // Prefetch data before navigation
    return queryClient.ensureQueryData(incidentQueries.list());
  },
  component: IncidentListPage,
});
```

---

### styles/

**Purpose:** Global styles and design tokens.

**Contents:**
- Global CSS
- Tailwind directives
- Design tokens (colors, spacing, typography)

**Rules:**
- ✅ Use CSS variables for tokens
- ✅ Use Tailwind utilities in components
- ❌ Don't write component-specific styles here

**Example:**
```
styles/
├── globals.css           # Global resets, Tailwind base
└── tokens.css            # Design tokens (CSS variables)
```

**tokens.css:**
```css
:root {
  /* Colors */
  --color-background: oklch(0.14 0.006 286);
  --color-surface: oklch(0.19 0.006 286);
  --color-border: oklch(0.29 0.006 286);
  
  /* Spacing */
  --spacing-unit: 4px;
  
  /* Typography */
  --font-sans: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

---

### types/

**Purpose:** Global TypeScript types that don't belong to any module.

**Contents:**
- API-level types
- Environment variable types
- Global type augmentations

**Rules:**
- ✅ Only truly global types
- ❌ Don't put module-specific types here (put in module's `types/`)

**Example:**
```
types/
├── api.ts                # API response envelope, pagination
├── env.d.ts              # Environment variable types
└── global.d.ts           # Global augmentations
```

---

## Folder Rules Summary

| Folder | Purpose | Max File Lines | Can Import From |
|--------|---------|----------------|-----------------|
| `app/` | Application infrastructure | 300 | `lib/`, `shared/`, `ui/` |
| `modules/` | Feature domains | 500 | Own module, other module hooks, `lib/`, `shared/`, `ui/` |
| `shared/` | Reusable (3+ usage) | 300 | `lib/`, `ui/` |
| `lib/` | Core infrastructure | 500 | `types/` |
| `ui/` | UI primitives | 200 | None (leaf nodes) |
| `routes/` | Routing (thin) | 50 | `modules/` (pages only), `lib/` |
| `styles/` | Global styles | N/A | N/A |
| `types/` | Global types | 200 | None |

---

## Import Rules

**Allowed:**
```tsx
// ✅ Module imports its own code
import { IncidentCard } from '@/modules/incident/components/IncidentCard';

// ✅ Module imports hook from another module
import { useAlerts } from '@/modules/alerts/hooks/useAlerts';

// ✅ Module imports shared code
import { PageHeader } from '@/shared/components/PageHeader';

// ✅ Module imports lib code
import { apiClient } from '@/lib/api/client';

// ✅ Module imports UI primitives
import { Button } from '@/ui/button';
```

**Forbidden:**
```tsx
// ❌ Module imports component from another module
import { AlertCard } from '@/modules/alerts/components/AlertCard';

// ❌ Module imports service from another module
import { alertService } from '@/modules/alerts/services/alertService';

// ❌ Circular dependency
// modules/incident/hooks/useIncidents.ts imports from modules/alerts
// modules/alerts/hooks/useAlerts.ts imports from modules/incident

// ❌ UI primitive imports from lib
// ui/button.tsx imports from lib/api/client.ts

// ❌ Route imports component from module
import { IncidentCard } from '@/modules/incident/components/IncidentCard';
// (Routes should only import pages)
```

---

## Path Aliases

**Configured in `tsconfig.json`:**
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/app/*": ["./src/app/*"],
      "@/modules/*": ["./src/modules/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/ui/*": ["./src/ui/*"],
      "@/routes/*": ["./src/routes/*"],
      "@/styles/*": ["./src/styles/*"],
      "@/types/*": ["./src/types/*"]
    }
  }
}
```

**Usage:**
```tsx
// ✅ Use @ alias (absolute imports)
import { Button } from '@/ui/button';
import { useIncidents } from '@/modules/incident/hooks/useIncidents';

// ❌ Avoid relative imports (hard to refactor)
import { Button } from '../../../../ui/button';
```

---

**END OF SECTION 2**

---

# SECTION 3: Feature Module Standard

## Module Architecture

Every feature in Hermes Sentinel Hub is a **module**.

A module is a self-contained domain that owns all its code.

---

## Standard Module Structure

```
modules/{domain}/
├── components/       # Private UI components (module-only)
├── pages/            # Public pages (exported to routes/)
├── hooks/            # Public hooks (module's API)
├── services/         # API calls (backend communication)
├── queries/          # TanStack Query wrappers
├── types/            # TypeScript types and interfaces
├── mock/             # Mock data for development
├── utils/            # Module-specific utilities
└── index.ts          # Public exports
```

---

## Folder Responsibilities

### components/

**Purpose:** Private UI components used only within this module.

**Visibility:** ❌ **PRIVATE** — Cannot be imported by other modules.

**Rules:**
- ✅ Module-specific components only
- ✅ Can be small (20 lines) or large (300 lines)
- ❌ Don't export from `index.ts`
- ❌ Other modules cannot import

**When to extract to `shared/`:**
- When 3+ modules need it
- When clearly generic (no domain logic)

**Example:**
```
modules/incident/components/
├── IncidentCard.tsx           # Incident-specific card
├── IncidentStatusBadge.tsx    # Status badge
├── IncidentPriorityIcon.tsx   # Priority icon
├── IncidentTimeline.tsx       # Timeline component
└── IncidentMetrics.tsx        # Metrics display
```

**Naming Convention:**
- PascalCase: `IncidentCard.tsx`
- Prefix with domain: `Incident*`
- Descriptive: `IncidentStatusBadge` not `Badge`

---

### pages/

**Purpose:** Public pages exported to `routes/`.

**Visibility:** ✅ **PUBLIC** — Exported via `index.ts`, imported by routes.

**Rules:**
- ✅ One page component per file
- ✅ Page components orchestrate UI
- ✅ Pages import from `components/`, `hooks/`
- ❌ Pages should not contain business logic
- ❌ Pages should not make API calls directly

**Example:**
```
modules/incident/pages/
├── IncidentListPage.tsx       # List view
├── IncidentDetailPage.tsx     # Detail view
└── IncidentCreatePage.tsx     # Create form
```

**Page Component Pattern:**
```tsx
// modules/incident/pages/IncidentListPage.tsx
import { useIncidents } from '../hooks/useIncidents';
import { IncidentCard } from '../components/IncidentCard';
import { PageHeader } from '@/shared/components/PageHeader';

export function IncidentListPage() {
  const { data: incidents, isLoading } = useIncidents();

  if (isLoading) return <LoadingState />;
  if (!incidents?.length) return <EmptyState />;

  return (
    <div>
      <PageHeader title="Incidents" />
      <div className="grid gap-4">
        {incidents.map(incident => (
          <IncidentCard key={incident.id} incident={incident} />
        ))}
      </div>
    </div>
  );
}
```

---

### hooks/

**Purpose:** Module's **public API**. Data access and business logic.

**Visibility:** ✅ **PUBLIC** — Other modules can import hooks.

**Rules:**
- ✅ Hooks are the ONLY way other modules access this module's data
- ✅ Export all hooks via `index.ts`
- ✅ Hooks wrap `queries/` for data fetching
- ✅ Hooks can contain UI logic (state, effects)
- ❌ Hooks should not import from `components/`

**Types of hooks:**
1. **Data hooks** — Fetch data via TanStack Query
2. **Mutation hooks** — Modify data
3. **State hooks** — Local state management
4. **Effect hooks** — Side effects

**Example:**
```
modules/incident/hooks/
├── useIncidents.ts            # Fetch incidents list
├── useIncident.ts             # Fetch single incident
├── useCreateIncident.ts       # Create mutation
├── useUpdateIncident.ts       # Update mutation
├── useDeleteIncident.ts       # Delete mutation
└── useIncidentFilters.ts      # Filter state
```

**Data Hook Pattern:**
```tsx
// modules/incident/hooks/useIncidents.ts
import { useQuery } from '@tanstack/react-query';
import { incidentQueries } from '../queries';

export function useIncidents(filters?: IncidentFilters) {
  return useQuery({
    ...incidentQueries.list(filters),
  });
}
```

**Mutation Hook Pattern:**
```tsx
// modules/incident/hooks/useCreateIncident.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { incidentService } from '../services/incidentService';
import { incidentKeys } from '../queries/keys';

export function useCreateIncident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: incidentService.create,
    onSuccess: () => {
      // Invalidate incidents list
      queryClient.invalidateQueries({ queryKey: incidentKeys.lists() });
    },
  });
}
```

---

### services/

**Purpose:** API calls. Backend communication layer.

**Visibility:** ❌ **PRIVATE** — Only used by `queries/` and `hooks/`.

**Rules:**
- ✅ One service file per module: `{domain}Service.ts`
- ✅ Service contains all API methods for this domain
- ✅ Service uses `apiClient` from `lib/api/`
- ✅ Service returns typed responses
- ❌ Service should not be called directly from components
- ❌ Service should not contain business logic

**Example:**
```
modules/incident/services/
└── incidentService.ts
```

**Service Pattern:**
```tsx
// modules/incident/services/incidentService.ts
import { apiClient } from '@/lib/api/client';
import type { Incident, CreateIncidentDto, UpdateIncidentDto } from '../types';

export const incidentService = {
  async getIncidents(filters?: IncidentFilters): Promise<Incident[]> {
    const { data } = await apiClient.get('/incidents', { params: filters });
    return data;
  },

  async getIncident(id: string): Promise<Incident> {
    const { data } = await apiClient.get(`/incidents/${id}`);
    return data;
  },

  async create(dto: CreateIncidentDto): Promise<Incident> {
    const { data } = await apiClient.post('/incidents', dto);
    return data;
  },

  async update(id: string, dto: UpdateIncidentDto): Promise<Incident> {
    const { data } = await apiClient.patch(`/incidents/${id}`, dto);
    return data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/incidents/${id}`);
  },
};
```

---

### queries/

**Purpose:** TanStack Query configuration. Query keys, options, prefetching.

**Visibility:** ❌ **PRIVATE** — Used by `hooks/` only.

**Rules:**
- ✅ Define query keys in `keys.ts`
- ✅ Define query options in `options.ts` or inline
- ✅ Use query key factory pattern
- ❌ Don't call queries directly from components

**Example:**
```
modules/incident/queries/
├── keys.ts                    # Query key factory
├── options.ts                 # Query options
└── index.ts                   # Re-exports
```

**Query Keys Pattern:**
```tsx
// modules/incident/queries/keys.ts
export const incidentKeys = {
  all: ['incidents'] as const,
  lists: () => [...incidentKeys.all, 'list'] as const,
  list: (filters?: IncidentFilters) => 
    [...incidentKeys.lists(), filters] as const,
  details: () => [...incidentKeys.all, 'detail'] as const,
  detail: (id: string) => [...incidentKeys.details(), id] as const,
};
```

**Query Options Pattern:**
```tsx
// modules/incident/queries/options.ts
import { queryOptions } from '@tanstack/react-query';
import { incidentService } from '../services/incidentService';
import { incidentKeys } from './keys';

export const incidentQueries = {
  list: (filters?: IncidentFilters) =>
    queryOptions({
      queryKey: incidentKeys.list(filters),
      queryFn: () => incidentService.getIncidents(filters),
      staleTime: 30_000, // 30 seconds
    }),

  detail: (id: string) =>
    queryOptions({
      queryKey: incidentKeys.detail(id),
      queryFn: () => incidentService.getIncident(id),
      staleTime: 60_000, // 1 minute
    }),
};
```

---

### types/

**Purpose:** TypeScript types and interfaces for this module.

**Visibility:** ✅ **PUBLIC** — Other modules can import types.

**Rules:**
- ✅ Export all types via `index.ts`
- ✅ Use interfaces for objects, types for unions
- ✅ Document complex types with comments
- ❌ Don't duplicate types from `@/types/`

**Example:**
```
modules/incident/types/
├── incident.ts                # Incident entity
├── dto.ts                     # Data transfer objects
└── index.ts                   # Re-exports
```

**Type File Pattern:**
```tsx
// modules/incident/types/incident.ts
export type IncidentStatus = 'open' | 'investigating' | 'resolved' | 'closed';
export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface Incident {
  id: string;
  title: string;
  description: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  assignee?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IncidentFilters {
  status?: IncidentStatus;
  severity?: IncidentSeverity;
  assignee?: string;
  search?: string;
}
```

**DTO Pattern:**
```tsx
// modules/incident/types/dto.ts
import type { Incident } from './incident';

export type CreateIncidentDto = Pick<
  Incident,
  'title' | 'description' | 'severity'
> & {
  assignee?: string;
};

export type UpdateIncidentDto = Partial<CreateIncidentDto> & {
  status?: Incident['status'];
};
```

---

### mock/

**Purpose:** Mock data for development and testing.

**Visibility:** ❌ **PRIVATE** — Used by `services/` only.

**Rules:**
- ✅ Generate realistic fake data
- ✅ Use same types as real API
- ✅ Environment variable controls mock vs real
- ❌ Never commit production data

**Example:**
```
modules/incident/mock/
├── incidents.ts               # Mock incidents array
├── generator.ts               # Fake data generator
└── index.ts                   # Re-exports
```

**Mock Data Pattern:**
```tsx
// modules/incident/mock/incidents.ts
import type { Incident } from '../types';

export const mockIncidents: Incident[] = [
  {
    id: 'INC-001',
    title: 'Database connection timeout',
    description: 'PostgreSQL connection pool exhausted',
    status: 'investigating',
    severity: 'critical',
    assignee: 'john@example.com',
    createdAt: '2026-07-08T10:30:00Z',
    updatedAt: '2026-07-08T12:15:00Z',
  },
  // ... more incidents
];
```

**Mock Service Pattern:**
```tsx
// modules/incident/services/incidentService.ts
import { apiClient } from '@/lib/api/client';
import { mockIncidents } from '../mock';
import type { Incident } from '../types';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const incidentService = {
  async getIncidents(): Promise<Incident[]> {
    if (USE_MOCK) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockIncidents;
    }

    const { data } = await apiClient.get('/incidents');
    return data;
  },
};
```

---

### utils/

**Purpose:** Module-specific utility functions.

**Visibility:** ❌ **PRIVATE** — Used within module only.

**Rules:**
- ✅ Pure functions preferred
- ✅ Well-tested utilities
- ❌ Don't duplicate shared utils

**Example:**
```
modules/incident/utils/
├── severity.ts                # Severity helpers
├── status.ts                  # Status helpers
└── format.ts                  # Formatting helpers
```

**Utility Pattern:**
```tsx
// modules/incident/utils/severity.ts
import type { IncidentSeverity } from '../types';

export function getSeverityColor(severity: IncidentSeverity): string {
  const colors: Record<IncidentSeverity, string> = {
    critical: 'text-red-500',
    high: 'text-orange-500',
    medium: 'text-yellow-500',
    low: 'text-blue-500',
  };
  return colors[severity];
}

export function getSeverityOrder(severity: IncidentSeverity): number {
  const order: Record<IncidentSeverity, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };
  return order[severity];
}
```

---

### index.ts

**Purpose:** Public exports. Module's API surface.

**Rules:**
- ✅ Export all hooks
- ✅ Export all pages
- ✅ Export all types
- ❌ Don't export components (keep private)
- ❌ Don't export services (keep private)
- ❌ Don't export queries (keep private)

**Example:**
```tsx
// modules/incident/index.ts

// Pages (for routes/)
export { IncidentListPage } from './pages/IncidentListPage';
export { IncidentDetailPage } from './pages/IncidentDetailPage';
export { IncidentCreatePage } from './pages/IncidentCreatePage';

// Hooks (for other modules)
export { useIncidents } from './hooks/useIncidents';
export { useIncident } from './hooks/useIncident';
export { useCreateIncident } from './hooks/useCreateIncident';
export { useUpdateIncident } from './hooks/useUpdateIncident';
export { useDeleteIncident } from './hooks/useDeleteIncident';

// Types (for other modules)
export type {
  Incident,
  IncidentStatus,
  IncidentSeverity,
  IncidentFilters,
  CreateIncidentDto,
  UpdateIncidentDto,
} from './types';
```

---

## Module Communication Rules

### Rule 1: Hooks are the Public API

**✅ Correct:**
```tsx
// modules/dashboard/components/RecentIncidents.tsx
import { useIncidents } from '@/modules/incident/hooks/useIncidents';

export function RecentIncidents() {
  const { data: incidents } = useIncidents({ limit: 5 });
  return <div>{/* render */}</div>;
}
```

**❌ Incorrect:**
```tsx
// modules/dashboard/components/RecentIncidents.tsx
import { incidentService } from '@/modules/incident/services/incidentService';

export function RecentIncidents() {
  const [incidents, setIncidents] = useState([]);
  
  useEffect(() => {
    incidentService.getIncidents().then(setIncidents);
  }, []);
  
  return <div>{/* render */}</div>;
}
```

**Why:** Hooks provide caching, loading states, error handling, and invalidation. Direct service calls bypass all of this.

---

### Rule 2: Components are Private

**✅ Correct:**
```tsx
// modules/dashboard/components/IncidentSummary.tsx
import { useIncidents } from '@/modules/incident/hooks/useIncidents';

export function IncidentSummary() {
  const { data: incidents } = useIncidents();
  
  return (
    <div>
      {/* Custom rendering for dashboard context */}
      {incidents?.map(inc => (
        <div key={inc.id}>{inc.title}</div>
      ))}
    </div>
  );
}
```

**❌ Incorrect:**
```tsx
// modules/dashboard/components/IncidentSummary.tsx
import { IncidentCard } from '@/modules/incident/components/IncidentCard';
import { useIncidents } from '@/modules/incident/hooks/useIncidents';

export function IncidentSummary() {
  const { data: incidents } = useIncidents();
  
  return (
    <div>
      {incidents?.map(inc => (
        <IncidentCard key={inc.id} incident={inc} />
      ))}
    </div>
  );
}
```

**Why:** `IncidentCard` is private to the incident module. It might have incident-specific styling, behavior, or dependencies that don't fit dashboard context.

**Solution:** If you need shared rendering, extract to `shared/components/` or create a dashboard-specific component.

---

### Rule 3: Types are Public

**✅ Correct:**
```tsx
// modules/dashboard/components/IncidentBadge.tsx
import type { Incident, IncidentSeverity } from '@/modules/incident';

interface Props {
  incident: Incident;
}

export function IncidentBadge({ incident }: Props) {
  return <span>{incident.severity}</span>;
}
```

**Why:** Types have no runtime cost. Sharing types ensures type safety across modules.

---

### Rule 4: No Circular Dependencies

**❌ Forbidden:**
```
modules/incident/hooks/useIncidents.ts
  → imports from modules/alerts/hooks/useAlerts.ts

modules/alerts/hooks/useAlerts.ts
  → imports from modules/incident/hooks/useIncidents.ts
```

**Solution:** Extract shared logic to `shared/hooks/` or rethink the dependency.

---

## Module Creation Checklist

When creating a new module:

- [ ] Create folder: `modules/{domain}/`
- [ ] Create subfolders: `components/`, `pages/`, `hooks/`, `services/`, `queries/`, `types/`, `mock/`, `utils/`
- [ ] Create `index.ts` with public exports
- [ ] Create `types/index.ts` with domain types
- [ ] Create `services/{domain}Service.ts` with API methods
- [ ] Create `queries/keys.ts` with query key factory
- [ ] Create `queries/options.ts` with query options
- [ ] Create `hooks/use{Domain}s.ts` for list queries
- [ ] Create `hooks/use{Domain}.ts` for detail queries
- [ ] Create `mock/{domain}s.ts` with mock data
- [ ] Create pages in `pages/`
- [ ] Export pages, hooks, types from root `index.ts`
- [ ] Create routes in `routes/` that import pages
- [ ] Add module to this documentation

---

## Module Size Guidelines

| Metric | Guideline | Action if Exceeded |
|--------|-----------|-------------------|
| Total Lines | < 5,000 | Consider splitting into submodules |
| Components | < 15 | Extract shared components |
| Hooks | < 10 | Refactor or split module |
| Services methods | < 20 | Create sub-services |
| Types | < 30 | Create type categories |

---

## Module Examples

### Small Module (Auth)

```
modules/auth/
├── components/
│   └── LoginForm.tsx
├── pages/
│   ├── LoginPage.tsx
│   └── LogoutPage.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useLogin.ts
│   └── useLogout.ts
├── services/
│   └── authService.ts
├── types/
│   └── index.ts
└── index.ts
```

**Total:** ~500 lines

---

### Medium Module (Incidents)

```
modules/incident/
├── components/
│   ├── IncidentCard.tsx
│   ├── IncidentStatusBadge.tsx
│   ├── IncidentPriorityIcon.tsx
│   ├── IncidentTimeline.tsx
│   ├── IncidentMetrics.tsx
│   └── IncidentFilters.tsx
├── pages/
│   ├── IncidentListPage.tsx
│   ├── IncidentDetailPage.tsx
│   └── IncidentCreatePage.tsx
├── hooks/
│   ├── useIncidents.ts
│   ├── useIncident.ts
│   ├── useCreateIncident.ts
│   ├── useUpdateIncident.ts
│   ├── useDeleteIncident.ts
│   └── useIncidentFilters.ts
├── services/
│   └── incidentService.ts
├── queries/
│   ├── keys.ts
│   ├── options.ts
│   └── index.ts
├── types/
│   ├── incident.ts
│   ├── dto.ts
│   └── index.ts
├── mock/
│   ├── incidents.ts
│   └── generator.ts
├── utils/
│   ├── severity.ts
│   └── status.ts
└── index.ts
```

**Total:** ~2,000 lines

---

### Large Module (Monitoring)

```
modules/monitoring/
├── components/
│   ├── MetricCard.tsx
│   ├── MetricChart.tsx
│   ├── MetricSparkline.tsx
│   ├── HealthStatus.tsx
│   ├── AlertBanner.tsx
│   ├── ResourceGraph.tsx
│   ├── TimeRangeSelector.tsx
│   └── [8 more components...]
├── pages/
│   ├── MonitoringDashboardPage.tsx
│   ├── MetricDetailPage.tsx
│   └── HealthCheckPage.tsx
├── hooks/
│   ├── useMetrics.ts
│   ├── useMetric.ts
│   ├── useHealthChecks.ts
│   ├── useAlertRules.ts
│   └── [6 more hooks...]
├── services/
│   ├── metricService.ts
│   └── healthService.ts
├── queries/
│   ├── keys.ts
│   ├── metricQueries.ts
│   ├── healthQueries.ts
│   └── index.ts
├── types/
│   ├── metric.ts
│   ├── health.ts
│   ├── alert.ts
│   └── index.ts
├── mock/
│   ├── metrics.ts
│   ├── health.ts
│   └── generator.ts
├── utils/
│   ├── chart.ts
│   ├── aggregation.ts
│   └── thresholds.ts
└── index.ts
```

**Total:** ~4,500 lines

---

**END OF SECTION 3**

---

# SECTION 4: Naming Conventions

## Overview

Consistent naming reduces cognitive load and makes code searchable.

**Golden Rule:** Names should be **self-documenting**. Avoid abbreviations unless universally understood.

---

## Files and Folders

### Files

**Rule:** PascalCase for components, camelCase for utilities.

**Components:**
```
✅ IncidentCard.tsx
✅ PageHeader.tsx
✅ LoadingSpinner.tsx

❌ incident-card.tsx
❌ incidentCard.tsx
❌ Incident_Card.tsx
```

**Hooks:**
```
✅ useIncidents.ts
✅ useDebounce.ts
✅ useLocalStorage.ts

❌ UseIncidents.ts
❌ incidents.hook.ts
❌ incidents-hook.ts
```

**Services:**
```
✅ incidentService.ts
✅ alertService.ts
✅ authService.ts

❌ IncidentService.ts
❌ incident-service.ts
❌ incidents.ts
```

**Types:**
```
✅ incident.ts
✅ dto.ts
✅ common.ts

❌ Incident.ts
❌ incident.types.ts
❌ types.ts (too generic)
```

**Utilities:**
```
✅ format.ts
✅ validation.ts
✅ date.ts

❌ Format.ts
❌ utils.ts (too generic)
```

---

### Folders

**Rule:** kebab-case, lowercase, descriptive.

```
✅ modules/incident/
✅ modules/alert-rules/
✅ shared/components/

❌ modules/Incident/
❌ modules/alertRules/
❌ modules/alert_rules/
```

---

## Components

### Component Names

**Rule:** PascalCase, descriptive noun or noun phrase.

**Good:**
```tsx
✅ IncidentCard
✅ PageHeader
✅ AlertBanner
✅ MetricChart
✅ UserAvatar
✅ IncidentStatusBadge
```

**Bad:**
```tsx
❌ card (too generic)
❌ Incident (not a UI component)
❌ IncidentComponent (redundant suffix)
❌ incidents (lowercase)
❌ incident_card (snake_case)
```

---

### Component Files

**One component per file:**
```tsx
// ✅ GOOD: IncidentCard.tsx
export function IncidentCard({ incident }: Props) {
  return <div>{/* ... */}</div>;
}

// ❌ BAD: components.tsx
export function IncidentCard() { /* ... */ }
export function AlertCard() { /* ... */ }
export function MetricCard() { /* ... */ }
```

**Co-located types:**
```tsx
// ✅ GOOD: Types in same file
interface IncidentCardProps {
  incident: Incident;
  onSelect?: (incident: Incident) => void;
}

export function IncidentCard({ incident, onSelect }: IncidentCardProps) {
  return <div>{/* ... */}</div>;
}
```

---

### Component Export

**Rule:** Named exports only. No default exports.

```tsx
// ✅ GOOD: Named export
export function IncidentCard() {
  return <div />;
}

// ❌ BAD: Default export
export default function IncidentCard() {
  return <div />;
}

// ❌ BAD: Anonymous default export
export default function() {
  return <div />;
}
```

**Why named exports:**
- Auto-import works reliably
- Refactoring is safer
- No naming conflicts

---

## Hooks

### Hook Names

**Rule:** `use` prefix + descriptive verb or noun.

**Data hooks:**
```tsx
✅ useIncidents()        // Fetch list
✅ useIncident(id)       // Fetch single
✅ useAlerts()
✅ useMetrics()
```

**Mutation hooks:**
```tsx
✅ useCreateIncident()
✅ useUpdateIncident()
✅ useDeleteIncident()
```

**State hooks:**
```tsx
✅ useIncidentFilters()  // Local state for filters
✅ useSearchQuery()      // URL state for search
✅ useSidebarOpen()      // Global state for sidebar
```

**Effect hooks:**
```tsx
✅ useDebounce(value, delay)
✅ useLocalStorage(key, defaultValue)
✅ useMediaQuery(query)
```

**Bad hook names:**
```tsx
❌ getIncidents()        // Not a hook (no 'use' prefix)
❌ useGetIncidents()     // Redundant 'get'
❌ useIncidentList()     // Plural better: useIncidents()
❌ fetchIncidents()      // Not a hook
```

---

### Hook Files

**Rule:** One hook per file, matches hook name.

```
✅ useIncidents.ts       → export function useIncidents()
✅ useDebounce.ts        → export function useDebounce()

❌ hooks.ts              → exports 10 hooks
❌ incidentHooks.ts      → exports 5 incident hooks
```

---

## Services

### Service Names

**Rule:** `{domain}Service` pattern.

```tsx
✅ incidentService
✅ alertService
✅ authService
✅ metricService

❌ incidents (missing 'Service')
❌ IncidentService (PascalCase, should be camelCase)
❌ incidentApi (use 'Service' not 'Api')
```

---

### Service Methods

**Rule:** Verb + noun, async functions.

**CRUD operations:**
```tsx
// ✅ GOOD
export const incidentService = {
  async getIncidents(): Promise<Incident[]> { /* ... */ },
  async getIncident(id: string): Promise<Incident> { /* ... */ },
  async createIncident(dto: CreateDto): Promise<Incident> { /* ... */ },
  async updateIncident(id: string, dto: UpdateDto): Promise<Incident> { /* ... */ },
  async deleteIncident(id: string): Promise<void> { /* ... */ },
};

// ❌ BAD
export const incidentService = {
  async list() { /* ... */ },           // Too generic
  async fetch(id) { /* ... */ },        // Ambiguous
  async new(dto) { /* ... */ },         // Reserved keyword
  async remove(id) { /* ... */ },       // Use 'delete' for consistency
};
```

**Non-CRUD operations:**
```tsx
// ✅ GOOD
async resolveIncident(id: string): Promise<Incident>
async escalateIncident(id: string, level: number): Promise<Incident>
async assignIncident(id: string, userId: string): Promise<Incident>

// ❌ BAD
async resolve(id)     // Missing domain prefix
async doEscalate(id)  // Redundant 'do'
async assignment(id)  // Noun, should be verb
```

---

## Queries

### Query Keys

**Rule:** Use query key factory pattern.

```tsx
// ✅ GOOD: Query key factory
export const incidentKeys = {
  all: ['incidents'] as const,
  lists: () => [...incidentKeys.all, 'list'] as const,
  list: (filters?: Filters) => [...incidentKeys.lists(), filters] as const,
  details: () => [...incidentKeys.all, 'detail'] as const,
  detail: (id: string) => [...incidentKeys.details(), id] as const,
};

// Usage
incidentKeys.all             → ['incidents']
incidentKeys.lists()         → ['incidents', 'list']
incidentKeys.list(filters)   → ['incidents', 'list', filters]
incidentKeys.detail('INC-1') → ['incidents', 'detail', 'INC-1']
```

**Why factory pattern:**
- Type-safe
- Easy to invalidate hierarchically
- Consistent structure

---

### Query Options

**Rule:** `{domain}Queries` object with methods.

```tsx
// ✅ GOOD
export const incidentQueries = {
  list: (filters?: Filters) => queryOptions({
    queryKey: incidentKeys.list(filters),
    queryFn: () => incidentService.getIncidents(filters),
  }),
  
  detail: (id: string) => queryOptions({
    queryKey: incidentKeys.detail(id),
    queryFn: () => incidentService.getIncident(id),
  }),
};

// ❌ BAD
export const getIncidentsQuery = (filters) => { /* ... */ };
export const incidentDetailQuery = (id) => { /* ... */ };
```

---

## Types

### Type Names

**Rule:** PascalCase, descriptive nouns.

**Interfaces (objects):**
```tsx
✅ interface Incident { /* ... */ }
✅ interface IncidentFilters { /* ... */ }
✅ interface CreateIncidentDto { /* ... */ }

❌ interface IIncident { /* ... */ }        // No 'I' prefix
❌ interface incident { /* ... */ }         // Lowercase
❌ interface IncidentType { /* ... */ }     // Redundant 'Type'
```

**Type aliases (unions, primitives):**
```tsx
✅ type IncidentStatus = 'open' | 'closed';
✅ type IncidentId = string;
✅ type Severity = 'low' | 'medium' | 'high' | 'critical';

❌ type TIncidentStatus = 'open' | 'closed';  // No 'T' prefix
❌ type status = 'open' | 'closed';           // Lowercase
```

---

### DTO Names

**Rule:** `{Action}{Domain}Dto` pattern.

```tsx
✅ type CreateIncidentDto = { /* ... */ };
✅ type UpdateIncidentDto = { /* ... */ };
✅ type IncidentResponseDto = { /* ... */ };

❌ type IncidentCreate = { /* ... */ };       // Action after domain
❌ type NewIncident = { /* ... */ };          // Ambiguous
❌ type IncidentInput = { /* ... */ };        // Generic
```

---

### Enum Names

**Rule:** PascalCase enum name, UPPER_SNAKE_CASE values (or strings).

```tsx
// ✅ GOOD: String enum (preferred)
export enum IncidentStatus {
  Open = 'open',
  Investigating = 'investigating',
  Resolved = 'resolved',
  Closed = 'closed',
}

// ✅ ACCEPTABLE: Numeric enum
export enum Priority {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  CRITICAL = 4,
}

// ❌ BAD
export enum incident_status { /* ... */ }     // snake_case
export enum INCIDENT_STATUS { /* ... */ }     // UPPER_CASE
```

**Prefer union types over enums:**
```tsx
// ✅ BETTER: Union type (more flexible)
export type IncidentStatus = 'open' | 'investigating' | 'resolved' | 'closed';

// ✅ With const object for values
export const INCIDENT_STATUS = {
  OPEN: 'open',
  INVESTIGATING: 'investigating',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
} as const;

export type IncidentStatus = typeof INCIDENT_STATUS[keyof typeof INCIDENT_STATUS];
```

---

## Constants

### Constant Names

**Rule:** UPPER_SNAKE_CASE for true constants, camelCase for config objects.

**True constants (immutable values):**
```tsx
✅ const MAX_RETRY_ATTEMPTS = 3;
✅ const DEFAULT_TIMEOUT = 5000;
✅ const API_BASE_URL = import.meta.env.VITE_API_URL;

❌ const maxRetryAttempts = 3;              // camelCase
❌ const MaxRetryAttempts = 3;              // PascalCase
```

**Config objects:**
```tsx
✅ const queryConfig = {
  staleTime: 30_000,
  retry: 3,
};

✅ const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};

❌ const QUERY_CONFIG = { /* ... */ };      // UPPER_CASE for object
```

---

## Variables

### Variable Names

**Rule:** camelCase, descriptive.

```tsx
✅ const incidents = await fetchIncidents();
✅ const isLoading = query.isLoading;
✅ const hasError = query.isError;
✅ const selectedIncident = incidents.find(i => i.id === id);

❌ const data = await fetchIncidents();     // Too generic
❌ const inc = incidents[0];                // Abbreviated
❌ const IncidentData = [];                 // PascalCase
```

---

### Boolean Variables

**Rule:** Prefix with `is`, `has`, `should`, or `can`.

```tsx
✅ const isLoading = true;
✅ const hasError = false;
✅ const shouldRetry = true;
✅ const canDelete = user.role === 'admin';

❌ const loading = true;                    // Missing prefix
❌ const error = false;                     // Ambiguous
❌ const enabled = true;                    // Ambiguous
```

---

### Array Variables

**Rule:** Plural nouns.

```tsx
✅ const incidents = await fetchIncidents();
✅ const alerts = await fetchAlerts();
✅ const users = ['john', 'jane'];

❌ const incidentList = [];                 // Redundant 'List'
❌ const incidentArray = [];                // Redundant 'Array'
❌ const incident = [inc1, inc2];           // Singular for array
```

---

## Functions

### Function Names

**Rule:** camelCase, verb or verb phrase.

**Pure functions:**
```tsx
✅ function calculateTotal(items: Item[]): number { /* ... */ }
✅ function formatDate(date: Date): string { /* ... */ }
✅ function validateEmail(email: string): boolean { /* ... */ }

❌ function total(items) { /* ... */ }      // Noun, missing verb
❌ function CalculateTotal(items) { /* ... */ } // PascalCase
```

**Event handlers:**
```tsx
✅ function handleClick(event: MouseEvent) { /* ... */ }
✅ function handleSubmit(event: FormEvent) { /* ... */ }
✅ function handleChange(event: ChangeEvent) { /* ... */ }

❌ function onClick(event) { /* ... */ }    // Use 'handle' prefix
❌ function clickHandler(event) { /* ... */ } // Handler suffix
```

**Async functions:**
```tsx
✅ async function fetchIncidents(): Promise<Incident[]> { /* ... */ }
✅ async function saveIncident(dto: CreateDto): Promise<Incident> { /* ... */ }

// Avoid 'async' in name (the keyword makes it obvious)
❌ async function asyncFetchIncidents() { /* ... */ }
❌ async function getIncidentsAsync() { /* ... */ }
```

---

## Props

### Props Interface Names

**Rule:** `{ComponentName}Props` pattern.

```tsx
// ✅ GOOD
interface IncidentCardProps {
  incident: Incident;
  onSelect?: (incident: Incident) => void;
}

export function IncidentCard({ incident, onSelect }: IncidentCardProps) {
  return <div>{/* ... */}</div>;
}

// ❌ BAD
interface IIncidentCardProps { /* ... */ }  // No 'I' prefix
interface Props { /* ... */ }               // Too generic (use inline type)
interface IncidentCardProperties { /* ... */ } // Too verbose
```

**Inline props type (for simple components):**
```tsx
// ✅ ACCEPTABLE: Inline for simple components
export function Badge({ label, variant }: { label: string; variant: 'success' | 'error' }) {
  return <span>{label}</span>;
}
```

---

### Prop Names

**Rule:** camelCase, descriptive.

**Boolean props:** Prefix with `is`, `has`, `should`, `can`.

```tsx
interface ButtonProps {
  ✅ isLoading?: boolean;
  ✅ isDisabled?: boolean;
  ✅ hasIcon?: boolean;
  
  ❌ loading?: boolean;
  ❌ disabled?: boolean;
}
```

**Callback props:** Prefix with `on`.

```tsx
interface IncidentCardProps {
  ✅ onClick?: () => void;
  ✅ onSelect?: (incident: Incident) => void;
  ✅ onDelete?: (id: string) => void;
  
  ❌ click?: () => void;
  ❌ selectHandler?: (incident: Incident) => void;
}
```

---

## Context

### Context Names

**Rule:** `{Domain}Context` pattern.

```tsx
// ✅ GOOD
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ❌ BAD
const Theme = createContext();             // Missing 'Context'
const themeContext = createContext();      // camelCase
```

---

### Provider Names

**Rule:** `{Domain}Provider` pattern.

```tsx
// ✅ GOOD
export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<Theme>('dark');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ❌ BAD
export function Theme({ children }) { /* ... */ }
export function ThemeContextProvider({ children }) { /* ... */ } // Redundant
```

---

### Hook for Context

**Rule:** `use{Domain}` pattern.

```tsx
// ✅ GOOD
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// ❌ BAD
export function useThemeContext() { /* ... */ }  // Redundant 'Context'
export function getTheme() { /* ... */ }         // Not a hook
```

---

## Test Files

### Test File Names

**Rule:** `{filename}.test.{ts|tsx}` pattern.

```
✅ IncidentCard.test.tsx
✅ useIncidents.test.ts
✅ incidentService.test.ts
✅ format.test.ts

❌ IncidentCard.spec.tsx          // Use '.test' not '.spec'
❌ IncidentCard-test.tsx          // Use '.' not '-'
❌ test-IncidentCard.tsx          // File name first
```

---

### Test Suite Names

**Rule:** Match component/function name.

```tsx
// ✅ GOOD
describe('IncidentCard', () => {
  it('renders incident title', () => { /* ... */ });
  it('calls onSelect when clicked', () => { /* ... */ });
});

describe('useIncidents', () => {
  it('fetches incidents on mount', () => { /* ... */ });
  it('refetches on filter change', () => { /* ... */ });
});

// ❌ BAD
describe('Incident Card Component', () => { /* ... */ });  // Don't add extra words
describe('incident-card', () => { /* ... */ });            // Use PascalCase
```

---

## Summary Table

| Category | Convention | Example |
|----------|-----------|---------|
| **Files** | | |
| Components | PascalCase.tsx | `IncidentCard.tsx` |
| Hooks | camelCase.ts | `useIncidents.ts` |
| Services | camelCase.ts | `incidentService.ts` |
| Types | camelCase.ts | `incident.ts` |
| Utils | camelCase.ts | `format.ts` |
| Tests | {name}.test.{ts\|tsx} | `IncidentCard.test.tsx` |
| **Folders** | kebab-case | `modules/incident/` |
| **Components** | PascalCase | `IncidentCard` |
| **Hooks** | use + PascalCase | `useIncidents` |
| **Services** | camelCase + Service | `incidentService` |
| **Types** | PascalCase | `Incident`, `IncidentStatus` |
| **Props** | {Name}Props | `IncidentCardProps` |
| **Variables** | camelCase | `incidents`, `isLoading` |
| **Constants** | UPPER_SNAKE_CASE | `MAX_RETRY_ATTEMPTS` |
| **Enums** | PascalCase | `IncidentStatus` |
| **Functions** | camelCase | `handleClick`, `formatDate` |
| **Context** | {Name}Context | `ThemeContext` |
| **Provider** | {Name}Provider | `ThemeProvider` |

---

**END OF SECTION 4**

---

# SECTION 5: Component Engineering Rules

## The Rule of One, Two, Three

This is the **extraction rule** for components in Hermes Sentinel Hub.

### Rule of One

**When a component is used once:**

✅ **Keep it inline** in the page or parent component.

**Reasoning:** Premature extraction creates unnecessary indirection.

**Example:**
```tsx
// ✅ GOOD: Inline component (1 usage)
export function IncidentDetailPage() {
  return (
    <div>
      <div className="border-2 border-border p-6">
        <h2>Incident Timeline</h2>
        {/* Timeline rendering */}
      </div>
    </div>
  );
}

// ❌ BAD: Extracted too early
// components/IncidentTimeline.tsx
export function IncidentTimeline() { /* ... */ }
```

---

### Rule of Two

**When a component is used twice:**

✅ **Consider extraction**, but not required.

**Extraction criteria:**
- If the component is >50 lines → Extract
- If the component has complex logic → Extract
- If the component will likely be used a 3rd time → Extract
- Otherwise → Keep inline (wait for 3rd usage)

---

### Rule of Three

**When a component is used 3+ times:**

✅ **Extract immediately**.

**Where to extract:**
- 3+ usages within same module → Extract to module's `components/`
- 3+ usages across modules → Extract to `shared/components/`

---

## Component Size Guidelines

| Lines | Guideline | Action |
|-------|-----------|--------|
| < 50 | ✅ Small | Acceptable inline or extracted |
| 50-150 | ✅ Medium | Standard component size |
| 150-300 | ⚠️ Large | Consider splitting |
| 300-500 | 🔴 Very Large | Must split or refactor |
| > 500 | ❌ Too Large | Violates engineering standard |

---

## Component Splitting Strategies

### Strategy 1: Extract Subcomponents

**When:** Component has distinct sections that can be isolated.

### Strategy 2: Extract Logic to Hooks

**When:** Component has complex state/effects but simple rendering.

### Strategy 3: Composition with Slots

**When:** Component has multiple variants with different content.

---

**END OF SECTION 5**

---

# SECTION 6: Hooks Convention

## Hook Categories

### 1. Data Hooks (TanStack Query)

**Purpose:** Fetch data from backend.

**Pattern:**
```tsx
export function useIncidents(filters?: IncidentFilters) {
  return useQuery({
    ...incidentQueries.list(filters),
  });
}
```

**Rules:**
- Always wrap TanStack Query
- Export from module's `hooks/`
- Return query result as-is (don't destructure)

---

### 2. Mutation Hooks

**Purpose:** Modify backend data.

**Pattern:**
```tsx
export function useCreateIncident() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: incidentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: incidentKeys.lists() });
    },
  });
}
```

---

### 3. State Hooks

**Purpose:** Manage local UI state.

**Pattern:**
```tsx
export function useIncidentFilters() {
  const [status, setStatus] = useState<IncidentStatus>();
  const [severity, setSeverity] = useState<IncidentSeverity>();
  
  const reset = useCallback(() => {
    setStatus(undefined);
    setSeverity(undefined);
  }, []);
  
  return { status, setStatus, severity, setSeverity, reset };
}
```

---

### 4. Effect Hooks

**Purpose:** Reusable side effects.

**Examples:**
- `useDebounce(value, delay)`
- `useLocalStorage(key, defaultValue)`
- `useMediaQuery(query)`

---

## Hook Rules

1. ✅ Hooks must start with `use`
2. ✅ One hook per file
3. ✅ Named exports only
4. ❌ No conditional hook calls
5. ❌ No hooks inside loops
6. ❌ No hooks inside callbacks

---

**END OF SECTION 6**

---

# SECTION 7: TanStack Query Standard

## Query Keys

**Use query key factory:**

```tsx
export const incidentKeys = {
  all: ['incidents'] as const,
  lists: () => [...incidentKeys.all, 'list'] as const,
  list: (filters?: Filters) => [...incidentKeys.lists(), filters] as const,
  details: () => [...incidentKeys.all, 'detail'] as const,
  detail: (id: string) => [...incidentKeys.details(), id] as const,
};
```

---

## Query Options

**Recommended defaults:**

```tsx
export const incidentQueries = {
  list: (filters?: Filters) => queryOptions({
    queryKey: incidentKeys.list(filters),
    queryFn: () => incidentService.getIncidents(filters),
    staleTime: 30_000,      // 30 seconds
    gcTime: 5 * 60_000,     // 5 minutes
    retry: 3,
  }),
};
```

---

## Mutations

**Optimistic updates:**

```tsx
export function useUpdateIncident() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateDto }) =>
      incidentService.update(id, dto),
    
    onMutate: async ({ id, dto }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: incidentKeys.detail(id) });
      
      // Snapshot previous value
      const previous = queryClient.getQueryData(incidentKeys.detail(id));
      
      // Optimistically update
      queryClient.setQueryData(incidentKeys.detail(id), (old) => ({
        ...old,
        ...dto,
      }));
      
      return { previous };
    },
    
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(
          incidentKeys.detail(variables.id),
          context.previous
        );
      }
    },
    
    onSettled: (data, error, variables) => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: incidentKeys.detail(variables.id) });
    },
  });
}
```

---

**END OF SECTION 7**

---

# SECTION 8: API Layer

## API Client

**Location:** `lib/api/client.ts`

**Setup:**
```tsx
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (add auth token)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor (handle errors)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## Service Pattern

**One service per module:**

```tsx
// modules/incident/services/incidentService.ts
export const incidentService = {
  async getIncidents(filters?: Filters): Promise<Incident[]> {
    const { data } = await apiClient.get('/incidents', { params: filters });
    return data;
  },
  
  async getIncident(id: string): Promise<Incident> {
    const { data } = await apiClient.get(`/incidents/${id}`);
    return data;
  },
  
  async create(dto: CreateDto): Promise<Incident> {
    const { data } = await apiClient.post('/incidents', dto);
    return data;
  },
  
  async update(id: string, dto: UpdateDto): Promise<Incident> {
    const { data } = await apiClient.patch(`/incidents/${id}`, dto);
    return data;
  },
  
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/incidents/${id}`);
  },
};
```

---

**END OF SECTION 8**

---

# SECTION 9: Mock Strategy

## Mock Data Organization

**Structure:**
```
modules/{domain}/mock/
├── {domain}s.ts       # Mock data array
├── generator.ts       # Fake data generator
└── index.ts           # Re-exports
```

---

## Mock Service Pattern

**Environment-based switching:**

```tsx
// modules/incident/services/incidentService.ts
import { apiClient } from '@/lib/api/client';
import { mockIncidents } from '../mock';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const incidentService = {
  async getIncidents(): Promise<Incident[]> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockIncidents;
    }
    
    const { data } = await apiClient.get('/incidents');
    return data;
  },
};
```

---

## Mock Data Generation

**Use realistic data:**

```tsx
// modules/incident/mock/incidents.ts
export const mockIncidents: Incident[] = [
  {
    id: 'INC-001',
    title: 'Database connection timeout',
    description: 'PostgreSQL connection pool exhausted',
    status: 'investigating',
    severity: 'critical',
    assignee: 'john@example.com',
    createdAt: '2026-07-08T10:30:00Z',
    updatedAt: '2026-07-08T12:15:00Z',
  },
  // ... 15 more realistic incidents
];
```

---

**END OF SECTION 9**

---

# SECTION 10: State Management

## State Categories

### 1. Server State (TanStack Query)

**Use for:** Data from backend API.

**Example:**
```tsx
const { data: incidents } = useIncidents();
```

---

### 2. URL State (TanStack Router)

**Use for:** Filters, pagination, search.

**Example:**
```tsx
const navigate = useNavigate();
const { search } = Route.useSearch();

navigate({
  search: { ...search, status: 'open' },
});
```

---

### 3. Local State (useState)

**Use for:** Component-specific UI state.

**Example:**
```tsx
const [isOpen, setIsOpen] = useState(false);
```

---

### 4. Global State (Context)

**Use for:** Theme, auth, sidebar open/closed.

**Example:**
```tsx
const { theme, setTheme } = useTheme();
```

---

### 5. Form State (React Hook Form)

**Use for:** Complex forms with validation.

**Example:**
```tsx
const { register, handleSubmit, formState } = useForm();
```

---

## State Decision Matrix

| State Type | Tool | Example |
|------------|------|---------|
| Server data | TanStack Query | `useIncidents()` |
| URL params | TanStack Router | `?status=open` |
| UI toggles | useState | `const [open, setOpen] = useState(false)` |
| Global UI | Context | `const { theme } = useTheme()` |
| Forms | React Hook Form | `useForm()` |

---

**END OF SECTION 10**

---

# SECTION 11: Forms

## React Hook Form

**Basic pattern:**

```tsx
import { useForm } from 'react-hook-form';

export function IncidentCreateForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { mutate: createIncident } = useCreateIncident();
  
  const onSubmit = (data) => {
    createIncident(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register('title', { required: 'Title is required' })}
        error={errors.title?.message}
      />
      
      <Button type="submit">Create</Button>
    </form>
  );
}
```

---

**END OF SECTION 11**

---

# SECTION 12: Styling Standards

## Tailwind CSS

**Use utility classes:**

```tsx
<div className="flex items-center gap-4 p-6 border-2 border-border">
  <h2 className="text-xl font-bold">Title</h2>
</div>
```

---

## CVA (Class Variance Authority)

**For component variants:**

```tsx
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
```

---

## cn() utility

**Merge classes:**

```tsx
import { cn } from '@/lib/utils/cn';

<div className={cn('base-class', isActive && 'active-class', className)} />
```

---

**END OF SECTION 12**

---

# SECTION 13: Performance

## Memoization

**Use memo for expensive components:**

```tsx
const ExpensiveChart = memo(function ExpensiveChart({ data }: Props) {
  // Expensive rendering
});
```

---

## Virtualization

**Use TanStack Virtual for large lists:**

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

const virtualizer = useVirtualizer({
  count: incidents.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 48,
});
```

---

## Lazy Loading

**Lazy load routes:**

```tsx
const IncidentDetailPage = lazy(() => import('./pages/IncidentDetailPage'));
```

---

## Code Splitting

**Split by route automatically with TanStack Router.**

---

**END OF SECTION 13**

---

# SECTION 14: Accessibility

## WCAG 2.1 AA Requirements

1. ✅ Keyboard navigation
2. ✅ Focus indicators
3. ✅ Screen reader support
4. ✅ Color contrast 7:1 (AAA for dark theme)
5. ✅ ARIA labels
6. ✅ Semantic HTML

---

## Keyboard Navigation

**All interactive elements must be keyboard accessible:**

```tsx
// ✅ GOOD: Button (keyboard accessible)
<button onClick={handleClick}>Click</button>

// ❌ BAD: Div button (not keyboard accessible)
<div onClick={handleClick}>Click</div>
```

---

## Focus Management

**Visible focus indicator:**

```tsx
<button className="focus-visible:ring-2 focus-visible:ring-primary">
  Click me
</button>
```

---

## ARIA Labels

**Provide context for screen readers:**

```tsx
<button aria-label="Delete incident INC-001">
  <TrashIcon />
</button>
```

---

**END OF SECTION 14**

---

# SECTION 15: Routing

## TanStack Router

**File-based routing:**

```
routes/
├── __root.tsx
├── index.tsx
├── incidents.tsx
└── incidents.$id.tsx
```

---

## Route Definition

```tsx
import { createFileRoute } from '@tanstack/react-router';
import { IncidentListPage } from '@/modules/incident';

export const Route = createFileRoute('/incidents')({
  component: IncidentListPage,
});
```

---

## Route Loaders

**Prefetch data:**

```tsx
export const Route = createFileRoute('/incidents')({
  loader: ({ context }) => {
    return queryClient.ensureQueryData(incidentQueries.list());
  },
  component: IncidentListPage,
});
```

---

**END OF SECTION 15**

---

# SECTION 16: Realtime

## WebSocket Client

**Location:** `lib/realtime/client.ts`

**Pattern:**

```tsx
export class RealtimeClient {
  private ws: WebSocket | null = null;
  
  connect() {
    this.ws = new WebSocket(import.meta.env.VITE_WS_URL);
    
    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.handleMessage(message);
    };
  }
  
  subscribe(channel: string, callback: (data: any) => void) {
    // Subscribe to channel
  }
}
```

---

**END OF SECTION 16**

---

# SECTION 17: AI Integration

## AI Client

**Location:** `lib/ai/client.ts`

**Pattern:**

```tsx
export const aiClient = {
  async chat(messages: ChatMessage[]): Promise<string> {
    const response = await apiClient.post('/ai/chat', { messages });
    return response.data.content;
  },
  
  async recommend(context: string): Promise<AIRecommendation> {
    const response = await apiClient.post('/ai/recommend', { context });
    return response.data;
  },
};
```

---

## Streaming

**Use SSE (Server-Sent Events):**

```tsx
export async function* streamChat(messages: ChatMessage[]) {
  const response = await fetch('/ai/chat/stream', {
    method: 'POST',
    body: JSON.stringify({ messages }),
  });
  
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    yield chunk;
  }
}
```

---

**END OF SECTION 17**

---

# SECTION 18: Testing

## Vitest

**Unit tests:**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IncidentCard } from './IncidentCard';

describe('IncidentCard', () => {
  it('renders incident title', () => {
    render(<IncidentCard incident={mockIncident} />);
    expect(screen.getByText('INC-001')).toBeInTheDocument();
  });
});
```

---

## React Testing Library

**Test user behavior, not implementation:**

```tsx
it('calls onSelect when clicked', async () => {
  const onSelect = vi.fn();
  render(<IncidentCard incident={mockIncident} onSelect={onSelect} />);
  
  await userEvent.click(screen.getByRole('button'));
  expect(onSelect).toHaveBeenCalledWith(mockIncident);
});
```

---

**END OF SECTION 18**

---

# SECTION 19: Git Workflow

## Branch Naming

**Pattern:** `{type}/{short-description}`

**Types:**
- `feature/` — New features
- `fix/` — Bug fixes
- `refactor/` — Code refactoring
- `docs/` — Documentation
- `test/` — Tests

**Examples:**
```
feature/incident-filters
fix/memory-leak-chart
refactor/extract-shared-components
```

---

## Commit Convention

**Pattern:** `{type}: {description}`

**Examples:**
```
feat: add incident filters
fix: resolve memory leak in chart component
refactor: extract PageHeader to shared
docs: update component engineering guide
test: add tests for useIncidents hook
```

---

**END OF SECTION 19**

---

# SECTION 20: Code Review Checklist

## Architecture

- [ ] Follows module structure
- [ ] No circular dependencies
- [ ] Hooks are public API
- [ ] Components are private

## Performance

- [ ] Large lists virtualized
- [ ] Routes lazy loaded
- [ ] Images optimized
- [ ] No unnecessary re-renders

## Accessibility

- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Color contrast ≥7:1

## Quality

- [ ] TypeScript strict mode
- [ ] No console.log
- [ ] No commented code
- [ ] Tests pass

---

**END OF SECTION 20**

---

# SECTION 21: Definition of Done

Every feature must satisfy:

- [ ] ✅ Build passes
- [ ] ✅ Lint passes
- [ ] ✅ TypeScript 0 errors
- [ ] ✅ Responsive (1920/1440/1024/768px)
- [ ] ✅ Keyboard accessible
- [ ] ✅ Screen reader tested
- [ ] ✅ Dark theme works
- [ ] ✅ Loading state implemented
- [ ] ✅ Empty state implemented
- [ ] ✅ Error state implemented
- [ ] ✅ Offline state handled
- [ ] ✅ Mock data works
- [ ] ✅ Design system compliant

---

**END OF SECTION 21**

---

# SECTION 22: Engineering Anti-Patterns

## Never Do These

### 1. Duplicate Components

**Why:** Maintenance nightmare.

**Solution:** Extract to shared.

---

### 2. Inline API Calls

**Why:** No caching, no loading states.

**Solution:** Use hooks + services.

---

### 3. Global State Abuse

**Why:** Hard to test, hard to debug.

**Solution:** Use TanStack Query for server state.

---

### 4. Magic Numbers

**Why:** Unclear meaning.

**Solution:** Use named constants.

---

### 5. Deep Prop Drilling

**Why:** Fragile, hard to refactor.

**Solution:** Use Context.

---

### 6. Circular Dependencies

**Why:** Build fails, runtime errors.

**Solution:** Extract shared dependencies.

---

**END OF SECTION 22**

---

# SECTION 23: Migration Guide

## Backend Integration

**Step 1:** Change environment variable

```env
VITE_USE_MOCK=false
VITE_API_URL=https://api.hermes.example.com
```

**Step 2:** No code changes needed (services already abstract API)

---

## Realtime Integration

**Step 1:** Connect WebSocket client

```tsx
// lib/realtime/client.ts
const client = new RealtimeClient();
client.connect();
```

**Step 2:** Subscribe to channels

```tsx
client.subscribe('incidents', (data) => {
  queryClient.setQueryData(incidentKeys.all, data);
});
```

---

**END OF SECTION 23**

---

# SECTION 24: Appendices

## Appendix A: Folder Structure Example

```
src/
├── app/
├── modules/
│   └── incident/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       ├── services/
│       ├── queries/
│       ├── types/
│       ├── mock/
│       └── index.ts
├── shared/
├── lib/
├── ui/
├── routes/
└── styles/
```

---

## Appendix B: Quick Reference

| Task | Pattern |
|------|---------|
| Create module | `modules/{domain}/` |
| Create component | `{Domain}Component.tsx` |
| Create hook | `use{Domain}s.ts` |
| Create service | `{domain}Service.ts` |
| Create query key | `{domain}Keys` factory |
| Extract component | After 3rd usage |

---

**END OF SECTION 24**

---

# Document Status

**Version:** 1.0  
**Date:** 2026-07-08  
**Status:** Official Engineering Standard  
**Author:** Principal Frontend Architect  
**Approved by:** CTO

---

**This is the official Frontend Engineering Guide for Hermes Sentinel Hub.**

**All engineers must follow these standards.**

---

