# AI coding

AI-assisted development workflow for pi — skills and extensions.

## Installation

```bash
# Per-project (writes to .pi/settings.json)
pi install git:github.com/cristi-lng/ai-coding -l

# Global (writes to ~/.pi/agent/settings.json)
pi install git:github.com/cristi-lng/ai-coding
```

Both can coexist with different filters — e.g., extensions globally and skills per-project.

### Filtering

By default everything is loaded. To control what gets included, use package filtering in your settings:

```json
{
  "packages": [
    {
      "source": "git:github.com/cristi-lng/ai-coding",
      "skills": ["skills/workflow", "skills/helpers/write-a-skill"],
      "extensions": []
    }
  ]
}
```

Examples:
- Everything: omit filters
- All workflow + specific helpers: `"skills": ["skills/workflow", "skills/helpers/write-a-skill"]`
- Exclude a workflow step: `"skills": ["skills/workflow", "!skills/workflow/document-feature"]`
- Cherry-pick: `"skills": ["skills/workflow/brainstorming", "skills/workflow/implement-task"]`
- Skills only, no extensions: `"extensions": []`
- Extensions only, no skills: `"skills": []`

## Structure

```
extensions/
  info-editor/               # Custom TUI editor with session info bar
    index.ts

skills/
  workflow/                   # Pipeline skills — used in every development cycle
    brainstorming/            # Step 1: Create the spec
    split-plan-in-tasks/     # Step 2: Break spec into implementable tasks
    implement-task/          # Step 3: TDD cycle per task
    document-feature/        # Step 4: Update living docs (when business changes)
    final-review/            # Step 5: Holistic validation
    feature-based-architecture.md
  helpers/                   # On-demand skills
    write-a-skill/
```

## Workflow

```
Brainstorming → Split plan into tasks → Implement tasks (serial) → Document → Final review
```

### 1. Brainstorming

- Collaborative design through dialogue
- Produces a **spec** — the blueprint for what to build and how
- Spec lives in `plans/<feature-name>/spec.md`
- Sub-agents: explorer (codebase recon), reviewer (fresh-eyes spec review)

### 2. Split plan into tasks

- Takes the approved spec and breaks it into small, sequential tasks
- Each task: small enough for one agent pass, clear inputs/outputs, independently verifiable
- Execution is **sequential** — no parallelization (simplicity > speed, avoids conflicts)

### 3. Implement task (per task, serial)

- TDD cycle for each task:
  1. Write tests
  2. Implement code
  3. Pass tests
  4. Review code (sub-agent — fresh eyes)
- One task at a time, each builds on the previous

### 4. Document the feature

- Triggered only when business logic/behavior changes (not for refactors or infra)
- Updates living docs — feature-focused description of what the app does and why
- Docs ≠ Specs: docs describe what exists (permanent), specs describe what to build (temporary)

### 5. Final review

- Holistic validation after all tasks are complete
- Checks: does everything work together? Does it match the spec? Any regressions?
- Catches cross-task issues that per-task reviews miss

## Extensions

### info-editor

Custom TUI editor with purple-colored borders and a session info bar:

```
  $0.123 · ctx 45%/128k · ↑12k ↓8k ⊕95k
  claude-sonnet-4-20250514 · anthropic
  ~/projects/my-app (main)
```

## Project artifacts

When using the workflow skills, artifacts are produced in the target project:

```
<project>/
  plans/<feature-name>/
    spec.md                 # what to build (from brainstorming)
    tasks.md                # how to sequence it (from split-plan-in-tasks)
  docs/<domain>/
    overview.md             # living documentation
```

- **plans/** — kept as history. Temporary build blueprints.
- **docs/** — updated only when business logic changes. Permanent, evolving.

## Design decisions

- **Sequential execution** — parallel adds conflict/merge overhead that isn't worth it for small tasks
- **Minimal agents** — one main agent with workflow phases. Sub-agents only where fresh perspective helps (reviewers).
- **Quality from structure** — clear specs, small tasks, good conventions, and review steps
