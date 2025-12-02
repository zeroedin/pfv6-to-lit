import { createContext } from '@lit/context';

/**
 * Card context - Used to communicate card state to nested components (e.g., checkbox)
 * 
 * When a checkbox is inside a card, it needs to:
 * - Position its label absolutely to overlay the entire card (for click-anywhere-to-select)
 * - Hide label text visually (accessibility still works)
 */
export interface CardContext {
  /**
   * Whether the card is in selectable mode
   */
  isSelectable: boolean;
}

/**
 * Context key for card state
 */
export const cardContext = createContext<CardContext>(Symbol('card-context'));
