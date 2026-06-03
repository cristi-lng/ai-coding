// @ts-nocheck
/**
 * Info Bar Extension
 *
 * Uses the default editor with purple-colored borders and three info lines below:
 *   1. $cost · ctx used/total · ↑input ↓output ⊕cache  (purple)
 *   2. [spinner] model · provider                       (dim)
 *   3. ~/cwd (branch)                                   (dim)
 */

import type { AssistantMessage } from "@earendil-works/pi-ai";
import {
	CustomEditor,
	type ExtensionAPI,
	type ExtensionContext,
	type KeybindingsManager,
} from "@earendil-works/pi-coding-agent";
import type { Component, EditorTheme, TUI } from "@earendil-works/pi-tui";
import { truncateToWidth } from "@earendil-works/pi-tui";

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmt(n: number): string {
	if (n === 0) return "0";
	if (n < 1000) return `${n}`;
	if (n < 10_000) return `${(n / 1000).toFixed(1)}k`;
	if (n < 1_000_000) return `${Math.round(n / 1000)}k`;
	return `${(n / 1_000_000).toFixed(1)}M`;
}

function formatCwd(cwd: string): string {
	const home = process.env.HOME;
	if (home && cwd.startsWith(home)) {
		return `~${cwd.slice(home.length)}`;
	}
	return cwd;
}

function formatContext(ctx: ExtensionContext): string {
	const usage = ctx.getContextUsage();
	const contextWindow = usage?.contextWindow ?? ctx.model?.contextWindow;
	if (!contextWindow) return "ctx 0/?";
	const used = usage?.tokens;
	if (used == null) return `ctx ?/${fmt(contextWindow)}`;
	return `ctx ${fmt(used)}/${fmt(contextWindow)}`;
}

function getSessionStats(ctx: ExtensionContext): {
	input: number;
	output: number;
	cacheRead: number;
	cost: number;
} {
	let input = 0;
	let output = 0;
	let cacheRead = 0;
	let cost = 0;
	for (const e of ctx.sessionManager.getBranch()) {
		if (e.type === "message" && e.message.role === "assistant") {
			const m = e.message as AssistantMessage;
			input += m.usage.input;
			output += m.usage.output;
			cacheRead += m.usage.cacheRead ?? 0;
			cost += m.usage.cost.total;
		}
	}
	return { input, output, cacheRead, cost };
}

// ANSI helper for #DDA0DD purple (24-bit color)
const purple = (s: string) => `\x1b[38;2;221;160;221m${s}\x1b[0m`;


// ─── Empty Footer ───────────────────────────────────────────────────────────

class EmptyFooter implements Component {
	render(): string[] {
		return [];
	}
	invalidate(): void {}
}

// ─── Extension ──────────────────────────────────────────────────────────────

export default function (pi: ExtensionAPI) {
	let isWorking = false;
	let spinnerIndex = 0;
	let spinnerTimer: ReturnType<typeof setInterval> | undefined;
	let activeTui: TUI | undefined;
	const spinnerFrames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

	const stopSpinner = () => {
		if (spinnerTimer) {
			clearInterval(spinnerTimer);
			spinnerTimer = undefined;
		}
	};

	pi.on("agent_start", () => {
		isWorking = true;
		stopSpinner();
		spinnerTimer = setInterval(() => {
			spinnerIndex = (spinnerIndex + 1) % spinnerFrames.length;
			activeTui?.requestRender();
		}, 80);
		activeTui?.requestRender();
	});

	pi.on("agent_end", () => {
		isWorking = false;
		stopSpinner();
		activeTui?.requestRender();
	});

	pi.on("session_shutdown", () => {
		stopSpinner();
		activeTui = undefined;
	});

	pi.on("session_start", (_event, ctx) => {
		// Hide default working indicator and footer
		ctx.ui.setWorkingVisible(false);
		ctx.ui.setFooter(() => new EmptyFooter());

		// Git branch detection
		let branch: string | undefined;
		const refreshBranch = async () => {
			const result = await pi
				.exec("git", ["branch", "--show-current"], { cwd: ctx.cwd })
				.catch(() => undefined);
			const stdout = result?.stdout.trim();
			branch = stdout && stdout.length > 0 ? stdout : undefined;
			activeTui?.requestRender();
		};
		void refreshBranch();

		// ─── Custom Editor ──────────────────────────────────────────────

		class CleanEditor extends CustomEditor {
			constructor(tui: TUI, theme: EditorTheme, keybindings: KeybindingsManager) {
				super(tui, theme, keybindings, { paddingX: 1 });
				activeTui = tui;
			}

			render(width: number): string[] {
				// Force plum border color (app overrides it externally)
				this.borderColor = (s: string) => purple(s);
				const lines = super.render(width);

				// Add separator line when slash menu is open
				if (this.isShowingAutocomplete()) {
					lines.push(purple("─".repeat(width)));
				}

				const thm = ctx.ui.theme;
				const sep = thm.fg("dim" as any, " · ");

				// Line 1: $cost · ctx %/total · ↑in ↓out ⊕cache (purple)
				const stats = getSessionStats(ctx);
				const costStr = purple(`$${stats.cost.toFixed(3)}`);
				const ctxStr = purple(formatContext(ctx));
				const tokensStr = purple(
					`↑${fmt(stats.input)} ↓${fmt(stats.output)} ⊕${fmt(stats.cacheRead)}`,
				);
				const line1 = ` ${costStr}${sep}${ctxStr}${sep}${tokensStr}`;

				// Line 2: [spinner] model · provider (dim)
				const model = ctx.model;
				const modelStr = model ? model.id : "no-model";
				const providerStr = model ? model.provider : "";
				const spinnerStr = isWorking
					? purple(spinnerFrames[spinnerIndex]) + " "
					: "";
				const modelLine = providerStr
					? ` ${spinnerStr}${thm.fg("dim" as any, modelStr)}${sep}${thm.fg("dim" as any, providerStr)}`
					: ` ${spinnerStr}${thm.fg("dim" as any, modelStr)}`;

				// Line 3: ~/cwd (branch) (dim)
				const cwdStr = formatCwd(ctx.cwd);
				const branchStr = branch ? ` (${branch})` : "";
				const line3 = ` ${thm.fg("dim" as any, cwdStr + branchStr)}`;

				lines.push(truncateToWidth(line1, width));
				lines.push(truncateToWidth(modelLine, width));
				lines.push(truncateToWidth(line3, width));

				return lines;
			}
		}

		ctx.ui.setEditorComponent((tui, theme, keybindings) => {
			return new CleanEditor(tui, theme, keybindings);
		});
	});
}
