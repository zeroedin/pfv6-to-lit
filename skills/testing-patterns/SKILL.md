---
name: testing-patterns
description: Testing conventions for pfe-v6 components including unit tests (web-test-runner + Chai), visual parity tests (Playwright + pixelmatch), and CSS API tests. Use when writing or editing test files.
---

# Testing Patterns

## Test File Locations

```
elements/pfv6-{component}/test/
  pfv6-{component}.spec.ts      # Unit tests
  pfv6-{component}.visual.ts    # Visual parity tests
  pfv6-{component}.css-api.ts   # CSS API tests
```

## Unit Tests (spec.ts)

### Setup

```typescript
import { html, fixture } from '@open-wc/testing-helpers';
import { userEvent } from 'vitest/browser';
import { Pfv6{Component} } from '../pfv6-{component}.js';
import '../pfv6-{component}.js';
```

**Config**: `globals: true` — `describe`/`it`/`expect` available globally (no imports needed).

### Assertion Style

**ALWAYS Chai-style**: `.to.equal`, `.to.be.true`, `.to.exist`, `.to.be.an.instanceof`

**NEVER Jest-style**: `.toBe`, `.toBeDefined`, `.toEqual`

### Required Test Suites

1. **Instantiation**: `document.createElement` + `fixture` upgrade tests
2. **Property API**: Every React prop → default value, type acceptance, reflection
3. **Event API**: Every React callback → event dispatch, data as class fields (NOT `detail`)
4. **Slots**: Default and named slots exist, content renders
5. **ElementInternals** (if applicable): `accessibleLabel` → `ariaLabel`, `component` → role
6. **Sub-components** (if applicable): Children render and accept props

### Event Testing

Events extend `Event` (not `CustomEvent`). Data as class fields:

```typescript
el.addEventListener('expand', (e) => {
  capturedEvent = e as Pfv6ExpandEvent;
});
// ...
expect(capturedEvent!.expanded).to.be.true; // class field
// NEVER: expect(capturedEvent.detail.expanded)
```

### Anti-patterns

- NEVER use sinon — use native event capture patterns
- NEVER test CSS classes directly (internal implementation)
- NEVER test private/internal details
- NEVER skip default value tests

## Visual Parity Tests (visual.ts)

### Pattern

```typescript
import { test, expect, type Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { discoverDemos } from '../../../tests/helpers/discover-demos.js';
```

### Key Requirements

- **Dynamic discovery**: Use `discoverDemos('{component-name}')` — NEVER hardcode demo names
- **Two browser pages**: One for React, one for Lit (open simultaneously)
- **`waitForFullLoad()`**: networkidle → `document.fonts.ready` → images loaded → requestIdleCallback (Safari fallback)
- **Viewport**: 1280x720 on both pages
- **`threshold: 0`**: Pixel-perfect, zero tolerance
- **Screenshots**: `fullPage: true`, `animations: 'disabled'`
- **Attach 3 images**: React (expected), Lit (actual), Diff (red pixels)
- **Close React page in `finally` block**

### Demo Paths (CRITICAL)

Both React and Lit MUST use `/test/` path (minimal template):

```typescript
await reactPage.goto(`/elements/pfv6-{component}/react/test/${demoName}`);
await page.goto(`/elements/pfv6-{component}/test/${demoName}`);
```

**NEVER use `/demo/`** for parity tests — different template with navigation/styling.

## CSS API Tests (css-api.ts)

### Purpose

Validates CSS custom property overrides work identically in React and Lit.

### Process

1. **Discover**: All `--pf-v6-c-{component}--*` variables from CSS file
2. **Exclude**: Private (`--_*`) and token (`--pf-t--*`) variables
3. **Resolve**: Follow variable chains through tokens to final values
4. **Detect type**: From resolved value (color, size, shadow, border, font-weight, number)
5. **Generate test value**: Type-appropriate, visually obvious override

### Test Values by Type

| Type | Test Value |
|------|-----------|
| color | `rgb(255, 0, 0)` |
| size | `50{unit}` (preserve original unit) |
| shadow | `0 0 20px 10px rgba(255, 0, 0, 0.8)` |
| border | `10px solid rgb(255, 0, 0)` |
| font-weight | `900` |
| number | `999` |

### CSS Override Application

```typescript
await page.addStyleTag({
  content: `${selector} { ${cssVar}: ${value}; }`
});
```

**Selectors**: React → `.pf-v6-c-{component}`, Lit → `pfv6-{component}`

### Demo Path

Both use `/test/` path (same as visual tests), usually `basic` demo.

## Running Tests

```bash
# Unit tests
npm test -- elements/pfv6-{component}/test/pfv6-{component}.spec.ts

# Visual parity tests
npm run e2e:parity -- pfv6-{component}.visual.ts

# CSS API tests
npm run e2e:parity -- pfv6-{component}.css-api.ts
```

**Note**: Test commands start dev servers and may take time. Recommend user runs manually.

## Related Skills

| Skill | When to Invoke |
|-------|----------------|
| `component-patterns` | For component API and event patterns being tested |
| `css-conventions` | For CSS variable naming and placement rules |
| `source-navigation` | When locating React source for parity reference |
