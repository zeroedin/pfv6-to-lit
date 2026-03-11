---
name: react-to-lit
description: Reference for translating React component APIs to LitElement equivalents. Covers props to properties, children to slots, callbacks to events, context, useEffect, and HTML structural constraints. Use when converting PatternFly React components.
---

# React to Lit Translation

## Props to Properties

### Type Mapping

| React Type | Lit Pattern |
|-----------|-------------|
| `string` | `@property({ type: String })` |
| `number` | `@property({ type: Number })` |
| `boolean` | `@property({ type: Boolean, reflect: true })` |
| `'variant1' \| 'variant2'` | `@property({ type: String, reflect: true })` with TS union type |
| `ReactNode` (children) | Slot (see Children to Slots) |
| `(event) => void` (callback) | Event class (see Callbacks to Events) |
| `Object / Array` | **AVOID** — use slots or primitive props instead |

### Naming

- React: `isCompact` → Lit property: `isCompact`, attribute: `is-compact`
- React: `isDisabled` / `isChecked` → Lit: `disabled` / `checked` (use HTML spec names for FACE)

### Inherited Properties

**NEVER redefine** `id`, `title`, `lang`, `dir`, `tabindex` — they already exist on `HTMLElement`.

**ONLY redefine when reactive behavior is required** (used in `render()` or `updated()`):

```typescript
// role needs reactivity because it's used in render()
@property({ type: String })
declare role: string | null;
```

### Boolean vs String Enum

Default to boolean. Only use string enum when React's type is explicitly `'true' | 'false'` (not a boolean).

### Responsive Properties

When React uses objects for responsive breakpoints (e.g., `{ default: 'sm', md: 'lg' }`), translate to `responsivePropertyConverter`.

## Children to Slots

| React Pattern | Lit Pattern |
|--------------|-------------|
| `children` (simple content) | Default slot `<slot></slot>` |
| Named prop (`actions={<Button/>}`) | Named slot `<slot name="actions"></slot>` |
| Sub-components (`<CardTitle>`) | Create `pfv6-{component}-{sub}` elements, use default slot |

```tsx
// React: <Card actions={<Button>Act</Button>}><CardBody>Content</CardBody></Card>

// Lit template:
render() {
  return html`
    <div id="container">
      <div id="header"><slot name="actions"></slot></div>
      <slot></slot>
    </div>
  `;
}

// Lit usage:
// <pfv6-card>
//   <button slot="actions">Act</button>
//   <pfv6-card-body>Content</pfv6-card-body>
// </pfv6-card>
```

## Callbacks to Events

| React | Lit |
|-------|-----|
| `onExpand` | Event name `expand` |
| `onClick` | Event name `click` |
| `onChange` | Event name `change` |

Event classes go in the **same file** as the component, before the class declaration.

## Context (createContext / useContext)

**When to use**: Any time React uses `createContext()` / `Context.Provider` / `useContext()`.

**Detection — look for these in React source**:
```tsx
const CardContext = createContext<CardContextProps>({});
// or
<CardContext.Provider value={{ isExpanded, toggleExpand }}>
// or
const { isExpanded } = useContext(CardContext);
```

**Translation**: Use `@lit/context` with `createContext`, `@provide`, `@consume`. Use `ContextConsumer` class for slotted content where timing is an issue.

## useEffect to Lifecycle

| React Pattern | Lit Equivalent |
|--------------|----------------|
| `useEffect(fn, [])` (empty deps) | `firstUpdated()` |
| `useEffect(fn, [dep1, dep2])` | `updated()` with `changedProperties.has()` checks |
| `useEffect(() => cleanup, [])` | Cleanup in `disconnectedCallback()` |

**Key rule**: Translate ALL dependencies — missing a dependency is a bug.

## React Component Imports

**Check if React imports other PatternFly components.** If so, use the corresponding `pfv6-*` component — do NOT reimplement.

```typescript
// WRONG - React uses <Button> but Lit reimplements with div
render() {
  return html`<div tabindex="0" role="button">...</div>`;
}

// CORRECT - Use pfv6-button just like React uses Button
import '@pfv6/elements/pfv6-button/pfv6-button.js';
render() {
  return html`<pfv6-button variant="stateful">...</pfv6-button>`;
}
```

## HTML Structural Validity

Web components CANNOT violate HTML parent-child constraints. Custom elements stay as `<pfv6-*>` in the DOM — they don't compile to native elements like React JSX does.

**React's `component` prop — DO NOT IMPLEMENT**:

```typescript
// NEVER create a `component` property that changes element type
@property({ type: String })
component: 'hr' | 'li' | 'div' = 'hr';
```

**Why**: `<ul><pfv6-divider component="li"></pfv6-divider></ul>` is still invalid HTML. The custom element doesn't become an `<li>`.

**Solution**: Users wrap with semantic HTML:

```html
<ul>
  <li>Item 1</li>
  <li><pfv6-divider></pfv6-divider></li>
  <li>Item 2</li>
</ul>
```

## Form Control Decision

| Question | Result |
|----------|--------|
| Not a form control? | Pattern C — no FACE |
| Has built-in `label` prop? (Checkbox, Radio, Switch) | Pattern A — Shadow DOM + FACE |
| Uses external labels? (TextInput, TextArea, Select) | Pattern B — Light DOM slot, NO FACE |

