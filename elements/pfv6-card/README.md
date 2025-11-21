# pfv6-card

PatternFly v6 Card web component - A content container for dashboards, galleries, and catalogs.

## Status: Complete ✅

Full implementation with 1:1 visual and API parity to PatternFly React v6 Card component.

## Features

### Core Structure
- ✅ Sub-component API (matches React structure)
- ✅ Card header with images, icons, and actions
- ✅ Card title with customizable heading level
- ✅ Multiple card body sections with fill control
- ✅ Card footer
- ✅ Expandable content sections
- ✅ Shadow DOM encapsulation with exposed CSS parts

### Variants
- ✅ **Default** - Primary background with standard styling
- ✅ **Secondary** - Secondary background color with high-contrast border

### Modifiers
- ✅ **Compact** - Reduced spacing for denser layouts
- ✅ **Large** - Increased spacing and typography
- ✅ **Full Height** - Fills available container height
- ✅ **Plain** - No border or background

### Interactive Features
- ✅ **Clickable** - Make entire card actionable
- ✅ **Selectable** - Checkbox selection with hover states
- ✅ **Expandable** - Collapsible card content with toggle
- ✅ **Disabled** - Disabled interaction state

### Design System Integration
- ✅ PatternFly v6 design tokens
- ✅ CSS custom properties matching React Card API
- ✅ Responsive spacing system
- ✅ Accessible markup with ARIA support

## Usage

### Basic Card

```html
<pfv6-card>
  <pfv6-card-title>Card Title</pfv6-card-title>
  <pfv6-card-body>Card body content goes here</pfv6-card-body>
  <pfv6-card-footer>Footer text</pfv6-card-footer>
</pfv6-card>

<script type="module">
  import '/elements/pfv6-card/pfv6-card.js';
  import '/elements/pfv6-card/pfv6-card-title.js';
  import '/elements/pfv6-card/pfv6-card-body.js';
  import '/elements/pfv6-card/pfv6-card-footer.js';
</script>
```

### Card with Header Actions

```html
<pfv6-card>
  <img 
    slot="header-image" 
    src="logo.svg" 
    alt="Logo"
  >
  <span slot="actions">
    <button type="button">⋮</button>
  </span>
  <pfv6-card-title>Card with Actions</pfv6-card-title>
  <pfv6-card-body>Body content</pfv6-card-body>
</pfv6-card>
```

### Card with Semantic Heading

```html
<pfv6-card>
  <pfv6-card-title component="h2">Card Title as H2</pfv6-card-title>
  <pfv6-card-body>Using semantic heading elements improves accessibility</pfv6-card-body>
</pfv6-card>
```

### Multiple Body Sections

```html
<pfv6-card>
  <pfv6-card-title>Multiple Sections</pfv6-card-title>
  <pfv6-card-body>First section</pfv6-card-body>
  <pfv6-card-body>Second section</pfv6-card-body>
  <pfv6-card-body filled="false">Third section (no fill)</pfv6-card-body>
  <pfv6-card-footer>Footer</pfv6-card-footer>
</pfv6-card>
```

### Card with Dividers

```html
<pfv6-card>
  <pfv6-card-title>With Dividers</pfv6-card-title>
  <pfv6-card-body>Section 1</pfv6-card-body>
  <hr>
  <pfv6-card-body>Section 2</pfv6-card-body>
  <hr>
  <pfv6-card-body>Section 3</pfv6-card-body>
</pfv6-card>
```

### Expandable Card

```html
<pfv6-card expandable>
  <pfv6-card-title>Expandable Card</pfv6-card-title>
  <pfv6-card-expandable-content>
    <pfv6-card-body>This content is hidden when collapsed</pfv6-card-body>
    <pfv6-card-footer>Footer content</pfv6-card-footer>
  </pfv6-card-expandable-content>
</pfv6-card>

<script type="module">
  import '/elements/pfv6-card/pfv6-card-expandable-content.js';
</script>
```

### Selectable Card

```html
<pfv6-card selectable>
  <pfv6-card-title>Selectable Card</pfv6-card-title>
  <pfv6-card-body>Click to select</pfv6-card-body>
</pfv6-card>

<script type="module">
  const card = document.querySelector('pfv6-card');
  card.addEventListener('card-select', (e) => {
    console.log('Card selected:', card.selected);
  });
</script>
```

### Secondary Variant

```html
<pfv6-card variant="secondary">
  <pfv6-card-title>Secondary Card</pfv6-card-title>
  <pfv6-card-body>Different background color</pfv6-card-body>
</pfv6-card>
```

### Size Modifiers

```html
<!-- Compact -->
<pfv6-card compact>
  <pfv6-card-title>Compact Card</pfv6-card-title>
  <pfv6-card-body>Reduced spacing</pfv6-card-body>
</pfv6-card>

<!-- Large -->
<pfv6-card large>
  <pfv6-card-title>Large Card</pfv6-card-title>
  <pfv6-card-body>Increased spacing and typography</pfv6-card-body>
</pfv6-card>
```

## API

### `<pfv6-card>` Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `variant` | `'default' \| 'secondary'` | `'default'` | Card visual variant |
| `compact` | `boolean` | `false` | Compact spacing modifier |
| `large` | `boolean` | `false` | Large spacing modifier |
| `full-height` | `boolean` | `false` | Fill container height |
| `plain` | `boolean` | `false` | Remove border and background |
| `clickable` | `boolean` | `false` | Make card clickable |
| `selectable` | `boolean` | `false` | Add selection checkbox |
| `selected` | `boolean` | `false` | Selected state |
| `clicked` | `boolean` | `false` | Clicked state |
| `expandable` | `boolean` | `false` | Make card expandable |
| `expanded` | `boolean` | `false` | Expanded state |
| `disabled` | `boolean` | `false` | Disabled state |
| `actions-no-offset` | `boolean` | `false` | Remove padding before actions |
| `toggle-right-aligned` | `boolean` | `false` | Position expand toggle on right |

### `<pfv6-card>` Slots

| Slot | Description |
|------|-------------|
| (default) | Card sub-components (title, body, footer, expandable-content) |
| `header-image` | Brand/logo images in header |
| `header-icon` | Icon before title (for expandable cards) |
| `actions` | Header actions (buttons, menus) |

### `<pfv6-card>` Events

| Event | Description |
|-------|-------------|
| `card-click` | Dispatched when a clickable or selectable card is clicked |
| `card-select` | Dispatched when a selectable card's selection state changes |
| `card-expand` | Dispatched when an expandable card's expansion state changes |

### `<pfv6-card-title>` Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `component` | `'div' \| 'h1' \| 'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6'` | `'div'` | HTML element to use for the title wrapper |

### `<pfv6-card-body>` Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `filled` | `boolean` | `true` | Whether the body section should fill available height |

### `<pfv6-card-footer>` Properties

No properties.

### `<pfv6-card-expandable-content>` Properties

No properties. Visibility controlled by parent card's `expanded` state.

## Sub-Components

This component uses a sub-component architecture that matches the PatternFly React Card API:

- **`<pfv6-card-title>`** - Card title with optional semantic heading level
- **`<pfv6-card-body>`** - Card body section (can use multiple)
- **`<pfv6-card-footer>`** - Card footer
- **`<pfv6-card-expandable-content>`** - Wrapper for expandable content

All sub-components use Shadow DOM and `display: contents` to participate directly in the parent card's flex layout.

## CSS Custom Properties

This component exposes the **same CSS variables as PatternFly React Card** for 1:1 API parity. See the [PatternFly Card CSS variables documentation](https://www.patternfly.org/components/card#css-variables) for the full reference.

**Key CSS Variables:**

```css
pfv6-card {
  /* Base styles */
  --pf-v6-c-card--BackgroundColor: /* Card background color */
  --pf-v6-c-card--BorderColor: /* Card border color */
  --pf-v6-c-card--BorderWidth: /* Card border width */
  --pf-v6-c-card--BorderRadius: /* Card border radius */
  
  /* Spacing */
  --pf-v6-c-card--first-child--PaddingBlockStart: /* First child top padding */
  --pf-v6-c-card--child--PaddingInlineEnd: /* Child inline end padding */
  --pf-v6-c-card--child--PaddingBlockEnd: /* Child bottom padding */
  --pf-v6-c-card--child--PaddingInlineStart: /* Child inline start padding */
  
  /* Typography */
  --pf-v6-c-card__title-text--Color: /* Title color */
  --pf-v6-c-card__title-text--FontSize: /* Title font size */
  --pf-v6-c-card__title-text--FontWeight: /* Title font weight */
  --pf-v6-c-card__body--Color: /* Body text color */
  --pf-v6-c-card__body--FontSize: /* Body font size */
  --pf-v6-c-card__footer--Color: /* Footer text color */
  --pf-v6-c-card__footer--FontSize: /* Footer font size */
  
  /* Modifiers - Compact */
  --pf-v6-c-card--m-compact--first-child--PaddingBlockStart: /* Compact padding */
  --pf-v6-c-card--m-compact__title-text--FontSize: /* Compact title size */
  
  /* Modifiers - Large */
  --pf-v6-c-card--m-display-lg--first-child--PaddingBlockStart: /* Large padding */
  --pf-v6-c-card--m-display-lg__title-text--FontSize: /* Large title size */
  
  /* Modifiers - Secondary */
  --pf-v6-c-card--m-secondary--BackgroundColor: /* Secondary background */
  --pf-v6-c-card--m-secondary--BorderColor: /* Secondary border color */
  
  /* Interactive States */
  --pf-v6-c-card--m-selectable--hover--BorderColor: /* Hover border color */
  --pf-v6-c-card--m-selectable--m-selected--BorderColor: /* Selected border color */
  --pf-v6-c-card--m-selectable--m-disabled--BackgroundColor: /* Disabled background */
}
```

**Example Customization:**

```css
/* Customize a specific card */
pfv6-card.custom-card {
  --pf-v6-c-card--BackgroundColor: #f0f0f0;
  --pf-v6-c-card--BorderColor: #06c;
  --pf-v6-c-card--BorderRadius: 8px;
}

/* Global customization */
:root {
  --pf-v6-c-card--BorderRadius: 12px;
}
```

## Testing

Unit tests are located in `test/pfv6-card.spec.ts`. Run tests with:

```bash
npm run test
```

## Demos

- **Web Component Demos**: `/elements/pfv6-card/demo/`
- **React Comparison Demos**: `/elements/pfv6-card/react/`

## References

- [PatternFly Card Documentation](https://www.patternfly.org/components/card)
- [PatternFly Card CSS Variables](https://www.patternfly.org/components/card#css-variables)
- [PatternFly Design Tokens](https://www.patternfly.org/tokens/about-tokens/)
- [CLAUDE.md](../../CLAUDE.md) - Development guidelines

## Implementation Notes

### 1:1 Parity with React

This component maintains complete parity with PatternFly React v6 Card:
- ✅ Identical visual design using PatternFly tokens
- ✅ Matching sub-component API structure
- ✅ Same CSS custom properties
- ✅ Consistent interactive behaviors
- ✅ All React variants and modifiers supported

### Architecture

The sub-component architecture uses `display: contents` on the custom element hosts, making them layout-transparent. This allows:
- Sub-components to participate directly in the parent card's flex layout
- Proper spacing and alignment matching React's output
- Clean separation of concerns between components
- Native support for multiple body sections and dividers

### Form Integration

Radio buttons and checkboxes work natively without special handling:
- Slot `<input type="radio">` or `<input type="checkbox">` into title or body
- Wrap inputs in `<label>` for accessibility
- Form inputs maintain native browser behavior
- No "tile variant" needed - cards accommodate form inputs through flexible composition

See demos: `single-selectable`, `tiles`, `multi-selectable-tiles`
