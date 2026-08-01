---
name: ai-coding-setup
description: "Set up a project for ai-coding: its coding conventions and sub-agent model tiers. Use when the user wants to set up or configure a project for ai-coding, or when they mention coding conventions or sub-agents."
---

# Setup

Setup for ai-coding, composed of independent **parts** that each decide on their own whether to run, update, or skip.

Announce **[⚙️ Setup]** when you enter this skill, then write no further inline step announcements. Each part reports progress via the `workflow_progress` tool as its first action.

Run each part in order, on every entry. Do NOT skip a part or add branching here:

1. **Conventions** → follow `./conventions/index.md`
2. **Sub-agents** → follow `./subagents/index.md`
