
import { ElementsMap, ElementType } from '../types';

export const STORM_ELEMENTS: ElementsMap = {
  // Causes
  'moisture': { 
    text: 'Moisture in the air', 
    emoji: '💧☁️',
    type: ElementType.Cause, 
    x: 50, 
    y: 100
  },
  'unstable-air': { 
    text: 'Unstable air', 
    emoji: '🌡️💨',
    type: ElementType.Cause, 
    x: 50, 
    y: 250
  },
  'lift': { 
    text: 'Lift', 
    emoji: '⬆️',
    type: ElementType.Cause, 
    x: 50, 
    y: 400
  },
  
  // Effect -> Cause chain
  'cloud-grows': { 
    text: 'a storm cloud begins to form', 
    emoji: '⛈️',
    type: ElementType.EffectCause, 
    x: 400, 
    y: 250
  },
  'drafts': { 
    text: 'strong winds move up and down inside the cloud', 
    emoji: '💨🔄',
    type: ElementType.EffectCause, 
    x: 750, 
    y: 250
  },
  'dangers': { 
    text: 'dangerous weather like heavy rain and strong winds', 
    emoji: '🌧️🌬️',
    type: ElementType.EffectCause, 
    x: 1100, 
    y: 250
  },
  
  // Final Effect
  'trees-down': {
    text: 'trees might get blown down',
    emoji: '🌳💨',
    type: ElementType.Effect,
    x: 1450,
    y: 250,
  }
};

export const STORM_VALID_CAUSE_COMBOS: { [effectId: string]: { combos: string[][]; phrase: string } } = {
    'cloud-grows': { combos: [['moisture', 'unstable-air', 'lift']], phrase: 'Because of these ingredients,' },
    'drafts': { combos: [['cloud-grows']], phrase: 'This leads to' },
    'dangers': { combos: [['drafts']], phrase: 'which results in' },
    'trees-down': { combos: [['dangers']], phrase: 'As a result,' },
};

export const STORM_INITIAL_AVAILABLE_ELEMENTS = new Set(['moisture', 'unstable-air', 'lift']);