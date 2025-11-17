import React from 'react';
import { ConnectionGroup, ElementsMap } from '../types';

interface CausalChainDisplayProps {
    elements: ElementsMap;
    connectionGroups: ConnectionGroup[];
}

const CausalChainDisplay: React.FC<CausalChainDisplayProps> = ({ elements, connectionGroups }) => {
    if (connectionGroups.length === 0) {
        return (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 text-center text-gray-500">
                Your cause-and-effect story will appear here as you make connections.
            </div>
        );
    }

    const formatCauses = (causes: string[]) => {
        if (causes.length === 0) return '';
        if (causes.length === 1) return <span className="font-semibold text-rose-700">{elements[causes[0]].text}</span>;
        
        return causes.map((cause, index) => (
            <React.Fragment key={cause}>
                <span className="font-semibold text-rose-700">{elements[cause].text}</span>
                {index < causes.length - 2 ? ', ' : (index < causes.length - 1 ? ' and ' : '')}
            </React.Fragment>
        ));
    };

    return (
        <div className="mt-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 tracking-tight">The Story of the Events</h3>
            <div className="space-y-3">
                {connectionGroups.map((group, index) => (
                    <div key={index} className="flex items-start gap-4 text-gray-800 leading-relaxed text-base bg-gray-50 p-3 rounded-md">
                        <div className="flex-shrink-0 flex -space-x-2">
                           {group.causes.map(causeId => (
                                <span key={causeId} className="text-2xl" title={elements[causeId].text}>{elements[causeId].emoji}</span>
                           ))}
                        </div>
                        <div>
                            {formatCauses(group.causes)}
                            <span className="text-gray-500 font-medium"> {group.phrase} </span>
                            <span className="font-semibold text-sky-700">{elements[group.effect].text}</span>
                            <span>.</span>
                        </div>
                         <span className="text-2xl ml-auto flex-shrink-0" title={elements[group.effect].text}>{elements[group.effect].emoji}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CausalChainDisplay;