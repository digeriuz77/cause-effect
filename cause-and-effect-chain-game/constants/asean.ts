
import { ElementsMap, ElementType } from '../types';

export const ASEAN_ELEMENTS: ElementsMap = {
  // Tier 1 - Initial Drivers
  'instability': { 
    text: 'Post-Colonial Instability & Fear of Communism', 
    emoji: '📉🚩',
    type: ElementType.Cause, 
    x: 50, 
    y: 200
  },
  'economic-goals': { 
    text: 'Desire for Economic Cooperation', 
    emoji: '📈🤝',
    type: ElementType.Cause, 
    x: 50, 
    y: 350
  },

  // Tier 2 - Formation
  'bangkok-declaration': { 
    text: 'Bangkok Declaration Signed (1967)', 
    emoji: '📜',
    type: ElementType.EffectCause, 
    x: 350, 
    y: 275
  },

  // Tier 3 - ASEAN Exists
  'asean-formed': { 
    text: 'ASEAN is Formed (5 Founding Members)', 
    emoji: '🌏',
    type: ElementType.EffectCause, 
    x: 650, 
    y: 275
  },

  // Tier 4 - Expansion
  'brunei-joins': {
    text: 'Brunei Joins (1984) after gaining independence.',
    emoji: '🇧🇳',
    type: ElementType.EffectCause,
    x: 950,
    y: 50,
  },
  'vietnam-joins': {
    text: 'Vietnam Joins (1995) after Cold War ends.',
    emoji: '🇻🇳',
    type: ElementType.EffectCause,
    x: 950,
    y: 200
  },
    'laos-myanmar-joins': {
    text: 'Laos & Myanmar Join (1997)',
    emoji: '🇱🇦🇲🇲',
    type: ElementType.EffectCause,
    x: 950,
    y: 350,
  },
    'cambodia-joins': {
    text: 'Cambodia Joins (1999)',
    emoji: '🇰🇭',
    type: ElementType.EffectCause,
    x: 950,
    y: 500,
  },

  // Tier 5 - Outcomes
  'asean-10': {
      text: 'ASEAN grows to 10 members',
      emoji: '🔟',
      type: ElementType.EffectCause,
      x: 1250,
      y: 275
  },

  // Tier 6 - Final Effects
  'rotating-chair': { 
    text: 'Rotating Chairmanship ensures equal leadership', 
    emoji: '🔄',
    type: ElementType.Effect, 
    x: 1550, 
    y: 125
  },
  'sea-games': { 
    text: 'SEA Games promoted for regional identity', 
    emoji: '🏅',
    type: ElementType.Effect, 
    x: 1550, 
    y: 275
  },
  'afta': { 
    text: 'ASEAN Free Trade Area (AFTA) created', 
    emoji: '💸',
    type: ElementType.Effect, 
    x: 1550, 
    y: 425
  },
};

export const ASEAN_VALID_CAUSE_COMBOS: { [effectId: string]: { combos: string[][]; phrase: string } } = {
    'bangkok-declaration': { combos: [['instability', 'economic-goals']], phrase: 'leads to the' },
    'asean-formed': { combos: [['bangkok-declaration']], phrase: 'which establishes the' },
    'brunei-joins': { combos: [['asean-formed']], phrase: 'followed by' },
    'vietnam-joins': { combos: [['asean-formed']], phrase: 'and later' },
    'laos-myanmar-joins': { combos: [['asean-formed']], phrase: 'then' },
    'cambodia-joins': { combos: [['asean-formed']], phrase: 'and finally' },
    'asean-10': { combos: [['brunei-joins', 'vietnam-joins', 'laos-myanmar-joins', 'cambodia-joins']], phrase: 'all of which results in' },
    'rotating-chair': { combos: [['asean-10']], phrase: 'establishes a' },
    'sea-games': { combos: [['asean-10']], phrase: 'promotes the' },
    'afta': { combos: [['asean-10']], phrase: 'creates the' },
};

export const ASEAN_INITIAL_AVAILABLE_ELEMENTS = new Set(['instability', 'economic-goals']);