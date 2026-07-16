// @ts-nocheck
/**
 * Setup Guard Extension
 *
 * Injects a system prompt rule that forces the agent to run /skill:ai-coding-setup
 * before doing any other work if AGENTS.md lacks an "AI Coding: Conventions" section
 * or .pi/settings.json lacks "pi-fork.effortProfiles".
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const SETUP_GUARD_RULE =
  'Do NOT start any work while AGENTS.md lacks an "AI Coding: Conventions" section ' +
  'or .pi/settings.json lacks "pi-fork.effortProfiles". If either is missing, run ' +
  "/skill:ai-coding-setup first.";

export default function (pi: ExtensionAPI) {
  pi.on("before_agent_start", async (event, _ctx) => {
    return {
      systemPrompt: event.systemPrompt + "\n\n" + SETUP_GUARD_RULE + "\n",
    };
  });
}
