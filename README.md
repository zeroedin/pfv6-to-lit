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

If using nvm:
```bash
nvm use
```

### Installation

```bash
npm install
```

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
```

**Development Pages:**
- **`/`** - Main development index with auto-generated component list
- **`/elements/pfv6-{name}/demo/index`** - Component primary demo
- **`/elements/pfv6-{name}/demo/{page}`** - Additional component demo pages

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

### Two-Layer CSS Variable Pattern

**Key Innovation**: Our components use a two-layer CSS variable pattern that makes them **MORE RESILIENT than React PatternFly**.

#### The Pattern

```css
:host {
  /* Private variable with fallback chain */
  --_pfv6-card-background-color: var(
    --pf-v6-c-card--BackgroundColor,
    var(--pf-t--global--background--color--primary--default)
  );
}

#container {
  background-color: var(--_pfv6-card-background-color);
}
```

#### Why This Matters

**React PatternFly** uses direct variable references without fallbacks:
```css
.pf-v6-c-card {
  background-color: var(--pf-v6-c-card--BackgroundColor);
}
```

When `--pf-v6-c-card--BackgroundColor` is unset or removed:
- ❌ **React**: Becomes **transparent** - loses default styling
- ✅ **Our components**: Maintain **white background** - fall back to design tokens

#### Real-World Benefits

This pattern provides resilience in scenarios where:
- CSS is dynamically modified by JavaScript
- Theming systems reset variables
- Third-party libraries manipulate styles
- User overrides are removed/reverted

**Validation**: See `tests/css-api/card-api.spec.ts` - "CSS variable reset: unset removes custom value" for proof that our implementation maintains styling when React's implementation fails.

### PatternFly CSS Strategy

**Current Approach**: PatternFly base CSS is copied from `node_modules` to `dev-server/styles/` during development. This provides global CSS tokens for demo pages.

**Long-term Consideration**: We need to decide whether to:
1. **Global CSS** (current): Require users to include PatternFly CSS in their projects
2. **Component CSS with fallbacks**: Use CSS variable fallbacks in each component for more modularity

Option 2 would make components more self-contained but may increase CSS duplication. This decision will be made as we develop more components and understand usage patterns.

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

