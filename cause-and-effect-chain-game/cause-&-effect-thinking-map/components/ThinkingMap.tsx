import { useState, useCallback, useMemo, createContext, useEffect } from 'react';
import type { FC } from 'react';
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  Node,
  Edge,
  OnEdgesChange,
  OnConnect,
  NodeTypes,
  EdgeTypes,
  Connection,
  applyNodeChanges,
  OnNodesChange,
} from 'reactflow';
import { nanoid } from 'nanoid';
import { GoogleGenAI, Type } from '@google/genai';

import CustomNode from './CustomNode';
import AnnotatedEdge from './AnnotatedEdge';
import SidePanel from './SidePanel';
import SaveModal from './SaveModal';
import Toast from './Toast';
import { NodeType, CustomNodeData, AnnotatedEdgeData } from '../types';
import { Trash2, Save, X, Loader } from './Icons';
import type { MapData } from '../data/maps/types';

// Context to provide update functionality to child components (CustomNode, AnnotatedEdge)
export const MapContext = createContext({
  updateNodeData: (nodeId: string, data: Partial<CustomNodeData>) => {},
  updateEdgeData: (edgeId: string, data: Partial<AnnotatedEdgeData>) => {},
});

// --- Connection Justification Modal ---
interface ConnectionModalProps {
  sourceNode: Node<CustomNodeData> | null;
  targetNode: Node<CustomNodeData> | null;
  onClose: () => void;
  onConfirm: (justification: string) => void;
}

const ConnectionModal: FC<ConnectionModalProps> = ({ sourceNode, targetNode, onClose, onConfirm }) => {
  const [justifications, setJustifications] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string>('');
  const [custom, setCustom] = useState('');

  useEffect(() => {
    if (!sourceNode || !targetNode) return;

    const fetchJustifications = async () => {
      setLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `Given a cause: "${sourceNode.data.label}" and a potential effect: "${targetNode.data.label}", generate three concise and distinct justification phrases (under 10 words each) that explain the connection. These phrases will be used as labels on a connecting arrow in an educational thinking map.`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                justifications: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.STRING,
                    description: "A concise justification phrase under 10 words."
                  }
                }
              }
            }
          }
        });

        const json = JSON.parse(response.text);
        if (json.justifications && Array.isArray(json.justifications) && json.justifications.length > 0) {
            setJustifications(json.justifications);
        } else {
            throw new Error("Invalid response format from AI.");
        }
      } catch (error) {
        console.error("Error fetching justifications:", error);
        // Fallback in case of API error
        setJustifications([
            'Leads to',
            'Results in',
            'Causes',
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchJustifications();
  }, [sourceNode, targetNode]);

  const handleConfirm = () => {
    if (selected === 'custom' && custom.trim()) {
      onConfirm(custom.trim());
    } else if (selected && selected !== 'custom') {
      onConfirm(selected);
    }
  };

  if (!sourceNode || !targetNode) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg flex flex-col animate-fade-in-up">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Why does this connection matter?</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200" aria-label="Close modal">
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-gray-600">Connecting <strong className="text-rose-600">"{sourceNode.data.label}"</strong> to <strong className="text-sky-600">"{targetNode.data.label}"</strong>.</p>
          <p className="font-semibold text-gray-700">Choose a justification or write your own:</p>
          {loading ? (
             <div className="flex items-center justify-center h-48">
                <Loader className="w-12 h-12 animate-spin text-indigo-600" />
                <p className="sr-only">Loading justifications...</p>
             </div>
          ) : (
            <div className="space-y-3">
              {justifications.map((j, index) => (
                <button 
                  key={index} 
                  onClick={() => setSelected(j)}
                  className={`w-full text-left p-3 border rounded-lg transition-all duration-200 ${selected === j ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-gray-50 hover:bg-indigo-100 hover:border-indigo-300'}`}
                >
                  {j}
                </button>
              ))}
              <div 
                 className={`p-3 border rounded-lg transition-all duration-200 cursor-text ${selected === 'custom' ? 'bg-indigo-100 border-indigo-500' : 'bg-gray-50'}`}
              >
                 <label htmlFor="custom-justification" className="font-medium text-gray-700">Write your own:</label>
                 <input
                    type="text"
                    id="custom-justification"
                    value={custom}
                    onChange={(e) => setCustom(e.target.value)}
                    onFocus={() => setSelected('custom')}
                    placeholder="e.g., This was a direct result..."
                    className="mt-1 block w-full bg-white border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                />
              </div>
            </div>
          )}
        </div>
        <div className="p-4 border-t bg-gray-50 text-right">
           <button 
            onClick={handleConfirm} 
            disabled={!selected || (selected === 'custom' && !custom.trim())}
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Confirm Connection
          </button>
        </div>
      </div>
    </div>
  );
};


// --- Main Thinking Map Component ---
interface ThinkingMapProps {
  mapData: MapData;
}

const ThinkingMap: FC<ThinkingMapProps> = ({ mapData }) => {
  const { nodes: sourceNodes, config } = mapData;

  const initializeNodes = useCallback((): Node<CustomNodeData>[] => {
    const canvasWidth = 1200;
    const canvasHeight = 1000;
    
    return sourceNodes.map(node => ({
      ...node,
      position: {
        x: Math.random() * (canvasWidth - 250),
        y: Math.random() * (canvasHeight - 150),
      },
      data: {
        ...node.data,
        type: Math.random() < config.unclassifiedRatio ? NodeType.Unclassified : node.data.type,
      },
    }));
  }, [sourceNodes, config]);

  const [nodes, setNodes] = useState<Node<CustomNodeData>[]>(initializeNodes);
  const [edges, setEdges] = useState<Edge<AnnotatedEdgeData>[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });
  const [pendingConnection, setPendingConnection] = useState<Connection | null>(null);
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast({ message: '', visible: false });
    }, 3000);
  }, []);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  
  const updateNodeData = useCallback((nodeId: string, data: Partial<CustomNodeData>) => {
    setNodes((nds) => 
      nds.map((node) => 
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      )
    );
  }, [setNodes]);

  const updateEdgeData = useCallback((edgeId: string, data: Partial<AnnotatedEdgeData>) => {
    setEdges((eds) =>
      eds.map((edge) =>
        edge.id === edgeId ? { ...edge, data: { ...edge.data, ...data } } : edge
      )
    );
  }, [setEdges]);

  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      const sourceNode = nodes.find(node => node.id === connection.source);
      const targetNode = nodes.find(node => node.id === connection.target);

      if (!sourceNode || !targetNode) return;

      // Rule 0: Nodes must be classified before connecting
      if (sourceNode.data.type === NodeType.Unclassified || targetNode.data.type === NodeType.Unclassified) {
        showToast("Please classify all nodes before connecting them.");
        return;
      }
      
      // Rule 1: A pure 'Effect' node cannot be the source of a connection.
      if (sourceNode.data.type === NodeType.Effect) {
        showToast("An 'Effect' cannot cause something else. Change its type to 'Cause/Effect' to connect it.");
        return;
      }
      
      // Rule 2: A cause must happen before its effect (chronological validation).
      if (sourceNode.data.sequence >= targetNode.data.sequence) {
        showToast("A cause must happen before its effect. Please check the timeline.");
        return;
      }
      
      setPendingConnection(connection);
      setIsConnectionModalOpen(true);
    },
    [nodes, showToast]
  );
  
  const handleConfirmConnection = useCallback((justification: string) => {
    if (!pendingConnection) return;
    
    const newEdge: Edge<AnnotatedEdgeData> = {
      id: nanoid(),
      ...pendingConnection,
      type: 'annotated',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
      data: { label: justification },
    };
    setEdges((eds) => addEdge(newEdge, eds));

    // Cleanup
    setIsConnectionModalOpen(false);
    setPendingConnection(null);
  }, [pendingConnection]);


  const nodeTypes: NodeTypes = useMemo(() => ({ custom: CustomNode }), []);
  const edgeTypes: EdgeTypes = useMemo(() => ({ annotated: AnnotatedEdge }), []);

  const resetMap = useCallback(() => {
    setNodes(initializeNodes());
    setEdges([]);
  }, [initializeNodes, setNodes, setEdges]);

  const saveMap = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  return (
    <div className="flex flex-grow w-full">
      <SidePanel nodes={sourceNodes} edges={edges} />
      <div className="flex-grow h-full relative">
        <MapContext.Provider value={{ updateNodeData, updateEdgeData }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            className="bg-indigo-50/30"
          >
            <Controls />
            <MiniMap nodeStrokeWidth={3} zoomable pannable />
            <Background gap={16} color="#e0e0e0" />
          </ReactFlow>
        </MapContext.Provider>
        <Toast message={toast.message} isVisible={toast.visible} />
        <div className="absolute top-4 left-4 z-10 flex space-x-2">
          <button
            onClick={resetMap}
            className="px-4 py-2 bg-white border-2 border-red-500 text-red-600 font-semibold rounded-lg shadow-md hover:bg-red-50 transition-colors duration-200 flex items-center space-x-2"
          >
            <Trash2 className="w-5 h-5" />
            <span>Reset Map</span>
          </button>
          <button
            onClick={saveMap}
            className="px-4 py-2 bg-white border-2 border-green-500 text-green-600 font-semibold rounded-lg shadow-md hover:bg-green-50 transition-colors duration-200 flex items-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>Save</span>
          </button>
        </div>
        {isModalOpen && <SaveModal nodes={nodes} edges={edges} onClose={() => setIsModalOpen(false)} />}
        {isConnectionModalOpen && (
            <ConnectionModal
                sourceNode={nodes.find(n => n.id === pendingConnection?.source) || null}
                targetNode={nodes.find(n => n.id === pendingConnection?.target) || null}
                onClose={() => setIsConnectionModalOpen(false)}
                onConfirm={handleConfirmConnection}
            />
        )}
      </div>
    </div>
  );
};

export default ThinkingMap;