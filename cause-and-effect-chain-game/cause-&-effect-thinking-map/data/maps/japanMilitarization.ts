
import { MapData } from './types';
import { NodeType } from '../../types';

export const japanMilitarizationMap: MapData = {
  config: {
    unclassifiedRatio: 0.5, // 50% of nodes will be unclassified
  },
  nodes: [
    {
      id: '1',
      position: { x: 0, y: 0 }, // Position will be randomized
      type: 'custom',
      data: {
        label: 'Japan builds a strong army and navy to become powerful like Western countries.',
        type: NodeType.Cause,
        sequence: 1,
      },
    },
    {
      id: '2',
      position: { x: 0, y: 0 },
      type: 'custom',
      data: {
        label: 'The military becomes very important in Japanese society.',
        type: NodeType.Effect,
        sequence: 2,
      },
    },
    {
      id: '3',
      position: { x: 0, y: 0 },
      type: 'custom',
      data: {
        label: 'Japan invades Manchuria for land and resources, ignoring the League of Nations.',
        type: NodeType.Cause,
        sequence: 3,
      },
    },
    {
      id: '4',
      position: { x: 0, y: 0 },
      type: 'custom',
      data: {
        label: 'Japan ignores world rules and becomes more aggressive.',
        type: NodeType.Effect,
        sequence: 4,
      },
    },
    {
      id: '5',
      position: { x: 0, y: 0 },
      type: 'custom',
      data: {
        label: 'Japan starts a war with China to control it, killing many civilians.',
        type: NodeType.Cause,
        sequence: 5,
      },
    },
    {
      id: '6',
      position: { x: 0, y: 0 },
      type: 'custom',
      data: {
        label: 'The U.S. stops trading with Japan due to its aggression.',
        type: NodeType.Effect,
        sequence: 6,
      },
    },
      {
      id: '7',
      position: { x: 0, y: 0 },
      type: 'custom',
      data: {
        label: 'Japan attacks Pearl Harbor to stop U.S. interference.',
        type: NodeType.Cause,
        sequence: 7,
      },
    },
    {
      id: '8',
      position: { x: 0, y: 0 },
      type: 'custom',
      data: {
        label: 'The U.S. joins World War II.',
        type: NodeType.Effect,
        sequence: 8,
      },
    },
    {
      id: '9',
      position: { x: 0, y: 0 },
      type: 'custom',
      data: {
        label: 'The U.S. drops atomic bombs on Hiroshima and Nagasaki as Japan refuses to surrender.',
        type: NodeType.Cause,
        sequence: 9,
      },
    },
    {
      id: '10',
      position: { x: 0, y: 0 },
      type: 'custom',
      data: {
        label: 'Japan surrenders, the war ends, and Japan becomes a peaceful nation.',
        type: NodeType.Effect,
        sequence: 10,
      },
    },
  ]
};
