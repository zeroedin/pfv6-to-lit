# pfv6-tooltip

A tooltip component that displays contextual information on trigger element hover, focus, or click.

## Usage

```html
<pfv6-tooltip content="This is helpful information">
  <button>Hover me</button>
</pfv6-tooltip>
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `content` | `string` | `''` | Tooltip content text |
| `position` | `'auto' \| Placement` | `'top'` | Tooltip position relative to trigger |
| `distance` | `number` | `15` | Distance from trigger element (pixels) |
| `enable-flip` | `boolean` | `true` | Flip tooltip if it would overflow viewport |
| `entry-delay` | `number` | `300` | Delay before showing (ms) |
| `exit-delay` | `number` | `300` | Delay before hiding (ms) |
| `trigger` | `string` | `'mouseenter focus'` | Trigger events (mouseenter, focus, click, manual) |
| `is-content-left-aligned` | `boolean` | `false` | Left-align tooltip text |
| `is-visible` | `boolean` | `false` | Visibility for manual trigger mode |
| `max-width` | `string` | `'18.75rem'` | Maximum tooltip width |
| `min-width` | `string` | - | Minimum tooltip width |
| `z-index` | `number` | `9999` | Z-index of tooltip |
| `animation-duration` | `number` | `300` | Fade animation duration (ms) |
| `silent` | `boolean` | `false` | Disable screen reader announcements |
| `trigger-id` | `string` | - | ID of external trigger element |

## Events

| Event | Description |
|-------|-------------|
| `tooltip-hidden` | Dispatched after tooltip hide animation completes |

## Accessibility

The tooltip uses `ElementInternals.ariaLive` to announce content changes to screen readers. This approach:

- Lets the browser handle announcement timing automatically
- Announces when tooltip content appears or changes in the shadow DOM
- Avoids cross-shadow-root ARIA IDREF issues that would occur with `aria-describedby`
- Allows users to override with native `aria-live` attribute on the host element

By default, `ariaLive` is set to `'polite'`. Set `silent` to `true` when the trigger element already has an accessible label and announcements are not needed.

## Differences from React

### `aria` property → `silent` property

React's Tooltip has an `aria` property (`'describedby' | 'labelledby' | 'none'`) that sets ARIA IDREF attributes on the trigger element. This approach doesn't work in Shadow DOM because IDREF attributes cannot reference elements across shadow boundaries.

The Lit implementation uses `ElementInternals.ariaLive` on the host element instead, which correctly announces content to screen readers. The `silent` property controls this behavior:

| React | Lit |
|-------|-----|
| `aria="describedby"` (default) | Default behavior (ariaLive='polite') |
| `aria="labelledby"` | Default behavior (ariaLive='polite') |
| `aria="none"` | `silent` |

### `aria-live` property → `silent` property

React's Tooltip has an `aria-live` property (`'off' | 'polite'`) that sets the live region behavior on the tooltip element.

The Lit implementation uses `ElementInternals.ariaLive` to achieve the same result. The `silent` property controls whether announcements are enabled:

| React | Lit |
|-------|-----|
| `aria-live="polite"` (default) | Default behavior |
| `aria-live="off"` | `silent` |

Users can still override by setting the native `aria-live` attribute directly on the host element.
