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
  - **Conditionally render optional slots (if wrapper has spacing or participates in layout)**:
    - **When needed**: Slot is optional AND wrapper has spacing properties:
      - Component uses grid/flex layout with `gap`
      - Wrapper has `padding`, `margin`, or other spacing CSS
    - **Why needed**: Empty wrapper divs with spacing create unwanted space even when slot is empty
    - **Example scenario**: Optional description text that should only create a wrapper div if provided:
      ```html
      <!-- User provides optional description -->
      <my-component>
        <span slot="description">Optional description text</span>
      </my-component>
      ```
    - **Complete pattern** (solves chicken-and-egg problem):
      ```typescript
      @state() private _hasDescription = false;
      
      connectedCallback(): void {
        super.connectedCallback();
        
        // Check Light DOM for slotted content BEFORE first render
        // This prevents chicken-and-egg: slot doesn't render → slotchange never fires → _hasDescription stays false
        const descriptionSlot = this.querySelector('[slot="description"]');
        this._hasDescription = !!descriptionSlot;
      }
      
      #onSlotChange(e: Event) {
        const slot = e.target as HTMLSlotElement;
        this._hasDescription = slot.assignedNodes().length > 0;
      }
      
      render() {
        return html`
          ${this._hasDescription ? html`
            <div class="description">
              <slot name="description" @slotchange=${this.#onSlotChange}></slot>
            </div>
          ` : ''}
        `;
      }
      ```
    - **Not needed**: If slot is always present, or wrapper has no spacing properties (most common case)
  - Implement Shadow DOM rendering
  - **CRITICAL**: Expose PatternFly CSS variables using two-layer pattern
  - **Eliminate template whitespace (if adjacent inline elements)**:
    - **When needed**: Adjacent inline elements where spacing matters (e.g., label + required indicator)
    - **Why needed**: Newlines in templates create whitespace text nodes
    - **Pattern**:
      ```typescript
      // GOOD (no spacing):
      <slot></slot>${condition ? html`<span>*</span>` : ''}
      
      // BAD (creates space):
      <slot></slot>
              ${condition ? html`<span>*</span>` : ''}
      ```
    - **Not needed**: If elements are block-level or spacing doesn't matter

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
  - **🚨 CRITICAL: Use appropriate selector types**:
    - **IDs**: Unique elements that appear only once in Shadow DOM (`#container`, `#label`, `#required`)
    - **Classes**: Elements that repeat multiple times (`.list-item`, `.gallery-item`) OR for conditional state with `classMap()` (`.pf-m-standalone`)
    - **Elements**: Native elements (`input[type="checkbox"]`)
  - **🚨 CRITICAL: Match CSS selectors to actual DOM structure**:
    ```html
    <!-- If component renders wrapper: -->
    <div class="wrapper">
      <slot name="content"></slot>
    </div>
    ```
    ```css
    /* Target wrapper, not slot: */
    .wrapper {
      grid-column: 2;
      font-size: var(--_font-size);
    }
    ```
  - **For slotted web components with layout conflicts (if needed)**:
    - **When needed**: Component slots other web components that have internal layout (grid/flex with gaps) causing unwanted spacing
    - **Not needed**: If component doesn't slot other web components, or if spacing is correct without overrides (most common case)
    - **Pattern**: Override slotted component's **private** variables (`--_*`), NOT public API (`--pf-v6-c-*`)
      ```css
      ::slotted(pfv6-checkbox) {
        display: block;
        
        /* Override PRIVATE variables to prevent internal layout from interfering */
        --_grid-gap: 0 var(--pf-t--global--spacer--gap--text-to-element--default);
      }
      ```
    - **Why**: Slotted components' internal grid/flex gaps can add unwanted space in parent's layout
    - **Example**: Nested checkboxes where child checkbox's `grid-gap` adds 8px height even with only 1 row
  - **🚨 MANDATORY: Validate against React CSS source**:
    1. Open: `node_modules/@patternfly/react-styles/css/components/{Component}/{component}.css`
    2. Verify line-by-line:
       - Variable names match exactly
       - Token references match
       - Calculations reference correct variables with nested fallbacks
       - All selectors are translated

- [ ] **Implement events** (if needed)
  - Extend `Event` class (NOT `CustomEvent`)
  - Export event classes for `instanceof` checks
  - Use standard naming (e.g., `Pfv6CheckboxChangeEvent`)

- [ ] **🚨 CRITICAL: Use ElementInternals for semantic roles** (if component has `component` prop for alternative semantics)
  - **When needed**: Component accepts `component` prop to change semantic meaning (e.g., `component="li"` for list items)
  - **Why needed**: Cannot render semantic HTML in Light DOM due to Shadow DOM encapsulation
  - **Pattern**: Use `ElementInternals.role` to expose semantic role WITHOUT rendering extra DOM elements
  - **Example scenario**: Gallery with `<ul>` + `<li>` structure - React renders `<li>` elements, web components use `role="listitem"`
  - **Complete pattern**:
    ```typescript
    export class Pfv6GalleryItem extends LitElement {
      static readonly formAssociated = true;
      
      @property({ type: String })
      component: 'div' | 'li' = 'div';
      
      private internals: ElementInternals;
      
      constructor() {
        super();
        this.internals = this.attachInternals();
      }
      
      updated(changed: PropertyValues): void {
        super.updated(changed);
        
        if (changed.has('component')) {
          // Map component type to ARIA role
          if (this.component === 'li') {
            this.internals.role = 'listitem';
          } else {
            this.internals.role = null;
          }
        }
      }
      
      render() {
        return html`<slot></slot>`;  // No wrapper!
      }
    }
    ```
  - **Not needed**: If component doesn't need alternative semantic structures (most common case)
  - **Key principle**: When you **cannot replicate Light DOM semantics** due to Shadow DOM, use **ElementInternals to simulate DOM structure and a11y representation**

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
  - Lit file: `elements/pfv6-checkbox/demo/basic.html` (**kebab-case, descriptor only**)
  - **Naming Rule**: React `CheckboxBasic.tsx` → Lit `basic.html` (NOT `basic-checkbox.html`)
  - Convert React PascalCase filename to kebab-case (descriptor only, no component name suffix)

- [ ] **🚨 CRITICAL: Content Parity is Mandatory**
  - **ALWAYS** open the React `.tsx` file side-by-side with your Lit `.html` file
  - **NEVER** approximate or guess at content - copy exactly
  - **VERIFY** every detail matches before moving to next demo:
    - ✅ Element count (if React has 8 `<GalleryItem>`, Lit must have 8 `<pfv6-gallery-item>`)
    - ✅ Text content (case-sensitive: "Gallery Item" not "Gallery item")
    - ✅ Property values (exact match: `{md: '280px', lg: '320px', '2xl': '400px'}`)
    - ✅ Attribute presence (if React uses `isRequired`, Lit must use `required`)
    - ✅ **Attribute/property parity** (CRITICAL):
      - If React has `<Gallery component="ul">` (1 prop), Lit must have `<pfv6-gallery component="ul">` (1 attribute)
      - If React has `<Gallery hasGutter component="ul">` (2 props), Lit must have `<pfv6-gallery has-gutter component="ul">` (2 attributes)
      - ❌ **DON'T add extra attributes** that React doesn't have (e.g., adding `has-gutter` when React has no `hasGutter`)
      - ❌ **DON'T omit attributes** that React has (e.g., missing `component` when React has `component`)
      - **Count the props** in React, **count the attributes** in Lit - numbers must match!

- [ ] **🚨 CRITICAL: React-to-Lit demo conversion rules**
  - **IGNORE** React-specific syntax:
    - `<Fragment>` or `<>` wrappers - They're React-specific (JSX can't have multiple root elements). HTML doesn't need them.
    - React imports, hooks (`useState`, `useEffect`), type annotations
  - **CONVERT** React components to Lit components 1:1:
    - `<Checkbox>` → `<pfv6-checkbox>`
    - `<CheckboxBody>` → `<pfv6-checkbox-body>`
  - **PRESERVE** component structure exactly - Same nesting, same order
  - **PRESERVE** content (text) exactly - All text content must match React demo **character-for-character**
  - **PRESERVE** property values exactly:
    - React: `maxWidths={{ md: '280px', lg: '320px', '2xl': '400px' }}`
    - Lit: `gallery.maxWidths = { md: '280px', lg: '320px', '2xl': '400px' }`
    - ❌ **DON'T** approximate: ~~`{ md: '200px', xl: '400px' }`~~
    - ❌ **DON'T** omit properties: All keys must be present
  - **CONVERT** props to attributes:
    - React: `<Checkbox isRequired>` → Lit: `<pfv6-checkbox required>`
  - **CONVERT** React event handlers to vanilla JavaScript (if interactive):
    - React `useState` → JavaScript variables or direct DOM manipulation
    - React `onChange` → `addEventListener('change', ...)`
  - **STUB** missing components with HTML comments:
    ```html
    <!-- TODO: Replace with <pfv6-divider> when available -->
    <hr>
    ```
  - **NEVER** add custom CSS unless it exists in the React demo
  - **NEVER** add section headings (`<h1>`, `<h2>`) - demos are pure component usage
  - **NEVER** add demo-specific styling - PatternFly styles are loaded globally

- [ ] **Keep Lit demos minimal** (HTML fragments only)
  ```html
  <pfv6-checkbox>Label</pfv6-checkbox>
  
  <script type="module">
    import '@pfv6/elements/pfv6-checkbox/pfv6-checkbox.js';
  </script>
  ```
  - **NO** section headings or wrapper divs
  - **NO** custom CSS (unless in React demo)
  - **NO** `index.html` file in demo directory

- [ ] **🚨 CRITICAL: Manual Verification Checklist (for EACH demo)**
  - [ ] Opened React `.tsx` file side-by-side with Lit `.html` file
  - [ ] **Counted React props** - counted Lit attributes - numbers match exactly
  - [ ] **Verified attribute/property parity** - if React uses `hasGutter`, Lit must use `has-gutter` (and vice versa - no extra attributes!)
  - [ ] Counted child components - numbers match exactly
  - [ ] Verified text content character-for-character (case-sensitive)
  - [ ] Verified property values match exactly (no approximations)
  - [ ] Verified all property keys present (no omissions)
  - [ ] Visually compared in browser - look identical
  - [ ] If mismatch found, fixed Lit demo to match React exactly

- [ ] **Ensure 1:1 demo parity**
  - Same number of demos as React
  - Same variants covered
  - Same content (text) character-for-character
  - Same property values (no approximations)

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
- [ ] Cloned PatternFly React examples from GitHub (via `npm install`)
- [ ] Implemented main Lit component with Shadow DOM
- [ ] **🚨 Initialized slot state in `connectedCallback()`** (prevents chicken-and-egg problems)
- [ ] **🚨 Conditionally rendered slot wrapper divs** (prevents empty div spacing issues)
- [ ] **🚨 Eliminated template whitespace** (adjacent elements on same line)
- [ ] Implemented all sub-components (if needed)
- [ ] Exposed PatternFly CSS variables as public API (two-layer pattern)
- [ ] Created all CSS files with design tokens
- [ ] **🚨 Added box-sizing reset to ALL CSS files** (every component + sub-components)
- [ ] **🚨 Used appropriate CSS selectors** (IDs for unique, classes for conditional, elements for native)
- [ ] **🚨 Matched CSS selectors to actual DOM structure** (target wrappers, not slots)
- [ ] **🚨 Added `::slotted()` overrides for nested web components** (if component slots other web components)
- [ ] **🚨 Validated CSS against React source** (`node_modules/@patternfly/react-styles/css/components/{Component}/{component}.css`)
- [ ] Implemented custom events (extending `Event`, not `CustomEvent`)
- [ ] React demos already exist (copied via `postinstall` to `patternfly-react/`)
- [ ] Created corresponding Lit demos for each React demo
- [ ] **🚨 Used kebab-case for ALL Lit demo filenames** (descriptor only, no component name suffix)
- [ ] **🚨 Ignored React-specific syntax** (`<Fragment>`, hooks, type annotations)
- [ ] **🚨 Preserved component structure and content exactly** (1:1 mapping, character-for-character)
- [ ] **🚨 Stubbed missing components with HTML comments** (never apply workarounds)
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
- Review `pfv6-card` or `pfv6-checkbox` implementation as reference
- Ask clarifying questions before proceeding

---

