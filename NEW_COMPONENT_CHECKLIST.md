# New Component Creation Checklist

**Component**: `<pfv6-checkbox>`

**Date Started**: 2025-11-21

---

## Phase 1: Research & Planning

- [ ] **Study PatternFly v6 Documentation**
  - Visit: https://www.patternfly.org/components/forms/checkbox
  - Read design spec, usage guidelines, accessibility requirements
  - Note all variants, states, and modifiers

- [ ] **Analyze React Component API**
  - Locate: `node_modules/@patternfly/react-core/dist/esm/components/Checkbox/`
  - Open TypeScript interface files (`.d.ts`)
  - Document every prop, type, default value, and purpose
  - Identify sub-components (if any)

- [ ] **Identify CSS Variables (Public API)**
  - Visit: https://www.patternfly.org/components/forms/checkbox#css-variables
  - List ALL CSS custom properties exposed by React component
  - These will be YOUR public API

- [ ] **Map React API to Web Component API**
  - React props → `@property()` (primitives) or slots (components)
  - React children → Default slot or sub-components
  - React callbacks → Custom events (extend `Event` class)
  - Document in planning notes

---

## Phase 2: Verify React Demos Exist

**Note**: React demos for ALL PatternFly components are automatically copied during `npm install` via the `postinstall` script. You should already have them.

- [ ] **Verify React demos exist in your workspace**
  ```bash
  ls -la patternfly-react/Checkbox/*.tsx
  ```
  - Should see: `CheckboxBasic.tsx`, `CheckboxControlled.tsx`, etc.

- [ ] **Check demos.json manifest**
  ```bash
  cat patternfly-react/demos.json | grep -A 5 '"Checkbox"'
  ```
  - Should see URL mappings: `"basic": "CheckboxBasic.tsx"`, etc.

- [ ] **Note all example files**
  - List every `.tsx` file - these are your demo targets
  - Document in planning notes

- [ ] **If React demos are missing** (shouldn't happen)
  - Run: `npm ci` to trigger `postinstall` script
  - Script clones PatternFly React to `/tmp/patternfly-react-{version}`
  - Copies ALL component examples to `patternfly-react/`

---

## Phase 3: Setup Component Structure

- [ ] **Create component directory**
  ```bash
  mkdir -p elements/pfv6-checkbox
  mkdir -p elements/pfv6-checkbox/demo
  mkdir -p elements/pfv6-checkbox/test
  ```

- [ ] **Verify React demos already exist** (copied during `npm install`)
  - Check: `patternfly-react/Checkbox/*.tsx` files exist
  - Check: `patternfly-react/demos.json` has `Checkbox` entries
  - **Note**: All React demos for ALL components are copied automatically via `postinstall` script
  - If missing, run: `npm install` to trigger `postinstall`

---

## Phase 4: Implement LitElement Component

- [ ] **Create main component file** (`pfv6-checkbox.ts`)
  - Use `@customElement('pfv6-checkbox')`
  - Define `@property()` for each React prop (primitives only)
  - Define slots for React children (if any)
  - Implement Shadow DOM rendering
  - **CRITICAL**: Expose PatternFly CSS variables using two-layer pattern

- [ ] **Create sub-components** (if needed)
  - One file per sub-component: `pfv6-checkbox-{subcomponent}.ts`
  - Use `display: contents` for layout transparency
  - Each sub-component inherits CSS variables from parent

- [ ] **Create CSS files**
  - `pfv6-checkbox.css` - Shadow DOM styles
  - `pfv6-checkbox-lightdom.css` - Only if needed for deeply nested slotted content
  - **🚨 CRITICAL: Start EVERY CSS file with box-sizing reset**:
    ```css
    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }
    ```
    - **Why**: `box-sizing` is NOT inherited, Shadow DOM defaults to `content-box`
    - **Impact**: Without this, text reflow and layout will differ from React PatternFly
    - **Required**: EVERY component CSS file (main + sub-components)
  - Use PatternFly design tokens with fallbacks
  - **Expose PUBLIC API CSS variables on `:host`**
  - **Use PRIVATE variables (`--_`) internally that reference public ones**

- [ ] **Implement events** (if needed)
  - Extend `Event` class (NOT `CustomEvent`)
  - Export event classes for `instanceof` checks
  - Use standard naming (e.g., `Pfv6CheckboxChangeEvent`)

---

## Phase 5: Compile React Demos

- [ ] **Compile React demos**
  ```bash
  npm run compile:react-demos
  ```

- [ ] **Verify demos load in browser**
  - Start dev server: `npm run dev`
  - Visit: `http://localhost:8000/elements/pfv6-checkbox/react`
  - Check each demo link works

---

## Phase 6: Create Lit Demos (Mirror React)

**🚨 CRITICAL: Lit demo filenames ALWAYS use kebab-case**

- [ ] **For each React demo, create corresponding Lit demo**
  - React file: `patternfly-react/Checkbox/CheckboxBasic.tsx`
  - Lit file: `elements/pfv6-checkbox/demo/basic.html` (**kebab-case**)
  - Convert React PascalCase filename to kebab-case for Lit demo

- [ ] **Keep Lit demos minimal** (HTML fragments only)
  ```html
  <pfv6-checkbox>Label</pfv6-checkbox>
  
  <script type="module">
    import '@pfv6/elements/pfv6-checkbox/pfv6-checkbox.js';
  </script>
  ```

- [ ] **Ensure 1:1 demo parity**
  - Same number of demos as React
  - Same variants covered

---

## Phase 7: Write Unit Tests

- [ ] **Create test file** (`elements/pfv6-checkbox/test/pfv6-checkbox.spec.ts`)
  - Test all public properties
  - Test all events
  - Test accessibility
  - Test slots (if any)

- [ ] **Run unit tests**
  ```bash
  npm run test
  ```

---

## Phase 8: Visual Regression Testing

- [ ] **Start dev server**
  ```bash
  killall node
  npm run dev &
  sleep 10
  ```

- [ ] **Run parity tests** (THE CRITICAL TEST)
  ```bash
  npm run e2e:parity
  ```

- [ ] **🚨 CRITICAL: Run dependency analysis FIRST**
  ```bash
  npx tsx scripts/analyze-react-demo-dependencies.ts Checkbox
  ```
  - **Why**: This identifies which test failures are due to missing components vs CSS issues
  - **Output**: Creates `elements/pfv6-checkbox/REACT_DEPENDENCIES.md` with complete breakdown
  - **ALWAYS** run this before trying to fix visual test failures
  - **DO NOT** assume failures are CSS issues without checking dependencies first

- [ ] **Analyze test failures using dependency report**
  - Review Playwright report: `npx playwright show-report`
  - **Cross-reference with `REACT_DEPENDENCIES.md`**
  - **CRITICAL**: Categorize failures correctly:
    - **Blocked by Dependencies**: Listed in `REACT_DEPENDENCIES.md` as MISSING
    - **Fixable Now**: All components exist, only CSS/spacing/tokens need adjustment

- [ ] **Document blocked tests**
  - Add to `elements/pfv6-checkbox/TODO.md` with specific component blockers
  - Add missing components to root `NEXT_COMPONENTS.md`
  - Reference the `REACT_DEPENDENCIES.md` report

- [ ] **Fix only unblocked issues**
  - Fix CSS, spacing, tokens in Lit component
  - Re-run: `npm run e2e:parity`
  - Repeat until all **unblocked** tests pass

- [ ] **Goal: 100% Achievable Parity**
  - All tests that don't require missing components must pass
  - Blocked tests should remain failing (expected behavior)

---

## Phase 9: Cleanup & Documentation

- [ ] **Final verification**
  ```bash
  npm run lint
  npm run test
  npm run e2e:parity
  ```

- [ ] **Document public API with JSDoc**
  - All properties with `@property` tag
  - All events with `@event` tag
  - All slots with `@slot` tag
  - All CSS variables with `@cssprop` tag

- [ ] **Update project documentation**
  - `elements/pfv6-checkbox/README.md` (if needed)
  - Implementation notes
  - Update `NEXT_COMPONENTS.md` (remove checkbox, mark as complete)

---

## Summary Checklist (Must ALL be checked)

- [ ] Researched PatternFly v6 docs and React TypeScript API
- [ ] Cloned PatternFly React examples from GitHub
- [ ] Implemented main Lit component with Shadow DOM
- [ ] Implemented all sub-components (if needed)
- [ ] Exposed PatternFly CSS variables as public API (two-layer pattern)
- [ ] Created all CSS files with design tokens
- [ ] **🚨 Added box-sizing reset to ALL CSS files** (every component + sub-components)
- [ ] Implemented custom events (extending `Event`, not `CustomEvent`)
- [ ] Copied ALL React demo files from GitHub (not manually created)
- [ ] Created corresponding Lit demos for each React demo (kebab-case filenames)
- [ ] Wrote comprehensive unit tests
- [ ] Compiled React demos successfully (`npm run compile:react-demos`)
- [ ] **🚨 Ran dependency analysis** (`npx tsx scripts/analyze-react-demo-dependencies.ts ComponentName`)
- [ ] **Reviewed `REACT_DEPENDENCIES.md` to identify blockers**
- [ ] Ran parity tests (`npm run e2e:parity`) and fixed ALL unblocked visual differences
- [ ] Achieved 100% achievable visual parity (all unblocked tests passing)
- [ ] Documented all blockers in `TODO.md` and `NEXT_COMPONENTS.md` (using dependency report)
- [ ] Ran linters and fixed all issues
- [ ] Documented public API with JSDoc
- [ ] Cleaned up temporary files

---

## Notes

**Key Principles:**
- React demos are **IMMUTABLE** - never modify after copying
- Lit demo filenames use **kebab-case** (not PascalCase)
- CSS variables are **public API** - expose PatternFly names exactly
- **🚨 CRITICAL**: Every CSS file MUST start with `box-sizing: border-box` reset
- Tests should **fail** when they require components that don't exist yet (expected behavior)
- **Never apply workarounds** for missing components - document blockers instead

**When Stuck:**
- Check `CLAUDE.md` for patterns and guidelines
- Review `pfv6-card` implementation as reference
- Ask clarifying questions before proceeding

