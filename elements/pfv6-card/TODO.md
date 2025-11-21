# pfv6-card - TODO

**Status**: 🟢 73% Visual Parity Achieved - 16 Fixable Issues Remaining

**Last Updated**: 11/21/2025, 5:55:00 PM

---

## 📊 Current Test Results

**116 out of 159 tests passing (73%)**

- ✅ **7 demos with perfect parity** across all browsers (21 tests)
- ✅ **95 additional passing tests** across other demos
- ❌ **16 fixable CSS/layout issues** (6 demos)
- 🚫 **27 blocked by missing components** (9 demos)

---

## ✅ Fixable Issues (16 tests to fix)

### 🔥 Priority 1: CSS/Layout Fixes ⏰ 4 hours

**Goal**: Fix all 6 unblocked demos → 132/159 tests passing (83%)

1. ❌ **`with-heading-element`** (Chromium only - ~20px diff)
   - **Issue**: Minor CSS spacing/margin mismatch
   - **Fix**: Adjust padding or check for browser-default h4 margins
   - **Time**: 30 min

2. ❌ **`with-modifiers`** (All 3 browsers - ~7000px diff)
   - **Issue**: Missing `isCompact`, `isLarge`, `isPlain`, `isFullHeight` modifiers
   - **Fix**: Add CSS classes for each modifier variant
   - **Time**: 2 hours

3. ❌ **`selectable`** (All 3 browsers - ~43000px diff)
   - **Issue**: Missing selection visual state (border, background)
   - **Fix**: Add `[selected]` or `[aria-selected]` styling
   - **Time**: 30 min

4. ❌ **`single-selectable`** (All 3 browsers - ~41000px diff)
   - **Issue**: Missing radio-style selection state
   - **Fix**: Same as `selectable`, ensure radio buttons styled
   - **Time**: 15 min

5. ❌ **`clickable-cards`** (All 3 browsers - ~48000px diff)
   - **Issue**: Missing `:hover`, `:focus`, `:active` states
   - **Fix**: Add interactive state CSS + `cursor: pointer`
   - **Time**: 30 min

6. ❌ **`clickable-selectable`** (All 3 browsers - ~55000px diff)
   - **Issue**: Combination of clickable + selectable not working
   - **Fix**: Combine both interactive and selection styles
   - **Time**: 15 min

**Action Plan**:
- [ ] Fix `with-heading-element` CSS spacing (30min)
- [ ] Add modifier CSS for `compact`, `large`, `plain`, `fullHeight` (2h)
- [ ] Add selection state styles (45min)
- [ ] Add clickable/interactive state styles (45min)

**Expected Result**: 16 more tests pass → 132/159 passing (83%)

---

## 🚫 Blocked Issues (27 tests - cannot fix yet)

**These demos require components that don't exist yet**:

1. 🚫 **`with-dividers`** - Requires `<pfv6-divider>` component
   - **Pixel Diff**: 8272px (Chromium)
   - **Blocker**: Missing divider component (React uses `<Divider />`)
   - **Status**: Will auto-fix when `<pfv6-divider>` is implemented

2. 🚫 **`expandable`** - Requires expandable toggle functionality
   - **Pixel Diff**: ~4780px (Chromium)
   - **Blocker**: Missing expand/collapse button component
   - **Status**: Needs `<pfv6-card-expandable-content>` + toggle button

3. 🚫 **`expandable-with-icon`** - Requires expandable + icon
   - **Pixel Diff**: ~4504px (Chromium)
   - **Blocker**: Same as expandable, plus icon support

4. 🚫 **`tile-cards`** - Requires tile card variant
   - **Pixel Diff**: ~39532px (Chromium)
   - **Blocker**: Missing tile layout/styling variant

5. 🚫 **`tile-multi`** - Requires tile + multi-select
   - **Pixel Diff**: ~39532px (Chromium)
   - **Blocker**: Missing tile variant + checkbox component

6. 🚫 **`header-in-card-head`** - Requires `<pfv6-card-header>` component
   - **Pixel Diff**: ~8700px (Chromium)
   - **Blocker**: Missing CardHeader sub-component

7. 🚫 **`with-image-and-actions`** - Requires CardHeader with slots
   - **Pixel Diff**: ~10363px (Chromium)
   - **Blocker**: Missing CardHeader component

8. 🚫 **`header-wraps`** - Requires CardHeader text wrapping
   - **Pixel Diff**: ~17828px (Chromium)
   - **Blocker**: Missing CardHeader component

9. 🚫 **`only-actions-in-card-head`** - Requires CardHeader actions
   - **Pixel Diff**: ~5341px (Chromium)
   - **Blocker**: Missing CardHeader component

> **Note**: Required components are tracked in `/NEXT_COMPONENTS.md`

---

## 📈 Progress Tracker

| Status | Tests Passing | Pass Rate |
|--------|---------------|-----------|
| **Current** | 116/159 | 73% |
| **After CSS Fixes** | 132/159 | 83% |
| **Achievable Maximum*** | 132/159 | 100%** |

\* Without building new components  
** 100% of achievable tests (27 tests blocked by missing components)

**Time to 100% achievable parity**: ~4 hours

---

## 🎯 Next Actions

1. **Fix `with-heading-element`** - Adjust CSS spacing (~30 min)
2. **Add modifier variants** - `compact`, `large`, `plain`, `fullHeight` (~2 hours)
3. **Add selection styles** - `selectable` and `single-selectable` (~45 min)
4. **Add interactive states** - `:hover`, `:focus`, `cursor: pointer` (~45 min)
5. **Document blockers** - Update `NEXT_COMPONENTS.md` (~15 min)
