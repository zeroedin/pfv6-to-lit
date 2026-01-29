# pfv6-tree-view

Tree view component for displaying hierarchical data structures.

## API Differences from React

### `defaultAllExpanded` Not Implemented

React's TreeView has two props for controlling expansion:

- **`defaultAllExpanded`** - Sets initial expansion state (uncontrolled)
- **`allExpanded`** - Controls expansion state (controlled)

This Lit implementation only provides **`allExpanded`**.

**Justification:**

In React, `defaultAllExpanded` is an uncontrolled prop that only affects initial render. Once mounted, the component manages its own expansion state internally.

In our Lit implementation, `allExpanded` already fulfills this use case:

```html
<!-- To start with all items expanded -->
<pfv6-tree-view all-expanded>
  ...
</pfv6-tree-view>
```

If you need items to start expanded but allow user toggling afterward, simply set `all-expanded` initially and then remove the attribute or set it to `undefined` programmatically. The items will retain their current expansion state once `allExpanded` becomes `undefined`.

This simplifies the API surface while maintaining the same functionality. Individual items can still use `default-expanded` for per-item initial state control.
