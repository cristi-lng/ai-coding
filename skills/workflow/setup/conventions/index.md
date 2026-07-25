# Setup — Conventions

Generates or updates the "AI Coding: Conventions" section in `AGENTS.md` (project root).

The conventions follow a layered hierarchy:

1. **Generic** — always present, the baseline for all code
2. **UI Feature conventions** — optional, scoped to specific paths (frontend/full-stack apps)
3. **Project-specific** — optional, extracted from code or user preferences

## Steps

Report progress via the `workflow_progress` tool: `skill: "Setup"`, `step: 1`, `totalSteps: 2`, `label: "Conventions"`, and `sublabel` = the current step's short label below.

Follow these steps in order:

1. **Check for an existing section**
   - If `AGENTS.md` already has an "AI Coding: Conventions" section, show its current content and ask regenerate / update / skip.
   - If the user chooses skip → stop here; this part is done.

2. **Generic layer (always included)**
   - Use `./generic-conventions.md` as-is. No questions needed — these are universal constraints.

3. **UI Feature conventions (ask)**
   - Ask: does the project have a UI layer that would benefit from feature-sliced architecture?
   - If yes → ask: whole app or specific folders/packages? (e.g. `packages/ui`, `apps/dashboard`, `src/`)
   - Use `./ui-feature-conventions.md` as the template, scoped to the specified paths.
   - Apply the "Project defaults" (package manager, styling, routing) as imposed — do not ask. Only override a default if the user already mentioned a different choice or the existing project already uses a different one.
   - If the project uses a different framework than React, adapt the idioms (component naming, hooks → composables, etc.) while keeping the architecture intact.
   - If no UI layer → skip this layer entirely.

4. **Project-specific conventions (ask)**
   - Ask: "Do you have specific conventions, a template, or a reference for this project? Or should I extract patterns from the current codebase?"
   - Options:
     - User provides a link/template → extract actionable constraints from it
     - User says extract from code → analyze the existing codebase and summarize key patterns as constraints
     - User has no code and no reference → skip this layer
   - Focus on things the model cannot infer: unusual patterns, banned approaches, team decisions, tool-specific workflows.
   - Frame extracted rules as constraints ("do not X", "always X when Y") not aspirational guidance.

5. **Generate the section**
   - Create or update the "AI Coding: Conventions" section in `AGENTS.md`.
   - If the file doesn't exist, create it.
   - If the file exists, insert/replace only the "AI Coding: Conventions" section — don't touch other content.
   - Keep it concise — agents read this on every turn. Constraints over descriptions.
   - Follow the layered hierarchy below. Include only the layers that apply; if no UI layer and no project-specific rules, emit only `### Generic`.

   ```markdown
   ## AI Coding: Conventions

   ### Generic

   (content from generic-conventions.md)

   ### UI Feature conventions (src/, packages/ui)

   (content from ui-feature-conventions.md, scoped to specified paths)

   ### Project-specific

   (constraints extracted from code, user template, or preferences)
   ```

6. **Confirm**
   - Show the user what was generated and ask if they want to adjust anything.
