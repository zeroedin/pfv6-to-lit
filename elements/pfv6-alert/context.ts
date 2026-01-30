import { createContext } from '@lit/context';

/**
 * Context interface for Alert component
 */
export interface AlertContext {
  title: string;
  variantLabel: string;
}

/**
 * Context interface for AlertGroup component
 */
export interface AlertGroupContext {
  hasAnimations: boolean;
  /** Register a callback to fire when the specified element's transition ends */
  onTransitionEnd: (element: HTMLElement, callback: () => void) => void;
}

/**
 * Lit Context for Alert - provides title and variantLabel to sub-components
 */
export const alertContext = createContext<AlertContext>(Symbol('alert-context'));

/**
 * Lit Context for AlertGroup - provides animation state to child alerts
 */
export const alertGroupContext = createContext<AlertGroupContext>(Symbol('alert-group-context'));
