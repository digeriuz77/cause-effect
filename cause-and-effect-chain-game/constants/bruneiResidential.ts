import { ElementsMap, ElementType } from '../types';

/**
 * Level 6: The Brunei Residential System
 * Understanding British colonial influence in Brunei
 */

export const BRUNEI_ELEMENTS: ElementsMap = {
  'brunei-wealth': {
    text: "Brunei had valuable resources (oil, timber)",
    emoji: '💎🌴',
    type: ElementType.Cause,
    x: 50,
    y: 300,
  },
  'british-interest': {
    text: "Britain wanted to control trade in Southeast Asia",
    emoji: '🇬🇧🚢',
    type: ElementType.Cause,
    x: 50,
    y: 450,
  },
  'treaty-1888': {
    text: "1888 Treaty signed (Britain 'protects' Brunei)",
    emoji: '📜🤝',
    type: ElementType.EffectCause,
    x: 450,
    y: 375,
  },
  'resident-appointed': {
    text: "British Resident appointed to 'advise' Sultan",
    emoji: '🎩📋',
    type: ElementType.EffectCause,
    x: 850,
    y: 300,
  },
  'sultan-loses-power': {
    text: "Sultan loses real decision-making power",
    emoji: '👑❌',
    type: ElementType.EffectCause,
    x: 850,
    y: 450,
  },
  'british-control-economy': {
    text: "Britain controls Brunei's economy and resources",
    emoji: '💰🇬🇧',
    type: ElementType.EffectCause,
    x: 1250,
    y: 375,
  },
  'protectorate-status': {
    text: "Brunei becomes a British Protectorate",
    emoji: '🏴',
    type: ElementType.Effect,
    x: 1650,
    y: 375,
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
  'sultan-loses-power': {
    combos: [['resident-appointed']],
    phrase: 'meant that',
  },
  'british-control-economy': {
    combos: [['sultan-loses-power']],
    phrase: 'allowed',
  },
  'protectorate-status': {
    combos: [['british-control-economy']],
    phrase: 'establishing',
  },
};

export const BRUNEI_INITIAL_AVAILABLE_ELEMENTS = new Set([
  'brunei-wealth',
  'british-interest',
]);
