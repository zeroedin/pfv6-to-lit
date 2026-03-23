---
name: shadow-dom-css
description: Shadow DOM CSS patterns including box-sizing reset, :host declaration, selector translation, element resets, flat structure, lightdom CSS, and display contents layout integration. Use when writing or editing .css component files.
---

# Shadow DOM CSS

## Mandatory Rules (Every CSS File)

### Box-Sizing Reset (FIRST LINE)

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

**Why**: Shadow DOM defaults to `content-box`; PatternFly expects `border-box`.

### `:host` Declaration

Every component MUST declare display on `:host`:

```css
:host {
  /* 1. Custom properties first */
  --pf-v6-c-component--Color: var(--pf-t--global--text--color--regular, #151515);

  /* 2. Style declarations after */
  display: block; /* or contents, inline, flex, etc. */
}
```

## Selector Translation (BEM → Shadow DOM)

| React (BEM) | Shadow DOM | When |
|-------------|-----------|------|
| `.pf-v6-c-card` | `#container` | ONE element in shadow |
| `.pf-v6-c-card__title` | `#title` | ONE element in shadow |
| `.pf-v6-c-list__item` | `.item` | MANY elements in shadow |
| `.pf-v6-c-card.pf-m-compact` | `#container.compact` | Modifier via classMap |

**In TypeScript** (classMap):
```typescript
classMap({ compact: this.isCompact, rounded: this.isRounded })
// NEVER: classMap({ 'pf-m-compact': this.isCompact })
```

## Forbidden Selectors

- `:host([attribute])` — Prefer `classMap()` for state classes; use only when no alternative exists
- `:host-context()` — Not cross-browser compatible
- `:where()` — Unnecessary specificity management in Shadow DOM
- BEM classes (`.pf-v6-c-*`, `.pf-m-*`) — Use IDs/simple classes
- RTL: Use `:dir(rtl)`, never `:host-context([dir="rtl"])`

## Element-Specific Resets

After box-sizing, add resets ONLY for elements that:
1. Exist in the component's shadow DOM template
2. Appear in the base.css resets below

**Source**: `dev-server/styles/patternfly/base.css`

**Process**: Analyze the component's `render()` method → identify HTML elements → check if they appear below → add ONLY matching resets.

**Elements NOT needing resets**: `div`, `span`, `svg`, `circle`, `path`, `picture`

**Reset reference** (use bare element selectors — never `:where()` in Shadow DOM):

```css
/* Block elements - padding/margin reset */
/* Applies to: p, ol, ul, li, dl, dt, dd, blockquote, figure, fieldset,
   legend, textarea, pre, iframe, hr, h1, h2, h3, h4, h5, h6 */
p, ul, li, hr /* only the elements in your template */ {
  padding: 0;
  margin: 0;
}

/* Headings - font reset */
h1, h2, h3, h4, h5, h6 {
  font-size: 100%;
  font-weight: var(--pf-t--global--font--weight--body--default);
}

/* Lists */
ul {
  list-style: none;
}

/* Form controls */
button, input, select, textarea {
  margin: 0;
  font-family: inherit;
  font-size: 100%;
  line-height: var(--pf-t--global--font--line-height--body);
  color: var(--pf-t--global--text--color--regular);
}

/* Media elements */
img, iframe {
  max-width: 100%;
  height: auto;
}

iframe {
  border: 0;
}

/* Tables */
table {
  border-spacing: 0;
  border-collapse: collapse;
}

td, th {
  padding: 0;
  text-align: start;
}

/* Code/Pre */
code, pre {
  font-family: var(--pf-t--global--font--family--mono);
}

/* Links */
a {
  color: var(--pf-t--global--text--color--link--default);
  text-decoration-line: var(--pf-t--global--text-decoration--link--line--default);
}

a:hover, a:focus {
  color: var(--pf-t--global--text--color--link--hover);
  text-decoration-line: var(--pf-t--global--text-decoration--link--line--hover);
}

/* Cursor */
a, button {
  cursor: pointer;
}
```

Only include selectors for elements present in your component's shadow template. Combine resets for the same element (e.g., `button` gets both form control and cursor resets).

## Form Element Normalize Reset

If component renders `<input>`, `<button>`, `<select>`, or `<textarea>` in shadow DOM:

```css
input {
  margin: 0;
  font-family: inherit;
  font-size: 100%;
  line-height: var(--pf-t--global--font--line-height--body, 1.5);
  color: var(--pf-t--global--text--color--regular, #151515);
}
```

## CSS Structure (CRITICAL)

Selectors are **flat top-level rules**, NOT nested inside `:host`. Shadow DOM scoping already limits selectors to the component's shadow tree.

```css
/* wrong — nesting inside :host */
:host {
  display: block;

  & #container {
    background: red;
  }

  & ::slotted(pfv6-foo) {
    --_var: value;
  }
}
```

```css
/* right — flat top-level selectors */
:host {
  display: block;
}

#container {
  background: red;
}

::slotted(pfv6-foo) {
  --_var: value;
}
```

## Lightdom CSS

**Only needed when** `::slotted()` can't reach (deeply nested, sibling combinators, `:first-child` on slotted):

```css
/* pfv6-{component}-lightdom.css */
pfv6-card {
  & > pfv6-card-title:first-child {
    --_card-title-margin-top: 0;
  }
}
```

**Rules**: ALL selectors scoped to component tag, set CSS variables (not direct styles), no resets.

## Display Contents Pattern

Use `display: contents` for semantically invisible wrappers (Divider, Backdrop, Skeleton, etc.).

### How It Works

The host element becomes transparent to layout — CSS properties on `:host` are ignored. Only inner elements participate in the parent's layout.

**External/parent CSS** sets private variables on the component. **Shadow DOM CSS** consumes them on inner elements.

### Required: Registration in `styles/layout.css`

Component MUST be added to `:is()` selector list for all 7 layout containers:

```css
/* Example registration in styles/layout.css */
.pf-v6-l-flex {
  & > :is(pfv6-divider, pfv6-skeleton, pfv6-your-component) {
    --_layout-order: var(--pf-v6-l-flex--item--Order);
    --_layout-max-width: 100%;
    --_layout-margin-block-start: 0;
    --_layout-margin-block-end: 0;
    --_layout-margin-inline-start: 0;
    --_layout-margin-inline-end: 0;
  }
}
/* Plus direction-specific rules, repeated for all 7 layouts */
```

### Required: Variable Consumption on Inner Elements

Inner elements (hr, div, span, etc.) MUST consume ALL 10 layout variables. Apply these to inner elements, NOT `:host` — display:contents makes `:host` invisible to layout.

| Variable | Purpose |
|----------|---------|
| `--_layout-order` | Flex/Grid ordering |
| `--_layout-max-width` | Width constraints |
| `--_layout-margin-block-start` | Top margin (logical) |
| `--_layout-margin-block-end` | Bottom margin (logical) |
| `--_layout-margin-inline-start` | Left margin (logical, RTL-aware) |
| `--_layout-margin-inline-end` | Right margin (logical, RTL-aware) |
| `--_layout-grid-column-start` | Grid column start |
| `--_layout-grid-column-end` | Grid column end |
| `--_layout-min-width` | Grid min-width |
| `--_layout-min-height` | Grid min-height |

```css
hr,
div {
  order: var(--_layout-order);
  max-width: var(--_layout-max-width);
  margin-block-start: var(--_layout-margin-block-start);
  margin-block-end: var(--_layout-margin-block-end);
  margin-inline-start: var(--_layout-margin-inline-start);
  margin-inline-end: var(--_layout-margin-inline-end);
  grid-column-start: var(--_layout-grid-column-start);
  grid-column-end: var(--_layout-grid-column-end);
  min-width: var(--_layout-min-width);
  min-height: var(--_layout-min-height);
}
```

NEVER use hardcoded margins on `display: contents` components. Register in ALL 7 layouts: Flex, Grid, Gallery, Stack, Level, Split, Bullseye.
