
import { ElementsMap, ElementType } from '../types';

export const CIRCUITS_ELEMENTS: ElementsMap = {
  "power-source": {
    "text": "A power source providing potential difference (voltage)",
    "emoji": "🔋",
    "type": ElementType.Cause,
    "x": 50,
    "y": 100
  },
  "closed-loop": {
    "text": "a wire forming a closed loop for electrons to flow",
    "emoji": "🔄",
    "type": ElementType.Cause,
    "x": 50,
    "y": 250
  },
  "resistance": {
    "text": "a component (like a lamp) adding resistance",
    "emoji": "💡",
    "type": ElementType.Cause,
    "x": 50,
    "y": 400
  },
  "switch-closed": {
    "text": "a switch being closed to complete the circuit",
    "emoji": "🔘",
    "type": ElementType.Cause,
    "x": 50,
    "y": 550
  },
  "conductor-material": {
    "text": "conductive material allowing electron movement",
    "emoji": "🔌",
    "type": ElementType.Cause,
    "x": 50,
    "y": 700
  },
  "voltage-established": {
    "text": "voltage being established across the circuit",
    "emoji": "⚡",
    "type": ElementType.EffectCause,
    "x": 400,
    "y": 175
  },
  "complete-path": {
    "text": "a complete conductive path being formed",
    "emoji": "➰",
    "type": ElementType.EffectCause,
    "x": 400,
    "y": 400
  },
  "current-flows": {
    "text": "electric current flowing through the circuit",
    "emoji": "⚡➡️",
    "type": ElementType.EffectCause,
    "x": 750,
    "y": 287
  },
  "electrons-collide": {
    "text": "electrons colliding with atoms in the resistance",
    "emoji": "💥",
    "type": ElementType.EffectCause,
    "x": 1100,
    "y": 287
  },
  "energy-converted": {
    "text": "electrical energy converting to heat and light",
    "emoji": "🔥💡",
    "type": ElementType.EffectCause,
    "x": 1450,
    "y": 287
  },
  "bulb-lights": {
    "text": "the bulb emitting light (e.g., a flashlight turning on)",
    "emoji": "🔦✨",
    "type": ElementType.Effect,
    "x": 1800,
    "y": 200
  },
  "circuit-heats": {
    "text": "the circuit component producing heat",
    "emoji": "🌡️♨️",
    "type": ElementType.Effect,
    "x": 1800,
    "y": 374
  },
  "no-current": {
    "text": "no current flowing",
    "emoji": "❌⚡",
    "type": ElementType.Effect,
    "x": 750,
    "y": 550
  },
  "open-circuit": {
    "text": "an open circuit preventing electron flow",
    "emoji": "🚫",
    "type": ElementType.Cause,
    "x": 400,
    "y": 700
  }
};

export const CIRCUITS_VALID_CAUSE_COMBOS: { [effectId: string]: { combos: string[][]; phrase: string } } = {
    "voltage-established": {
      "combos": [
        ["power-source"]
      ],
      "phrase": "establishes"
    },
    "complete-path": {
      "combos": [
        ["closed-loop", "switch-closed", "conductor-material"]
      ],
      "phrase": "combine to form"
    },
    "current-flows": {
      "combos": [
        ["voltage-established", "complete-path"]
      ],
      "phrase": "together result in"
    },
    "electrons-collide": {
      "combos": [
        ["current-flows", "resistance"]
      ],
      "phrase": "flowing through resistance causes"
    },
    "energy-converted": {
      "combos": [
        ["electrons-collide"]
      ],
      "phrase": "which leads to"
    },
    "bulb-lights": {
      "combos": [
        ["energy-converted"]
      ],
      "phrase": "producing the result that"
    },
    "circuit-heats": {
      "combos": [
        ["energy-converted"]
      ],
      "phrase": "also resulting in"
    },
    "no-current": {
      "combos": [
        ["open-circuit"],
        ["voltage-established", "open-circuit"]
      ],
      "phrase": "prevents flow, so"
    }
  };

export const CIRCUITS_INITIAL_AVAILABLE_ELEMENTS = new Set([
    "power-source",
    "closed-loop",
    "resistance",
    "switch-closed",
    "conductor-material",
    "open-circuit"
  ]);