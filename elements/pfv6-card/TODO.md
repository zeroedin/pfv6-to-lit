# pfv6-card TODO

## Current Status

**Test Results** (Last run: 2025-12-04):
- **35 passed / 31 failed** (53% pass rate)
- **Note**: Re-run tests with updated `pfv6-gallery` lightdom CSS integration

---

## ⏭️ BLOCKED: Missing Component Implementations

### 1. `<pfv6-dropdown>` - **HIGHEST PRIORITY**
- **Blocks**: 5 demos (15 tests = 22.7% of suite)
- **Demos**: clickable, expandable, expandable-with-icon, header-in-card-head, only-actions-in-card-head, with-image-and-actions
- **Next Step**: Follow root `NEW_COMPONENT_CHECKLIST.md` to implement Dropdown

### 2. `<pfv6-button>` - **HIGH PRIORITY**
- **Blocks**: 3 demos (9 tests = 13.6% of suite)
- **Demos**: clickable, clickable-selectable, header-wraps
- **Variants needed**: `primary`, `secondary`, `tertiary`, `link`
- **Attributes needed**: `inline`, `disabled`

### 3. `<pfv6-icon>` - **MEDIUM PRIORITY**
- **Blocks**: 2 demos (6 tests = 9% of suite)
- **Demos**: tile, tile-multi

### 4. `<pfv6-brand>` - **LOW PRIORITY**
- **Blocks**: 1 demo (3 tests = 4.5% of suite)
- **Demos**: with-image-and-actions (also needs Dropdown)

---

## Progress Roadmap

1. **Implement `<pfv6-dropdown>`** → +15 tests → 47/66 passing (71%)
2. **Implement `<pfv6-button>`** → +9 tests → 56/66 passing (85%)
3. **Implement `<pfv6-icon>` & `<pfv6-brand>`** → +7 tests → 66/66 passing (100%)

---

## Related Documentation

- Root `NEXT_COMPONENTS.md` - Project-wide component priorities
- Root `NEW_COMPONENT_CHECKLIST.md` - Process for creating new components
- Root `VISUAL_PARITY_ANALYSIS_METHODOLOGY.md` - How to analyze test failures
