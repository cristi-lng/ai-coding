# Service conventions

A service is a plain JS/TS module that holds business logic, with no framework dependency. Read this
before writing or refactoring a service or any piece of business logic.

There are two shapes. Pick by how the functions relate to each other.

## Shape 1: flat functions (independent logic)

When the functions are independent — they don't call each other and share no state, like a utility
module — declare them as named functions and constants, then export them in a single block at
the end of the file.

```ts
function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}

function applyDiscount(price: number, percent: number): number {
  return price * (1 - percent / 100);
}

export { formatPrice, applyDiscount };
```

## Shape 2: factory (related or stateful logic)

When the functions depend on one another or share state and variables, wrap them in a `createX()`
factory. It keeps the shared state and helpers private in a closure and returns only the public
methods. Not a class, not an IIFE.

```ts
import { getProduct } from '~catalog';

/** Holds the items a shopper has added and keeps the running total in sync. */
function createCart() {
  // state
  const items = new Map<string, number>(); // productId -> quantity

  // init
  function init() {
    restoreFromStorage();
  }

  // public operations
  function addItem(productId: string, quantity = 1) {
    items.set(productId, (items.get(productId) ?? 0) + quantity);
    persist();
  }

  function removeItem(productId: string) {
    items.delete(productId);
    persist();
  }

  function total() {
    let sum = 0;
    for (const [productId, quantity] of items) sum += priceOf(productId) * quantity;
    return sum;
  }

  // private helpers
  function priceOf(productId: string) {
    return getProduct(productId).price;
  }

  function persist() {
    localStorage.setItem('cart', JSON.stringify([...items]));
  }

  function restoreFromStorage() {
    const saved = localStorage.getItem('cart');
    if (saved) for (const [id, qty] of JSON.parse(saved)) items.set(id, qty);
  }

  init();
  return { addItem, removeItem, total };
}

export const cart = createCart();
```

Use **named `function` declarations**, never arrows assigned to the returned object's keys, so
`return { addItem, removeItem, total }` reads as a clean list of the public surface.

### What to export

- Do not place exports inline in the middle of a file; declare everything first, then export in a single block at the end.
- If the app needs a single shared instance, create it once and export it: `export const cart = createCart()`.
- If callers each need their own instance, export the factory instead: `export { createOrder }`, and
  let each caller call it.
- Some modules run only for their side effects and nothing imports a value from them — for example a
  Web Worker whose only interface is the messages it sends and receives. Such a factory returns
  nothing; you just call it at the bottom of the file: `createWorker()`.

### Order inside a factory

Order the body so a reader meets the important parts first. This works because `function`
declarations are hoisted, so the public operations can appear above the helpers they call.

1. imports
2. a short JSDoc block describing what the service does — only if it isn't obvious from the code, and
   kept to a sentence or two, no essays
3. state
4. `init` function, if one is needed
5. the main public functions
6. private helpers
7. `init(); return { ...public }`

## Comments

- **Inline comments only for the non-obvious** — genuine gotchas, not narration of what the code
  plainly says. Do not let comments fill half the file.
