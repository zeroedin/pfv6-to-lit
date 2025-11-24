# Visual Regression Tests

Visual regression tests for PatternFly Elements v6 components, comparing Lit implementations against React PatternFly for 1:1 visual parity.

## Directory Structure

Tests are organized by component:

```
tests/visual/
├── card/
│   ├── card-visual-react-baseline.spec.ts
│   ├── card-visual-react-baseline.spec.ts-snapshots/
│   ├── card-visual-parity.spec.ts
│   └── card-visual-parity.spec.ts-snapshots/
├── checkbox/
│   ├── checkbox-visual-react-baseline.spec.ts
│   ├── checkbox-visual-react-baseline.spec.ts-snapshots/
│   ├── checkbox-visual-parity.spec.ts
│   └── checkbox-visual-parity.spec.ts-snapshots/
└── README.md
```

## Test Files (Per Component)

### `{component}-visual-react-baseline.spec.ts`
**Purpose**: Generate React baseline screenshots (source of truth)

Takes screenshots of official PatternFly React components. These serve as the reference for validating that our Lit components achieve pixel-perfect visual parity.

**Example**: `card/card-visual-react-baseline.spec.ts`  
**Snapshots**: `{component}-visual-react-baseline.spec.ts-snapshots/`

### `{component}-visual-parity.spec.ts`
**Purpose**: Compare Lit demos against React baselines (THE CRITICAL TEST)

Takes screenshots of both React and Lit demos, compares them pixel-by-pixel using `pixelmatch`, and attaches them to the Playwright report for visual inspection.

**Example**: `card/card-visual-parity.spec.ts`  
**Snapshots**: `{component}-visual-parity.spec.ts-snapshots/`

## Snapshot Organization

Playwright stores snapshots next to test files with a `.spec.ts-snapshots` suffix. Each snapshot includes:
- Demo name (e.g., `card-basic-cards`)
- Test type suffix (e.g., `-react`, `-lit`, `-default`, `-hover`)
- Browser name (e.g., `-chromium`, `-firefox`, `-webkit`)
- Platform (e.g., `-darwin`, `-linux`, `-win32`)

**Example**: `card-basic-cards-react-chromium-darwin.png`

All snapshot directories are gitignored and regenerated on each machine.

## Workflow

### Generate Fresh Baselines

```bash
npm run rebuild:snapshots
```

This cleans old snapshots and regenerates:
1. React baselines (`card-visual-react-baseline.spec.ts-snapshots/`)
2. Lit comprehensive tests (`card-visual.spec.ts-snapshots/`)

### Run Parity Tests

```bash
npm run e2e:parity
```

This:
1. Automatically rebuilds React baselines
2. Takes Lit demo screenshots
3. Compares Lit against its own baselines (consistency check)
4. Attaches both React and Lit screenshots to Playwright report
5. Provides side-by-side diff slider for manual inspection

### Run All E2E Tests

```bash
npm run e2e
```

Runs all visual tests across all browsers (Chromium, Firefox, WebKit).

## Key Testing Principles

1. **React baselines are the source of truth** for visual parity
2. **Never modify React demos** - they're copied directly from PatternFly React GitHub
3. **All visual differences are Lit's responsibility to fix**
4. **Zero-threshold matching** - tests enforce pixel-perfect parity

## Debugging Visual Differences

When parity tests fail:

1. **Open Playwright report**: `npx playwright show-report`
2. **Use the diff slider** to compare React (expected) vs Lit (actual)
3. **Fix the Lit component** CSS/layout to match React
4. **Re-run tests** to validate the fix

Visual differences indicate the Lit component needs adjustment, not the React baseline.

## Browser-Specific Snapshots

Tests run across 3 browsers:
- **Chromium** (Chrome, Edge)
- **Firefox**
- **WebKit** (Safari)

Each browser generates separate snapshots because rendering differences exist across engines. All must pass for cross-browser compatibility.

