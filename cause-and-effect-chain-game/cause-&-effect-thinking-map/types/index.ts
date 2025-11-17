
export enum NodeType {
  Cause = 'Cause',
  Effect = 'Effect',
  CauseEffect = 'Cause/Effect',
  Unclassified = 'Unclassified',
}

export interface CustomNodeData {
  label: string;
  type: NodeType;
  sequence: number; // Added for chronological validation
}

export interface AnnotatedEdgeData {
  label:string;
}