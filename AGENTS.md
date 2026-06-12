# AI Coding — Agent Context

## Research: "Guardrails Beat Guidance" (arxiv, May 2026)

Study of 5,000+ controlled runs of Claude Code on SWE-bench Verified, testing 679 rule files (25,532 rules).

### Findings that guide our decisions

1. **Negative constraints help, positive directives hurt.**
   - Every beneficial rule was "do not X"; every harmful rule was "do X"
   - Most impactful: "Do not refactor unrelated code" (+20pp)
   - Most harmful: "Follow code style" (-14.3pp), "Handle edge cases" (-11.4pp)

2. **Content matters less than presence.** Random rules = curated rules (both +13.8pp). Rules work through context priming, not specific instruction.

3. **Rule count doesn't degrade.** Stable from 0 to 50 rules.

4. **Rule type ranking:** Process/tool (state-dependent) > Safety (constraints) > Code style > Architecture (state-independent, worst)

### Principles we follow

- Constrain what agents must not do, don't prescribe what they already know
- Project-specific context (what the model can't guess) is the highest-value content
- State-dependent rules ("if X, then Y") > state-independent ("always do X")
- Frame rules as constraints or guardrails, not aspirational guidance
