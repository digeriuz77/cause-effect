import { FC } from 'react';
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath } from 'reactflow';
import { AnnotatedEdgeData } from '../types';

const AnnotatedEdge: FC<EdgeProps<AnnotatedEdgeData>> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={{ ...style, strokeWidth: 2 }} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <div
            className="bg-white px-3 py-1.5 rounded-lg shadow-md text-sm font-semibold text-indigo-800 border-2 border-white max-w-xs text-center"
            aria-label="Connection justification"
          >
            {data?.label}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default AnnotatedEdge;