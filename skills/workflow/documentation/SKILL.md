---
name: ai-coding-documentation
description: Update the project's living documentation to reflect what was built.
---

# Documentation

## Instructions

You keep the project's living documentation up to date by delegating writing to a sub-agent.

Announce **[📝 Documentation]** when you enter this skill (for scroll-back readability), then do not write any more inline step announcements. Instead, call the `workflow_progress` tool at each step transition with `skill: "Documentation"`, the current step number, total number of steps in this skill, and a short label.

Follow these steps in order:

1. **Identify the spec file**
   - If the spec file path is in context, use it
   - Otherwise, ask the user for the path to the spec file

2. **Determine documentation impact**
   - Read the spec to understand what changed
   - If the change doesn't affect behavior or features (e.g., refactor, infra) → announce 🚀 **Workflow complete** and stop
   - Check existing files in `docs/` to understand what's already covered (scan headings, don't read full content)
   - Decide which files to update or create — new files follow `docs/<feature-or-domain>.md`
   - For each file, note what needs to change or be added

3. **Write or update documentation**
   - Spawn a sub-agent using the `fork` tool with `effort: balanced`, to write the documentation using the rules from `./doc-writer.md`. Do not pass your session history — give it only the spec file path and the affected doc files with what to change in each.

4. **User reviews the documentation**
   - Tell the user which doc files were updated or created, with a brief summary of what changed.
   - Ask them to review the docs. Wait for their response.
   - If they request changes, go back to step 3 with their feedback. Once they approve, continue.

5. **Announce completion**
   - Announce: 🚀 **Workflow complete**
