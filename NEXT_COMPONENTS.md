# Next Components to Build

**Context**: Based on `pfv6-card` visual regression test analysis  
**Date**: 2025-11-19  
**Blocked Tests**: ~48-60 out of 81 (60-75%)

---

## Component Priority List

### 🔥 **Phase 1: High-Impact Form Inputs** (~2-3 days)

#### 1. `pfv6-checkbox`
**Blocks**: 4 demos, ~12 test failures  
**Complexity**: Low-Medium  
**PatternFly Docs**: https://www.patternfly.org/components/forms/checkbox  

**React**: `<Checkbox>` → **LitElement**: `<pfv6-checkbox>`

**Used In**:
- multi-selectable-tiles
- actionable-selectable
- modifiers
- header-images-actions

---

#### 2. `pfv6-radio`
**Blocks**: 2 demos, ~6 test failures  
**Complexity**: Low-Medium  
**PatternFly Docs**: https://www.patternfly.org/components/forms/radio  

**React**: `<Radio>` → **LitElement**: `<pfv6-radio>`

**Used In**:
- tiles
- single-selectable

---

#### 3. `pfv6-button`
**Blocks**: 1 demo, ~3 test failures  
**Complexity**: Low  
**PatternFly Docs**: https://www.patternfly.org/components/button  

**React**: `<Button>` → **LitElement**: `<pfv6-button>`

**Used In**:
- header-wraps

---

#### 4. Icon System
**Blocks**: 5 demos, ~15 test failures  
**Complexity**: Medium (architecture decision)  
**PatternFly Docs**: https://www.patternfly.org/design-foundations/icons  

**React**: `<EllipsisVIcon />`, `<PficonSatelliteIcon />` → **LitElement**: `<pfv6-icon icon="ellipsis-v">` or `<pfv6-icon-ellipsis-v>`

**Used In**:
- header-images-actions (EllipsisVIcon)
- header-without-title (EllipsisVIcon)
- title-inline (EllipsisVIcon)
- expandable (EllipsisVIcon)
- expandable-icon (PficonSatelliteIcon)

**Decision Needed**: Individual components vs single component with name attribute

---

### 💎 **Phase 2: Complex Interactive Components** (~1-2 weeks)

#### 5. `pfv6-dropdown` + `pfv6-menu-toggle`
**Blocks**: 4 demos, ~12 test failures  
**Complexity**: High (popover positioning, keyboard nav, state management)  
**PatternFly Docs**: https://www.patternfly.org/components/menus/dropdown  

**React**: `<Dropdown>`, `<MenuToggle>`, `<DropdownList>`, `<DropdownItem>` → **LitElement**: `<pfv6-dropdown>`, `<pfv6-menu-toggle>`, `<pfv6-dropdown-list>`, `<pfv6-dropdown-item>`

**Used In**:
- header-images-actions
- header-without-title
- title-inline
- expandable

---

#### 6. ✅ `pfv6-gallery` - **COMPLETE**
**Status**: Implemented  
**PatternFly Docs**: https://www.patternfly.org/layouts/gallery  

**React**: `<Gallery>`, `<GalleryItem>` → **LitElement**: `<pfv6-gallery>`, `<pfv6-gallery-item>`

**Implementation Complete**:
- Full component with sub-component (GalleryItem)
- Responsive min/max widths support
- All 6 React demos converted to Lit
- 3/6 demos passing visual parity tests
- 3 demos need minor CSS fixes (see `elements/pfv6-gallery/TODO.md`)

---

### 🎨 **Phase 3: Polish & Specialized** (~1-2 days)

#### 7. `pfv6-divider`
**Blocks**: 2 demos, ~6 test failures  
**Complexity**: Very Low  
**PatternFly Docs**: https://www.patternfly.org/components/divider  

**React**: `<Divider>` → **LitElement**: `<pfv6-divider>` or use `<hr>`

**Used In**:
- with-dividers
- header-images-actions

**Note**: Native `<hr>` already works for horizontal dividers

---

#### 8. `pfv6-brand`
**Blocks**: 1 demo, ~3 test failures  
**Complexity**: Very Low  
**PatternFly Docs**: https://www.patternfly.org/components/brand  

**React**: `<Brand>` → **LitElement**: `<pfv6-brand>` or use `<img class="pf-v6-c-brand">`

**Used In**:
- header-images-actions

**Note**: Native `<img>` works fine

---

#### 9. `pfv6-card-header` Refinement
**Blocks**: 0 (already works via slots)  
**Complexity**: Low  
**PatternFly Docs**: https://www.patternfly.org/components/card  

**React**: `<CardHeader>` → **LitElement**: `<pfv6-card-header>` (may need dedicated sub-component)

**Used In**:
- header-wraps
- header-images-actions
- header-without-title
- expandable
- expandable-icon
- title-inline

**Note**: Currently using `slot="header"` pattern, may need dedicated sub-component for full API parity

---

## Implementation Roadmap

### Week 1: Form Inputs
**Goal**: Unblock 7 demos, ~21 test failures
- Day 1-2: `pfv6-checkbox`
- Day 2-3: `pfv6-radio`
- Day 3-4: `pfv6-button`
- Day 4-5: Icon system decision + basic implementation

### Week 2-3: Complex Components
**Goal**: Unblock 9 more demos, ~27 test failures
- Week 2: `pfv6-dropdown` + `pfv6-menu-toggle` (complex)
- Week 3: `pfv6-gallery` or layout class system

### Week 4: Polish
**Goal**: Unblock remaining demos
- `pfv6-divider`
- `pfv6-brand`
- `pfv6-card-header` refinement
- Final visual regression pass

---

## Success Metrics

- **After Phase 1**: ~60% of blocked tests unblocked (~30 more tests passing)
- **After Phase 2**: ~90% of blocked tests unblocked (~48 more tests passing)
- **After Phase 3**: 100% test coverage, full React parity

---

## Notes

- All components should follow the same patterns established in `pfv6-card`:
  - Shadow DOM required
  - Two-layer CSS variable pattern
  - Sub-components where applicable
  - 1:1 React API parity
  - Comprehensive visual regression tests
  
- Priority is based on:
  1. Number of blocked demos
  2. Implementation complexity
  3. Foundational vs specialized

