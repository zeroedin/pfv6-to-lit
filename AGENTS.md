# PatternFly React → LitElement Conversion

**Purpose**: Routing guide for specialized agents and project essentials.

---

## Specialized Agents 

If Cursor, use the following subagents: (`.cursor/agents/`)
If Claude Code, use the following subagents: (`.claude/agents/`)

Listed in typical workflow order:

### Planning Phase

**Dependency analysis** → `find`
- Analyzes React components to find zero-dependency or blocker components
- Use: "Use find to plan conversion order"

### Orchestration

**Full component conversion** → `create`
- Orchestrates API → Demos → CSS → Accessibility → Tests workflow
- Use: "Use create to convert [Component]"

### API Phase

**API design** → `api-writer`
- Designs LitElement API from React component source
- Use: "Use api-writer to design [Component] API"

**API validation** → `api-auditor`
- Validates LitElement API follows best practices
- Use: "Use api-auditor to validate [Component] API"

### Demo Phase

**Demo creation** → `demo-writer`
- Creates HTML demos from React examples
- Use: "Use demo-writer to create demos for [Component]"

**Layout translation** → `layout-translator`
- Translates React layout components to HTML+CSS classes
- Used by demo-writer for layout components in demos
- Use: "Use layout-translator to convert [Layout JSX] to HTML"

**Demo validation** → `demo-auditor`
- Validates 1:1 parity with React examples
- Use: "Use demo-auditor to validate [Component] demos"

### CSS Phase

**CSS creation** → `css-writer`
- Translates React CSS to Shadow DOM CSS with proper fallback values
- Use: "Use css-writer to create CSS for [Component]"

**CSS validation** → `css-auditor`
- Validates CSS against React source and PatternFly tokens
- Use: "Use css-auditor to validate [Component] styles"

### Accessibility Phase

**Accessibility validation** → `accessibility-auditor`
- Validates accessibility patterns in LitElement components
- Use: "Use accessibility-auditor to validate [Component] accessibility"

**ARIA validation** → `aria-auditor`
- Validates ARIA patterns and semantics
- Use: "Use aria-auditor to validate [Component] ARIA patterns"

**ElementInternals validation** → `element-internals-auditor`
- Validates ElementInternals usage and patterns
- Use: "Use element-internals-auditor to validate [Component] ElementInternals"

### Form Integration Phase

**Form integration** → `face-elements-writer`
- ElementInternals patterns for form-associated custom elements (FACE)
- Use: "Use face-elements-writer for form integration"

**Form validation** → `face-elements-auditor`
- Validates form-associated custom element implementation
- Use: "Use face-elements-auditor to validate [Component] form integration"

### Testing Phase

**Spec test creation** → `test-spec-writer`
- Creates web-test-runner unit tests for component API
- Use: "Use test-spec-writer to create unit tests for [Component]"

**Visual test creation** → `test-visual-writer`
- Creates Playwright visual regression tests
- Use: "Use test-visual-writer to create visual parity tests for [Component]"

**CSS API test creation** → `test-css-api-writer`
- Creates Playwright tests validating CSS custom property overrides
- Use: "Use test-css-api-writer to create CSS API tests for [Component]"

**Test debugging** → `test-runner`
- Diagnoses visual test failures
- Use: "Use test-runner to debug test failures"

### Quick Routing

**Planning:**
- **Plan conversion order**: Use `find`

**Full Workflow:**
- **New component**: Use `create` (orchestrates all phases)

**Individual Phases:**
- **Design API**: Use `api-writer`
- **Validate API**: Use `api-auditor`
- **Create demos**: Use `demo-writer`
- **Validate demos**: Use `demo-auditor`
- **Translate layouts**: Use `layout-translator`
- **Create CSS**: Use `css-writer`
- **Validate CSS**: Use `css-auditor`
- **Validate accessibility**: Use `accessibility-auditor`
- **Validate ARIA**: Use `aria-auditor`
- **Validate ElementInternals**: Use `element-internals-auditor`
- **Add form integration**: Use `face-elements-writer`
- **Validate form integration**: Use `face-elements-auditor`
- **Write unit tests**: Use `test-spec-writer`
- **Write visual tests**: Use `test-visual-writer`
- **Write CSS API tests**: Use `test-css-api-writer`
- **Debug tests**: Use `test-runner`

**Unsure?** Ask: "What agent should I use for [task]?"

---

## Layout Components

**Layout components are NOT converted to custom elements.**

**Layout Components:**
- Bullseye, Flex, Gallery, Grid, Level, Split, Stack

**Why No Custom Elements:**
- Layout components work as standalone CSS classes (`.pf-v6-l-flex`, `.pf-v6-l-gallery`, etc.)
- React components are just convenience wrappers around these CSS classes
- Custom elements cannot achieve true parity:
  - Cannot implement `component` prop (can't change element type)
  - Light DOM CSS selectors break with semantic wrappers
  - Adds complexity without benefit

**New Approach:**
- **Component demos**: Use custom elements (`<pfv6-card>`, `<pfv6-button>`)
- **Layout usage**: Use raw HTML + CSS classes (`<div class="pf-v6-l-flex pf-m-row">`)
- **Result**: Pixel-perfect parity with identical HTML structure

**When create agent encounters a layout component:**
1. **STOP** - Do not proceed with component creation
2. **INFORM** - Explain this is a layout component using CSS classes
3. **DOCUMENT** - Create minimal README.md with usage instructions
4. **EXIT** - No TypeScript, no CSS files, no tests created

**How demo-writer handles layouts:**
- Detects React layout components in demos
- Delegates to `layout-translator` agent for accurate translation
- Example: `<Flex direction="row">` → delegated → `<div class="pf-v6-l-flex pf-m-row">`
- See `agents/demo-writer.md` Step 6 and `agents/layout-translator.md`

**How demo-auditor validates layouts:**
- Verifies correct HTML + CSS class translation
- Ensures NO custom element usage for layouts
- May delegate to `layout-translator` for complex validations
- See `agents/demo-auditor.md` Step 6 for validation rules

---

## Project Quick Reference

### File Locations
- **React (PRIMARY)**: `.cache/patternfly-react/packages/react-core/src/components/{Component}/`
- **Tokens**: `.cache/patternfly/src/patternfly/base/tokens/tokens-default.scss`
- **Output**: `elements/pfv6-{component}/`

### Key Commands
```bash
npm run patternfly-cache    # Clone React sources (one-time)
npm run analyze-dependencies # Generate dependency tree cache (fast lookups)
npm run dev                 # Dev server
npm test                    # All unit tests (⚠️ starts dev server, may take time)
npm test -- elements/pfv6-card/test/pfv6-card.spec.ts  # Specific test (full path required)
npm run e2e:parity          # All visual parity tests (⚠️ starts dev server, may take several minutes)
npm run e2e:parity -- pfv6-card.visual  # Specific visual test
npm run lint                # Check code quality
npm run compile:react-demos # Compile React demos
```

**Note**: Test commands start a dev server and may hang or take several minutes. When running programmatically, prefer asking the user to run tests manually.

### Dependency Analysis Workflow
```bash
# Initial setup (run once)
npm run patternfly-cache        # Clone React sources
npm run analyze-dependencies    # Generate react-dependency-tree.json

# Use find subagent
# - Reads react-dependency-tree.json (instant results!)
# - Shows components with zero dependencies
# - Identifies demo dependencies (e.g., Divider needs Flex/FlexItem for demos)

# Regenerate when needed
npm run analyze-dependencies    # After updating React sources
```

### Component Structure
```
elements/pfv6-{component}/
  pfv6-{component}.ts      # Implementation
  pfv6-{component}.css     # Shadow DOM styles
  demo/                    # Demos
    basic.html
    ...
  test/
    pfv6-{component}.spec.ts     # Unit tests (web-test-runner)
    pfv6-{component}.visual.ts   # Visual parity tests (Playwright)
    pfv6-{component}.css-api.ts  # CSS API tests (Playwright)
```
**NEVER create `index.ts` exports** - unnecessary indirection

---

## Critical Rules (Always Apply)

**Imports**: Individual only → `import { property } from 'lit/decorators/property.js'`  
❌ Never: `import { property, state } from 'lit/decorators.js'`

**Component API**: Match React prop names exactly  
- `isCompact` (React) → `is-compact` (attribute) → `isCompact` (property)

**CSS API**: Simple class names in `classMap()`  
- Use `compact`, NOT `pf-m-compact`
- ID selectors for unique elements, classes for repeated
- Always start CSS with box-sizing reset

**Tokens**: MUST derive from `tokens-default.scss` (never guess)  
- Copy CSS variable names exactly from React
- Follow token chains to final values

**Baseline Compliance**: All CSS features MUST be Baseline 2024 or earlier
- Check MDN for Baseline badges (https://developer.mozilla.org/)
- Use Can I Use for verification (https://caniuse.com/)
- Non-Baseline features are NOT allowed - find Baseline alternatives
- Reference: https://web.dev/baseline

**Verification**: Check React source in `.cache/` (never guess defaults/types)

**Quality Bar**: Visually indistinguishable from React | 1:1 demo parity | All tests pass | Baseline 2024 compliant

---

## Dependencies

**Packages**: `@patternfly/react-core` (v6.4.0), `patternfly` (v6.4.0)

**Setup**: `npm install` → `npm run patternfly-cache` → verify `.cache/*/` directories exist

---

## Notes

Each subagent is self-contained with comprehensive domain rules. This file provides routing guidance and project essentials for context efficiency.
