# pfv6-card TODO

**Last Updated**: November 24, 2025  
**Status**: 🟡 **Partial Parity** - 9/22 demos passing (41%) after checkbox updates

---

## 📊 Visual Parity Test Results

**Test Run**: November 24, 2025 (after checkbox updates)  
**Total Demos**: 22  
**Passing**: 9 demos (41%) ← `with-modifiers` now uses `<pfv6-checkbox>`  
**Failing**: 13 demos (59%)  

### ✅ Passing Demos (9)

All browsers (Chromium, Firefox, WebKit):
1. ✅ `basic-cards` - Basic card structure works
2. ✅ `secondary-cards` - Secondary variant works
3. ✅ `with-body-section-fills` - Body fills work
4. ✅ `with-multiple-body-sections` - Multiple sections work
5. ✅ `with-only-body-section` - Single body section work
6. ✅ `with-no-footer` - Cards without footer work
7. ✅ `with-no-header` - Cards without header work
8. ✅ `with-heading-element` - Heading elements work
9. ✅ `with-modifiers` - **UPDATED** - Now uses `<pfv6-checkbox>`

---

## ❌ Failing Demos (13)

**🚨 CRITICAL FINDING**: After running dependency analysis, **ALL 13 failing demos are blocked by missing components**. None are pure CSS fixes!

**✅ PROGRESS**: `with-modifiers` now passing after replacing checkbox placeholders with `<pfv6-checkbox>`

### 🚫 Blocked by Missing Components (13 demos - 100% of failures)

#### 1. `with-dividers` - BLOCKED
**Blocker**: Requires `<pfv6-divider>` component  
**Current**: Using `<hr>` placeholder  
**Action**: Implement `<pfv6-divider>` component  

#### 2. `selectable` - BLOCKED
**Blocker**: Requires `<pfv6-gallery>` component (checkbox ✅ complete)  
**Current**: Using gallery placeholder, checkbox can be updated  
**Action**: Implement `<pfv6-gallery>`  

#### 3. `single-selectable` - BLOCKED
**Blocker**: Requires `<pfv6-gallery>` component (checkbox ✅ complete)  
**Current**: Using gallery placeholder, checkbox can be updated  
**Action**: Implement `<pfv6-gallery>`  

#### 4. `clickable-cards` - BLOCKED
**Blocker**: Requires `<pfv6-gallery>` component (checkbox ✅ complete)  
**Current**: Using gallery placeholder, checkbox can be updated  
**Action**: Implement `<pfv6-gallery>`  

#### 5. `clickable-selectable` - BLOCKED
**Blocker**: Requires `<pfv6-gallery>` + `<pfv6-button>` components (checkbox ✅ complete)  
**Current**: Using placeholders  
**Action**: Implement `<pfv6-gallery>` + `<pfv6-button>`  

#### 6. `expandable` - BLOCKED
**Blocker**: Requires `<pfv6-divider>` + `<pfv6-dropdown>` + dropdown sub-components (checkbox ✅ complete)  
**Current**: Using placeholders  
**Action**: Implement missing components  

#### 7. `expandable-with-icon` - BLOCKED
**Blocker**: Requires `<pfv6-divider>` + `<pfv6-dropdown>` + dropdown sub-components (checkbox ✅ complete)  
**Current**: Using placeholders  
**Action**: Implement missing components  

#### 8. `tile-cards` - BLOCKED
**Blocker**: Requires `<pfv6-gallery>` + `<pfv6-flex>` components  
**Current**: Using placeholders  
**Action**: Implement `<pfv6-gallery>` + `<pfv6-flex>`  

#### 9. `tile-multi` - BLOCKED
**Blocker**: Requires `<pfv6-gallery>` + `<pfv6-flex>` components  
**Current**: Using placeholders  
**Action**: Implement `<pfv6-gallery>` + `<pfv6-flex>`  

#### 10. `header-in-card-head` - BLOCKED
**Blocker**: Requires `<pfv6-divider>` + `<pfv6-dropdown>` + dropdown sub-components (checkbox ✅ complete)  
**Current**: Using placeholders  
**Action**: Implement missing components  

#### 11. `with-image-and-actions` - BLOCKED
**Blocker**: Requires `<pfv6-divider>` + `<pfv6-dropdown>` + `<pfv6-brand>` + dropdown sub-components (checkbox ✅ complete)  
**Current**: Using placeholders  
**Action**: Implement missing components  

#### 12. `header-wraps` - BLOCKED
**Blocker**: Requires `<pfv6-button>` component  
**Current**: Using placeholder  
**Action**: Implement `<pfv6-button>`  

#### 13. `only-actions-in-card-head` - BLOCKED
**Blocker**: Requires `<pfv6-divider>` + `<pfv6-dropdown>` + dropdown sub-components (checkbox ✅ complete)  
**Current**: Using placeholders  
**Action**: Implement missing components  

---

## 📋 Missing Component Summary

**Total Missing Components**: 10

**By Usage Frequency** (most critical first):

1. **`<pfv6-checkbox>`** - Used in 10 demos (71%) - **IN PROGRESS**
2. **`<pfv6-gallery>`** - Used in 6 demos (43%)
3. **`<pfv6-divider>`** - Used in 6 demos (43%)
4. **`<pfv6-dropdown>`** - Used in 5 demos (36%)
5. **`<pfv6-dropdown-list>`** - Used in 5 demos (36%)
6. **`<pfv6-dropdown-item>`** - Used in 5 demos (36%)
7. **`<pfv6-menu-toggle>`** - Used in 5 demos (36%)
8. **`<pfv6-menu-toggle-element>`** - Used in 5 demos (36%)
9. **`<pfv6-button>`** - Used in 2 demos (14%)
10. **`<pfv6-flex>`** - Used in 2 demos (14%)
11. **`<pfv6-brand>`** - Used in 1 demo (7%)

**Priority Order for Implementation**:
1. **`<pfv6-checkbox>`** (in progress) - Unblocks 10 demos
2. **`<pfv6-gallery>`** - Unblocks 6 demos
3. **`<pfv6-divider>`** - Unblocks 6 demos
4. **Dropdown family** (`<pfv6-dropdown>`, sub-components) - Unblocks 5 demos
5. **`<pfv6-button>`** - Unblocks 2 demos
6. **`<pfv6-flex>`** - Unblocks 2 demos
7. **`<pfv6-brand>`** - Unblocks 1 demo

---

## 🎯 Revised Action Plan

### Phase 1: Complete Checkbox ✅ COMPLETE
- [x] Checkbox component implemented (100% visual parity)
- [x] **Updated `with-modifiers` card demo** with `<pfv6-checkbox>`
- ✅ **Result**: 1 card demo unblocked (9/22 passing now)
- ⚠️ **Note**: Checkbox requires accessibility & form integration analysis before production use

### Phase 2: Implement Gallery (High Priority)
- [ ] Study React `<Gallery>` component
- [ ] Implement `<pfv6-gallery>`
- [ ] This will unblock 6 more card demos

### Phase 3: Implement Divider (High Priority)
- [ ] Study React `<Divider>` component
- [ ] Implement `<pfv6-divider>`
- [ ] This will unblock 6 more card demos (some overlap with Gallery)

### Phase 4: Implement Dropdown Family (Medium Priority)
- [ ] Study React `<Dropdown>` components
- [ ] Implement `<pfv6-dropdown>`, `<pfv6-dropdown-list>`, `<pfv6-dropdown-item>`
- [ ] Implement `<pfv6-menu-toggle>`, `<pfv6-menu-toggle-element>`
- [ ] This will unblock 5 more card demos

### Phase 5: Implement Button & Flex (Low Priority)
- [ ] Implement `<pfv6-button>` (2 demos)
- [ ] Implement `<pfv6-flex>` (2 demos)

### Phase 6: Implement Brand (Lowest Priority)
- [ ] Implement `<pfv6-brand>` (1 demo)

---

## 💡 Key Insights

**Dependency Analysis Revealed**:
- ✅ Zero demos are blocked by pure CSS issues
- ❌ 100% of failures (14/14) require missing components
- ⚠️ Initial assumption that these were "fixable" CSS issues was **incorrect**

**Implementation Strategy**:
- **Don't** try to fix these demos with workarounds
- **Do** implement missing components in priority order
- **Track** dependencies using `REACT_DEPENDENCIES.md` (generated by analysis script)

**Progress Projection**:
- After `<pfv6-checkbox>`: 18/22 passing (82%)
- After `<pfv6-gallery>`: 19/22 passing (86%)
- After `<pfv6-divider>`: 19/22 passing (86%)
- After all components: 22/22 passing (100%)

---

## 📝 Notes

- **Dependency Analysis**: Run `npx tsx scripts/analyze-react-demo-dependencies.ts Card` after any demo changes
- **Philosophy**: Tests should fail until dependencies exist - this validates API parity
- **No Workarounds**: Native HTML elements (`<hr>`, `<input>`) don't match PatternFly styling
- **Testing Command**: `npm run e2e:parity -- tests/visual/card/`
- **Report URL**: `http://localhost:9323` (after running tests)
- **Full Dependency Report**: See `REACT_DEPENDENCIES.md` in this directory

---

## 🚀 Success Criteria

**Definition of Done**:
- ✅ All 22 visual parity tests passing
- ✅ All missing components implemented
- ✅ CSS API matches React PatternFly 100%
- ✅ All interactive states work correctly

**Current Progress**: 41% complete (9/22 passing)  
**After Gallery**: 64% complete (14/22 passing)  
**100% Requires**: 9 additional components (Gallery, Divider, Dropdown family, Button, Flex, Brand)

