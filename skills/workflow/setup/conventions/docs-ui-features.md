# UI feature conventions

How this codebase is organized. Read this before adding files or features, reorganizing, or
deciding where something should live. The enforceable rules are summarized in
AGENTS.md; this file is the detail behind them.

The examples use React conventions. Adapt the idioms to the project's framework (e.g. hooks become
composables in Vue) while keeping the architecture intact.

## Project structure

```
src/
  api/            # Global HTTP client and data-provider setup
  assets/         # Static assets (images, fonts, public files)
  components/     # Generic reusable components (Button, Input, ...)
  constants/      # Global constants
  features/       # Application features — most code lives here
    bootstrap/    # App-wide initialization (layout, session, auth)
    featureA/
    featureB/
  formatters/     # Display formatters (dates, amounts, ...)
  hooks/          # Generic reusable hooks (or framework equivalents)
  i18n/           # Internationalization config and messages
  router/         # Router config (aggregates routes from features)
  stores/         # Global stores (query keys, session state)
  styles/         # Global styling (CSS variables, reset, fonts)
  testing/        # Test utilities and setup
  types/          # Global shared types
```

Everything outside `features/` is global and generic. Feature-specific code never lives here.

## Feature structure

Each feature is a self-contained folder under `src/features/`:

```
featureName/
  api/                   # API calls for this feature's data
    featureApi.ts
    featureQueries.ts    # Query option factories (if using a query library)
  components/            # Feature-specific components and pages
    somePage/
      somePage.tsx
      somePage.module.scss
      somePage.test.tsx
      somePageLoader.ts   # Route loader (data prefetch)
      useSomePage.ts      # Framework glue (optional, when complex)
      subComponent/
  services/              # Plain business logic (no framework dependency)
  types/                 # Feature-specific types
  index.tsx              # FEATURE API — the only file other code may import from
```

## The Feature API

`index.tsx` is the feature's only public surface. Other features and global code import from
`~featureName` and get only what `index.tsx` re-exports. Everything else in the folder is private.
This keeps features swappable and prevents a web of deep imports.

## Imports and exports

- Import a feature's public API through its bare alias `~featureName`, which resolves to its
  `index.tsx` — for example `import { Cart } from '~cart'`.
- Import files inside a feature through a subpath alias `~featureName/...`, but only from within that
  same feature; never use a subpath from another feature, since it reaches past the public API.
- Import global code through the `src/...` alias, which resolves to the project's `src/` root.
- Do not use relative imports, except for style files in the same folder.
- Do not use default exports anywhere; every module exports named symbols only.

## Data flow

1. **API layer** (`featureApi.ts`) — the raw calls.
2. **Query layer** (`featureQueries.ts`, optional) — query option factories built on keys from
   `src/stores/queryKeys/`.
3. **Loader** (`somePageLoader.ts`) — prefetches data for the route.
4. **Component** — consumes data via the query library or framework primitives.
5. **Mutations** — invalidate the related query keys on success.

## Query keys

Hierarchical `const` objects in `src/stores/queryKeys/`:

```ts
const featureKeys = {
  all: ['feature'] as const,
  list: () => [...featureKeys.all, 'list'] as const,
  detail: (id: string) => [...featureKeys.all, id] as const,
};
```

## Routing

Code-based. Each feature exports its route definition(s) from `index.tsx`; the config in
`src/router/` aggregates them. A route definition pairs a loader (data prefetch) with a component
(page render).

## Enforcement

These rules are enforced with ESLint, not left to discipline:

- `eslint-plugin-boundaries` — blocks cross-feature imports that bypass the Feature API.
- `no-restricted-imports` — blocks relative imports.
- `no-restricted-syntax` — blocks default exports.
