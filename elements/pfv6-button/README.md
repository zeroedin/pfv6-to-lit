# pfv6-button

Button component for triggering actions.

## API Differences from React

### `component` prop

**Not implemented**

- **React behavior**: The `component` prop allows changing the rendered element type (e.g., `<Button component="a">` renders as `<a>`)
- **Why not in Lit**: Web components have a fixed element type and cannot be transformed to different element types at runtime. The `component` prop is a React-specific feature that relies on JSX compilation.
- **Alternative**: For link behavior, use the `variant="link"` style prop. For semantic wrapping, wrap the button in appropriate HTML elements outside the component:
  ```html
  <!-- For list item context -->
  <li><pfv6-button>Click me</pfv6-button></li>

  <!-- For anchor-like behavior -->
  <a href="/page"><pfv6-button>Link button</pfv6-button></a>
  ```

## Accessible Labels

For icon-only buttons, always provide an accessible label via the `accessible-label` attribute or visible text content:

```html
<pfv6-button is-settings accessible-label="Settings">
  <pfv6-icon slot="icon" icon="cog"></pfv6-icon>
</pfv6-button>
```
