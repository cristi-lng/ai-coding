// @ts-nocheck
/**
 * Setup Guard Extension
 *
 * Injects a system prompt rule that forces the agent to run /skill:ai-coding-setup
 * before doing any other work if AGENTS.md lacks an "AI Coding: Conventions" section.
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const SETUP_GUARD_RULE =
  "Do NOT proceed to any other skill until /skill:ai-coding-setup has fully completed " +
  'and AGENTS.md contains an "AI Coding: Conventions" section.';

export default function (pi: ExtensionAPI) {
  pi.on("before_agent_start", async (event, _ctx) => {
    return {
      systemPrompt: event.systemPrompt + "\n\n" + SETUP_GUARD_RULE + "\n",
    };
  });
}
