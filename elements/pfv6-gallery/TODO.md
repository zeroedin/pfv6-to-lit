# pfv6-gallery TODO

**Status**: ✅ Refactored to Lightdom CSS (Previously: 100% Visual Parity Achieved)
**Last Updated**: 2025-01-21
**Implementation**: Lightdom CSS Layout Component (No Shadow DOM)

---

## 🔄 Recent Refactor: Shadow DOM → Lightdom CSS

**Why**: Gallery is a layout component that should use PatternFly's universal child selector pattern (`.pf-v6-l-gallery > *`) to style ANY child element, matching React PatternFly's flexibility.

**Changes Made**:
- ✅ Removed Shadow DOM (`createRenderRoot()` returns `this`)
- ✅ Removed `render()` method - children exist naturally in Light DOM
- ✅ Created `pfv6-gallery-lightdom.css` - all styles moved to separate CSS file
- ✅ Removed CSS imports from TypeScript files
- ✅ Properties now use `reflect: true` - attributes drive CSS selectors
- ✅ CSS variables set directly on element style (not internal container)
- ✅ Updated all demo files to include lightdom CSS link
- ✅ Updated unit tests to work with Light DOM

**Previous Status** (Shadow DOM implementation):
- ✅ 100% Visual Parity Achieved (18/18 tests passing)
- All 6 demos passing across chromium, firefox, webkit

---

## ✅ Completed Implementation Tasks

### Phase 1-9: Original Shadow DOM Implementation (Completed 2025-11-25)
- [x] Created `pfv6-gallery` and `pfv6-gallery-item` components with Shadow DOM
- [x] Implemented all 6 Lit demos mirroring React demos
- [x] Applied two-layer CSS variable pattern
- [x] Achieved 100% visual parity (18/18 tests passing)
- [x] Implemented `ElementInternals` for semantic roles (`role="list"`, `role="listitem"`)

### Phase 10: Lightdom CSS Refactor (Completed 2025-01-21)
- [x] Removed Shadow DOM from both `pfv6-gallery` and `pfv6-gallery-item`
- [x] Created `pfv6-gallery-lightdom.css` - all styles in single file
- [x] Removed CSS imports from TypeScript files
- [x] Added `reflect: true` to all properties
- [x] CSS variables now set on element style in `updated()` lifecycle
- [x] Updated all 6 demo HTML files to include lightdom CSS link
- [x] Updated unit tests to work with Light DOM (removed `shadowRoot` references)
- [x] Deleted old Shadow DOM CSS files

---

## 🔍 Next Steps: Re-test Visual Parity

### ⚠️ Visual Parity Tests Need Re-running

After the lightdom refactor, visual parity tests need to be re-run to ensure:
- ✅ Layout behavior matches React (universal child selector works)
- ✅ Responsive breakpoints still function correctly
- ✅ Gutter spacing matches React
- ✅ CSS variable customization still works

**Expected Results**:
- All 6 demos should still achieve 100% visual parity
- No visual regressions from Shadow DOM → Lightdom CSS transition

### ⚠️ Known Limitation: Automated A11y Tools & ElementInternals

**Still Applies**: ElementInternals for semantic roles (`role="list"`, `role="listitem"`) is preserved in the lightdom refactor.

**Issue**: Most automated accessibility testing tools (e.g., axe-core, Lighthouse, WAVE) **cannot yet read from ElementInternals**. This will cause **false positives** in automated audits even though the component is correctly exposing ARIA roles via the accessibility tree.

**What This Means**:
- ✅ **Screen readers WILL work correctly** - ElementInternals properly exposes roles to the browser's accessibility tree
- ❌ **Automated tools WILL report false positives** - They check the DOM, not the accessibility tree
- ⚠️ **Manual verification required** - Use browser DevTools accessibility inspector or actual screen readers

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

### Lightdom CSS Pattern (Replaces Shadow DOM)
- **Pattern**: Layout components use Light DOM to allow universal child selector (`.pf-v6-l-gallery > *`)
- **CSS File**: All styles in `pfv6-gallery-lightdom.css` (users must include manually)
- **No render() method**: Children exist naturally in Light DOM
- **CSS Variables**: Set on element style via `this.style.setProperty()` in `updated()`
- **Benefits**:
  - ANY child element can participate in layout (matches React flexibility)
  - Natural pseudo-classes (`:last-child`, `:first-child`) work without workarounds
  - Simpler TypeScript (no `classMap()`, `styleMap()`, or render logic)

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

## 📊 Test Results

### Previous Shadow DOM Implementation (2025-11-25)
| Demo | chromium | firefox | webkit |
|------|----------|---------|--------|
| **basic** | ✅ | ✅ | ✅ |
| **with-gutters** | ✅ | ✅ | ✅ |
| **adjusting-min-widths** | ✅ | ✅ | ✅ |
| **adjusting-max-widths** | ✅ | ✅ | ✅ |
| **adjusting-min-and-max-widths** | ✅ | ✅ | ✅ |
| **alternative-components** | ✅ | ✅ | ✅ |

**Score**: 100% visual parity (18/18 tests passing)

### Post-Refactor Lightdom CSS Implementation (2025-01-21)
⚠️ **Tests need to be re-run** after lightdom refactor to verify:
- Layout still matches React
- Responsive behavior preserved
- Gutter spacing correct
- CSS variable customization works

---

## 🔗 Related Documentation

- `CLAUDE.md` - See "Layout Component Exception - Lightdom CSS Approach" section
- `ELEMENTINTERNALS_ACCESSIBILITY_NOTES.md` - Complete guide to ElementInternals and automated a11y tool limitations
- `pfv6-gallery.ts` - Lightdom implementation (no Shadow DOM, no render method)
- `pfv6-gallery-item.ts` - Lightdom item component (no Shadow DOM, no render method)
- `pfv6-gallery-lightdom.css` - All styles in single CSS file (users must include manually)
- `elements/pfv6-flex/` - Reference implementation for lightdom CSS pattern
- `tests/visual/gallery/gallery-visual-parity.spec.ts` - Visual parity test suite (needs re-run)
