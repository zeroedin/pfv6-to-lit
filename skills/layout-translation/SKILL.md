---
name: layout-translation
description: Reference for translating React layout components (Flex, Gallery, Grid, Stack, Bullseye, Level, Split) to HTML with PatternFly CSS classes. Covers prop-to-class mapping, responsive breakpoints, CSS variables, and semantic HTML. Use when demos contain React layout components.
---

# Layout Translation

## Layout Components

| React Component | CSS Base Class | Item Class |
|-----------------|----------------|-----------|
| `Flex` / `FlexItem` | `.pf-v6-l-flex` | None (plain `<div>`) |
| `Gallery` / `GalleryItem` | `.pf-v6-l-gallery` | None (plain `<div>`) |
| `Grid` / `GridItem` | `.pf-v6-l-grid` | `.pf-v6-l-grid__item` |
| `Stack` / `StackItem` | `.pf-v6-l-stack` | `.pf-v6-l-stack__item` |
| `Bullseye` | `.pf-v6-l-bullseye` | None |
| `Level` / `LevelItem` | `.pf-v6-l-level` | `.pf-v6-l-level__item` |
| `Split` / `SplitItem` | `.pf-v6-l-split` | `.pf-v6-l-split__item` |

**NEVER create custom elements** — always translate to `<div>` (or semantic element) with CSS classes.

**Light DOM only** — layout classes don't work in Shadow DOM.

## Prop Transformation Rules

### Rule 1: Simple String → `pf-m-{kebab-case}`

| React Prop | CSS Class |
|------------|-----------|
| `direction="column"` | `pf-m-column` |
| `direction="columnReverse"` | `pf-m-column-reverse` |
| `gap="gapMd"` | `pf-m-gap-md` |
| `spaceItems="spaceItemsLg"` | `pf-m-space-items-lg` |

### Rule 2: Boolean → `pf-m-{stripped}`

| React Prop | CSS Class |
|------------|-----------|
| `hasGutter` | `pf-m-gutter` |
| `isInline` | `pf-m-inline` |
| `isFilled` | `pf-m-fill` |

### Rule 3: Responsive Object → Breakpoint Suffixes

```tsx
direction={{ default: 'column', md: 'row', lg: 'column' }}
```
→ `pf-m-column pf-m-row-on-md pf-m-column-on-lg`

- `default` key → base modifier (no suffix)
- Breakpoint keys (`sm`, `md`, `lg`, `xl`, `2xl`) → `-on-{breakpoint}` suffix

### Rule 4: Custom Values → CSS Variables

```tsx
<Gallery minWidths={{ default: '200px', md: '250px', xl: '300px' }} />
```
```html
<div class="pf-v6-l-gallery" style="--pf-v6-l-gallery--GridTemplateColumns--min: 200px; --pf-v6-l-gallery--GridTemplateColumns--min-on-md: 250px; --pf-v6-l-gallery--GridTemplateColumns--min-on-xl: 300px;"></div>
```

### Rule 5: `component` Prop → Semantic Element

```tsx
<Flex component="ul">
  <FlexItem component="li">Item</FlexItem>
</Flex>
```
```html
<ul class="pf-v6-l-flex">
  <li>Item</li>
</ul>
```

## Class Order Convention

1. Base layout class (`.pf-v6-l-flex`)
2. Direction modifiers (`pf-m-column`, `pf-m-row-on-md`)
3. Spacing modifiers (`pf-m-gap-md`)
4. Alignment modifiers (`pf-m-align-items-center`)
5. Other modifiers (`pf-m-gutter`, `pf-m-inline`)

## Grid Special Cases

**Grid span** (on Grid container):
```tsx
<Grid span={6} md={4} lg={3}>
```
→ `pf-v6-l-grid pf-m-all-6-col pf-m-all-4-col-on-md pf-m-all-3-col-on-lg`

**GridItem span** (on items):
```tsx
<GridItem span={6} rowSpan={2}>
```
→ `pf-v6-l-grid__item pf-m-6-col pf-m-2-row`

## Flex Special Cases

**Individual item spacer**:
```tsx
<FlexItem spacer={{ default: 'spacerMd' }}>
```
→ `<div class="pf-m-spacer-md">`

**Align on item**:
```tsx
<FlexItem align={{ default: 'alignRight' }}>
```
→ `<div class="pf-m-align-right">`

## Display Contents Components

Custom elements with `display: contents` (e.g., `pfv6-divider`) work directly in layouts via CSS variable integration — no wrapper needed.

## Authoritative Sources

- **React props**: `.cache/patternfly-react/packages/react-core/src/layouts/{Layout}/{Layout}.tsx`
- **CSS classes**: `.cache/patternfly/src/patternfly/layouts/{Layout}/examples/{Layout}.md` (Documentation section)

