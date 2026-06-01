---
name: brainstorming
description: Collaborative design and specification through dialogue. Explores user intent, requirements, and design before implementation. You MUST use this skill for ANY change. The only exception is purely mechanical work where the what and how are both obvious (e.g., fix a wrong computation, rename a symbol, repeat an identical edit across files). When in doubt, use this skill.
---

# Brainstorming

## Instructions

Do NOT write any code, create files, or invoke any implementation skill until you have presented a spec that the user explicitly approved. This applies to EVERY case. Never assume the change is too simple to need a spec.

Follow these steps in order. At each transition, announce the current step to the user (e.g., **[Step 3/8 — Clarifying questions]**):

1. **Assess the scope**

- If the request fits within a single focused responsibility, proceed to step 2.
- If the request is too broad, do not proceed further. A request is too broad when:
  - it spans multiple systems (e.g., a customer-facing app + a backoffice app + a scheduled job)
  - it bundles multiple unrelated features (e.g., auth + product listing + comments with reactions)
- When too broad: propose an ordered list of independent pieces, explain how they relate and suggest an implementation sequence. Then stop — wait for the user to pick one piece and ask you to work on it.

2. **Explore the project**

- Use a sub-agent to explore the codebase and understand:
  - folder structure and architecture style
  - coding patterns and naming conventions
  - business context (existing specs, docs, README)
- Pay close attention to existing patterns. If there are conflicting patterns in the project, ask the user which one to follow.
- If an existing pattern conflicts with what the new feature naturally requires, flag it and let the user decide.
- If the project is new or empty, ask the user if they have a reference project or preferred architecture to follow.
- If the project uses feature-based architecture (or the user opts into it), load and follow the rules in `../feature-based-architecture.md`.

3. **Ask clarifying questions**

- This stage is critical to understand what the user wants. NEVER rush it.
- Focus on understanding: purpose, constraints, success criteria.
- Ask one question per message. If a topic needs more exploration, break it into multiple questions.
- Prefer multiple-choice questions when possible — propose 2-3 approaches with trade-offs and recommend one with reasoning. Open-ended is fine when choices aren't obvious.
- Stop asking when all unknowns are resolved and you can describe the full solution without gaps.
- **Visual questions**
  - If a question is visual (layouts, wireframes, diagrams) and the user would understand it better by seeing it, ask if they want to view it in a browser.
  - If yes, create a single self-contained HTML file at `<root>/specs/temp-<visual-proposal-name>.html`.
  - Only use visual questions if the HTML can be generated in under 30 seconds.
  - Before deleting the temp file, summarize the agreed visual decision in text in the conversation. This summary will be used when writing the spec.
  - Delete the temp file after the decision is captured.

4. **Present the spec outline**

- Summarize what you understood from the exploration and questions. The goal is to validate alignment with the user before writing the formal spec.
- Present it in sections, scaled to complexity:
  - straightforward sections: a few sentences
  - complex sections: up to 200-300 words
- Present ONE section at a time. Do not combine multiple sections in a single message.
- Ask after each section whether it looks right so far. Be ready to go back and clarify.
- **Design principles** (apply these when shaping the solution)
  - Design with small units that each have one clear purpose, communicate through well-defined interfaces, and can be understood and tested independently.
  - Test: can someone understand what a unit does without reading its internals? Can you change internals without breaking consumers? If not, the boundaries need work.
  - If existing code affected by the changes has issues (file too large, too many responsibilities, unclear boundaries), propose targeted improvements without losing focus on the current goal.

5. **Write the spec**

- Write the spec following the rules in `./spec-writer.md`.
- Use the approved outline from step 4, visual decision summaries (if any), and project context gathered throughout the conversation.

6. **Self-review the spec**

- Spawn a new sub-agent to review the spec using the rules in `./spec-reviewer.md`.
- Pass the reviewer both the spec file and the context (approved outline, user decisions) so it can verify the spec is faithful to what was agreed.
- If the review finds issues:
  - The main agent fixes them (not the reviewer). If the fix is clear, apply it and re-review (max 2 cycles).
  - If the issue is ambiguous or conflicts with user decisions, surface it to the user before proceeding.

7. **User reviews the spec**

- Point the user to the spec file path and ask them to review it before proceeding.
- Wait for the user's response. If they request changes, make them and re-run the self-review step. Only proceed once the user approves.
- If the user wants to fundamentally rethink the approach, go back to step 3.

8. **Transition to split plan in tasks**

- Ask the user if they are ready to split the spec into implementation tasks.
- Once confirmed, invoke the split-plan-in-tasks skill. Pass:
  - the spec file path
  - context: key decisions, priorities, and dependencies discussed during brainstorming
