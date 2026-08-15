# ai-coding

A complete, spec-driven development workflow for [pi](https://github.com/earendil-works/pi). Instead of letting the agent jump straight to code, it guides every change through the same disciplined path: talk through the design first, agree on a spec, break it into small tasks, implement and review them one at a time, confirm the result matches the spec, and update the docs. The result is more predictable output, fewer surprises, and code you can actually trust — even on large changes.

It runs mostly on its own: the agent picks up the right phase at the right time, keeps its own context clean, and hands work to specialized sub-agents so the main agent stays sharp.

## Installation

First install [ai-base](https://github.com/cristi-lng/ai-base) — the foundation layer of extensions, sub-agents, and web access this workflow builds on. Install it globally so it's available everywhere:

```bash
# ai-base — global, writes to ~/.pi/agent/settings.json
# replace vx.x.x with the desired release tag
pi install git:github.com/cristi-lng/ai-base@vx.x.x
```

Then install ai-coding per project:

```bash
# ai-coding — per project, writes to .pi/settings.json
# replace vx.x.x with the desired release tag
pi install git:github.com/cristi-lng/ai-coding@vx.x.x -l
```

## Usage

**The first time you use it in a project, let the agent set things up.** It runs setup automatically — recording your project's coding conventions and choosing which AI models handle which jobs. If for some reason it doesn't, run `/skill:ai-coding-setup` yourself.

**After that, just tell the agent what you want to build or change.** It automatically starts by talking through the design with you and won't touch code until you approve a plan, then works through the rest of the steps on its own. If it ever skips straight to coding, run `/skill:ai-coding-brainstorming` to nudge it back on track.

## Features

### Workflow skills

The agent moves through these in order:

- **setup** — Learns your project's coding style and picks which AI models do which jobs.
- **brainstorming** — Talks through the design with you and writes a spec. No code until you approve it.
- **spec-to-tasks** — Splits the spec into small, ordered tasks that can each be checked on their own.
- **implementation** — Builds the tasks one at a time: one sub-agent writes the code, another reviews it.
- **verification** — Checks that what was built actually matches the spec.
- **documentation** — Updates the project's docs when behavior changed.

### Under the hood

- **Setup guard** — Won't let the agent start working until the project has been set up.
- **Progress widget** — A line above your input box shows the current step, e.g. `[Brainstorming 1/2: Clarifying questions]`.
- **Specialized sub-agents** — Each job gets the right model: reviewers are careful deep thinkers, the coder and doc-writer are balanced all-rounders, the explorer is a fast, lightweight scout. Chosen during setup.
- **Small, focused context** — When a phase finishes, its conversation collapses into a short summary. This keeps the main agent's context small so it stays in the smart zone and doesn't drift. Your full conversation is still saved and survives `/resume`.
- **Auto-commits** — In auto mode, the agent commits after each finished task.
