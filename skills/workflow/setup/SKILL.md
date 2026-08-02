---
name: ai-coding-setup
description: "Set up a project for ai-coding: its coding conventions and sub-agent model tiers. Use when the user wants to set up or configure a project for ai-coding, or when they mention coding conventions or sub-agents."
---

# Setup

Setup for ai-coding, composed of independent **parts** that each decide on their own whether to run, update, or skip.

Announce **[⚙️ Setup]** when you enter this skill, then write no further inline step announcements. Each part reports progress via the `workflow_progress` tool as its first action.

Run the parts in the order listed below, on every entry. Do NOT skip a part or add branching here. Run one part at a time: fully complete a part — including its confirm step — before starting the next.

Ask one question at a time. Wait for the user's answer before asking the next. Never combine multiple questions into a single message, and never combine questions or steps from different parts into one message.

1. **Conventions** → follow `./conventions/index.md`
2. **Sub-agents** → follow `./subagents/index.md`
