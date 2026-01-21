import { createContextWithRoot } from '@patternfly/pfe-core/functions/context.js';

/**
 * Context interface for Accordion parent-child state sharing.
 */
export interface AccordionContext {
  headingLevel: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  asDefinitionList: boolean;
  togglePosition: 'start' | 'end';
}

/**
 * Context interface for AccordionItem parent-child state sharing.
 */
export interface AccordionItemContext {
  isExpanded: boolean;
}

/**
 * Context for sharing accordion configuration with child components.
 *
 * Uses createContextWithRoot from @patternfly/pfe-core which handles:
 * - Late-upgrading context consumers (slotted content timing issues)
 * - SSR compatibility via isServer check
 * - Singleton ContextRoot attached to document.body
 *
 * @see https://lit.dev/docs/data/context/#critical-contextroot
 */
export const accordionContext = createContextWithRoot<AccordionContext>(
  Symbol('accordion-context'),
);

/**
 * Context for sharing expanded state with child components.
 *
 * Uses createContextWithRoot from @patternfly/pfe-core which handles:
 * - Late-upgrading context consumers (slotted content timing issues)
 * - SSR compatibility via isServer check
 * - Singleton ContextRoot attached to document.body
 *
 * @see https://lit.dev/docs/data/context/#critical-contextroot
 */
export const accordionItemContext = createContextWithRoot<AccordionItemContext>(
  Symbol('accordion-item-context'),
);
