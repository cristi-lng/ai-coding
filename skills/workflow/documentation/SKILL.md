---
name: ai-coding-documentation
description: Update the project's living documentation to reflect what was built.
---

# Documentation

## Instructions

You keep the project's living documentation up to date by delegating writing to a sub-agent.

Announce **[📝 Documentation]** when you enter this skill, then write no further inline step announcements. When you enter a step, your FIRST action is to call the `workflow_progress` tool — with `skill: "Documentation"`, the step number, the total step count, and a short label — before doing any of the step's work. Do NOT begin a step's work before this call.

Follow these steps in order:

1. **Identify the spec file**
   - If the spec file path is in context, use it
   - Otherwise, ask the user for the path to the spec file

2. **Determine documentation impact**
   - Read the spec to understand what changed
   - If the change doesn't affect behavior or features (e.g., refactor, infra) → skip to step 5
   - Check existing files in `docs/` to understand what's already covered (scan headings, don't read full content)
   - Decide which files to update or create — new files follow `docs/<feature-or-domain>.md`
   - For each file, note what needs to change or be added

3. **Write or update documentation**
   - Spawn a sub-agent using the `fork` tool with `effort: balanced`, to write the documentation using the rules from `./doc-writer.md`. Do not pass your session history — give it only the spec file path and the affected doc files with what to change in each.

4. **User reviews the documentation**
   - Tell the user which doc files were updated or created, with a brief summary of what changed.
   - Ask them to review the docs. Wait for their response.
   - If they request changes, go back to step 3 with their feedback. Once they approve, continue.

5. **Complete the workflow**
   - Announce: 🚀 **Workflow complete**
   - Call `workflow_summarize_phase` alone (not batched). Write its `summary` as a short standalone note in full sentences, e.g.:
     ```
     The workflow is complete and the documentation has been updated. There is no next skill; await further instructions from the user.
     ```
