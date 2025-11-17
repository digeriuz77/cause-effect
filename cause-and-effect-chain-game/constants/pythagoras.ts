import { ElementsMap, ElementType } from '../types';

/**
 * Level 7: Pythagoras Theorem
 * Understanding how the theorem works through cause-effect
 */

export const PYTHAGORAS_ELEMENTS: ElementsMap = {
  'right-triangle': {
    text: "You have a right triangle (90° angle)",
    emoji: '📐',
    type: ElementType.Cause,
    x: 50,
    y: 300,
  },
  'three-sides': {
    text: "The triangle has three sides: a, b, and c",
    emoji: '📏',
    type: ElementType.Cause,
    x: 50,
    y: 450,
  },
  'build-squares': {
    text: "Build a square on each side of the triangle",
    emoji: '⬜🟦🟥',
    type: ElementType.EffectCause,
    x: 450,
    y: 375,
  },
  'measure-areas': {
    text: "Measure the area of each square (a×a, b×b, c×c)",
    emoji: '📊',
    type: ElementType.EffectCause,
    x: 850,
    y: 250,
  },
  'compare-areas': {
    text: "Compare the areas of the smaller squares to the largest square",
    emoji: '⚖️',
    type: ElementType.EffectCause,
    x: 850,
    y: 450,
  },
  'pattern-discovered': {
    text: "Pattern discovered: Area(a) + Area(b) = Area(c)",
    emoji: '💡',
    type: ElementType.EffectCause,
    x: 1250,
    y: 350,
  },
  'formula': {
    text: "The formula: a² + b² = c²",
    emoji: '🎯',
    type: ElementType.Effect,
    x: 1650,
    y: 350,
  },
};

export const PYTHAGORAS_VALID_CAUSE_COMBOS: { [effectId: string]: { combos: string[][]; phrase: string } } = {
  'build-squares': {
    combos: [['right-triangle', 'three-sides']],
    phrase: 'allows us to',
  },
  'measure-areas': {
    combos: [['build-squares']],
    phrase: 'so we can',
  },
  'compare-areas': {
    combos: [['build-squares']],
    phrase: 'then we',
  },
  'pattern-discovered': {
    combos: [['measure-areas', 'compare-areas']],
    phrase: 'which reveals',
  },
  'formula': {
    combos: [['pattern-discovered']],
    phrase: 'expressed as',
  },
};

export const PYTHAGORAS_INITIAL_AVAILABLE_ELEMENTS = new Set([
  'right-triangle',
  'three-sides',
]);
