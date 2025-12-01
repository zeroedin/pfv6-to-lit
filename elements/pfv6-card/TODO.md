# pfv6-card TODO

## Current Status

**Test Results** (2025-12-01):
- **26 passed / 40 failed** (39.4% pass rate)
- **Passing demos**: 8-9 basic/presentational demos work perfectly
- **Failing demos**: 13-14 demos blocked by missing components or fixable issues

---

## What Needs to Be Fixed

### 🔧 IMMEDIATE: Fix Checkbox Rendering (3-6 tests)

**Issue**: `selectable`, `single-selectable`, `clickable-selectable` have ~36k diff pixels

**Root Cause**: Visual styling of checkboxes in `<pfv6-card-header>` doesn't match React
- Boolean state management works correctly (after recent fix)
- But checkbox rendering/styling still differs

**Action**:
1. Compare React checkbox HTML/CSS with `<pfv6-card-header>` implementation
2. Fix CSS styling to match React exactly
3. Verify checkbox layout/spacing matches

**Impact**: Would fix 3 demos (potentially 9 tests if all browsers pass)

---

### ⏭️ BLOCKED: Missing Component Implementations (37 tests)

These demos cannot pass without implementing the required components:

#### 1. `<pfv6-dropdown>` - **HIGHEST PRIORITY**
- **Blocks**: 5 demos (15 tests = 22.7% of suite)
- **Demos**: clickable, expandable, expandable-with-icon, header-in-card-head, only-actions-in-card-head, with-image-and-actions
- **Next Step**: Follow `NEW_COMPONENT_CHECKLIST.md` to implement Dropdown

#### 2. `<pfv6-button>` - **HIGH PRIORITY**
- **Blocks**: 3 demos (9 tests = 13.6% of suite)
- **Demos**: clickable, clickable-selectable, header-wraps
- **Variants needed**: `primary`, `secondary`, `tertiary`, `link`
- **Attributes needed**: `inline`, `disabled`

#### 3. `<pfv6-icon>` + `<pfv6-flex>` - **MEDIUM PRIORITY**
- **Blocks**: 2 demos (6 tests = 9% of suite)
- **Demos**: tile, tile-multi

#### 4. `<pfv6-divider>` - **LOW PRIORITY**
- **Blocks**: 1 demo (3 tests = 4.5% of suite)
- **Demos**: with-dividers

#### 5. `<pfv6-brand>` - **LOW PRIORITY**
- **Blocks**: 1 demo (3 tests = 4.5% of suite)
- **Demos**: with-image-and-actions (also needs Dropdown)

---

## Progress Roadmap

### Step 1: Fix Checkbox Rendering
- **Impact**: +9 tests → 35/66 passing (53%)
- **Effort**: Low (CSS/HTML fix in existing component)

### Step 2: Implement `<pfv6-dropdown>`
- **Impact**: +15 tests → 50/66 passing (76%)
- **Effort**: High (new component with complex interactions)

### Step 3: Implement `<pfv6-button>`
- **Impact**: +9 tests → 59/66 passing (89%)
- **Effort**: Medium (new component, simpler than Dropdown)

### Step 4: Implement remaining components
- **Impact**: +7 tests → 66/66 passing (100%)
- **Effort**: Medium (Icon, Flex, Divider, Brand)

---

## Related Documentation

- `BOOLEAN_ATTRIBUTE_FIX_SUMMARY.md` - Recent boolean attribute fix
- `VISUAL_PARITY_ANALYSIS_METHODOLOGY.md` - How to analyze test failures
- Root `NEXT_COMPONENTS.md` - Project-wide component priorities
- Root `NEW_COMPONENT_CHECKLIST.md` - Process for creating new components
