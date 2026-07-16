# UI Feature conventions

UI-oriented architecture organized by vertical feature slices. Each feature is self-contained with an explicit Feature API. Suited for frontend apps and full-stack apps with a UI layer.

Adapt naming and patterns to match the framework's idioms. The patterns below use React conventions as examples.

## Project structure

```
src/
  api/                    # Global HTTP client and data provider setup
  assets/                 # Static assets (images, fonts, public files)
  components/             # Generic reusable components (Button, Input, etc.)
  constants/              # Global constants
  features/               # Application features — most code lives here
    bootstrap/            # App-wide initialization (layout, session, auth)
    featureA/
    featureB/
  formatters/             # Display formatters (dates, amounts, etc.)
  hooks/                  # Generic reusable hooks (React) or equivalents
  i18n/                   # Internationalization config and messages
  router/                 # Router config (aggregates routes from features)
  stores/                 # Global stores (query keys, session state)
  styles/                 # Global styling (CSS variables, reset, fonts)
  testing/                # Test utilities and setup
  types/                  # Global shared types
```

## Feature structure

Each feature has its own folder under `src/features/` with a consistent internal layout:

```
featureName/
  api/                    # API functions for specific data
    featureApi.ts
    featureQueries.ts     # Query options factories (if using a query library)
  components/             # Feature-specific components and pages
    somePage/
      somePage.tsx        # Component (rendering)
      somePage.module.scss
      somePage.test.tsx
      somePageLoader.ts   # Route loader (data prefetching)
      useSomePage.ts      # Hook (React) or equivalent connecting service to rendering (optional, when complex)
      subComponent/
  services/               # Plain JS/TS business logic (no framework dependency)
  types/                  # Feature-specific data types
  index.tsx               # FEATURE API — only exports from here are accessible externally
```

## Patterns

### Component split

Start with a single component file. Split only when complexity warrants it:

| File | Responsibility |
|------|----------------|
| `component.tsx` | Rendering (template/markup) |
| `useComponent.ts` | Hook (React) or equivalent — connects service to rendering using framework primitives |
| `componentService.ts` | Plain JS/TS business logic (framework-independent, testable) |
| `component.module.scss` | Scoped styles |
| `component.test.tsx` | Tests |
| `componentLoader.ts` | Route loader (prefetch data) |

**Guideline**: Don't pre-split. A single file is fine until one concern (rendering, logic, or state) becomes easier to understand separately.

### Data flow

1. **API layer**: `featureApi.ts`
2. **Query layer** (optional): `featureQueries.ts` — query options factories using keys from `src/stores/queryKeys/`
3. **Loader**: `componentLoader.ts` — prefetches data for the route
4. **Component**: consumes data via query library or framework primitives
5. **Mutations**: invalidate related query keys on success

### Routing (code-based)

- Each feature exports its route definition(s) via `index.tsx`.
- The router config in `src/router/` aggregates routes from features.
- Route definitions include: loader (data prefetch) + component (page render).

### Query keys

Hierarchical, defined as `const` objects in `src/stores/queryKeys/`:

```typescript
const featureKeys = {
  all: ['feature'] as const,
  list: () => [...featureKeys.all, 'list'] as const,
  detail: (id: string) => [...featureKeys.all, id] as const,
};
```

## Rules

- **Feature API via `index.tsx`**: A feature only exposes what it re-exports from its `index.tsx`. This is the only entry point for other features and the router.
- **Private by default**: Everything inside a feature folder (except `index.tsx`) is private. Other features and global code cannot import private modules directly.
- **Cross-feature imports go through the Feature API**: `import { SomePage } from '~featureName'` — never reach into another feature's internals.
- **No relative imports** — use path aliases instead. Exception: importing style files within the same folder.
- **Path aliases**:
  - `~featureName/...` → `src/features/featureName/...` (within the same feature only)
  - `src/...` → project root `src/` (for global code)
- **No default exports** — use named exports everywhere.

## Enforcement

These rules are enforced via ESLint:
- `eslint-plugin-boundaries` — prevents cross-feature private imports
- `no-restricted-imports` — blocks relative imports
- `no-restricted-syntax` — blocks default exports

## Preferences (override per project)

- Package manager: pnpm
- Styling: CSS Modules + SASS
- Routing: code-based (file-based is an alternative if the user prefers)
