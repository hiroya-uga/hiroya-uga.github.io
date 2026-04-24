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

## Comments

- `//` for implementation notes
- JSDoc for variable/function descriptions
- `// >` for expression results, `// ->` for log output
