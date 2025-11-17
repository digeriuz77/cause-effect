
import { useMemo } from 'react';
import type { FC } from 'react';
import type { Node, Edge } from 'reactflow';
import type { CustomNodeData, AnnotatedEdgeData } from '../types';

interface SidePanelProps {
    nodes: Node<CustomNodeData>[]; // All nodes for reference
    edges: Edge<AnnotatedEdgeData>[]; // Current connections for summary
}

const SidePanel: FC<SidePanelProps> = ({ nodes, edges }) => {

    const sortedNodes = useMemo(() => {
        return [...nodes].sort((a, b) => a.data.sequence - b.data.sequence);
    }, [nodes]);

    const summary = useMemo(() => {
        if (edges.length === 0) {
            return (
                <p className="text-gray-500 italic">
                    Your generated explanation will appear here. Draw connections on the map to begin.
                </p>
            );
        }
        
        // Find the current nodes on the map to get their labels
        const nodeMap = new Map(nodes.map(n => [n.id, n.data]));

        const sentences = edges.map(edge => {
            const sourceNodeData = nodeMap.get(edge.source);
            const targetNodeData = nodeMap.get(edge.target);

            if (sourceNodeData && targetNodeData && edge.data) {
                const sourceLabel = sourceNodeData.label.charAt(0).toUpperCase() + sourceNodeData.label.slice(1);
                return (
                    <span key={edge.id}>
                        {sourceLabel}
                        {' '}
                        <strong className="text-red-600 font-semibold">{edge.data.label}</strong>
                        {' '}
                        {targetNodeData.label}.
                    </span>
                );
            }
            return null;
        }).filter(Boolean);

        return (
            <ul className="space-y-3">
                {sentences.map((sentence, index) => (
                    <li key={index} className="text-gray-700 leading-relaxed">{sentence}</li>
                ))}
            </ul>
        );

    }, [nodes, edges]);

    return (
        <div className="w-[400px] flex-shrink-0 h-full bg-white shadow-lg p-6 flex flex-col space-y-6 overflow-y-auto border-r border-gray-200">
            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-3 border-b-2 border-indigo-200 pb-2">Key Events to Connect</h2>
                <ul className="space-y-3 text-base text-gray-600 list-decimal list-inside">
                    {sortedNodes.map(node => (
                        <li key={node.id}>{node.data.label}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2 border-b-2 border-indigo-200 pb-2">Your Explanation</h2>
                <div className="prose prose-base max-w-none">
                    {summary}
                </div>
            </div>
        </div>
    );
}

export default SidePanel;