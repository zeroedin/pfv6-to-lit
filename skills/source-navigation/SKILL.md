---
name: source-navigation
description: How to navigate PatternFly React and Core source files in .cache/ directories. Memory-efficient patterns for the 1,400+ file codebase. Use when converting React components or locating source CSS/TypeScript.
---

# Source Navigation

## PatternFly React Source

| Content | Path Pattern |
|---------|-------------|
| Component source | `.cache/patternfly-react/packages/react-core/src/components/{Component}/{Component}.tsx` |
| Sub-components | `.cache/patternfly-react/packages/react-core/src/components/{Component}/*.tsx` |
| Layout components | `.cache/patternfly-react/packages/react-core/src/layouts/{Layout}/{Layout}.tsx` |
| Demo examples | `.cache/patternfly-react/packages/react-core/src/components/{Component}/examples/*.tsx` |

**Example**: Checkbox source →
`.cache/patternfly-react/packages/react-core/src/components/Checkbox/Checkbox.tsx`

## PatternFly Core CSS Source

| Content | Path Pattern |
|---------|-------------|
| Component SCSS | `.cache/patternfly/src/patternfly/components/{Component}/{component}.scss` |
| Default tokens | `.cache/patternfly/src/patternfly/base/tokens/tokens-default.scss` |
| Color palette | `.cache/patternfly/src/patternfly/base/tokens/tokens-palette.scss` |
| Layout SCSS | `.cache/patternfly/src/patternfly/layouts/{Layout}/{layout}.scss` |
| Layout docs | `.cache/patternfly/src/patternfly/layouts/{Layout}/examples/{Layout}.md` |

**Example**: Checkbox CSS →
`.cache/patternfly/src/patternfly/components/Checkbox/checkbox.scss`

## Memory Efficiency Rules (CRITICAL)

The `.cache/` directories contain 1,400+ files. Follow these rules:

- **ONLY** read files for the specific component being converted
- **Use targeted paths** with the exact component name
- **NEVER** use broad glob patterns like `components/**/*` or `src/**/*.tsx`
- **NEVER** use Glob or ListDir tools on `.cache/` directories
- **Follow `targeted-search` skill** for cross-codebase searches
- **Use `grep`/`ripgrep`** for pattern matching across many files

## Component Exclusions

Layout components and styling components are NOT converted to custom elements.
Check `.config/component-exclusions.json` for the current exclusion list.

```bash
grep -q "ComponentName" .config/component-exclusions.json && echo "excluded" || echo "not excluded"
```

