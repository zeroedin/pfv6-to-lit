# pfv6-badge

Badge component for displaying counts or status indicators.

## Installation

```bash
npm install @pfv6/elements
```

## Usage

```html
<script type="module">
  import '@pfv6/elements/pfv6-badge/pfv6-badge.js';
</script>

<!-- Unread badge (default) -->
<pfv6-badge screen-reader-text="Unread Messages">7</pfv6-badge>

<!-- Read badge -->
<pfv6-badge is-read="true">24</pfv6-badge>

<!-- Disabled badge -->
<pfv6-badge is-disabled="true">999+</pfv6-badge>
```

## API

### Properties

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `isRead` | `is-read` | `'true' \| 'false'` | `'false'` | Adds styling to indicate badge has been read (muted colors) |
| `isDisabled` | `is-disabled` | `'true' \| 'false'` | `'false'` | Adds styling to indicate badge is disabled |
| `screenReaderText` | `screen-reader-text` | `string \| undefined` | `undefined` | Text announced by screen readers to provide context |

### Slots

| Slot | Description |
|------|-------------|
| (default) | Badge content (typically numbers or short text) |

### CSS Custom Properties

| Property | Description | Default |
|----------|-------------|---------|
| `--pf-v6-c-badge--BorderColor` | Border color of the badge | `transparent` |
| `--pf-v6-c-badge--BorderWidth` | Border width of the badge | `1px` |
| `--pf-v6-c-badge--BorderRadius` | Border radius of the badge | `999px` |
| `--pf-v6-c-badge--FontSize` | Font size of the badge text | `0.75rem` |
| `--pf-v6-c-badge--FontWeight` | Font weight of the badge text | `500` |
| `--pf-v6-c-badge--PaddingInlineEnd` | Right padding of the badge | `0.5rem` |
| `--pf-v6-c-badge--PaddingInlineStart` | Left padding of the badge | `0.5rem` |
| `--pf-v6-c-badge--Color` | Text color of the badge | `#151515` |
| `--pf-v6-c-badge--MinWidth` | Minimum width of the badge | `2rem` |
| `--pf-v6-c-badge--BackgroundColor` | Background color of the badge | varies by state |
| `--pf-v6-c-badge--m-read--BackgroundColor` | Background color when read | `#e0e0e0` |
| `--pf-v6-c-badge--m-read--Color` | Text color when read | `#151515` |
| `--pf-v6-c-badge--m-read--BorderColor` | Border color when read | `rgba(255, 255, 255, 0)` |
| `--pf-v6-c-badge--m-unread--BackgroundColor` | Background color when unread | `#0066cc` |
| `--pf-v6-c-badge--m-unread--Color` | Text color when unread | `#ffffff` |
| `--pf-v6-c-badge--m-disabled--Color` | Text color when disabled | `#4d4d4d` |
| `--pf-v6-c-badge--m-disabled--BorderColor` | Border color when disabled | `#a3a3a3` |
| `--pf-v6-c-badge--m-disabled--BackgroundColor` | Background color when disabled | `#c7c7c7` |

## Examples

See the `demo/` directory for complete examples:
- `unread.html` - Unread badges with screen reader text
- `read.html` - Read badges
- `disabled.html` - Disabled badges

## Accessibility

- Use `screen-reader-text` to provide context for screen reader users
- Screen reader text is visually hidden but announced to assistive technologies
- The badge content itself is visible to all users

## Browser Support

Supports all modern browsers with Custom Elements v1 support.
