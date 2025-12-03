# pfv6-flex TODO 

## API Divergences from React PatternFly

### 1. Removed: `order` Property

**Status**: Intentionally removed (infinite dynamic values)

**React PatternFly API**:
```tsx
interface FlexProps {
  order?: {
    default?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
  };
}

// Usage
<Flex order={{ default: '1', lg: '-1' }}>
  <FlexItem order={{ default: '2' }}>Item</FlexItem>
</Flex>
```

**Why We Removed It**:
- The `order` property accepts **infinite possible values** (any integer: `1`, `2`, `-1`, `99`, etc.)
- In our Light DOM CSS architecture, we'd need to predefine CSS attribute selectors for every value:
  ```css
  pfv6-flex[order="1"] { --pf-v6-l-flex--item--Order: 1; }
  pfv6-flex[order="2"] { --pf-v6-l-flex--item--Order: 2; }
  pfv6-flex[order="-1"] { --pf-v6-l-flex--item--Order: -1; }
  /* Impossible to cover all integers! */
  ```
- Unlike predefined values like `spacer="md"` (which maps to `--pf-v6-l-flex--spacer--md`), numeric order values are unbounded

**Workaround: Use CSS Variables Directly**:

```html
<!-- Set order on pfv6-flex-item -->
<pfv6-flex-item style="--pf-v6-l-flex--item--Order: 1;">Item</pfv6-flex-item>

<!-- Set order on ANY child element -->
<pfv6-divider style="--pf-v6-l-flex--item--Order: 2;"></pfv6-divider>

<!-- Works because CSS reads from the variable -->
<!-- pfv6-flex > * { order: var(--pf-v6-l-flex--item--Order, 0); } -->
```

**Benefits**:
- ✅ Full control over any numeric value
- ✅ Works for arbitrary children (dividers, cards, any element)
- ✅ Matches how PatternFly CSS variables work
- ✅ Aligns with responsive CSS variable patterns

---

### 2. Removed: `component` Property

**Status**: Intentionally removed (architectural constraint)

**React PatternFly API**:
```tsx
<Flex component="ul">
  <FlexItem component="li">Item 1</FlexItem>
  <FlexItem component="li">Item 2</FlexItem>
</Flex>
```

**Compiled HTML Output (React)**:
```html
<ul class="pf-v6-l-flex">
  <li class="pf-v6-l-flex__item">Item 1</li>
  <li class="pf-v6-l-flex__item">Item 2</li>
</ul>
```

**Why We Removed It**:
- Light DOM architecture means no Shadow DOM and no processing of child elements
- There are no slots - children exist naturally in the DOM tree
- Without a `render()` method, the `component` property cannot change the element type

### Workaround: Use ARIA Roles for Semantic Structure

When semantic HTML structure is needed (e.g., lists), use ARIA roles:

**Light DOM Approach**:
```html
<pfv6-flex role="list">
  <pfv6-flex-item role="listitem">Item 1</pfv6-flex-item>
  <pfv6-flex-item role="listitem">Item 2</pfv6-flex-item>
</pfv6-flex>
```

**Benefits**:
- ✅ Provides same semantic meaning to assistive technologies
- ✅ Works with Light DOM architecture
- ✅ Standard HTML attribute (no custom implementation needed)

## Related React Demo

- **Demo**: `FlexAlternativeComponents.tsx`
- **React Usage**: `component="ul"` on Flex, `component="li"` on FlexItem
- **Our Approach**: Use `role="list"` and `role="listitem"` attributes when semantic structure is needed

## Decision Rationale

**The `component` property is not supported in our Light DOM architecture**:

We **could** implement `component` using Shadow DOM with a `render()` method, but that would:
- Require completely different CSS architecture
- Prevent universal child selectors (`pfv6-flex > *`)
- Add render overhead and potential CLS (Cumulative Layout Shift)
- Slow down client load times for layout elements that should be fast

**Our Choice**: Prioritize semantics over rendering flexibility.
- We use HTML as HTML - custom elements are what they are
- For semantic structure, users can apply standard `role` attributes
- For content composition, users just add children naturally
- This enables ANY element to participate in flex layout (matching React's `.pf-v6-l-flex > *` selector)

**Users can achieve the same goals by**:
1. **For content composition**: Just add children naturally
   - `<pfv6-flex-item><pfv6-card>...</pfv6-card></pfv6-flex-item>`
2. **For semantic structure**: Use manual `role` attributes
   - `<pfv6-flex role="list"><pfv6-flex-item role="listitem">...</pfv6-flex-item></pfv6-flex>`

**Trade-off Accepted**: Slight API divergence from React PatternFly, but with clear workaround using standard HTML attributes.

