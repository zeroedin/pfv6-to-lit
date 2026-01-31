# pfv6-divider

Divider component for visually separating content.

## API Differences from React

### `component` prop

**Not implemented**

- **React behavior**: The `component` prop allows changing the rendered element type (`hr`, `div`, or `li`)
- **Why not in Lit**: Web components have a fixed element type and cannot be transformed to different element types at runtime
- **Alternative**: For list semantics, wrap the divider in an `<li>` element:
  ```html
  <ul role="list">
    <li>Item one</li>
    <li><pfv6-divider></pfv6-divider></li>
    <li>Item two</li>
  </ul>
  ```

### `role` prop

**Different default behavior**

- **React behavior**: Uses `<hr>` element which has implicit `role="separator"`. The `role` prop defaults to `"separator"` when not using `<hr>`.
- **Lit behavior**: Uses `<div>` internally with `role="presentation"` on the host via ElementInternals. The divider is purely decorative by default.
- **Rationale**: Most divider use cases are purely decorative - a visual line separating content without semantic meaning. By defaulting to `role="presentation"`, we avoid announcing "separator" to assistive technology users when it provides no meaningful information. Adding `role="separator"` explicitly ensures the developer has intentionally chosen separator semantics for cases where it genuinely aids navigation or comprehension.
- **To add separator semantics**: Override the role attribute on the host:
  ```html
  <pfv6-divider role="separator"></pfv6-divider>
  ```

## Usage

### Basic (decorative)

```html
<pfv6-divider></pfv6-divider>
```

### With separator semantics

```html
<pfv6-divider role="separator"></pfv6-divider>
```

### In a list

```html
<ul role="list">
  <li>Item one</li>
  <li><pfv6-divider></pfv6-divider></li>
  <li>Item two</li>
</ul>
```

### Vertical orientation (in flex container)

```html
<div class="pf-v6-l-flex">
  <div>Left content</div>
  <pfv6-divider orientation="vertical"></pfv6-divider>
  <div>Right content</div>
</div>
```

### With inset

```html
<pfv6-divider inset="insetMd"></pfv6-divider>
```

### Responsive orientation and inset

```html
<pfv6-divider
  orientation="horizontal md:vertical"
  inset="insetSm lg:insetLg">
</pfv6-divider>
```
