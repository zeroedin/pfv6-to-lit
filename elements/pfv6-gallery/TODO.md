# pfv6-gallery TODO

**Status**: ✅ 100% Visual Parity Achieved (18/18 tests passing)
**Last Updated**: 2025-11-25
**Test Run**: http://localhost:9323/#?q=gallery

---

## 🎉 100% Visual Parity Achieved!

All 18 visual parity tests passing across all browsers:
- ✅ **basic** - 100% parity (chromium, firefox, webkit)
- ✅ **with-gutters** - 100% parity (chromium, firefox, webkit)
- ✅ **adjusting-min-widths** - 100% parity (chromium, firefox, webkit)
- ✅ **adjusting-max-widths** - 100% parity (chromium, firefox, webkit)
- ✅ **adjusting-min-and-max-widths** - 100% parity (chromium, firefox, webkit)
- ✅ **alternative-components** - 100% parity (chromium, firefox, webkit)

---

## ✅ Completed Implementation Tasks

### Phase 1-7: Core Implementation
- [x] Created `pfv6-gallery` and `pfv6-gallery-item` components
- [x] Implemented all 6 Lit demos mirroring React demos
- [x] Applied two-layer CSS variable pattern correctly
- [x] Added `box-sizing: border-box` reset to all CSS files
- [x] Implemented responsive CSS variables with media query support
- [x] Created visual parity test suite

### Phase 8: Visual Parity Fixes
- [x] Fixed list reset styles for Shadow DOM compatibility
- [x] Fixed attribute/property count parity (`has-gutter` mismatch)
- [x] Fixed `display: contents` + text node issue (added `#container` wrapper)
- [x] Verified all CSS variable evaluations in responsive contexts

### Phase 9: ElementInternals for Semantic Roles
- [x] Implemented `ElementInternals` in `pfv6-gallery` for `role="list"`
- [x] Implemented `ElementInternals` in `pfv6-gallery-item` for `role="listitem"`
- [x] Removed dynamic tag rendering (always renders `<div>`, uses roles for semantics)
- [x] Verified accessibility tree exposes correct ARIA roles

---

## 🔍 Future Work: Accessibility Validation & Documentation

### ⚠️ Known Limitation: Automated A11y Tools & ElementInternals

**Issue**: Most automated accessibility testing tools (e.g., axe-core, Lighthouse, WAVE) **cannot yet read from ElementInternals**. This will cause **false positives** in automated audits even though the component is correctly exposing ARIA roles via the accessibility tree.

**What This Means**:
- ✅ **Screen readers WILL work correctly** - ElementInternals properly exposes roles to the browser's accessibility tree
- ❌ **Automated tools WILL report false positives** - They check the DOM, not the accessibility tree
- ⚠️ **Manual verification required** - Use browser DevTools accessibility inspector or actual screen readers

**Example False Positive**:
```html
<!-- What the DOM shows (automated tools see this): -->
<pfv6-gallery component="ul">  <!-- ❌ Tool sees: "No role attribute" -->
  <pfv6-gallery-item component="li">...</pfv6-gallery-item>  <!-- ❌ Tool sees: "No role attribute" -->
</pfv6-gallery>

<!-- What the Accessibility Tree shows (screen readers see this): -->
<pfv6-gallery role="list">  <!-- ✅ Screen reader sees: "list" role -->
  <pfv6-gallery-item role="listitem">...</pfv6-gallery-item>  <!-- ✅ Screen reader sees: "listitem" role -->
</pfv6-gallery>
```

### 📋 Future Documentation Needs

When creating comparative documentation for "PatternFly LitElements vs React PatternFly", document these key differences:

1. **Semantic HTML vs ElementInternals**:
   - **React**: Renders semantic HTML directly (`<ul>`, `<li>`, `<article>`, etc.)
   - **LitElement**: Uses `ElementInternals.role` to expose semantic meaning without rendering specific tags
   - **Why**: Shadow DOM encapsulation prevents nested Light DOM semantics
   - **Result**: Identical accessibility tree, different DOM structure

2. **Automated Testing Differences**:
   - **React**: Automated a11y tools work perfectly (can read semantic HTML)
   - **LitElement**: Automated a11y tools report false positives (can't read ElementInternals yet)
   - **Recommendation**: Use manual verification with browser DevTools accessibility inspector or real screen readers

3. **CSS Variable Resilience**:
   - **React**: CSS variables reset to transparent if unset (loses default styling)
   - **LitElement**: Two-layer pattern maintains token fallbacks even when variables are unset
   - **Result**: LitElement components are MORE resilient to dynamic CSS manipulation

4. **Shadow DOM vs Light DOM**:
   - **React**: Global styles, Light DOM, direct CSS targeting
   - **LitElement**: Encapsulated styles, Shadow DOM, `::slotted()` limitations
   - **Trade-off**: Better encapsulation vs more complex CSS for deeply nested content

---

## 🧠 Key Learnings Applied

### ElementInternals for Semantic Roles
- **When to use**: Component accepts `component` prop for alternative semantics (e.g., `ul`, `ol`, `article`)
- **Implementation**: `this.internals = this.attachInternals()` + `this.internals.role = 'list'`
- **Benefits**: 
  - No extra DOM elements (just `<div>` with role)
  - Proper accessibility tree representation
  - Matches React's semantic meaning without rendering specific tags
- **Limitation**: Automated a11y tools can't detect it (false positives expected)

### Display Contents + Text Nodes
- **Issue**: `display: contents` + bare `<slot></slot>` prevents text nodes from participating in grid/flex layouts
- **Solution**: Wrap slot in `<div id="container">` so text has an element wrapper
- **Result**: Text nodes can be grid items through their wrapper div

### Attribute/Property Count Parity
- **Critical**: Count React props, count Lit attributes - numbers must match
- **Example**: React `<Gallery component="ul">` (1 prop) = Lit `<pfv6-gallery component="ul">` (1 attribute)
- **Why**: Extra/missing attributes cause visual differences (spacing, layout)

### Two-Layer CSS Variable Pattern
- **Rule**: ALL internal CSS must use ONLY private variables (`--_*`)
- **Pattern**: Private vars in `:host` reference public API with fallbacks
- **Responsive**: Private vars redefined in `#container` within media queries
- **Benefit**: Maintains API parity while supporting dynamic re-evaluation

---

## 📊 Final Test Results

| Demo | chromium | firefox | webkit |
|------|----------|---------|--------|
| **basic** | ✅ | ✅ | ✅ |
| **with-gutters** | ✅ | ✅ | ✅ |
| **adjusting-min-widths** | ✅ | ✅ | ✅ |
| **adjusting-max-widths** | ✅ | ✅ | ✅ |
| **adjusting-min-and-max-widths** | ✅ | ✅ | ✅ |
| **alternative-components** | ✅ | ✅ | ✅ |

**Final Score**: 100% visual parity (18/18 tests passing)

---

## 🔗 Related Documentation

- `ELEMENTINTERNALS_ACCESSIBILITY_NOTES.md` - Complete guide to ElementInternals and automated a11y tool limitations
- `GALLERY_COMPLETION_SUMMARY.md` - Complete summary of 100% visual parity achievement
- `CARD_GALLERY_UPDATE_SUMMARY.md` - Documents the 6 card demo updates to use `<pfv6-gallery>`
- `pfv6-gallery.ts` - Component implementation with ElementInternals
- `pfv6-gallery-item.ts` - Item component with ElementInternals
- `pfv6-gallery.css` - Two-layer CSS variable pattern implementation
- `tests/visual/gallery/gallery-visual-parity.spec.ts` - Visual parity test suite
