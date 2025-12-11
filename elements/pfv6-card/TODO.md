# pfv6-card TODO

## 🚨 NEXT ACTIONS

1. Implement `<pfv6-dropdown>` - Highest priority blocker
2. Implement `<pfv6-button>` - High priority blocker  
3. Implement `<pfv6-icon>` - Medium priority blocker
4. Fix `with-heading-element` CSS spacing (20px diff in Chromium only)

---

## ⏭️ BLOCKED: Missing Components

### `<pfv6-dropdown>` - Blocks 5 demos (15 tests)
- `expandable`
- `expandable-with-icon`
- `header-in-card-head`
- `only-actions-in-card-head`
- `with-image-and-actions`

### `<pfv6-button>` - Blocks 3 demos (9 tests)
- `clickable-selectable`
- `header-wraps`
- Overlaps with dropdown demos

**Required variants**: `primary`, `secondary`, `tertiary`, `link`
**Required attributes**: `inline`, `disabled`

### `<pfv6-icon>` - Blocks 2 demos (6 tests)
- `tile`
- `tile-multi`

---

## Expected Results

- **Current**: 35/66 passing (53%)
- **After dropdown**: ~50/66 passing (76%)
- **After button**: ~59/66 passing (89%)
- **After icon**: ~65/66 passing (98%)
- **After CSS fix**: 66/66 passing (100%)

---

## Related Documentation

- Root `NEXT_COMPONENTS.md` - Project-wide component priorities
- Root `NEW_COMPONENT_CHECKLIST.md` - Process for creating new components
- Root `VISUAL_PARITY_ANALYSIS_METHODOLOGY.md` - How to analyze test failures
