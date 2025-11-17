
import { ElementsMap, ElementType } from '../types';

export const CELL_ELEMENTS: ElementsMap = {
  // Start
  'growth-signal': {
    text: 'a cell receiving a growth signal',
    emoji: '📡',
    type: ElementType.Cause,
    x: 50,
    y: 230,
  },
  // Tier 1
  'dna-replicates': {
    text: 'the DNA replicating',
    emoji: '🧬',
    type: ElementType.EffectCause,
    x: 270,
    y: 230,
  },
  // Tier 2
  'chromosomes-condense': {
    text: 'chromosomes condensing',
    emoji: '🔬',
    type: ElementType.EffectCause,
    x: 490,
    y: 230,
  },
  // Tier 3 (Branching)
  'nuclear-envelope-dissolves': {
    text: 'the nuclear envelope dissolving',
    emoji: '💥',
    type: ElementType.EffectCause,
    x: 710,
    y: 110,
  },
  'spindle-fibers-form': {
    text: 'spindle fibers forming',
    emoji: '🕸️',
    type: ElementType.EffectCause,
    x: 710,
    y: 350,
  },
  // Tier 4
  'chromosomes-align': {
    text: 'chromosomes aligning at the center',
    emoji: '↔️',
    type: ElementType.EffectCause,
    x: 930,
    y: 230,
  },
  // Tier 5
  'chromatids-separate': {
    text: 'sister chromatids separating',
    emoji: '💔',
    type: ElementType.EffectCause,
    x: 1150,
    y: 230,
  },
  // Tier 6 (Branching)
  'new-nuclei-form': {
    text: 'two new nuclei forming',
    emoji: '⚛️⚛️',
    type: ElementType.EffectCause,
    x: 1370,
    y: 110,
  },
  'membrane-pinches': {
    text: 'the cell membrane pinching inward',
    emoji: '🤏',
    type: ElementType.EffectCause,
    x: 1370,
    y: 350,
  },
  // Final Effect
  'daughter-cells': {
    text: 'two identical daughter cells being created',
    emoji: '👨‍👩‍👧‍👧',
    type: ElementType.Effect,
    x: 1590,
    y: 230,
  },
};

export const CELL_VALID_CAUSE_COMBOS: { [effectId: string]: { combos: string[][]; phrase: string } } = {
    'dna-replicates': { combos: [['growth-signal']], phrase: 'triggers' },
    'chromosomes-condense': { combos: [['dna-replicates']], phrase: 'allowing' },
    // One cause (chromosomes-condense) leads to two separate effects here
    'nuclear-envelope-dissolves': { combos: [['chromosomes-condense']], phrase: 'followed by' },
    'spindle-fibers-form': { combos: [['chromosomes-condense']], phrase: 'and' },
    'chromosomes-align': { combos: [['nuclear-envelope-dissolves', 'spindle-fibers-form']], phrase: 'so that' },
    'chromatids-separate': { combos: [['chromosomes-align']], phrase: 'next' },
    // One cause (chromatids-separate) leads to two separate effects here
    'new-nuclei-form': { combos: [['chromatids-separate']], phrase: 'resulting in' },
    'membrane-pinches': { combos: [['chromatids-separate']], phrase: 'while the' },
    'daughter-cells': { combos: [['new-nuclei-form', 'membrane-pinches']], phrase: 'to finally create' },
};

export const CELL_INITIAL_AVAILABLE_ELEMENTS = new Set(['growth-signal']);