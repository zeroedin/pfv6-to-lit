# Testing Strategy - Visual Regression & CSS API Parity

**Last Updated**: January 21, 2025  
**Status**: ✅ Active - Direct Comparison Architecture

---

## 🎯 Goal

Achieve **1:1 visual parity** between Lit web components and PatternFly React components through automated pixel-perfect comparison.

**Core Principle**: React PatternFly is the source of truth. Our LitElement web components must match React PatternFly pixel-for-pixel.

---

## 📋 Test Suite Overview

### 1. Visual Parity Tests ⭐ **CRITICAL**
**File**: `tests/visual/card-visual-parity.spec.ts`  
**Purpose**: Validate 1:1 visual matching between Lit and React  
**Command**: `npm run e2e:parity`

#### How It Works
1. Opens **both** React and Lit test demos in the same test run
2. Captures live screenshots of both frameworks simultaneously
3. Decodes PNG buffers into pixel arrays using `pngjs`
4. Compares pixel-by-pixel using `pixelmatch` (threshold: 0 for exact matching)
5. Generates diff image highlighting differences in red
6. Attaches 3 images to report: React (expected), Lit (actual), Diff (red pixels)
7. Asserts `numDiffPixels === 0` for pixel-perfect match

#### Test Coverage
- **22 demos × 3 browsers = 66 tests per run**
- All demos use dedicated `/test/` routes (no page style interference)
- Examples: basic-cards, secondary-cards, with-modifiers, expandable, selectable, etc.

#### Success Criteria
- `numDiffPixels === 0` (pixel-perfect match)
- **Goal: 100% passing** (all 66 tests passing across 3 browsers)

#### When to Run
- After changing Lit component CSS
- After updating Lit component layout
- After fixing visual issues
- Before marking component as "complete"

#### Key Benefits
- ✅ **Live comparison**: Both frameworks render fresh in every test run
- ✅ **Pixel-perfect accuracy**: `threshold: 0` ensures exact matching
- ✅ **Clear visual debugging**: Red diff pixels show exactly where components differ
- ✅ **Precise metrics**: Exact pixel count of differences (e.g., "1247 pixels different")
- ✅ **In-memory comparison**: Fast, no file I/O overhead
- ✅ **Simple workflow**: One command captures everything

---

### 2. CSS API Parity Tests
**File**: `tests/css-api/card-api.spec.ts`  
**Purpose**: Validate CSS custom property API works identically in React and Lit  
**Command**: `npm run e2e` (runs all tests)

#### What It Tests
1. **CSS variable overrides**: Setting `--pf-v6-c-card--BackgroundColor` changes background in both React and Lit
2. **Computed style parity**: Same CSS variable values produce identical computed styles
3. **`unset` behavior**: Verifies Lit's two-layer pattern maintains defaults when variables are reset (Lit advantage!)
4. **Interactive states**: Hover, focus, active states produce identical styles

#### Success Criteria
- All computed styles must match between React and Lit
- CSS variable mutations must produce identical visual results
- Lit's resilience advantage (two-layer pattern) must be maintained

#### When to Run
- After changing CSS architecture (e.g., two-layer pattern)
- After adding new public CSS variables
- Before marking component as "complete"

---

### 3. React Consistency Test (Optional)
**File**: `tests/visual/card-visual-react-baseline.spec.ts`  
**Purpose**: Debugging tool to verify React demos render consistently  
**Command**: `npm run e2e:react-baseline`

#### Use Case
Validates that React demos themselves are stable across test runs. Useful when debugging unexpected test failures to isolate whether the issue is with Lit changes or React demo instability.

---

## 🚀 Workflow

### Initial Setup (First Time)
```bash
# 1. Start dev server
killall node
npm run dev &
sleep 10

# 2. Run parity tests (compares live Lit vs live React)
npm run e2e:parity

# 3. Analyze failures
npx playwright show-report
```

### Iterative Development
```bash
# 1. Fix Lit component (CSS, layout, etc.)

# 2. Re-run parity tests
npm run e2e:parity

# 3. Review screenshots and diffs in report
npx playwright show-report

# 4. Repeat until all tests pass
```

### Before Marking Component Complete
```bash
# Run all tests (parity + CSS API)
npm run e2e

# Verify:
# - All parity tests passing (Lit matches React pixel-perfect)
# - All CSS API tests passing (variable mutations work identically)
# - No visual differences between frameworks
```

---

## 🔧 Key Implementation Details

### Pixelmatch Library

**Dependencies**:
```bash
npm install --save-dev pixelmatch pngjs @types/pixelmatch @types/pngjs
```

**Core Comparison Logic**:
```typescript
// Decode PNG buffers
const reactPng = PNG.sync.read(reactBuffer);
const litPng = PNG.sync.read(litBuffer);

// Create diff image
const diff = new PNG({ width: reactPng.width, height: reactPng.height });

// Compare pixel-by-pixel (threshold: 0 = pixel-perfect)
const numDiffPixels = pixelmatch(
  reactPng.data,
  litPng.data,
  diff.data,
  reactPng.width,
  reactPng.height,
  { threshold: 0 } // 0 = exact match, 1 = very lenient
);

// Attach all 3 images
await test.info().attach('React (expected)', { body: reactBuffer, contentType: 'image/png' });
await test.info().attach('Lit (actual)', { body: litBuffer, contentType: 'image/png' });
await test.info().attach('Diff (red = different pixels)', { body: PNG.sync.write(diff), contentType: 'image/png' });

// Assert pixel-perfect match
expect(numDiffPixels).toBe(0);
```

**Why Pixelmatch?**
- ✅ Fast pixel-level comparison (handles large images efficiently)
- ✅ Generates visual diff with red pixels showing differences
- ✅ Configurable threshold (we use 0 for pixel-perfect)
- ✅ Returns exact pixel count of differences
- ✅ Works with PNG Buffers (no file I/O needed)

---

### Stability Features

**Full Load Detection** (`waitForFullLoad` helper):
```typescript
async function waitForFullLoad(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');  // Wait for network
  await page.evaluate(() => document.fonts.ready);  // Wait for fonts
  
  // Wait for all images to load
  await page.evaluate(() => {
    const images = Array.from(document.images);
    return Promise.all(
      images.map(img => img.complete ? Promise.resolve() : 
        new Promise(resolve => { img.onload = img.onerror = resolve; })
      )
    );
  });
  
  // CRITICAL: Wait for main thread to be idle
  await page.evaluate(() => {
    return new Promise<void>(resolve => {
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(() => resolve(), { timeout: 2000 });
      } else {
        // Fallback for Safari/WebKit
        requestAnimationFrame(() => {
          setTimeout(() => resolve(), 0);
        });
      }
    });
  });
}
```

**Why These Steps Matter**:
- `networkidle`: Ensures React has finished hydration
- `document.fonts.ready`: Prevents font loading flakiness
- Image loading: Prevents layout shifts from lazy-loaded images
- `requestIdleCallback`: Ensures Lit has finished rendering, prevents mid-render screenshots
- Safari fallback: `requestAnimationFrame` for browsers without `requestIdleCallback`

### Shadow DOM Access

**Accessing Shadow DOM Elements**:
```typescript
// Get styles from Shadow DOM internal elements
const litCard = page.locator('pfv6-card').first();
const containerBg = await litCard.evaluate(el => {
  const container = el.shadowRoot?.querySelector('#container');
  return container ? window.getComputedStyle(container).backgroundColor : null;
});
```

### CSS Variable Override Testing

**Apply overrides to both implementations**:
```typescript
const cssOverride = `
  .test-container pfv6-card,
  .test-container .pf-v6-c-card {
    --pf-v6-c-card--BackgroundColor: rgb(255, 0, 0);
    --pf-v6-c-card--BorderRadius: 20px;
  }
`;

await page.addStyleTag({ content: cssOverride });
```

---

## 📊 Test Output Structure

### Playwright Report
When tests run, Playwright generates an HTML report with:
- ✅ Pass/fail status for each test
- 📸 "React (expected)" screenshot attached
- 📸 "Lit (actual)" screenshot attached
- 🔴 "Diff (red = different pixels)" image showing exact differences
- 📊 Exact pixel count of differences (e.g., "Expected: 0, Received: 1247")

**View report**: `npx playwright show-report`

**Note**: Unlike Playwright's built-in snapshot diff slider, pixelmatch provides a standalone diff image. Red pixels show exactly where React and Lit differ, making debugging straightforward.

### Test File Structure
```
tests/
  ├── visual/
  │   ├── card-visual-parity.spec.ts              ← Primary test file
  │   ├── card-visual-react-baseline.spec.ts      ← Optional debugging
  │   └── card-visual-parity.spec.ts-snapshots/   ← Gitignored (Playwright default)
  └── css-api/
      ├── card-api.spec.ts                        ← CSS API tests
      └── card-api.spec.ts-snapshots/             ← Gitignored
```

**Note**: Playwright auto-generates `*.spec.ts-snapshots/` directories. These are gitignored and not used for comparison—pixelmatch does all comparison in-memory.

---

## 🎯 What Success Looks Like

### Visual Parity Tests
```
✅ Parity: basic-cards (Lit vs React) - chromium
✅ Parity: basic-cards (Lit vs React) - firefox
✅ Parity: basic-cards (Lit vs React) - webkit
✅ Parity: secondary-cards (Lit vs React) - chromium
...
✅ 66/66 tests passing (100%)
```

### CSS API Tests
```
✅ CSS variable override: BackgroundColor
✅ CSS variable override: BorderColor
✅ CSS variable reset: unset removes custom value
✅ Interactive states: hover produces identical styles
...
✅ All CSS API tests passing
```

---

## ❌ Common Failure Scenarios

### Scenario 1: Missing Components
**Symptom**: Large pixel differences (500-2500 pixels)  
**Example**: `multi-selectable-tiles` uses `<Checkbox>` in React, but Lit uses native `<input type="checkbox">`  
**Root Cause**: Missing `<pfv6-checkbox>` component  
**Solution**: 
- Document as "blocked" in `elements/pfv6-card/TODO.md`
- Add to `NEXT_COMPONENTS.md` for project-wide tracking
- **Do NOT apply CSS workarounds** - tests should fail until component exists

### Scenario 2: CSS/Layout Issues
**Symptom**: Small pixel differences (10-200 pixels)  
**Example**: Incorrect flexbox sizing, missing padding, wrong font size  
**Root Cause**: CSS mismatch between Lit and React  
**Solution**: Fix Lit component CSS to match React (inspect React computed styles as reference)

### Scenario 3: Browser Rendering Differences
**Symptom**: Consistent differences in one browser only (usually WebKit)  
**Example**: Font anti-aliasing, sub-pixel rendering  
**Root Cause**: Browser-specific rendering quirks  
**Solution**: Usually acceptable if difference is < 50 pixels and visual inspection shows no functional difference

### Scenario 4: CSS Variable API Mismatch
**Symptom**: CSS API test fails - computed styles don't match  
**Example**: React uses `rgba(0, 0, 0, 0)`, Lit uses `rgb(255, 255, 255)` after `unset`  
**Root Cause**: Missing or incorrect two-layer CSS variable pattern  
**Solution**: Implement two-layer pattern in Lit component CSS (see CLAUDE.md)

### Scenario 5: Flaky Screenshots
**Symptom**: Tests pass/fail inconsistently  
**Root Cause**: Screenshots taken before page fully loaded  
**Solution**:
- ✅ Always use `waitForFullLoad()` helper
- ✅ Ensure `requestIdleCallback` is working (check for Safari fallback)
- ✅ Run `killall node` before tests to clean hanging processes

---

## 📝 Key Principles

1. **React is the source of truth** - React defines what "correct" looks like
2. **Never modify React demos** - They are immutable, copied directly from PatternFly React GitHub
3. **Pixel-perfect matching** - Pixelmatch with `threshold: 0` ensures exact visual parity
4. **Live comparison** - Both frameworks render fresh in every test, eliminating stale data
5. **CSS API parity** - CSS variables must work identically in React and Lit
6. **Visual debugging** - Red diff pixels make discrepancies immediately obvious
7. **Test before complete** - Component is not done until `numDiffPixels === 0` for all demos

---

## 🛠️ Common Commands

```bash
# Kill hanging processes
killall node

# Start dev server
npm run dev &
sleep 10

# Run all E2E tests (parity + CSS API)
npm run e2e

# Run only parity tests
npm run e2e:parity

# Run only React baseline (debugging)
npm run e2e:react-baseline

# Run specific browser
npx playwright test tests/visual/ --project=chromium

# Debug mode (step through tests)
npx playwright test tests/visual/ --debug

# UI mode (interactive)
npx playwright test tests/visual/ --ui

# View test report
npx playwright show-report
```

---

## 📚 Best Practices

### For Component Authors

**When creating a new component**:
1. ✅ Copy React demos directly from PatternFly GitHub (never manually create)
2. ✅ Create corresponding Lit demos with same HTML structure (use kebab-case filenames)
3. ✅ Expose identical CSS variables as public API
4. ✅ Use two-layer CSS variable pattern for Shadow DOM
5. ✅ Test locally: `npm run e2e:parity`

**When updating a component**:
1. ✅ Update React demos first (from PatternFly GitHub - they're auto-synced on `npm install`)
2. ✅ Run parity tests: `npm run e2e:parity`
3. ✅ Fix Lit component until all tests pass
4. ✅ Commit changes (snapshots are gitignored)

### For Reviewers

**When reviewing PRs**:
1. ✅ Check Playwright test results
2. ✅ Review diff images for any failures
3. ✅ Verify React demos match PatternFly documentation
4. ✅ Ensure all Lit demos have corresponding React demos
5. ✅ Confirm CSS variables exposed match PatternFly API

---

## 🔗 Related Documentation

- **`CLAUDE.md`** - Complete workflow for creating new PatternFly components
- **`elements/pfv6-card/TODO.md`** - Current status and next steps
- **`NEXT_COMPONENTS.md`** - Missing components blocking tests
- **`tests/visual/README.md`** - Snapshot structure and Playwright defaults

---

## 📈 Success Metrics

**Visual parity is achieved when**:

1. ✅ **`numDiffPixels === 0`**: Pixelmatch reports zero different pixels
2. ✅ **100% pass rate**: All 66 visual tests passing (22 demos × 3 browsers)
3. ✅ **All demos covered**: Every React demo has corresponding Lit demo
4. ✅ **CSS variables work**: Overrides produce identical visual results
5. ✅ **Interactive states match**: Hover, focus, expanded states identical
6. ✅ **Stable tests**: Consistent results across multiple runs
7. ✅ **Fast feedback**: Full suite completes in < 5 minutes

