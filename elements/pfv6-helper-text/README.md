# HelperText Component

LitElement implementation of PatternFly's HelperText component for displaying informational, error, or warning text.

## Components

- `<pfv6-helper-text>` - Container component
- `<pfv6-helper-text-item>` - Individual helper text item

## Basic Usage

```html
<pfv6-helper-text>
  <pfv6-helper-text-item>This is helper text</pfv6-helper-text-item>
</pfv6-helper-text>
```

## Variants

```html
<pfv6-helper-text>
  <pfv6-helper-text-item variant="default">Default message</pfv6-helper-text-item>
  <pfv6-helper-text-item variant="indeterminate">Indeterminate message</pfv6-helper-text-item>
  <pfv6-helper-text-item variant="warning">Warning message</pfv6-helper-text-item>
  <pfv6-helper-text-item variant="success">Success message</pfv6-helper-text-item>
  <pfv6-helper-text-item variant="error">Error message</pfv6-helper-text-item>
</pfv6-helper-text>
```

## Live Region for Dynamic Updates

```html
<pfv6-helper-text is-live-region>
  <pfv6-helper-text-item id="dynamic-message"></pfv6-helper-text-item>
</pfv6-helper-text>

<script>
  // Screen readers will announce when message updates
  document.getElementById('dynamic-message').textContent = 'Updated message';
</script>
```

## API Differences from React

### `component` prop - NOT IMPLEMENTED

**React behavior**: The `component` prop allows changing the element type:
```jsx
// React - renders as <ul>
<HelperText component="ul">
  <HelperTextItem component="li">Item 1</HelperTextItem>
  <HelperTextItem component="li">Item 2</HelperTextItem>
</HelperText>
```

**Why not implemented**: Web components cannot dynamically change their element type. A `<pfv6-helper-text>` element will always be a `<pfv6-helper-text>` in the DOM, regardless of any attribute.

**Lit equivalent**: Wrap components in semantic HTML when list semantics are needed:

```html
<!-- For multiple items needing list semantics -->
<pfv6-helper-text accessible-label="Helper messages">
  <ul>
    <li><pfv6-helper-text-item variant="error">Error message</pfv6-helper-text-item></li>
    <li><pfv6-helper-text-item variant="warning">Warning message</pfv6-helper-text-item></li>
    <li><pfv6-helper-text-item variant="success">Success message</pfv6-helper-text-item></li>
  </ul>
</pfv6-helper-text>
```

```html
<!-- For single item, no wrapper needed -->
<pfv6-helper-text>
  <pfv6-helper-text-item>Single helper text message</pfv6-helper-text-item>
</pfv6-helper-text>
```

### `aria-label` → `accessible-label`

**React prop**: `aria-label`
```jsx
<HelperText component="ul" aria-label="Helper messages">
```

**Lit equivalent**: Use `accessible-label` attribute:
```html
<pfv6-helper-text accessible-label="Helper messages">
  <ul>...</ul>
</pfv6-helper-text>
```

**Why renamed**: Following web component naming conventions where ARIA attributes are exposed as descriptive property names.

### `icon` prop → `icon` slot

**React prop**: `icon` prop accepts React nodes
```jsx
<HelperTextItem variant="warning" icon={<CustomIcon />}>
  Custom icon message
</HelperTextItem>
```

**Lit equivalent**: Use the `icon` named slot:
```html
<pfv6-helper-text-item variant="warning">
  <svg slot="icon" fill="currentColor" height="1em" width="1em" viewBox="0 0 512 512">
    <!-- Custom icon SVG -->
  </svg>
  Custom icon message
</pfv6-helper-text-item>
```

**Benefit**: Slots are more flexible than props for custom content and avoid serialization issues.

### `screenReaderText` - Automatic Defaults

**React behavior**: Automatically provides `"{variant} status"` as screen reader text when variant is not "default":
```jsx
<HelperTextItem variant="warning">Warning message</HelperTextItem>
// Screen reader announces: "warning status: Warning message;"
```

**Lit behavior**: Same automatic default behavior:
```html
<pfv6-helper-text-item variant="warning">Warning message</pfv6-helper-text-item>
<!-- Screen reader announces: "warning status: Warning message;" -->
```

**Override**: Provide custom screen reader text:
```html
<pfv6-helper-text-item variant="error" screen-reader-text="critical error">
  Invalid email format
</pfv6-helper-text-item>
<!-- Screen reader announces: "critical error: Invalid email format;" -->
```

## Properties

### pfv6-helper-text

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `isLiveRegion` | `is-live-region` | `boolean` | `false` | Whether container is a live region for dynamic updates |
| `accessibleLabel` | `accessible-label` | `string` | `undefined` | Accessible label for the container (equivalent to React's aria-label) |

### pfv6-helper-text-item

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `variant` | `variant` | `'default' \| 'indeterminate' \| 'warning' \| 'success' \| 'error'` | `'default'` | Variant styling with default icons |
| `screenReaderText` | `screen-reader-text` | `string` | `undefined` | Custom screen reader text (defaults to "{variant} status" for non-default variants) |

## Slots

### pfv6-helper-text

| Slot | Description |
|------|-------------|
| (default) | Helper text items |

### pfv6-helper-text-item

| Slot | Description |
|------|-------------|
| (default) | Helper text content |
| `icon` | Custom icon (overrides default variant icon) |

## CSS Custom Properties

See component source files for available CSS custom properties:
- `pfv6-helper-text.css`
- `pfv6-helper-text-item.css`

## Accessibility

### ARIA Relationships with Form Fields

When using helper text with form inputs, reference the custom element's `id` directly in `aria-describedby`:

```html
<label for="email">Email</label>
<input
  type="email"
  id="email"
  aria-describedby="email-helper"
>
<pfv6-helper-text id="email-helper">
  <pfv6-helper-text-item>Enter a valid email address</pfv6-helper-text-item>
</pfv6-helper-text>
```

**Shadow DOM Note**: The `id` attribute is set on the custom element itself (the host), not on internal shadow DOM elements. Assistive technologies can access the text content of the referenced element, including all slotted content, making the helper text properly associated with the form field.

### Referencing Individual Items

You can also reference individual helper text items:

```html
<label for="password">Password</label>
<input
  type="password"
  id="password"
  aria-describedby="password-requirement-1 password-requirement-2"
>
<pfv6-helper-text>
  <pfv6-helper-text-item id="password-requirement-1" variant="error">
    Must be at least 8 characters
  </pfv6-helper-text-item>
  <pfv6-helper-text-item id="password-requirement-2" variant="error">
    Must contain a number
  </pfv6-helper-text-item>
</pfv6-helper-text>
```

### Live Regions for Dynamic Updates

- Use `is-live-region` when helper text will be dynamically updated
- Use `accessible-label` when wrapping multiple items in a list
- Screen reader text is automatically provided for variant items
- Custom icons should include appropriate `aria-hidden` and `role` attributes

### Invalid Input Indicators

For error states, combine `aria-describedby` with `aria-invalid`:

```html
<label for="username">Username</label>
<input
  type="text"
  id="username"
  aria-describedby="username-error"
  aria-invalid="true"
>
<pfv6-helper-text id="username-error" is-live-region>
  <pfv6-helper-text-item variant="error">
    Username is required
  </pfv6-helper-text-item>
</pfv6-helper-text>
```

## Examples

### Form Field Help Text

```html
<label for="email">Email</label>
<input type="email" id="email" aria-describedby="email-helper">
<pfv6-helper-text id="email-helper">
  <pfv6-helper-text-item>Enter a valid email address (e.g., user@example.com)</pfv6-helper-text-item>
</pfv6-helper-text>
```

### Dynamic Validation Messages

```html
<label for="password">Password</label>
<input type="password" id="password" aria-describedby="password-helper">
<pfv6-helper-text id="password-helper" is-live-region>
  <pfv6-helper-text-item id="password-message" variant="error">
    Password must be at least 8 characters
  </pfv6-helper-text-item>
</pfv6-helper-text>

<script>
  const input = document.getElementById('password');
  const message = document.getElementById('password-message');

  input.addEventListener('input', (e) => {
    if (e.target.value.length >= 8) {
      message.variant = 'success';
      message.textContent = 'Password meets requirements';
    } else {
      message.variant = 'error';
      message.textContent = 'Password must be at least 8 characters';
    }
  });
</script>
```

### Multiple Validation States

```html
<pfv6-helper-text is-live-region accessible-label="Password requirements">
  <ul>
    <li><pfv6-helper-text-item variant="success">At least 8 characters</pfv6-helper-text-item></li>
    <li><pfv6-helper-text-item variant="error">Contains a number</pfv6-helper-text-item></li>
    <li><pfv6-helper-text-item variant="error">Contains a special character</pfv6-helper-text-item></li>
  </ul>
</pfv6-helper-text>
```
