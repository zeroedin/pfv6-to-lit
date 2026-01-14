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
