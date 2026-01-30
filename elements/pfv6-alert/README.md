# pfv6-alert

Alert component for displaying contextual feedback messages.

## API Differences from React

### `timeout` prop

**Number only (no boolean)**

- **React behavior**: Accepts `timeout={true}` for 8000ms default, or `timeout={5000}` for custom duration
- **Lit behavior**: Only accepts numbers. Use `timeout="8000"` for the default timeout behavior.
- **Why**: HTML attributes are strings. Supporting a boolean `true` would require a custom converter with ambiguous behavior for string values like `"true"` vs `"false"`.

```html
<!-- React -->
<Alert timeout={true}>...</Alert>
<Alert timeout={5000}>...</Alert>

<!-- Lit -->
<pfv6-alert timeout="8000">...</pfv6-alert>
<pfv6-alert timeout="5000">...</pfv6-alert>
```

### `component` prop

**Not implemented**

- **React behavior**: The `component` prop allows changing the title heading level (e.g., `component="h2"`)
- **Lit behavior**: Use the `component` attribute with a string value (`"h1"` through `"h6"`)
- **Note**: This prop IS implemented, but only accepts heading levels, not arbitrary element types.

```html
<pfv6-alert component="h2" title="Important">...</pfv6-alert>
```
