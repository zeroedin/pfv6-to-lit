---
name: accessibility
description: Accessibility conventions for web components including ARIA property naming, ElementInternals patterns, FACE (Form-Associated Custom Elements), shadow DOM constraints, and demo cleanup rules. Use when implementing ARIA, form controls, or ElementInternals.
---

# Accessibility Conventions

## ARIA Property Naming

**NEVER use `aria-*` as property/attribute names** — use `accessible-*` instead:

```typescript
// ❌ WRONG
@property({ type: String, attribute: 'aria-label' })
ariaLabel?: string;

// ✅ CORRECT
@property({ type: String, attribute: 'accessible-label' })
accessibleLabel?: string;
```

**Why**: `aria-*` attributes on custom elements don't automatically delegate to shadow DOM elements.

**Exception**: When using ElementInternals, apply via `this.internals.ariaLabel`.

## No IDREF Attributes Across Shadow Boundaries

**NEVER accept** IDREF attributes on public `@property()` decorators that reference across shadow boundaries:

- `aria-labelledby`, `aria-describedby`, `aria-controls`, `aria-activedescendant`, `aria-owns`

**Why**: Shadow DOM creates separate ID namespaces. Use `accessible-label` property instead.

**Exception**: Host-level ElementInternals string IDREFs (`this.#internals.ariaControls`, `ariaLabelledBy`, `ariaDescribedBy`) are valid for cross-root references. See "ElementInternals for Host-Level ARIA" below.

## ElementInternals for Host-Level ARIA

### When to Use Host-Level ARIA

- Component IS a single widget (progressbar, checkbox, switch, slider)
- Component wraps non-semantic elements (div, span, svg)
- Users should be able to add `aria-labelledby` directly to the host

### When Internal ARIA May Be Appropriate

- Component has MULTIPLE accessible children (toolbar, menu)
- `aria-hidden="true"` on decorative internal elements
- Complex composite widgets with internal focus management

### Pattern

```typescript
#internals: ElementInternals;

constructor() {
  super();
  this.#internals = this.attachInternals();
  this.#internals.role = 'progressbar';
}

updated(changedProperties: PropertyValues) {
  if (changedProperties.has('accessibleLabel')) {
    this.#internals.ariaLabel = this.accessibleLabel || 'Contents';
  }
}
```

**Note**: `attachInternals()` works without `static formAssociated = true`. Form association is only needed for form participation.

### No Duplicative Semantics

If ElementInternals sets a role on `:host`, render a generic `<div>` internally — NOT the semantic element:

```typescript
// ❌ WRONG: internals.role = 'navigation' AND <nav> in render()
// ✅ CORRECT: internals.role = 'navigation' AND <div> in render()
```

### No Duplicate ARIA Between Host and Internal Elements

```typescript
// ❌ WRONG: ARIA on both
this.internals.ariaLabel = this.accessibleLabel;
html`<input aria-label=${this.accessibleLabel} />`

// ✅ CORRECT: ARIA only on host
this.internals.ariaLabel = this.accessibleLabel;
html`<input type="checkbox" .checked=${this.checked} />`
```

**Exception**: FACE elements in `formDisabledCallback` — `ariaDisabled` on host is required, not duplicate.

### Valid ElementInternals ARIA Properties

**String properties**: `ariaLabel`, `ariaChecked`, `ariaDisabled`, `ariaExpanded`, `ariaPressed`, `ariaSelected`, `ariaHidden`, `ariaOrientation`, `role`, etc.

**Element reference properties**: `ariaLabelledByElements`, `ariaDescribedByElements`, `ariaControlsElements`, `ariaOwnsElements` (note: plural "Elements" suffix)

**String IDREF properties** (TypeScript 5.9+ removed from types, restored via `declaration.d.ts`):
`ariaControls`, `ariaLabelledBy`, `ariaDescribedBy`

**When to use string IDREFs vs element references:**
- **Same shadow root**: Prefer `ariaControlsElements` (pass element references directly)
- **Cross-root IDREFs** (e.g., toggle referencing a sibling in parent shadow DOM by ID): Use string `ariaControls` — element references can't resolve across shadow boundaries. The type augmentation in `declaration.d.ts` restores these properties for TypeScript.

```typescript
// Same shadow root — use element reference
const target = this.shadowRoot?.querySelector('#content');
this.#internals.ariaControlsElements = target ? [target] : [];

// Cross-root IDREF — use string (sibling element in parent's shadow DOM)
this.#internals.ariaControls = this.contentId ?? null;
```

**INVALID** (common mistakes): Using string IDREFs when element references are available within the same shadow root

### Shadow DOM List Accessibility

When a custom element is slotted inside `<ul>` or `<ol>`, use ElementInternals for the role instead of rendering `<li>` in shadow DOM:

```typescript
this.#internals.role = 'listitem';
// Render <div> not <li> in shadow DOM
```

## FACE (Form-Associated Custom Elements)

### Pattern Selection Decision Tree

```text
Does component have built-in label (renders label with input)?
├── YES (Checkbox, Radio, Switch) → Shadow DOM + FACE
└── NO (TextInput, TextArea, Select) → Light DOM Slot (NO FACE)
```

### Shadow DOM + FACE Requirements

**Setup**:
```typescript
static formAssociated = true;
#internals: ElementInternals;

constructor() {
  super();
  this.#internals = this.attachInternals();
}
```

**Required Properties** (all with `reflect: true`):
- `name` — `@property({ type: String, reflect: true })`
- `value` — `@property({ type: String, reflect: true })` (default `'on'` for checkbox/radio)
- `disabled` — `@property({ type: Boolean, reflect: true })` (NEVER string enum)
- `checked` — `@property({ type: Boolean, reflect: true })` (NEVER string enum)
- `required` — `@property({ type: Boolean, reflect: true })` (NEVER string enum)

### Required Callbacks

```typescript
formResetCallback() {
  this.checked = this.defaultChecked ?? false;
  this.#internals.setFormValue(this.checked ? this.value : null);
}

formDisabledCallback(disabled: boolean) {
  this.disabled = disabled;
  this.#internals.ariaDisabled = disabled ? 'true' : 'false';
}
```

### Form Value Synchronization

```typescript
updated(changedProperties: PropertyValues) {
  super.updated(changedProperties);
  if (changedProperties.has('checked') || changedProperties.has('value')) {
    this.#internals.setFormValue(this.checked ? this.value : null);
  }
}
```

### Shadow DOM Accessibility Checks

- Use static internal IDs (`id="input"`), never derived from host (`id="${this.id}-input"`)
- Labels MUST have `for` attribute: `<label for="input">`
- Descriptions use internal IDREF: `aria-describedby="description"`, not external references
- No cross-root ARIA references

### Shadow DOM Buttons

Buttons inside Shadow DOM need `formAssociated = true` to submit/reset forms:

```typescript
#handleClick = () => {
  const form = this.#internals.form;
  if (form && this.type === 'submit') form.requestSubmit();
  if (form && this.type === 'reset') form.reset();
};
```

## Demo Accessibility Cleanup

### Remove Redundant Roles

Automatically remove roles that duplicate implicit HTML semantics:

| Element | Remove `role=` |
|---------|---------------|
| `<nav>` | `navigation` |
| `<ul>`, `<ol>` | `list` |
| `<button>` | `button` |
| `<a href>` | `link` |
| `<table>` | `table` |

### Remove Duplicative `component` Attributes

When custom element is wrapped in semantic HTML, `component` attribute is redundant:

```html
<!-- ❌ WRONG -->
<li><pfv6-divider component="li"></pfv6-divider></li>

<!-- ✅ CORRECT -->
<li><pfv6-divider></pfv6-divider></li>
```

