---
name: ai-coding-spec-to-tasks
description: Split a spec into sequential implementation tasks. Use when a spec file exists and is ready to be broken into implementable work.
---

# Spec to Tasks

## Instructions

Announce **[📋 Spec to Tasks]** when you enter this skill (for scroll-back readability), then do not write any more inline step announcements. Instead, call the `workflow_progress` tool at each step transition with `skill: "Spec to Tasks"`, the current step number, total number of steps in this skill, and a short label.

Follow these steps in order:

1. **Identify the spec file**

- If the spec file path is in context, use it
- Otherwise, ask the user for the path to the spec file

2. **Plan the split**

- Read the spec and determine the high-level breakdown:
  - How many tasks, in what order
  - Where the boundaries between tasks fall
  - Dependencies between them
- Each task should produce self-contained changes that can be understood and tested independently.
- Tasks should be small enough that an agent can implement them without losing focus.
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

- Write tasks to `plans/<feature-name>/tasks.md`.
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

- Spawn a new sub-agent to review the tasks using the rules in `./tasks-reviewer.md`.
- Pass the reviewer the spec file path, the tasks file path, and the tasks template so it can verify the tasks cover the spec and are complete and correct.
- If the review finds issues:
  - The main agent fixes them (not the reviewer). If the fix is clear, apply it and re-review (max 2 cycles).
  - If the issue is ambiguous, surface it to the user before proceeding.

6. **User reviews the tasks**

- Point the user to the tasks file and ask them to review before proceeding.
- Wait for approval. If they request changes, make them and re-run the self-review step. Only proceed once approved.

7. **Transition to implementation**

- Ask if they are ready to move to implementation.
- Once confirmed, invoke the ai-coding-implementation skill.
