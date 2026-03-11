---
name: lit-conventions
description: Lit framework conventions backed by Lit documentation. Covers @property/@state decorators, template binding, directives, lifecycle hooks, context, and Shadow DOM options. Use when writing or editing .ts component files.
---

# Lit Conventions

## Properties & State

### @property decorator
Declares reactive properties that trigger re-render when changed.

```typescript
@property({ type: String, reflect: true }) variant = 'default';
@property({ type: Boolean, reflect: true }) disabled = false;
@property({ type: Number }) count = 0;
```

Options:
- `type` — Conversion hint for attribute ↔ property (`String`, `Boolean`, `Number`)
- `reflect: true` — Sync property changes back to HTML attribute
- `attribute` — Custom attribute name (`attribute: 'my-prop'`), defaults to lowercase
- `converter` — Custom attribute ↔ property conversion logic

### @state decorator
Internal reactive state. Not exposed as attribute, not part of public API.

```typescript
@state() private _expanded = false;
```

### Boolean properties
`type: Boolean` handles HTML boolean attribute semantics:
- `<el disabled>` → `true` (attribute present)
- `<el>` → `false` (attribute absent)
- `<el disabled="false">` → `true` (any value = present = true)

### String union properties
Use TypeScript union types with `type: String`:

```typescript
@property({ type: String }) size: 'sm' | 'md' | 'lg' = 'md';
```

## Template Binding

Lit uses tagged template literals (`html``) with binding expressions:

| Syntax | Purpose | Example |
|--------|---------|---------|
| `${expr}` | Text content | `<p>${this.name}</p>` |
| `attr=${expr}` | Set attribute | `<img src=${this.url}>` |
| `?attr=${expr}` | Toggle boolean attribute | `?disabled=${this.disabled}` |
| `.prop=${expr}` | Set JS property | `.value=${this.val}` |
| `@event=${handler}` | Add event listener | `@click=${this.#onClick}` |

## Directives

Import individually from `lit/directives/`:

| Directive | Import | Purpose |
|-----------|--------|---------|
| `ifDefined(val)` | `lit/directives/if-defined.js` | Remove attribute when `undefined` |
| `classMap(obj)` | `lit/directives/class-map.js` | Conditional CSS classes |
| `repeat(items, keyFn, tplFn)` | `lit/directives/repeat.js` | Keyed list rendering |
| `choose(val, cases)` | `lit/directives/choose.js` | Switch-like rendering |
| `when(cond, trueCase, falseCase)` | `lit/directives/when.js` | Conditional rendering |
| `nothing` | `lit` | Render nothing (remove content) |

### ifDefined usage
Prevents rendering `"undefined"` string as attribute value:

```typescript
html`<div aria-label=${ifDefined(this.label)}>` // omits attr when undefined
```

### classMap usage
Conditional class application from an object:

```typescript
const classes = { active: this.isActive, disabled: this.disabled };
html`<div class=${classMap(classes)}>`;
```

## Lifecycle Methods

Called in this order during updates:

1. **`connectedCallback()`** — Element added to DOM. Always call `super.connectedCallback()`.
2. **`willUpdate(changedProperties: PropertyValues)`** — Before render. For sync computations derived from properties. No DOM access.
3. **`render()`** — Return `html`` template. Must be pure (no side effects).
4. **`firstUpdated(changedProperties: PropertyValues)`** — After first render only. For one-time DOM setup.
5. **`updated(changedProperties: PropertyValues)`** — After every render. For side effects triggered by property changes.
6. **`disconnectedCallback()`** — Element removed from DOM. Cleanup listeners/observers.

### PropertyValues
Use `changedProperties.has('propName')` to check what changed:

```typescript
import type { PropertyValues } from 'lit';

updated(changedProperties: PropertyValues) {
  super.updated(changedProperties);
  if (changedProperties.has('isOpen')) {
    // React to isOpen change
  }
}
```

## @lit/context

Share state between parent and child components across shadow boundaries.

```typescript
import { createContext, provide, consume } from '@lit/context';

// Define context
export const myContext = createContext<MyState>(Symbol('my-context'));

// Parent provides (use getter for reactivity)
@provide({ context: myContext })
private get ctx(): MyState { return { ... }; }

// Child consumes (subscribe: true for live updates)
@consume({ context: myContext, subscribe: true })
private myCtx?: MyState;
```

**`ContextConsumer` class** — Use for slotted content where timing is an issue:

```typescript
connectedCallback() {
  super.connectedCallback();
  queueMicrotask(() => {
    this.#consumer = new ContextConsumer(this, {
      context: myContext, subscribe: true,
      callback: (value) => { this.myCtx = value; }
    });
  });
}
```

## Shadow DOM

### Focus delegation
For interactive components, delegate focus to the first focusable element:

```typescript
static override readonly shadowRootOptions: ShadowRootInit = {
  ...LitElement.shadowRootOptions,
  delegatesFocus: true,
};
```

### Adopted stylesheets
Import CSS and assign to `static styles`:

```typescript
import styles from './my-component.css';

static styles = [styles];
```

### Event composition
Set `composed: true` on events that need to cross shadow boundaries:

```typescript
new Event('change', { bubbles: true, composed: true });
```

