# Radio Component

## API Differences from React

### HTML-Specified Attributes

**The following properties use HTML spec names instead of React's naming:**

#### `disabled` (not `isDisabled`)

- **React**: Uses `isDisabled` prop (boolean)
- **Lit**: Uses `disabled` property (boolean, HTML spec)
- **Implementation**: `@property({ type: Boolean, reflect: true })`
- **Why**:
  - Form-associated custom elements must follow HTML spec for standard attributes
  - The browser manages `disabled` state via `formDisabledCallback`
  - Uses actual Boolean type (not string enum) for proper HTML boolean attribute behavior
  - The `disabled` attribute is reflected to the host element (standard FACE pattern)
- **Usage**: Same behavior, different name
  ```html
  <!-- React -->
  <Radio isDisabled />

  <!-- Lit (HTML boolean attribute syntax) -->
  <pfv6-radio disabled></pfv6-radio>

  <!-- JavaScript -->
  <script>
    radio.disabled = true;  // Boolean value
  </script>
  ```

#### `checked` (not `isChecked`)

- **React**: Uses both `checked` and `isChecked` props (aliases, boolean)
- **Lit**: Uses `checked` property (boolean, HTML spec)
- **Implementation**: `@property({ type: Boolean, reflect: true })`
- **Why**:
  - Follows standard HTML form control naming
  - Uses actual Boolean type (not string enum) for proper HTML boolean attribute behavior
  - The `checked` attribute is reflected to the host element (standard FACE pattern)
- **Usage**:
  ```html
  <!-- React -->
  <Radio isChecked />

  <!-- Lit (HTML boolean attribute syntax) -->
  <pfv6-radio checked></pfv6-radio>

  <!-- JavaScript -->
  <script>
    radio.checked = true;  // Boolean value
  </script>
  ```

### `component` prop

**Not implemented**

- **React behavior**: Changes the wrapper element type (e.g., `<Radio component="li">` renders a `<li>` wrapper)
- **Why not in Lit**: The wrapper element is determined automatically based on `is-label-wrapped` attribute:
  - `is-label-wrapped="false"` (default): Renders `<div>` wrapper
  - `is-label-wrapped="true"`: Renders `<label>` wrapper
- **Alternative**: If you need different wrapper semantics (e.g., for lists), wrap the component:
  ```html
  <ul>
    <li><pfv6-radio name="group1" id="radio1" label="Option 1"></pfv6-radio></li>
    <li><pfv6-radio name="group1" id="radio2" label="Option 2"></pfv6-radio></li>
  </ul>
  ```

### `inputClassName` prop

**Not implemented**

- **React behavior**: Adds additional CSS classes to the internal `<input>` element
- **Why not in Lit**: Shadow DOM encapsulation prevents external styles from targeting internal elements
- **Alternative**: Use CSS custom properties to style the input:
  ```css
  pfv6-radio {
    --pf-v6-c-radio__input--BackgroundColor: white;
    --pf-v6-c-radio__input--BorderColor: var(--pf-v6-global--BorderColor--100);
  }
  ```
  See component CSS for available custom properties.
