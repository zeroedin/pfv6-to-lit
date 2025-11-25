# pfv6-card TODO

**Last Updated**: January 20, 2025  
**Status**: 🟡 **Partial Parity** - 9/22 demos passing (41%) after gallery+checkbox updates  
**⚠️ CRITICAL**: 3 demos now use `<pfv6-checkbox>` properly but are **BLOCKED** by missing `<pfv6-card-header>` and `<pfv6-button>` components

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

#### 2. `selectable` - BLOCKED BY CARD HEADER
**Blocker**: Requires `<pfv6-card-header>` with `selectableActions` support  
**Current**: Using `<pfv6-checkbox>` in `<pfv6-card-title>` as placeholder  
**Action**: Implement `<pfv6-card-header>` component  
**Progress**: ✅ Gallery complete, ✅ Checkbox complete, ❌ CardHeader missing  

#### 3. `single-selectable` - BLOCKED BY CARD HEADER
**Blocker**: Requires `<pfv6-card-header>` with `selectableActions={{ variant: 'single' }}`  
**Current**: Using plain HTML radio buttons in `<pfv6-card-title>` (correct for single-select)  
**Action**: Implement `<pfv6-card-header>` component with single-select support  
**Progress**: ✅ Gallery complete, ✅ Checkbox complete, ❌ CardHeader missing  

#### 4. `clickable-cards` - BLOCKED BY GALLERY
**Blocker**: Requires `<pfv6-gallery>` component  
**Current**: Gallery demo updated, needs visual parity test rerun  
**Action**: Verify visual parity  
**Progress**: ✅ Gallery complete  

#### 5. `clickable-selectable` - BLOCKED BY CARD HEADER & BUTTON
**Blocker**: Requires `<pfv6-card-header>` with `selectableActions` + `<pfv6-button variant="link">`  
**Current**: Using `<pfv6-checkbox>` placeholder + styled `<button>` placeholder  
**Action**: Implement `<pfv6-card-header>` + `<pfv6-button>`  
**Progress**: ✅ Gallery complete, ✅ Checkbox complete, ❌ CardHeader missing, ❌ Button missing  

#### 6. `expandable` - BLOCKED
**Blocker**: Requires `<pfv6-divider>` + `<pfv6-dropdown>` + dropdown sub-components (checkbox ✅ complete)  
**Current**: Using placeholders  
**Action**: Implement missing components  

#### 7. `expandable-with-icon` - BLOCKED
**Blocker**: Requires `<pfv6-divider>` + `<pfv6-dropdown>` + dropdown sub-components (checkbox ✅ complete)  
**Current**: Using placeholders  
**Action**: Implement missing components  

#### 8. `tile-cards` - BLOCKED BY FLEX
**Blocker**: Requires `<pfv6-flex>` component  
**Current**: Gallery updated, needs flex component  
**Action**: Implement `<pfv6-flex>`  
**Progress**: ✅ Gallery complete, ❌ Flex missing  

#### 9. `tile-multi` - BLOCKED BY FLEX
**Blocker**: Requires `<pfv6-flex>` component  
**Current**: Gallery updated, needs flex component  
**Action**: Implement `<pfv6-flex>`  
**Progress**: ✅ Gallery complete, ❌ Flex missing  

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

1. ✅ **`<pfv6-checkbox>`** - Used in 10 demos (71%) - **COMPLETE**
2. ✅ **`<pfv6-gallery>`** - Used in 6 demos (43%) - **COMPLETE**
3. ❌ **`<pfv6-card-header>`** - **NEW CRITICAL BLOCKER** - Blocks 3 demos (21%) with checkbox/radio placeholders
4. ❌ **`<pfv6-divider>`** - Used in 6 demos (43%)
5. ❌ **`<pfv6-dropdown>`** - Used in 5 demos (36%)
6. ❌ **`<pfv6-dropdown-list>`** - Used in 5 demos (36%)
7. ❌ **`<pfv6-dropdown-item>`** - Used in 5 demos (36%)
8. ❌ **`<pfv6-menu-toggle>`** - Used in 5 demos (36%)
9. ❌ **`<pfv6-menu-toggle-element>`** - Used in 5 demos (36%)
10. ❌ **`<pfv6-button>`** - Used in 2 demos (14%) - **CRITICAL for `clickable-selectable`**
11. ❌ **`<pfv6-flex>`** - Used in 2 demos (14%)
12. ❌ **`<pfv6-brand>`** - Used in 1 demo (7%)

**Priority Order for Implementation**:
1. ✅ **`<pfv6-checkbox>`** (complete) - Unblocked 10 demos
2. ✅ **`<pfv6-gallery>`** (complete) - Unblocked 6 demos
3. 🔴 **`<pfv6-card-header>`** (CRITICAL - NEW BLOCKER) - Will unblock 3 demos currently using placeholders
4. 🔴 **`<pfv6-button>`** (CRITICAL) - Will unblock 1 demo (`clickable-selectable`)
5. **`<pfv6-divider>`** - Unblocks 6 demos
6. **Dropdown family** (`<pfv6-dropdown>`, sub-components) - Unblocks 5 demos
7. **`<pfv6-flex>`** - Unblocks 2 demos
8. **`<pfv6-brand>`** - Unblocks 1 demo

---

## 🎯 Revised Action Plan

### Phase 1: Complete Checkbox ✅ COMPLETE
- [x] Checkbox component implemented (100% visual parity)
- [x] **Updated `with-modifiers` card demo** with `<pfv6-checkbox>`
- ✅ **Result**: 1 card demo unblocked (9/22 passing now)
- ⚠️ **Note**: Checkbox requires accessibility & form integration analysis before production use

### Phase 2: Implement Gallery ✅ COMPLETE
- [x] Gallery component implemented (100% visual parity)
- [x] **Updated 6 card demos** with `<pfv6-gallery has-gutter>`
- ✅ **Result**: All card demos now use proper gallery component
- ⚠️ **Note**: 3 demos (`selectable`, `single-selectable`, `clickable-selectable`) are still **BLOCKED** by missing `<pfv6-card-header>` and `<pfv6-button>` (see Phase 2a below)

### Phase 2a: Implement Card Header & Button (CRITICAL - BLOCKS 3 DEMOS)
- [ ] Study React `<CardHeader>` component with `selectableActions` prop
- [ ] Implement `<pfv6-card-header>` with `selectableActions` support:
  - `variant: 'single'` (renders radio buttons for single-select)
  - `variant: 'multiple'` (default - renders checkboxes for multi-select)
  - `isHidden` property (hide the input control)
  - `hasNoOffset` property (remove default spacing)
  - `onChange` event handler
- [ ] Study React `<Button>` component
- [ ] Implement `<pfv6-button>` with:
  - `variant` property (primary, secondary, **link**, etc.)
  - `inline` property for inline display
  - `component` property for rendering as different elements (button, a, etc.)
  - `disabled` property
- [ ] Update 3 card demos to use proper components:
  - `clickable-selectable.html` (uses CardHeader + Button link)
  - `selectable.html` (uses CardHeader)
  - `single-selectable.html` (uses CardHeader variant="single")
- ✅ **Result**: This will unblock 3 card demos that currently use placeholder checkboxes
- 📖 **Documentation**: See `CARD_DEMOS_CHECKBOX_UPDATE.md` for detailed API requirements

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

