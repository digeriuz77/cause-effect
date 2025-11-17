
import type { FC } from 'react';
import type { Node, Edge } from 'reactflow';
import { X } from './Icons';

interface SaveModalProps {
  nodes: Node[];
  edges: Edge[];
  onClose: () => void;
}

const SaveModal: FC<SaveModalProps> = ({ nodes, edges, onClose }) => {
  const dataToSave = {
    nodes: nodes.map(({ id, position, data }) => ({ id, position, data: { label: data.label, type: data.type, sequence: data.sequence } })),
    edges: edges.map(({ id, source, target, data }) => ({ id, source, target, data })),
    timestamp: new Date().toISOString(),
  };

  const dataString = JSON.stringify(dataToSave, null, 2);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Saved Map Data</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        <div className="p-4 overflow-auto">
          <pre className="bg-gray-100 p-4 rounded text-sm text-gray-700 whitespace-pre-wrap break-words">
            <code>{dataString}</code>
          </pre>
        </div>
        <div className="p-4 border-t text-right">
           <button 
            onClick={onClose} 
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveModal;