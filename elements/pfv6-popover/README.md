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
| `position` | `'auto' \| Placement` | `'top'` | Initial position of the popover |
| `enable-flip` | `boolean` | `true` | Whether to flip position when space is limited |
| `distance` | `number` | `25` | Distance from trigger element in pixels |
| `is-visible` | `boolean` | `false` | Controls visibility (for manual mode) |
| `trigger-action` | `'click' \| 'hover'` | `'click'` | How the popover is triggered |
| `show-close` | `boolean` | `true` | Whether to show the close button |
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
