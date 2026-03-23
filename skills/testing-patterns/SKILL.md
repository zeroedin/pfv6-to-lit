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
import { discoverDemos, resolveReactDemoName } from '../../../tests/helpers/discover-demos.js';
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

Both React and Lit MUST use `/test/` path (minimal template).

**NEVER use `/demo/`** for parity tests — different template with navigation/styling.

Lit demo names (from filesystem) may not match React manifest keys.
Use `resolveReactDemoName()` to get the correct React path:

```typescript
const reactDemoName = resolveReactDemoName('{component-name}', demoName);
await reactPage.goto(`/elements/pfv6-{component}/react/test/${reactDemoName}`);
await page.goto(`/elements/pfv6-{component}/test/${demoName}`);
```

### Selector Rules (CRITICAL — Playwright + Shadow DOM)

**Playwright does NOT support ElementInternals ARIA roles.**
`getByRole('dialog')` will NOT find elements with roles set via `this.#internals.role`.
Use CSS selectors or DOM attributes instead.

**Playwright CSS selectors DO pierce shadow DOM by default.**
`page.locator('#popover')` finds `<div id="popover">` inside shadow roots.
But this also means `page.locator('button')` matches shadow DOM buttons (e.g., internal close buttons) — not just light DOM buttons.

#### Lit vs React selector strategy

Lit and React render completely different DOM structures. **NEVER use the same CSS selectors for both.** Write separate trigger/wait logic per framework.

| Concern | Lit approach | React approach |
|---------|-------------|----------------|
| Find trigger | `popover.locator('pfv6-button')` (light DOM custom element) | `page.locator('button').first()` |
| External trigger | Check `trigger-id` attr, then `page.locator('#${id}')` | `page.locator('button').first()` |
| Wait for content | `popover.locator('#popover')` (shadow DOM id) | `page.locator('.pf-v6-c-{component}')` (PF CSS class) |
| Hover trigger | `.hover({ force: true })` (may be disabled) | `.hover()` |

#### Common selector pitfalls

1. **`page.locator('button')` matches shadow DOM** — Internal close/action buttons in shadow roots match before slotted trigger buttons. Use the custom element tag (`pfv6-button`) to target light DOM only.

2. **`.pf-v6-c-*` classes don't exist in Lit** — Lit components use their own shadow DOM structure with different class names. Never assume PF BEM classes in Lit selectors.

3. **ElementInternals roles are invisible to Playwright** — `getByRole()` won't find roles set via `this.#internals.role`. This is a known Playwright limitation (P3 priority as of 2025).

4. **Disabled elements block `.click()`** — Use `.hover({ force: true })` for disabled triggers (e.g., hover-activated popovers).

5. **Components with `trigger-action` attribute** — Check the attribute to determine click vs hover:

```typescript
const triggerAction = await popover.getAttribute('trigger-action');
if (triggerAction === 'hover') {
  await trigger.hover({ force: true });
} else {
  await trigger.click();
}
```

#### Example: Component with interactive trigger (popover, tooltip)

```typescript
async function triggerPopover(page: Page, framework: 'lit' | 'react'): Promise<void> {
  if (framework === 'lit') {
    const popover = page.locator('pfv6-popover').first();
    const triggerAction = await popover.getAttribute('trigger-action');
    const triggerId = await popover.getAttribute('trigger-id');

    const trigger = triggerId
      ? page.locator(`#${triggerId}`)
      : popover.locator('pfv6-button').first();

    if (triggerAction === 'hover') {
      await trigger.hover({ force: true });
    } else {
      await trigger.click();
    }
    await popover.locator('#popover').waitFor({ state: 'visible', timeout: 5000 });
  } else {
    await page.locator('button').first().click();
    await page.locator('.pf-v6-c-popover').waitFor({ state: 'visible', timeout: 5000 });
  }
  await page.waitForTimeout(500);
}
```

### Debugging Visual Tests

Use Chrome DevTools MCP to inspect DOM and verify selectors:

```
1. Start dev server: npx web-dev-server --port 8000
2. Navigate: navigate_page → http://localhost:8000/elements/pfv6-{component}/test/{demo}
3. Snapshot: take_snapshot → see a11y tree structure
4. Evaluate: evaluate_script → inspect shadow DOM, classes, attributes
5. Click/hover: click/hover uid → verify trigger works
```

Run a single test quickly:

```bash
TEST_MATCH='elements/**/test/*.visual.ts' npx playwright test pfv6-{component} --grep "basic"
```

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

# Visual parity tests (all components)
npm run e2e:parity

# Visual parity tests (single component)
npm run e2e:parity -- pfv6-{component}

# Visual parity tests (single demo)
npm run e2e:parity -- pfv6-{component} --grep "basic"

# CSS API tests (all components)
npm run e2e:css-api

# CSS API tests (single component)
npm run e2e:css-api -- pfv6-{component}

# Quick iteration (server already running)
TEST_MATCH='elements/**/test/*.visual.ts' npx playwright test pfv6-{component} --grep "basic"
```

**Note**: `e2e:parity` and `e2e:css-api` use wireit which manages the dev server via `serve:e2e` service dependency. Args after `--` are forwarded to Playwright as filename regex filters.

