# pfv6-card TODO

## Current Status

**Test Results** (2025-12-04):
- **35 passed / 31 failed** (53% pass rate)

---

## What Needs to Be Fixed

### ⏭️ BLOCKED: Missing Component Implementations (31 tests)

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

#### 3. `<pfv6-icon>` - **MEDIUM PRIORITY** ✅ `<pfv6-flex>` UNBLOCKED
- **Blocks**: 2 demos (6 tests = 9% of suite)
- **Demos**: tile, tile-multi
- **Note**: `<pfv6-flex>` is now implemented and integrated! Only `<pfv6-icon>` is needed.

#### 4. `<pfv6-brand>` - **LOW PRIORITY**
- **Blocks**: 1 demo (3 tests = 4.5% of suite)
- **Demos**: with-image-and-actions (also needs Dropdown)

---

## Progress Roadmap

### Step 1: Implement `<pfv6-dropdown>`
- **Impact**: +15 tests → 47/66 passing (71%)
- **Effort**: High (new component with complex interactions)

### Step 2: Implement `<pfv6-button>`
- **Impact**: +9 tests → 56/66 passing (85%)
- **Effort**: Medium (new component, simpler than Dropdown)

### Step 3: Implement remaining components
- **Impact**: +7 tests → 66/66 passing (100%)
- **Effort**: Medium (Icon, Flex, Brand)

---

## Related Documentation

- `BOOLEAN_ATTRIBUTE_FIX_SUMMARY.md` - Recent boolean attribute fix
- `VISUAL_PARITY_ANALYSIS_METHODOLOGY.md` - How to analyze test failures
- Root `NEXT_COMPONENTS.md` - Project-wide component priorities
- Root `NEW_COMPONENT_CHECKLIST.md` - Process for creating new components
