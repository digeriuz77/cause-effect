import { ElementsMap, ElementType } from '../types';

/**
 * Level 6: The Brunei Residential System
 * Understanding British colonial influence in Brunei
 */

export const BRUNEI_ELEMENTS: ElementsMap = {
  'brunei-wealth': {
    text: "Brunei had valuable resources (oil, timber, trade routes)",
    emoji: '💎🌴',
    type: ElementType.Cause,
    x: 50,
    y: 200,
  },
  'sultan-power': {
    text: "The Sultan ruled Brunei with full power",
    emoji: '👑',
    type: ElementType.Cause,
    x: 50,
    y: 350,
  },
  'british-interest': {
    text: "Britain wanted to control Southeast Asia trade",
    emoji: '🇬🇧🚢',
    type: ElementType.Cause,
    x: 50,
    y: 500,
  },
  'treaty-1888': {
    text: "Treaty of 1888 signed between Britain and Brunei",
    emoji: '📜🤝',
    type: ElementType.EffectCause,
    x: 450,
    y: 350,
  },
  'resident-appointed': {
    text: "British Resident appointed to 'advise' the Sultan",
    emoji: '🎩📋',
    type: ElementType.EffectCause,
    x: 850,
    y: 200,
  },
  'loss-of-power': {
    text: "Sultan lost real decision-making power",
    emoji: '👑❌',
    type: ElementType.EffectCause,
    x: 850,
    y: 400,
  },
  'british-control': {
    text: "Britain controlled Brunei's economy and trade",
    emoji: '💰🇬🇧',
    type: ElementType.EffectCause,
    x: 1250,
    y: 250,
  },
  'protectorate-status': {
    text: "Brunei became a British Protectorate (not fully independent)",
    emoji: '🏴󐁧󐁢',
    type: ElementType.Effect,
    x: 1650,
    y: 350,
  },
};

export const BRUNEI_VALID_CAUSE_COMBOS: { [effectId: string]: { combos: string[][]; phrase: string } } = {
  'treaty-1888': {
    combos: [['brunei-wealth', 'british-interest']],
    phrase: 'led to',
  },
  'resident-appointed': {
    combos: [['treaty-1888']],
    phrase: 'resulted in',
  },
  'loss-of-power': {
    combos: [['treaty-1888', 'sultan-power']],
    phrase: 'meant that',
  },
  'british-control': {
    combos: [['resident-appointed']],
    phrase: 'allowed',
  },
  'protectorate-status': {
    combos: [['british-control', 'loss-of-power']],
    phrase: 'establishing',
  },
};

export const BRUNEI_INITIAL_AVAILABLE_ELEMENTS = new Set([
  'brunei-wealth',
  'sultan-power',
  'british-interest',
]);
