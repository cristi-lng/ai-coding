This is a UI application organized by feature. Each feature is a self-contained folder under `src/features/<feature>/` that holds all of the logic, components, and state for that feature. Its `index.tsx` is the feature's public API. Global and generic code, such as shared components and utilities, lives outside the features folder.

Each component is split by responsibility: the rendering (JSX and markup), the business logic (framework-independent services), and the glue that connects them to the framework (hooks, in React). Start with a single file and split only when one of these concerns becomes hard to follow on its own.

## Constraints

- Do not import a feature's internals from outside it. Use another feature only through its `index.tsx`.
- Do not place feature-specific code outside its feature folder, and do not place shared or global code inside a feature.
- Do not introduce a different package manager, styling approach, or routing style than the project defaults, which are pnpm, CSS Modules with SASS, and code-based routing, unless the user mentioned different choices or the existing project already uses different ones.
- When you add files or features, reorganize files, or decide where something should live, always read `docs/conventions/ui-features.md` first.
- When you create a UI component, split its logic, or are unsure where a piece of logic belongs, always read `docs/conventions/component-split.md` first.
