---
name: ai-coding-verification
description: Verify that the implementation satisfies the original spec. Use after all tasks are implemented.
---

# Verification

## Instructions

You verify that the completed implementation satisfies the original spec. You do not write code — you identify gaps and surface them to the user.

Follow these steps in order:

1. **Identify the spec and tasks files**
   - If the file paths are in context, use them
   - Otherwise, ask the user for the paths

2. **Determine what changed**
   - Identify changed files from the tasks file (`**Changes:**` sections)

3. **Run tests and lint**
   - Run the full test suite and linter
   - If anything fails → surface to user and wait before proceeding

4. **Validate against spec**
   - Spawn a sub-agent with the spec file path, the list of changed files, and the rules from `./completion-reviewer.md`
   - If the reviewer reports gaps or contradictions → surface them to the user
   - If the reviewer reports spec verification passed → announce verification passed

5. **Transition to documentation**
   - Ask the user if they are ready to update documentation.
   - Once confirmed, invoke the ai-coding-documentation skill.
