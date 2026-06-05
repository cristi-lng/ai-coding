// @ts-nocheck
/**
 * Setup Guard Extension
 *
 * Injects a system prompt rule that forces the agent to run /skill:ai-coding-setup
 * before doing any other work if .pi/AGENTS.md lacks an "AI Coding: Conventions" section.
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  pi.on("before_agent_start", async (event, _ctx) => {
    return {
      systemPrompt:
        event.systemPrompt +
        '\n\nIf .pi/AGENTS.md does not have an "AI Coding: Conventions" section, run /skill:ai-coding-setup before doing any other work.\n',
    };
  });
}
