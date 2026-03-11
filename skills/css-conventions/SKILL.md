---
name: css-conventions
description: CSS conventions for Shadow DOM components including variable placement, selector translation, fallback values, Baseline compliance, and nesting rules. Use when writing or editing .css component files.
---

# CSS Conventions

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

Every component MUST declare display on `:host`. **Custom properties MUST appear before style declarations** (stylelint `order/order` enforces this):

```css
:host {
  /* 1. Custom properties first */
  --pf-v6-c-component--Color: var(--pf-t--global--text--color--regular, #151515);
  --pf-v6-c-component--Padding: var(--pf-t--global--spacer--md, 1rem);

  /* 2. Style declarations after */
  display: block; /* or contents, inline, flex, etc. */
}
```

### Hex Color Format

**ALWAYS use long-form hex colors** (stylelint enforces `color-hex-length: "long"`):

- `#0066cc` (correct) not `#06c` (wrong)
- `#ffffff` (correct) not `#fff` (wrong)

### Color Notation: `rgba()` → `rgb()` (CRITICAL)

PatternFly token source files use legacy `rgba()` notation (e.g., `rgba(255, 255, 255, 0.0000)`). **ALWAYS convert to modern `rgb()` notation** in our CSS files. Stylelint enforces this.

**Conversion rules:**
- `rgba(R, G, B, A)` → `rgb(R G B / A%)`
- Alpha `0.0000` → `0%`
- Alpha `0.2000` → `20%`
- Alpha `0.1500` → `15%`
- Alpha `0.5000` → `50%`
- Alpha `1` or `1.0000` → omit alpha entirely (just `rgb(R G B)`)

```css
/* Token source: rgba(255, 255, 255, 0.0000) */
rgb(255 255 255 / 0%)    /* ✅ correct */
rgba(255, 255, 255, 0)   /* ❌ wrong - legacy notation */

/* Token source: rgba(21, 21, 21, 0.2000) */
rgb(21 21 21 / 20%)      /* ✅ correct */
rgba(21, 21, 21, 0.2)    /* ❌ wrong - legacy notation */

/* Token source: rgba(41, 41, 41, 0.1500) */
rgb(41 41 41 / 15%)      /* ✅ correct */

/* Token source: rgba(199, 199, 199, 0.2500) */
rgb(199 199 199 / 25%)   /* ✅ correct */
```

**Note**: This applies ONLY to fallback values in CSS. The token variable names remain unchanged.

## CSS Variable Placement (CRITICAL)

### Public Variables on `:host`

**Public CSS variables** (`--pf-v6-c-{component}--*`) **MUST be on `:host`**:

```css
:host {
  --pf-v6-c-card--BorderRadius: var(--pf-t--global--border--radius--md, 8px);
  --pf-v6-c-card--Padding: var(--pf-t--global--spacer--md, 1rem);
}

#container {
  /* Consume (not declare) public variables */
  border-radius: var(--pf-v6-c-card--BorderRadius);
  padding: var(--pf-v6-c-card--Padding);
}
```

**Why**: Users override via `<pfv6-card style="--pf-v6-c-card--Padding: 2rem;">`. Variables on `#container` are in shadow DOM and unreachable from outside.

### Private Variables on Internal Selectors

Private variables (`--_{component}-{property}`) go on internal selectors:

```css
::slotted(pfv6-card-header) {
  --_card-header-padding: var(--pf-v6-c-card--Padding);
}
```

**Pattern**: `--_{component-name}-{property-name}` (leading underscore, kebab-case, no vendor prefixes)

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

- `:host([attribute])` — Use `classMap()` for state classes
- `:host-context()` — Not cross-browser compatible
- `:where()` — Unnecessary specificity management in Shadow DOM
- BEM classes (`.pf-v6-c-*`, `.pf-m-*`) — Use IDs/simple classes
- RTL: Use `:dir(rtl)`, never `:host-context([dir="rtl"])`

## Fallback Value Derivation

**ALWAYS derive from token source** (never guess):

1. Read `.cache/patternfly/src/patternfly/base/tokens/tokens-default.scss`
2. Follow the chain to the final value
3. Use final value as fallback

```css
/* Token chain: --pf-t--global--spacer--sm → --pf-t--global--spacer--200 → 0.5rem */
padding: var(--pf-t--global--spacer--sm, 0.5rem); /* ✅ from tokens */
padding: var(--pf-t--global--spacer--sm, 8px);    /* ❌ guessed */
```

## Element-Specific Resets

After box-sizing, add resets ONLY for elements that:
1. Exist in the component's shadow DOM template
2. Appear in PatternFly's base.css resets

```css
/* If template has <button> — bare element selector, top-level */
button {
  margin: 0;
  font-family: inherit;
  font-size: 100%;
  line-height: var(--pf-t--global--font--line-height--body);
  color: var(--pf-t--global--text--color--regular);
  cursor: pointer;
}
```

**NEVER use `:where()` in Shadow DOM** — specificity management is unnecessary in isolated scope.

**Source**: `dev-server/styles/patternfly/base.css`

**Elements NOT in base.css** (no resets needed): `div`, `span`, `svg`, `circle`, `path`, `picture`

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

**Note**: In Shadow DOM, do NOT use `:where()` wrapper — specificity management is unnecessary in isolated scope.

## CSS Structure (CRITICAL)

Selectors are **flat top-level rules**, NOT nested inside `:host`. Shadow DOM scoping already limits selectors to the component's shadow tree.

```css
/* ❌ WRONG — nesting inside :host */
:host {
  display: block;

  & #container {
    background: red;

    & #header {
      display: flex;
    }
  }

  & ::slotted(pfv6-foo) {
    --_var: value;
  }
}
```

```css
/* ✅ RIGHT — flat top-level selectors */
:host {
  display: block;
}

#container {
  background: red;
}

#header {
  display: flex;
}

::slotted(pfv6-foo) {
  --_var: value;
}
```

**Declaration order within a block:**
1. CSS variables (`--*`)
2. Display properties
3. Layout properties
4. Visual properties

## Line Length (max 100 characters)

**ALL lines MUST be 100 characters or fewer** (stylelint `max-line-length`).

**Use multi-line `var()` format for ANY declaration that would exceed 100 characters:**

```css
/* ❌ WRONG — exceeds 100 characters */
--pf-v6-c-code-block--BackgroundColor: var(--pf-t--global--background--color--secondary--default, #f2f2f2);

/* ✅ RIGHT — multi-line format */
--pf-v6-c-code-block--BackgroundColor:
  var(
    --pf-t--global--background--color--secondary--default,
    #f2f2f2
  );
```

**Font-family values**: Each font MUST be on a separate line (`@stylistic/function-comma-newline-after`):

```css
/* ❌ WRONG — all fonts on one line */
--pf-v6-c-code-block__pre--FontFamily: var(--pf-t--global--font--family--mono, "Red Hat Mono", "RedHatMono", "Courier New", Courier, monospace);

/* ✅ RIGHT — each font on its own line */
--pf-v6-c-code-block__pre--FontFamily:
  var(
    --pf-t--global--font--family--mono,
    "Red Hat Mono",
    "RedHatMono",
    "Courier New",
    Courier,
    monospace
  );
```

**Decision rule** — for every custom property declaration:
1. Write as single line first
2. If ≤ 100 characters → MUST keep on one line
3. If > 100 characters → MUST use multi-line `var()` format

You MUST NOT break a declaration across lines without using multi-line `var()` format:

```css
/* ❌ WRONG — triggers @stylistic/declaration-colon-space-after */
/* The colon is followed by a newline, but the value is NOT in multi-line var() format */
--pf-v6-c-code-block--BorderRadius:
  var(--pf-t--global--border--radius--medium, 16px);

/* ✅ RIGHT — single line (fits under 100 chars) */
--pf-v6-c-code-block--BorderRadius: var(--pf-t--global--border--radius--medium, 16px);
```

## Stylelint Rules

- Custom properties (`--*`) MUST appear before style declarations in each block
- No `/* stylelint-disable */` comments — format CSS to satisfy rules naturally
- Multi-line `var()`: newline after colon, `var(` on next line:

```css
--property-name:
  var(
    --css-variable-reference,
    fallback-value
  );
```

## Baseline Compliance (CRITICAL)

**All CSS features MUST be Baseline 2024 or earlier.**

**Safe** (Baseline 2024): CSS nesting, `@container`, `:has()`, `subgrid`, `color-mix()`, `text-wrap: balance`, `@layer`, `:dir()`

**Forbidden** (non-Baseline): `anchor-name`, `position-anchor`, `@view-transition`, scroll-driven animations, relative color syntax (`oklch(from ...)`)

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

**Rules**: ALL selectors scoped to component tag, set CSS variables (not direct styles), no resets

## Display Contents Pattern

When `:host { display: contents; }`:
- External CSS sets private variables on the component
- Shadow DOM CSS consumes them on inner elements
- Inner elements (not `:host`) get layout styles
- Must register in `styles/layout.css` for all 7 layout containers
- Must consume all 10 layout variables on inner elements

## Responsive CSS Variable Cascades

When React uses `pf-v6-build-css-variable-stack` mixin:

```css
#container {
  width: var(--pf-v6-c-brand--Width--base);
  --pf-v6-c-brand--Width--base: var(--pf-v6-c-brand--Width, auto);

  @media (min-width: 576px) {
    --pf-v6-c-brand--Width--base: var(--pf-v6-c-brand--Width-on-sm,
      var(--pf-v6-c-brand--Width, auto));
  }
  /* Continue for md(768), lg(992), xl(1200), 2xl(1450) */
}
```

## PatternFly Mixin Patterns

Copy exactly from `.cache/patternfly/src/patternfly/sass-utilities/mixins.scss`. Never reimplement.

**Screen reader pattern** (from `@mixin pf-v6-u-screen-reader`):
```css
.screen-reader {
  position: fixed;
  inset-block-start: 0;
  inset-inline-start: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

