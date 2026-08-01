// @ts-nocheck
import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';
import { Type } from 'typebox';

/**
 * Keeps the model's context small across a multi-phase workflow. When a phase ends, its whole conversation is replaced
 * by the one summary the model wrote, so the provider only ever sees:
 *   [system] + [first request] + [phase 1 summary] + … + [live phase]
 *
 * The session file and TUI keep the full conversation — only the provider payload shrinks. Everything is recomputed
 * from the transcript on each context event, so it survives /resume. A phase is everything since the previous
 * workflow_summarize_phase call; those calls are the boundaries.
 */

const SUMMARY_PREFIX =
  '[Workflow phase complete — the conversation for this phase was reset to save context. The text below is your ' +
  'standing summary and instructions. Follow it.]';

export default function (pi: ExtensionAPI) {
  // Durable phase boundary. The model calls it alone at a phase end; its `summary` replaces the phase.
  pi.registerTool({
    name: 'workflow_summarize_phase',
    label: 'Workflow Summarize Phase',
    description:
      'Complete the current workflow phase. Call this ALONE (not batched with other tool calls). Provide a `summary` ' +
      'written as standalone instructions: what was accomplished, the artifact file produced, what phase is next, ' +
      'which skill to invoke. This summary replaces the entire phase conversation (everything since the previous ' +
      "workflow_summarize_phase) in the model's context.",
    parameters: Type.Object({
      summary: Type.String({
        description:
          'Standalone summary/instructions replacing the phase conversation. Include: what was done, artifact file ' +
          'produced, and what to do next.',
      }),
    }),
    async execute(_toolCallId, _params) {
      return {
        content: [
          {
            type: 'text',
            text: "Workflow phase complete. This phase's conversation will collapse to your summary on the next turn.",
          },
        ],
        details: {},
      };
    },
  });

  pi.on('context', async (event) => ({ messages: rebuildFromTranscript(event.messages) }));
}

function rebuildFromTranscript(messages: any[]): any[] {
  const completed: { endResultIdx: number; summary: string; timestamp: number }[] = [];

  for (let i = 0; i < messages.length; i++) {
    const endCall = getToolCall(messages[i], 'workflow_summarize_phase');
    if (!endCall) continue;

    // Fail safe: if any tool result of this turn is missing, the phase is still live — skip it.
    let endResultIdx = -1;
    let allResolved = true;
    for (const id of getToolCallIds(messages[i])) {
      const resultIdx = messages.findIndex((m: any) => m?.role === 'toolResult' && m.toolCallId === id);
      if (resultIdx === -1) {
        allResolved = false;
        break;
      }
      if (resultIdx > endResultIdx) endResultIdx = resultIdx;
    }
    if (!allResolved || endResultIdx === -1) continue;

    completed.push({
      endResultIdx,
      summary: endCall.arguments?.summary ?? '',
      timestamp: messages[i].timestamp ?? Date.now(),
    });
  }

  if (completed.length === 0) return messages;

  const firstUserIdx = messages.findIndex((m: any) => m?.role === 'user');
  const ranges: { start: number; end: number; summary: string; timestamp: number }[] = [];
  let prevEnd = -1;
  for (const phase of completed) {
    // Each phase starts after the previous boundary, so earlier summaries re-emit untouched (they accumulate).
    let start = prevEnd + 1;
    // Never collapse the original request.
    if (firstUserIdx !== -1 && start <= firstUserIdx && firstUserIdx <= phase.endResultIdx) {
      start = firstUserIdx + 1;
    }
    ranges.push({ start, end: phase.endResultIdx, summary: phase.summary, timestamp: phase.timestamp });
    prevEnd = phase.endResultIdx;
  }

  const result: any[] = [];
  let i = 0;
  while (i < messages.length) {
    const range = ranges.find((r) => r.start === i && r.start <= r.end);
    if (range) {
      result.push({ role: 'user', content: `${SUMMARY_PREFIX}\n\n${range.summary}`, timestamp: range.timestamp });
      i = range.end + 1;
    } else {
      result.push(messages[i]);
      i++;
    }
  }
  return result;
}

function getToolCall(message: any, name: string): any | undefined {
  if (message?.role !== 'assistant' || !Array.isArray(message.content)) return undefined;
  return message.content.find((block: any) => block?.type === 'toolCall' && block.name === name);
}

function getToolCallIds(message: any): string[] {
  if (message?.role !== 'assistant' || !Array.isArray(message.content)) return [];
  return message.content.filter((block: any) => block?.type === 'toolCall').map((block: any) => block.id);
}
