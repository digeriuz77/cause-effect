
import { ElementsMap, ElementType } from '../types';

export const MATH_LOGIC_ELEMENTS: ElementsMap = {
  // Givens
  'given-cookies-sold': { 
    text: '10 cookies were sold', 
    emoji: '🍪x10',
    type: ElementType.Cause, 
    x: 50, 
    y: 50
  },
  'given-cookie-price': { 
    text: 'cookies cost $2 each', 
    emoji: '💲2️⃣',
    type: ElementType.Cause, 
    x: 50, 
    y: 180
  },
  'given-total-revenue': { 
    text: 'total revenue of $50', 
    emoji: '💰',
    type: ElementType.Cause, 
    x: 400, 
    y: 450
  },
  'given-brownie-price': {
    text: 'brownies cost $3 each',
    emoji: '💲3️⃣',
    type: ElementType.Cause,
    x: 750,
    y: 525,
  },
  // Distractors
  'distractor-profit': {
    text: 'brownies have a 50% profit margin',
    emoji: '📈',
    type: ElementType.Cause,
    x: 50,
    y: 310,
  },
  'distractor-operation': {
    text: 'Incorrect Step: Divide total revenue by cookie price ($50 / $2)',
    emoji: '➗',
    type: ElementType.Effect,
    x: 50,
    y: 440,
  },

  // Steps
  'deduce-cookie-revenue': {
    text: 'Revenue from cookies ($20)',
    emoji: '💵',
    type: ElementType.EffectCause,
    x: 400,
    y: 115
  },
  'deduce-brownie-revenue': {
    text: 'Revenue from brownies ($30)',
    emoji: '💸',
    type: ElementType.EffectCause,
    x: 750,
    y: 280
  },
  // Final Answer
  'answer-brownies-sold': {
    text: 'Number of brownies sold (10)',
    emoji: '🍫x10',
    type: ElementType.Effect,
    x: 1100,
    y: 365,
  },
};

export const MATH_LOGIC_VALID_CAUSE_COMBOS: { [effectId: string]: { combos: string[][]; phrase: string } } = {
    'deduce-cookie-revenue': { combos: [['given-cookies-sold', 'given-cookie-price']], phrase: 'allows the calculation of the' },
    'deduce-brownie-revenue': { combos: [['deduce-cookie-revenue', 'given-total-revenue']], phrase: 'which, when subtracted from the total, reveals the' },
    'answer-brownies-sold': { combos: [['deduce-brownie-revenue', 'given-brownie-price']], phrase: 'which is then used to find the' },
};

export const MATH_LOGIC_INITIAL_AVAILABLE_ELEMENTS = new Set(['given-cookies-sold', 'given-cookie-price', 'given-total-revenue', 'given-brownie-price', 'distractor-profit', 'distractor-operation']);