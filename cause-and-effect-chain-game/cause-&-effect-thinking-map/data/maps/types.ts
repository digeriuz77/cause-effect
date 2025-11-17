
import type { Node } from 'reactflow';
import { CustomNodeData } from '../../types';

export interface MapData {
  nodes: Node<CustomNodeData>[];
  config: {
    unclassifiedRatio: number;
  };
}
