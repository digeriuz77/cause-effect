
import { ElementsMap, ElementType } from '../types';

export const ENGLISH_LOGIC_ELEMENTS: ElementsMap = {
  'lennie-strength': {
    text: "Lennie not understanding his own strength",
    emoji: '💪🐰',
    type: ElementType.Cause,
    x: 50,
    y: 275,
  },
  'lennie-gentle': {
    text: "Lennie's love for soft things",
    emoji: '❤️🐾',
    type: ElementType.Cause,
    x: 50,
    y: 425,
  },
  'curley-wife-lonely': {
    text: "Curley’s wife being lonely and seeking conversation",
    emoji: '🗣️💔',
    type: ElementType.Cause,
    x: 50,
    y: 575,
  },
  'the-dream': {
    text: 'their dream of a farm being impossible',
    emoji: '🏞️🐇',
    type: ElementType.Cause,
    x: 1110,
    y: 137,
  },
  'curley-violent': {
    text: 'Curley wanting brutal revenge, not justice',
    emoji: '😠🔥',
    type: ElementType.Cause,
    x: 1210,
    y: 615,
  },
  'distractor-george-angry': {
    text: "George's anger at Lennie for ruining things",
    emoji: '😡',
    type: ElementType.Cause,
    x: 1867,
    y: 667,
  },
  'incident-start': {
    text: "Curley's wife letting him stroke her hair",
    emoji: '🤝👩‍🦱',
    type: ElementType.EffectCause,
    x: 400,
    y: 500,
  },
  'incident-panic': {
    text: 'Lennie panicking when she tried to pull away',
    emoji: '😱❗',
    type: ElementType.EffectCause,
    x: 799,
    y: 299,
  },
  'incident-result': {
    text: 'Lennie accidentally killing her',
    emoji: '💔💀',
    type: ElementType.EffectCause,
    x: 939,
    y: 490,
  },
  'dream-ends': {
    text: 'their dream of a farm being impossible',
    emoji: '😭🏞️',
    type: ElementType.EffectCause,
    x: 1419,
    y: 252,
  },
  'mob-forms': {
    text: 'Curley gathering men to hunt Lennie down',
    emoji: '🏃‍♂️🔦',
    type: ElementType.EffectCause,
    x: 1405,
    y: 383,
  },
  'georges-realization': {
    text: 'George knowing what the mob would do to Lennie',
    emoji: '🤔😢',
    type: ElementType.EffectCause,
    x: 1681,
    y: 524,
  },
  'final-choice-mercy': {
    text: "George providing a final, tragic act of mercy",
    emoji: '🔫❤️',
    type: ElementType.EffectCause,
    x: 2085,
    y: 321,
  },
  'conclusion-correct': {
    text: "George's action being a tragic mercy killing, an act of love to spare his friend from a brutal fate.",
    emoji: '🏆',
    type: ElementType.Effect,
    x: 1997,
    y: 172,
  },
  'conclusion-distractor': {
    text: "George's action being one of anger and despair over their lost dream.",
    emoji: '❌',
    type: ElementType.Effect,
    x: 2055,
    y: 472,
  },
};

export const ENGLISH_LOGIC_VALID_CAUSE_COMBOS: { [effectId: string]: { combos: string[][]; phrase: string } } = {
  'incident-start': {
    combos: [['lennie-gentle', 'curley-wife-lonely']],
    phrase: 'leads to the moment of',
  },
  'incident-panic': {
    combos: [['incident-start', 'lennie-strength']],
    phrase: 'but this combined with',
  },
  'incident-result': {
    combos: [['incident-panic']],
    phrase: 'tragically results in',
  },
  'dream-ends': {
    combos: [['incident-result']],
    phrase: 'means',
  },
  'mob-forms': {
    combos: [['incident-result', 'curley-violent']],
    phrase: 'and',
  },
  'georges-realization': {
    combos: [['mob-forms']],
    phrase: 'means',
  },
  'final-choice-mercy': {
    combos: [['georges-realization']],
    phrase: 'leads to',
  },
  'conclusion-correct': {
    combos: [['final-choice-mercy', 'dream-ends']],
    phrase: 'proving that',
  },
  'conclusion-distractor': {
    combos: [['distractor-george-angry', 'dream-ends']],
    phrase: 'suggests that',
  },
};

export const ENGLISH_LOGIC_INITIAL_AVAILABLE_ELEMENTS = new Set([
  'lennie-strength',
  'lennie-gentle',
  'curley-wife-lonely',
  'the-dream',
  'curley-violent',
  'distractor-george-angry',
]);