# pfv6-simple-list

A list component for creating simple navigation or option lists.

## API Differences from React

### `component` prop

**Simplified in Lit version**

- **React behavior**: Requires both `component="a"` and `href` to render as a link:
  ```jsx
  <SimpleListItem component="a" href="#">Link item</SimpleListItem>
  ```

- **Lit behavior**: The `href` attribute alone determines whether the item renders as a link or button:
  ```html
  <!-- Link (has href) -->
  <pfv6-simple-list-item href="#">Link item</pfv6-simple-list-item>

  <!-- Button (no href) -->
  <pfv6-simple-list-item>Button item</pfv6-simple-list-item>
  ```

- **Why**: Setting `href` on a button is meaningless, so the presence of `href` is sufficient to indicate link intent. This simplifies the API and reduces redundancy.

- **Migration**: Remove `component="a"` from your React code when converting to Lit. Just use `href` to create links.

| React | Lit |
|-------|-----|
| `<SimpleListItem component="a" href="#">` | `<pfv6-simple-list-item href="#">` |
| `<SimpleListItem component="button">` | `<pfv6-simple-list-item>` |
| `<SimpleListItem>` (default button) | `<pfv6-simple-list-item>` |
