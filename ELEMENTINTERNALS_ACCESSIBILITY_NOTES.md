# ElementInternals & Automated Accessibility Testing

## Executive Summary

PatternFly Elements v6 uses the **ElementInternals specification** to expose ARIA roles and semantic meaning for web components. This is the **correct** approach per web standards, but it creates a **known limitation** with automated accessibility testing tools.

**Key Point**: Components are **accessible** to screen readers and assistive technologies, but **automated testing tools report false positives** because they cannot yet read from ElementInternals.

---

## What is ElementInternals?

**ElementInternals** is a web standard API that allows custom elements to:
- Expose ARIA roles to the browser's accessibility tree
- Participate in forms (form-associated custom elements)
- Set accessibility properties without modifying the DOM

**Specification**: [WHATWG HTML Living Standard - ElementInternals](https://html.spec.whatwg.org/multipage/custom-elements.html#the-elementinternals-interface)

**Browser Support**: All modern browsers (Chrome, Firefox, Safari, Edge)

---

## Why PatternFly Elements Uses ElementInternals

### The Problem: Shadow DOM + Semantic HTML

React PatternFly can render semantic HTML directly in the Light DOM:

```tsx
// React PatternFly - Light DOM
<Gallery component="ul">
  <GalleryItem component="li">Item 1</GalleryItem>
  <GalleryItem component="li">Item 2</GalleryItem>
</Gallery>

// Renders as:
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>
```

Web components use Shadow DOM, which creates an encapsulation boundary. We **cannot** replicate this Light DOM structure:

```html
<!-- ❌ WRONG: Creates nested structure, breaks layout -->
<pfv6-gallery-item component="li">
  #shadow-root
    <li>  <!-- Extra DOM element! -->
      <slot></slot>
    </li>
</pfv6-gallery-item>
```

### The Solution: ElementInternals

Use `ElementInternals.role` to expose semantic meaning **without** rendering extra DOM elements:

```typescript
// pfv6-gallery-item.ts
export class Pfv6GalleryItem extends LitElement {
  static readonly formAssociated = true;
  
  @property({ type: String })
  component: 'div' | 'li' = 'div';
  
  private internals: ElementInternals;
  
  constructor() {
    super();
    this.internals = this.attachInternals();
  }
  
  updated(changed: PropertyValues): void {
    super.updated(changed);
    
    if (changed.has('component')) {
      if (this.component === 'li') {
        this.internals.role = 'listitem';  // ✅ Sets role without extra DOM
      } else {
        this.internals.role = null;
      }
    }
  }
  
  render() {
    return html`
      <div id="container">
        <slot></slot>
      </div>
    `;
  }
}
```

**Result**:
```html
<!-- DOM structure (what automated tools see): -->
<pfv6-gallery component="ul">
  <pfv6-gallery-item component="li">Item 1</pfv6-gallery-item>
</pfv6-gallery>

<!-- Accessibility tree (what screen readers see): -->
<pfv6-gallery role="list">
  <pfv6-gallery-item role="listitem">Item 1</pfv6-gallery-item>
</pfv6-gallery>
```

---

## The False Positive Problem

### What Automated Tools Check

Most automated accessibility testing tools (axe-core, Lighthouse, WAVE, Pa11y) check the **DOM** for ARIA attributes:

```javascript
// What automated tools do (simplified):
const element = document.querySelector('pfv6-gallery-item');
const role = element.getAttribute('role');  // ❌ Returns null

if (!role) {
  reportError('Element missing role attribute');  // FALSE POSITIVE!
}
```

### What They Miss

ElementInternals sets roles on the **accessibility tree**, not as DOM attributes:

```javascript
// What should happen (but tools don't do):
const element = document.querySelector('pfv6-gallery-item');
const role = element.internals?.role;  // ✅ Returns 'listitem'

// Or check the accessibility tree directly (requires browser APIs)
const axNode = window.getComputedAccessibleNode(element);
const role = axNode.role;  // ✅ Returns 'listitem'
```

### Why This Happens

1. **Historical reasons**: Automated tools predate ElementInternals (2020+ spec)
2. **DOM-based checking**: Tools parse the DOM, not the accessibility tree
3. **Browser API limitations**: Accessibility tree inspection requires privileged browser APIs
4. **Specification evolution**: ElementInternals is relatively new, tools haven't caught up

---

## Verification: How to Confirm Accessibility Works

### ✅ Method 1: Browser DevTools Accessibility Inspector

**Chrome/Edge**:
1. Open DevTools → Elements tab
2. Select the custom element (e.g., `<pfv6-gallery-item>`)
3. Open "Accessibility" pane (right sidebar)
4. Verify "Computed Properties" shows `role: listitem`

**Firefox**:
1. Open DevTools → Inspector tab
2. Select the custom element
3. Click "Accessibility" button
4. Verify "Role" shows `listitem`

**Safari**:
1. Enable Develop menu: Preferences → Advanced → Show Develop menu
2. Develop → Show Web Inspector → Elements tab
3. Select element → "Node" tab → "Accessibility" section
4. Verify role is present

### ✅ Method 2: Real Screen Readers

**NVDA (Windows)**:
```
1. Install NVDA (free)
2. Navigate to the component
3. NVDA should announce: "List with 5 items"
4. Arrow through items, NVDA announces: "Item 1 of 5"
```

**JAWS (Windows)**:
```
1. Install JAWS (commercial, trial available)
2. Navigate to the component
3. JAWS should announce: "List with 5 items"
4. Navigate with arrow keys
```

**VoiceOver (macOS/iOS)**:
```
1. Enable VoiceOver: Cmd+F5 (macOS) or Settings → Accessibility (iOS)
2. Navigate to the component
3. VoiceOver announces: "List, 5 items"
4. Use VO+Right Arrow to navigate items
```

**Orca (Linux)**:
```
1. Enable Orca screen reader
2. Navigate to the component
3. Orca announces: "List with 5 items"
```

### ✅ Method 3: Programmatic Verification

```javascript
// In browser console or test:
const gallery = document.querySelector('pfv6-gallery');
const item = document.querySelector('pfv6-gallery-item');

// Check ElementInternals (requires component to expose it)
console.log('Gallery role:', gallery.internals?.role);  // 'list'
console.log('Item role:', item.internals?.role);  // 'listitem'

// Check computed accessibility (Chrome only)
const axGallery = await window.getComputedAccessibleNode(gallery);
const axItem = await window.getComputedAccessibleNode(item);
console.log('Gallery accessible role:', axGallery.role);  // 'list'
console.log('Item accessible role:', axItem.role);  // 'listitem'
```

---

## What Automated Tools Will Report (False Positives)

### Example: axe-core

```
❌ WCAG 2.1 Level A (Serious)
   Elements must have appropriate roles
   
   Element: <pfv6-gallery component="ul">
   Issue: Element does not have a role attribute
   Impact: Serious
   
   Fix: Add role="list" attribute
```

**This is a FALSE POSITIVE** - the role IS present via ElementInternals, just not as a DOM attribute.

### Example: Lighthouse

```
❌ Accessibility: Elements with ARIA roles must use a valid, non-abstract ARIA role
   
   Element: <pfv6-gallery-item component="li">
   Issue: Missing role attribute
   
   Suggestions:
   - Add role="listitem" attribute to the element
```

**This is a FALSE POSITIVE** - the role IS present via ElementInternals.

### Example: WAVE

```
❌ Missing ARIA Role
   
   Location: <pfv6-gallery-item>
   Description: Element is missing an appropriate ARIA role
   
   Recommendation: Add role attribute
```

**This is a FALSE POSITIVE** - the role IS present via ElementInternals.

---

## Documentation Strategy for PatternFly Elements

### For Component Documentation

Add this notice to each component that uses ElementInternals:

```markdown
## Accessibility

This component uses the **ElementInternals** specification to expose ARIA roles to assistive technologies. While screen readers and browser accessibility inspectors will correctly identify the semantic structure, automated accessibility testing tools (axe-core, Lighthouse, WAVE) may report false positives because they cannot yet read from ElementInternals.

**Verification**:
- ✅ **Browser DevTools Accessibility Inspector** - Correctly shows `role="list"` and `role="listitem"`
- ✅ **Screen Readers (NVDA, JAWS, VoiceOver)** - Correctly announce semantic structure
- ❌ **Automated Testing Tools** - May report missing role attributes (false positive)

**Reference**: See [ElementInternals Accessibility Notes](./ELEMENTINTERNALS_ACCESSIBILITY_NOTES.md) for details.
```

### For "React vs LitElement" Comparison Documentation

Include a dedicated section:

```markdown
## Accessibility Implementation Differences

### Semantic HTML vs ElementInternals

**React PatternFly**:
- Renders semantic HTML directly (`<ul>`, `<li>`, `<article>`, etc.)
- ARIA roles implicit in HTML tags
- Automated a11y tools work perfectly

**PatternFly Elements (LitElement)**:
- Uses `ElementInternals.role` to expose semantic meaning
- DOM structure is encapsulated (Shadow DOM)
- Automated a11y tools report false positives (tool limitation, not component issue)

**Result**: Both approaches are **equally accessible** to users with disabilities. The difference is **only** in how automated tools analyze them.

### Verification

| Method | React PatternFly | PatternFly Elements |
|--------|------------------|---------------------|
| **Screen Readers** | ✅ Works | ✅ Works |
| **Browser DevTools** | ✅ Shows roles | ✅ Shows roles |
| **Automated Tools** | ✅ No issues | ⚠️ False positives |

**Recommendation for PatternFly Elements**: Use manual verification with browser DevTools accessibility inspector or real screen readers. Automated tool results should be reviewed for false positives related to ElementInternals.
```

---

## Future: When Will Automated Tools Support ElementInternals?

### Current Status (2025)

- **axe-core**: [Open issue](https://github.com/dequelabs/axe-core/issues/3221) tracking ElementInternals support
- **Lighthouse**: Uses axe-core, will inherit support when available
- **WAVE**: No public timeline for ElementInternals support
- **Pa11y**: Uses axe-core, will inherit support

### Workarounds (Not Recommended)

Some teams add redundant `role` attributes to satisfy automated tools:

```html
<!-- ❌ NOT RECOMMENDED: Redundant role attribute -->
<pfv6-gallery component="ul" role="list">
  <pfv6-gallery-item component="li" role="listitem">...</pfv6-gallery-item>
</pfv6-gallery>
```

**Why we don't do this**:
1. **Redundant**: ElementInternals already sets the role
2. **Maintenance burden**: Two sources of truth for roles
3. **Spec violation**: ElementInternals is the correct approach per web standards
4. **Temporary workaround**: Doesn't solve the underlying tool limitation

**Better approach**: Document the false positives and educate stakeholders about ElementInternals.

---

## Key Takeaways

1. ✅ **PatternFly Elements components ARE accessible** - Screen readers and assistive technologies work correctly
2. ✅ **ElementInternals IS the correct approach** - It's the web standard for custom element accessibility
3. ⚠️ **Automated tools WILL report false positives** - This is a tool limitation, not a component issue
4. ✅ **Manual verification IS required** - Use browser DevTools accessibility inspector or real screen readers
5. 📚 **Documentation IS critical** - Explain the false positives to prevent confusion

---

## References

- [WHATWG ElementInternals Specification](https://html.spec.whatwg.org/multipage/custom-elements.html#the-elementinternals-interface)
- [MDN: ElementInternals](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals)
- [axe-core Issue #3221: Support ElementInternals](https://github.com/dequelabs/axe-core/issues/3221)
- [Chrome Platform Status: ElementInternals](https://chromestatus.com/feature/5962105603751936)
- [W3C ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)

