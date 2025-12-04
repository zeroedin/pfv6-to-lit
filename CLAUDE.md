# CLAUDE.md - AI Assistant Context File

> **Purpose**: This file provides comprehensive context to AI assistants about PatternFly Elements v6 to enable expert-level assistance with component development.

---

## Common Commands (Run These Frequently)

**⚠️ AI NOTE: Always prompt user before running `killall node` or test suites - see "Disruptive Commands" in AI Guidelines section**

```bash
# Development
npm run dev                    # Start dev server (web components only, fast)
npm run dev:react             # Start dev server + React demo watch
killall node                  # ⚠️ AI: PROMPT before running - kills ALL Node processes

# Building
npm run compile               # Compile TypeScript + CEM + React demos
npm run compile:react-demos   # Compile React demos only

# Testing
npm run test                  # Run unit tests
npm run e2e                   # Run all E2E tests (visual + CSS API)
npm run e2e:parity           # Run Lit vs React parity tests (THE CRITICAL TEST)

# Linting
npm run lint                  # Run all linters (ESLint + Stylelint)
```

**🚨 CRITICAL RULES:**
- **ALWAYS** use `npm run dev` (never manual `tsc` commands) - Wireit handles all compilation
- **ALWAYS** use `npm run e2e:parity` (never `npx playwright test` directly) - npm scripts ensure dev server is running
- **ALWAYS** prompt user before running `killall node` or test suites - these commands are disruptive (see AI Guidelines)
- **NEVER** gitignore `package-lock.json` - it ensures deterministic builds and must be committed

---

## Quick Reference for AI

**Critical Information at a Glance:**
- **Goal**: Build PatternFly v6 web components with 1:1 visual parity to React PatternFly
- **Stack**: TypeScript + Lit + Shadow DOM + PatternFly v6 tokens
- **Naming**: `pfv6-{component}` for all components
- **Priority**: PatternFly design spec > React implementation > RHDS code standards
- **Reference Source**: `@patternfly/react-core` is installed in `node_modules` - use TypeScript interfaces to verify exact API
- **🚨 React Demos**: ALWAYS copy from GitHub (`github.com/patternfly/patternfly-react/.../examples/*.tsx`), NEVER manually create or transcribe from docs
- **🚨 IMMUTABLE**: React demo files (`patternfly-react/{Component}/*.tsx`) must NEVER be modified - they are the single source of truth
- **Always**: Research PatternFly v6 docs first, check React component props/interface, ask clarifying questions before implementing
- **Critical Gotcha**: Shadow DOM `::slotted()` can't style nested elements - use `-lightdom.css` when needed
- **Events**: Extend `Event` class, NOT `CustomEvent`
- **Privacy**: Use `#private` for fields, `_private` for decorated members
- **Tokens**: Use semantic tokens with fallback values, never hardcode colors/spacing
- **Shadow DOM CSS**: Use `#id` selectors (not BEM classes), `classMap()` (not `:host([attr])`), no unnecessary CSS custom properties
- **Render Method**: Keep all HTML in `render()`, use ternaries for conditionals, don't break into subroutines
- **🚨 API Separation**: Match React prop names for component API (e.g., `isClicked`), NOT CSS class names (e.g., `.pf-m-current`)

---

## Repository Etiquette

- **Never commit without testing**: Run `npm run e2e:parity` before committing component changes
- **Never modify React demos**: They are immutable - copied directly from PatternFly React GitHub
- **Always use Wireit scripts**: Never manually run `tsc` or `npx playwright test`
- **Git workflow**: Work in feature branches, never force push to main
- **Component organization**: Visual tests in `tests/visual/{component}/`, keep organized by component
- **Documentation**: Update `CLAUDE.md`, `TODO.md`, and `IMPLEMENTATION_PLAN.md` as you work

---

## Project Overview

**PatternFly Elements v6** is a web component library built with LitElement that implements the PatternFly v6+ design system for non-React environments.

### What Problem Does This Solve?
Enables developers to use PatternFly v6+ component designs outside of React by extracting the design language and CSS design tokens into standards-based web components. This allows PatternFly to be used cross-platform in:
- **Frontend frameworks**: Vue, Angular, Svelte, vanilla JavaScript
- **Server-side platforms**: Drupal, Ruby on Rails, and other CMS environments
- **Any HTML context** where React is not feasible or desired

### Primary Users & Audience
Developers using the PatternFly design system who are **not in React-based environments**. This library ensures cross-platform design language consistency for teams working in diverse tech stacks while maintaining PatternFly design standards.

### Key Features & Capabilities

**Goal: 1:1 Parity with PatternFly React**
- **Functional API parity**: Component APIs should match React PatternFly as closely as possible
- **Design language fidelity**: Visual design must be identical to React implementation
- **CSS token mapping**: CSS custom properties (design tokens) should map 1:1 where technically feasible

**Technical Constraint: Shadow DOM vs Light DOM**
- PatternFly React uses Light DOM only
- This library uses Shadow DOM (web component standard)
- CSS token mapping should be "as close as possible" given this architectural difference
- AI should be aware that some token mappings may require adaptation for Shadow DOM encapsulation
- An example would be where a child element needs to be styled with `display: contents` on the host element so its shadowroot can participate in the layout of the parent element.

## Tech Stack

### Primary Language
- **TypeScript** → compiled to **ES6 JavaScript** for browser consumption
- Use latest TypeScript baseline settings
- Target: Modern browsers with ES6+ support
- **CRITICAL**: All JavaScript files (`.js`) are gitignored as build artifacts
  - ALWAYS create `.ts` files, NEVER create `.js` files directly
  - Exception: `*.config.js` files (e.g., `vite.config.js`) are allowed but prefer `.ts`
  - Scripts in `scripts/` directory MUST be TypeScript (`.ts`)
  - Use `tsx` to run TypeScript scripts: `tsx scripts/my-script.ts`
- **CRITICAL**: NEVER use `any` type in TypeScript
  - ✅ **DO** use proper types, interfaces, or type unions
  - ✅ **DO** use `unknown` if the type is truly unknown (safer than `any`)
  - ✅ **DO** create interfaces or type aliases for complex structures
  - ✅ **DO** use generics when working with dynamic types
  - ❌ **NEVER** use `any` as a shortcut or workaround
  - **Why**: `any` defeats the purpose of TypeScript and eliminates type safety
- **CRITICAL**: NEVER use deprecated JavaScript methods
  - ✅ **DO** use `substring()` or `slice()` instead of deprecated `substr()`
  - ✅ **DO** check MDN for current best practices
  - ❌ **NEVER** use `substr()` (deprecated since ES2022)
  - **Example**: `str.substring(2, 11)` instead of `str.substr(2, 9)`

### Framework & Styling
- **Lit** (LitElement) for web component implementation
- **Modern CSS** with native CSS nesting (no preprocessors)
- **No CSS frameworks** - all styling should be custom/PatternFly-based
- Shadow DOM styling with CSS custom properties

### Build Tools
- **TypeScript Compiler (`tsc`)** - Main compilation
- **@pwrs/cem** - Custom Elements Manifest generator
- **@web/dev-server** - Development server
- **web-dev-server-plugin-lit-css** - CSS handling for Lit components
- **esbuild-plugin-lit-css** - Production CSS bundling
- **Vite** - React comparison demo bundling (isolated build)
- **@vitejs/plugin-react** - React JSX transformation
- **@koa/router** - Dev server routing
- **ESLint** - Code quality and standards

### Testing Frameworks
- **@web/test-runner** - Primary test runner for web components
- **Playwright** - Browser automation and E2E testing

### Key Dependencies
- **Lit** - Core web component framework
- **PatternFly v6 base CSS tokens** - Design system foundation (CSS custom properties)

### AI Guidance for This Stack
- Always use TypeScript with proper type definitions
- Lit components should use decorators (`@customElement`, `@property`, `@state`)
- CSS imports: Use `import styles from './component.css'` with `web-dev-server-plugin-lit-css` (dev) and `esbuild-plugin-lit-css` (build) handling the transformation
- Never suggest CSS frameworks (Bootstrap, Tailwind, etc.)
- Assume ES6+ features are available (async/await, modules, etc.)
- Test files should work with @web/test-runner's conventions

## Project Structure

```
/elements/              - Individual web component folders
  /pfv6-button/        - Example component structure
    pfv6-button.ts     - Component implementation (TypeScript)
    pfv6-button.css    - Component styles
    pfv6-button.js     - Compiled JavaScript
    pfv6-button.d.ts   - Type definitions
    /demo/             - Component demo files
      index.html       - Primary demo page
      variants.html    - Additional demo pages (optional)
    /test/             - Component-specific tests
      pfv6-button.spec.ts

Note: React demos are stored separately in `/patternfly-react/Button/` (see structure below)

/lib/                  - Shared utilities, helpers, and contexts
  helpers.ts           - String utilities (capitalize, toCamelCase)
  responsive-attributes.ts - Responsive value parsing and class generation
  utils.ts             - Common utilities
  controllers/         - Lit controllers
  contexts/            - Lit contexts for shared state

/dev-server/           - Development server configuration and assets
  /layouts/            - LiquidJS layout templates (base structure)
    base.liquid        - Master HTML layout with block system
  /partials/           - Reusable LiquidJS template fragments
    head-meta.liquid   - Common <head> tags and import map
    demo-nav.liquid    - Navigation for demo pages
  /plugins/            - Custom dev server plugins (router, import maps, demo list)
  /assets/             - Static resources
    /patternfly/       - PatternFly assets (copied from node_modules)
      /images/         - PatternFly logo, etc. (gitignored, copied on build)
  /styles/             - Global CSS, PatternFly styles, resets
    /patternfly/       - PatternFly base CSS (copied from @patternfly/react-core)
      base.css         - Tokens, resets, icons (gitignored, copied on build)
    styles.css         - General demo styles
    react-demo.css     - React demo index specific styles
  index.html           - Dev server home page (LiquidJS template)
  demo.html            - Unified demo template (web components + React)
  test.html            - Unified test template (web components + React)
  react-not-built.html - Fallback page when React demos not compiled

/docs/                 - Project documentation
  component-guide.md
  implementation-notes.md

  /tests/                - Test files and test utilities
  /visual/             - Visual regression tests (organized by component)
    /{element}/        - Component visual tests (e.g., card, checkbox)
      {element}-visual-parity.spec.ts               - Lit vs React parity tests
      {element}-visual-parity.spec.ts-snapshots/
    README.md          - Visual testing documentation
  /css-api/            - CSS variable API parity tests
    {element}-api.spec.ts   - Component CSS variable tests
  /diagnostics/        - Diagnostic tests (console errors, etc.)
  /pages/              - Page objects for E2E tests

/patternfly-react/     - React comparison demos (copied from PatternFly React GitHub)
  /Card/               - Card component React demos (PascalCase folder names)
    CardBasic.tsx      - React demo files (PascalCase filenames, gitignored)
    CardSecondary.tsx
  /Button/             - Button component React demos
    ButtonPrimary.tsx
  /dist/               - Vite build output (gitignored)
    /Card/             - Compiled Card demos
      CardBasic.js     - Compiled JS (PascalCase filenames)
    /Button/           - Compiled Button demos
      ButtonPrimary.js
    /shared/           - Shared PatternFly chunks
      patternfly-core-[hash].js
      patternfly-icons-[hash].js
    patternfly.css     - Bundled PatternFly CSS
  demos.json           - Manifest mapping kebab-case URLs to PascalCase files (tracked in git)

/                      - Root configuration files
  tsconfig.json
  web-dev-server.config.js
  playwright.config.ts
  eslint.config.js
  package.json
```

### Component Structure Convention
Each component in `/elements/` follows this pattern:
- **Folder naming**: `pfv6-{component-name}/` (kebab-case, prefixed with `pfv6-`)
- **File naming**: Matches folder name (e.g., `pfv6-button.ts`, `pfv6-button.css`)
- **Co-located**: TypeScript, CSS, demo, and test files live together in component folder
- **Compiled outputs**: `.js`, `.d.ts`, `.map` files generated alongside source

### Demo Files Structure

Each component has a `/demo/` folder containing HTML demo files:

**File Structure**:
```
/elements/pfv6-card/
  /demo/
    basic.html       - Demo files use kebab-case (descriptor only, no component name suffix)
    with-body-section-fills.html - Additional demo pages
    selectable.html  - More demo variations
```

**File Naming Convention**:
- ✅ **DO** use kebab-case for Lit demo filenames: `basic.html`, `with-body-section-fills.html`
- ✅ **DO** match the kebab-case URL routing: `/elements/pfv6-card/demo/basic`
- ✅ **DO** convert React PascalCase names to kebab-case (descriptor only): `CardBasic.tsx` → `basic.html`
- ❌ **DON'T** use PascalCase for Lit demos: ~~`BasicCards.html`~~
- ❌ **DON'T** use camelCase: ~~`basicCards.html`~~
- ❌ **DON'T** add component name suffix: ~~`basic-cards.html`~~ (redundant!)

**Demo File Format** (Minimal HTML fragments):
```html
<pfv6-component>
  Component markup here
</pfv6-component>

<script type="module">
  import '@pfv6/elements/pfv6-component/pfv6-component.js';
</script>
```

**CRITICAL: React-to-Lit Demo Conversion Rules**

When converting a PatternFly React demo to a LitElement demo, follow these steps:

1. **Identify and Ignore React-Specific Syntax**:
   - ❌ **Ignore `<Fragment> | <>` wrappers** - They're React-specific (JSX can't have multiple root elements). HTML doesn't need them.
   - ❌ **Remove React imports, hooks, and type annotations** - `useState`, `useEffect`, type definitions, etc.
   - ✅ **Convert React event handlers to vanilla JavaScript** - If the React demo has interactivity, convert it to work with LitElement components using standard DOM events

2. **Component Conversion**:
   - ✅ **Map React components to Lit components 1:1**:
     - `<Card>` → `<pfv6-card>`
     - `<CardTitle>` → `<pfv6-card-title>`
     - `<CardBody>` → `<pfv6-card-body>`
   - ✅ **Preserve component structure exactly** - Same nesting, same order
   - ✅ **Preserve content (text) exactly** - All text content must match React demo character-for-character
   - ✅ **Convert props to attributes**:
     - React: `<Card isCompact>` → Lit: `<pfv6-card compact>`
     - React: `<CardBody isFilled>` → Lit: `<pfv6-card-body filled>`

3. **Handle Missing Components**:
   - ✅ **Stub with HTML comments** - If a component doesn't exist yet:
     ```html
     <!-- TODO: Replace with <pfv6-divider> when available -->
     <hr>
     ```
   - ❌ **DON'T apply CSS workarounds** - Use plain HTML stubs, document the blocker

4. **Styling**:
   - ❌ **NEVER add custom CSS** unless it exists in the React demo
   - ❌ **NEVER add section headings** (`<h1>`, `<h2>`, etc.) - demos are pure component usage
   - ❌ **NEVER add demo-specific styling** - PatternFly styles are loaded globally
   - ✅ **Keep demos as minimal as possible** - Just the component markup and script tag

5. **Interactivity** (Special Cases):
   - ✅ **If React demo has state/event handlers, convert to vanilla JavaScript**:
     - React `useState` → JavaScript variables or direct DOM manipulation
     - React `onChange` handlers → `addEventListener('change', ...)`
     - React `useEffect` → Direct function calls or event listeners
   - ✅ **Preserve the demo's interactive behavior** - The Lit demo should function identically to React
   - ❌ **DON'T add interactivity that doesn't exist in the React demo**

**Example: Correct Conversion**

React Demo:
```tsx
import { Card, CardTitle, CardBody } from '@patternfly/react-core';

export const CardBasic: React.FunctionComponent = () => (
  <Card>
    <CardTitle>Title</CardTitle>
    <CardBody>Body</CardBody>
  </Card>
);
```

Lit Demo (CORRECT):
```html
<pfv6-card>
  <pfv6-card-title>Title</pfv6-card-title>
  <pfv6-card-body>Body</pfv6-card-body>
</pfv6-card>

<script type="module">
  import '@pfv6/elements/pfv6-card/pfv6-card.js';
</script>
```

Lit Demo (WRONG - too much):
```html
<h1>Card</h1>

<section>
  <h2>Basic card</h2>
  <pfv6-card>
    <pfv6-card-title>Title</pfv6-card-title>
    <pfv6-card-body>Body</pfv6-card-body>
  </pfv6-card>
</section>

<script type="module">
  import '@pfv6/elements/pfv6-card/pfv6-card.js';
</script>

<style>
  pfv6-card {
    margin: 1rem;
  }
</style>
```

**Important Notes**:
- ✅ **DO** keep demo files minimal - just component markup and imports
- ✅ **DO** mirror React demo structure exactly (1:1 component mapping)
- ✅ **DO** ignore `<Fragment>, <>` wrappers completely - render multiple root elements naturally in HTML
- ✅ **DO** verify content parity before moving to next demo (see checklist below)
- ❌ **DON'T** include section headings, wrapper divs, or demo-specific styles
- ❌ **DON'T** add CSS unless it exists in the React demo
- ❌ **DON'T** overcomplicate - the goal is the simplest possible representation
- ❌ **DON'T** approximate property values or element counts
- ❌ **NEVER** create an `index.html` file in `demo/` directory - all demos should use descriptive kebab-case names matching their React counterparts

**🚨 CRITICAL: Content Parity Verification (for EVERY Lit demo)**

Before considering a Lit demo complete, verify these details match the React demo **exactly**:

1. **Attribute/Property Count** (CRITICAL - most common failure):
   - **Count React props, count Lit attributes - numbers must match**
   - React: `<Gallery component="ul">` (1 prop)
   - Lit: `<pfv6-gallery component="ul">` (1 attribute) ✅
   - React: `<Gallery hasGutter component="ul">` (2 props)
   - Lit: `<pfv6-gallery has-gutter component="ul">` (2 attributes) ✅
   - ❌ **DON'T add extra attributes**: Adding `has-gutter` when React has no `hasGutter`
   - ❌ **DON'T omit attributes**: Missing `component` when React has `component`
   - **Why this matters**: Extra/missing attributes cause visual differences (spacing, layout)

2. **Element Count** (must be identical):
   - React: `<GalleryItem>Gallery Item</GalleryItem>` (x8)
   - Lit: `<pfv6-gallery-item>Gallery Item</pfv6-gallery-item>` (x8)
   - ❌ **DON'T** approximate: 6 items when React has 8

3. **Text Content** (case-sensitive):
   - React: `<GalleryItem>Gallery Item</GalleryItem>` (capital "I")
   - Lit: `<pfv6-gallery-item>Gallery Item</pfv6-gallery-item>` (capital "I")
   - ❌ **DON'T** change casing: ~~"Gallery item"~~ (lowercase "i")

4. **Property Values** (exact match required):
   - React: `maxWidths={{ md: '280px', lg: '320px', '2xl': '400px' }}`
   - Lit: `gallery.maxWidths = { md: '280px', lg: '320px', '2xl': '400px' }`
   - ❌ **DON'T** approximate: ~~`{ md: '200px', xl: '400px' }`~~
   - ❌ **DON'T** omit keys: All properties must be present

5. **Property Keys** (all must be present):
   - If React uses `{ default: '100%', md: '100px', xl: '300px' }`
   - Lit must use `{ default: '100%', md: '100px', xl: '300px' }`
   - ❌ **DON'T** omit: ~~`{ md: '100px' }`~~ (missing `default` and `xl`)

**Manual Verification Workflow**:
```bash
# 1. Open React demo in editor
code patternfly-react/Gallery/GalleryBasic.tsx

# 2. Open Lit demo side-by-side
code elements/pfv6-gallery/demo/basic.html

# 3. Compare line-by-line:
#    - **COUNT PROPS vs ATTRIBUTES** (most critical check!)
#      - Example: React has `<Gallery component="ul">` (1 prop)
#      - Lit must have `<pfv6-gallery component="ul">` (1 attribute)
#      - If React adds `hasGutter`, Lit must add `has-gutter`
#    - Count elements (must match)
#    - Verify text content (case-sensitive)
#    - Verify property values (exact match)
#    - Verify all property keys present

# 4. Test in browser side-by-side
open http://localhost:8000/elements/pfv6-gallery/react/basic
open http://localhost:8000/elements/pfv6-gallery/demo/basic

# 5. Visual comparison - should be pixel-identical
```

**Why This Matters**:
- ✅ Visual parity tests compare Lit vs React pixel-by-pixel
- ✅ Content mismatches are the #1 cause of test failures
- ✅ Approximations break 1:1 API parity expectations
- ❌ Fixing test failures later wastes time
- ❌ Incomplete content creates confusion about what's "correct"

**Dev Server Routing**:
- Primary demo: `/elements/pfv6-card/demo/index`
- Additional demos: `/elements/pfv6-card/demo/variants`
- React comparison: `/elements/pfv6-card/react` (serves from `patternfly-react/Card/`)
- Test routes (for visual regression): `/elements/pfv6-card/test/basic`, `/elements/pfv6-card/react/test/basic`
- Dev server automatically discovers and lists all demos on homepage via Custom Elements Manifest
- Demo pages use LiquidJS template system: `dev-server/demo.html` wraps demo content with `layouts/base.liquid`

**How Demo Discovery Works**:
1. `npm run compile` generates `custom-elements.json` via CEM
2. CEM plugin scans each component's `/demo/` folder
3. Demo paths are added to the manifest for each component
4. Dev server `demo-list` plugin reads the manifest
5. Homepage automatically shows all available demos with links

**LiquidJS Template System**:
- **Base layout**: `dev-server/layouts/base.liquid` - Master HTML structure with block system
- **Templates**: `demo.html`, `test.html`, `index.html` - Extend base layout, define content blocks
- **Partials**: `partials/*.liquid` - Reusable fragments (navigation, styles, meta tags)
- **Conditional rendering**: Templates support both web component and React demos via `isReactDemo` flag

### React Comparison Demos

**Purpose**: React comparison demos allow side-by-side visual testing of our web components against official PatternFly React components to ensure 1:1 parity.

**🚨 CRITICAL: React Demo Files Are IMMUTABLE**

React demo files (`patternfly-react/{Component}/*.tsx`) must **NEVER** be modified after copying from the official PatternFly React repository. They are the **single source of truth** for visual parity testing.

**Rules:**
- ❌ **NEVER** modify React demo files for any reason
- ❌ **NEVER** fix imports, asset paths, or styling in React demos
- ❌ **NEVER** add mounting code or other modifications
- ✅ **ONLY** copy directly from PatternFly React GitHub (see workflow below)
- ✅ If React demos don't work, the issue is either:
  - Missing PatternFly assets (fix by updating `copy:pf-assets` script)
  - Upstream PatternFly React issue (report to PatternFly team)
- ✅ **All visual differences are Lit's responsibility to fix**

**🚨 CRITICAL: Copy React Demos from GitHub Source**

**DO NOT** manually create or transcribe React demos. **ALWAYS** copy directly from the official PatternFly React GitHub repository:

```
https://github.com/patternfly/patternfly-react/tree/main/packages/react-core/src/components/{Component}/examples
```

**Why This is Critical**:
- ✅ GitHub repository is the **single source of truth** for PatternFly React
- ✅ Ensures 100% API accuracy (props, types, event handlers)
- ✅ Eliminates manual transcription errors
- ✅ Provides the exact code that ships to npm
- ❌ Documentation website (patternfly.org) may have rendering bugs or outdated examples

**Workflow for Creating React Demos**:

### Automated Clone & Copy Process

1. **Clone PatternFly React repository temporarily**:
   ```bash
   cd /path/to/parent/directory
   git clone --depth 1 --branch main https://github.com/patternfly/patternfly-react.git patternfly-react-temp
   ```

2. **Locate the component examples directory**:
   ```bash
   # Example for Button component
   cd patternfly-react-temp/packages/react-core/src/components/Button/examples
   ls -la  # List all example files
   ```

3. **Copy all example files programmatically**:
   ```bash
   # Navigate to your project
   cd /path/to/pfe-v6
   
   # Create React demo directory
   mkdir -p elements/pfv6-{component}/react
   
   # Copy all .tsx files from PatternFly React examples
   # (AI: You can read these files and write them with mounting code added)
   ```

4. **Add mounting code to each file**:
   - For each copied `.tsx` file, append the ReactDOM mounting code at the end
   - Ensure the component name matches the exported component from the file

5. **Compile and verify**:
   ```bash
   npm run compile:react-demos
   ```

6. **Clean up temporary repository**:
   ```bash
   rm -rf /path/to/parent/directory/patternfly-react-temp
   ```

### Critical Steps After Copying React Demos

**ALWAYS complete these steps after copying React demos:**

1. **⚠️ CRITICAL: DO NOT MODIFY REACT DEMO FILES**:
   - React demo files (`patternfly-react/{Component}/*.tsx`) are **IMMUTABLE**
   - They are the **single source of truth** copied directly from PatternFly React GitHub
   - **NEVER** change imports, asset paths, or any other content
   - Any discrepancies between React demos and Lit demos are Lit's responsibility to fix
   - If React demos have issues, they must be fixed upstream in PatternFly React first

2. **Compile React demos**:
   ```bash
   npm run compile:react-demos
   ```

3. **Rebuild visual regression baselines**:
   ```bash
   killall node  # ⚠️ AI: PROMPT before running - kills ALL Node processes
   npm run dev &
   sleep 10
   npm run rebuild:snapshots  # ⚠️ AI: PROMPT before running
   ```
   **AI Note**: Always prompt user before running `killall node` or baseline rebuild commands.

4. **Run parity tests**:
   ```bash
   npm run e2e:parity  # ⚠️ AI: PROMPT before running
   ```
   **AI Note**: Always prompt user before running tests - they take ~45s and are resource-intensive.

5. **Analyze test failures**: Failures will reveal visual differences between your Lit component and React PatternFly. This is the **source of truth** for what needs to be fixed in your Lit component.

## Complete Workflow: Creating a New PatternFly Component

**This is the MANDATORY end-to-end process for creating any new PatternFly component. Follow ALL steps in order.**

### Phase 1: Research & Planning (ALWAYS DO FIRST)

**DO NOT skip research. DO NOT start coding before completing this phase.**

1. **Study Official PatternFly v6 Documentation**:
   - Visit: `https://www.patternfly.org/components/{component}`
   - Read the design spec, usage guidelines, and accessibility requirements
   - Note all variants, states, and modifiers

2. **Analyze React Component API**:
   - Install `@patternfly/react-core` in `node_modules` (already done)
   - Locate: `node_modules/@patternfly/react-core/dist/esm/components/{Component}/`
   - Open the TypeScript interface files (`.d.ts`)
   - **Document every prop, its type, default value, and purpose**
   - Identify sub-components (e.g., `CardTitle`, `CardBody`, `CardFooter`)

3. **Identify CSS Variables (Public API)**:
   - Visit: `https://www.patternfly.org/components/{component}#css-variables`
   - List ALL CSS custom properties exposed by the React component
   - These will be YOUR public API as well

4. **Map React API to Web Component API**:
   - React props → `@property()` (primitives) or slots (components)
   - React children → Default slot or sub-components
   - React callbacks → Custom events (extend `Event` class)
   - React component props → Sub-components with their own properties

5. **Create Component Plan Document** (optional but recommended):
   ```markdown
   # pfv6-{component} Implementation Plan
   
   ## React API Surface
   - Main component props: {...}
   - Sub-components: {...}
   - Events: {...}
   
   ## LitElement API Design
   - Properties: {...}
   - Slots: {...}
   - Sub-components: {...}
   - Events: {...}
   - CSS Variables: {...}
   
   ## Implementation Phases
   1. [ ] Main component structure
   2. [ ] Sub-components
   3. [ ] CSS styling with tokens
   4. [ ] Events
   5. [ ] Tests
   6. [ ] React demos
   7. [ ] Lit demos
   8. [ ] Visual regression tests
   ```

### Phase 2: Clone Official React Examples

**CRITICAL: React demos are the source of truth. Get them first.**

1. **Clone PatternFly React repository**:
   ```bash
   cd /path/to/parent/directory
   git clone --depth 1 --branch main https://github.com/patternfly/patternfly-react.git patternfly-react-temp
   ```

2. **Verify examples exist**:
   ```bash
   cd patternfly-react-temp/packages/react-core/src/components/{Component}/examples
   ls -la *.tsx
   ```

3. **Note all example files**: List every `.tsx` file - these are your demo targets.

### Phase 3: Implement LitElement Component

1. **Create component directory**:
   ```bash
   mkdir -p elements/pfv6-{component}
   cd elements/pfv6-{component}
   ```
   
   Note: React demos are stored separately in `/patternfly-react/{Component}/` and copied automatically via `postinstall`

2. **Create main component file** (`pfv6-{component}.ts`):
   - Use `@customElement('pfv6-{component}')`
   - Define `@property()` for each React prop (primitives only)
   - Define slots for React children
   - Implement Shadow DOM rendering
   - **CRITICAL**: Expose PatternFly CSS variables in `:host` using two-layer pattern

3. **Create sub-components** (if needed):
   - One file per sub-component: `pfv6-{component}-{subcomponent}.ts`
   - Use `display: contents` for layout transparency
   - Each sub-component inherits CSS variables from parent

4. **Create CSS files**:
   - `pfv6-{component}.css` - Shadow DOM styles
   - `pfv6-{component}-lightdom.css` - Only if needed for deeply nested slotted content
   - **🚨 MANDATORY: Start EVERY CSS file with box-sizing reset**:
     ```css
     *,
     *::before,
     *::after {
       box-sizing: border-box;
     }
     ```
   - Use PatternFly design tokens with fallbacks
   - **Expose PUBLIC API CSS variables on `:host`**
   - **Use PRIVATE variables (`--_`) internally that reference public ones**
   - **🚨 MANDATORY: Validate against React CSS source (`node_modules/@patternfly/react-styles/css/components/{Component}/{component}.css`)**
     - Verify all variable names match exactly
     - Check calculations reference correct variables (not just tokens)
     - Ensure nested fallbacks preserve API names
     - Confirm all selectors are translated

5. **Implement events**:
   - Extend `Event` class (NOT `CustomEvent`)
   - Export event classes for `instanceof` checks
   - Use standard naming (e.g., `Pfv6SelectEvent`)

### Phase 4: Copy React Demos (NO MODIFICATIONS)

**AI: React demos are automatically copied by the `postinstall` script.**

**🚨 CRITICAL: React demos are managed by `scripts/copy-patternfly-react-demos.ts`**

1. **React demos are copied automatically**:
   - Runs on `npm install` via `postinstall` hook
   - Clones PatternFly React repository (cached by version)
   - Copies all `.tsx` files to `patternfly-react/{Component}/`
   - Preserves original PascalCase filenames (e.g., `CardBasic.tsx`)
   - Generates `patternfly-react/demos.json` manifest
   - Maps kebab-case URLs to PascalCase filenames
   - **Source files are gitignored** (only `demos.json` is tracked)

2. **React demos are served via router**:
  - URLs use kebab-case: `/elements/pfv6-card/react/basic`
  - Router reads `demos.json` to find `CardBasic.tsx`
   - Compiled JS at: `/patternfly-react/dist/Card/CardBasic.js`
   - Mounting handled by `demo.html` template

3. **Compile React demos**:
   ```bash
   npm run compile:react-demos
   ```

4. **Verify demos load in browser**:
   - Start dev server: `npm run dev`
   - Visit: `http://localhost:8000/elements/pfv6-{component}/react`
   - Demos are served from `patternfly-react/{Component}/` (copied via `postinstall`)
   - Check each demo link works

### Phase 5: Create Lit Demos (Mirror React)

**🚨 CRITICAL: Lit demo filenames ALWAYS use kebab-case**

1. **For each React demo, create corresponding Lit demo**:
   - React file: `patternfly-react/{Component}/CardBasic.tsx` (copied via `postinstall`)
   - Lit file: `elements/pfv6-{component}/demo/basic.html` (**kebab-case, descriptor only**)
   - **Rule**: Convert React PascalCase filename to kebab-case (descriptor only, no component name suffix)
   - Example: `CardBasic.tsx` → `basic.html`
   - Example: `CardWithBodySectionFills.tsx` → `with-body-section-fills.html`

2. **Keep Lit demos minimal** (HTML fragments only):
   ```html
   <pfv6-{component}>
     <!-- Component markup here -->
   </pfv6-{component}>
   
   <script type="module">
     import '@pfv6/elements/pfv6-{component}/pfv6-{component}.js';
   </script>
   
   <style>
     /* Optional demo-specific styles */
   </style>
   ```

3. **Ensure 1:1 demo parity**: Same number of demos, same variants covered

### Phase 6: Write Unit Tests

1. **Create test file** (`elements/pfv6-{component}/test/pfv6-{component}.spec.ts`):
   ```typescript
   import { expect, fixture, html } from '@open-wc/testing';
   import '../pfv6-{component}.js';
   import type { Pfv6{Component} } from '../pfv6-{component}.js';
   
   describe('pfv6-{component}', () => {
     it('should render with default properties', async () => {
       const el = await fixture<Pfv6{Component}>(html`
         <pfv6-{component}>Content</pfv6-{component}>
       `);
       expect(el).to.exist;
     });
     
     // Test all public properties
     // Test all events
     // Test accessibility
     // Test slots
   });
   ```

2. **Run unit tests**:
   ```bash
   npm run test
   ```

### Phase 7: Visual Regression Testing

**This is the FINAL validation step. Tests reveal what needs fixing.**

**🚨 CRITICAL: Standardized Visual Testing Approach**

**ALWAYS use this exact pattern for visual parity tests:**

```typescript
import { test, expect, Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { discoverDemos } from '../../helpers/discover-demos.js';

/**
 * CRITICAL: Demos are discovered dynamically from the filesystem, not hardcoded.
 * This ensures tests automatically pick up new demos or renamed demos.
 */

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
  
  // Wait for main thread to be idle (with Safari fallback)
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

// Dynamically discover all demos from the filesystem
const litDemos = discoverDemos('card'); // Replace 'card' with component name

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

**Why This Approach:**

✅ **Direct comparison** - No baseline files stored on disk  
✅ **Fresh renders every run** - Compares live React vs live Lit  
✅ **Two browser pages** - Both demos rendered simultaneously  
✅ **Pixel-perfect matching** - `threshold: 0` for exact comparison  
✅ **Visual diff report** - Red pixels show exact differences  
✅ **Three attachments** - React (expected), Lit (actual), Diff  

**Testing Workflow:**

1. **Start dev server** (if not already running):
   ```bash
   killall node  # ⚠️ AI: PROMPT before running - kills ALL Node processes
   npm run dev &
   sleep 10
   ```
   **AI Note**: Always prompt user before running `killall node` - it stops all Node processes on their machine.

2. **Run parity tests** (THE CRITICAL TEST):
   ```bash
   npm run e2e:parity -- tests/visual/{component}/  # ⚠️ AI: PROMPT before running
   ```
   **AI Note**: Always prompt user before running tests - they take ~45s and are resource-intensive.
   
   - Compares Lit demos against React demos (live, not baseline)
   - Failures show EXACTLY what's visually different
   - This is the **only test that matters** for Lit component validation

3. **Analyze test failures and categorize**:
   - Review Playwright report: `npx playwright show-report`
   - Examine diff images for each failure
   - **CRITICAL**: Categorize failures into two groups:
     - **Fixable Now**: CSS, spacing, tokens, or component logic issues in current component
     - **Blocked by Dependencies**: Failures requiring components that don't exist yet
   - **Document blocked tests** - Add to `elements/pfv6-{component}/TODO.md` with clear explanation of what component is needed
   - **Document missing components** - Add to root `NEXT_COMPONENTS.md` for project-wide visibility
   - **Never apply workarounds** - If React uses `<Divider />`, we need `<pfv6-divider>`, not styled `<hr>`

4. **Fix only unblocked issues**:
   - Fix CSS, spacing, tokens, or component logic in Lit component
   - Re-run: `npm run e2e:parity -- tests/visual/{component}/`
   - Repeat until all **unblocked** tests pass
   - **Leave blocked tests failing** - They will auto-fix when dependencies are implemented

5. **Goal: 100% Achievable Parity**: All parity tests that don't require missing components must pass.
   - **Expected**: Some tests will fail due to missing components (e.g., `<pfv6-divider>`, `<pfv6-checkbox>`)
   - **This is correct behavior** - Tests validate our API matches React's API
   - **Document all blockers**:
     - Component-specific: `elements/pfv6-{component}/TODO.md`
     - Project-wide tracking: Root `NEXT_COMPONENTS.md`

### Phase 8: Cleanup

1. **Remove temporary clone**:
   ```bash
   rm -rf /path/to/parent/directory/patternfly-react-temp
   ```

2. **Final verification**:
   ```bash
   npm run lint
   npm run test
   npm run e2e:parity
   ```

3. **Update documentation** (if needed):
   - Component README
   - JSDoc for all public APIs
   - Implementation notes

### Summary Checklist

**Before considering a component "done", verify ALL of these:**

- [ ] Researched PatternFly v6 docs and React TypeScript API
- [ ] Cloned PatternFly React examples from GitHub
- [ ] Implemented main Lit component with Shadow DOM
- [ ] Implemented all sub-components (if needed)
- [ ] Exposed PatternFly CSS variables as public API (two-layer pattern)
- [ ] Created all CSS files with design tokens
- [ ] Implemented custom events (extending `Event`, not `CustomEvent`)
- [ ] Copied ALL React demo files from GitHub (not manually created)
- [ ] Created corresponding Lit demos for each React demo
- [ ] Wrote comprehensive unit tests
- [ ] Compiled React demos successfully (`npm run compile:react-demos`)
- [ ] Ran parity tests (`npm run e2e:parity`) and fixed ALL visual differences
- [ ] Achieved 100% visual parity (all parity tests passing)
- [ ] Cleaned up temporary files
- [ ] Ran linters and fixed all issues
- [ ] Documented public API with JSDoc
- [ ] Removed temporary PatternFly React clone

**If any checkbox is unchecked, the component is NOT complete.**

---

## 🚨 CRITICAL: Test Failures Due to Missing Components

**Philosophy**: Tests should fail when they require components that don't yet exist. This is **expected and correct behavior**.

### Why Tests Fail for Missing Dependencies

Visual parity tests compare our Lit demos against React demos. When React uses a component we haven't built yet (e.g., `<Divider />`, `<Checkbox />`, `<Dropdown />`), **our tests will fail**.

**This is NOT a bug - it's validation that we need to maintain API parity.**

### The Correct Approach

**❌ DON'T** apply workarounds:
```html
<!-- BAD - React uses <Divider /> component -->
<pfv6-card>
  <pfv6-card-title>Title</pfv6-card-title>
  <hr class="pf-v6-c-divider" role="separator">  <!-- ❌ Workaround -->
  <pfv6-card-body>Body</pfv6-card-body>
</pfv6-card>
```

**✅ DO** use placeholder HTML and document the blocker:
```html
<!-- GOOD - Placeholder until <pfv6-divider> exists -->
<pfv6-card>
  <pfv6-card-title>Title</pfv6-card-title>
  <hr>  <!-- ✅ Simple placeholder, no styling -->
  <pfv6-card-body>Body</pfv6-card-body>
</pfv6-card>
```

### How to Handle Blocked Tests

1. **Identify the missing component**:
   - React demo uses `<Divider />` → We need `<pfv6-divider>`
   - React demo uses `<Checkbox />` → We need `<pfv6-checkbox>`

2. **Document in component TODO** (`elements/pfv6-{component}/TODO.md`):
   ```markdown
   3. 🚫 `with-dividers` - **BLOCKED** - Requires `<pfv6-divider>` component
      - **Status**: Test will automatically pass once `<pfv6-divider>` is implemented
      - **Note**: Don't apply styles to `<hr>` - React uses a component, we need component parity
   ```

3. **Add to project-wide tracker** (root `NEXT_COMPONENTS.md`):
   ```markdown
   ## pfv6-divider
   - **Priority**: High (blocks `pfv6-card` parity test)
   - **Usage**: Card dividers, section separators
   - **React Reference**: `@patternfly/react-core/Divider`
   ```

4. **Leave the test failing** - It validates we haven't cut corners

5. **When the component is built**, the test will automatically pass

### Benefits of This Approach

✅ **Maintains API Parity**: We use components where React uses components  
✅ **No Technical Debt**: No workarounds to remove later  
✅ **Clear Dependencies**: Tests document what components are needed  
✅ **Automatic Validation**: Tests pass when dependencies are implemented  
✅ **Honest Progress Tracking**: Pass rate reflects true parity, not workarounds  

### Example: pfv6-card Divider Blocker

**React Demo** (`CardWithDividers.tsx`):
```tsx
<Card>
  <CardTitle>Title</CardTitle>
  <Divider />  // ← React uses component
  <CardBody>Body</CardBody>
</Card>
```

**Our Lit Demo** (`with-dividers.html`):
```html
<pfv6-card>
  <pfv6-card-title>Title</pfv6-card-title>
  <hr>  <!-- Placeholder until <pfv6-divider> exists -->
  <pfv6-card-body>Body</pfv6-card-body>
</pfv6-card>
```

**Visual Parity Test**: ❌ Fails (expected - `<hr>` doesn't match styled `<Divider />`)

**When `<pfv6-divider>` is implemented**:
```html
<pfv6-card>
  <pfv6-card-title>Title</pfv6-card-title>
  <pfv6-divider></pfv6-divider>  <!-- Now matches React! -->
  <pfv6-card-body>Body</pfv6-card-body>
</pfv6-card>
```

**Visual Parity Test**: ✅ Passes (automatic - no changes to `pfv6-card` needed)

### AI Directive

When implementing components:
1. **Never apply styles to workaround missing components**
2. **Always document blocked tests in component TODO** (`elements/pfv6-{component}/TODO.md`)
3. **Always add missing components to project tracker** (root `NEXT_COMPONENTS.md`)
4. **Accept failing tests as validation of incomplete dependencies**
5. **Celebrate when blocked tests auto-fix after implementing dependencies**

**This philosophy ensures we build components correctly, not quickly.**

---

**Structure**:
- **Source Location**: `patternfly-react/{Component}/*.tsx` (e.g., `patternfly-react/Card/CardBasic.tsx`)
  - Copied automatically via `postinstall` script from PatternFly React GitHub
  - Original PascalCase filenames preserved
  - Gitignored (only `demos.json` tracked)
- **Build Output**: `patternfly-react/dist/{Component}/*.js` (e.g., `patternfly-react/dist/Card/CardBasic.js`)
  - Gitignored, generated by Vite
  - Shared PatternFly chunks in `patternfly-react/dist/shared/`
- **Manifest**: `patternfly-react/demos.json` - Maps kebab-case URLs to PascalCase filenames (tracked in git)
- **URL**: `http://localhost:8000/elements/pfv6-card/react` (index), `http://localhost:8000/elements/pfv6-card/react/basic` (specific demo)

**Implementation Checklist**:
- [ ] React demos copied automatically via `npm install` (postinstall)
- [ ] Verify `patternfly-react/{Component}/*.tsx` files exist
- [ ] Check `patternfly-react/demos.json` has component entries
- [ ] Build with `npm run compile:react-demos`
- [ ] Test in browser at `/elements/{component}/react/{demo-name}`

**Build System**:
- **Tool**: Vite with `@vitejs/plugin-react`
- **Bundling Strategy**: React and ReactDOM from CDN (jsDelivr), PatternFly bundled locally into shared chunks
- **Output Structure**: All demos in `react-demos/dist/` with shared PatternFly bundles in `react-demos/dist/shared/`
- **Config**: `vite.config.react-demos.ts`
- **Isolation**: React builds are OPTIONAL and don't slow down main `npm run dev`

**Workflow**:
```bash
# Option 1: Build once (for CI or one-time comparison)
npm run compile:react-demos

# Option 2: Watch mode (for active React demo development)
npm run dev:react

# Option 3: Skip React builds entirely (fast web component development)
npm run dev
```

**Fallback Behavior**:
- If React demo source exists but isn't built, dev server shows helpful instructions
- If React demo doesn't exist, returns 404
- Web component demos work independently of React demo build status

**Example React Demo** (`patternfly-react/Card/CardBasic.tsx`):
```tsx
// Copied EXACTLY from PatternFly React GitHub examples
// File: packages/react-core/src/components/Card/examples/CardBasic.tsx
import React from 'react';
import { Card, CardTitle, CardBody, CardFooter } from '@patternfly/react-core';

export const CardBasic: React.FunctionComponent = () => (
  <>
    <Card>
      <CardTitle>Title</CardTitle>
      <CardBody>Body</CardBody>
    </Card>
    <Card>
      <CardTitle>Title</CardTitle>
      <CardBody>Body</CardBody>
      <CardFooter>Footer</CardFooter>
    </Card>
  </>
);

// NO modifications - mounting handled by demo.html template
```

**AI Directive**: 
- 🚨 **NEVER** manually create React demo code
- 🚨 **NEVER** transcribe from patternfly.org documentation
- 🚨 **NEVER** modify React demos after copying (no imports, no mounting code, no asset paths)
- ✅ **ALWAYS** copy directly from GitHub examples directory
- ✅ **ALWAYS** copy byte-for-byte exactly as-is from PatternFly React
- ✅ React demos are **IMMUTABLE** - they define what "correct" looks like
- ✅ When in doubt, ask the user for the GitHub URL to copy from

### Key Patterns

- **CSS imports**: Each component imports its own CSS using Lit's CSS handling
- **Type declarations**: Each component exports global TypeScript declarations
- **Decorators**: Use Lit decorators (`@customElement`, `@property`, `@state`)
- **Demo discovery**: Dev server plugins automatically find and route to all demo files

## Shared Libraries & Utilities

The `/lib/` directory contains shared utilities that eliminate code duplication across components.

### `lib/helpers.ts` - String Utilities

**Purpose**: Common string transformation functions used throughout the codebase.

**Functions**:

```typescript
/**
 * Capitalizes the first letter of a string.
 */
export function capitalize(str: string): string

/**
 * Converts a kebab-case string to camelCase.
 */
export function toCamelCase(str: string): string
```

**Usage Example**:
```typescript
import { capitalize, toCamelCase } from '../../lib/helpers.js';

const camelCased = toCamelCase('flex-wrap');  // 'flexWrap'
const capitalized = capitalize('hello');       // 'Hello'
```

### `lib/responsive-attributes.ts` - Responsive Value Handling

**Purpose**: Centralized library for handling responsive attributes with breakpoint values (e.g., `gap="md sm:lg xl:2xl"`).

**Why This Exists**: PatternFly components support responsive values that change at different breakpoints. This library eliminates duplicated parsing, serialization, and class generation logic across components like `pfv6-flex`, `pfv6-divider`, and `pfv6-gallery`.

#### Core Types & Constants

```typescript
/**
 * Responsive value type supporting PatternFly breakpoints
 */
export type ResponsiveValue<T extends string> = {
  default?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
};

/**
 * PatternFly breakpoint names
 */
export const BREAKPOINTS = ['sm', 'md', 'lg', 'xl', '2xl'] as const;
export type Breakpoint = typeof BREAKPOINTS[number];
```

#### Parsing Attributes

**Use Case**: Convert HTML attribute strings to `ResponsiveValue<T>` objects.

```typescript
/**
 * Parse responsive attribute string to ResponsiveValue object
 * @example "md sm:lg xl:2xl" → { default: 'md', sm: 'lg', xl: '2xl' }
 */
export function parseResponsiveAttribute<T>(value: string | null): ResponsiveValue<T> | undefined

/**
 * Parse with value transformation (prefix, enum mapping)
 * @example "md sm:lg" with prefix "gap" → { default: 'gapMd', sm: 'gapLg' }
 */
export function parseResponsiveAttributeWithTransform<T>(
  value: string | null, 
  options?: TransformOptions
): ResponsiveValue<T> | undefined
```

**Example (pfv6-flex)**:
```typescript
// HTML: <pfv6-flex gap="md sm:lg xl:2xl">
import { parseResponsiveAttribute } from '../../lib/responsive-attributes.js';

const gapValue = parseResponsiveAttribute<string>('md sm:lg xl:2xl');
// Result: { default: 'md', sm: 'lg', xl: '2xl' }
```

#### Serializing Values

**Use Case**: Convert `ResponsiveValue<T>` back to attribute string for Lit `toAttribute` converters.

```typescript
/**
 * Serialize ResponsiveValue object to attribute string
 * @example { default: 'md', sm: 'lg', xl: '2xl' } → "md sm:lg xl:2xl"
 */
export function serializeResponsiveAttribute<T>(
  value: ResponsiveValue<T> | undefined,
  options?: TransformOptions
): string | null
```

#### Property Converters (Lit Integration)

**Use Case**: Create Lit property converters for `@property()` decorators.

```typescript
/**
 * Factory function for Lit property converters
 * Handles both fromAttribute (parse) and toAttribute (serialize)
 */
export function createResponsiveConverter<T extends string>(
  options?: TransformOptions
): {
  fromAttribute: (value: string | null) => ResponsiveValue<T> | undefined;
  toAttribute: (value: ResponsiveValue<T> | undefined) => string | null;
}
```

**Example (pfv6-flex with prefix)**:
```typescript
import { 
  type ResponsiveValue,
  createResponsiveConverter 
} from '../../lib/responsive-attributes.js';

@property({ 
  type: Object, 
  converter: createResponsiveConverter({ prefix: 'gap' }) 
})
gap?: ResponsiveValue<'gap' | 'gapNone' | 'gapXs' | 'gapSm' | 'gapMd' | 'gapLg' | 'gapXl' | 'gap2xl' | 'gap3xl' | 'gap4xl'>;
```

**Example (pfv6-flex with enum mapping)**:
```typescript
@property({ 
  type: Object, 
  converter: createResponsiveConverter({
    enumMap: {
      'default': 'flexDefault',
      'none': 'flexNone',
      '1': 'flex_1',
      '2': 'flex_2'
    }
  })
})
flex?: ResponsiveValue<'flexDefault' | 'flexNone' | 'flex_1' | 'flex_2'>;
```

**Example (pfv6-divider - simple values)**:
```typescript
@property({ 
  converter: createResponsiveConverter() 
})
inset?: ResponsiveValue<'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'>;
```

#### Building CSS Classes

**Use Case**: Generate responsive CSS class names from `ResponsiveValue<T>` for use with `classMap()`.

```typescript
/**
 * Build responsive CSS classes with custom class name generation
 * @param value ResponsiveValue object
 * @param options.classNameBuilder Callback to generate class name for each value/breakpoint
 * @returns Object for classMap() with class names as keys
 */
export function buildResponsiveClasses<T extends string>(
  value: ResponsiveValue<T> | undefined,
  options: {
    classNameBuilder: (value: T, breakpoint?: string) => string;
  }
): Record<string, boolean>
```

**Example (pfv6-divider - inset with prefix)**:
```typescript
import { buildResponsiveClasses } from '../../lib/responsive-attributes.js';

#getClasses() {
  const classes = {
    ...buildResponsiveClasses(this.inset, {
      classNameBuilder: (value, breakpoint) =>
        breakpoint ? `inset-${value}-on-${breakpoint}` : `inset-${value}`
    })
  };
  // Result for inset="md lg:lg": { 'inset-md': true, 'inset-lg-on-lg': true }
  return classes;
}
```

**Example (pfv6-divider - orientation without prefix)**:
```typescript
#getClasses() {
  const classes = {
    ...buildResponsiveClasses(this.orientation, {
      classNameBuilder: (value, breakpoint) =>
        breakpoint ? `${value}-on-${breakpoint}` : value
    })
  };
  // Result for orientation="vertical md:horizontal": 
  // { 'vertical': true, 'horizontal-on-md': true }
  return classes;
}
```

**Example (pfv6-flex - complex with kebab-case conversion)**:
```typescript
import { buildResponsiveClasses } from '../../lib/responsive-attributes.js';
import { toKebabCase } from '../../lib/helpers.js';

#getClasses() {
  const classes = {
    ...buildResponsiveClasses(this.alignItems, {
      classNameBuilder: (value, breakpoint) => {
        const kebabValue = toKebabCase(value);  // 'alignItemsCenter' → 'align-items-center'
        return breakpoint ? `${kebabValue}-${breakpoint}` : kebabValue;
      }
    })
  };
  return classes;
}
```

#### Iterating Over Values

**Use Case**: Execute side effects for each breakpoint value (e.g., setting CSS variables).

```typescript
/**
 * Execute callback for each defined breakpoint value
 * @param value ResponsiveValue object
 * @param callback Function called with (value, breakpoint)
 */
export function forEachResponsiveValue<T>(
  value: ResponsiveValue<T> | undefined,
  callback: (value: T, breakpoint: 'default' | Breakpoint) => void
): void
```

**Example (pfv6-gallery - setting CSS variables)**:
```typescript
import { forEachResponsiveValue } from '../../lib/responsive-attributes.js';

#updateBreakpointVariables(): void {
  // Set min widths
  forEachResponsiveValue(this.minWidths, (value, breakpoint) => {
    const varName = breakpoint === 'default'
      ? '--pf-v6-l-gallery--GridTemplateColumns--min'
      : `--pf-v6-l-gallery--GridTemplateColumns--min-on-${breakpoint}`;
    this.style.setProperty(varName, value);
  });
  
  // Set max widths
  forEachResponsiveValue(this.maxWidths, (value, breakpoint) => {
    const varName = breakpoint === 'default'
      ? '--pf-v6-l-gallery--GridTemplateColumns--max'
      : `--pf-v6-l-gallery--GridTemplateColumns--max-on-${breakpoint}`;
    this.style.setProperty(varName, value);
  });
}
```

#### Utility Functions

```typescript
/**
 * Convert camelCase or PascalCase to kebab-case
 * @example "alignItemsCenter" → "align-items-center"
 */
export function toKebabCase(str: string): string
```

### Complete Component Example

**pfv6-divider.ts** (simplified):

```typescript
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { classMap } from 'lit/directives/class-map.js';

import {
  type ResponsiveValue,
  createResponsiveConverter,
  buildResponsiveClasses
} from '../../lib/responsive-attributes.js';

import styles from './pfv6-divider.css';

@customElement('pfv6-divider')
export class Pfv6Divider extends LitElement {
  static readonly styles = styles;

  /**
   * Inset at various breakpoints
   * @example inset="md" or inset="md lg:lg xl:xs"
   */
  @property({ converter: createResponsiveConverter() })
  inset?: ResponsiveValue<'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'>;

  /**
   * Orientation at various breakpoints
   * @example orientation="vertical" or orientation="vertical md:horizontal"
   */
  @property({ converter: createResponsiveConverter() })
  orientation?: ResponsiveValue<'vertical' | 'horizontal'>;

  render() {
    return html`
      <hr class=${classMap(this.#getClasses())} role="separator">
    `;
  }

  #getClasses() {
    return {
      ...buildResponsiveClasses(this.orientation, {
        classNameBuilder: (value, breakpoint) =>
          breakpoint ? `${value}-on-${breakpoint}` : value
      }),
      ...buildResponsiveClasses(this.inset, {
        classNameBuilder: (value, breakpoint) =>
          breakpoint ? `inset-${value}-on-${breakpoint}` : `inset-${value}`
      }),
    };
  }
}
```

**Usage**:
```html
<!-- Single value -->
<pfv6-divider orientation="vertical" inset="md"></pfv6-divider>

<!-- Responsive values -->
<pfv6-divider 
  orientation="vertical md:horizontal" 
  inset="none md:sm lg:lg"
></pfv6-divider>
```

### When to Use These Libraries

**Use `lib/helpers.ts` when**:
- ✅ Converting kebab-case to camelCase
- ✅ Capitalizing strings
- ✅ Any string transformation used across multiple components

**Use `lib/responsive-attributes.ts` when**:
- ✅ Component has attributes that support PatternFly breakpoints (default, sm, md, lg, xl, 2xl)
- ✅ Need to parse strings like `"md sm:lg xl:2xl"` into structured objects
- ✅ Need to generate responsive CSS classes for `classMap()`
- ✅ Need to iterate over breakpoint values (e.g., setting CSS variables)

**Do NOT use these libraries when**:
- ❌ Component has simple string/boolean/number properties (no breakpoint support)
- ❌ Custom parsing logic is significantly different from PatternFly patterns
- ❌ One-off string transformations specific to a single component

### Migration Checklist

When refactoring an existing component to use these libraries:

- [ ] Replace local `capitalize` and `toCamelCase` with imports from `lib/helpers.ts`
- [ ] Replace local responsive value parsing with `createResponsiveConverter()`
- [ ] Replace local class generation with `buildResponsiveClasses()`
- [ ] Update type definitions to use `ResponsiveValue<T>` from library
- [ ] Remove local `ResponsiveValue` type definitions
- [ ] Remove local parsing/serialization functions
- [ ] Verify all tests still pass
- [ ] Run linter to catch any issues

## React-to-LitElement API Translation

This section is **critical** for understanding how to convert PatternFly React components to LitElement web components while maintaining 1:1 API parity.

### What is "API" in Web Components?

The **API (Application Programming Interface)** of a web component is how developers interact with and customize it. This includes:

1. **CSS Custom Properties** (CSS Variables) - Visual customization
2. **Attributes & Properties** - Component configuration
3. **Slots** - Content composition
4. **Events** - Component interactions
5. **Methods** - Programmatic control
6. **Parts** - External styling hooks

For PatternFly components, **1:1 API parity** means developers should be able to achieve the same results with our web components as they can with React components, using equivalent (but platform-appropriate) APIs.

### 1. CSS Variables as Public API

**CRITICAL CONCEPT**: CSS custom properties are part of your component's **public API**, not implementation details.

#### The Principle

When PatternFly React exposes a CSS variable like `--pf-v6-c-card--BackgroundColor`, users can customize it:

```css
/* React PatternFly */
.my-card {
  --pf-v6-c-card--BackgroundColor: var(--my-custom-color);
}
```

**Our LitElement components MUST expose the same CSS variables** so users get identical customization:

```css
/* LitElement PatternFly */
pfv6-card {
  --pf-v6-c-card--BackgroundColor: var(--my-custom-color);
}
```

#### 🚨 CRITICAL: How to Translate React CSS to Shadow DOM

**Source of Truth**: `node_modules/@patternfly/react-styles/css/components/{Component}/{component}.css`

**NEVER make up CSS values**. ALWAYS translate directly from the React CSS file.

**Translation Process**:

1. **Locate the React CSS file**:
   ```
   node_modules/@patternfly/react-styles/css/components/Card/card.css
   node_modules/@patternfly/react-styles/css/components/Check/check.css
   etc.
   ```

2. **Copy the CSS variable declarations from the class**:
   
   React (Light DOM):
   ```css
   /* From card.css */
   .pf-v6-c-card {
     --pf-v6-c-card--BackgroundColor: var(--pf-t--global--background--color--primary--default);
     --pf-v6-c-card--BorderColor: var(--pf-t--global--border--color--default);
     --pf-v6-c-card--BorderRadius: var(--pf-t--global--border--radius--medium);
   }
   ```

3. **Paste into `:host` block WITHOUT modifications** (Shadow DOM):
   ```css
   /* pfv6-card.css */
   :host {
     /* Public API - copied directly from card.css - DO NOT MODIFY */
     --pf-v6-c-card--BackgroundColor: var(--pf-t--global--background--color--primary--default);
     --pf-v6-c-card--BorderColor: var(--pf-t--global--border--color--default);
     --pf-v6-c-card--BorderRadius: var(--pf-t--global--border--radius--medium);
   }
   ```
   
   **IMPORTANT**: Do NOT wrap these in `--_private` variables yet. Copy them **exactly as-is** from React CSS.

4. **Translate class selectors to Shadow DOM selectors**:
   
   React (Light DOM):
   ```css
   .pf-v6-c-card {
     display: grid;
     gap: var(--pf-v6-c-card--GridGap);
   }
   
   .pf-v6-c-card__title {
     font-size: var(--pf-v6-c-card__title--FontSize);
   }
   ```
   
   LitElement (Shadow DOM) - **Use variables directly (no `--_private` wrapper)**:
   ```css
   #container {
     display: grid;
     gap: var(--pf-v6-c-card--GridGap);
   }
   
   #title {
     font-size: var(--pf-v6-c-card__title--FontSize);
   }
   ```
   
   **CRITICAL**: Reference the public API variables **directly** in your CSS. The variables are already defined on `:host`, so they pierce the Shadow DOM boundary and can be overridden from Light DOM. You do **NOT** need the two-layer `--_private` pattern for most PatternFly CSS translations.

5. **🚨 CRITICAL: ALWAYS Add box-sizing Reset**:

   **MANDATORY**: Every component CSS file MUST start with this reset:
   
   ```css
   /* 
    * CRITICAL: Shadow DOM box-sizing reset
    * PatternFly base.css sets: *, *::before, *::after { box-sizing: border-box; }
    * box-sizing is NOT inherited, so Shadow DOM elements default to content-box
    * This causes layout differences vs React PatternFly
    * MUST be included in EVERY component's CSS
    */
   *,
   *::before,
   *::after {
     box-sizing: border-box;
   }
   ```
   
   **Why This Matters**:
   - PatternFly React relies on `box-sizing: border-box` from base.css
   - `box-sizing` is **NOT an inherited property**
   - Shadow DOM elements default to `content-box` (browser default)
   - This causes width/height calculations to differ between React and Lit
   - Text reflow and layout will be incorrect without this reset
   
   **When to Add**:
   - ✅ At the **top** of every component CSS file (before `:host`)
   - ✅ For main components (e.g., `pfv6-card.css`)
   - ✅ For sub-components (e.g., `pfv6-card-title.css`, `pfv6-card-body.css`)
   - ✅ Even if the component seems simple

6. **Key Translation Rules**:
   - ✅ `.pf-v6-c-{component}` → `#container` (main wrapper)
   - ✅ `.pf-v6-c-{component}__{element}` → `#{element}` (sub-elements)
   - ✅ `.pf-m-{modifier}` → CSS class with `classMap()` or host attribute
   - ✅ Keep ALL CSS variable names **exactly** as they appear in React CSS
   - ✅ Use same token references (don't substitute with hardcoded values)
   - ❌ **NEVER** make up CSS variable names
   - ❌ **NEVER** guess at token values

7. **🚨 CRITICAL: ALWAYS Validate Against React CSS Source**:

   **MANDATORY VALIDATION STEP** - After writing or modifying component CSS:

   ```bash
   # Open the React CSS file side-by-side with your Lit CSS
   node_modules/@patternfly/react-styles/css/components/{Component}/{component}.css
   ```

   **Verify EVERY aspect**:
   - ✅ **Variable names**: Do they match React exactly?
   - ✅ **Variable values**: Do token references match?
   - ✅ **Calculations**: Do `calc()` expressions reference the correct variables?
   - ✅ **Selectors**: Are all React selectors translated?
   - ✅ **Properties**: Are all CSS properties preserved?
   - ✅ **Order**: Are selectors in logical order (no specificity issues)?

   **Special attention for calculations**:
   
   When React CSS has calculations that reference other CSS variables:
   ```css
   /* React (check.css line 15) */
   --pf-v6-c-check__input--TranslateY: calc(
     (var(--pf-v6-c-check__label--LineHeight) * var(--pf-v6-c-check__label--FontSize) / 2) - 50%
   );
   ```

   **❌ DON'T** substitute with token values directly:
   ```css
   /* WRONG - loses API parity! */
   calc((var(--pf-t--global--font--line-height--body) * var(--pf-t--global--font--size--body--default) / 2) - 50%)
   ```

   **✅ DO** preserve variable references with nested fallbacks:
   ```css
   /* CORRECT - maintains API parity */
   calc(
     (
       var(--pf-v6-c-check__label--LineHeight, var(--pf-t--global--font--line-height--body)) *
       var(--pf-v6-c-check__label--FontSize, var(--pf-t--global--font--size--body--default)) / 2
     ) - 50%
   )
   ```

   **Why this matters**:
   - Users can customize `--pf-v6-c-check__label--FontSize` and calculations update automatically
   - Maintains 1:1 API parity with React PatternFly
   - Ensures same customization patterns work across React and Lit

   **Validation checklist** (after every CSS change):
   - [ ] Opened React CSS file (`node_modules/@patternfly/react-styles/css/components/{Component}/{component}.css`)
   - [ ] Compared variable names line-by-line
   - [ ] Verified calculations reference correct variables
   - [ ] Checked that nested fallbacks preserve API names
   - [ ] Confirmed all selectors are translated
   - [ ] Tested that computed styles match React in browser

   **If you skip this validation, visual parity tests WILL fail.**

7. **🚨 CRITICAL: Slotted Component Layout Integration**

   **The Problem**: When web components are slotted into another component's layout, their internal Shadow DOM structure (e.g., `display: grid` with `grid-gap`) can add unwanted space, breaking visual parity with React.

   **Core Issue**: React components are just divs that naturally participate in the parent's layout. Lit web components have their own Shadow DOM containers with their own layout properties (grid, flex, gaps, padding), which can interfere with the parent's layout expectations.

   **Why This Happens**:
   - **React**: Child components render as plain divs - no internal layout, participate naturally in parent's layout
   - **Lit**: Child components have Shadow DOM with their own layout (e.g., `display: grid`, `grid-gap`) that adds structural height/width
   - **Result**: Slotted Lit components can be taller/wider than React equivalents, even with identical content
   
   **Real Example: Nested Checkboxes**:
   
   React structure:
   ```html
   <div class="pf-v6-c-check">  <!-- Parent -->
     <div class="pf-v6-c-check__body">  <!-- Body -->
       <div class="pf-v6-c-check">  <!-- Child 1 - just a div, height: 21px -->
         <input />
         <label>Child 1</label>
       </div>
       <div class="pf-v6-c-check">  <!-- Child 2 - just a div, height: 21px -->
         <input />
         <label>Child 2</label>
       </div>
     </div>
   </div>
   ```
   
   Lit structure (BEFORE fix):
   ```html
   <pfv6-checkbox>  <!-- Parent -->
     #shadow-root
       <div id="body">
         <pfv6-checkbox slot="body">  <!-- Child 1 :host - height: 29px! (8px extra) -->
           #shadow-root
             <div id="container" style="display: grid; gap: 8px">
               <input />
               <label>Child 1</label>
             </div>
         </pfv6-checkbox>
         <pfv6-checkbox slot="body">  <!-- Child 2 :host - height: 29px! (8px extra) -->
           #shadow-root
             <div id="container" style="display: grid; gap: 8px">
               <input />
               <label>Child 2</label>
             </div>
         </pfv6-checkbox>
       </div>
   </pfv6-checkbox>
   ```
   
   **Problem**: Child checkbox's `grid-gap: 8px` adds 8px to container height, even though there's only 1 row. React children (plain divs) have no gap, so they're exactly 21px tall.
   
   **The Solution**:
   ```css
   /* In parent component CSS - target slotted components */
   ::slotted(pfv6-checkbox) {
     display: block;  /* Ensure proper stacking */
   
     /* CRITICAL: Remove ROW gap, keep COLUMN gap for checkbox-to-label spacing */
     /* IMPORTANT: Override PRIVATE variable (--_grid-gap), not public API */
     --_grid-gap: 0 var(--pf-t--global--spacer--gap--text-to-element--default);
   }
   ```
   
   **General Pattern**:
   ```css
   /* Parent component CSS */
   ::slotted(pfv6-some-component) {
     /* Override child's internal PRIVATE variables (--_*) */
     --_some-property: adjusted-value;
   }
   ```
   
   **CRITICAL: Override Private Variables, Not Public API**:
   - ✅ **DO** override private variables (`--_*`) - these are implementation details
   - ❌ **DON'T** override public API variables (`--pf-v6-c-*`) - these are for end users
   - **Why**: Slotted component integration is an internal implementation concern
   - Public API remains available for user customization
   
   ```css
   /* BAD - Overrides public API variable */
   ::slotted(pfv6-checkbox) {
     --pf-v6-c-check--GridGap: 0;  /* ❌ Wrong layer! */
   }
   
   /* GOOD - Overrides private implementation variable */
   ::slotted(pfv6-checkbox) {
     --_grid-gap: 0 var(--pf-t--global--spacer--gap--text-to-element--default);  /* ✅ Correct! */
   }
   ```
   
   **Important**: When overriding compound CSS properties like `grid-gap` (shorthand for `row-gap column-gap`), preserve the values you need:
   ```css
   /* BAD - Removes both row AND column gap */
   --_grid-gap: 0;
   
   /* GOOD - Removes row gap, keeps column gap for spacing */
   --_grid-gap: 0 var(--pf-t--global--spacer--gap--text-to-element--default);
   ```
   
   **Why This Works**:
   - Uses `::slotted()` selector to target only slotted instances
   - Overrides CSS custom properties in child's Shadow DOM
   - Preserves normal behavior for standalone components
   - Matches React's expectation: child components participate in parent layout without adding their own spacing
   
   **When to Apply This**:
   - ✅ Component slots in other web components (recursive nesting or composition)
   - ✅ Slotted component uses `display: grid` or `display: flex` with gaps
   - ✅ React expects child to participate naturally in parent's layout
   - ✅ Visual tests show extra spacing around slotted components
   - ✅ Browser DevTools shows slotted component `:host` is taller/wider than its content
   
   **Common Scenarios**:
   1. **Recursive nesting**: `<pfv6-checkbox>` inside `<pfv6-checkbox>`
   2. **List items**: `<pfv6-list-item>` inside `<pfv6-list>`
   3. **Menu items**: `<pfv6-menu-item>` inside `<pfv6-menu>`
   4. **Tree nodes**: `<pfv6-tree-node>` inside `<pfv6-tree-node>`
   5. **Accordion items**: `<pfv6-accordion-item>` inside `<pfv6-accordion>`
   6. **Any composition** where React uses plain divs and Lit uses web components
   
   **How to Detect This Issue**:
   
   1. **Visual inspection**: Slotted components appear more spaced out than React
   
   2. **Browser DevTools**: 
      - Inspect parent component in React (highlight shows tight layout)
      - Inspect parent component in Lit (highlight shows extra spacing)
      - Compare highlighted grid/flex containers
   
   3. **Measure heights/widths**:
   ```typescript
   // In browser console or test
   const slottedChild = document.querySelector('pfv6-component[slot="..."]');
   const childRect = slottedChild.getBoundingClientRect();
   const containerRect = slottedChild.shadowRoot.querySelector('#container').getBoundingClientRect();
   
   console.log('Child :host height:', childRect.height);
   console.log('Child #container height:', containerRect.height);
   
   // If :host height > container height, there's extra space from layout properties
   const extraSpace = childRect.height - containerRect.height;
   console.log('Extra space:', extraSpace, 'px');
   ```
   
   4. **Check CSS properties**:
   ```typescript
   const container = slottedChild.shadowRoot.querySelector('#container');
   const computed = window.getComputedStyle(container);
   console.log('display:', computed.display);  // grid, flex?
   console.log('gap:', computed.gap);  // Non-zero gap?
   console.log('padding:', computed.padding);  // Extra padding?
   ```
   
   **Properties to Check for Overrides**:
   - `--_grid-gap` / `--_gap` - Grid/flex gaps (use private variables!)
   - `--_padding-*` - Internal padding (use private variables!)
   - `--_margin-*` - Internal margins (use private variables!)
   - Any **private** layout property (`--_*`) that adds structural space
   - **NEVER** override public API variables (`--pf-v6-c-*`) for integration fixes
   
   **Important Notes**:
   - ✅ **DO** override layout properties that add unwanted space
   - ✅ **DO** test both standalone and slotted usage
   - ✅ **DO** check React demos for composition patterns
   - ❌ **DON'T** override properties that affect visual styling (colors, borders, fonts)
   - ❌ **DON'T** assume all slotted components need overrides - only when React expects natural participation
   
   **Testing Checklist**:
   - [ ] Measure component height/width in React vs Lit
   - [ ] Highlight grid/flex containers in browser DevTools
   - [ ] Check for extra space in `:host` wrapper
   - [ ] Verify slotted components match React tightness
   - [ ] Test both standalone and slotted usage

**Complete Example**:

React CSS (`check.css`):
```css
.pf-v6-c-check {
  --pf-v6-c-check--GridGap: var(--pf-t--global--spacer--gap--group--vertical) var(--pf-t--global--spacer--gap--text-to-element--default);
  --pf-v6-c-check__label--FontSize: var(--pf-t--global--font--size--body--default);
  --pf-v6-c-check__label--LineHeight: var(--pf-t--global--font--line-height--body);
}

.pf-v6-c-check {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: var(--pf-v6-c-check--GridGap);
}

.pf-v6-c-check__label {
  font-size: var(--pf-v6-c-check__label--FontSize);
  line-height: var(--pf-v6-c-check__label--LineHeight);
}
```

LitElement CSS (`pfv6-checkbox.css`) - CORRECT two-layer pattern:
```css
:host {
  /* Two-layer pattern: Private variables reference public API with fallbacks */
  --_grid-gap: var(--pf-v6-c-check--GridGap, var(--pf-t--global--spacer--gap--group--vertical) var(--pf-t--global--spacer--gap--text-to-element--default));
  --_label-font-size: var(--pf-v6-c-check__label--FontSize, var(--pf-t--global--font--size--body--default));
  --_label-line-height: var(--pf-v6-c-check__label--LineHeight, var(--pf-t--global--font--line-height--body));
}

#container {
  display: grid;
  grid-template-columns: auto 1fr;
  /* ✅ Use private variable internally */
  gap: var(--_grid-gap);
}

#label {
  /* ✅ Use private variables internally */
  font-size: var(--_label-font-size);
  line-height: var(--_label-line-height);
}
```

**Why This Matters**:
- ✅ Ensures 100% CSS API parity with React (users can override `--pf-v6-c-check--GridGap`)
- ✅ Uses exact same token references in fallbacks
- ✅ Computed styles will match pixel-perfect
- ✅ **Internal CSS only uses private variables** - clean separation
- ❌ Making up values causes visual differences in parity tests
- ❌ Using public API variables directly violates the two-layer pattern

#### 🚨 CRITICAL: Two-Layer Pattern is ALWAYS Required

**For Shadow DOM components, ALWAYS use the two-layer CSS variable pattern.**

**THE ABSOLUTE RULE**: **ALL internal CSS must use ONLY private variables (`--_*`).**

**How it works**: 
1. **In `:host`**: Define private variables that reference public API with fallbacks
2. **In internal selectors** (`#container`, `#label`, etc.): Use ONLY private variables
3. **NEVER** use public API variables (`--pf-v6-c-*`) directly in internal CSS

**Single-line format** (on `:host`):
```css
:host {
  /* Private variables reference public API with fallback (single line) */
  --_grid-gap: var(--pf-v6-c-check--GridGap, var(--pf-t--global--spacer--gap--group--vertical) var(--pf-t--global--spacer--gap--text-to-element--default));
  --_label-font-size: var(--pf-v6-c-check__label--FontSize, var(--pf-t--global--font--size--body--default));
}
```

**This exposes the public API automatically**:
- Users can override `--pf-v6-c-check--GridGap` from Light DOM
- If not overridden, falls back to the token value
- Component uses `--_grid-gap` internally

**Use private variables in your CSS** (MANDATORY):
```css
#container {
  /* ✅ CORRECT - Use private variable */
  gap: var(--_grid-gap);
}

#label {
  /* ✅ CORRECT - Use private variable */
  font-size: var(--_label-font-size);
}
```

**WRONG - Don't do this**:
```css
#container {
  /* ❌ WRONG - Using public API variable directly! */
  gap: var(--pf-v6-c-check--GridGap);
}
```

**Why Two Layers?**
1. **Public API** (`--pf-v6-c-*`) - Exposed to users, can be overridden from Light DOM
2. **Private variables** (`--_*`) - Internal implementation, provides fallback resilience
3. **Clean separation** - Internal CSS never directly touches public API

**Complete Translation Example**:

React CSS (`check.css`):
```css
.pf-v6-c-check {
  --pf-v6-c-check--GridGap: var(--pf-t--global--spacer--gap--group--vertical) var(--pf-t--global--spacer--gap--text-to-element--default);
}

.pf-v6-c-check {
  grid-gap: var(--pf-v6-c-check--GridGap);
}
```

Lit CSS (`pfv6-checkbox.css`) - CORRECT two-layer pattern:
```css
:host {
  /* Private variable references public API name with token fallback (single line) */
  --_grid-gap: var(--pf-v6-c-check--GridGap, var(--pf-t--global--spacer--gap--group--vertical) var(--pf-t--global--spacer--gap--text-to-element--default));
}

#container {
  /* ✅ ALWAYS use private variable internally */
  gap: var(--_grid-gap);
}
```

**How users customize**:
```css
/* User's Light DOM CSS */
pfv6-checkbox {
  --pf-v6-c-check--GridGap: 1rem; /* Overrides the public API */
}
```

**Benefits**:
- ✅ Exposes PatternFly public API automatically (users can override `--pf-v6-c-check--GridGap`)
- ✅ More resilient than React (maintains token defaults when variables are `unset`)
- ✅ Single-line format is concise and maintainable
- ✅ Clean separation between public API and internal implementation
- ✅ **Internal CSS only uses private variables** - no accidental public API pollution

**Special Case: Responsive Variables**

For components with responsive behavior (media queries), private variables may need to be **redefined** in `#container`:

```css
:host {
  /* Define base private variables */
  --_grid-template-columns-min: var(--pf-v6-l-gallery--GridTemplateColumns--min, 250px);
  --_grid-template-columns-max: var(--pf-v6-l-gallery--GridTemplateColumns--max, 1fr);
}

#container {
  /* Redefine private variable for responsive composition */
  --_grid-template-columns-minmax-min: var(--_grid-template-columns-min);
  --_grid-template-columns-minmax-max: var(--_grid-template-columns-max);
  
  /* Use private variables in grid */
  grid-template-columns: 
    repeat(
      auto-fill, 
      minmax(
        var(--_grid-template-columns-minmax-min), 
        var(--_grid-template-columns-minmax-max)
      )
    );
}

@media (width >= 48rem) {
  #container {
    /* Redefine private variable to reference breakpoint-specific public API */
    --_grid-template-columns-minmax-min:
      var(
        --pf-v6-l-gallery--GridTemplateColumns--min-on-md,
        var(--pf-v6-l-gallery--GridTemplateColumns--min, 250px)
      );
  }
}
```

**Why responsive variables must be redefined in `#container`**:
1. `grid-template-columns` is applied to `#container`, so variables must be evaluated there
2. Media queries update the private variable to reference **different public API variables** at each breakpoint
3. The fallback chain still references public API, so users can override from Light DOM
4. **All variables remain private** (`--_*`) - internal CSS never directly uses `--pf-v6-c-*`

#### Shadow DOM vs Light DOM: No Difference for API

**Key Insight**: Even though our components use Shadow DOM (encapsulated styles), CSS custom properties **pierce** the Shadow boundary.

```typescript
// Inside pfv6-card.css (Shadow DOM)
:host {
  /* Public API - Define these CSS variables */
  --pf-v6-c-card--BackgroundColor: var(--pf-t--global--background--color--primary--default);
  --pf-v6-c-card--BorderColor: var(--pf-t--global--border--color--default);
  --pf-v6-c-card--BorderRadius: var(--pf-t--global--border--radius--medium);
}

#container {
  /* Use the public API variables internally */
  background-color: var(--pf-v6-c-card--BackgroundColor);
  border-color: var(--pf-v6-c-card--BorderColor);
  border-radius: var(--pf-v6-c-card--BorderRadius);
}
```

Users can customize from Light DOM:

```css
/* Light DOM - Works even with Shadow DOM encapsulation! */
pfv6-card {
  --pf-v6-c-card--BackgroundColor: #ff0000; /* Pierces Shadow boundary */
}
```

#### Implementation Checklist

When implementing a component:

1. ✅ **Research PatternFly CSS variables**: Check [PatternFly component CSS variables docs](https://www.patternfly.org/components)
2. ✅ **Translate React CSS directly**: Copy CSS variables from `node_modules/@patternfly/react-styles/css/components/{Component}/{component}.css`
3. ✅ **Use two-layer pattern**: Private variables reference public API names with token fallbacks (single line)
4. ✅ **Document with JSDoc**: Use `@cssprop` tags for each public CSS variable
5. ✅ **Use private variables internally**: Reference `--_` variables in your component's CSS
6. ✅ **Test customization**: Verify users can override public API variables the same as React

**Example from pfv6-card**:

```css
:host {
  /* Two-layer pattern: private variables reference public API with fallbacks */
  --_background-color: var(--pf-v6-c-card--BackgroundColor, var(--pf-t--global--background--color--primary--default));
  --_box-shadow: var(--pf-v6-c-card--BoxShadow, var(--pf-t--global--box-shadow--md));
  --_first-child-padding: var(--pf-v6-c-card--first-child--PaddingBlockStart, var(--pf-t--global--spacer--lg));
}

#container {
  /* Use private variables internally */
  background-color: var(--_background-color);
  box-shadow: var(--_box-shadow);
}
```

**User customization** (from Light DOM):
```css
pfv6-card {
  /* Override public API - automatically picked up by private variable */
  --pf-v6-c-card--BackgroundColor: red;
}
```

**Documentation**:

```typescript
/**
 * @cssprop --pf-v6-c-card--BackgroundColor - Card background color
 * @cssprop --pf-v6-c-card--BorderColor - Card border color
 * @cssprop --pf-v6-c-card--BorderRadius - Card border radius
 * @cssprop --pf-v6-c-card--BoxShadow - Card box shadow
 */
```

#### Shadow DOM: Two-Layer CSS Variable Pattern

**CRITICAL DIFFERENCE**: Shadow DOM requires a different pattern than React's Light DOM for CSS variable overrides.

**The Problem**:

In React (Light DOM), users override variables by targeting the class:
```css
/* React/Light DOM - WORKS */
.pf-v6-c-card {
  --pf-v6-c-card--BackgroundColor: red;
}
```

In Shadow DOM, if you define and use variables directly on `:host`, they **cannot be easily overridden** from outside:
```css
/* Shadow DOM - DOESN'T WORK AS EXPECTED */
:host {
  --pf-v6-c-card--BackgroundColor: var(--pf-t--global--background--color--primary--default);
}

#container {
  background-color: var(--pf-v6-c-card--BackgroundColor); /* Hard to override externally! */
}
```

**The Solution: Two-Layer Pattern**

Use a **private variable** that references the **public API variable** with a fallback:

```css
:host {
  /* Private variable references public API with fallback */
  --_pfv6-card-background-color: var(
    --pf-v6-c-card--BackgroundColor,
    var(--pf-t--global--background--color--primary--default)
  );
}

#container {
  /* Use private variable internally */
  background-color: var(--_pfv6-card-background-color);
}
```

**How It Works**:

1. **User sets public API variable** from Light DOM:
```css
pfv6-card {
  --pf-v6-c-card--BackgroundColor: red; /* Pierces Shadow boundary */
}
```

2. **Private variable picks it up**:
   - If `--pf-v6-c-card--BackgroundColor` is set → uses that value
   - If not set → falls back to PatternFly token

3. **Internal CSS uses private variable**:
   - Component always uses `--_pfv6-card-background-color`
   - Provides clean separation between public API and internal implementation

**Naming Conventions**:

- **Public API variables**: Use exact PatternFly names (e.g., `--pf-v6-c-card--BackgroundColor`)
  - **Document these with `@cssprop` in JSDoc** - they are part of the public API
- **Private variables**: Use `--_` prefix + component name + descriptive name (e.g., `--_pfv6-card-background-color`)
  - **Do NOT document these** - they are internal implementation details

**Why This Pattern?**

✅ Exposes PatternFly public API variable names (1:1 with React)  
✅ Allows external overrides from Light DOM  
✅ Provides fallback to design tokens  
✅ Maintains internal implementation flexibility  
✅ Works consistently across Shadow DOM boundary  
✅ **MORE RESILIENT than React PatternFly** - maintains default styling when CSS variables are reset/unset (React becomes transparent)  

**Example: Complete Pattern**

```css
:host {
  /* Private variables that reference public API */
  --_pfv6-card-background-color: var(
    --pf-v6-c-card--BackgroundColor,
    var(--pf-t--global--background--color--primary--default)
  );
  --_pfv6-card-border-color: var(
    --pf-v6-c-card--BorderColor,
    var(--pf-t--global--border--color--default)
  );
  --_pfv6-card-border-radius: var(
    --pf-v6-c-card--BorderRadius,
    var(--pf-t--global--border--radius--medium)
  );
}

#container {
  background-color: var(--_pfv6-card-background-color);
  border-color: var(--_pfv6-card-border-color);
  border-radius: var(--_pfv6-card-border-radius);
}
```

**Usage from Light DOM**:

```css
/* User customization - works perfectly! */
pfv6-card {
  --pf-v6-c-card--BackgroundColor: #ff0000;
  --pf-v6-c-card--BorderColor: #00ff00;
}
```

#### Resilience Advantage Over React PatternFly

**IMPORTANT DISCOVERY**: Our two-layer pattern makes web components **MORE RESILIENT** than React PatternFly when CSS variables are reset.

**The Issue with React PatternFly**:

React PatternFly uses direct CSS variable references without fallbacks:
```css
/* React PatternFly - NO FALLBACK CHAIN */
.pf-v6-c-card {
  background-color: var(--pf-v6-c-card--BackgroundColor);
}
```

When `--pf-v6-c-card--BackgroundColor` is `unset` or removed:
- React card becomes **transparent** (`rgba(0, 0, 0, 0)`)
- Loses its default white background
- Visual regression: card "disappears"

**Our Solution with Two-Layer Pattern**:

```css
/* Lit/Web Components - FALLBACK CHAIN */
:host {
  --_pfv6-card-background-color: var(
    --pf-v6-c-card--BackgroundColor,
    var(--pf-t--global--background--color--primary--default)
  );
}

#container {
  background-color: var(--_pfv6-card-background-color);
}
```

When `--pf-v6-c-card--BackgroundColor` is `unset` or removed:
- Web component **maintains white background** (`rgb(255, 255, 255)`)
- Falls back to PatternFly design token
- No visual regression

**Real-World Impact**:

This is validated by `tests/css-api/card-api.spec.ts` - "CSS variable reset: unset removes custom value" test.

**Test Results**:
```
BEFORE unset:
  React: rgb(255, 255, 255) - white
  Lit:   rgb(255, 255, 255) - white

AFTER unset:
  React: rgba(0, 0, 0, 0) - TRANSPARENT (loses background!)
  Lit:   rgb(255, 255, 255) - WHITE (maintains default!)
```

This makes our components more robust in real-world scenarios where:
- CSS is dynamically modified
- Theming systems reset variables
- Third-party libraries manipulate styles
- User overrides are removed/reverted

**AI Directive**: When implementing components:
1. **ALWAYS** use the two-layer pattern for CSS variables
2. **NEVER** use public API variables (`--pf-v6-c-*`) directly in internal CSS
3. **ALWAYS** define private variables (`--_*`) in `:host` that reference public API with fallbacks
4. **ALWAYS** use only private variables in internal selectors (`#container`, `#label`, etc.)
5. For responsive variables, private variables may be **redefined** in `#container` within media queries
6. This pattern is not just for Shadow DOM compatibility - it's a fundamental improvement over React PatternFly's approach

**The Absolute Rule**: **ALL internal CSS must use ONLY private variables (`--_*`).**

### 2. Composition: Slots vs React Children

**React uses component nesting**, **Web Components use slots**. Understanding this translation is crucial for API parity.

#### React Children Pattern

In React, components nest naturally:

```tsx
// React PatternFly
<Card>
  <CardTitle>Title</CardTitle>
  <CardBody>Body content</CardBody>
  <CardFooter>Footer</CardFooter>
</Card>
```

React treats everything between `<Card>` tags as `children`. The Card component decides where to render each child based on its type/props.

#### Web Component Slot Pattern

Web Components use **slots** to define content placement:

```html
<!-- Basic slot approach (early pfv6-card design) -->
<pfv6-card>
  <span slot="title">Title</span>
  <div>Body content</div>
  <span slot="footer">Footer</span>
</pfv6-card>
```

**Problem**: This doesn't match React's component-based API!

#### The Sub-Component Solution (Preferred)

**Key Learning from pfv6-card**: To achieve 1:1 API parity with React, create **sub-components** that get slotted:

```html
<!-- LitElement with sub-components (final pfv6-card design) -->
<pfv6-card>
  <pfv6-card-title>Title</pfv6-card-title>
  <pfv6-card-body>Body content</pfv6-card-body>
  <pfv6-card-footer>Footer</pfv6-card-footer>
</pfv6-card>
```

Now compare to React:

```tsx
// React PatternFly
<Card>
  <CardTitle>Title</CardTitle>
  <CardBody>Body content</CardBody>
  <CardFooter>Footer</CardFooter>
</Card>
```

**Perfect API alignment!** ✅

#### When to Use Sub-Components vs Named Slots

**Use Sub-Components when:**
- ✅ React uses sub-components (CardTitle, CardBody, CardFooter)
- ✅ Content areas need their own properties (e.g., `CardBody` has `isFilled` prop)
- ✅ Multiple instances allowed (e.g., multiple `CardBody` elements)
- ✅ You want 1:1 React API parity

**Use Named Slots when:**
- ✅ Simple content areas without properties (e.g., `slot="actions"` for action buttons)
- ✅ Header-specific content (images, icons) that aren't standalone components in React
- ✅ Content is plain HTML/text, not a React component

**Example: pfv6-card's hybrid approach**

```html
<pfv6-card>
  <!-- Sub-components (match React sub-components) -->
  <pfv6-card-title component="h4">Title</pfv6-card-title>
  <pfv6-card-body filled>Body 1</pfv6-card-body>
  <pfv6-card-body>Body 2</pfv6-card-body>
  <pfv6-card-footer>Footer</pfv6-card-footer>
  
  <!-- Named slots (header-specific, not React sub-components) -->
  <img slot="header-image" src="logo.svg" alt="Logo">
  <div slot="actions">
    <button>Action</button>
  </div>
</pfv6-card>
```

#### Cardinality: Matching React's Component Rules

**Critical**: React components have specific **cardinality rules** (how many instances are allowed). We must match these!

| React Component | Cardinality | LitElement Equivalent | Notes |
|-----------------|-------------|----------------------|-------|
| `CardTitle` | 0..1 (optional, max one) | `<pfv6-card-title>` | At most one title |
| `CardBody` | 0..* (optional, multiple) | `<pfv6-card-body>` | Can have multiple body sections |
| `CardFooter` | 0..1 (optional, max one) | `<pfv6-card-footer>` | At most one footer |
| `CardExpandableContent` | 0..1 (only for expandable) | `<pfv6-card-expandable-content>` | Only in expandable cards |

**How to discover cardinality:**

1. **Check PatternFly React demos** - Count instances in examples
2. **Review React TypeScript types** - Look for `React.ReactNode` vs `React.ReactNode[]`
3. **Test in React** - Try adding multiple instances and see if it breaks
4. **Document in JSDoc** - Clarify cardinality for developers

#### The `display: contents` Pattern

When creating sub-components, use **`display: contents`** to make them layout-transparent:

```css
/* pfv6-card-body.css */
:host {
  /* Makes the custom element transparent to layout */
  display: contents;
}

#container {
  /* Apply actual layout/spacing here */
  display: flex;
  flex-direction: column;
  gap: var(--pf-v6-c-card--child--Gap);
  padding: var(--pf-v6-c-card--child--PaddingBlock) var(--pf-v6-c-card--child--PaddingInline);
}
```

**Why this matters**: The parent card uses flexbox/grid layout. With `display: contents`, the sub-component's wrapper disappears from the layout tree, and its children participate directly in the parent's layout.

```html
<!-- Visual layout (with display: contents) -->
<pfv6-card> (flex container)
  ├─ [pfv6-card-title contents] (flex item)
  ├─ [pfv6-card-body contents] (flex item)
  └─ [pfv6-card-footer contents] (flex item)

<!-- Without display: contents -->
<pfv6-card> (flex container)
  ├─ <pfv6-card-title> (flex item - WRONG!)
  │   └─ [title contents]
  ├─ <pfv6-card-body> (flex item - WRONG!)
  │   └─ [body contents]
  └─ <pfv6-card-footer> (flex item - WRONG!)
      └─ [footer contents]
```

### 3. Properties vs Attributes: React Props Translation

React props and LitElement properties are similar but have critical differences.

#### React Props (Flexible)

React props can be **anything**:

```tsx
// React - props can be ANY type
<Card
  title="String prop"
  isCompact={true}
  onClick={() => alert('clicked')}
  headerActions={<Button>Action</Button>}  // ← Can pass components!
  customData={{ foo: 'bar', nested: { value: 42 } }}
/>
```

#### LitElement Properties (Constrained)

Web Component properties have limitations:

```typescript
// LitElement - limited types via attributes
<pfv6-card
  compact                           // ✅ Boolean attribute
  size="compact"                    // ✅ String attribute
  @click=${() => alert('clicked')}  // ✅ Event listener
  .customData=${{ foo: 'bar' }}     // ✅ Property (not attribute)
>
  <!-- ❌ CANNOT pass components as properties! -->
  <!-- Use slots instead: -->
  <pfv6-button slot="actions">Action</pfv6-button>
</pfv6-card>
```

#### Key Differences

| React Prop Type | LitElement Equivalent | Notes |
|-----------------|----------------------|-------|
| `string` | `@property({ type: String })` | Works as attribute |
| `number` | `@property({ type: Number })` | Works as attribute |
| `boolean` | `@property({ type: Boolean })` | Works as attribute |
| `function` | Event listener (`@event`) | Use custom events, not function props |
| **`React.ReactNode`** (component) | **Slot** | **CRITICAL: Use slots, not properties!** |
| `object`/`array` | `@property({ type: Object })` | Property only (not attribute) |

#### Translation Strategy: React Props to LitElement

**Step 1: Identify React component's props**

```typescript
// React TypeScript interface
interface CardProps {
  title?: string;                    // String prop
  isCompact?: boolean;               // Boolean prop
  isExpandable?: boolean;            // Boolean prop
  children?: React.ReactNode;        // Content (SLOT!)
  onExpand?: (event: ExpandEvent) => void;  // Function prop (EVENT!)
}
```

**Step 2: Map to LitElement API**

```typescript
// LitElement equivalent
@customElement('pfv6-card')
export class PfCard extends LitElement {
  /**
   * Whether the card is compact
   */
  @property({ type: Boolean, reflect: true })
  compact = false;
  
  /**
   * Whether the card is expandable
   */
  @property({ type: Boolean, reflect: true })
  expandable = false;
  
  /**
   * Title content
   * NOTE: In pfv6-card, we use <pfv6-card-title> sub-component instead
   */
  @property({ type: String })
  title?: string;
  
  // children → default slot (no property needed)
  // onExpand → custom event
}
```

**Step 3: Handle special cases**

```typescript
// React: Component as prop (CardTitle sub-component)
<Card>
  <CardTitle component="h4">Title</CardTitle>
</Card>

// LitElement: Sub-component with property
<pfv6-card>
  <pfv6-card-title component="h4">Title</pfv6-card-title>
</pfv6-card>

@customElement('pfv6-card-title')
export class PfCardTitle extends LitElement {
  /**
   * HTML heading element (h1-h6) or div
   */
  @property({ type: String })
  component: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' = 'div';
}
```

#### Form Inputs: Native HTML Works!

**Key Learning**: Form inputs (radio, checkbox) work natively without special handling!

```tsx
// React PatternFly
<Card>
  <CardTitle>
    <input type="radio" name="cards" id="card1" />
    <label htmlFor="card1">Selectable Card</label>
  </CardTitle>
</Card>
```

```html
<!-- LitElement - Same HTML works! -->
<pfv6-card>
  <pfv6-card-title>
    <input type="radio" name="cards" id="card1">
    <label for="card1">Selectable Card</label>
  </pfv6-card-title>
</pfv6-card>
```

**No special "selectable" variant needed** - just slot native HTML!

#### Boolean Properties: The Default Value Problem ⚠️

**CRITICAL CHALLENGE**: Boolean properties with `true` defaults don't translate directly to HTML boolean attributes.

**The Problem:**

React props can default to any value:
```tsx
// React: isFilled defaults to TRUE
<CardBody isFilled={true}>      // default (usually omitted)
<CardBody isFilled={false}>     // explicit override
```

HTML boolean attributes work differently:
```html
<!-- HTML: Presence = true, Absence = false -->
<input disabled>   <!-- disabled=true -->
<input>            <!-- disabled=false -->
```

**The Conflict:**

When a React prop defaults to `true`, the HTML boolean attribute semantic is **inverted**:

```typescript
// ❌ PROBLEMATIC: Boolean with true default
@property({ type: Boolean, reflect: true })
filled = true;  // Default is TRUE

// HTML usage becomes confusing:
<pfv6-card-body>              <!-- filled=true (default), but attribute ABSENT -->
<pfv6-card-body filled>        <!-- filled=true, attribute PRESENT -->
<pfv6-card-body filled="false"> <!-- ⚠️ String "false", confusing! -->
```

The CSS selector `:host([filled])` only matches when the attribute is **present in DOM**, but the property defaults to `true` even when absent!

**Solutions:**

**Solution 1: Use String Enum** ✅ **RECOMMENDED for `true` defaults**

When React defaults to `true`, use a string enum for explicit, clear API:

```typescript
// React: isFilled={true} (default)
// LitElement: filled="true" (default)

@property({ type: String, reflect: true })
filled: 'true' | 'false' = 'true';

// HTML usage (explicit and clear):
<pfv6-card-body>                  <!-- defaults to 'true' -->
<pfv6-card-body filled="false">   <!-- explicit no-fill -->

// CSS with classMap (RECOMMENDED):
render() {
  return html`<div class=${classMap({ 'no-fill': this.filled === 'false' })}>`;
}

#container { flex: 1 1 auto; } /* default */
#container.no-fill { flex: 0 1 auto; }
```

**Advantages**:
- ✅ Explicit API matches PatternFly naming conventions
- ✅ Works with both HTML attributes and property binding
- ✅ No confusing boolean attribute semantics (attribute absence = false doesn't work when default is true)
- ✅ Use with `classMap()` for best Shadow DOM CSS performance

**Solution 2: Invert the Property Name**

Match HTML boolean semantics by inverting to a "negative" property:

```typescript
// React: isFilled={true} (default)
// LitElement: noFill={false} (default)

@property({ type: Boolean, reflect: true })
noFill = false;  // Absence = filled (matches React default)

// HTML usage (clear semantics):
<pfv6-card-body>           <!-- filled (default) -->
<pfv6-card-body no-fill>   <!-- not filled -->

// CSS is clear:
:host([no-fill]) #container {
  flex: 0 1 auto;  /* Don't fill when no-fill is present */
}
```

**Solution 3: Internal Class Logic**

Keep boolean property, use class in render:

```typescript
@property({ type: Boolean })
filled = true;  // Don't reflect

render() {
  return html`<div class="${this.filled ? 'filled' : 'no-fill'}">`;
}

// CSS uses class, not attribute:
#container.filled {
  flex: 1 1 auto;
}
```

**Decision Matrix:**

| React Prop | React Default | LitElement Strategy | Rationale |
|------------|---------------|---------------------|-----------|
| `isDisabled` | `false` | `@property() disabled = false` | ✅ HTML boolean semantic matches |
| `isCompact` | `false` | `@property() compact = false` | ✅ HTML boolean semantic matches |
| `isFilled` | `true` | `filled: 'true' \| 'false'` ✅ | ✅ **RECOMMENDED**: Explicit, matches PatternFly conventions |
| `isFilled` | `true` | `@property() noFill = false` | Alternative: Inverted boolean name |
| `isFilled` | `true` | Internal class logic | Alternative: No attribute reflection |

**AI Directive:** When mapping React boolean props:
1. ✅ If React default is `false` → **Use boolean property directly** (HTML boolean semantics align perfectly)
   - Example: `disabled = false` → `<pfv6-card disabled>` = disabled, `<pfv6-card>` = not disabled ✅
2. ⚠️ If React default is `true` → **USE STRING ENUM** (recommended) OR invert property name OR use internal class logic
   - Problem: HTML boolean attribute absence = false, but React default is true (semantic mismatch!)
   - String enum explicitly represents both states without confusion
3. Always use `classMap()` for conditional styling (Shadow DOM best practice)
4. Document the decision in component JSDoc

**Why String Enum is Preferred for `true` Defaults:**
- Eliminates semantic mismatch between HTML boolean attributes (absent = false) and React props (default = true)
- Provides 1:1 API clarity with React PatternFly
- Works consistently across HTML and JavaScript usage
- Pairs perfectly with `classMap()` for performant Shadow DOM CSS

**🚨 CRITICAL: Component API vs CSS API**

**Two Separate APIs - Do NOT Mix:**

1. **Component API** (Public Surface for Developers):
   - **Properties/Attributes** - Match React prop names exactly
   - **Events** - Match React callback names (converted to events)
   - **Slots** - Map React children to slots
   - **Example**: React prop `isClicked` → Our attribute `is-clicked` → Our property `isClicked`

2. **CSS API** (Internal Styling):
   - **CSS Classes** - PatternFly's internal naming (`.pf-m-current`, `.pf-m-selected`)
   - **CSS Variables** - Public styling API (match PatternFly exactly)
   - **Example**: `.pf-m-current` is the CSS class, but our attribute is `is-clicked`

**The Rule**:
```typescript
// ✅ CORRECT - Component API matches React prop name
@property({ type: Boolean, reflect: true, attribute: 'is-clicked' })
isClicked = false;

render() {
  return html`
    <div class=${classMap({
      current: this.isClicked  // ← CSS class name is "current"
    })}>
  `;
}
```

```typescript
// ❌ WRONG - Using CSS class name for component API
@property({ type: Boolean, reflect: true, attribute: 'is-current' })
isCurrent = false;  // ← Should be isClicked to match React!
```

**Why This Matters**:
- ✅ **Component API parity**: `isClicked` matches React's `isClicked` prop
- ✅ **CSS API parity**: `.pf-m-current` class matches PatternFly CSS
- ✅ **Clear separation**: Developers use React prop names, internal CSS uses PatternFly class names
- ❌ **Don't confuse the two**: CSS class names (`.pf-m-current`) are implementation details, not public API

**Key Lesson**: **Match React prop names for component API, not CSS class names.**

### 4. React Component Translation Checklist

When converting a PatternFly React component to LitElement, follow this process:

#### Phase 1: Research & Analysis

- [ ] **Read PatternFly React docs** - Understand component purpose, variants, usage
- [ ] **Check React TypeScript interface** - Identify exact props and types
- [ ] **Analyze React demos** - See all variants and states in action
- [ ] **Review React source code** - Understand implementation details
- [ ] **Identify sub-components** - List all React sub-components (CardTitle, CardBody, etc.)
- [ ] **Map CSS variables** - List all PatternFly CSS variables for the component
- [ ] **Document cardinality** - How many of each sub-component can exist?

#### Phase 2: API Design

- [ ] **Map props to properties** - Create `@property()` for primitive props
- [ ] **Map children to slots** - Identify default slot and named slots
- [ ] **Create sub-components** - One LitElement component per React sub-component
- [ ] **Map events** - Create custom event classes for React callbacks
- [ ] **Expose CSS variables** - Define identical CSS custom properties on `:host`
- [ ] **Document API** - JSDoc for all properties, slots, events, CSS props

#### Phase 3: Implementation

- [ ] **Component structure** - Implement parent component with slots
- [ ] **Sub-components** - Implement each sub-component with Shadow DOM
- [ ] **CSS styling** - Match PatternFly styles using tokens
- [ ] **Use `display: contents`** - Make sub-components layout-transparent
- [ ] **Test composition** - Verify sub-components work together correctly
- [ ] **Visual parity** - Compare side-by-side with React version

#### Phase 4: Validation

- [ ] **Create React comparison demo** - Build ALL React variants
- [ ] **Create LitElement demos** - Mirror React demos exactly
- [ ] **Visual comparison** - Ensure pixel-perfect match
- [ ] **CSS customization test** - Verify CSS variables work identically
- [ ] **Accessibility audit** - Match React's ARIA patterns
- [ ] **Documentation** - README, JSDoc, implementation notes

### 5. Common Translation Patterns

#### Pattern 1: Simple Prop → Property

```tsx
// React
<Button variant="primary" size="large" disabled />
```

```typescript
// LitElement
<pfv6-button variant="primary" size="large" disabled></pfv6-button>

@customElement('pfv6-button')
export class PfButton extends LitElement {
  @property({ type: String }) variant: 'primary' | 'secondary' = 'primary';
  @property({ type: String }) size: 'small' | 'medium' | 'large' = 'medium';
  @property({ type: Boolean, reflect: true }) disabled = false;
}
```

#### Pattern 2: Children → Default Slot

```tsx
// React
<Card>
  <CardBody>Body content</CardBody>
</Card>
```

```html
<!-- LitElement -->
<pfv6-card>
  <pfv6-card-body>Body content</pfv6-card-body>
</pfv6-card>
```

```typescript
render() {
  return html`
    <div id="container">
      <slot></slot>  <!-- Default slot for all sub-components -->
    </div>
  `;
}
```

#### Pattern 3: Named Children → Named Slots

```tsx
// React - CardHeader with actions prop
<Card>
  <CardHeader actions={<Button>Action</Button>} />
</Card>
```

```html
<!-- LitElement - Named slot -->
<pfv6-card>
  <button slot="actions">Action</button>
</pfv6-card>
```

```typescript
render() {
  return html`
    <div id="header">
      <slot name="actions"></slot>
    </div>
  `;
}
```

#### Pattern 4: Component Prop → Sub-Component with Property

```tsx
// React - CardTitle with component prop
<Card>
  <CardTitle component="h4">Title</CardTitle>
</Card>
```

```html
<!-- LitElement - Sub-component with property -->
<pfv6-card>
  <pfv6-card-title component="h4">Title</pfv6-card-title>
</pfv6-card>
```

```typescript
@customElement('pfv6-card-title')
export class PfCardTitle extends LitElement {
  @property({ type: String }) component: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' = 'div';
  
  render() {
    const TagName = this.component;
    return html`
      <${TagName} id="title">
        <slot></slot>
      </${TagName}>
    `;
  }
}
```

#### Pattern 5: Callback Prop → Custom Event

```tsx
// React
<Card onExpand={(event, isExpanded) => console.log(isExpanded)} />
```

```typescript
// LitElement - Custom event class
export class ExpandEvent extends Event {
  constructor(public expanded: boolean) {
    super('expand', { bubbles: true, composed: true });
  }
}

// Usage
this.dispatchEvent(new ExpandEvent(this.expanded));
```

```html
<!-- Listen to event -->
<pfv6-card @expand=${(e: ExpandEvent) => console.log(e.expanded)}></pfv6-card>
```

### 6. Understanding Component API vs CSS API

**CRITICAL DISTINCTION**: Web components have TWO separate APIs that must NOT be confused.

#### Component API (Public Interface for Developers)

This is what developers interact with when using your component:

**Properties/Attributes**:
- **Source of Truth**: React component's TypeScript interface (`.d.ts` files)
- **Rule**: Match React prop names EXACTLY
- **Example**: React `isClicked` → LitElement `@property() isClicked` → HTML attribute `is-clicked`

**Events**:
- **Source of Truth**: React callback props (`onExpand`, `onChange`)
- **Rule**: Convert callback names to web component events
- **Example**: React `onExpand` → LitElement `expand` event

**Slots**:
- **Source of Truth**: React `children` prop and component composition
- **Rule**: Map React children/sub-components to slots or sub-components

#### CSS API (Internal Styling)

This is PatternFly's internal styling system:

**CSS Classes**:
- **Source of Truth**: PatternFly CSS files (`node_modules/@patternfly/react-styles/css/components/`)
- **Rule**: Use PatternFly class names internally via `classMap()`
- **Example**: `.pf-m-current`, `.pf-m-selected`, `.pf-m-disabled`

**CSS Variables**:
- **Source of Truth**: PatternFly component CSS variables
- **Rule**: Expose same variables on `:host` for user customization
- **Example**: `--pf-v6-c-card--BackgroundColor`

#### The Critical Mistake to Avoid

**❌ WRONG - Using CSS class name for component API:**
```typescript
// React prop: isClicked
// CSS class: .pf-m-current

// ❌ BAD - Attribute matches CSS class, not React prop!
@property({ type: Boolean, reflect: true, attribute: 'is-current' })
isCurrent = false;
```

**✅ CORRECT - Using React prop name for component API:**
```typescript
// React prop: isClicked
// CSS class: .pf-m-current

// ✅ GOOD - Attribute matches React prop!
@property({ type: Boolean, reflect: true, attribute: 'is-clicked' })
isClicked = false;

render() {
  return html`
    <div class=${classMap({
      current: this.isClicked  // ← CSS class is internal implementation
    })}>
  `;
}
```

#### Real-World Example: Card Component

**React API** (`Card.d.ts`):
```typescript
interface CardProps {
  isClicked?: boolean;    // ← This is what we match!
  isSelected?: boolean;   // ← This too!
  isDisabled?: boolean;   // ← And this!
}
```

**PatternFly CSS** (`card.css`):
```css
.pf-v6-c-card.pf-m-current { }    /* ← "current" is CSS class name */
.pf-v6-c-card.pf-m-selected { }   /* ← "selected" is CSS class name */
.pf-v6-c-card.pf-m-disabled { }   /* ← "disabled" is CSS class name */
```

**Our LitElement Implementation**:
```typescript
// ✅ Component API - Matches React props
@property({ type: Boolean, attribute: 'is-clicked' }) isClicked = false;
@property({ type: Boolean, attribute: 'is-selected' }) isSelected = false;
@property({ type: Boolean, attribute: 'is-disabled' }) isDisabled = false;

render() {
  // ✅ CSS API - Uses PatternFly class names internally
  return html`
    <div class=${classMap({
      current: this.isClicked,    // Prop → CSS class mapping
      selected: this.isSelected,  // Prop → CSS class mapping
      disabled: this.isDisabled   // Prop → CSS class mapping
    })}>
  `;
}
```

#### API Separation Checklist

When implementing a component, verify:

- [ ] **Component API matches React TypeScript interface**
  - Property names match React prop names (`isClicked`, not `isCurrent`)
  - Attribute names are kebab-case versions (`is-clicked`, not `is-current`)
  - Event names match React callbacks (`expand` from `onExpand`)

- [ ] **CSS API matches PatternFly CSS**
  - CSS classes use PatternFly names (`.pf-m-current`, `.pf-m-selected`)
  - CSS variables use PatternFly names (`--pf-v6-c-card--BackgroundColor`)
  - Internal `classMap()` maps properties to CSS classes

- [ ] **Clear separation maintained**
  - Component API is public, stable, matches React
  - CSS API is internal, uses PatternFly conventions
  - No mixing of the two naming systems

**Key Lesson**: **Match React prop names for component API, not CSS class names. The two APIs are separate and serve different purposes.**

### Key Takeaways for AI

When converting React components to LitElement:

1. **Component API ≠ CSS API** - Match React prop names for attributes/properties, use PatternFly class names internally
2. **CSS Variables = Public API** - Always expose PatternFly CSS variables on `:host`
3. **React Sub-Components → LitElement Sub-Components** - Create custom elements, not just slots
4. **Use `display: contents`** - Make sub-components layout-transparent
5. **Match Cardinality** - Enforce the same 0..1, 0..*, etc. rules as React
6. **Props → Properties** - But remember: components can't be properties (use slots!)
7. **Callbacks → Events** - Extend Event class, dispatch custom events
8. **Children → Slots** - Default slot for main content, named slots for specific areas
9. **Native HTML Works** - Form inputs, links, etc. slot naturally without special handling
10. **Document Everything** - JSDoc for properties, slots, events, CSS variables
11. **Visual Parity is King** - Compare side-by-side with React, must be pixel-perfect

## Architecture & Design Patterns

### Design Patterns
All design patterns must be based on **PatternFly v6 components**. The output from web components should be **visually and functionally indistinguishable** from the React PatternFly v6 counterparts, while maintaining web component best practices.

**AI Guideline**: Always reference PatternFly v6 React documentation when implementing components. The visual design, interaction patterns, and user experience must match exactly.

### State Management Approach
Web components should **not require external state management libraries**. Use only:
- **Built-in Lit state management**: `@state`, `@property` decorators
- **`@lit/context` package**: For shared state between components when necessary
- **No Redux, MobX, Zustand, etc.**

**AI Guideline**: When components need to share state, use Lit Context API. Never suggest external state management solutions.

### Component Architecture
Components should follow the **PatternFly v6 API adapted to LitElement** conventions:
- Component props/attributes mirror PatternFly v6 props as closely as possible
- Events follow web component standards (kebab-case, extend Event class - do NOT use CustomEvent)
- Slots replace React `children` prop where applicable
- **ALWAYS use Shadow DOM for encapsulation**

### Shadow DOM Requirement
**CRITICAL**: ALL web components MUST use Shadow DOM. NEVER disable Shadow DOM by overriding `createRenderRoot()` to return `this`.

Shadow DOM is a fundamental principle of web components that provides:
- **Style encapsulation**: Component styles don't leak out, external styles don't leak in
- **DOM encapsulation**: Internal implementation details are hidden
- **Composability**: Components can be safely nested without conflicts

**AI Directive**: If you ever consider disabling Shadow DOM, STOP. Find an alternative solution that preserves Shadow DOM encapsulation. This is a non-negotiable requirement.

### API Design Principles
**Priority order**:
1. **PatternFly v6 parity**: Maintain 1:1 functional parity with PatternFly v6 capabilities
2. **LitElement best practices**: Follow Lit's conventions for properties, events, and lifecycle
3. **Web Component standards**: Use standard Custom Element APIs

**When conflicts arise**: Choose the solution that maintains PatternFly API parity while staying within web component standards. Document any deviations in component comments.

## Development Workflow

### Setup

```bash
# Install dependencies
npm install

# Initial compilation
npm run compile
```

**🚨 CRITICAL: Dependency Management**

- **`package-lock.json` must be committed to version control**
  - ❌ **NEVER** add `package-lock.json` to `.gitignore`
  - ✅ **ALWAYS** commit `package-lock.json` changes
  - **Why**: Ensures deterministic builds - everyone gets the exact same dependency versions
  - **Without it**: Different developers/CI may get different versions, causing hard-to-debug issues
- Use `npm ci` (not `npm install`) in CI/CD for faster, more reliable builds

### Common Commands

```bash
# Start development server with watch mode (web components only)
npm run dev
# - Runs @web/dev-server with hot reload
# - Compiles TypeScript in watch mode
# - Available at http://localhost:8000 (or configured port)
# - Fast: No React demo compilation overhead

# Start development server WITH React demo watch
npm run dev:react
# - Same as 'npm run dev' PLUS Vite watch for React demos
# - Use this when working on React comparison demos
# - Slightly slower due to additional Vite process

# Compile everything (TypeScript + CEM + React demos)
npm run compile
# - TypeScript compilation
# - Custom Elements Manifest generation
# - React demo builds (Vite)
# - Use for production or CI/CD

# Compile React demos only
npm run compile:react-demos
# - Builds React comparison demos with Vite
# - Bundles PatternFly locally (React from CDN)
# - Outputs to react-demos/dist/ (all demos + shared PatternFly bundles)

# Run all linters
npm run lint
# - ESLint for TypeScript
# - Stylelint for CSS

# Run unit tests
npm run test
# - Uses @web/test-runner
# - Runs component unit tests

# Run E2E tests
npm run e2e
# - Uses Playwright
# - Runs browser automation tests
# - Includes visual parity and CSS API tests

# Run only visual parity tests
npm run e2e:parity
# - THE CRITICAL TEST for component validation
# - Compares Lit vs React pixel-by-pixel

# Bootstrap a new component (planned)
npm run new
# - Creates component folder structure
# - Generates boilerplate files (TypeScript, CSS, test)
# - Follows naming conventions automatically
```

**Development Workflow Decision Tree**:
- **Working on web components?** → `npm run dev` (fast, no React overhead)
- **Working on React comparison demos?** → `npm run dev:react` (includes Vite watch)
- **Building for production?** → `npm run compile` (builds everything)
- **Running tests?** → `npm run e2e` or `npm run e2e:parity` (NEVER `npx playwright test` directly)

### Development Server

The dev server uses **Wireit** for task orchestration, which manages:
- Parallel TypeScript compilation (`tsc --watch`)
- Development server with hot reload
- Automatic plugin compilation
- Dependency management between tasks

**🚨 CRITICAL: Always Use Wireit Scripts**

**NEVER manually compile TypeScript files.** Wireit handles all compilation automatically through `npm run dev`.

❌ **DON'T** do this:
```bash
npx tsc dev-server/plugins/router.ts --outDir dev-server/plugins --module esnext --target ES2020 --moduleResolution bundler --esModuleInterop
npm run dev
```

✅ **DO** this instead:
```bash
killall node 2>/dev/null || true  # ⚠️ AI: PROMPT before running
npm run dev
```

**Why**: `npm run dev` automatically:
1. Cleans compiled plugin files (`clean:plugins`)
2. Starts `tsc --watch` which compiles ALL TypeScript (including plugins, scripts, elements)
3. Automatically recompiles when files change
4. Manages dependencies between compilation steps

**AI Directive**: 
- **⚠️ ALWAYS PROMPT** before running `killall node` - it kills ALL Node processes on the user's machine (see "Disruptive Commands" in AI Guidelines)
- **⚠️ ALWAYS PROMPT** before running `npm run e2e` or `npm run e2e:parity` - tests take ~45s and are resource-intensive
- When making changes to ANY TypeScript file (components, plugins, scripts), just restart `npm run dev`. The Wireit task orchestration handles all compilation automatically. Manual `tsc` commands are unnecessary and bypass the project's build system.
- When running tests, ALWAYS use `npm run e2e`, `npm run e2e:parity`, or other npm test scripts. NEVER run `npx playwright test` directly, as it may not ensure the dev server is running or configured correctly.

**CDN Requirements**:
- ✅ **ONLY use jsDelivr** for all CDN imports:
  - `https://cdn.jsdelivr.net/npm/...` - Standard jsDelivr CDN
  - `https://esm.run/...` - jsDelivr's dedicated ESM domain (automatically transforms CommonJS to ESM)
- ❌ **NEVER use esm.sh, unpkg, or any other CDN**
- All external dependencies in import maps must use jsDelivr (either cdn.jsdelivr.net or esm.run)

**AI Guideline**: When loading React, Lit, or any other dependencies from a CDN, ALWAYS use jsDelivr (cdn.jsdelivr.net or esm.run). Do not suggest or use alternative CDNs like esm.sh or unpkg.

### Build Pipeline

**TypeScript Compilation**:
- Source files compiled in place (`.ts` → `.js`, `.d.ts`, `.map`)
- `tsconfig.json` controls compilation settings
- Watch mode for active development

**Custom Elements Manifest (CEM)**:
- Generates `custom-elements.json` from component TypeScript files
- Uses `@pwrs/cem` tool to analyze TypeScript and extract component metadata
- Post-processing script (`dev-server/plugins/add-demo-paths.js`) adds demo file paths to manifest
- Used by dev server to auto-discover and list component demos
- Run automatically as part of `npm run compile`
- Command: `cem generate 'elements/pfv6-*/pfv6-*.ts' --output custom-elements.json && node dev-server/plugins/add-demo-paths.js`

**CSS Processing**:
- Development: `web-dev-server-plugin-lit-css` transforms CSS imports
- Production: `esbuild-plugin-lit-css` bundles CSS
- Stylelint validates CSS on save

### Linting

**ESLint** (TypeScript):
```bash
npm run lint:eslint
# Lints: elements/**/*.ts, lib/**/*.ts
```

**Stylelint** (CSS):
```bash
npm run lint:stylelint
# Lints: elements/**/*.css
# Validates PatternFly token usage
```

**AI Guideline**: Always run linters before committing. Fix all linting errors.

### Code Conventions

**Reference**: Follow [Red Hat Design System Custom Elements API Style Guide](https://github.com/RedHat-UX/red-hat-design-system/wiki/Custom-Elements-API-Style-Guide)

#### Host Attributes & Properties
- ✅ **DO** reflect camelCase DOM properties as dash-case attributes
- ✅ **DO** use JSDoc to document all public properties
- ✅ **DO** reflect attributes that users would set from light DOM
- ❌ **DON'T** prefix boolean attributes/properties with `is` (it's implied)
- ❌ **DON'T** reflect attributes strictly for styling purposes
- ⚠️ **Avoid** using multiple words for public attrs/props (keep API concise)

```typescript
// BAD
@property({ type: Boolean, attribute: 'is-open-mode' }) isOpenMode = false;

// GOOD
@property({ type: Boolean, reflect: true }) open = false;
```

#### ARIA Attributes & Accessibility

**🚨 CRITICAL: Use ElementInternals for ARIA Attributes**

Web components should **NEVER** implement `aria-*` attributes as direct properties. Instead, use the **ElementInternals specification** to properly expose ARIA semantics.

- ✅ **DO** use `ElementInternals` API for ARIA attributes
- ✅ **DO** attach internals in `constructor`
- ✅ **DO** create user-facing properties that map to ARIA attributes
- ✅ **DO** set ARIA properties on `this.internals` in lifecycle methods
- ❌ **DON'T** create `@property()` for `aria-label`, `aria-describedby`, etc.
- ❌ **DON'T** manually manage ARIA attributes on the host element

**Property Naming Convention:**
When React demos use `aria-*` attributes, create semantic property names:
- React `aria-label` → LitElement property `accessible-label` → `this.internals.ariaLabel`
- React `aria-describedby` → LitElement property `accessible-description` → `this.internals.ariaDescribedBy`
- React `aria-labelledby` → LitElement property `accessible-label-id` → `this.internals.ariaLabelledBy`

```typescript
// GOOD - Using ElementInternals with user-facing property
export class Pfv6Checkbox extends LitElement {
  static formAssociated = true;
  
  /**
   * Accessible label for the checkbox (use when no visible label)
   */
  @property({ type: String, attribute: 'accessible-label' })
  accessibleLabel?: string;
  
  private internals: ElementInternals;
  
  constructor() {
    super();
    this.internals = this.attachInternals();
  }
  
  updated(changed: PropertyChangedMap<this>) {
    super.updated(changed);
    
    // Map user-facing property to ARIA via ElementInternals
    if (changed.has('accessibleLabel')) {
      this.internals.ariaLabel = this.accessibleLabel || null;
    }
  }
}
```

**Usage:**
```html
<!-- User provides semantic property name -->
<pfv6-checkbox accessible-label="Accept terms"></pfv6-checkbox>

<!-- ElementInternals exposes to assistive technologies as aria-label -->
```

```typescript
// BAD - Direct ARIA attribute as property
export class Pfv6Checkbox extends LitElement {
  @property({ type: String, attribute: 'aria-label' })
  ariaLabel?: string;  // ❌ Wrong approach - bypasses ElementInternals
}
```

**Why ElementInternals?**
- ✅ Follows web component standards
- ✅ Properly exposes ARIA to assistive technologies
- ✅ Integrates with Shadow DOM correctly
- ✅ Provides form association capabilities
- ✅ Future-proof for platform evolution
- ✅ Semantic property names improve developer experience

**Reference**: [MDN ElementInternals](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals)

#### 🚨 CRITICAL: Use ElementInternals for Semantic Roles (Alternative Components)

**Problem**: When React uses semantic HTML like `<ul>` + `<li>`, but web components can't replicate that Light DOM structure due to Shadow DOM encapsulation.

**Example Scenario**: 
- React: `<Gallery component="ul"><GalleryItem component="li">Item</GalleryItem></Gallery>`
- Renders as: `<ul><li>Item</li></ul>` ✅ Semantic HTML

**Web Component Challenge**:
```html
<!-- ❌ WRONG: Renders <li> inside shadow DOM -->
<pfv6-gallery-item component="li">
  #shadow-root
    <li><slot></slot></li>  <!-- Extra DOM node! -->
</pfv6-gallery-item>
```

**The Correct Solution: ElementInternals with `role`**

Use ElementInternals to expose semantic roles WITHOUT rendering extra DOM elements:

```typescript
// GOOD - ElementInternals for semantic roles
@customElement('pfv6-gallery-item')
export class Pfv6GalleryItem extends LitElement {
  static readonly styles = styles;
  static readonly formAssociated = true;  // Required for ElementInternals
  
  @property({ type: String })
  component: 'div' | 'li' = 'div';
  
  private internals: ElementInternals;
  
  constructor() {
    super();
    this.internals = this.attachInternals();
  }
  
  updated(changed: PropertyValues): void {
    super.updated(changed);
    
    // Map component type to ARIA role
    if (changed.has('component')) {
      if (this.component === 'li') {
        this.internals.role = 'listitem';  // ✅ Sets role, no extra DOM!
      } else {
        this.internals.role = null;
      }
    }
  }
  
  render() {
    // ✅ CRITICAL: Wrapper div needed so text nodes can participate in grid layout
    // Text nodes cannot be direct grid items - they need an element wrapper
    return html`
      <div id="container">
        <slot></slot>
      </div>
    `;
  }
}
```

**CSS for Layout Transparency**:
```css
:host {
  /*
   * display: contents makes the custom element layout-transparent.
   * The #container div participates directly in the parent gallery's grid.
   * When component="li", ElementInternals sets role="listitem" for semantic list behavior.
   */
  display: contents;
}

#container {
  /*
   * Container wraps the slot content so text nodes can participate in grid layout.
   * No layout properties - just acts as a grid item wrapper.
   */
}
```

**Why the Wrapper is Critical**:

When using `display: contents`, text nodes **cannot** participate in grid/flex layouts:

```html
<!-- ❌ BAD: Text nodes can't be grid items -->
<pfv6-gallery-item style="display: contents">
  #shadow-root
    <slot></slot>  <!-- Text node slotted here can't be a grid item! -->
</pfv6-gallery-item>
```

**Result**: Text content stacks vertically, ignores grid layout.

```html
<!-- ✅ GOOD: Wrapper div becomes the grid item -->
<pfv6-gallery-item style="display: contents">
  #shadow-root
    <div id="container">  <!-- This div IS a grid item! -->
      <slot></slot>
    </div>
</pfv6-gallery-item>
```

**Result**: The `#container` div participates in the grid, text content renders correctly.

**Parent Component Role Mapping**:

Both parent and child components need appropriate roles for complete semantic structure:

```typescript
// pfv6-gallery.ts - Parent component
export class Pfv6Gallery extends LitElement {
  static readonly formAssociated = true;
  
  @property({ type: String })
  component: 'div' | 'section' | 'article' | 'ul' | 'ol' = 'div';
  
  private internals: ElementInternals;
  
  constructor() {
    super();
    this.internals = this.attachInternals();
  }
  
  updated(changed: PropertyValues): void {
    super.updated(changed);
    
    if (changed.has('component')) {
      // Map component type to ARIA role for semantic structures
      switch (this.component) {
        case 'ul':
        case 'ol':
          this.internals.role = 'list';
          break;
        case 'article':
          this.internals.role = 'article';
          break;
        case 'section':
          this.internals.role = 'region';
          break;
        default:
          this.internals.role = null;
      }
    }
  }
  
  render() {
    // ✅ Always render <div>, semantic meaning comes from ElementInternals.role
    return html`
      <div id="container" class=${classMap({ 'pf-m-gutter': this.hasGutter })}>
        <slot></slot>
      </div>
    `;
  }
}
```

**Complete Semantic Structure**:
```html
<pfv6-gallery component="ul" role="list">  <!-- ✅ Parent gets role="list" -->
  <pfv6-gallery-item component="li" role="listitem">  <!-- ✅ Child gets role="listitem" -->
    #shadow-root (display: contents)
      <div id="container">  <!-- Grid item wrapper -->
        Gallery item
      </div>
  </pfv6-gallery-item>
</pfv6-gallery>
```

**Benefits**:
- ✅ **No extra DOM nodes** - `display: contents` makes `:host` layout-transparent
- ✅ **Proper semantics** - `role="list"` + `role="listitem"` expose correct ARIA roles
- ✅ **Visual parity** - Identical layout to React (text nodes wrapped in grid-compatible div)
- ✅ **Accessibility** - Screen readers announce "List with 5 items"
- ✅ **API parity** - `component="ul"` + `component="li"` work as expected

**Why Dynamic Tag Rendering is NOT Needed**:

With ElementInternals, you **do not need** to render different HTML tags. The semantic meaning comes from the ARIA role, not the actual element type!

```typescript
// ❌ BAD: Overcomplicated with unsafeStatic
import { unsafeStatic, html as staticHtml } from 'lit/static-html.js';

render() {
  const tag = unsafeStatic(this.component);  // 'ul', 'ol', 'article', etc.
  return staticHtml`<${tag} id="container"><slot></slot></${tag}>`;
}

// ✅ GOOD: Simplified - always render <div>
render() {
  return html`
    <div id="container">
      <slot></slot>
    </div>
  `;
}
```

**ElementInternals.role provides the semantic meaning**, eliminating the need for:
- `unsafeStatic` and `staticHtml` imports
- Complex tag switching logic
- CSS selector complications (always targeting `#container`)

**When to Use This Pattern**:
1. **Semantic HTML structures** that React renders in Light DOM (lists, articles, sections)
2. **Alternative component types** where `component` prop changes the semantic meaning
3. **Accessibility-critical structures** (navigation menus, lists, landmarks)

**Common Roles for PatternFly Components**:

| React Component | `component` Prop | ElementInternals Role |
|-----------------|------------------|----------------------|
| `<GalleryItem>` | `component="li"` | `role="listitem"` |
| `<Gallery>` | `component="ul"` or `"ol"` | `role="list"` |
| `<Card>` | `component="article"` | `role="article"` |
| `<Panel>` | `component="section"` | `role="region"` |
| `<MenuItem>` | `component="li"` | `role="menuitem"` |
| `<NavItem>` | `component="li"` | `role="listitem"` or `role="none"` |

**Accessibility Note - Automated Tool Limitations**:

⚠️ **Important**: Most automated accessibility testing tools (axe-core, Lighthouse, WAVE) **cannot yet read from ElementInternals**. This will cause **false positives** in automated audits even though the component is correctly exposing ARIA roles via the accessibility tree.

**What This Means**:
- ✅ **Screen readers WILL work correctly** - ElementInternals properly exposes roles to browser's accessibility tree
- ❌ **Automated tools WILL report false positives** - They check DOM attributes, not accessibility tree
- ⚠️ **Manual verification required** - Use browser DevTools accessibility inspector or actual screen readers

**Verification Methods**:
1. **Browser DevTools Accessibility Inspector** - Shows correct `role="listitem"` in computed properties
2. **Real Screen Readers** (NVDA, JAWS, VoiceOver) - Correctly announce "List with 5 items"
3. **Programmatic** - Access `element.internals.role` (if component exposes internals)

**Documentation Strategy**: When creating comparative documentation for "PatternFly LitElements vs React PatternFly", document that automated a11y tools may report false positives for components using ElementInternals. This is a tool limitation, not a component issue.

**Key Principle**: When you **cannot replicate Light DOM semantics** due to Shadow DOM encapsulation, use **ElementInternals to simulate the DOM structure and a11y representation**.

**Reference**: 
- [MDN ElementInternals.role](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals/role)
- [WHATWG ElementInternals Spec](https://html.spec.whatwg.org/multipage/custom-elements.html#element-internals)
- Example: `pfv6-gallery` and `pfv6-gallery-item` implementation
- See `ELEMENTINTERNALS_ACCESSIBILITY_NOTES.md` for complete accessibility testing guidance

#### Events
- ✅ **DO** extend `Event` class (not `CustomEvent`)
- ✅ **DO** export event subclasses for `instanceof` checks
- ✅ **DO** set state on event object properties (not `detail`)
- ❌ **DON'T** use `new CustomEvent()` (outdated pattern)

```typescript
// GOOD - Custom Event Class
export class Pfv6SelectEvent extends Event {
  declare target: Pfv6Select;
  constructor(
    public value: string,
    public selectedIndex: number
  ) {
    super('select', { bubbles: true });
  }
}

// Usage in component
this.dispatchEvent(new Pfv6SelectEvent(value, index));
```

#### Class Members

**Privacy & Access**:
- ✅ **DO** use ECMAScript `#private` fields and methods
- ✅ **DO** use TypeScript `protected` keyword for base classes
- ✅ **DO** use TypeScript `override` keyword for clarity
- ✅ **DO** use `_` prefix for private decorated members (`@state`, `@property`) since `#private` cannot be decorated
- ⚠️ **Avoid** TypeScript `private` keyword (use `#private` instead)
- ❌ **DON'T** use `_` prefix for non-decorated private members (use `#private` instead)

```typescript
// GOOD - Use #private for regular fields
#internalState = false;

// GOOD - Use _ prefix for decorated private fields
@state() private _isOpen = false;

// BAD - Don't use _ for non-decorated members
private _someField = 'value';
```

**Member Ordering** (top to bottom):
1. Static properties
2. Public reactive properties (`@property`)
3. Public fields
4. Private reactive state (`@state`)
5. Private fields (`#private`)
6. Lifecycle methods (in execution order):
   - `constructor`
   - `connectedCallback`
   - `update`
   - `render`
   - `firstUpdated`
   - `updated`
   - `disconnectedCallback`
7. Private and protected methods
8. Public methods (last for easy discovery)

#### Shadow DOM Focus
```typescript
static readonly shadowRootOptions: ShadowRootInit = {
  ...LitElement.shadowRootOptions,
  delegatesFocus: true
};
```

**Note**: `delegatesFocus` only applies to shadow DOM elements. For slotted elements, override `focus()`:
```typescript
focus() {
  this.slottedElement?.focus();
}
```

#### Import Order

**CRITICAL**: JavaScript/TypeScript imports MUST follow this specific order:

1. **Type-only imports** (unless paired on the same line with value imports)
2. **Lit core imports** (`lit`, `lit/html.js`, etc.)
3. **Lit decorators** (import individually from `lit/decorators/*.js`, NOT from `lit/decorators.js`)
4. **Lit directives** (import individually from `lit/directives/*.js`)
5. **Third-party imports** (`@lit/context`, `@open-wc/testing`, etc.)
6. **Project imports** (from `/lib/`, contexts from other elements, etc.)
7. **Relative imports** (sub-components, utilities in same directory)
8. **Component style imports** (ALWAYS LAST)

**Example:**
```typescript
// 1. Type-only imports (if needed separately)
import type { PropertyValues } from 'lit';

// 2. Lit core
import { LitElement, html, type TemplateResult } from 'lit';

// 3. Lit decorators (import individually, not from lit/decorators.js)
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { query } from 'lit/decorators/query.js';
import { state } from 'lit/decorators/state.js';

// 4. Lit directives
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';

// 5. Third-party imports
import { consume } from '@lit/context';

// 6. Project imports (contexts from other elements, shared utilities)
import { cardContext, type CardContext } from '@pfv6/elements/pfv6-card/context.js';

// 7. Relative imports (sub-components, local utilities)
import { Pfv6SomeSubComponent } from './pfv6-some-sub-component.js';

// 8. Component styles (ALWAYS LAST)
import styles from './pfv6-component.css';
```

**Why This Order:**
- ✅ Separates concerns (types → logic → styles)
- ✅ Makes dependencies clear
- ✅ Style imports at the end are visually distinct
- ✅ Consistent across all components
- ✅ Easier to scan and understand imports

**AI Directive**: Always organize imports in this order when creating or modifying component files.

#### File Naming
- One element class per file
- Component files: `pfv6-{component}.ts`
- Test files: `pfv6-{component}.spec.ts`
- CSS files: `pfv6-{component}.css`
- Lightdom CSS files: `pfv6-{component}-lightdom.css` (for styling slotted content)

#### JSDoc Documentation
- ✅ **DO** use JSDoc to document all public properties, methods, and events
- ✅ **DO** document slots with `@slot` tags
- ✅ **DO** document CSS custom properties with `@cssprop` tags
- ✅ **DO** document CSS parts with `@csspart` tags
- ✅ **DO** include usage examples in component documentation

**Reference**: [Red Hat Design System JSDoc Guide](https://github.com/RedHat-UX/red-hat-design-system/wiki/JSDoc)

## CSS Style Guidelines

**Reference**: [Red Hat Design System CSS Styles Guide](https://github.com/RedHat-UX/red-hat-design-system/wiki/CSS-Styles)

### Including Styles in Components

**✅ DO**: Separate CSS from TypeScript files for better syntax highlighting and organization.

```typescript
import styles from './pfv6-button.css';

export class Pfv6Button extends LitElement {
  static readonly styles = styles;
  // ...
}
```

**Build Process**: Use `web-dev-server-plugin-lit-css` (dev) and `esbuild-plugin-lit-css` (build) to import CSS at build time.

### Sharing Stylesheets

**❌ DON'T** import base styles twice (breaks esbuild bundling):
```typescript
// BAD - will break the bundle
import baseStyles from './BaseStyles.css';
import styles from './pfv6-foo.css';

export class Pfv6Foo extends BaseFoo {
  static readonly styles = [baseStyles, styles];
}
```

**✅ DO** reference the base class's styles:
```typescript
// GOOD - successfully bundles
import styles from './pfv6-foo.css';

export class Pfv6Foo extends BaseFoo {
  static readonly styles = [...BaseFoo.styles, styles];
}
```

### Render Method Best Practices

**Keep all HTML in render()** - Don't break into subroutines unless absolutely necessary.

**❌ DON'T** create separate methods for simple sections:
```typescript
// BAD - unnecessarily breaks up the template
render() {
  return html`
    <div id="container">
      ${this.#renderHeader()}
      ${this.#renderBody()}
      ${this.#renderFooter()}
    </div>
  `;
}

#renderHeader() {
  return html`<div id="header">...</div>`;
}

#renderBody() {
  return html`<div id="body">...</div>`;
}
```

**✅ DO** keep all HTML in render() with ternaries for conditionals:
```typescript
// GOOD - everything visible in one place
render() {
  return html`
    <div id="container" class=${classMap(this.#containerClasses)}>
      ${this.showHeader ? html`
        <div id="header">
          <div id="actions">
            <slot name="actions"></slot>
          </div>
          <div id="title">
            <slot name="title"></slot>
          </div>
        </div>
      ` : ''}
      
      <div id="body">
        <slot></slot>
      </div>
      
      ${this.showFooter ? html`
        <div id="footer">
          <slot name="footer"></slot>
        </div>
      ` : ''}
    </div>
  `;
}
```

**When to break into methods:**
- ✅ Complex repeated sections (lists, tables)
- ✅ Truly complex conditional logic
- ✅ Reusable template fragments
- ❌ NOT for simple structural elements

**Benefits:**
- 🎯 Easier to see entire component structure
- ⚡ Better performance (no method calls)
- 🧠 Simpler mental model
- 🔍 Easier to debug

### Shadow DOM CSS Best Practices

**CRITICAL**: Shadow DOM has different CSS conventions than Light DOM.

#### Use ID Selectors, Not BEM Classes

**❌ DON'T** use BEM-style classes in Shadow DOM:
```css
/* BAD - BEM classes are unnecessary in Shadow DOM */
.pf-v6-c-card__header {
  padding: 1rem;
}

.pf-v6-c-card__body {
  padding: 1rem;
}
```

**✅ DO** use ID selectors for unique elements:
```css
/* GOOD - IDs are faster and encapsulated in Shadow DOM */
#header {
  padding: 1rem;
}

#body {
  padding: 1rem;
}
```

**When to use classes:**
- ✅ When using `classMap()` for conditional styling
- ✅ For truly repeating elements (lists, multiple items)
- ❌ NOT for structural elements that appear once

#### Avoid Host Attribute Selectors

**❌ DON'T** use `:host([attribute])` selectors:
```css
/* BAD - creates tight coupling to attributes */
:host([compact]) #header {
  padding: 0.5rem;
}

:host([large]) #header {
  padding: 2rem;
}
```

**✅ DO** use `classMap()` with container classes:
```typescript
// Component code
import { classMap } from 'lit/directives/class-map.js';

render() {
  return html`
    <div id="container" class=${classMap({
      compact: this.compact,
      large: this.large
    })}>
      <div id="header">...</div>
    </div>
  `;
}
```

```css
/* CSS using container classes */
#container.compact #header {
  padding: 0.5rem;
}

#container.large #header {
  padding: 2rem;
}
```

**Why this is better:**
- ⚡ Better performance (class selectors vs attribute selectors)
- 🎯 More explicit styling intent
- 🔧 Easier to debug and maintain
- 📦 Keeps attributes as API, not styling hooks

#### CSS Custom Properties: API Parity Required

**CRITICAL**: Expose the same CSS variables as PatternFly React for 1:1 API parity.

**✅ DO** expose PatternFly component CSS variables:
```css
/* GOOD - Exposes PatternFly Card's public API */
:host {
  /* Public API - matches React PatternFly Card */
  --pf-v6-c-card--BackgroundColor: var(--pf-t--global--background--color--primary--default);
  --pf-v6-c-card--BorderColor: var(--pf-t--global--border--color--default);
  --pf-v6-c-card--BorderWidth: var(--pf-t--global--border--width--box--default);
  --pf-v6-c-card--BorderRadius: var(--pf-t--global--border--radius--medium);
  
  /* Private variables for internal state */
  --_padding: var(--pf-v6-c-card--first-child--PaddingBlockStart);
}

#container {
  /* Use the public API variables */
  background-color: var(--pf-v6-c-card--BackgroundColor);
  border-color: var(--pf-v6-c-card--BorderColor);
  border-width: var(--pf-v6-c-card--BorderWidth);
  border-radius: var(--pf-v6-c-card--BorderRadius);
}
```

**❌ DON'T** create different variable names:
```css
/* BAD - breaks API parity with PatternFly React */
:host {
  --pfv6-card--background: var(--pf-t--global--background--color--primary--default);
  --pfv6-card--border: var(--pf-t--global--border--color--default);
}
```

**Research Required**:
1. **Check PatternFly component CSS variables**: Every PatternFly component documents its CSS variables (e.g., [Card CSS variables](https://www.patternfly.org/components/card#css-variables))
2. **Expose the same variables**: Define them on `:host` with the same names
3. **Document in JSDoc**: Use `@cssprop` tags for all public CSS variables
4. **Use internally**: Reference these variables in your component CSS

**Why this is critical:**
- ✅ Developers get 1:1 API parity between React and web components
- ✅ Same customization patterns work across platforms
- ✅ Documentation maps directly to PatternFly docs
- ✅ Easier migration from React to web components

**Variable Types:**

1. **Public API variables** (`--pf-v6-c-{component}--*`):
   - Must match PatternFly component CSS variables
   - Defined on `:host`
   - Documented with `@cssprop`
   - Users can customize these

2. **Private variables** (`--_*`):
   - Internal state management only
   - Not documented publicly
   - Not guaranteed stable API

### Defining CSS Variables

**✅ DO** use PatternFly tokens directly when possible:
```css
#label {
  color: var(--pf-t--global--text--color--regular, #151515);
  font-size: var(--pf-t--global--font--size--body--default, 1rem);
}
```

**✅ DO** use private variables for internal state management:
```css
:host {
  --_label-font-size: var(--pf-t--global--font--size--body--default, 1rem);
}

#label {
  font-size: var(--_label-font-size);
}
```

**⚠️ AVOID** needlessly defining private variables - use token values directly when simple.

### Token Naming Conventions

**Choosing Variable Names**:
- ✅ **DO** use existing PatternFly tokens wherever possible
- ✅ **DO** use `lower-dash-case`
- ✅ **DO** prefix component-specific properties with element name (`--pfv6-button-...`)
- ✅ **DO** extend from general to specific, left to right
- ❌ **DON'T** use double-dashes (`--pfv6--button`)
- ⚠️ **AVOID** abbreviations or acronyms
- ⚠️ **AVOID** exposing component-specific properties where design tokens already exist

```css
/* GOOD - uses existing token */
border-radius: var(--pf-t--global--border--radius--pill, 30px);

/* BAD - creates unnecessary custom property */
border-radius: var(--pfv6-button-border-radius-pill, 30px);
```

### Private CSS Variables

Private variables:
- Begin with underscore: `--_variable-name`
- Omit element name (shorter, scoped to shadow DOM anyway)
- Used for internal state management in CSS

```css
[part="header"] {
  --_offset: var(--pf-t--global--space--sm, 8px);
}

[part="header"].mobile {
  --_offset: var(--pf-t--global--space--xs, 4px);
}

#close-button {
  margin-inline-start: var(--_offset);
}
```

### Lightdom CSS

For styling slotted elements that aren't direct children (e.g., nested `<li>`, `<a>` tags):

**File naming**: `pfv6-{component}-lightdom.css`

**✅ GOOD** - Scope selectors to component:
```css
pfv6-footer [slot^="links"] li {
  margin: 0;
  padding: 0;
  display: contents;
}

pfv6-footer [slot^="links"] a {
  display: block;
  color: var(--pf-t--global--text--color--on-dark, #ffffff) !important;
}
```

**❌ BAD** - Unscoped (affects entire page):
```css
[slot^="links"] li {
  margin: 0;
}
```

**AI Note**: Lightdom CSS files are published separately (not embedded at build time). Users must manually include them in their projects.

### CSS Tooling

**Stylelint**: Set up Stylelint with autofix on save
- Automatically validates token values
- Formats CSS consistently
- Enforces code standards

## Testing Strategy

### Overview

Two-tier testing approach:
1. **Component Unit Tests** - `@web/test-runner` for isolated component testing
2. **E2E Tests** - Playwright for browser automation and integration testing

### Component Unit Tests (@web/test-runner)

**Location**: Co-located with components in `elements/{component}/test/`

**File naming**: `pfv6-{component}.spec.ts`

**What to Test**:
- ✅ **DO** test public API (properties, attributes, methods)
- ✅ **DO** test event dispatching and custom event classes
- ✅ **DO** test slot rendering and content projection
- ✅ **DO** test accessibility (ARIA attributes, roles, keyboard navigation)
- ✅ **DO** test different component states and variants
- ✅ **DO** test Shadow DOM rendering and CSS parts
- ⚠️ **Focus on** behavior over implementation details

**Example Structure**:
```typescript
// elements/pfv6-button/test/pfv6-button.spec.ts
import { expect, fixture, html } from '@open-wc/testing';
import '../pfv6-button.js';
import type { Pfv6Button } from '../pfv6-button.js';

describe('pfv6-button', () => {
  it('should render with default properties', async () => {
    const el = await fixture<Pfv6Button>(html`
      <pfv6-button>Click me</pfv6-button>
    `);
    expect(el).to.exist;
    expect(el.variant).to.equal('primary');
  });

  it('should dispatch custom event on click', async () => {
    const el = await fixture<Pfv6Button>(html`
      <pfv6-button>Click me</pfv6-button>
    `);
    
    let eventFired = false;
    el.addEventListener('pfv6-click', () => {
      eventFired = true;
    });
    
    el.click();
    expect(eventFired).to.be.true;
  });

  it('should be accessible', async () => {
    const el = await fixture<Pfv6Button>(html`
      <pfv6-button>Click me</pfv6-button>
    `);
    await expect(el).to.be.accessible();
  });
});
```

### E2E Tests (Playwright)

**Location**: `/tests/` directory at project root

**Test Organization**:
```
/tests/
  /visual/                      # Visual regression tests
    card-visual.spec.ts         # Main comprehensive visual test suite
    card-visual-react-baseline.spec.ts  # React baseline stability validation
    card-visual-parity.spec.ts  # Lit vs React parity validation (CRITICAL)
    card-visual-lit-baseline.spec.ts    # Lit baseline stability (optional)
    
  /css-api/                     # CSS variable API parity tests
    card-api.spec.ts            # Computed style comparison tests
    
  /diagnostics/                 # Diagnostic/debugging tests
    check-lit-console.spec.ts   # Monitor Lit demo console for errors
    check-react-console.spec.ts # Monitor React demo console for errors
```

**Visual Regression Testing** (Primary E2E Focus):

**Test File**:
- **`{element}-visual-parity.spec.ts`** ⭐ **CRITICAL TEST**
  - Command: `npm run e2e:parity`
  - Compares Lit demos against React demos **live** (no baselines needed)
  - **This is THE test that validates 1:1 visual parity**
  - Must pass 100% for component to be considered complete
  - Uses `pixelmatch` for pixel-perfect comparison

**Key Features**:
- ✅ Uses dedicated `/test/` routes (no demo page styling interference)
- ✅ `requestIdleCallback` for render stability
- ✅ Shadow DOM access utilities
- ✅ CSS variable override testing
- ✅ Interactive state testing (hover, focus, expanded)
- ✅ Multi-browser support (Chromium, Firefox, WebKit)
- ✅ Zero-threshold pixel-perfect matching

**CSS API Parity Tests**:
```typescript
// tests/css-api/card-api.spec.ts
test('CSS variable customization produces identical computed styles', async ({ page }) => {
  // Apply CSS override to both React and Lit
  // Compare computed styles
  // Assert values match
});
```

### Configuration

**Playwright Config**:
- Base URL: `http://localhost:8000`
- Test directory: `./tests`
- Browsers: Chromium, Firefox, WebKit
- Auto-start dev server before tests
- Retry failed tests on CI
- Snapshot folders gitignored (`*-snapshots/`)

**Visual Test Commands**:
```bash
# Validate Lit vs React parity (CRITICAL)
npm run e2e:parity

# Run all E2E tests
npm run e2e

# View test results
npx playwright show-report
```

### Testing Guidelines

**For AI**:
- Always write tests when creating new components
- Test public API, not private implementation
- Use proper TypeScript types in tests
- Follow accessibility testing patterns
- Include both positive and negative test cases
- Test edge cases (empty slots, disabled state, etc.)

**Coverage Expectations**:
- Public properties and methods must be tested
- Event dispatching must be tested
- Accessibility must be verified
- Critical user paths must have E2E tests

## Key Concepts & Domain Knowledge

### PatternFly v6 Component Mastery

**Critical Requirement**: You must have a **professional-level, detailed understanding** of each PatternFly v6 component before implementing it. This is not optional.

### Implementation Philosophy: 1:1 Visual Design Parity

Our path is clear: **LitElement-based implementations must match PatternFly v6 React components exactly in visual design**.

**What This Means**:
- Every pixel, spacing, color, border, shadow must match
- Interaction states (hover, focus, active, disabled) must be identical
- Responsive behavior must be identical
- Animation and transition timing must match
- Accessibility attributes and ARIA patterns must match

### ⚠️ CRITICAL: PatternFly v6 ONLY - No Previous Versions

**This project implements PatternFly v6 components exclusively.**

**DO NOT:**
- ❌ Add features from PatternFly v3, v4, or v5
- ❌ Add features from PatternFly Elements (older web components library)
- ❌ Add properties/modifiers not in PatternFly v6 React
- ❌ Assume features exist just because they're in the CSS design system
- ❌ Port features from other component libraries

**DO:**
- ✅ Verify every feature exists in [PatternFly v6 React documentation](https://www.patternfly.org/components)
- ✅ Check the React component's TypeScript props/interface
- ✅ Match ONLY the features exposed in PatternFly v6 React
- ✅ When in doubt, reference the official PatternFly v6 component page

**Example:** The CSS design system may include `--pf-v6-c-card--m-rounded--BorderRadius`, but if PatternFly React doesn't expose an `isRounded` prop, **we don't implement a `rounded` property**. Users can still access the CSS variable directly for customization.

**Why This Matters:**
- Ensures API consistency with PatternFly React consumers
- Avoids confusion about what's "official" PatternFly
- Maintains clear migration path from React to web components
- Prevents feature creep from legacy versions

### Required Research Before Implementation

**Before implementing ANY component**:

1. **Study the PatternFly v6 React component**:
   - Official documentation: [patternfly.org/components](https://www.patternfly.org/components)
   - **CRITICAL**: Inspect the actual React component in `node_modules/@patternfly/react-core`
   - Review the TypeScript interface/props definition for the component
   - React implementation: [PatternFly React GitHub](https://github.com/patternfly/patternfly-react)
   - Design specs and usage guidelines

2. **Verify the exact API surface**:
   - ✅ **Check React component's TypeScript interface** - This is the source of truth for **component API**
   - ✅ Compare props with what's documented on patternfly.org
   - ✅ Note default values from TypeScript definitions
   - ✅ Identify required vs optional props
   - ⚠️ If a prop isn't in the React interface, DON'T implement it
   - **🚨 CRITICAL**: React prop names define our component API, NOT CSS class names
     - Example: React `isClicked` → Our `is-clicked` attribute (even though CSS uses `.pf-m-current`)
     - Example: React `isSelected` → Our `is-selected` attribute (even though CSS uses `.pf-m-selected`)
     - **Always reference the TypeScript interface**, not the CSS file, for property names

3. **Analyze the component anatomy**:
   - What are the visual parts?
   - What properties/props does it accept? (verified from TS interface)
   - What events does it fire?
   - What are the variants and states?
   - What are the slot patterns (React children → Web Component slots)

4. **Understand the design tokens**:
   - Which PatternFly CSS tokens does it use?
   - How do tokens adapt for theming?
   - Which tokens control spacing, color, typography?

4. **Review accessibility requirements**:
   - What ARIA roles, attributes, and states?
   - Keyboard navigation patterns
   - Screen reader announcements
   - Focus management

5. **Test visual parity**:
   - Compare side-by-side with React implementation
   - Test all variants and states
   - Verify responsive behavior
   - Validate in different browsers

### Design Tokens (CSS Custom Properties)

**Reference**: [PatternFly Tokens Documentation](https://www.patternfly.org/tokens/about-tokens/)

Design tokens are variables that store visual design attributes like color, typography, and spacing. PatternFly 6 uses a structured token system with CSS custom properties.

#### Token Layers (3-Tier System)

PatternFly's token system has 3 hierarchical layers:

1. **Palette Tokens**: Foundation colors from PatternFly color palettes
   - Raw color values
   - Base of the token system

2. **Base Tokens**: Apply colors to concepts, introduce spacing/borders
   - Grouped conceptually
   - Named numerically
   - No duplicate values in a concept group
   - Example: `--pf-t--global--color--100`, `--pf-t--global--space--md`

3. **Semantic Tokens**: Top-level tokens you'll use most
   - Built from base tokens
   - Named semantically for their purpose
   - Support proper and relevant usage
   - **Use semantic tokens whenever possible**
   - Example: `--pf-t--global--background--color--action--plain--clicked`

#### Token Naming Structure

All PatternFly tokens follow this pattern:

```
--pf-t--[scope]--[component]--[property]--[concept]--[variant]--[state]
```

**Token Segments**:

| Segment   | Description                                                              | Examples                              |
|-----------|--------------------------------------------------------------------------|---------------------------------------|
| `scope`   | Token's range                                                            | `global`, `chart`                     |
| `component` | Component the token relates to                                         | `icon`, `background`, `text`, `border`|
| `property`| Style property                                                           | `color`, `size`, `width`, `radius`    |
| `concept` | Higher-level concept with variants                                       | `status`, `primary`, `action`         |
| `variant` | Variant of component/concept                                             | `link`, `plain`, `warning`, `success` |
| `state`   | Interaction state                                                        | `default`, `hover`, `active`, `clicked`|

**Note**: Not all segments appear in every token. Irrelevant segments are skipped.

**Examples**:
```css
/* Full structure */
--pf-t--global--background--color--action--plain--clicked

/* Partial structure (no concept) */
--pf-t--global--background--color--backdrop--default

/* Minimal structure (only scope/component/property/variant) */
--pf-t--global--border--width--regular
```

#### Common Token Categories

**Color Tokens**:
- `--pf-t--global--color--*` - Base colors
- `--pf-t--global--background--color--*` - Background colors
- `--pf-t--global--text--color--*` - Text colors
- `--pf-t--global--border--color--*` - Border colors
- `--pf-t--global--icon--color--*` - Icon colors

**Spacing Tokens**:
- `--pf-t--global--space--*` - Spacing values (margins, padding)
- Examples: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, etc.

**Typography Tokens**:
- `--pf-t--global--font--size--*` - Font sizes
- `--pf-t--global--font--weight--*` - Font weights
- `--pf-t--global--font--family--*` - Font families
- `--pf-t--global--line--height--*` - Line heights

**Border Tokens**:
- `--pf-t--global--border--width--*` - Border widths
- `--pf-t--global--border--radius--*` - Border radius values

#### Token Usage Guidelines

**For AI Implementation**:
- ✅ **DO** use semantic tokens first (they're intentionally named for their use case)
- ✅ **DO** provide fallback values for all tokens
- ✅ **DO** reference [PatternFly's token documentation](https://www.patternfly.org/tokens/all-patternfly-tokens/) for correct usage
- ✅ **DO** match token usage from PatternFly React components
- ⚠️ **AVOID** using palette or base tokens directly (use semantic tokens)
- ⚠️ **AVOID** hardcoding color/spacing values (always use tokens)
- ❌ **DON'T** create custom tokens that duplicate PatternFly tokens

**Example in CSS**:
```css
.button {
  /* GOOD - semantic token with fallback */
  background-color: var(--pf-t--global--background--color--action--primary--default, #0066cc);
  
  /* BAD - hardcoded value */
  background-color: #0066cc;
  
  /* BAD - base token when semantic exists */
  background-color: var(--pf-t--global--color--200);
}
```

### Additional PatternFly Terminology

**Component Variants**: Different visual styles of a component
- Example: Button has primary, secondary, tertiary, danger, link variants
- Each variant has specific styling and use cases

**Component States**: Interactive states that affect component appearance
- Common states: default, hover, focus, active, disabled, pressed
- Must match React PatternFly state behavior exactly

**Modifiers**: CSS classes or attributes that modify component appearance or behavior
- Used to apply variations without creating new components
- Example: `size="large"`, `danger`, `isDisabled`

**Slots** (Web Components): Content projection mechanism
- Equivalent to React `children` prop
- Named slots map to specific content areas
- Default (unnamed) slot for primary content

**Parts**: Shadow DOM elements exposed for external styling
- Exposed via `::part()` pseudo-element
- Allows users to style internal component elements
- Example: `::part(button)` targets the internal button element

### Integration Points

**PatternFly v6 CSS Base**:
- Import PatternFly base tokens and utilities
- Located in `@patternfly/patternfly` package
- Required for token-based styling

**Token System**:
- All styling should use PatternFly tokens
- Fallback values required for each token
- Tokens enable automatic theming

**React → Web Component Translation**:
- React props → Web Component attributes/properties
- React `children` → Web Component slots
- React event handlers → Web Component events
- React className → Web Component parts or attributes

### AI Guidelines for Component Implementation

**When asked to implement a component**:
1. ✅ **DO** start by researching the PatternFly v6 React version
2. ✅ **DO** ask clarifying questions if implementation details are unclear
3. ✅ **DO** reference official PatternFly documentation
4. ✅ **DO** explain design decisions based on PatternFly patterns
5. ✅ **DO** verify token usage matches PatternFly conventions
6. ❌ **DON'T** guess at component behavior without research
7. ❌ **DON'T** create custom designs that deviate from PatternFly
8. ❌ **DON'T** skip accessibility requirements

**Quality Bar**: If someone puts this component next to the React PatternFly version, they should not be able to tell them apart visually.

## Common Tasks

### Adding a New Component

**Manual Steps** (until `npm run new` is implemented):

1. **Research the PatternFly v6 component** thoroughly
2. **Create component directory**: `/elements/pfv6-{component}/`
3. **Create files**:
   - `pfv6-{component}.ts` - Component implementation
   - `pfv6-{component}.css` - Component styles
   - `pfv6-{component}-lightdom.css` - If nested slotted content needs styling
   - `/demo/index.html` - Primary demo page (minimal HTML fragment)
   - `/demo/variants.html` - Optional additional demos
   - `/test/pfv6-{component}.spec.ts` - Unit tests
4. **Implement component** following coding standards
5. **Create demos** showcasing all variants and features (keep them simple!)
6. **Write tests** for public API and accessibility
7. **Document component** with JSDoc and README
8. **Verify visual parity** with React PatternFly
9. **Run linters** and fix all errors

**Demo File Template**:
```html
<h1>Component Name</h1>

<section>
  <h2>Basic Usage</h2>
  <pfv6-{component}>
    Content here
  </pfv6-{component}>
</section>

<script type="module">
  import '@pfv6/elements/pfv6-{component}/pfv6-{component}.js';
</script>

<style>
  pfv6-{component} {
    margin: 1rem;
  }
</style>
```

### Dependencies & Integrations

**Core Dependencies**:
- **`lit`** - Lightweight, standards-based web component framework
- **`@patternfly/patternfly`** - PatternFly v6 CSS and design tokens
- **TypeScript** - Type safety and developer experience
- **`@web/dev-server`** - Fast, lightweight dev server with ES modules support
- **`@web/test-runner`** - Modern test runner for web components
- **Playwright** - Cross-browser E2E testing

**Development Tools**:
- **Wireit** - Task orchestration and caching
- **`@pwrs/cem`** - Custom Elements Manifest generator for component metadata
- **Vite** - React comparison demo bundling (optional, isolated)
- **`@vitejs/plugin-react`** - React JSX transformation for comparison demos
- **ESLint** - JavaScript/TypeScript linting
- **Stylelint** - CSS linting with token validation
- **`web-dev-server-plugin-lit-css`** - CSS import handling (development)
- **`esbuild-plugin-lit-css`** - CSS bundling (production)

**Comparison Testing**:
- **`@patternfly/react-core`** - Official PatternFly React components (dev dependency)
- **React & ReactDOM** - Required for React comparison demos (dev dependency)

**Why CEM (`@pwrs/cem`)**:
- Generates `custom-elements.json` with component metadata
- Enables automatic demo discovery for dev server
- Provides documentation for component APIs (slots, properties, events, CSS custom properties)
- Single source of truth for component information
- Reference: [CEM Documentation](https://bennypowers.dev/cem/docs/)

## Known Issues & Gotchas

### Shadow DOM Limitations

**`::slotted()` cannot style nested elements** - This is the #1 gotcha. See "Areas That Need Extra Care" in AI Assistant Guidelines for detailed guidance.

### Token Fallback Values

Always provide fallback values for tokens. If PatternFly CSS isn't loaded, components should still be usable with fallback styling.

### Focus Management

`delegatesFocus` only works for Shadow DOM elements. Slotted elements require manual focus override.

### Browser Compatibility

Target modern browsers with ES6+ and Shadow DOM support. IE11 is not supported.

### Performance Considerations

- Large slot content can impact initial render performance
- Use `requestAnimationFrame` for expensive operations
- Be mindful of reactive property changes that trigger re-renders

### @lit/context Module Path Consistency

**CRITICAL**: When using `@lit/context`, ALL components must import the context symbol from the EXACT SAME MODULE PATH.

**The Problem**: If a provider and consumer import the same context from different paths (e.g., `'./context.js'` vs `'@pfv6/elements/pfv6-card/context.js'`), the JavaScript module system may treat them as separate modules, causing context symbols to not match. This breaks context propagation even though `@lit/context` correctly crosses shadow boundaries.

**The Solution**: Use consistent import paths (preferably bare module specifiers) across ALL files:

```typescript
// ✅ CORRECT - All files use the same path
// pfv6-card.ts
import { cardContext } from '@pfv6/elements/pfv6-card/context.js';

// pfv6-checkbox.ts  
import { cardContext } from '@pfv6/elements/pfv6-card/context.js';
```

```typescript
// ❌ WRONG - Different paths break context matching
// pfv6-card.ts
import { cardContext } from './context.js';  // Relative path

// pfv6-checkbox.ts
import { cardContext } from '@pfv6/elements/pfv6-card/context.js';  // Bare specifier
```

**Key Facts About `@lit/context`**:
- ✅ **Does** cross shadow boundaries via DOM events (`composed: true`)
- ✅ **Does not** require intermediate components to consume/re-provide
- ✅ **Requires** consistent import paths for context symbol matching
- ❌ **Will fail silently** if context symbols don't match due to module path inconsistency

**Testing Tip**: If context tests show provider has the value but consumer receives `undefined`, check that ALL imports of the context use the exact same path.

## Resources & References

### Project Context

This project (pfv6) is an **amalgamation of three key projects**:

1. **[PatternFly v6](https://www.patternfly.org/)** - The design system
2. **[PatternFly Elements](https://patternflyelements.org/)** - Web component patterns
3. **[Red Hat Design System](https://ux.redhat.com/)** - Component implementation standards

### Primary Documentation

#### PatternFly v6 Design System
**URL**: [https://www.patternfly.org/](https://www.patternfly.org/)

**What it provides**:
- Component design specifications and usage guidelines
- Design tokens and theming system
- Accessibility requirements
- UX writing guidelines
- React component reference implementations

**Key sections to reference**:
- [Components](https://www.patternfly.org/components) - Visual specs for all components
- [Tokens](https://www.patternfly.org/tokens/about-tokens/) - Design token documentation
- [Design Foundations](https://www.patternfly.org/design-foundations) - Colors, typography, spacing
- [Accessibility](https://www.patternfly.org/accessibility) - A11y requirements
- [React GitHub](https://github.com/patternfly/patternfly-react) - React implementation source

**⭐ CRITICAL: Official React Examples on GitHub**

**For React comparison demos, use the official PatternFly React example files:**

```
https://github.com/patternfly/patternfly-react/tree/main/packages/react-core/src/components/{Component}/examples
```

**Example for Card**:
- **URL**: https://github.com/patternfly/patternfly-react/tree/main/packages/react-core/src/components/Card/examples
- **Files**: `Card*.tsx` files are the official examples
- **Benefit**: Copy directly instead of manually transcribing from docs

**Workflow for React Demos**:
1. Navigate to GitHub URL for the component (e.g., `Card/examples/`)
2. Copy the `.tsx` example files directly
3. Adapt mounting code for our demo structure (ReactDOM.createRoot)
4. Build with Vite to bundle as ES modules

**Why This is Better**:
- ✅ **Official source of truth** - Guaranteed to match PatternFly React
- ✅ **Complete examples** - Includes all props, state, and logic
- ✅ **Always up to date** - Synced with latest PatternFly React version
- ✅ **No transcription errors** - Direct copy eliminates manual errors
- ✅ **TypeScript types** - Full type safety from source

#### PatternFly Elements
**URL**: [https://patternflyelements.org/](https://patternflyelements.org/)

**What it provides**:
- Existing web component implementations (not v6)
- Web component architecture patterns
- Framework integration examples
- Component API patterns for web components

**Use for**:
- Understanding web component patterns
- Reference for slot patterns
- Framework integration approaches
- Component structure ideas

**Note**: PatternFly Elements is not PatternFly v6 - we're building v6 components where they don't exist yet.

#### Red Hat Design System
**URL**: [https://ux.redhat.com/](https://ux.redhat.com/)

**What it provides**:
- Web component development standards
- Code style guides (referenced in this document)
- Component patterns and best practices
- Implementation guidelines

**Key resources**:
- [Custom Elements API Style Guide](https://github.com/RedHat-UX/red-hat-design-system/wiki/Custom-Elements-API-Style-Guide)
- [CSS Styles Guide](https://github.com/RedHat-UX/red-hat-design-system/wiki/CSS-Styles)
- [JSDoc Guide](https://github.com/RedHat-UX/red-hat-design-system/wiki/JSDoc)
- [GitHub Wiki](https://github.com/RedHat-UX/red-hat-design-system/wiki) - Full development guidelines

### Related GitHub Repositories

- **PatternFly Core CSS**: [github.com/patternfly/patternfly](https://github.com/patternfly/patternfly)
- **PatternFly React**: [github.com/patternfly/patternfly-react](https://github.com/patternfly/patternfly-react)
- **PatternFly Elements**: [github.com/patternfly/patternfly-elements](https://github.com/patternfly/patternfly-elements)
- **Red Hat Design System**: [github.com/RedHat-UX/red-hat-design-system](https://github.com/RedHat-UX/red-hat-design-system)

### API References

**PatternFly v6 Tokens**:
- All tokens: [patternfly.org/tokens/all-patternfly-tokens](https://www.patternfly.org/tokens/all-patternfly-tokens/)
- Token documentation: [patternfly.org/tokens/about-tokens](https://www.patternfly.org/tokens/about-tokens/)

**Lit Documentation**:
- Lit Element: [lit.dev](https://lit.dev/)
- Decorators: [lit.dev/docs/components/decorators](https://lit.dev/docs/components/decorators/)
- Styling: [lit.dev/docs/components/styles](https://lit.dev/docs/components/styles/)
- Lifecycle: [lit.dev/docs/components/lifecycle](https://lit.dev/docs/components/lifecycle/)

**Web Standards**:
- Custom Elements: [MDN Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- Shadow DOM: [MDN Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)
- CSS Custom Properties: [MDN CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

### Testing Resources

- **@web/test-runner**: [modern-web.dev/docs/test-runner](https://modern-web.dev/docs/test-runner/)
- **Playwright**: [playwright.dev](https://playwright.dev/)
- **@open-wc/testing**: [open-wc.org/docs/testing/testing-package](https://open-wc.org/docs/testing/testing-package/)

### How to Use These Resources

**When implementing a component**:

1. **Start with PatternFly v6** - Get design specs, variants, behavior
2. **Check PatternFly React** - See how it's implemented in React
3. **Reference PatternFly Elements** - Look for web component patterns (if component exists)
4. **Follow RHDS guidelines** - Apply code standards and best practices
5. **Verify tokens** - Cross-reference token usage with PatternFly v6 docs

**AI Priority Order**:
1. PatternFly v6 design specs (visual/functional requirements)
2. PatternFly React implementation (reference implementation)
3. Red Hat Design System code standards (how to write the code)
4. PatternFly Elements patterns (web component architecture ideas)

## AI Assistant Guidelines

### Preferred Code Style

Follow these established style guides:
- **Custom Elements API**: [Red Hat Design System Custom Elements API Style Guide](https://github.com/RedHat-UX/red-hat-design-system/wiki/Custom-Elements-API-Style-Guide)
- **CSS Styles**: [Red Hat Design System CSS Styles Guide](https://github.com/RedHat-UX/red-hat-design-system/wiki/CSS-Styles)
- **JSDoc**: [Red Hat Design System JSDoc Guide](https://github.com/RedHat-UX/red-hat-design-system/wiki/JSDoc)
- **PatternFly Tokens**: [PatternFly Tokens Documentation](https://www.patternfly.org/tokens/about-tokens/)

**Key Reminders**:
- Use `#private` for non-decorated members, `_private` for decorated members (`@state`, `@property`)
- Extend `Event` class, not `CustomEvent`
- Use semantic tokens with fallback values
- Document all public APIs with JSDoc
- Follow member ordering conventions
- **🚨 NEVER modify React demo files (`patternfly-react/{Component}/*.tsx`) - they are immutable source of truth**

### When to Ask vs. Infer

**ALWAYS ASK FIRST.**

Before implementing any component or feature:
- ✅ **DO** ask clarifying questions about requirements
- ✅ **DO** ask which PatternFly v6 component to reference
- ✅ **DO** ask about specific variants or features needed
- ✅ **DO** ask if unsure about design token usage
- ✅ **DO** ask about expected behavior when unclear
- ✅ **DO** verify understanding before implementing

**Never assume**:
- ❌ Component requirements or variants
- ❌ Which props/attributes are needed
- ❌ Event names or payloads
- ❌ Styling approach (Shadow DOM vs Lightdom CSS)
- ❌ Accessibility requirements

**Better to ask 10 questions than build the wrong thing.**

### 🚨 CRITICAL: Disruptive Commands Require User Approval

**AI MUST ALWAYS PROMPT before running these commands:**

#### `killall node`
- ⚠️ **NEVER run `killall node` automatically** - it kills ALL Node.js processes on the user's machine
- ✅ **DO** prompt the user: "I need to run `killall node` to free port 8000. This will stop all Node processes. May I proceed?"
- ✅ **DO** wait for explicit approval
- **Why**: User may have other important Node processes running (other dev servers, build tools, background tasks)

#### Test Suites (`npm run e2e`, `npm run e2e:parity`)
- ⚠️ **NEVER run test suites automatically** - they are time-intensive and resource-heavy
- ✅ **DO** prompt the user: "I'd like to run `npm run e2e:parity` to verify the changes. This will take ~45s and requires port 8000. May I proceed?"
- ✅ **DO** explain what you'll test and why
- ✅ **DO** wait for explicit approval
- **Why**: Tests take significant time, may require stopping other processes, and user may want to review code first

#### Build Commands (`npm run compile`, `npm run compile:react-demos`)
- ⚠️ **ASK before running full builds** - they take time and may trigger other workflows
- ✅ **DO** prompt the user: "I need to run `npm run compile:react-demos` to rebuild React demos. May I proceed?"
- **Why**: User may want to stage other changes first or review before building

**Summary**: If a command affects processes, ports, or takes significant time → **ASK FIRST**.

### 🚨 CRITICAL: React Demo Immutability

**React demo files are IMMUTABLE and must NEVER be modified.**

#### The Rule

Files in `patternfly-react/{Component}/*.tsx` are copied directly from the PatternFly React GitHub repository and serve as the **single source of truth** for visual parity testing.

**NEVER:**
- ❌ Modify imports or asset paths
- ❌ Fix "broken" image URLs or external dependencies
- ❌ Add mounting code or wrapper logic
- ❌ Adjust styling or layout
- ❌ Change prop values or component structure
- ❌ Add comments or documentation
- ❌ "Improve" or "optimize" the code

**ALWAYS:**
- ✅ Copy React demos byte-for-byte from PatternFly React GitHub
- ✅ Leave them exactly as they appear in the official repository
- ✅ If React demos don't work, investigate missing infrastructure (assets, dependencies)
- ✅ If visual differences exist, fix the **Lit component**, not the React demo

#### Why This Matters

1. **Source of Truth**: React demos define what "correct" looks like
2. **Visual Parity**: Any changes to React demos invalidate visual regression tests
3. **Reproducibility**: We must be able to re-clone and get identical results
4. **Upstream Sync**: Changes upstream should be reflected by re-cloning, not manual edits

#### What If React Demos Have Problems?

**Broken asset URLs (e.g., images)?**
- Fix by updating `scripts/copy-patternfly-assets.ts` to include missing assets
- Update dev server to serve assets correctly
- **DO NOT** change the React demo's `src` attribute

**Import errors?**
- Fix by ensuring dependencies are installed
- Update import maps if needed
- **DO NOT** change the React demo's import statements

**Component doesn't render?**
- Check if React demo index properly mounts the component
- Verify PatternFly React packages are up to date
- **DO NOT** modify the React demo component code

**Upstream bug in PatternFly React?**
- Report to PatternFly team
- Document the issue in project notes
- **DO NOT** "fix" the React demo locally

### Areas That Need Extra Care

#### Critical: Slotted Elements and Lightdom CSS

This is a **fundamental difference** between Shadow DOM (web components) and Light DOM (React PatternFly).

**The Problem**:

Shadow DOM's `::slotted()` pseudo-element can **only style direct children** of a slot. It cannot style deeply nested elements within slotted content.

```css
/* Shadow DOM - CAN style direct slot children */
::slotted(a) {
  color: blue; /* ✅ Works */
}

/* Shadow DOM - CANNOT style nested elements */
::slotted(li a) {
  color: blue; /* ❌ Does NOT work */
}
```

**React PatternFly (Light DOM) has no such limitation** - it can style any nested element.

#### When to Use Lightdom CSS

You **must** create a `-lightdom.css` file when:

1. **Deeply nested slotted content** needs styling:
```html
<!-- Example: List items with nested links -->
<pfv6-footer>
  <ul slot="links">
    <li><a href="#">Link 1</a></li>  <!-- Nested: ul > li > a -->
    <li><a href="#">Link 2</a></li>
  </ul>
</pfv6-footer>
```

2. **Complex slot patterns** from React PatternFly require nested element styling:
```html
<!-- Example: Card with header containing multiple elements -->
<pfv6-card>
  <div slot="header">
    <h3><a href="#">Title Link</a></h3>  <!-- Nested styling needed -->
    <p class="subtitle">Description</p>
  </div>
</pfv6-card>
```

3. **Semantic HTML structures** where PatternFly React styles nested elements:
```html
<!-- Example: Navigation with nested lists -->
<pfv6-nav>
  <ul slot="nav-items">
    <li>
      <a href="#">Parent</a>
      <ul>  <!-- Nested ul needs styling -->
        <li><a href="#">Child</a></li>
      </ul>
    </li>
  </ul>
</pfv6-nav>
```

#### Lightdom CSS Implementation Pattern

**File naming**: `pfv6-{component}-lightdom.css`

**Scoping**: Always scope selectors to the component tag:

```css
/* pfv6-footer-lightdom.css */

/* GOOD - Scoped to component */
pfv6-footer [slot^="links"] li {
  margin: 0;
  padding: 0;
  display: contents;
}

pfv6-footer [slot^="links"] a {
  display: block;
  color: var(--pf-t--global--text--color--on-dark, #ffffff);
  font-size: var(--pf-t--global--font--size--body--sm, 0.875rem);
}

/* BAD - Not scoped, affects entire page */
[slot^="links"] li {
  margin: 0;
}
```

**Important**: Lightdom CSS files are **not embedded at build time**. They must be:
- Published as separate CSS files (use `-lightdom.css` suffix)
- Manually included by users in their HTML/project
- Documented in component README

#### AI Decision Tree for Styling Slotted Content

```
Does the component accept slotted content?
  └─ NO → Use only Shadow DOM styles
  └─ YES → Continue...
      
      Does slotted content need styling beyond direct children?
        └─ NO → Use ::slotted() in component CSS
        └─ YES → Continue...
            
            Does PatternFly React version style nested elements?
              └─ YES → Create -lightdom.css file
              └─ NO → Use ::slotted() in component CSS
```

#### Questions to Ask When Handling Slots

1. **What is the slot structure in PatternFly React?**
   - What content goes in slots?
   - How nested is it?
   - What elements need styling?

2. **Can I style it from Shadow DOM?**
   - Are the styled elements direct slot children?
   - Or are they nested deeper?

3. **Does React PatternFly style nested slotted elements?**
   - Check the React component CSS
   - Look for descendant selectors

4. **If lightdom CSS is needed:**
   - Document it clearly
   - Provide usage instructions
   - Ensure selectors are properly scoped

### Summary for AI

When implementing components:
1. **Always ask** before starting
2. **Research** PatternFly v6 React implementation first
3. **Identify slot patterns** and nesting depth early
4. **Decide styling approach** (Shadow DOM vs Lightdom CSS) based on nesting
5. **Match React exactly** - visual parity is the goal
6. **Document lightdom CSS** when used
7. **Test thoroughly** - compare with React side-by-side

### Visual Parity Analysis Methodology

When visual tests fail, use the systematic analysis process documented in `VISUAL_PARITY_ANALYSIS_METHODOLOGY.md`:

1. **Analyze test report** - Review Playwright report, examine diff images
2. **Side-by-side visual inspection** - Open both demos in browser, take screenshots
3. **Source code comparison** - Compare React and Lit demo files line-by-line
4. **Browser DevTools inspection** - Check computed styles, Shadow DOM structure
5. **Interactive state testing** - Test hover, focus, selection states
6. **Root cause analysis** - Categorize issues (fixable vs blocked)

**Key principle**: Document your analysis process! Create a specific analysis document for complex failures (e.g., `CLICKABLE_SELECTABLE_ANALYSIS.md`) showing:
- Visual differences observed
- Source code comparison
- Root cause identification
- Recommended fixes
- Testing checklist

This documentation helps:
- ✅ Future developers understand the issue
- ✅ Track decision-making process
- ✅ Validate fixes systematically
- ✅ Create reusable patterns for similar issues

---

## Document Metadata

**Last Updated:** 2025-01-20  
**Version:** 1.3  
**Target Audience:** AI assistants (Claude, GPT, etc.) and human developers  
**Maintained By:** PatternFly Elements v6 Team

**Recent Changes (v1.3)**:
- Updated project structure to reflect LiquidJS template system (layouts, partials, unified templates)
- Updated visual testing documentation to reflect current test suite organization
- Removed Method 1 (manual copy) for React demos - always use automated clone process
- Updated React demo structure and workflow documentation
- Updated PatternFly CSS references to use `dev-server/styles/patternfly/base.css`
- Clarified visual regression testing commands and workflow
- Removed machine-specific paths, replaced with generic placeholders
- Updated test organization to show actual test files (parity, baseline, etc.)

**Recent Changes (v1.2)**:
- 🚨 **MAJOR**: Added "Complete Workflow: Creating a New PatternFly Component" - Mandatory 8-phase process
- Enhanced React Comparison Demos section with automated clone workflow
- Added "Critical Steps After Copying React Demos" including image URL updates and baseline rebuilding
- Documented systematic approach for cloning PatternFly React repository
- Added comprehensive checklist for component completion validation
- Updated Table of Contents to prioritize the Complete Workflow
- Emphasized GitHub as single source of truth for React demos (not patternfly.org)

**Recent Changes (v1.1)**:
- Added comprehensive "React-to-LitElement API Translation" section
- Documented CSS Variables as public API concept
- Explained sub-component pattern vs named slots
- Detailed cardinality matching with React components
- Added `display: contents` pattern documentation
- Documented form input integration patterns
- Added React-to-LitElement translation checklist
- Updated Quick Reference and Table of Contents

## Table of Contents

1. [Quick Reference for AI](#quick-reference-for-ai) - Start here for critical info
2. [Project Overview](#project-overview) - What we're building and why
3. [Tech Stack](#tech-stack) - Technologies and tools
4. [Project Structure](#project-structure) - File organization
5. [Shared Libraries & Utilities](#shared-libraries--utilities) - Reusable helpers and responsive attributes
6. [Complete Workflow: Creating a New PatternFly Component](#complete-workflow-creating-a-new-patternfly-component) - **🚨 MANDATORY: Step-by-step process**
7. [React-to-LitElement API Translation](#react-to-litelement-api-translation) - **CRITICAL: How to convert React to web components**
8. [Architecture & Design Patterns](#architecture--design-patterns) - Core design principles
9. [Development Workflow](#development-workflow) - Commands and processes
10. [Code Conventions](#code-conventions) - Style guides and standards
11. [CSS Style Guidelines](#css-style-guidelines) - Styling approach
12. [Testing Strategy](#testing-strategy) - How to test components
13. [Key Concepts & Domain Knowledge](#key-concepts--domain-knowledge) - PatternFly expertise
14. [Common Tasks](#common-tasks) - Frequently performed operations
15. [Known Issues & Gotchas](#known-issues--gotchas) - Things to watch out for
16. [Resources & References](#resources--references) - External documentation
17. [AI Assistant Guidelines](#ai-assistant-guidelines) - **Critical reading for AI**

