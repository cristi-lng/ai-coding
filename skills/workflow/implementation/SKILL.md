---
name: ai-coding-implementation
description: Implement tasks from a tasks file sequentially with review cycles. Use when a tasks file exists and is ready for implementation.
---

# Implementation

## Instructions

You are the orchestrator. You do not write code yourself — you delegate implementation and review to sub-agents, then manage their results.

Do not pass your session history to sub-agents. Do not dispatch multiple sub-agents in parallel.

Follow these steps in order:

1. **Identify the tasks file**
   - If the tasks file path is in context, use it
   - Otherwise, ask the user for the path to the tasks file

2. **Ask execution mode**
   - Auto: run all tasks without pausing
   - Manual: pause after each task for user review

3. **For each task in the tasks file, follow these steps sequentially:**

- 3.1. **Implementation** — announce **[Task 1/n — Implementation: Task name]**
  - Spawn a sub-agent with the full task content from the tasks file and the rules from `./code-implementer.md`
  - If sub-agent asks clarifying questions → answer from your context if possible; otherwise surface to user
  - If sub-agent escalates a blocker → surface to user and wait

- 3.2. **Review** — announce **[Task 1/n — Review: Task name]**
  - Spawn a sub-agent with the full task content, the list of files changed, and the rules from `./code-reviewer.md`
  - If review approves → move to 3.3
  - If review finds issues → repeat 3.1 with the review issues included, then 3.2 again
  - Do not repeat this cycle more than 2 times — after that, surface to user

- 3.3. **Complete** — announce **[Task 1/n — Complete: Task name]**
  - If manual mode → do not proceed to next task until user explicitly confirms
  - If auto mode → move to next task immediately

4. **Transition to verification**
   - Announce all tasks completed.
   - Ask the user if they are ready to verify the implementation against the spec.
   - Once confirmed, invoke the ai-coding-verification skill.
