# Testing Strategy - Visual Regression & CSS API Parity

**Last Updated**: January 21, 2025  
**Status**: ✅ Active - Direct Comparison Architecture

---

## 🎯 Goal

Achieve **1:1 visual parity** between Lit web components and PatternFly React components through automated pixel-perfect comparison.

**Core Principle**: React PatternFly is the source of truth. Our LitElement web components must match React PatternFly pixel-for-pixel.

---

## 🚨 STANDARDIZED VISUAL TEST PATTERN

**ALWAYS use this exact pattern for all visual parity tests. This is mandatory for consistency across all components.**

```typescript
import { test, expect, Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { discoverDemos } from '../../../tests/helpers/discover-demos.js';

// Helper to wait for full page load including main thread idle
async function waitForFullLoad(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);
  
  // Wait for all images to load
  await page.evaluate(() => {
    const images = Array.from(document.images);
    return Promise.all(
      images.map(img => img.complete ? Promise.resolve() : 
        new Promise(resolve => { img.onload = img.onerror = resolve; })
      )
    );
  });
  
  // CRITICAL: Wait for main thread to be idle (with Safari fallback)
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

// NOTE: Replace {component} with actual component name (e.g., pfv6-badge)
// This example shows the standardized pattern all components should follow.

// Dynamically discover all demos from the filesystem
const litDemos = discoverDemos('component-name'); // e.g., discoverDemos('badge')

test.describe('Parity Tests - Lit vs React Side-by-Side', () => {
  litDemos.forEach(demoName => {
    test(`Parity: ${demoName} (Lit vs React)`, async ({ page, browser }) => {
      // Set consistent viewport
      await page.setViewportSize({ width: 1280, height: 720 });
      
      // Open SECOND page for React demo
      const reactPage = await browser.newPage();
      await reactPage.setViewportSize({ width: 1280, height: 720 });
      
      try {
        // Load BOTH demos simultaneously
        await reactPage.goto(`/elements/pfv6-{component}/react/test/${demoName}`);
        await waitForFullLoad(reactPage);
        
        await page.goto(`/elements/pfv6-{component}/test/${demoName}`);
        await waitForFullLoad(page);
        
        // Take FRESH screenshots (no baseline files)
        const reactBuffer = await reactPage.screenshot({
          fullPage: true,
          animations: 'disabled'
        });
        
        const litBuffer = await page.screenshot({
          fullPage: true,
          animations: 'disabled'
        });
        
        // Decode and compare pixel-by-pixel
        const reactPng = PNG.sync.read(reactBuffer);
        const litPng = PNG.sync.read(litBuffer);
        
        expect(reactPng.width).toBe(litPng.width);
        expect(reactPng.height).toBe(litPng.height);
        
        const diff = new PNG({ width: reactPng.width, height: reactPng.height });
        
        const numDiffPixels = pixelmatch(
          reactPng.data,
          litPng.data,
          diff.data,
          reactPng.width,
          reactPng.height,
          { threshold: 0 } // Pixel-perfect (zero tolerance)
        );
        
        // Attach all 3 images to report
        await test.info().attach('React (expected)', {
          body: reactBuffer,
          contentType: 'image/png'
        });
        
        await test.info().attach('Lit (actual)', {
          body: litBuffer,
          contentType: 'image/png'
        });
        
        await test.info().attach('Diff (red = different pixels)', {
          body: PNG.sync.write(diff),
          contentType: 'image/png'
        });
        
        // Assert pixel-perfect match
        expect(numDiffPixels).toBe(0);
      } finally {
        await reactPage.close();
      }
    });
  });
});
```

**Why This Approach is Mandatory:**

✅ **Direct comparison** - No baseline files stored on disk  
✅ **Fresh renders every run** - Compares live React vs live Lit  
✅ **Two browser pages** - Both demos rendered simultaneously  
✅ **Pixel-perfect matching** - `threshold: 0` for exact comparison  
✅ **Visual diff report** - Red pixels show exact differences  
✅ **Three attachments** - React (expected), Lit (actual), Diff  
✅ **Consistent pattern** - All components use identical test structure

**What NOT to Do:**

❌ **Never** use `toMatchSnapshot()` - creates unnecessary snapshot files  
❌ **Never** store baseline files on disk - compares stale data  
❌ **Never** use single page navigation - creates timing issues  
❌ **Never** use different patterns per component - breaks consistency  

---

## 🔍 Demo Discovery Pattern

**All visual tests use dynamic demo discovery** rather than hardcoded demo lists.

### How It Works

```typescript
import { discoverDemos } from '../../../tests/helpers/discover-demos.js';

// Automatically finds all demo HTML files for the component
const litDemos = discoverDemos('badge');
// Returns: ['basic', 'with-border', 'size-variations', etc.]
```

### Why Dynamic Discovery?

✅ **Automatic detection** - New demos are automatically included in tests  
✅ **Rename-safe** - Renaming demo files updates tests automatically  
✅ **No maintenance** - No need to manually sync test file with demo list  
✅ **Prevents drift** - Impossible to forget to test a demo  

### Helper Location

The `discoverDemos()` helper is located at `tests/helpers/discover-demos.ts` and scans the component's `demo/` directory for HTML files.

---

## 📋 Test Suite Overview

### 1. Visual Parity Tests ⭐ **CRITICAL**
**Files**: `elements/pfv6-{component}/test/pfv6-{component}.visual.ts`  
**Example**: `elements/pfv6-badge/test/pfv6-badge.visual.ts`  
**Purpose**: Validate 1:1 visual matching between Lit and React  
**Command**: `npm run e2e:parity`

**🚨 ALWAYS USE THIS STANDARDIZED APPROACH**

This is the **mandatory pattern** for all visual parity tests. Never use baseline files, never use `toMatchSnapshot()`, always use direct live comparison with `pixelmatch`.

#### How It Works
1. Opens **two browser pages simultaneously** (React and Lit in the same test run)
2. Captures **live screenshots** of both frameworks at the same time (no stored baselines)
3. Decodes PNG buffers into pixel arrays using `pngjs`
4. Compares pixel-by-pixel using `pixelmatch` (threshold: 0 for exact matching)
5. Generates diff image highlighting differences in red
6. Attaches **3 images** to Playwright report: React (expected), Lit (actual), Diff (red pixels)
7. Asserts `numDiffPixels === 0` for pixel-perfect match

#### Test Coverage
- **All demos × 3 browsers** (chromium, firefox, webkit)
- All demos use dedicated `/test/` routes (no page style interference)
- Demos are automatically discovered from component `demo/` directories

#### Success Criteria
- `numDiffPixels === 0` (pixel-perfect match)
- **Goal: 100% passing** (all visual tests passing across all 3 browsers)

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
**Files**: `elements/pfv6-{component}/test/pfv6-{component}.css-api.ts`  
**Example**: `elements/pfv6-avatar/test/pfv6-avatar.css-api.ts`  
**Purpose**: Validate CSS custom property API works identically in React and Lit  
**Command**: `npm run e2e` (runs all tests)

#### What It Tests
1. **CSS variable overrides**: Setting `--pf-v6-c-card--BackgroundColor` changes background in both React and Lit
2. **Computed style parity**: Same CSS variable values produce identical computed styles
3. **Interactive states**: Hover, focus, active states produce identical styles

#### Success Criteria
- All computed styles must match between React and Lit
- CSS variable mutations must produce identical visual results

#### When to Run
- After changing CSS architecture or variable implementation
- After adding new public CSS variables
- Before marking component as "complete"

---

### 3. React Consistency Test (Deprecated - Not Needed)
**Status**: ⚠️ **No longer necessary with direct comparison approach**

With the standardized visual testing pattern, we compare live React vs live Lit in every test run. React baseline tests are no longer needed because:
- ✅ Both frameworks render fresh on every test
- ✅ Any React demo changes are immediately detected
- ✅ No stale baseline files to maintain
- ✅ Simpler, more reliable testing workflow

**Note**: If you see `*-visual-react-baseline.spec.ts` files in the codebase, they can be deleted. All components should use only the parity test pattern.

---

## 🚀 Workflow

### Initial Setup (First Time)

**Note:** E2E tests require the dev server running on port 8000. Ensure no other process is using this port before starting tests.

```bash
# 1. Start dev server (runs on port 8000)
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

Tests are co-located with component source code:

```
elements/
  ├── pfv6-badge/
  │   ├── pfv6-badge.ts           # Component implementation
  │   ├── pfv6-badge.css          # Component styles
  │   ├── demo/                    # Component demos
  │   └── test/
  │       ├── pfv6-badge.spec.ts      # Unit tests (web-test-runner)
  │       ├── pfv6-badge.visual.ts    # Visual parity tests (Playwright)
  │       └── pfv6-badge.css-api.ts   # CSS API tests (Playwright)
  ├── pfv6-avatar/
  │   └── test/
  │       ├── pfv6-avatar.spec.ts
  │       ├── pfv6-avatar.visual.ts
  │       └── pfv6-avatar.css-api.ts
tests/
  └── helpers/
      └── discover-demos.ts        # Demo discovery helper for visual tests
```

**Key Points:**
- ⭐ **Tests are co-located** with component source in `elements/pfv6-{component}/test/`
- 🧪 **Three test types**: `.spec.ts` (unit), `.visual.ts` (parity), `.css-api.ts` (CSS API)
- 📁 **Snapshot directories are auto-generated** by Playwright but not used for comparison
- 🚫 **All `*-snapshots/` directories are gitignored** - pixelmatch does comparison in-memory
- 🔍 **Demo discovery** is automated via `tests/helpers/discover-demos.ts`

---

## 🎯 What Success Looks Like

### Visual Parity Tests
```
✅ Parity: basic-cards (Lit vs React) - chromium
✅ Parity: basic-cards (Lit vs React) - firefox
✅ Parity: basic-cards (Lit vs React) - webkit
✅ Parity: secondary-cards (Lit vs React) - chromium
...
✅ All tests passing (100%)
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
**Root Cause**: Incorrect CSS variable cascade or missing fallback values  
**Solution**: Update Lit component CSS to match React's CSS variable implementation and fallback patterns

### Scenario 5: Flaky Screenshots
**Symptom**: Tests pass/fail inconsistently  
**Root Cause**: Screenshots taken before page fully loaded  
**Solution**:
- ✅ Always use `waitForFullLoad()` helper
- ✅ Ensure `requestIdleCallback` is working (check for Safari fallback)
- ✅ Ensure port 8000 is available (stop any existing dev server before running tests)

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

**Note:** Ensure port 8000 is available before starting the dev server.

```bash
# Start dev server (runs on port 8000)
npm run dev &
sleep 10

# Run all E2E tests (parity + CSS API)
npm run e2e

# Run only parity tests
npm run e2e:parity

# Run specific component tests
npx playwright test tests/visual/card/ --project=chromium
npx playwright test tests/visual/checkbox/ --project=chromium

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
4. ✅ Ensure CSS variable cascades match React's implementation
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
2. ✅ **100% pass rate**: All visual tests passing across all 3 browsers
3. ✅ **All demos covered**: Every React demo has corresponding Lit demo
4. ✅ **CSS variables work**: Overrides produce identical visual results
5. ✅ **Interactive states match**: Hover, focus, expanded states identical
6. ✅ **Stable tests**: Consistent results across multiple runs
7. ✅ **Fast feedback**: Full suite completes in < 5 minutes

