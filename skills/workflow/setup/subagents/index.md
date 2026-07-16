# Setup — Sub-agents

Configures which model and thinking level each sub-agent (fork) uses, written to `pi-fork.effortProfiles` in the project `.pi/settings.json`.

The `fork` tool accepts only an `effort` tier (`fast` / `balanced` / `deep`) and a task — it has no per-call model setting. Each effort tier's model and thinking come entirely from these profiles. The three tiers map to the workflow roles as follows:

| Effort (raw key) | Friendly name(s)                                 | Default thinking |
| ---------------- | ------------------------------------------------ | ---------------- |
| `deep`           | the reviewers (spec / tasks / code / completion) | high             |
| `balanced`       | the implementer, the doc-writer                  | medium           |
| `fast`           | the explorer (brainstorming recon)               | low              |

## Steps

Report progress via the `workflow_progress` tool: `skill: "Setup"`, `step: 2`, `totalSteps: 2`, `label: "Sub-agents"`, and `sublabel` = the current step's short label below.

Follow these steps in order:

1. **Confirm pi-fork is available**
   - If the `fork` tool is not present, stop immediately and tell the user: "ai-coding requires pi-fork (the `fork` tool), provided via ai-base. Install and enable it, then re-run setup." Do not write any config in this case.

2. **Check for existing profiles**
   - If `.pi/settings.json` already has `pi-fork.effortProfiles`, show the current profiles and ask whether to regenerate, update, or skip.
   - If the user chooses to skip, stop here — this part is done.

3. **List available models**
   - Run `pi --list-models` to see the models the user can access.

4. **Propose a 3-tier default**
   - Assign tiers from the listed models: the strongest reasoning model to `deep`, a mid model to `balanced`, and the cheapest or fastest to `fast`.
   - If the user has only one model, use that same `id` for all three tiers and vary only `thinking` (`deep`=high, `balanced`=medium, `fast`=low).
   - Present the proposal in friendly terms ("the reviewer agent", "the implementer", "the explorer").

5. **Customize the tiers**
   - Ask whether the user wants to accept the default or customize it.
   - If they customize, show the `--list-models` output and let them pick a `provider`, `id`, and `thinking` level for each tier. Valid `thinking` values are `off`, `minimal`, `low`, `medium`, `high`, and `xhigh`.
   - pi-fork validates the `thinking` value but not the model, so an `id` that isn't in `--list-models` is accepted here and fails later when the sub-agent launches.
   - If a chosen model is not a reasoning model, warn the user that `thinking` will be forced to `off`.

6. **Write the config**
   - Merge the profiles into the project `.pi/settings.json`. Do not overwrite other settings already in the file.
   - Under `pi-fork.effortProfiles`, write the raw keys `deep`, `balanced`, and `fast` (the dialogue uses friendly names, but the file uses these raw keys), each with a `provider`, `id`, and `thinking`.
   - Set `pi-fork.defaultEffort` to `"balanced"` as a fallback for any fork that omits `effort`.

   ```json
   {
     "pi-fork": {
       "defaultEffort": "balanced",
       "effortProfiles": {
         "deep": { "provider": "<p>", "id": "<model>", "thinking": "high" },
         "balanced": {
           "provider": "<p>",
           "id": "<model>",
           "thinking": "medium"
         },
         "fast": { "provider": "<p>", "id": "<model>", "thinking": "low" }
       }
     }
   }
   ```

7. **Confirm**
   - Show the user the `pi-fork` block that was written and ask whether they want to change anything.
