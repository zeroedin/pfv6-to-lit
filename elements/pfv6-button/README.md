# pfv6-button

Button component for triggering actions.

## Link Buttons

When you need a button that navigates to a URL, use the `href` property. This renders an anchor element internally while maintaining button styling:

```html
<pfv6-button href="https://www.patternfly.org/" target="_blank" variant="primary">
  Link to PatternFly
</pfv6-button>
```

## Accessible Labels

For icon-only buttons, always provide an accessible label via the `accessible-label` attribute or visible text content:

```html
<pfv6-button is-settings accessible-label="Settings">
  <pfv6-icon slot="icon" icon="cog"></pfv6-icon>
</pfv6-button>
```
