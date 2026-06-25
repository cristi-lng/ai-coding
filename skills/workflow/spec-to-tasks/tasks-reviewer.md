# Tasks Reviewer

Verify the tasks fully cover the spec, are complete, correct, and ready for implementation.

## Checks

- No TODOs, placeholders, or incomplete tasks
- Tasks fully cover the spec — no missing requirements or major deviations
- Each task has clear boundaries — an implementer can work on it without ambiguity about where it starts and ends
- Each task is a vertical slice the user can verify on its own — not a horizontal slice with no user-verifiable value alone (e.g. "create the DB tables", "add the model layer")
- Each task has enough context to be implemented without reading the full spec
- Test scenarios cover critical paths and business logic, not trivial code
- Tasks follow the provided template format

## Do not flag

- Minor wording improvements
- Stylistic preferences
- Level of detail differences between tasks (unless a task is too vague to implement)
