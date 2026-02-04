# pfv6-popover

A LitElement web component implementation of PatternFly's Popover component.

## Positioning Library Difference

This component uses [Floating UI](https://floating-ui.com/) for positioning, while PatternFly React uses [Popper.js](https://popper.js.org/). Both libraries provide similar functionality but may exhibit slightly different flip behavior in edge cases.

### Known Differences

- **Flip threshold**: Floating UI may flip the popover to an alternate position more aggressively than Popper.js when space is limited
- **Fallback order**: When the preferred position overflows, the order in which fallback positions are tried may differ slightly

These differences are most noticeable when:
- The trigger element is near the edge of the viewport
- The popover content is large relative to available space
- The `enable-flip` property is set to `true` (default)

### Mitigation

If exact positioning parity with React is critical:
- Set `enable-flip="false"` to disable automatic repositioning
- Use explicit `position` values instead of relying on auto-flip behavior
- Adjust viewport margins or popover sizing to provide adequate space

## Usage

```html
<pfv6-popover
  header-content="Popover Header"
  body-content="Popover body content goes here."
  footer-content="Popover footer"
>
  <button>Toggle Popover</button>
</pfv6-popover>
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `accessible-label` | `string` | `undefined` | Accessible label for the popover (required when no header) |
| `header-content` | `string` | `''` | Header content text |
| `body-content` | `string` | `''` | Body content text |
| `footer-content` | `string` | `''` | Footer content text |
| `position` | `'auto' \| Placement` | `'top'` | Initial position of the popover |
| `distance` | `number` | `25` | Distance from trigger element in pixels |
| `enable-flip` | `boolean` | `true` | Whether to flip position when space is limited |
| `alert-severity-variant` | `'custom' \| 'info' \| 'warning' \| 'success' \| 'danger'` | `undefined` | Severity variant for alert-style popovers |
| `alert-severity-screen-reader-text` | `string` | `''` | Screen reader text for alert severity |
| `header-component` | `'h1' \| 'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6'` | `'h6'` | Heading level for the header |
| `trigger-action` | `'click' \| 'hover'` | `'click'` | How the popover is triggered |
| `is-visible` | `boolean` | `false` | Controls visibility (for manual mode) |
| `max-width` | `string` | `undefined` | Maximum width of the popover |
| `min-width` | `string` | `undefined` | Minimum width of the popover |
| `z-index` | `number` | `9999` | Z-index of the popover |
| `animation-duration` | `number` | `300` | Animation duration in milliseconds |
| `trigger-id` | `string` | `undefined` | ID of an external trigger element |
| `show-close` | `boolean` | `true` | Whether to show the close button |
| `close-btn-accessible-label` | `string` | `'Close'` | Accessible label for the close button |
| `hide-on-outside-click` | `boolean` | `true` | Hide when clicking outside |
| `has-auto-width` | `boolean` | `false` | Allow width to be defined by contents |
| `has-no-padding` | `boolean` | `false` | Remove content padding |

## Slots

| Slot | Description |
|------|-------------|
| (default) | Trigger element |
| `header` | Header content (alternative to `header-content` property) |
| `header-icon` | Icon displayed in the header |
| `body` | Body content (alternative to `body-content` property) |
| `footer` | Footer content |

## Events

| Event | Description |
|-------|-------------|
| `show` | Fired when popover begins to show |
| `shown` | Fired after show animation completes |
| `hide` | Fired when popover begins to hide |
| `hidden` | Fired after hide animation completes |
| `mount` | Fired when popover mounts to DOM |
| `should-open` | Fired before opening (cancelable, manual mode) |
| `should-close` | Fired before closing (cancelable, manual mode) |
