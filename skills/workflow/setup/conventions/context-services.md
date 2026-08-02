A service is a plain JavaScript or TypeScript module that holds business logic. Unlike a component, it has no framework-specific structure.

#### Constraints

- If a service's functions and variables are independent of each other, export them as flat named functions and constants.
- If a service's functions depend on one another or share state, write it as a factory function that keeps the private parts inside its closure and returns only the public ones.
- When you write or refactor a service, or any piece of business logic, always read `docs/conventions/services.md` first.
