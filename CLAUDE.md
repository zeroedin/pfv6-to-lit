# PatternFly v6 LitElement Component Conversion

This project converts PatternFly React v6 components to LitElement web components with 1:1 API and visual parity.

## When User Requests Component Conversion

When the user asks to convert a PatternFly React component (e.g., "Convert Checkbox component"), execute the following workflow **directly from the main conversation**. Each step delegates to a specialized subagent.

### Memory Efficiency (CRITICAL)

**The codebase contains 1,400+ .tsx files. Delegate searches to the `targeted-search` subagent.**

**For any codebase search task**, use the Task tool with `subagent_type: 'targeted-search'`:
- Finding patterns, text, or code across multiple files
- Locating components, functions, or imports
- Querying `.cache/` directories (1,400+ files)
- Searching `conversion-order.yaml` or other structured data

The `targeted-search` agent uses memory-efficient strategies (grep, node, ripgrep) instead of loading files into memory.

**Quick reference for simple lookups** (when not delegating):
- ✅ GOOD: Target specific component paths with component name
- ❌ BAD: Never use Glob/ListDir on `.cache/` directories

### Workflow Orchestration

**CRITICAL**: You MUST execute each phase in order. DO NOT skip any step.

Use TodoWrite to track progress through the workflow.

### Parallelization Strategy

**CRITICAL**: Maximize throughput by launching independent agents in parallel using a **single message with multiple Task tool calls**.

After api-writer completes (+ face-elements-writer if needed), the entire remaining workflow executes in just **2 rounds**:

```
                    ┌─► api-auditor          (needs .ts files only)
                    ├─► demo-writer          (needs .ts files only)
api-writer ─── R1 ─┼─► css-writer           (needs .ts files only)
                    ├─► jsdoc                (needs .ts files only)
                    └─► test-spec-writer     (needs .ts files only)

                    fix issues + eslint

                    ┌─► demo-auditor         (needs demos from R1)
                    ├─► css-auditor          (needs CSS from R1)
           ─── R2 ─┼─► accessibility-auditor (needs .ts + demos from R1)
                    ├─► test-visual-writer   (needs demos from R1)
                    └─► test-css-api-writer  (needs CSS from R1)

                    fix issues + stylelint
                    DONE
```

**Rules:**
- Launch ALL Round 1 agents in the **same message** (single response with 5 Task tool calls)
- After Round 1 completes, fix any issues + eslint, then launch ALL Round 2 agents in parallel
- After Round 2 completes, fix any issues + stylelint
- **Never serialize agents that have no data dependency between them**
- **Only 2 agent round-trips** — every agent runs in the earliest possible round

### Data Flow Between Agents

Subagents run in isolation and don't share state. All context must flow through the orchestrator via prompts.

When the `find` agent outputs component information, **extract and store** the following data for use in later steps:

```
┌─────────────┐     structured output      ┌──────────────┐
│  find agent │ ─────────────────────────► │ Orchestrator │
└─────────────┘  "blockedDemos: [...]"     └──────┬───────┘
                                                  │
                                    passes blocked info in prompt
                                                  │
                                                  ▼
                                          ┌─────────────────┐
                                          │  demo-writer    │
                                          │ "Skip: [...]"   │
                                          └─────────────────┘
```

**Parsing Find Agent Output:**

The find agent outputs a `## Machine-Parseable Data` section with JSON:

```json
{
  "component": "ComponentName",
  "taskType": "partial",
  "readyDemos": ["Demo1.tsx", "Demo2.tsx"],
  "blockedDemos": ["Demo3.tsx"],
  "blockedDemoDetails": [{"file": "Demo3.tsx", "blockedBy": ["Dropdown"]}]
}
```

**Store in memory** for use in Step 6:
- `readyDemos` - demos that should be created
- `blockedDemos` - demo filenames to SKIP
- `blockedDemoDetails` - which components are blocking each demo

### Displaying Progress Overview (After Find Agent)

**After the find agent completes**, display accurate component progress:

```bash
npx tsx scripts/component-progress.ts
```

This shows **component count** (not task count). The `tasks.json` includes separate "demo" tasks for blocked demos that become unblocked later - these should NOT be counted as separate components.

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
- If missing, inform user to run `npm run cache`

## Phase 2: Component Creation (Sequential)

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

**If form control NOT detected**, skip this step and proceed to Round 1.

## Phase 3: Round 1 — 5-Way Parallel (LAUNCH ALL IN ONE MESSAGE)

**CRITICAL**: After api-writer completes (and face-elements-writer if needed), launch ALL FIVE agents in a **single message with 5 Task tool calls**. All 5 only need the `.ts` files created by api-writer.

### 1. api-auditor

- subagent_type: `'api-auditor'`
- description: `'Audit pfv6-{component} code quality'`
- prompt: `'Validate pfv6-{component} across all 6 dimensions: BEM classes, import patterns, property decorators, template patterns, ElementInternals usage, and lifecycle/event patterns.'`

### 2. demo-writer

- subagent_type: `'demo-writer'`
- description: `'Create demos for pfv6-{component}'`
- prompt: Include blocked demo info from find agent (see "Data Flow Between Agents")

**Prompt construction:**

```
Create HTML demos for pfv6-{component} from PatternFly React examples with 1:1 parity.

[If blockedDemos is NOT empty, append:]

**IMPORTANT - SKIP BLOCKED DEMOS:**
The following demos are blocked by unconverted dependencies and must be SKIPPED:
- {file} (blocked by: {blockers})

Only create demos for these files:
- {readyDemo1}
- {readyDemo2}
```

Layout and styling components (Flex, Grid, Stack, Content, Title, Form, DescriptionList) are translated inline by demo-writer via skills.

### 3. css-writer

- subagent_type: `'css-writer'`
- description: `'Create CSS for pfv6-{component}'`
- prompt: `'Translate PatternFly React CSS to LitElement Shadow DOM CSS for pfv6-{component} with token-derived fallback values.'`

### 4. jsdoc

- subagent_type: `'jsdoc'`
- description: `'Write and validate JSDoc for pfv6-{component}'`
- prompt: `'Generate and validate complete JSDoc documentation for pfv6-{component} including @cssprop, @csspart, @slot, @fires, @alias, and @summary annotations.'`

### 5. test-spec-writer

- subagent_type: `'test-spec-writer'`
- description: `'Create unit tests for pfv6-{component}'`
- prompt: `'Create comprehensive unit tests for pfv6-{component} validating API parity with PatternFly React.'`

### After Round 1 Completes

**Wait for ALL 5 agents to return results.** Then:

1. **Fix any api-auditor CRITICAL issues**
2. **Fix any jsdoc issues**
3. **Run eslint** on component TypeScript:
   ```bash
   npx eslint elements/pfv6-{component}/**/*.ts
   ```
   Fix all eslint violations.

## Phase 4: Round 2 — 5-Way Parallel (LAUNCH ALL IN ONE MESSAGE)

**After Round 1 issues are fixed**, launch ALL FIVE validators/writers in a **single message with 5 Task tool calls**. All 5 need demos and/or CSS created in Round 1.

### 1. demo-auditor

- subagent_type: `'demo-auditor'`
- description: `'Audit pfv6-{component} demos'`
- prompt: `'Validate pfv6-{component} demos for 1:1 parity with PatternFly React examples.'`

### 2. css-auditor

- subagent_type: `'css-auditor'`
- description: `'Audit pfv6-{component} CSS'`
- prompt: `'Validate all CSS files for pfv6-{component} against PatternFly React source and identify all violations.'`

### 3. accessibility-auditor

- subagent_type: `'accessibility-auditor'`
- description: `'Audit pfv6-{component} accessibility'`
- prompt: `'Validate pfv6-{component} ARIA usage, ElementInternals patterns, and FACE implementation (if applicable). Check property naming, IDREF attributes, React parity, redundant roles in demos, and form control patterns.'`

The accessibility-auditor handles all 3 validation dimensions:
- **Section 1 (ARIA)**: Always runs — property naming, IDREFs, React parity, demo cleanup
- **Section 2 (ElementInternals)**: Runs if `attachInternals()` detected
- **Section 3 (FACE)**: Runs if `static formAssociated = true` detected

### 4. test-visual-writer

- subagent_type: `'test-visual-writer'`
- description: `'Create visual tests for pfv6-{component}'`
- prompt: `'Create visual regression tests for pfv6-{component} that validate pixel-perfect parity with PatternFly React.'`

### 5. test-css-api-writer

- subagent_type: `'test-css-api-writer'`
- description: `'Create CSS API tests for pfv6-{component}'`
- prompt: `'Create CSS API tests for pfv6-{component} that validate all CSS custom properties can be overridden.'`

### After Round 2 Completes

**Wait for ALL 5 agents to return results.** Then:

1. **Fix any demo-auditor issues** (hallucinated APIs, parity gaps)
2. **Fix any css-auditor CRITICAL issues** (nesting, variables, selectors)
3. **Fix any accessibility-auditor issues**
4. **Run stylelint** on all component CSS:
   ```bash
   npx stylelint elements/pfv6-{component}/*.css
   ```
   Fix all stylelint violations. If max-line-length errors are found, fix them by breaking the line at the appropriate place. Look at existing css files for examples. Do not attempt to use `stylelint --fix` to fix these errors, it will undo your changes.

#### Handle Rule 3 Warnings (ARIA Pattern Decision)

If accessibility-auditor output contains `### ⚠️ Rule 3 Warning: ARIA Pattern Review Needed`:

1. **Parse the structured output** - extract the machine-parseable JSON
2. **Present options to user** using AskUserQuestion:

```
Use AskUserQuestion with:
- question: "ARIA is on internal shadow DOM elements. How should we handle this?"
- header: "ARIA Pattern"
- options:
  - label: "Option A: Refactor to ElementInternals (Recommended)"
    description: "Move ARIA to :host via ElementInternals. Best for single-widget components."
  - label: "Option B: Keep Internal ARIA"
    description: "Keep current pattern. Valid for composite widgets with multiple children."
  - label: "Option C: Request Expert Review"
    description: "Flag for accessibility expert review before proceeding."
```

3. **Act on user's decision**:
   - **Option A**: Refactor component to use ElementInternals pattern
   - **Option B**: Add JSDoc comment documenting why internal ARIA is used
   - **Option C**: Mark as blocked, skip to next component

**If FAIL**: You CANNOT proceed until ALL failures are fixed.
**If PENDING** (Rule 3 Option C): Component blocked for expert review. Skip to next component.

## Phase 5: Test Analysis

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

## Phase 6: Final Validation

### Step 19: Run All Tests and Verify Passing

**After creating all tests (Steps 14-16)**, ask the user to run the complete test suite and verify all tests pass:

```
All tests have been created for pfv6-{component}. Please run the following test suite:

# Unit tests
npm test -- elements/pfv6-{component}/test/pfv6-{component}.spec.ts

# Visual parity tests
npm run e2e:parity -- pfv6-{component}.visual.ts

# CSS API tests
npm run e2e:parity -- pfv6-{component}.css-api.ts

Once all tests pass, the component conversion is complete!
```

**Completion Criteria (ALL must be true):**
- ✅ All subagents have run successfully
- ✅ All linters pass (eslint, stylelint)
- ✅ All audits pass (api-auditor, demo-auditor, css-auditor, accessibility-auditor)
- ✅ Component files are created (`elements/pfv6-{component}/` exists)
- ✅ Demos are created and validated
- ✅ CSS is created and validated
- ✅ **All tests pass (unit, visual parity, CSS API)**

**Conversion Tracking:**

The dependency tracking files (`component-dependencies.yaml` and `conversion-order.yaml`) are **gitignored and auto-generated** from the filesystem. When the find agent runs next, it will:
1. Execute `npm run deps:order` to regenerate tracking files
2. Auto-detect `elements/pfv6-{component}/` exists → mark as completed
3. Recommend the next unconverted component

**No manual tracking needed** - just ensure all tests pass and the component files exist.

## Success Criteria (All Must Pass)

**Delegation Requirements:**
- [ ] **api-writer invoked** - Component API design received and verified
- [ ] **face-elements-writer invoked** (if form control) - FACE patterns added
- [ ] **api-auditor invoked** - All 6 code quality dimensions validated (BEM, imports, properties, templates, ElementInternals, lifecycle)
- [ ] **eslint passed** - No TypeScript code quality errors
- [ ] **demo-writer invoked** - Demo files created (includes layout/styling translation via skills)
- [ ] **demo-auditor invoked** - Demo parity validated
- [ ] **css-writer invoked** - CSS files created
- [ ] **css-auditor invoked** - CSS validated
- [ ] **stylelint passed** - No CSS syntax errors
- [ ] **jsdoc invoked** - JSDoc documentation written and validated
- [ ] **accessibility-auditor invoked** - ARIA, ElementInternals, and FACE patterns validated
- [ ] **test-spec-writer invoked** - Unit tests created
- [ ] **test-visual-writer invoked** - Visual tests created
- [ ] **test-css-api-writer invoked** - CSS API tests created

**Component Quality:**
- [ ] `.cache/` repositories verified
- [ ] Component has ZERO dependencies OR all dependencies exist as pfv6-* components
- [ ] Component API matches api-writer specification exactly
- [ ] Component API passes all api-auditor validations (6 validation sections)
- [ ] Template structure follows api-writer patterns (id vs class, classMap, etc.)
- [ ] **If form control**: FACE patterns implemented correctly
  - [ ] `static formAssociated = true` present
  - [ ] Form properties (name, value, disabled, required) implemented
  - [ ] Form callbacks (formResetCallback, formDisabledCallback) implemented
  - [ ] `setFormValue()` called in updated() lifecycle
  - [ ] Validated by accessibility-auditor (Step 13, Section 3)
- [ ] CSS variables match React CSS source (not made up)
- [ ] CSS fallback values derived from PatternFly token source (NEVER guessed)
- [ ] Box-sizing reset in ALL CSS files
- [ ] **All CSS features are Baseline 2024 or earlier (no exceptions)**
- [ ] NO `index.ts` export files created
- [ ] Demos created from React (verified by demo-writer)
- [ ] Demos match React 1:1 (verified by demo-auditor)
- [ ] Accessibility validated (verified by accessibility-auditor)
- [ ] CSS audit passed (verified by css-auditor)
- [ ] JSDoc documentation complete (verified by jsdoc agent)
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
npm run cache
ls -la .cache/patternfly-react/
ls -la .cache/patternfly/

# Development
npm run dev

# Testing
npm run test                    # Unit tests
npm run e2e:parity             # Visual parity tests
npm run lint                   # Code quality
```
