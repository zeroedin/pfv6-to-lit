---
name: style-translation
description: Reference for translating React styling components (Content, Title, Form, DescriptionList) to semantic HTML with PatternFly CSS classes. Covers wrapper vs specific element modes, size modifiers, form patterns, and description list structure. Use when demos contain React styling components.
---

# Style Translation

**Styling components** translate to semantic HTML + CSS classes, NOT custom elements.

## Content Component

### Wrapper Mode (no `component` prop)

```tsx
<Content>
  <h1>Title</h1>
  <p>Text</p>
</Content>
```
```html
<div class="pf-v6-c-content">
  <h1>Title</h1>
  <p>Text</p>
</div>
```

### Specific Element Mode (with `component` prop)

```tsx
<Content component="h1">Title</Content>
<Content component="p">Text</Content>
<Content component="a" href="/path">Link</Content>
```
```html
<h1 class="pf-v6-c-content--h1">Title</h1>
<p class="pf-v6-c-content--p">Text</p>
<a class="pf-v6-c-content--a" href="/path">Link</a>
```

### Element Mapping

`h1`→`h6`, `p`, `a`, `small`, `blockquote`, `pre`, `hr`, `ul`, `ol`, `dl`, `li`, `dt`, `dd`

Class pattern: `.pf-v6-c-content--{element}`

### Content Modifiers

| React Prop | CSS Modifier | Applies To |
|------------|-------------|-----------|
| `isEditorial` | `.pf-m-editorial` | All elements |
| `isPlainList` | `.pf-m-plain` | ul, ol, dl only |
| `isVisitedLink` | `.pf-m-visited` | a elements or wrapper |

### Nested Content

Process recursively — inner `<Content component="a">` becomes `<a class="pf-v6-c-content--a">` inside outer element.

## Title Component

```tsx
<Title headingLevel="h1">Main Title</Title>
<Title headingLevel="h3" size="xl">Custom Size</Title>
```
```html
<h1 class="pf-v6-c-title pf-m-h1">Main Title</h1>
<h3 class="pf-v6-c-title pf-m-xl">Custom Size</h3>
```

**Rules**:
- Element from `headingLevel` prop (h1–h6)
- Size modifier: `size` prop → `.pf-m-{size}`, otherwise `.pf-m-{headingLevel}`
- Sizes: `4xl`, `3xl`, `2xl`, `xl`, `lg`, `md`
- Preserve `id`, `className`, `data-*` attributes

## Form Component

```tsx
<Form>...</Form>
<Form isHorizontal>...</Form>
<Form isWidthLimited>...</Form>
<Form maxWidth="600px">...</Form>
```
```html
<form class="pf-v6-c-form" novalidate>...</form>
<form class="pf-v6-c-form pf-m-horizontal" novalidate>...</form>
<form class="pf-v6-c-form pf-m-limit-width" novalidate>...</form>
<form class="pf-v6-c-form pf-m-limit-width" style="--pf-v6-c-form--m-limit-width--MaxWidth: 600px" novalidate>...</form>
```

**Rules**: Always `novalidate`, always `.pf-v6-c-form`, `maxWidth` → CSS custom property

## DescriptionList Component

### Basic Structure

```tsx
<DescriptionList>
  <DescriptionListGroup>
    <DescriptionListTerm>Name</DescriptionListTerm>
    <DescriptionListDescription>Value</DescriptionListDescription>
  </DescriptionListGroup>
</DescriptionList>
```
```html
<dl class="pf-v6-c-description-list">
  <div class="pf-v6-c-description-list__group">
    <dt class="pf-v6-c-description-list__term">
      <span class="pf-v6-c-description-list__text">Name</span>
    </dt>
    <dd class="pf-v6-c-description-list__description">
      <div class="pf-v6-c-description-list__text">Value</div>
    </dd>
  </div>
</dl>
```

### Element Mapping

| React | HTML | Class |
|-------|------|-------|
| `DescriptionList` | `<dl>` | `.pf-v6-c-description-list` |
| `DescriptionListGroup` | `<div>` | `.pf-v6-c-description-list__group` |
| `DescriptionListTerm` | `<dt>` | `.pf-v6-c-description-list__term` |
| `DescriptionListDescription` | `<dd>` | `.pf-v6-c-description-list__description` |

**Text wrappers**: Term text → `<span class="....__text">`, Description text → `<div class="....__text">`

### Term with Icon

```html
<dt class="pf-v6-c-description-list__term">
  <span class="pf-v6-c-description-list__term-icon"><!-- icon --></span>
  <span class="pf-v6-c-description-list__text">Name</span>
</dt>
```

### DescriptionList Modifiers

| React Prop | CSS Modifier |
|------------|-------------|
| `isHorizontal` | `.pf-m-horizontal` |
| `isCompact` | `.pf-m-compact` |
| `isFluid` | `.pf-m-fluid` |
| `isFillColumns` | `.pf-m-fill-columns` |
| `isInlineGrid` | `.pf-m-inline-grid` |
| `isAutoFit` | `.pf-m-auto-fit` |
| `isAutoColumnWidths` | `.pf-m-auto-column-widths` |
| `displaySize="lg"` | `.pf-m-display-lg` |
| `displaySize="2xl"` | `.pf-m-display-2xl` |

### Responsive Modifiers

**columnModifier**: `{ default: '1Col', md: '2Col' }` → `.pf-m-1-col .pf-m-2-col-on-md`

**orientation**: `{ md: 'horizontal' }` → `.pf-m-horizontal-on-md`

### CSS Custom Properties

| React Prop | CSS Variable |
|------------|-------------|
| `termWidth` | `--pf-v6-c-description-list__term-width` |
| `horizontalTermWidthModifier` | `--pf-v6-c-description-list--m-horizontal__term-width` (with breakpoints) |
| `autoFitMinModifier` | `--pf-v6-c-description-list--GridTemplateColumns--min` (with breakpoints) |

## Key Rules

- **NEVER create custom elements** for styling components
- Class prefix is `.pf-v6-c-*` (component), NOT `.pf-v6-l-*` (layout)
- Preserve all HTML attributes (`href`, `id`, `data-*`, `className` → `class`)
- PatternFly CSS already loaded in project setup — no additional CSS needed

