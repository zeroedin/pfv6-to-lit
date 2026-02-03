# pfv6-jump-links

Jump links navigation component for PatternFly v6.

## Usage

```html
<pfv6-jump-links label="Jump to section" scrollable-selector="#content">
  <pfv6-jump-links-item href="#section1">Section 1</pfv6-jump-links-item>
  <pfv6-jump-links-item href="#section2">Section 2</pfv6-jump-links-item>
  <pfv6-jump-links-item href="#section3">Section 3</pfv6-jump-links-item>
</pfv6-jump-links>
```

## API Differences from React

### `labelId` prop removed

React's `labelId` prop is used for `aria-labelledby` referencing between the navigation element and label/toggle elements.

This web component removes `labelId` because Shadow DOM scopes element IDs to the shadow root, making them unreferenceable via IDREF attributes like `aria-labelledby` from outside the shadow boundary.

Instead, this component uses ElementInternals to set `ariaLabel` directly on the host element, avoiding cross-root ARIA issues entirely.

**React:**
```jsx
<JumpLinks labelId="my-label" label="Jump to section">
  ...
</JumpLinks>
```

**Web Component:**
```html
<!-- Uses accessible-label instead of labelId for accessible naming -->
<pfv6-jump-links accessible-label="Jump to section">
  ...
</pfv6-jump-links>
```

### `scrollableRef` prop not supported

React accepts both `scrollableRef` (a ref or callback) and `scrollableSelector` (a CSS selector string) to identify the scrollable container for scroll spy functionality.

This web component only supports `scrollableSelector` since refs are a React-specific concept.

**React:**
```jsx
<JumpLinks scrollableRef={myRef}>...</JumpLinks>
<JumpLinks scrollableSelector="#content">...</JumpLinks>
```

**Web Component:**
```html
<pfv6-jump-links scrollable-selector="#content">...</pfv6-jump-links>
```
