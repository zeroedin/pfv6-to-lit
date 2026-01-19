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

The tooltip uses a shared live region announcer pattern to announce content to screen readers. This approach avoids cross-shadow-root ARIA IDREF issues that would occur with `aria-describedby` or `aria-labelledby` references.

When the tooltip shows, its content is announced via a visually-hidden `role="status"` element in `document.body`. Set `silent` to `true` when the trigger element already has an accessible label.

## Breaking Changes

### Removed `aria` property

The `aria` property (`'describedby' | 'labelledby' | 'none'`) has been removed and replaced with the `silent` boolean property.

**Migration:**

```html
<!-- Before -->
<pfv6-tooltip aria="none" content="Info">...</pfv6-tooltip>
<pfv6-tooltip aria="describedby" content="Info">...</pfv6-tooltip>
<pfv6-tooltip aria="labelledby" content="Info">...</pfv6-tooltip>

<!-- After -->
<pfv6-tooltip silent content="Info">...</pfv6-tooltip>
<pfv6-tooltip content="Info">...</pfv6-tooltip>
<pfv6-tooltip content="Info">...</pfv6-tooltip>
```

**Reason:** The original `aria` property attempted to set `aria-describedby` or `aria-labelledby` IDREF attributes on the trigger element, referencing an ID inside the tooltip's shadow DOM. This is a cross-root ARIA violation - IDREF attributes cannot reference elements across shadow DOM boundaries.

The new implementation uses a shared live region announcer which correctly announces tooltip content to screen readers without cross-root issues.

### Removed `aria-live` property

The `aria-live` property (`'off' | 'polite'`) has been removed entirely.

**Migration:**

```html
<!-- Before -->
<pfv6-tooltip aria-live="polite" content="Info">...</pfv6-tooltip>

<!-- After -->
<pfv6-tooltip content="Info">...</pfv6-tooltip>
```

**Reason:** The `aria-live` attribute on the tooltip element (which has `role="tooltip"`) served no useful purpose. Screen reader announcements are now handled by a shared live region announcer in `document.body`, making this property redundant.
