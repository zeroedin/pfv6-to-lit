---
name: demo-patterns
description: Demo file conventions for pfe-v6 components including file naming, HTML fragment structure, import rules, static asset paths, React-to-Lit conversion, and HTML validity constraints. Use when writing or editing demo .html files.
---

# Demo Patterns

## File Naming

Convert React PascalCase to kebab-case, stripping component name:

- `CardBasic.tsx` → `basic.html`
- `CardWithDividers.tsx` → `with-dividers.html`
- `CardCompact.tsx` → `compact.html`

**Rules**: kebab-case, descriptor only (no component name), NEVER `index.html`

**1:1 URL parity**: Every `{Component}{Descriptor}.tsx` → `{descriptor}.html` for side-by-side comparison.

## React Demo Source

Location: `./patternfly-react/{Component}/*.tsx` (pre-compiled demos)

## HTML Fragment Structure

Demos MUST be minimal fragments — NOT full documents.

**MUST NOT contain**: `<!doctype>`, `<html>`, `<head>`, `<body>`, `<meta>`, `<title>`, inline `<style>`

**Template**:
```html
<pfv6-card is-compact>
  <pfv6-card-title>Title</pfv6-card-title>
  <pfv6-card-body>Content</pfv6-card-body>
</pfv6-card>

<script type="module">
  import '@pfv6/elements/pfv6-card/pfv6-card.js';
</script>
```

## Import Rules

- Import ONLY the parent component (it auto-imports sub-components)
- Import external slotted components separately (e.g., `pfv6-button.js`)
- NEVER import sub-components that the parent already imports

**Why**: Separate sub-component imports can break `@lit/context` timing.

## Static Asset Paths

Demo server converts `basic.html` → served at `/elements/pfv6-{component}/demo/basic/`

- **Assets in demo/ folder** (images, SVGs): `../asset.svg` (one level up from virtual directory)
- **Lightdom CSS in component root**: `../../pfv6-component-lightdom.css` (two levels up)
- **Shared PatternFly assets**: `/assets/images/filename.svg` (absolute path)
- NEVER use `./` for assets

## React-to-Lit Conversion

**REMOVE**: React imports, TypeScript types, hooks, JSX expressions, Fragment wrappers

**CONVERT**:
- `<Card>` → `<pfv6-card>`
- `isCompact` → `is-compact` (attribute present = true, absent = false)
- camelCase props → kebab-case attributes
- Boolean `false` → omit attribute entirely

**DEPENDENCY CHECK** (MUST do before stubbing):

You MUST check the filesystem for every React dependency before stubbing:
```bash
ls elements/pfv6-{component}/pfv6-{component}.ts
```
- If the file EXISTS → you MUST import and use the actual component
- If the file does NOT exist → you MAY stub: `<!-- TODO: Replace with <pfv6-button> when available -->`
- You MUST NOT stub a component that exists on the filesystem
- You MUST NOT guess component APIs — read the `.ts` source to learn attributes and events

## HTML Validity (CRITICAL)

Custom elements CANNOT violate HTML structural rules:

| Parent | Valid Children |
|--------|--------------|
| `<ul>`, `<ol>` | Only `<li>` |
| `<table>`, `<tbody>` | Only `<tr>` |
| `<tr>` | Only `<td>`, `<th>` |
| `<dl>` | Only `<dt>`, `<dd>` |

**Solution**: Wrap custom elements in semantic HTML:
```html
<ul>
  <li><pfv6-divider></pfv6-divider></li>
</ul>
```

**No `component` prop**: Web components can't change element type. Use semantic HTML wrappers instead.

## Boolean Attributes

- Attribute present = true: `<pfv6-card is-compact>`
- Attribute absent = false: `<pfv6-card>`
- NEVER use `="true"` or `="false"`

## Light DOM Slot Components

For TextInput, TextArea, Select (Light DOM Slot pattern):

```html
<label for="input-id" class="pf-v6-screen-reader">Label text</label>
<pfv6-text-input>
  <input type="text" id="input-id">
</pfv6-text-input>
```

Use explicit `<label for>` with `.pf-v6-screen-reader` for visual parity.

## Layout Components

Flex, Gallery, Grid, Stack, Bullseye, Level, Split are CSS-only — translate to HTML + `.pf-v6-l-*` classes, NOT custom elements. Layout classes ONLY work in Light DOM.

## Styling Components

Content, Title, Form, DescriptionList translate to semantic HTML + `.pf-v6-c-*` classes, NOT custom elements.

## Icon Conversion (CRITICAL — READ CAREFULLY)

React demos import icons from `@patternfly/react-icons` (e.g., `import PlayIcon from '@patternfly/react-icons/dist/esm/icons/play-icon'`). These MUST be converted to **inline SVG inside `<pfv6-icon>`**.

### NEVER Hallucinate Icon Attributes

**`pfv6-icon` does NOT have `icon`, `name`, `set`, or `src` attributes.** It uses a default slot for SVG content. You MUST read the actual SVG path data from the source file.

```html
<!-- ❌ WRONG — NEVER DO THIS — these attributes do not exist on pfv6-icon -->
<pfv6-icon icon="play"></pfv6-icon>
<pfv6-icon icon="play" size="md"></pfv6-icon>
<pfv6-icon name="play" set="fas"></pfv6-icon>
```

### Required Conversion Steps (MANDATORY)

You MUST follow these exact steps — do NOT skip any:

1. **Find the React icon import** (e.g., `import PlayIcon from '@patternfly/react-icons/dist/esm/icons/play-icon'`)
2. **Read the source file**: `cat node_modules/@patternfly/react-icons/dist/esm/icons/{icon-name}.js`
3. **Extract `svgPathData`** (the `d=""` path), `width`, and `height` from the file
4. **Create inline SVG** with the extracted values — NEVER guess or make up path data

```html
<!-- ✅ RIGHT — inline SVG with real path data read from source -->
<pfv6-icon>
  <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 {width} {height}" aria-hidden="true">
    <path d="{svgPathData}"></path>
  </svg>
</pfv6-icon>
```

### Example: PlayIcon

1. React has: `import PlayIcon from '@patternfly/react-icons/dist/esm/icons/play-icon'`
2. Read: `node_modules/@patternfly/react-icons/dist/esm/icons/play-icon.js`
3. Extract: width=448, height=512, svgPathData="M424.4 214.7L72.4..."
4. Result:

```html
<pfv6-icon>
  <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 448 512" aria-hidden="true">
    <path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"></path>
  </svg>
</pfv6-icon>
```

### pfv6-icon Valid Attributes

The ONLY attributes `pfv6-icon` accepts (check its source at `elements/pfv6-icon/pfv6-icon.ts`):
- `size` — icon size (sm, md, lg, xl, 2xl, 3xl, etc.)
- `icon-size` — overrides content size
- `status` — semantic color (info, success, warning, danger, custom)
- `is-inline` — inherit text sizing
- `is-in-progress` — show progress spinner
- `should-mirror-rtl` — mirror for RTL

**There is NO `icon`, `name`, `set`, or `src` attribute.** The icon SVG goes in the default slot.

### When pfv6-icon is inside pfv6-button

Use `slot="icon"` on `pfv6-icon`:
```html
<pfv6-button variant="plain" aria-label="Run in web terminal">
  <pfv6-icon slot="icon">
    <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 448 512" aria-hidden="true">
      <path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"></path>
    </svg>
  </pfv6-icon>
</pfv6-button>
```

**Notes:**
- `fill="currentColor"` ensures icon inherits text color
- `height="1em" width="1em"` for proper sizing
- `aria-hidden="true"` since the icon is decorative (button has `aria-label`)
- Do NOT add `role="img"` when `aria-hidden="true"` is present

## Clipboard Copy Button in Demos (CRITICAL — READ CAREFULLY)

### NEVER Copy React Props Directly

React's `<ClipboardCopyButton>` has props like `textId`, `onClick`, `onTooltipHidden` that do NOT exist on the Lit component. **Do NOT naively convert React props to HTML attributes.**

```html
<!-- ❌ WRONG — NEVER DO THIS — these are React props, not Lit attributes -->
<pfv6-clipboard-copy-button text-id="code-content">
<pfv6-clipboard-copy-button textId="code-content">
```

```html
<!-- ❌ WRONG — NEVER DO THIS — this event does not exist -->
copyButton.addEventListener('copy-success', ...)
```

### pfv6-clipboard-copy-button Valid API

The component lives at `elements/pfv6-clipboard-copy/pfv6-clipboard-copy-button.ts` (sub-component of clipboard-copy). Its ONLY valid attributes are:

- `variant` — `"control"` | `"plain"` (default: `"control"`)
- `exit-delay` — tooltip exit delay in ms (default: `0`)
- `entry-delay` — tooltip entry delay in ms (default: `300`)
- `max-width` — tooltip max width (default: `"100px"`)
- `position` — tooltip position (default: `"top"`)
- `has-no-padding` — removes button padding (boolean)
- `tooltip-content` — tooltip text
- `aria-label` — accessible name

Its ONLY event is:
- `tooltip-hidden` — fired when tooltip hides

**There is NO `text-id`, `textId`, `copy-success`, or `onClick` attribute/event.**

### Correct Conversion Pattern

React:
```tsx
<ClipboardCopyButton
  id="basic-copy-button"
  textId="code-content"           // ← DROP: not a Lit attribute
  aria-label="Copy to clipboard"
  onClick={(e) => onClick(e, code)}  // ← CONVERT to click event
  exitDelay={copied ? 1500 : 600}
  maxWidth="110px"
  variant="plain"
  onTooltipHidden={() => setCopied(false)}  // ← CONVERT to tooltip-hidden event
>
  {copied ? 'Successfully copied...' : 'Copy to clipboard'}
</ClipboardCopyButton>
```

Lit:
```html
<pfv6-clipboard-copy-button
  id="basic-copy-button"
  aria-label="Copy to clipboard"
  exit-delay="600"
  max-width="110px"
  variant="plain"
  tooltip-content="Copy to clipboard"
>
</pfv6-clipboard-copy-button>

<script type="module">
  import '@pfv6/elements/pfv6-clipboard-copy/pfv6-clipboard-copy-button.js';

  const copyButton = document.getElementById('basic-copy-button');

  copyButton.addEventListener('click', async () => {
    const codeContent = document.getElementById('code-content');
    await navigator.clipboard.writeText(codeContent.textContent);
    copyButton.tooltipContent = 'Successfully copied to clipboard!';
    copyButton.exitDelay = 1500;
  });

  copyButton.addEventListener('tooltip-hidden', () => {
    copyButton.tooltipContent = 'Copy to clipboard';
    copyButton.exitDelay = 600;
  });
</script>
```

### Key Differences from React

| React Prop | Lit Equivalent | Notes |
|-----------|---------------|-------|
| `textId` | DROP | Not needed — use JS to get text |
| `onClick` | `click` event listener | Standard DOM event |
| `onTooltipHidden` | `tooltip-hidden` event | Custom event |
| `exitDelay` | `exit-delay` attribute | camelCase → kebab-case |
| `maxWidth` | `max-width` attribute | camelCase → kebab-case |
| `children` (text) | `tooltip-content` attribute | Text goes to tooltip, not slot |
| `variant` | `variant` attribute | Same |

## Slot Validation (CRITICAL)

Before using named slots on any component, **verify the slot exists** by reading the component's `.ts` source file. Look for `<slot name="...">` in the `render()` method.

```bash
# Check what slots a component defines
grep -n 'slot name=' elements/pfv6-{component}/pfv6-{component}.ts
```

- If the component only has `<slot></slot>` (default slot) — put content directly inside the element, do NOT use `slot="..."` attributes
- If the component defines `<slot name="icon">` — you may use `<span slot="icon">...</span>`
- **NEVER guess slot names** from React prop names (e.g., React `toggleContent` does NOT mean `slot="toggle-content"` exists)

```html
<!-- ❌ WRONG — these named slots don't exist on this component -->
<pfv6-expandable-section-toggle>
  <span slot="collapsed">Show more</span>
  <span slot="expanded">Show less</span>
</pfv6-expandable-section-toggle>

<!-- ✅ CORRECT — component has default slot only; use JS to swap text -->
<pfv6-expandable-section-toggle>Show more</pfv6-expandable-section-toggle>
```

## Event Wiring for Multi-Component State (CRITICAL)

React demos manage shared state via hooks (`useState`) and pass props down. In Lit demos, **you must wire events between sibling components manually** using JavaScript.

### When is Event Wiring Needed?

Any time a React demo uses **shared state between two or more components**:
- `useState` + passing the state variable as props to multiple components
- `onToggle`/`onChange` callbacks that update state consumed by sibling components
- Detached patterns (e.g., `ExpandableSectionToggle` + `ExpandableSection` with `isDetached`)

### Pattern: Wiring Sibling Components

```html
<pfv6-expandable-section is-detached id="section">
  <!-- expandable content -->
</pfv6-expandable-section>
<pfv6-expandable-section-toggle id="toggle">
  Show more
</pfv6-expandable-section-toggle>

<script type="module">
  const toggle = document.getElementById('toggle');
  const section = document.getElementById('section');

  // Wire toggle's event to section's state
  toggle.addEventListener('toggle', (e) => {
    toggle.isExpanded = e.isExpanded;
    section.isExpanded = e.isExpanded;
    toggle.textContent = e.isExpanded ? 'Show less' : 'Show more';
  });
</script>
```

### Checklist for React -> Lit Demo Conversion

When converting a React demo with state:
1. Identify ALL `useState` hooks and what components consume them
2. Identify ALL callback props (`onToggle`, `onChange`, `onSelect`, etc.)
3. For each callback: add an `addEventListener` that updates all consuming components
4. For text that changes based on state: update `textContent` in the event handler

## Blocked Demos

When orchestrator specifies blocked demos (unconverted dependencies), skip them entirely. Document skipped demos in output.

