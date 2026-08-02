# Component split conventions

How to split a UI component when it grows. Read this before creating a component, splitting its
logic, or when you are unsure where a piece of logic belongs.

## The three responsibilities

A component has up to three concerns, and each has a home:

- **Rendering** — the JSX and markup that the user sees.
- **Business logic** — the algorithms and rules that do not depend on the framework, written as
  plain functions and kept in the feature's `services/` folder.
- **Framework glue** — the wiring that connects logic to rendering using framework primitives, such
  as hooks in React or composables in Vue.

Keeping these separate makes the logic testable without the framework and the rendering easy to
read.

## Files, once split

| File | Responsibility |
|------|----------------|
| `component.tsx` | Rendering (template / markup) |
| `useComponent.ts` | Framework glue — connects logic to rendering via framework primitives |
| `services/componentService.ts` | Business logic — framework-independent and unit-testable, in the feature's `services/` folder |
| `component.module.scss` | Scoped styles |
| `component.test.tsx` | Tests |
| `componentLoader.ts` | Route loader (prefetch data) |

## When to split

Start with a single `component.tsx`. Do not pre-split. Pull a concern into its own file only when
that concern becomes hard to follow on its own — for example, when the logic grows enough that it
deserves its own tests, or the rendering is buried under state wiring.

A small component that renders some props needs no service and no hook. Splitting it early only adds
indirection.

## Framework note

The table uses React names. In another framework, keep the same split and rename the glue layer to
its equivalent (e.g. a Vue composable instead of a hook). The rendering / logic / glue boundary does
not change.
