# PatternFly v6 LitElement Component Conversion

This project converts PatternFly React v6 components to LitElement web components with 1:1 API and visual parity.

## When User Requests Component Conversion

When the user asks to convert a PatternFly React component (e.g., "Convert Checkbox component"), execute the following workflow **directly from the main conversation**. Each step delegates to a specialized subagent.

### Memory Efficiency (CRITICAL)

**The codebase contains 1,400+ .tsx files. Avoid memory issues:**

1. **NEVER use Glob/ListDir on `.cache/` directories** - these contain 1,400+ files
2. **Use grep/node for targeted lookups** instead of loading all files
3. **Target specific component paths** - always include component name in paths:
   - ✅ GOOD: `.cache/patternfly-react/.../components/Checkbox/...`
   - ❌ BAD: `.cache/patternfly-react/.../components/**/...` (matches all components)
4. **Trust conversion-order.yaml** - use grep/node to query it, don't parse manually

### Workflow Orchestration

**CRITICAL**: You MUST execute each phase in order. DO NOT skip any step.

Use TodoWrite to track progress through the workflow.

## Phase 1: Initial Setup & API Analysis

**MANDATORY**: Complete ALL steps before proceeding to Phase 2.

### Step 1: Check Component Type

**Check if component is a layout component** (CRITICAL FIRST STEP):

- Layout components: **Bullseye, Flex, Gallery, Grid, Level, Split, Stack**
- Component exclusions are defined in `.config/component-exclusions.json`
- Use `grep` to check if a component is excluded:
  ```bash
  grep -q "ComponentName" .config/component-exclusions.json && echo "excluded" || echo "not excluded"
  ```
- **DO NOT use Glob or ListDir tools to scan all components**

**IF LAYOUT COMPONENT**:
- **STOP** - Do not proceed with component creation
- **INFORM USER**: This is a layout component that uses PatternFly CSS classes
- **EXPLAIN**: Layout components are NOT converted to custom elements
- **DOCUMENT**: Create minimal README.md explaining:
  ```markdown
  # {ComponentName} Layout

  This is a PatternFly layout component that uses CSS classes, not custom elements.

  ## Usage

  Use the PatternFly CSS classes directly in your HTML:

  ```html
  <div class="pf-v6-l-{layout-name}">
    <!-- Your content -->
  </div>
  ```

  ## Why No Custom Element?

  Layout components work as standalone CSS classes and don't require React. Creating custom elements would add complexity without benefit, as we can't achieve true parity (e.g., can't implement the `component` prop to change element type).

  ## Documentation

  See PatternFly documentation: https://www.patternfly.org/layouts/{layout-name}
  ```
- **EXIT** - Layout components are not converted

**IF REGULAR COMPONENT**: Continue to Step 2.

### Step 2: Verify Cache Repositories

**Verify `.cache/` repositories exist**:
- Use simple directory checks (avoid Glob/ListDir on large directories):
  ```bash
  # Check directories exist
  ls -d .cache/patternfly-react/ .cache/patternfly/ > /dev/null 2>&1 && echo "✓ Caches exist"
  ```
- **DO NOT list all files in .cache/** - just verify directories exist
- If missing, inform user to run `npm run patternfly-cache`

## Phase 2: Component Implementation

### Step 3: DELEGATE to api-writer

**CRITICAL**: You MUST actually invoke the subagent. Do not skip this step.

**MANDATORY: Call the Task tool with these exact parameters**:
- Tool name: `Task`
- subagent_type: `'api-writer'`
- description: `'Create component files for pfv6-{component}'`
- prompt: `'Analyze the PatternFly React {component} component and create complete LitElement component files (main + sub-components) with full implementation.'`

**BLOCKING REQUIREMENT:**
You CANNOT proceed to the next step until you have received `<function_results>` from the Task tool.

Expected response includes:
- Confirmation that component files were written
- List of files created
- Component API summary (properties, events, slots)
- Form control status
- ElementInternals usage

### Step 4: IF FORM CONTROL DETECTED - DELEGATE to face-elements-writer

**Check api-writer output** for form control detection:
- If api-writer output includes "**Is Form Control**: YES"
- Then you MUST call face-elements-writer before proceeding

**MANDATORY: Call the Task tool with these exact parameters**:
- Tool name: `Task`
- subagent_type: `'face-elements-writer'`
- description: `'Add FACE patterns to pfv6-{component}'`
- prompt: `'Add Form-Associated Custom Element (FACE) patterns to pfv6-{component} component files including ElementInternals setup, form properties, and form callbacks.'`

**If form control NOT detected**, skip this step and proceed to Step 5.

### Step 5: DELEGATE to api-auditor

**MANDATORY: Call the Task tool with these exact parameters**:
- Tool name: `Task`
- subagent_type: `'api-auditor'`
- description: `'Audit pfv6-{component} API'`
- prompt: `'Validate the pfv6-{component} component API against Lit best practices, React parity, and project standards.'`

**BLOCKING REQUIREMENT:**
You CANNOT proceed to the next step until you have received `<function_results>` from the Task tool.

## Phase 3: Demo Creation

### Step 6: DELEGATE to demo-writer

**MANDATORY: Call the Task tool with these exact parameters**:
- Tool name: `Task`
- subagent_type: `'demo-writer'`
- description: `'Create demos for pfv6-{component}'`
- prompt: `'Create HTML demos for pfv6-{component} from PatternFly React examples with 1:1 parity.'`

**BLOCKING REQUIREMENT:**
You CANNOT proceed to the next step until you have received `<function_results>` from the Task tool.

Expected response includes:
- List of specific demo files created
- Demo count matches React example count (1:1 parity)

### Step 7: IF LAYOUT COMPONENTS DETECTED - DELEGATE to layout-translator

**Check demo-writer output** for layout component detection:
- If demo-writer output includes "### Layout Components Detected"
- Then you MUST call layout-translator before proceeding

**MANDATORY: Call the Task tool with these exact parameters**:
- Tool name: `Task`
- subagent_type: `'layout-translator'`
- description: `'Translate layout components in pfv6-{component} demos'`
- prompt: `'Translate all React layout components (Flex, Grid, Stack, etc.) in pfv6-{component} demo files to HTML with PatternFly layout CSS classes. Replace TODO placeholders with proper .pf-v6-l-* classes and responsive modifiers.'`

**If layout components NOT detected**, skip this step and proceed to Step 8.

### Step 8: IF STYLING COMPONENTS DETECTED - DELEGATE to style-components

**Check demo-writer output** for styling component detection:
- If demo-writer output includes "### Styling Components Detected"
- Then you MUST call style-components before proceeding

**MANDATORY: Call the Task tool with these exact parameters**:
- Tool name: `Task`
- subagent_type: `'style-components'`
- description: `'Translate styling components in pfv6-{component} demos'`
- prompt: `'Translate all React styling components (Content, Title, Form, DescriptionList) in pfv6-{component} demo files to semantic HTML with PatternFly CSS classes. Replace TODO placeholders with proper semantic elements and .pf-v6-c-* classes.'`

**If styling components NOT detected**, skip this step and proceed to Step 9.

## Phase 4: Demo Validation

### Step 9: DELEGATE to demo-auditor

**MANDATORY: Call the Task tool with these exact parameters**:
- Tool name: `Task`
- subagent_type: `'demo-auditor'`
- description: `'Audit pfv6-{component} demos'`
- prompt: `'Validate pfv6-{component} demos for 1:1 parity with PatternFly React examples.'`

**BLOCKING REQUIREMENT:**
You CANNOT proceed to the next step until you have received `<function_results>` from the Task tool.

## Phase 5: CSS Translation & Validation

### Step 10: DELEGATE to css-writer

**MANDATORY: Call the Task tool with these exact parameters**:
- Tool name: `Task`
- subagent_type: `'css-writer'`
- description: `'Create CSS for pfv6-{component}'`
- prompt: `'Translate PatternFly React CSS to LitElement Shadow DOM CSS for pfv6-{component} with token-derived fallback values.'`

**BLOCKING REQUIREMENT:**
You CANNOT proceed to the next step until you have received `<function_results>` from the Task tool.

Expected response includes:
- List of specific CSS files created
- Confirmation that CSS includes token-derived fallback values

### Step 11: DELEGATE to css-auditor

**MANDATORY: Call the Task tool with these exact parameters**:
- Tool name: `Task`
- subagent_type: `'css-auditor'`
- description: `'Audit pfv6-{component} CSS'`
- prompt: `'Validate all CSS files for pfv6-{component} against PatternFly React source and identify all violations.'`

**BLOCKING REQUIREMENT:**
You CANNOT proceed to the next step until you have received `<function_results>` from the Task tool.

**If issues found**: You MUST fix ALL of them before proceeding.

### Step 12: Run stylelint

**After css-auditor completes**, run stylelint to validate CSS syntax:

```bash
npx stylelint elements/pfv6-{component}/pfv6-{component}.css
```

**If errors found**: Fix all stylelint violations before proceeding.

## Phase 6: Accessibility Validation

### Step 13a: DELEGATE to aria-auditor (ALWAYS)

**CRITICAL**: You MUST invoke aria-auditor for EVERY component.

**MANDATORY: Call the Task tool with these exact parameters**:
- Tool name: `Task`
- subagent_type: `'aria-auditor'`
- description: `'Audit pfv6-{component} ARIA patterns'`
- prompt: `'Validate pfv6-{component} ARIA usage including property naming, IDREF attributes, React parity, and redundant roles in demos.'`

**BLOCKING REQUIREMENT:**
You CANNOT proceed until you have received `<function_results>` from the Task tool.

**Save to memory**: Store failures, cleanup actions, warnings from aria-auditor output.

### Step 13b: CHECK for ElementInternals Pattern

**Detect ElementInternals usage**:

```bash
grep -qE "private internals: ElementInternals|#internals: ElementInternals" \
  elements/pfv6-{component}/pfv6-{component}.ts
```

**If found**: Proceed to Step 13c
**If NOT found**: Skip to Step 13d

### Step 13c: DELEGATE to element-internals-auditor (CONDITIONAL)

**Only invoke if Step 13b detected ElementInternals.**

**MANDATORY: Call the Task tool with these exact parameters**:
- Tool name: `Task`
- subagent_type: `'element-internals-auditor'`
- description: `'Audit pfv6-{component} ElementInternals usage'`
- prompt: `'Validate pfv6-{component} ElementInternals usage for host-level ARIA, duplicative semantics, and shadow DOM patterns.'`

**BLOCKING REQUIREMENT:**
You CANNOT proceed until you have received `<function_results>` from the Task tool.

**Save to memory**: Store failures, cleanup actions, warnings from element-internals-auditor output.

### Step 13d: CHECK for FACE Pattern

**Detect FACE usage**:

```bash
grep -q "static formAssociated = true" \
  elements/pfv6-{component}/pfv6-{component}.ts
```

**If found**: Proceed to Step 13e
**If NOT found**: Skip to Step 13f

### Step 13e: DELEGATE to face-elements-auditor (CONDITIONAL)

**Only invoke if Step 13d detected FACE pattern.**

**MANDATORY: Call the Task tool with these exact parameters**:
- Tool name: `Task`
- subagent_type: `'face-elements-auditor'`
- description: `'Audit pfv6-{component} FACE implementation'`
- prompt: `'Validate pfv6-{component} Form-Associated Custom Element implementation including form callbacks, properties, and value synchronization.'`

**BLOCKING REQUIREMENT:**
You CANNOT proceed until you have received `<function_results>` from the Task tool.

**Save to memory**: Store failures, cleanup actions, warnings from face-elements-auditor output.

### Step 13f: Aggregate Accessibility Results

**Orchestrator aggregates results from all completed audits**:

1. Collect all failures from each auditor's output (stored in memory)
2. Collect all cleanup actions from each auditor's output
3. Collect all warnings from each auditor's output
4. Determine overall status:
   - ✅ PASS: Zero failures across all auditors
   - ❌ FAIL: One or more failures from any auditor

**Present aggregated report**:

```
## Accessibility Validation: pfv6-{component}

**Audits Performed**:
- ✅ ARIA patterns (aria-auditor)
- [✅/➖] ElementInternals usage (element-internals-auditor) [if applicable]
- [✅/➖] FACE implementation (face-elements-auditor) [if applicable]

---

### Part 1: ARIA Validation

[Summarize key findings from aria-auditor]

**Failures**: [count]
**Cleanup Actions**: [count]
**Warnings**: [count]

---

### Part 2: ElementInternals Validation

[If applicable, summarize key findings from element-internals-auditor]

**Failures**: [count]
**Cleanup Actions**: [count]
**Warnings**: [count]

---

### Part 3: FACE Validation

[If applicable, summarize key findings from face-elements-auditor]

**Failures**: [count]
**Cleanup Actions**: [count]
**Warnings**: [count]

---

## Overall Summary

**Status**: ✅ PASS / ❌ FAIL

**Total Failures**: [X]
1. [All failures from all auditors]

**Total Cleanup Actions**: [Y]
1. [All cleanup actions from all auditors]

**Total Warnings**: [Z]
1. [All warnings from all auditors]

**Next Steps**:
- [If PASS] Proceeding to test creation (Step 14)
- [If FAIL] ❌ MUST fix all [X] failures before proceeding
```

**BLOCKING REQUIREMENT:**
If status is FAIL, you CANNOT proceed to Step 14 until ALL failures are fixed.

## Phase 7: Create Tests

### Step 14: DELEGATE to test-spec-writer

**MANDATORY: Call the Task tool with these exact parameters**:
- Tool name: `Task`
- subagent_type: `'test-spec-writer'`
- description: `'Create unit tests for pfv6-{component}'`
- prompt: `'Create comprehensive unit tests for pfv6-{component} validating API parity with PatternFly React.'`

**BLOCKING REQUIREMENT:**
You CANNOT proceed to the next step until you have received `<function_results>` from the Task tool.

### Step 15: DELEGATE to test-visual-writer

**MANDATORY: Call the Task tool with these exact parameters**:
- Tool name: `Task`
- subagent_type: `'test-visual-writer'`
- description: `'Create visual tests for pfv6-{component}'`
- prompt: `'Create visual regression tests for pfv6-{component} that validate pixel-perfect parity with PatternFly React.'`

**BLOCKING REQUIREMENT:**
You CANNOT proceed to the next step until you have received `<function_results>` from the Task tool.

### Step 16: DELEGATE to test-css-api-writer

**MANDATORY: Call the Task tool with these exact parameters**:
- Tool name: `Task`
- subagent_type: `'test-css-api-writer'`
- description: `'Create CSS API tests for pfv6-{component}'`
- prompt: `'Create CSS API tests for pfv6-{component} that validate all CSS custom properties can be overridden.'`

**BLOCKING REQUIREMENT:**
You CANNOT proceed to the next step until you have received `<function_results>` from the Task tool.

## Phase 8: Test Analysis

### Step 17: Ask User to Run Tests (RECOMMENDED)

```
Tests have been created. Please run:

# Unit tests
npm test -- elements/pfv6-{component}/test/pfv6-{component}.spec.ts

# Visual parity tests
npm run e2e:parity -- pfv6-{component}.visual.ts

# CSS API tests
npm run e2e:parity -- pfv6-{component}.css-api.ts

Once complete, I can analyze any failures.
```

**REASON**: Test commands start dev servers and can hang. User running tests manually avoids blocking issues.

### Step 18: IF FAILURES OCCUR - DELEGATE to test-runner

**MANDATORY: Call the Task tool with these exact parameters**:
- Tool name: `Task`
- subagent_type: `'test-runner'`
- description: `'Analyze test failures for pfv6-{component}'`
- prompt: `'Analyze test failures for pfv6-{component} and categorize as fixable vs blocked by dependencies.'`

**BLOCKING REQUIREMENT:**
You CANNOT proceed until you have received `<function_results>` from the Task tool.

- Pass component name and test output in the prompt
- **WAIT** for analysis and fix recommendations in function_results
- **FIX** all issues identified as fixable

## Success Criteria (All Must Pass)

**Delegation Requirements:**
- [ ] **api-writer invoked** - Component API design received and verified
- [ ] **face-elements-writer invoked** (if form control) - FACE patterns added
- [ ] **api-auditor invoked** - Component API validated
- [ ] **demo-writer invoked** - Demo files created
- [ ] **layout-translator invoked** (if layout components detected) - Layouts translated
- [ ] **style-components invoked** (if styling components detected) - Styling translated
- [ ] **demo-auditor invoked** - Demo parity validated
- [ ] **css-writer invoked** - CSS files created
- [ ] **css-auditor invoked** - CSS validated
- [ ] **stylelint passed** - No CSS syntax errors
- [ ] **aria-auditor invoked** - ARIA patterns validated
- [ ] **element-internals-auditor invoked** (if applicable) - ElementInternals validated
- [ ] **face-elements-auditor invoked** (if applicable) - FACE validated
- [ ] **test-spec-writer invoked** - Unit tests created
- [ ] **test-visual-writer invoked** - Visual tests created
- [ ] **test-css-api-writer invoked** - CSS API tests created

**Component Quality:**
- [ ] `.cache/` repositories verified
- [ ] Component has ZERO dependencies OR all dependencies exist as pfv6-* components
- [ ] Component API matches api-writer specification exactly
- [ ] Component API passes api-auditor validation
- [ ] Template structure follows api-writer patterns (id vs class, classMap, etc.)
- [ ] **If form control**: FACE patterns implemented correctly
  - [ ] `static formAssociated = true` present
  - [ ] Form properties (name, value, disabled, required) implemented
  - [ ] Form callbacks (formResetCallback, formDisabledCallback) implemented
  - [ ] `setFormValue()` called in updated() lifecycle
  - [ ] Validated by face-elements-auditor (Step 13e)
- [ ] CSS variables match React CSS source (not made up)
- [ ] CSS fallback values derived from PatternFly token source (NEVER guessed)
- [ ] Box-sizing reset in ALL CSS files
- [ ] **All CSS features are Baseline 2024 or earlier (no exceptions)**
- [ ] NO `index.ts` export files created
- [ ] Demos created from React (verified by demo-writer)
- [ ] Demos match React 1:1 (verified by demo-auditor)
- [ ] Accessibility validated (verified by aria-auditor, element-internals-auditor, face-elements-auditor)
- [ ] CSS audit passed (verified by css-auditor)
- [ ] Tests comprehensive (verified by test-spec-writer)
- [ ] Code passes linters

## Quality Bar

Place the Lit component next to React - they should be visually and functionally indistinguishable.

## Important Notes

- **Use TodoWrite** to track progress through the workflow
- **Each subagent runs in isolation** - main conversation manages the overall flow
- **Wait for function_results** before proceeding to next step
- **Fix all issues** before moving to the next phase
- **Never skip steps** - the order is critical for quality

## Development Commands

```bash
# Verify setup
npm run patternfly-cache
ls -la .cache/patternfly-react/
ls -la .cache/patternfly/

# Development
npm run dev

# Testing
npm run test                    # Unit tests
npm run e2e:parity             # Visual parity tests
npm run lint                   # Code quality
```
