---
name: css-formatting
description: CSS formatting and linting rules including hex colors, rgba notation, line length, multi-line var() format, stylelint rules, and Baseline compliance. Use when writing or editing .css files.
---

# CSS Formatting

## Hex Color Format

**ALWAYS use long-form hex colors** (stylelint enforces `color-hex-length: "long"`):

- `#0066cc` (correct) not `#06c` (wrong)
- `#ffffff` (correct) not `#fff` (wrong)

## Color Notation: `rgba()` → `rgb()` (CRITICAL)

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
rgb(255 255 255 / 0%)    /* correct */
rgba(255, 255, 255, 0)   /* wrong - legacy notation */

/* Token source: rgba(21, 21, 21, 0.2000) */
rgb(21 21 21 / 20%)      /* correct */
rgba(21, 21, 21, 0.2)    /* wrong - legacy notation */

/* Token source: rgba(41, 41, 41, 0.1500) */
rgb(41 41 41 / 15%)      /* correct */

/* Token source: rgba(199, 199, 199, 0.2500) */
rgb(199 199 199 / 25%)   /* correct */
```

**Note**: This applies ONLY to fallback values in CSS. The token variable names remain unchanged.

## Declaration Order Within Blocks

1. CSS variables (`--*`)
2. Display properties
3. Layout properties
4. Visual properties

Custom properties (`--*`) MUST appear before style declarations in each block (stylelint `order/order` enforces this).

## Line Length (max 100 characters)

**ALL lines MUST be 100 characters or fewer** (stylelint `max-line-length`).

**Use multi-line `var()` format for ANY declaration that would exceed 100 characters:**

```css
/* wrong — exceeds 100 characters */
--pf-v6-c-code-block--BackgroundColor: var(--pf-t--global--background--color--secondary--default, #f2f2f2);

/* right — multi-line format */
--pf-v6-c-code-block--BackgroundColor:
  var(
    --pf-t--global--background--color--secondary--default,
    #f2f2f2
  );
```

**Font-family values**: Each font MUST be on a separate line (`@stylistic/function-comma-newline-after`):

```css
/* wrong — all fonts on one line */
--pf-v6-c-code-block__pre--FontFamily: var(--pf-t--global--font--family--mono, "Red Hat Mono", "RedHatMono", "Courier New", Courier, monospace);

/* right — each font on its own line */
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
/* wrong — triggers @stylistic/declaration-colon-space-after */
--pf-v6-c-code-block--BorderRadius:
  var(--pf-t--global--border--radius--medium, 16px);

/* right — single line (fits under 100 chars) */
--pf-v6-c-code-block--BorderRadius: var(--pf-t--global--border--radius--medium, 16px);
```

## Stylelint Rules

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
