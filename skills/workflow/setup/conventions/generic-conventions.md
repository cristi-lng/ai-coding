# Generic conventions

## Constraints

- Do not create new abstractions, utilities, or patterns when equivalent ones already exist in the codebase.
- Do not introduce a different approach to a problem the project already solves.
- Do not refactor, rename, or modify code unrelated to the current task.
- Do not add workarounds or feature flags to patch symptoms — fix the root cause.
- Do not leave dead code, unused imports, or commented-out blocks.
- Do not swallow errors or catch broadly when you can catch specifically.
- Do not add dependencies unless absolutely necessary.

## Process

- Do not present work you haven't fully thought through.
- Before writing new code, search the codebase for existing solutions to the same problem.
- If tests fail after your changes, fix the root cause — do not modify the tests to pass.
