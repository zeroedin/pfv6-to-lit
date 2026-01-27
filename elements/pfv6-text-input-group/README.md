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

Unlike React, the Lit component has integrated combobox/autocomplete via `ComboboxController`:

```html
<pfv6-text-input-group>
  <pfv6-text-input-group-main placeholder="Search...">
    <my-option slot="options" value="Option 1">Option 1</my-option>
    <my-option slot="options" value="Option 2">Option 2</my-option>
  </pfv6-text-input-group-main>
</pfv6-text-input-group>
```

Option elements must implement:
- `value: string` — the form value
- `selected: boolean` — whether selected
- `active: boolean` — whether keyboard-focused

Events:
- `open` — listbox opened
- `close` — listbox closed

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
