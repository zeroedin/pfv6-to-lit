# PatternFly Elements v6

Web components implementing the PatternFly v6 design system.

## Overview

PatternFly Elements v6 is a web component library built with LitElement that implements the PatternFly v6+ design system for non-React environments. This enables developers to use PatternFly v6+ component designs in Vue, Angular, Svelte, vanilla JavaScript, and server-side platforms like Drupal and Ruby on Rails.

## Project Goals

- **1:1 Visual Parity**: Components must be visually identical to React PatternFly v6
- **Framework Agnostic**: Work in any framework or vanilla JavaScript
- **Standards-Based**: Built on Web Components standards (Custom Elements, Shadow DOM)
- **Design Token Integration**: Use PatternFly v6 design tokens for theming

## Getting Started

### Prerequisites

- Node.js 24.x (LTS) - See `.nvmrc` for version
- npm 10+

#### Using Node Version Manager (nvm)

This project uses Node.js 24.x. We recommend using [nvm](https://github.com/nvm-sh/nvm) for Node.js version management.

**Install nvm:**

**macOS/Linux:**

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

Or with wget:

```bash
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

**Windows:**

Download and install [nvm-windows](https://github.com/coreybutler/nvm-windows/releases)

**After installation:**

```bash
# Install the project's Node.js version (reads from .nvmrc)
nvm install

# Use the project's Node.js version
nvm use
```

The `.nvmrc` file in the project root specifies the exact Node.js version. Running `nvm use` automatically switches to this version.

### Installation

```bash
npm ci
```

**What happens on postinstall:**

1. **Cache PatternFly sources** - Clones React PatternFly and core PatternFly to `.cache/`
2. **Copy React demos** - Extracts React demo files to `patternfly-react/` for comparison testing
3. **Copy PatternFly assets** - Copies base CSS, fonts, and images to `dev-server/`

These steps ensure:

- React component sources are available for conversion reference
- Side-by-side React comparison demos for visual parity validation

### Development

```bash
# Start development server
npm run dev
# Opens http://localhost:8000 with the development index page

# Compile TypeScript
npm run compile

# Run linters
npm run lint

# Run unit tests
npm run test

# Run E2E tests
npm run e2e

# Analyze component dependencies and generate conversion order
npx tsx scripts/extract-component-dependencies.ts > component-dependencies.yaml
npx tsx scripts/generate-conversion-order.ts 2>/dev/null > conversion-order.yaml

# Find next component to convert
npx tsx scripts/find-blockers.ts
```

**Development Pages:**
- **`/`** - Main development index with auto-generated component list
- **`/elements/pfv6-{name}/demo/`** - Lit component demo index (lists all demos for the component)
- **`/elements/pfv6-{name}/demo/{page}/`** - Individual Lit component demo pages
- **`/elements/pfv6-{name}/react/`** - React component demo index (comparison demos)
- **`/elements/pfv6-{name}/react/{page}/`** - Individual React component demo pages

## Getting Started

### Component Conversion Workflow

This project uses specialized AI subagents to convert React PatternFly components to LitElement web components.

### Finding the Next Component to Convert

Use the `find` subagent to identify the optimal next component based on dependency analysis:

**Prompt:**

```
Use the find.md subagent to locate the next component we should build
```

The `find` subagent:
- Analyzes the conversion order in `conversion-order.yaml`
- Recommends the next component to convert based on dependency order
- Provides reasoning and next steps

### Converting a Component

Once you have a component recommendation, use a simple conversion prompt:

**Prompt:**

```
Convert {{ Component Name }} component
```

Replace `{{ Component Name }}` with the component name from the `find` recommendation (e.g., "Brand", "Spinner", "Divider").

**Conversion Workflow:**

The main conversation orchestrates the conversion by delegating to specialized subagents in sequence:

1. **api-writer** - Translates React props to LitElement properties and creates TypeScript component files
2. **api-auditor** - Validates component API against Lit best practices
3. **demo-writer** - Converts React examples to HTML demos
4. **demo-auditor** - Validates 1:1 parity with React demos
5. **css-writer** - Translates React CSS to Shadow DOM CSS with token-derived fallbacks
6. **css-auditor** - Validates CSS against React source
7. **aria-auditor** - Validates ARIA patterns (property naming, IDREF, React parity, redundant roles)
8. **element-internals-auditor** - Validates ElementInternals usage (host-level ARIA, duplicative semantics)
9. **face-elements-auditor** - Validates Form-Associated Custom Element implementation
10. **test-spec-writer** - Generates comprehensive unit tests
11. **test-visual-writer** - Creates visual regression tests
12. **test-css-api-writer** - Generates CSS API override tests

Each subagent runs in isolation and reports back to the main conversation, which manages the overall workflow.

**Example workflow:**

```bash
# Step 1: Find next component
> Use the find.md subagent to locate the next component we should build

# Agent responds: "Next Component: Spinner (0 dependencies, blocks 6 components)"

# Step 2: Convert the component
> Convert Spinner component

# Main conversation delegates to each subagent in sequence:
#   - api-writer creates component files
#   - api-auditor validates API
#   - demo-writer creates demos
#   - ... (continues through all phases)
```

**Architecture Note:**

The conversion workflow is orchestrated **directly from the main conversation** (not from a nested subagent). This architecture prevents memory accumulation and allows each specialized subagent to complete and release resources before the next phase begins.

For more details on the conversion process and individual subagent capabilities, see [`CLAUDE.md`](CLAUDE.md) and the subagent documentation in [`agents/`](agents/).

## Project Structure

```
/elements/              - Web component implementations
  /pfv6-card/          - Example: Card component
    pfv6-card.ts       - Component TypeScript
    pfv6-card.css      - Component styles
    /demo/             - Component demo files (minimal HTML fragments)
      index.html       - Primary demo page
      variants.html    - Additional demos (optional)
    /test/             - Component unit tests
      pfv6-card.spec.ts

/lib/                  - Shared utilities and contexts
/dev-server/           - Development server configuration
  index.html           - Main development page (served at /)
  /plugins/            - Custom dev server plugins (routing, import maps, demo discovery)
  /styles/             - Global styles and PatternFly base CSS
  /assets/             - Static resources
/tests/                - E2E test files and page objects
/docs/                 - Project documentation
```

**Demo Files**: Each component's `/demo/` folder contains simple HTML fragments (no boilerplate). The dev server automatically wraps them using `dev-server/index.html` as the template, replacing only the `<main>` content with the demo markup.

## Component Naming Convention

All components use the `pfv6-` prefix:
- `pfv6-button`
- `pfv6-card`
- `pfv6-modal`
- etc.

## Architecture Decisions

### PatternFly CSS Strategy

**Demo CSS Files:**

Our demos use two PatternFly CSS files:

- **`base.css`** - Core PatternFly design tokens and base styles
  - Copied from `@patternfly/react-core/dist/styles/base.css`
  - Used by all demos (Lit and React)
  - Location: `/dev-server/styles/patternfly/base.css`

- **`patternfly.css`** - Full PatternFly CSS (includes component styles and layout utilities)
  - Copied from `@patternfly/patternfly/patternfly.css`
  - Used by all demos (Lit and React)
  - Location: `/dev-server/styles/patternfly/patternfly.css`

**Why patternfly.css for Lit demos?**

While Lit components use Shadow DOM with scoped styles, we still need `patternfly.css` for **layout utility classes** like `pf-v6-l-flex`, `pf-v6-l-gallery`, and `pf-v6-l-grid`.

**Layout components are NOT converted to custom elements.** Instead, demos use raw HTML with PatternFly layout CSS classes:
- ✅ Component demos: Use custom elements (`<pfv6-card>`, `<pfv6-button>`)
- ✅ Layout usage: Use HTML + CSS classes (`<div class="pf-v6-l-flex pf-m-row">`)

This approach maintains pixel-perfect parity with React while leveraging PatternFly's battle-tested layout system.

### Layout Integration for `display: contents` Components

**Problem**: Some components use `display: contents` to act as semantically invisible wrappers (e.g., `pfv6-divider`, `pfv6-skeleton`, `pfv6-backdrop`, `pfv6-background-image`). However, elements with `display: contents` become invisible to CSS child selectors like `.pf-v6-l-flex > *`, causing layout spacing and properties to not apply correctly.

**Solution**: We use a **CSS variable contract pattern** to bridge layout containers and `display: contents` components:

1. **Light DOM CSS** (`styles/layout.css`) sets private CSS variables on custom elements inside layout containers
2. **Shadow DOM CSS** (component styles) consumes these variables to apply spacing

**Architecture:**

```
Layout Container (.pf-v6-l-flex)
  ↓ sets --_layout-* variables
Custom Element (pfv6-divider)
  ↓ consumes variables
Shadow DOM (inner <hr>)
  ✓ spacing applied
```

**Usage in Your Project:**

Include the layout integration CSS in your HTML:

```html
<link rel="stylesheet" href="/styles/layout.css">
```

This CSS file is distributed with the component library (not dev-server only) and should be included alongside PatternFly CSS.

**How It Works:**

The `styles/layout.css` file explicitly targets components with `display: contents` and passes through layout properties:

```css
/* Flex layout integration */
.pf-v6-l-flex {
  & > :is(pfv6-divider, pfv6-skeleton, pfv6-backdrop, pfv6-background-image) {
    --_layout-order: var(--pf-v6-l-flex--item--Order);
    --_layout-max-width: 100%;
    --_layout-margin-block-start: 0;
    --_layout-margin-block-end: 0;
    --_layout-margin-inline-start: 0;
    --_layout-margin-inline-end: 0;
  }
}

/* Direction-specific rules */
.pf-v6-l-flex.pf-m-column {
  & > :is(pfv6-divider, pfv6-skeleton, pfv6-backdrop, pfv6-background-image) {
    --_layout-margin-block-end: var(--pf-v6-l-flex--spacer--row);
  }
}
```

Components then consume these variables in their shadow DOM:

```css
/* In pfv6-divider.css */
hr, div {
  order: var(--_layout-order);
  max-width: var(--_layout-max-width);
  margin-block: var(--_layout-margin-block-start) var(--_layout-margin-block-end);
  margin-inline: var(--_layout-margin-inline-start) var(--_layout-margin-inline-end);
}
```

**Supported Layouts:**

Layout integration is implemented for all 7 PatternFly layout systems:
- **Flex** - Full margin control for all direction modifiers (`pf-m-row`, `pf-m-column`, `pf-m-row-reverse`, `pf-m-column-reverse`)
- **Grid** - Column placement and grid-specific properties
- **Gallery** - Works automatically via CSS `gap`
- **Stack** - Works automatically via CSS `gap`
- **Level** - Works automatically via CSS `gap`
- **Split** - Works automatically via CSS `gap`
- **Bullseye** - Uses container padding (no child spacing needed)

**Adding New Components:**

When creating a new component with `display: contents`:

1. Add component to `:is()` selector lists in `styles/layout.css`
2. Consume layout variables in component shadow DOM CSS
3. Test in Flex, Grid, and Gallery layouts to verify spacing

**Variable Naming Convention:**

- Use `--_` prefix for "private" variables (internal contract between layout CSS and components)
- Standard layout variables: `--_layout-order`, `--_layout-max-width`, `--_layout-margin-*`, `--_layout-grid-*`

This pattern ensures visual parity with React components while maintaining the encapsulation benefits of Shadow DOM.

## Documentation

- See `CLAUDE.md` for comprehensive development guidelines
- See `docs/` for component documentation

## Tech Stack

- **TypeScript** - Compiled to ES6 JavaScript
- **Lit** - Web component framework
- **PatternFly v6** - Design system and tokens
- **@web/dev-server** - Development server
- **@web/test-runner** - Unit testing
- **Playwright** - E2E testing
- **Wireit** - Task orchestration

## Contributing

See `CLAUDE.md` for detailed coding standards and guidelines.

## License

MIT

## Resources

- [PatternFly v6 Documentation](https://www.patternfly.org/)
- [PatternFly Elements](https://patternflyelements.org/)
- [Red Hat Design System](https://ux.redhat.com/)
- [Lit Documentation](https://lit.dev/)

