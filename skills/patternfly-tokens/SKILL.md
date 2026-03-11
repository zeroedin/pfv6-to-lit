---
name: patternfly-tokens
description: PatternFly CSS variable and token patterns including public/private variable placement, fallback value derivation, responsive cascades, and mixin patterns. Use when writing or editing .css component files.
---

# PatternFly Tokens

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

**When to create private variables**:
- Parent component needs to control child styling across shadow boundaries
- React uses class-based modifiers that won't exist in shadow DOM
- Bridging display mode differences (drawer/fullscreen/embedded)

### Slotted Component Integration

When parent needs to style slotted children, override PRIVATE variables via `::slotted()`:

```css
::slotted(pfv6-checkbox) {
  --_checkbox-grid-gap: var(--pf-t--global--spacer--sm);
}
```

NEVER override public API variables (`--pf-v6-c-*`) via `::slotted()`.

## Fallback Value Derivation

**ALWAYS derive from token source** (never guess):

1. Read `.cache/patternfly/src/patternfly/base/tokens/tokens-default.scss`
2. Follow the chain to the final value
3. Use final value as fallback

```css
/* Token chain: --pf-t--global--spacer--sm → --pf-t--global--spacer--200 → 0.5rem */
padding: var(--pf-t--global--spacer--sm, 0.5rem); /* from tokens */
padding: var(--pf-t--global--spacer--sm, 8px);    /* wrong — guessed */
```

**Token sources**:
- Default tokens: `.cache/patternfly/src/patternfly/base/tokens/tokens-default.scss`
- Color palette: `.cache/patternfly/src/patternfly/base/tokens/tokens-palette.scss`

## Responsive CSS Variable Cascades

When React SCSS uses the `pf-v6-build-css-variable-stack` mixin, translate to a responsive cascade using media queries.

**The Pattern:**

```css
#container {
  width: var(--pf-v6-c-brand--Width--base);

  /* Base: just default */
  --pf-v6-c-brand--Width--base: var(--pf-v6-c-brand--Width, auto);

  /* sm: check -on-sm, fallback to default */
  @media (min-width: 576px) {
    --pf-v6-c-brand--Width--base: var(--pf-v6-c-brand--Width-on-sm,
      var(--pf-v6-c-brand--Width, auto));
  }

  /* md: check -on-md, -on-sm, default */
  @media (min-width: 768px) {
    --pf-v6-c-brand--Width--base: var(--pf-v6-c-brand--Width-on-md,
      var(--pf-v6-c-brand--Width-on-sm,
        var(--pf-v6-c-brand--Width, auto)));
  }

  /* lg: add -on-lg to the chain */
  @media (min-width: 992px) {
    --pf-v6-c-brand--Width--base: var(--pf-v6-c-brand--Width-on-lg,
      var(--pf-v6-c-brand--Width-on-md,
        var(--pf-v6-c-brand--Width-on-sm,
          var(--pf-v6-c-brand--Width, auto))));
  }

  /* xl: add -on-xl to the chain */
  @media (min-width: 1200px) {
    --pf-v6-c-brand--Width--base: var(--pf-v6-c-brand--Width-on-xl,
      var(--pf-v6-c-brand--Width-on-lg,
        var(--pf-v6-c-brand--Width-on-md,
          var(--pf-v6-c-brand--Width-on-sm,
            var(--pf-v6-c-brand--Width, auto)))));
  }

  /* 2xl: add -on-2xl to the chain */
  @media (min-width: 1450px) {
    --pf-v6-c-brand--Width--base: var(--pf-v6-c-brand--Width-on-2xl,
      var(--pf-v6-c-brand--Width-on-xl,
        var(--pf-v6-c-brand--Width-on-lg,
          var(--pf-v6-c-brand--Width-on-md,
            var(--pf-v6-c-brand--Width-on-sm,
              var(--pf-v6-c-brand--Width, auto))))));
  }
}
```

### Breakpoints

| Name | Value |
|------|-------|
| sm | `576px` |
| md | `768px` |
| lg | `992px` |
| xl | `1200px` |
| 2xl | `1450px` |

### Variable Naming

- `--pf-v6-c-{component}--{Property}` — Default value (no breakpoint)
- `--pf-v6-c-{component}--{Property}-on-sm` — Value at sm breakpoint
- Continue for `-on-md`, `-on-lg`, `-on-xl`, `-on-2xl`

### Rules

- Always include full cascade chain at each breakpoint
- Use exact PatternFly breakpoint values
- Follow mobile-first approach (base → sm → md → lg → xl → 2xl)
- Include final fallback value at the end
- Don't skip breakpoints in the cascade

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
