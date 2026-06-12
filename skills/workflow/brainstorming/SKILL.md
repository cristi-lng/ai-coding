---
name: ai-coding-brainstorming
description: Collaborative design and specification through dialogue. Explores user intent, requirements, and design before implementation. You MUST use this skill for ANY change. The only exception is purely mechanical work where the what and how are both obvious (e.g., fix a wrong computation, rename a symbol, repeat an identical edit across files). When in doubt, use this skill.
---

# Brainstorming

## Instructions

Do NOT write any code, create files, or invoke any implementation skill until you have presented a spec that the user explicitly approved. This applies to EVERY case. Never assume the change is too simple to need a spec.

Announce **[🎯 Brainstorming]** when you enter this skill (for scroll-back readability), then do not write any more inline step announcements. Instead, call the `workflow_progress` tool at each step transition with `skill: "Brainstorming"`, the current step number, total number of steps in this skill, and a short label.

Follow these steps in order:

1. **Assess the scope**

- If the request fits within a single focused responsibility, proceed to step 2.
- If the request is too broad, do not proceed further. A request is too broad when:
  - it spans multiple systems (e.g., a customer-facing app + a backoffice app + a scheduled job)
  - it bundles multiple unrelated features (e.g., auth + product listing + comments with reactions)
- When too broad: propose an ordered list of independent pieces, explain how they relate and suggest an implementation sequence. Then stop — wait for the user to pick one piece and ask you to work on it.

2. **Explore the relevant code**

- Use a sub-agent to understand the area affected by the request:
  - What exists today that relates to the change
  - How the new implementation might integrate (entry points, boundaries, dependencies)
- Do not explore conventions or architecture — those are already in context via AGENTS.md.
- If the project is new or empty, skip this step.

3. **Ask clarifying questions**

- This stage is critical to understand what the user wants. NEVER rush it.
- Ground your questions in what the exploration revealed — gaps, ambiguities, integration decisions.
- Focus on understanding: purpose, constraints, success criteria.
- Ask one question per message. If a topic needs more exploration, break it into multiple questions.
- Prefer multiple-choice questions when possible — propose 2-3 approaches with trade-offs and recommend one with reasoning. Open-ended is fine when choices aren't obvious.
- Stop asking when all unknowns are resolved and you can describe the full solution without gaps.
- **Visual questions**
  - If a question is visual (layouts, wireframes, diagrams) and the user would understand it better by seeing it, ask if they want to view it in a browser.
  - If yes, create a single self-contained HTML file at `plans/temp-<visual-proposal-name>.html`.
  - Only use visual questions if the HTML can be generated in under 30 seconds.
  - Before deleting the temp file, summarize the agreed visual decision in text in the conversation. This summary will be used when writing the spec.
  - Delete the temp file after the decision is captured.

4. **Present the spec outline**

- Summarize what you understood from the exploration and questions. The goal is to validate alignment with the user before writing the formal spec.
- Present it in sections, scaled to complexity:
  - straightforward sections: a few sentences
  - complex sections: up to 200-300 words
- For simple specs (3 sections or fewer), present all at once and ask if it looks right. For longer specs, present ONE section at a time and ask after each whether it looks right so far.
- Be ready to go back and clarify.

5. **Write the spec**

- Write the spec to `plans/<feature-name>/spec.md`.
- Use the approved outline from step 4, visual decision summaries (if any), and project context gathered throughout the conversation.

6. **Self-review the spec**

- Spawn a new sub-agent to review the spec using the rules in `./spec-reviewer.md`.
- Pass the reviewer both the spec file path and the context (approved outline, user decisions) so it can verify the spec is faithful to what was agreed.
- If the review finds issues:
  - The main agent fixes them (not the reviewer). If the fix is clear, apply it and re-review (max 2 cycles).
  - If the issue is ambiguous or conflicts with user decisions, surface it to the user before proceeding.

7. **User reviews the spec**

- Point the user to the spec file path and ask them to review it before proceeding.
- Wait for the user's response. If they request changes, make them and re-run the self-review step. Only proceed once the user approves.
- If the user wants to fundamentally rethink the approach, go back to step 3.

8. **Transition to split the spec into tasks**

- Ask the user if they are ready to split the spec into implementation tasks.
- Once confirmed, invoke the ai-coding-spec-to-tasks skill.
