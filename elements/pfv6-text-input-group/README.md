# pfv6-text-input-group

LitElement implementation of PatternFly's TextInputGroup component.

## API Differences from React

### pfv6-text-input-group (TextInputGroup)

| React Prop | Lit Equivalent | Notes |
|------------|----------------|-------|
| `isDisabled` | `is-disabled` | Kebab-case attribute |
| `isPlain` | `is-plain` | Kebab-case attribute |
| `validated` | `validated` | Same values: `success`, `warning`, `error` |
| `className` | — | Use CSS custom properties or `::part()` |
| `innerRef` | — | Use `querySelector()` or refs in Lit consumer |

### pfv6-text-input-group-main (TextInputGroupMain)

| React Prop | Lit Equivalent | Notes |
|------------|----------------|-------|
| `icon` | `<slot name="icon">` | Slot instead of prop |
| `type` | `type` | Same |
| `hint` | `hint` | Same |
| `value` | `value` | Lit accepts `string` only (React accepts `string \| number`) |
| `placeholder` | `placeholder` | Same |
| `name` | `name` | Same |
| `aria-label` | `accessible-label` | Different attribute name |
| `onChange` | `change` event | Event with `value` and `originalEvent` properties |
| `onFocus` | `focus` event | Standard FocusEvent |
| `onBlur` | `blur` event | Standard FocusEvent |
| `role` | — | Automatically set by ComboboxController when options present |
| `aria-activedescendant` | — | Automatically managed by ComboboxController |
| `aria-controls` | — | Automatically managed by ComboboxController |
| `isExpanded` | `expanded` | Property name differs; auto-managed with options |
| `inputId` | — | Use `id` on the component itself |
| `inputProps` | — | Not applicable; set properties directly |
| `innerRef` | — | Use `querySelector()` or refs |
| `className` | — | Use CSS custom properties or `::part()` |

### pfv6-text-input-group-utilities (TextInputGroupUtilities)

| React Prop | Lit Equivalent | Notes |
|------------|----------------|-------|
| `children` | `<slot>` | Default slot |
| `className` | — | Use CSS custom properties or `::part()` |

### pfv6-text-input-group-icon (TextInputGroupIcon)

| React Prop | Lit Equivalent | Notes |
|------------|----------------|-------|
| `isStatus` | `is-status` | Kebab-case attribute |
| `children` | `<slot>` | Default slot |
| `className` | — | Use CSS custom properties or `::part()` |

## Additional Lit Features

### Form Association

`pfv6-text-input-group-main` is a form-associated custom element:

```html
<form>
  <pfv6-text-input-group>
    <pfv6-text-input-group-main name="search" value="initial"></pfv6-text-input-group-main>
  </pfv6-text-input-group>
  <button type="reset">Reset</button>
</form>
```

- Participates in form submission via `name` and `value`
- Responds to form reset
- Respects form `disabled` state

### Built-in Combobox Support

Unlike React (which composes autocomplete using separate `Menu`/`Popper` components), the Lit component has integrated combobox/autocomplete via `ComboboxController`:

```html
<pfv6-text-input-group>
  <pfv6-text-input-group-main placeholder="Search...">
    <pfv6-select-option slot="options" value="Option 1">Option 1</pfv6-select-option>
    <pfv6-select-option slot="options" value="Option 2">Option 2</pfv6-select-option>
  </pfv6-text-input-group-main>
</pfv6-text-input-group>
```

> **Note:** The combobox functionality requires `pfv6-select-option` (from the Select component) to be converted. Until then, you must provide a custom element that implements the required interface below.

#### Option Element Interface

Option elements slotted into `slot="options"` must implement these DOM properties (not just attributes):

| Property | Type | Description |
|----------|------|-------------|
| `value` | `string` | The form value for this option |
| `selected` | `boolean` | Whether the option is currently selected |
| `active` | `boolean` | Whether the option is keyboard-focused (active descendant) |

Plain HTML elements like `<div value="...">` will not work because `value` is an attribute, not a DOM property. Use `pfv6-select-option` or a custom element.

#### Combobox Events

| Event | Description |
|-------|-------------|
| `open` | Listbox opened |
| `close` | Listbox closed |

#### Combobox Features

The component handles:
- Keyboard navigation (Arrow keys, Enter, Escape)
- ARIA attributes (`role="combobox"`, `aria-expanded`, `aria-activedescendant`)
- Cross-root ARIA with fallback cloning for browsers without `ariaActiveDescendantElement`

### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `change` | `{ value: string, originalEvent: Event }` | Input value changed |
| `focus` | — | Input focused |
| `blur` | — | Input blurred |
| `open` | — | Listbox opened (combobox mode) |
| `close` | — | Listbox closed (combobox mode) |
