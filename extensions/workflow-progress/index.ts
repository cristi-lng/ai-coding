// @ts-nocheck
import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';
import { Type } from 'typebox';

/**
 * Shows a sticky widget above the input bar with the current workflow step, e.g. "[Brainstorming 3/8: Clarifying
 * questions]", plus an optional sub-progress line. The model updates it by calling the workflow_progress tool at each
 * step transition; the widget is cleared when a new session starts.
 */

export default function (pi: ExtensionAPI) {
  pi.on('session_start', (_event, ctx) => ctx.ui.setWidget('workflow-progress', undefined));

  // The model calls this at each step transition to update the sticky progress line.
  pi.registerTool({
    name: 'workflow_progress',
    label: 'Workflow Progress',
    description: 'Update the workflow progress indicator shown to the user. Call at each step transition.',
    parameters: Type.Object({
      skill: Type.String({ description: 'Current skill name (e.g., Brainstorming)' }),
      step: Type.Number({ description: 'Current step number' }),
      totalSteps: Type.Number({ description: 'Total steps in this skill' }),
      label: Type.String({ description: 'Short label for the current step (e.g., Clarifying questions)' }),
      sublabel: Type.Optional(
        Type.String({ description: 'Optional sub-progress line (e.g., Task 1/5 — Reviewing: Add auth middleware)' }),
      ),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
      const { skill, step, totalSteps, label, sublabel } = params;
      const text = `[${skill} ${step}/${totalSteps}: ${label}]`;

      ctx.ui.setWidget('workflow-progress', (_tui, _theme) => ({
        render(_width: number) {
          const lines = [purple(text)];
          if (sublabel) lines.push(`${purple('●')} ${purple(sublabel)}`);
          return lines;
        },
        invalidate() {},
      }));

      return { content: [{ type: 'text', text: 'Progress updated.' }], details: {} };
    },
  });
}

function purple(s: string): string {
  return `\x1b[38;2;221;160;221m${s}\x1b[0m`;
}
