---
name: pfe-core-utilities
description: Reference for @patternfly/pfe-core controllers, decorators, and functions used in pfe-v6 components. Use when importing or using InternalsController, SlotController, RovingTabindexController, or pfe-core decorators and functions.
---

# pfe-core Utilities

Import from `@patternfly/pfe-core`.

## Controllers

| Controller | Use Case | Import Path |
|------------|----------|-------------|
| `InternalsController` | ElementInternals, ARIA, form association | `@patternfly/pfe-core/controllers/internals-controller.js` |
| `SlotController` | Slot content detection and management | `@patternfly/pfe-core/controllers/slot-controller.js` |
| `RovingTabindexController` | Keyboard navigation in groups | `@patternfly/pfe-core/controllers/roving-tabindex-controller.js` |
| `Logger` | Development logging | `@patternfly/pfe-core/controllers/logger.js` |

### InternalsController Example

```typescript
#internals = InternalsController.of(this, { role: 'button' });
```

### SlotController Example

```typescript
#slots = new SlotController(this, null, 'icon', 'suffix');

// Check if a slot has content
if (this.#slots.hasSlotted('icon')) { ... }
```

## Decorators

| Decorator | Purpose | Import Path |
|-----------|---------|-------------|
| `@observed` | Watch property changes | `@patternfly/pfe-core/decorators/observed.js` |
| `@observes('prop')` | React to specific property changes | `@patternfly/pfe-core/decorators/observes.js` |
| `@bound` | Bind method to instance | `@patternfly/pfe-core/decorators/bound.js` |

## Functions

| Function | Purpose | Import Path |
|----------|---------|-------------|
| `getRandomId(prefix)` | Generate unique IDs | `@patternfly/pfe-core/functions/random.js` |
| `debounce(fn, delay)` | Debounce function calls | `@patternfly/pfe-core/functions/debounce.js` |

