# pfv6-breadcrumb

Breadcrumb navigation component for PatternFly v6.

## Usage

```html
<pfv6-breadcrumb>
  <pfv6-breadcrumb-item to="/home">Home</pfv6-breadcrumb-item>
  <pfv6-breadcrumb-item to="/section">Section</pfv6-breadcrumb-item>
  <pfv6-breadcrumb-heading to="/current">Current Page</pfv6-breadcrumb-heading>
</pfv6-breadcrumb>
```

## API Differences from React

### `component` prop removed

The React `BreadcrumbItem` and `BreadcrumbHeading` components accept a `component` prop to specify whether to render an `<a>` or `<button>` element.

This web component simplifies the API by inferring the element type from the `to` property:

| `to` property | Rendered element |
|---------------|------------------|
| Set           | `<a>`            |
| Not set       | `<button>`       |

**React:**
```jsx
<BreadcrumbItem component="button">Click me</BreadcrumbItem>
<BreadcrumbItem to="/path">Link</BreadcrumbItem>
```

**Web Component:**
```html
<pfv6-breadcrumb-item>Click me</pfv6-breadcrumb-item>
<pfv6-breadcrumb-item to="/path">Link</pfv6-breadcrumb-item>
```

This approach eliminates the confusing case where both `component="button"` and `to` are set, and provides a cleaner, more intuitive API.
