import React from 'react';
import { ConnectionGroup, ElementsMap } from '../types';
import { LinkIcon } from './Icons';

interface ControlPanelProps {
  elements: ElementsMap;
  selectedCauses: Set<string>;
  selectedEffect: string | null;
  connectionGroups: ConnectionGroup[];
  onMakeConnection: () => void;
}

const InfoPill: React.FC<{ elements: ElementsMap; label: string; values: string[]; colorClass: string }> = ({ elements, label, values, colorClass }) => (
    <div>
        <span className="text-sm font-medium text-gray-500">{label}: </span>
        {values.length === 0 ? (
            <span className="text-gray-400">None</span>
        ) : (
            values.map(value => (
                <span key={value} className={`font-semibold px-2 py-1 rounded-md text-sm mr-1 ${colorClass}`}>
                    {elements[value]?.text}
                </span>
            ))
        )}
    </div>
);

const ControlPanel: React.FC<ControlPanelProps> = ({ elements, selectedCauses, selectedEffect, connectionGroups, onMakeConnection }) => {
  const canConnect = selectedCauses.size > 0 && selectedEffect;
  const totalConnections = connectionGroups.reduce((acc, group) => acc + group.causes.length, 0);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="grid grid-cols-1 gap-y-2 mb-3">
            <InfoPill elements={elements} label="Causes" values={Array.from(selectedCauses)} colorClass="bg-rose-100 text-rose-800" />
            <InfoPill elements={elements} label="Effect" values={selectedEffect ? [selectedEffect] : []} colorClass="bg-sky-100 text-sky-800" />
          </div>
           <div className="text-sm text-gray-500">
            Total connections made: <span className="font-bold">{totalConnections}</span>
          </div>
        </div>

        <button
          onClick={onMakeConnection}
          disabled={!canConnect}
          className={`flex items-center gap-3 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
            canConnect
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <LinkIcon className="w-5 h-5" />
          Make Connection
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;