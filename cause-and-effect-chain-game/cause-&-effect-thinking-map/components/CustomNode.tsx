
import { memo, useContext, ChangeEvent } from 'react';
import type { FC } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NodeType, CustomNodeData } from '../types';
import { MapContext } from './ThinkingMap';

const typeContainerColors = {
  [NodeType.Cause]: 'bg-rose-100 border-rose-400',
  [NodeType.Effect]: 'bg-sky-100 border-sky-400',
  [NodeType.CauseEffect]: 'bg-purple-100 border-purple-400',
  [NodeType.Unclassified]: 'bg-gray-100 border-gray-400',
};

const typeHeaderColors = {
  [NodeType.Cause]: 'bg-rose-500 text-white',
  [NodeType.Effect]: 'bg-sky-500 text-white',
  [NodeType.CauseEffect]: 'bg-purple-500 text-white',
  [NodeType.Unclassified]: 'bg-gray-500 text-white',
};

const CustomNode: FC<NodeProps<CustomNodeData>> = ({ id, data }) => {
  const { updateNodeData } = useContext(MapContext);
  
  const handleTypeChange = (evt: ChangeEvent<HTMLSelectElement>) => {
    updateNodeData(id, { type: evt.target.value as NodeType });
  };

  return (
    <div
      className={`rounded-lg shadow-lg border-2 w-64 transition-all duration-200 hover:shadow-2xl overflow-hidden ${typeContainerColors[data.type]}`}
    >
      <Handle type="target" position={Position.Top} className="!w-8 !h-8 !-mt-4 !bg-indigo-400/50" />
      
      <div className={`px-3 py-1 font-bold text-lg ${typeHeaderColors[data.type]}`}>
        <select 
          value={data.type} 
          onChange={handleTypeChange}
          className="bg-transparent text-white font-bold w-full outline-none border-none"
          aria-label="Select node type"
        >
          {data.type === NodeType.Unclassified && (
            <option value={NodeType.Unclassified} disabled>Unclassified</option>
          )}
          <option value={NodeType.Cause} className="text-black">Cause</option>
          <option value={NodeType.Effect} className="text-black">Effect</option>
          <option value={NodeType.CauseEffect} className="text-black">Cause/Effect</option>
        </select>
      </div>
      
      <div className="p-3 bg-white min-h-[80px]">
        <div
          className="text-gray-800 text-xl leading-snug w-full"
          aria-label="Node label"
        >
          {data.label}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!w-8 !h-8 !-mb-4 !bg-indigo-400/50" />
    </div>
  );
};

export default memo(CustomNode);