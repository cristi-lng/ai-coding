---
name: ai-coding-implementation
description: Implement tasks from a tasks file sequentially with review cycles. Use when a tasks file exists and is ready for implementation.
---

# Implementation

## Instructions

You are the orchestrator. You do not write code yourself — you delegate implementation and review to sub-agents, then manage their results.

Do not pass your session history to sub-agents. Do not dispatch multiple sub-agents in parallel.

Announce **[🔨 Implementation]** when you enter this skill (for scroll-back readability), then do not write any more inline step announcements. Instead, call the `workflow_progress` tool at each step transition with `skill: "Implementation"`, the current step number, total number of steps in this skill, and a short label.

During step 3 (the task loop), keep `step: 3` and `label: "Execute tasks"` constant, and use the `sublabel` parameter to show per-task progress (e.g., `Task 1/5 — Implementing: Add auth middleware`, `Task 1/5 — Reviewing: Add auth middleware`).

Follow these steps in order:

1. **Identify the tasks file**
   - If the tasks file path is in context, use it
   - Otherwise, ask the user for the path to the tasks file

2. **Ask execution mode**
   - Auto: run all tasks without pausing
   - Manual: pause after each task for user review

3. **For each uncompleted task (`## [ ]`) in the tasks file, follow these steps sequentially:**

- 3.1. **Implementation**
  - Spawn a sub-agent with the full task content from the tasks file and the rules from `./code-implementer.md`
  - If the sub-agent asks clarifying questions → answer from your context if possible; otherwise surface to the user. Once answered, the same sub-agent continues the implementation.
  - If the sub-agent escalates a blocker → surface it to the user and wait. Never skip the task. Resolving a blocker may require updating the task before it can continue — wait for the user's direction; do not proceed on your own if it would deviate from the task.

- 3.2. **Review**
  - Spawn a sub-agent with the full task content, the list of files changed (from the implementer's report), and the rules from `./code-reviewer.md`
  - If review approves → move to 3.3
  - If review finds issues → repeat 3.1 with the review issues included, then 3.2 again
  - Do not repeat this cycle more than 2 times — after that, surface to the user and wait

- 3.3. **Complete**
  - If manual mode → pause for the user's review:
    - If they request changes → go back to 3.1 with their feedback. If the change alters what the task should be, update the task in the tasks file first.
    - If they confirm → mark the task done (change `## [ ]` to `## [x]` in the task header) and move to the next task
  - If auto mode → mark the task done (change `## [ ]` to `## [x]` in the task header), then:
    - Commit the work only if the project uses git and the current branch is not the repository's default branch (e.g. `main`/`master`). When committing, include only the files this task changed (per the implementer's report), with a short message describing what was implemented. Never include unrelated working-tree changes.
    - Move to the next task immediately

4. **Transition to verification**
   - Once all tasks are complete, invoke the ai-coding-verification skill.
