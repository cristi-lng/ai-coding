---
name: ai-coding-verification
description: Verify that the implementation satisfies the original spec. Use after all tasks are implemented.
---

# Verification

## Instructions

You verify that the completed implementation satisfies the original spec. You do not write code — you identify gaps and surface them to the user.

Announce **[🧪 Verification]** when you enter this skill, then write no further inline step announcements. When you enter a step, your FIRST action is to call the `workflow_progress` tool — with `skill: "Verification"`, the step number, the total step count, and a short label — before doing any of the step's work. Do NOT begin a step's work before this call.

Follow these steps in order:

1. **Identify the spec and tasks files**
   - If the file paths are in context, use them
   - Otherwise, ask the user for the paths

2. **Determine what changed**
   - Identify changed files from the tasks file (`**Changes:**` sections)

3. **Run tests and lint**
   - Run the full test suite and linter
   - If anything fails → surface it to the user and wait. If the fix means going back to an earlier step, suggest which one and let the user decide.

4. **Validate against spec**
   - Spawn a sub-agent using the `fork` tool with `effort: deep`, to validate the implementation against the spec using the rules from `./completion-reviewer.md`. Do not pass your session history — give the reviewer only the spec file path and the list of changed files, so it validates fresh against the spec.
   - If the reviewer reports gaps or contradictions → surface them to the user and wait. If addressing them means going back to an earlier step (brainstorming, spec-to-tasks, or implementation), suggest which one and let the user decide.
   - If the reviewer reports spec verification passed → announce verification passed

5. **Transition to documentation**
   - Call `workflow_summarize_phase` alone (not batched). Write its `summary` as a short standalone note in full sentences, e.g.:
     ```
     Verification is complete and the implementation satisfies the spec at plans/YYYY-MM-DD-<feature-name>/spec.md. Next, invoke the `ai-coding-documentation` skill.
     ```
