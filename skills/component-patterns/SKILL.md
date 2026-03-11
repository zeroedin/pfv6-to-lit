---
name: component-patterns
description: pfe-v6 component patterns including naming conventions, import ordering, module specifiers, template rules, event patterns, and anti-patterns. Use when writing or editing .ts component files alongside lit-conventions.
---

# pfe-v6 Component Patterns

## Naming

- Tag prefix: `pfv6-`
- Class name: `Pfv6{ComponentName}` (PascalCase)
- Files: `pfv6-{component-name}.ts` (kebab-case)
- Directories: `elements/pfv6-{component}/`
- Sub-components: `pfv6-{component}-{sub}.ts`

## Import Order (CRITICAL)

```typescript
// 1. Lit core
import { LitElement, html } from 'lit';

// 2. Type-only imports
import type { PropertyValues } from 'lit';

// 3. Decorators (individual paths)
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';

// 4. Directives (individual paths)
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';

// 5. Sub-component side-effect imports
import './pfv6-card-header.js';
import './pfv6-card-body.js';

// 6. Styles (ALWAYS LAST)
import styles from './pfv6-card.css';
```

**NEVER** batch import: `from 'lit/decorators.js'` or `from 'lit/directives.js'`
**NEVER** use: `with { type: 'css' }` on CSS imports
**NEVER** import types as values: `import { PropertyValues }` → use `import type`

## Module Specifiers

- **External components**: `@pfv6/elements/pfv6-{component}/pfv6-{component}.js`
- **Sub-components**: relative `./pfv6-{sub}.js`
- **NEVER**: `@patternfly/elements/...` (wrong scope — the scope is `@pfv6`)

## Template Rules

- **No BEM classes** (`pf-v6-c-*`, `pf-m-*`) in Shadow DOM `html`` templates
- **Use `id`** for static wrapper elements, `classMap` for conditional variants
- **Never fragment** `render()` into private sub-methods
- **Never use** dynamic tag names (use ternaries instead)
- **`slotchange`** handler goes on `<slot>` element, not parent element
- **HTML attribute names** in templates: `for` not `htmlFor`, `class` not `className`

## Property Rules

- **ARIA props**: Use `accessible-*` attribute names, never `aria-*` as property/attribute names
- **Don't redefine** inherited `HTMLElement` properties (`id`, `title`, `tabindex`) unless reactive behavior is needed in `render()`
- **Avoid** `@property({ type: Object })` or `@property({ type: Array })` — prefer slots and primitive props
- **Boolean props**: Use `@property({ type: Boolean, reflect: true })` — covers 99% of cases
- **Camelcase attributes**: Multi-word props get kebab-case attribute: `isCompact` → `attribute: 'is-compact'`

### String Enum Converter

Only use `'true' | 'false'` string type when the type is explicitly a string literal (not a boolean). Add a converter so HTML boolean attribute syntax still works:

```typescript
@property({
  type: String, reflect: true, attribute: 'some-flag',
  converter: {
    fromAttribute: (value: string | null) => {
      if (value === null) return 'false';
      if (value === '' || value === 'true') return 'true';
      return 'false';
    }
  }
})
someFlag: 'true' | 'false' = 'false';
```

### Responsive Property Converter

Use a string-based attribute with `responsivePropertyConverter` instead of `@property({ type: Object })`:

```typescript
import { responsivePropertyConverter } from '../../lib/converters.js';

@property({ converter: responsivePropertyConverter })
inset?: string;

// HTML: <pfv6-divider inset="md md:lg lg:xl xl:2xl"></pfv6-divider>
```

Pattern: `value breakpoint:value breakpoint:value`
- First value (no prefix) = default
- `breakpoint:value` = value at that breakpoint

## Event Pattern

```typescript
// Define event class in SAME file as component (never separate files)
export class Pfv6CardExpandEvent extends Event {
  constructor(
    public expanded: boolean,
    public id?: string,
  ) {
    super('expand', { bubbles: true, composed: true });
  }
}

// Register for type safety
declare global {
  interface HTMLElementEventMap {
    'expand': Pfv6CardExpandEvent;
  }
}
```

- Extend `Event`, **not** `CustomEvent`
- Data as public constructor parameters (class fields), not `detail`
- Always set `bubbles: true, composed: true`
- Export event class from main component file

## File Structure

- **No `index.ts`** barrel exports
- **No separate** event class files
- **No separate** type files
- Main component **auto-imports** all sub-components
- Event classes go **before** the component class in the same file

## Anti-Patterns

- **No `console.*`** statements (log, warn, error, debug, info)
- **No `:host` style manipulation** in JS (`this.style.*`)
- **No Light DOM manipulation** (`createElement`, `appendChild`, `innerHTML`)
- **No imperative Shadow DOM manipulation** (`createElement`, `appendChild`, `insertBefore`, `remove()` in Shadow DOM) — use `@state()` + conditional rendering instead (see below)
- **No `part` attributes** unless explicitly requested
- **No dynamic tag names** — use ternaries for conditional element types
- **No custom ID generation** — use `getRandomId(prefix)` from `@patternfly/pfe-core/functions/random.js`
- **No `static #privateFields`** on decorated classes — incompatible with `experimentalDecorators`

## Conditional Shadow DOM Sections (CRITICAL)

When parts of the shadow DOM should appear/disappear based on slotted content (e.g., a header that only renders when actions are slotted), **always render the full structure** and use the `?hidden` boolean attribute binding to hide the empty wrapper. **NEVER** use imperative DOM manipulation, and **avoid** ternaries that duplicate the `<slot>` across branches.

> **Lit docs reference**: *"Use the standard `hidden` attribute to hide the content without removing it from the page."* — [Lit for Polymer users](https://lit.dev/articles/lit-for-polymer-users/)

### Why not use a ternary around the slot?

When a `<slot>` moves between ternary branches, Lit destroys one `<slot>` DOM node and creates another. This causes `slotchange` to fire **twice** (once for removal, once for re-addition) and makes the template harder to reason about. The slot element should be **stable** in the DOM so `slotchange` fires reliably.

> **MDN**: *"The `slotchange` event is fired on an `HTMLSlotElement` when the node(s) contained in that slot change."* Destroying and recreating the slot element itself is a separate DOM mutation from assigning content to it. — [MDN: slotchange event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLSlotElement/slotchange_event)

```typescript
// ❌ WRONG — imperative DOM manipulation in Shadow DOM
#handleActionsSlotChange(event: Event) {
  const slot = event.target as HTMLSlotElement;
  if (slot.assignedElements().length > 0) {
    const header = document.createElement('div');
    header.id = 'header';
    this.shadowRoot?.querySelector('#container')?.insertBefore(header, ...);
  } else {
    this.shadowRoot?.querySelector('#header')?.remove();
  }
}
```

```typescript
// ❌ WRONG — ternary that duplicates the slot across branches
@state() private _hasActions = false;

render() {
  return html`
    <div id="container">
      ${this._hasActions ? html`
        <div id="header">
          <slot name="actions" @slotchange=${this.#handleSlotChange}></slot>
        </div>
      ` : html`
        <slot name="actions" @slotchange=${this.#handleSlotChange} hidden></slot>
      `}
    </div>
  `;
}
// Problems:
// - Slot is destroyed/recreated on toggle (two different DOM nodes)
// - slotchange fires twice per toggle (remove from old + add to new)
// - Two copies of the slot in template — confusing and error-prone
```

```typescript
// ✅ RIGHT — always render structure, use ?hidden to toggle visibility
@state() private _hasActions = false;

render() {
  return html`
    <div id="container">
      <div id="header" ?hidden=${!this._hasActions}>
        <div id="actions-wrapper">
          <slot name="actions" @slotchange=${this.#handleSlotChange}></slot>
        </div>
      </div>
      <div id="content">
        <slot></slot>
      </div>
    </div>
  `;
}

#handleSlotChange(event: Event) {
  const slot = event.target as HTMLSlotElement;
  this._hasActions = slot.assignedElements().length > 0;
}
```

**CSS file** must include a `[hidden]` rule — the `hidden` attribute alone does nothing if the element has an explicit `display` value in CSS (author styles override the browser default):
```css
[hidden] {
  display: none !important;
}
```

**Key points:**
- **One slot, one location** — the slot never moves in the DOM
- `slotchange` fires reliably because the slot element is stable
- `?hidden` is Lit's idiomatic boolean attribute binding — adds/removes the `hidden` attribute
- `@state()` drives the toggle reactively — no imperative DOM manipulation
- **`[hidden]` requires CSS** — without `[hidden] { display: none !important; }`, elements with explicit `display` values (e.g. `display: flex`) will remain visible
- Ternaries in templates should be reserved for cases where different DOM structures are genuinely needed, not for show/hide

