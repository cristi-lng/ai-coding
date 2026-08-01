// @ts-nocheck
import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';

/**
 * Blocks the agent from starting work until the project is set up for ai-coding. It appends a system-prompt rule: the
 * project is set up when AGENTS.md has an "AI Coding: Conventions" section and .pi/settings.json has an effortProfiles
 * key inside its top-level pi-fork object. If either is missing, the agent must run /skill:ai-coding-setup first.
 */

const SETUP_GUARD_RULE =
  'Do NOT start any work while AGENTS.md lacks an "AI Coding: Conventions" section or .pi/settings.json lacks an ' +
  '"effortProfiles" key inside its top-level "pi-fork" object. If either is missing, run /skill:ai-coding-setup first.';

export default function (pi: ExtensionAPI) {
  pi.on('before_agent_start', async (event, _ctx) => ({
    systemPrompt: `${event.systemPrompt}\n\n${SETUP_GUARD_RULE}\n`,
  }));
}
