# pfv6-gallery TODO

## Tasks

### 1. Remove `minWidths` / `maxWidths` Properties from TypeScript

**Tasks**:
- [ ] Remove `minWidths` and `maxWidths` `@property()` declarations from `pfv6-gallery.ts`
- [ ] Remove responsive value converter logic (`createResponsiveConverter`, `forEachResponsiveValue`)
- [ ] Remove `this.style.setProperty()` calls in `updated()` lifecycle (lines 126-147)
- [ ] Update JSDoc to document CSS variable approach instead
- [ ] Update `lib/responsive-attributes.ts` usage (may no longer be needed for Gallery)

### 2. Re-test Visual Parity

**After removing properties, visual parity tests need re-running to ensure**:
- ✅ Layout behavior matches React (universal child selector works)
- ✅ Responsive breakpoints still function correctly (via CSS only)
- ✅ Gutter spacing matches React
- ✅ CSS variable customization still works

**Expected Results**:
- All 6 demos should still achieve 100% visual parity
- No visual regressions from property removal
- CSS-only responsive behavior works identically to React's JavaScript approach

---

## ⚠️ API Differences from React PatternFly

### Removed: `minWidths` and `maxWidths` Properties

**React Gallery API**:
```tsx
<Gallery 
  minWidths={{ md: '200px', lg: '300px' }}
  maxWidths={{ md: '400px', xl: '600px' }}
/>
```

**Our Implementation**: ❌ Properties removed

**Why This Deviation**:
1. **Lightdom CSS Principle**: Setting `this.style.setProperty()` in `updated()` modifies Light DOM HTML via JavaScript
2. **Web Component Best Practice**: Lightdom layout components should be pure CSS-driven, not JS-driven
3. **Follows `pfv6-flex` Pattern**: Flex layout uses attribute selectors for predefined tokens, not custom values

**How Users Achieve the Same Result**:

Users can still set responsive breakpoint widths using standard CSS:

**Option 1: Inline Style Attribute**
```html
<pfv6-gallery 
  style="
    --pf-v6-l-gallery--GridTemplateColumns--min-on-md: 200px;
    --pf-v6-l-gallery--GridTemplateColumns--min-on-lg: 300px;
    --pf-v6-l-gallery--GridTemplateColumns--max-on-xl: 600px;
  "
>
```

**Option 2: Page CSS**
```css
.my-gallery {
  --pf-v6-l-gallery--GridTemplateColumns--min-on-md: 280px;
  --pf-v6-l-gallery--GridTemplateColumns--max-on-xl: 400px;
}
```

**Benefits of This Approach**:
- ✅ Pure CSS control (no JavaScript setting inline styles)
- ✅ Respects lightdom CSS architecture
- ✅ Users have full flexibility via CSS variables
- ✅ Maintains declarative styling approach

**Trade-off**:
- ❌ Less ergonomic than React's object-based API
- ❌ Requires knowledge of PatternFly CSS variable naming

**Documentation Note**: When creating comparative docs for "PatternFly LitElements vs React PatternFly", document this as a conscious architectural choice for lightdom layout components.

