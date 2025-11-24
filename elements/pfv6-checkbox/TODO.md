# pfv6-checkbox TODO

**Last Updated**: November 24, 2025  
**Status**: ✅ **Visual Parity Complete** - 30/30 tests passing (100%)

---

## 🚨 CRITICAL: Accessibility & Form Integration Analysis

### Issue: Input/Label Structure in Shadow DOM

**Current Implementation**:
- Input and label are rendered inside Shadow DOM
- Uses `ElementInternals` for ARIA attributes
- Form association via `static formAssociated = true`

**Potential Concerns**:
1. **Form Integration**: How does the checkbox behave when used inside `<form>` elements?
   - Does the value submit correctly?
   - Are form validation states properly exposed?
   - Does `formData` capture the checkbox state?

2. **Label Association**: Are there edge cases where label-to-input association breaks?
   - Does clicking the label always trigger the input?
   - Are there issues with nested forms or complex DOM structures?
   - Does it work correctly with form libraries (e.g., form validation libraries)?

3. **Accessibility in Real-World Usage**:
   - Screen reader testing with actual forms
   - Keyboard navigation in form contexts
   - Integration with form validation messages
   - Behavior with `<fieldset>` and `<legend>`

4. **Browser Compatibility**:
   - Does `ElementInternals` work consistently across all target browsers?
   - Are there polyfill needs for older browsers?
   - Safari-specific considerations?

---

## 📋 Required Analysis

### Phase 1: Form Integration Testing
- [ ] **Create test forms** with various checkbox configurations:
  - [ ] Simple form with single checkbox
  - [ ] Form with multiple checkboxes (same `name` attribute)
  - [ ] Form with radio-like behavior (single selection)
  - [ ] Nested forms (if supported)
  - [ ] Forms with validation
  - [ ] Forms with `FormData` API usage

- [ ] **Test form submission**:
  - [ ] `form.submit()` includes checkbox values
  - [ ] `new FormData(form)` captures checkbox state
  - [ ] `form.reset()` resets checkbox state
  - [ ] `form.checkValidity()` respects `required` attribute

- [ ] **Test form events**:
  - [ ] `submit` event fires correctly
  - [ ] `reset` event resets checkbox
  - [ ] `change` event bubbles to form
  - [ ] `invalid` event for validation

### Phase 2: Accessibility Audit
- [ ] **Screen Reader Testing**:
  - [ ] NVDA (Windows)
  - [ ] JAWS (Windows)
  - [ ] VoiceOver (macOS/iOS)
  - [ ] TalkBack (Android)

- [ ] **Test Scenarios**:
  - [ ] Checkbox announces correctly when focused
  - [ ] Label is read by screen readers
  - [ ] Description and body content are announced
  - [ ] Required state is announced
  - [ ] Disabled state is announced
  - [ ] Checked/unchecked state is clear
  - [ ] Group semantics (when multiple checkboxes in a fieldset)

- [ ] **Keyboard Navigation**:
  - [ ] Tab order is correct
  - [ ] Space key toggles checkbox
  - [ ] Focus indicators are visible
  - [ ] Works correctly in form tab order

### Phase 3: Real-World Integration Testing
- [ ] **Test with popular form libraries**:
  - [ ] React Hook Form
  - [ ] Formik
  - [ ] Vanilla JavaScript form validation
  - [ ] HTML5 Constraint Validation API

- [ ] **Test in common patterns**:
  - [ ] Checkbox groups (terms of service, multi-select)
  - [ ] Controlled checkboxes (toggle states)
  - [ ] Nested checkboxes (parent/child relationships)
  - [ ] Dynamic checkboxes (added/removed at runtime)

### Phase 4: Browser Compatibility
- [ ] **Test ElementInternals support**:
  - [ ] Chrome/Edge (Chromium)
  - [ ] Firefox
  - [ ] Safari (macOS/iOS)
  - [ ] Identify any polyfill needs

- [ ] **Fallback Strategy**:
  - [ ] Document minimum browser versions
  - [ ] Provide polyfill recommendations if needed
  - [ ] Test degradation in unsupported browsers

---

## 🎯 Success Criteria

### Must Maintain
- ✅ **Visual Parity**: 30/30 tests passing (100%)
- ✅ **Design Coverage**: Matches React PatternFly exactly

### Must Verify
- [ ] **Forms**: Checkboxes work correctly in all form scenarios
- [ ] **Accessibility**: WCAG 2.1 AA compliance verified
- [ ] **Screen Readers**: All major screen readers announce correctly
- [ ] **Keyboard**: Full keyboard accessibility maintained
- [ ] **Browser Support**: Works in all target browsers

### Documentation Required
- [ ] **Usage Guide**: How to use checkboxes in forms
- [ ] **Accessibility Notes**: Screen reader behavior documented
- [ ] **Browser Support**: Compatibility matrix
- [ ] **Migration Guide**: React to Lit checkbox migration
- [ ] **Form Integration Examples**: Code samples for common patterns

---

## 📝 Implementation Notes

### Current Architecture Strengths
✅ Uses `ElementInternals` (web standard)  
✅ `static formAssociated = true` (enables form participation)  
✅ Shadow DOM encapsulation  
✅ ARIA attributes properly set  
✅ 100% visual parity with React  

### Potential Refactor Considerations
⚠️ **Only if analysis reveals issues**:
- Consider Light DOM fallback for label association
- Evaluate alternative form integration approaches
- Assess need for additional ARIA live regions
- Review event bubbling and form event handling

### Guiding Principle
**DO NOT refactor unless analysis proves a problem exists.**

The component currently has:
- 100% visual parity ✅
- Proper use of web standards ✅
- Shadow DOM best practices ✅

**Refactor only if**:
- Accessibility issues are discovered
- Form integration fails in real-world scenarios
- Screen reader testing reveals problems
- Browser compatibility issues emerge

---

## 🔬 Testing Commands

### Visual Parity (Already Passing)
```bash
npm run e2e:parity -- tests/visual/checkbox/
# Expected: 30/30 passing ✅
```

### Form Integration Tests (To Be Created)
```bash
# Create new test file: tests/integration/checkbox-forms.spec.ts
npm run test -- tests/integration/checkbox-forms.spec.ts
```

### Accessibility Tests (To Be Created)
```bash
# Create new test file: tests/a11y/checkbox-a11y.spec.ts
npm run test -- tests/a11y/checkbox-a11y.spec.ts
```

---

## 📚 Resources

### Standards & Specifications
- [ARIA: checkbox role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/checkbox_role)
- [ElementInternals API](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals)
- [Form-associated custom elements](https://web.dev/more-capable-form-controls/)
- [WCAG 2.1 Form Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html)

### PatternFly References
- [PatternFly Checkbox Component](https://www.patternfly.org/components/forms/checkbox)
- [PatternFly Accessibility Guidelines](https://www.patternfly.org/accessibility/overview)

### Testing Tools
- [axe DevTools](https://www.deque.com/axe/devtools/) - Accessibility testing
- [WAVE](https://wave.webaim.org/) - Web accessibility evaluation
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Accessibility audits

---

## 🚀 Next Steps

1. **Create Form Integration Tests** (Highest Priority)
   - Write comprehensive test suite for form scenarios
   - Test with `FormData` API
   - Verify form submission and reset

2. **Accessibility Audit** (High Priority)
   - Screen reader testing across platforms
   - Keyboard navigation verification
   - WCAG 2.1 compliance check

3. **Real-World Testing** (Medium Priority)
   - Test with popular form libraries
   - Create example implementations
   - Document edge cases

4. **Browser Compatibility** (Medium Priority)
   - Test across all target browsers
   - Identify any polyfill needs
   - Document minimum versions

5. **Documentation** (Low Priority - After Verification)
   - Usage guide with form examples
   - Accessibility documentation
   - Migration guide from React

---

## Status: Analysis Phase Required

**Current State**: ✅ Visual parity complete (100%)  
**Next Phase**: 🔬 Accessibility & form integration analysis  
**Goal**: Verify production-readiness while maintaining 100% design coverage
