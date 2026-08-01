---
name: ai-coding-spec-to-tasks
description: Split a spec into sequential implementation tasks. Use when a spec file exists and is ready to be broken into implementable work.
---

# Spec to Tasks

## Instructions

Announce **[📋 Spec to Tasks]** when you enter this skill, then write no further inline step announcements. When you enter a step, your FIRST action is to call the `workflow_progress` tool — with `skill: "Spec to Tasks"`, the step number, the total step count, and a short label — before doing any of the step's work. Do NOT begin a step's work before this call.

Follow these steps in order:

1. **Identify the spec file**

- If the spec file path is in context, use it
- Otherwise, ask the user for the path to the spec file

2. **Plan the split**

- Read the spec and determine the high-level breakdown:
  - How many tasks, and in what order (respecting dependencies between them)
  - Where the boundaries between tasks fall
- Each task must deliver a **vertical slice** that the user can verify on its own. Do not create horizontal slices that deliver no user-verifiable value alone (e.g. "create the DB tables", "add the model layer").
- Tasks should be small enough that an agent can implement them without losing focus — but prefer a larger vertical task over a thin one that isn't verifiable.
- If you need to explore the codebase to determine affected areas, do so — but do not waste time on broad exploration.

3. **Detail each task**

- The implementation agent is a skilled developer but knows nothing about the problem domain — provide enough detail for each task to be implemented without reading the full spec.
- Do not leave test scenario selection to the implementation agent — prescribe what to test.
- For each task, work out:
  - Which files need to be created or changed
  - What each file should implement
  - How the pieces interact (entry points, interfaces, data flow)
  - What test scenarios to cover — focus on critical paths, edge cases, and business logic. Do not test trivial code.
- Do not rush this step. A thorough breakdown directly determines implementation quality.

4. **Write the tasks**

- Write tasks to `tasks.md` in the same folder as the spec (e.g. `plans/YYYY-MM-DD-<feature-name>/tasks.md`).
- Do not include large code blocks.
- Use this template for each task:

```markdown
## [ ] Task X: Name

**Changes:**

- file path — what it implements and how it connects to other parts

**Test scenarios:**

- scenario 1
- scenario 2
- critical edge case
```

5. **Self-review**

- Spawn a sub-agent using the `fork` tool with `effort: deep`, to review the tasks using the rules in `./tasks-reviewer.md`. Do not pass your session history — give the reviewer only the spec file path, the tasks file path, and the tasks template, so it reviews the tasks fresh against the spec.
- If the review finds issues, the main agent (not the reviewer) fixes them:
  - If the fix is clear, apply it and re-review (max 2 cycles).
  - Otherwise — ambiguous, conflicts with the spec, or still unresolved after 2 cycles — surface it to the user with your recommendation.

6. **User reviews the tasks**

- Point the user to the tasks file and ask them to review before proceeding.
- Wait for approval. If they request changes, make them and re-run the self-review step. Only proceed once approved.

7. **Transition to implementation**

- Call `workflow_summarize_phase` alone (not batched). Write its `summary` as a short standalone note in full sentences, e.g.:
  ```
  Spec-to-tasks is complete and the tasks are approved. The tasks are at plans/YYYY-MM-DD-<feature-name>/tasks.md. Next, invoke the `ai-coding-implementation` skill.
  ```
