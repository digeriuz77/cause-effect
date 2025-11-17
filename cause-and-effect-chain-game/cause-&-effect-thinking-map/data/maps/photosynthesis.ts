
import { MapData } from './types';
import { NodeType } from '../../types';

export const photosynthesisMap: MapData = {
  config: {
    unclassifiedRatio: 0.5, // 50% of nodes will be unclassified
  },
  nodes: [
    {
      id: 'p1',
      position: { x: 0, y: 0 },
      type: 'custom',
      data: {
        label: 'Sunlight provides the energy needed to drive the chemical reactions of photosynthesis.',
        type: NodeType.Cause,
        sequence: 1,
      },
    },
    {
      id: 'p2',
      position: { x: 0, y: 0 },
      type: 'custom',
      data: {
        label: 'Light energy is converted into chemical energy by chlorophyll, initiating the process.',
        type: NodeType.Effect,
        sequence: 2,
      },
    },
    {
      id: 'p3',
      position: { x: 0, y: 0 },
      type: 'custom',
      data: {
        label: 'CO₂ is present in the atmosphere and diffuses into the leaf through stomata.',
        type: NodeType.Cause,
        sequence: 3,
      },
    },
    {
      id: 'p4',
      position: { x: 0, y: 0 },
      type: 'custom',
      data: {
        label: 'Carbon dioxide becomes a key reactant in the synthesis of glucose.',
        type: NodeType.Effect,
        sequence: 4,
      },
    },
    {
      id: 'p5',
      position: { x: 0, y: 0 },
      type: 'custom',
      data: {
        label: 'Water is available in the soil and moves through the plant\'s xylem vessels to the leaves.',
        type: NodeType.Cause,
        sequence: 5,
      },
    },
    {
      id: 'p6',
      position: { x: 0, y: 0 },
      type: 'custom',
      data: {
        label: 'Water provides the necessary hydrogen atoms and electrons for the reactions.',
        type: NodeType.Effect,
        sequence: 6,
      },
    },
    {
      id: 'p7',
      position: { x: 0, y: 0 },
      type: 'custom',
      data: {
        label: 'Light energy enables the conversion of CO₂ and H₂O into glucose via the Calvin Cycle.',
        type: NodeType.Cause,
        sequence: 7,
      },
    },
    {
      id: 'p8',
      position: { x: 0, y: 0 },
      type: 'custom',
      data: {
        label: 'The plant produces and stores glucose for energy, growth, and cellular respiration.',
        type: NodeType.Effect,
        sequence: 8,
      },
    },
    {
      id: 'p9',
      position: { x: 0, y: 0 },
      type: 'custom',
      data: {
        label: 'Oxygen is created as a by-product of splitting water molecules during the light-dependent reactions.',
        type: NodeType.Cause,
        sequence: 9,
      },
    },
    {
      id: 'p10',
      position: { x: 0, y: 0 },
      type: 'custom',
      data: {
        label: 'Oxygen is released from the leaf through the stomata into the atmosphere.',
        type: NodeType.Effect,
        sequence: 10,
      },
    },
    {
      id: 'p11',
      position: { x: 0, y: 0 },
      type: 'custom',
      data: {
        label: 'The plant combines carbon dioxide and water using the captured light energy.',
        type: NodeType.Cause,
        sequence: 11,
      },
    },
    {
      id: 'p12',
      position: { x: 0, y: 0 },
      type: 'custom',
      data: {
        label: 'The overall balanced equation is: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂.',
        type: NodeType.Effect,
        sequence: 12,
      },
    },
  ],
};
