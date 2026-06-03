# Code Style

## Negation

Avoid `!`. Use explicit comparisons. Ban `==`/`!=`.

```ts
// Bad
if (!value) {
}
if (value == null) {
}
// Good
if (value === null) {
}
if (value === undefined) {
}
if (value !== null) {
}
if (condition === false) {
}
```

## Numeric comparison

Always write smaller value on the left: `value < 100` ✓, `100 > value` ✗

## Braces

Never omit braces except in arrow functions and `switch case`. Single-line `if` returns are forbidden.

```ts
// Bad
if (condition) return;
// Good
if (condition) {
  return;
}
```

## Functions

Prefer arrow functions over `function` declarations. Use object destructuring for 3+ params.

```ts
// Bad
const hoge = (a, b, c) => {};
// Good
const hoge = ({ a, b, c }) => {};
```

## Event handler naming

| Name         | Use                                                 |
| ------------ | --------------------------------------------------- |
| `onHoge`     | Receives `event` object, or component prop callback |
| `handleHoge` | Internal handler, no `event` object                 |

## Form control font size

`<input>` / `<textarea>` must use `text-base` (16px) or larger. Smaller sizes trigger iOS Safari auto-zoom on focus.

## JSX string interpolation with units

Use template literals when appending units to a value in JSX.

```tsx
// Bad
{
  fl;
}
mm;
// Good
{
  `${fl}mm`;
}
```

## Refs

`useRef` variables must use a `Ref` suffix.

```ts
// Bad
const video = useRef(null);
// Good
const videoRef = useRef(null);
```

## Callback parameter naming

Use descriptive names, not single letters.

```ts
// Bad
SENSOR_FORMATS.find((f) => f.id === id);
// Good
SENSOR_FORMATS.find((item) => item.id === id);
```

## Re-exports

A symbol must have a single canonical import path: the module that defines it (or a dedicated barrel `index.ts` that exposes it as the public API). Regular implementation modules must not re-export symbols they don't define — neither via `import` + `export`, nor via `export ... from`. Otherwise the same symbol becomes importable from multiple paths, fragmenting grep, refactor, and navigation.

```ts
// Bad: middle.ts uses foo internally but exposes it as if it owns it
// middle.ts
import { foo } from './foo';
export { foo };
export const bar = () => foo() + 1;

// Bad: same problem, just different syntax
// middle.ts
export { foo } from './foo';
export const bar = () => /* ... */;

// Good
// middle.ts
import { foo } from './foo';
export const bar = () => foo() + 1;

// Good (barrel `index.ts` is the only place that may re-export)
// index.ts
export * from './foo';
export * from './middle';
```

## Comments

- `//` for implementation notes
- JSDoc for variable/function descriptions
- `// >` for expression results, `// ->` for log output
