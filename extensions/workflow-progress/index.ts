// @ts-nocheck
/**
 * Workflow Progress Extension
 *
 * Displays a sticky widget above the editor showing the current workflow step.
 * Format: [Brainstorming 3/8: Clarifying questions]
 *
 * The LLM calls the `workflow_progress` tool at each step transition.
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

export default function (pi: ExtensionAPI) {
  let currentCtx: any = null;

  pi.on("session_start", (_event, ctx) => {
    currentCtx = ctx;
    // Clear widget on new session
    ctx.ui.setWidget("workflow-progress", undefined);
  });

  pi.on("session_shutdown", () => {
    currentCtx = null;
  });

  pi.registerTool({
    name: "workflow_progress",
    label: "Workflow Progress",
    description:
      "Update the workflow progress indicator shown to the user. Call at each step transition.",
    parameters: Type.Object({
      skill: Type.String({
        description:
          "Current skill name (e.g., Brainstorming, Spec to Tasks, Implementation, Verification, Documentation)",
      }),
      step: Type.Number({ description: "Current step number" }),
      totalSteps: Type.Number({ description: "Total steps in this skill" }),
      label: Type.String({
        description:
          "Short label for the current step (e.g., Clarifying questions)",
      }),
      sublabel: Type.Optional(
        Type.String({
          description:
            "Optional sub-progress line (e.g., Task 1/5 — Reviewing: Add auth middleware)",
        }),
      ),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
      const { skill, step, totalSteps, label, sublabel } = params;
      const text = `[${skill} ${step}/${totalSteps}: ${label}]`;

      const purple = (s: string) => `\x1b[38;2;221;160;221m${s}\x1b[0m`;

      ctx.ui.setWidget("workflow-progress", (_tui, _theme) => ({
        render(_width: number) {
          const lines = [purple(text)];
          if (sublabel) {
            lines.push(`${purple("●")} ${purple(sublabel)}`);
          }
          return lines;
        },
        invalidate() {},
      }));

      return {
        content: [{ type: "text", text: "Progress updated." }],
        details: {},
      };
    },
  });
}
