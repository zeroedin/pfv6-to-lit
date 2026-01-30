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

**Partially implemented (heading levels only)**

- **React behavior**: The `component` prop allows changing the rendered element type to any JSX intrinsic element
- **Lit behavior**: Only supports heading levels `"h1"` through `"h6"` for the title element
- **Why**: Web Components cannot dynamically change element types at runtime like React's JSX can

```html
<pfv6-alert component="h2" title="Important">...</pfv6-alert>
```

### `AlertActionLink` component prop

**Replaced with `href` attribute**

- **React behavior**: Uses `component` prop on wrapped Button to render as `<a>` or `<button>`
- **Lit behavior**: Uses `href` attribute directly. When `href` is set, renders as `<a>`; otherwise renders as `<button>`
- **Why**: Simpler API that matches native HTML anchor behavior

```html
<!-- React -->
<AlertActionLink component="a" href="/link">View details</AlertActionLink>

<!-- Lit -->
<pfv6-alert-action-link href="/link">View details</pfv6-alert-action-link>
<pfv6-alert-action-link>Click me</pfv6-alert-action-link> <!-- renders as button -->
```
