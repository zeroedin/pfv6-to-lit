# Visual Regression Tests

Visual regression tests for PatternFly Elements v6 components, comparing Lit implementations against React PatternFly for 1:1 visual parity using **live pixel-perfect comparison**.

## Directory Structure

Tests are organized by component in separate subfolders:

```
tests/
├── visual/
│   ├── card/
│   │   ├── card-visual-parity.spec.ts
│   │   └── card-visual-parity.spec.ts-snapshots/  (gitignored)
│   ├── checkbox/
│   │   ├── checkbox-visual-parity.spec.ts
│   │   └── checkbox-visual-parity.spec.ts-snapshots/  (gitignored)
│   ├── gallery/
│   │   ├── gallery-visual-parity.spec.ts
│   │   └── gallery-visual-parity.spec.ts-snapshots/  (gitignored)
│   └── README.md
├── helpers/
│   └── discover-demos.ts  (dynamic demo discovery utility)
└── css-api/
    ├── card-api.spec.ts
    └── checkbox-api.spec.ts
```

## Test Files (Per Component)

### `{component}-visual-parity.spec.ts` ⭐ **THE CRITICAL TEST**

**Purpose**: Compare Lit demos against React demos **live** using pixel-perfect comparison

**How it Works**:
1. **Dynamically discovers demos** from `elements/pfv6-{component}/demo/*.html` (no hardcoded arrays!)
2. Opens both React and Lit test demos in the same test run
3. Takes fresh screenshots of both (as PNG Buffers)
4. Compares them pixel-by-pixel using `pixelmatch` library
5. Generates a diff image highlighting differences in red
6. Attaches all 3 images to Playwright report (React, Lit, Diff)

**Key Features**:
- ✅ **Direct comparison** - No baseline files stored on disk
- ✅ **Fresh renders every run** - Compares live React vs live Lit
- ✅ **Two browser pages** - Both demos rendered simultaneously
- ✅ **Pixel-perfect matching** - `threshold: 0` for exact comparison
- ✅ **Visual diff report** - Red pixels show exact differences
- ✅ **Dynamic demo discovery** - Tests automatically adapt to renamed/new demos

**Example Files**:
- `card/card-visual-parity.spec.ts` - Tests all card demos
- `checkbox/checkbox-visual-parity.spec.ts` - Tests all checkbox demos
- `gallery/gallery-visual-parity.spec.ts` - Tests all gallery demos

**Snapshot Directories**: 
- `{component}-visual-parity.spec.ts-snapshots/` (gitignored - regenerated on each machine)

## 🚨 CRITICAL: Dynamic Demo Discovery

All visual parity tests use the `discoverDemos()` helper to **automatically discover demos from the filesystem**.

**Helper Module**: `tests/helpers/discover-demos.ts`

```typescript
import { discoverDemos } from '../../helpers/discover-demos.js';

// Dynamically discover all demos from the filesystem
const litDemos = discoverDemos('card'); // Replace 'card' with component name
```

**Why This Matters**:
- ✅ Tests automatically pick up new demos (no manual updates needed)
- ✅ Tests automatically adapt to renamed demos (no "demo not found" errors)
- ✅ Single source of truth (filesystem, not hardcoded arrays)
- ✅ Consistent across all components

**How it Works**:
1. Reads `elements/pfv6-{component}/demo/` directory
2. Filters to `.html` files only
3. Removes `.html` extension from filenames
4. Returns sorted array of demo names
5. Throws clear error if no demos found

## Snapshot Organization

Playwright stores snapshots next to test files with a `.spec.ts-snapshots` suffix.

**Snapshot Naming**:
- Test name + demo name + browser + platform
- Example: `Parity-Tests---Lit-vs-React-Side-by-Side-Parity-basic-Lit-vs-React--1-chromium-darwin.png`

**All snapshot directories are gitignored** - they are regenerated on each machine and test run.

## Workflow

### 1. Start Development Server

```bash
killall node  # Kill any hanging node processes
npm run dev   # Start dev server with watch mode
```

Wait for server to be ready at `http://localhost:8000`

### 2. Run Parity Tests

```bash
# Run all visual parity tests
npm run e2e:parity

# Run specific component tests
npm run e2e:parity -- tests/visual/card/
npm run e2e:parity -- tests/visual/checkbox/
npm run e2e:parity -- tests/visual/gallery/
```

**What Happens**:
1. Dev server starts automatically (if not already running)
2. Tests discover demos dynamically from filesystem
3. Each test loads both React and Lit demos
4. Screenshots are taken and compared pixel-by-pixel
5. Diff images are generated for failures
6. All images are attached to Playwright report

### 3. View Test Results

```bash
npx playwright show-report
```

**Or visit**: `http://localhost:9323` (after tests complete)

**Report Features**:
- ✅ Shows all 3 images side-by-side:
  - **React (expected)** - Source of truth
  - **Lit (actual)** - Our implementation
  - **Diff (red pixels)** - Exact differences highlighted
- ✅ Click images to view full-size
- ✅ Filter by browser, status, or component
- ✅ See pixel difference counts

### 4. Run All E2E Tests

```bash
npm run e2e
```

Runs **all** tests:
- Visual parity tests (`tests/visual/*/`)
- CSS API tests (`tests/css-api/`)
- Diagnostic tests (`tests/diagnostics/`)

## Key Testing Principles

1. **Live Comparison, No Baselines** - Every run compares fresh React vs Lit renders
2. **Dynamic Demo Discovery** - Tests automatically find demos from filesystem
3. **Never Modify React Demos** - They're copied directly from PatternFly React GitHub
4. **All Visual Differences are Lit's Responsibility** - Fix Lit component, not React
5. **Zero-Threshold Matching** - Tests enforce pixel-perfect parity (threshold: 0)
6. **Three-Image Attachments** - React (expected), Lit (actual), Diff (red pixels)

## Debugging Visual Differences

When parity tests fail:

### Step 1: Open Playwright Report
```bash
npx playwright show-report
# Or visit http://localhost:9323
```

### Step 2: Click Failing Test
Navigate to the specific failing test to see details.

### Step 3: Examine All 3 Images

**React (expected)**:
- What the component **should** look like
- Source of truth from PatternFly React

**Lit (actual)**:
- What our Lit component **currently** renders
- Our implementation

**Diff (red pixels)**:
- **Red pixels** = differences between React and Lit
- **Black pixels** = identical pixels
- Pixel count shows exact number of differences

### Step 4: Identify Root Cause

Common issues:

**Missing CSS Variables**:
- Check if Lit CSS exposes same variables as React
- Validate against React CSS source: `node_modules/@patternfly/react-styles/css/components/{Component}/{component}.css`

**Incorrect Spacing/Layout**:
- Compare computed styles in browser DevTools
- Check for missing `box-sizing: border-box` reset
- Verify grid/flex gaps match React

**Missing Component Dependencies**:
- React uses `<Divider />`, Lit uses `<hr>` placeholder
- Document blocker in `elements/pfv6-{component}/TODO.md`
- Implement missing component, update demo

**Content Parity Violations**:
- Count React props vs Lit attributes (must match!)
- Verify text content matches character-for-character
- Check element counts (React: 8 items, Lit must have 8 items)

**Layout Integration Issues**:
- Slotted components adding unwanted spacing
- Override private layout variables using `::slotted(pfv6-component) { --_grid-gap: ... }`

### Step 5: Fix the Lit Component

**NEVER modify React demos** - always fix the Lit component:
- Update Lit component CSS
- Add missing CSS variables
- Fix layout properties
- Update demo content to match React

### Step 6: Re-run Tests

```bash
npm run e2e:parity -- tests/visual/{component}/
```

Verify the fix resolved the visual difference.

## Common Failure Categories & Solutions

### 1. ❌ Missing Component Dependencies
**Symptom**: React uses `<Divider />`, Lit uses `<hr>` placeholder  
**Root Cause**: Component not yet implemented  
**Solution**: Implement the missing component, update demo to use proper component  
**Example**: Card `with-dividers` blocked by missing `<pfv6-divider>`  
**Strategy**: Document blocker, leave test failing until component exists

### 2. ❌ CSS Variable Mismatches
**Symptom**: Colors, spacing, or sizing don't match React  
**Root Cause**: Missing or incorrect CSS variables in Lit component  
**Solution**: 
1. Open React CSS: `node_modules/@patternfly/react-styles/css/components/{Component}/{component}.css`
2. Compare variable names, values, and calculations line-by-line
3. Add missing variables using two-layer pattern
4. Validate computed styles in browser

**Example**: Missing `--pf-v6-c-card--BoxShadow` variable caused shadow mismatch

### 3. ❌ Content Parity Violations
**Symptom**: Different element counts, text content, or attribute counts  
**Root Cause**: Lit demo doesn't exactly match React demo content  
**Solution**: 
1. Open React demo side-by-side with Lit demo
2. **Count props/attributes** - numbers must match exactly
3. Verify text content (case-sensitive)
4. Check element counts (e.g., 8 gallery items, not 6)

**Example**: Gallery `alternative-components` had extra `has-gutter` attribute (React didn't have `hasGutter` prop)

### 4. ❌ Layout Integration Issues
**Symptom**: Slotted components have extra spacing (taller/wider than React)  
**Root Cause**: Slotted component's internal layout (grid gaps, padding) adds structural height  
**Solution**: Override private layout variables using `::slotted()`

```css
::slotted(pfv6-checkbox) {
  --_grid-gap: 0 var(--pf-t--global--spacer--gap--text-to-element--default);
}
```

**Example**: Nested checkboxes adding 8px row gap (should be 0)

### 5. ❌ Box-Sizing Issues
**Symptom**: Text reflow, width/height calculations differ from React  
**Root Cause**: Missing `box-sizing: border-box` reset in Shadow DOM  
**Solution**: Add mandatory reset to **every** component CSS file:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

**Why**: `box-sizing` is not inherited into Shadow DOM. React's base.css sets this globally, but Shadow DOM needs explicit reset.

## Browser-Specific Testing

Tests run across **3 browsers**:
- **Chromium** (Chrome, Edge)
- **Firefox**
- **WebKit** (Safari)

Each browser generates separate snapshots because:
- ✅ Font rendering differs between engines
- ✅ Sub-pixel rounding differs
- ✅ Default form control styling differs

**All 3 browsers must pass** for cross-browser compatibility.

**Safari-Specific Note**: Uses `requestAnimationFrame` fallback (no `requestIdleCallback` support).

## Test Reporting

### Playwright HTML Report

After running tests, view the interactive report:

```bash
npx playwright show-report
```

**Report URL**: `http://localhost:9323`

**Features**:
- ✅ Filter by status (passed, failed, flaky)
- ✅ Filter by browser (chromium, firefox, webkit)
- ✅ Filter by component or demo name
- ✅ View all 3 images (React, Lit, Diff) for each test
- ✅ See exact pixel difference counts
- ✅ Expand/collapse test groups
- ✅ Click images for full-size view

### Terminal Output

During test run, you'll see:
- ✅ Test discovery progress (how many demos found)
- ✅ Pass/fail status for each demo
- ✅ Pixel difference counts for failures
- ✅ Total test summary

## Adding Tests for New Components

When creating a new component:

1. **Create component demos** in `elements/pfv6-{component}/demo/*.html`
2. **Create visual parity test**: `tests/visual/{component}/{component}-visual-parity.spec.ts`
3. **Use dynamic discovery** - Import `discoverDemos()` helper
4. **Follow standard pattern** - Copy from existing test file (card, checkbox, or gallery)
5. **Run tests** - Demos are automatically discovered

**No manual array maintenance needed!**

## Key Differences from Old Strategy

### ❌ Old Strategy (Deprecated)
- Used hardcoded demo arrays in test files
- Stored React baseline screenshots on disk
- Compared Lit against stored baselines
- Required `rebuild:snapshots` to update baselines
- Tests broke when demos were renamed

### ✅ Current Strategy (Active)
- **Dynamic demo discovery** from filesystem
- **Live comparison** every run (no stored baselines)
- **Two browser pages** rendering simultaneously
- **pixelmatch** for pixel-perfect comparison
- **Three-image attachments** (React, Lit, Diff)
- Tests automatically adapt to filesystem changes

## Success Criteria

A component is considered **complete** when:

1. ✅ **All visual parity tests passing** (100% of demos)
2. ✅ **All browsers passing** (Chromium, Firefox, WebKit)
3. ✅ **Zero pixel differences** (threshold: 0)
4. ✅ **All demos discovered automatically** (no hardcoded arrays)

**Current Status**:
- **pfv6-checkbox**: ✅ 100% visual parity (10/10 demos passing)
- **pfv6-gallery**: ✅ 100% visual parity (6/6 demos passing)
- **pfv6-card**: 🟡 Partial parity (9/22 demos passing - 13 blocked by missing components)

---

**For detailed visual testing strategy and implementation patterns, see `CLAUDE.md` - "Visual Regression Testing" section.**

