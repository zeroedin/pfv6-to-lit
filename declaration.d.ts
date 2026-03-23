/**
 * Global type declarations for PatternFly Elements v6
 *
 * CSS Modules: Allows importing .css files as Lit CSSResult objects
 */
declare module '*.css' {
  import { type CSSResult } from 'lit';
  const styles: CSSResult;
  export default styles;
}

/**
 * TypeScript 5.9+ removed string-based ARIA reflection properties from ARIAMixin
 * in favor of element-reference properties (e.g. ariaControlsElements).
 * The string properties still work at runtime in all browsers and are needed
 * for ElementInternals cross-root ARIA where string IDREFs must reference
 * elements in a parent shadow root.
 *
 * @see https://github.com/nicolo-ribaudo/tc39-proposal-structs/issues/1
 */
interface ARIAMixin {
  ariaControls: string | null;
}
