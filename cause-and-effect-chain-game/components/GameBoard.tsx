import React, { useMemo } from 'react';
import { ConnectionGroup, ElementType, ElementsMap } from '../types';
import ElementNode from './ElementNode';

interface GameBoardProps {
  elements: ElementsMap;
  connectionGroups: ConnectionGroup[];
  selectedCauses: Set<string>;
  selectedEffect: string | null;
  availableElements: Set<string>;
  onElementClick: (id: string) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ elements, connectionGroups, selectedCauses, selectedEffect, availableElements, onElementClick }) => {
  const boardHeight = useMemo(() => {
    const allElements = Object.values(elements);
    if (allElements.length === 0) {
      return 500; // A sensible default height if there are no elements
    }
    // Find the maximum y-coordinate among all elements
    const maxY = allElements.reduce((max, el) => Math.max(max, el.y), 0);
    
    // Define element height and desired bottom padding
    const elementHeight = 112; // from h-28 (7rem * 16px/rem)
    const padding = 40; // 40px of space below the lowest element
    
    return maxY + elementHeight + padding;
  }, [elements]);

  return (
    <div 
      className="relative w-full bg-gradient-to-br from-gray-50 to-slate-100 rounded-lg border-2 border-gray-200 p-4 mb-6 overflow-auto shadow-inner"
      style={{ height: `${boardHeight}px` }}
    >
      <svg 
        className="absolute top-0 left-0 w-full h-full pointer-events-none" 
        style={{ minWidth: '2400px' }}
      >
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9.5" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-emerald-500" />
          </marker>
        </defs>
        {connectionGroups.flatMap((group, groupIndex) => {
          const toEl = elements[group.effect];
          if (!toEl) return [];

          return group.causes.map((causeId, causeIndex) => {
            const fromEl = elements[causeId];
            if (!fromEl) return null;

            const x1 = fromEl.x + 160; // width of element
            const y1 = fromEl.y + 56;  // height/2 of element
            const x2 = toEl.x;
            const y2 = toEl.y + 56;

            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;

            return (
              <React.Fragment key={`${groupIndex}-${causeIndex}-${causeId}-${group.effect}`}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  className="stroke-emerald-500"
                  strokeWidth="3"
                  markerEnd="url(#arrowhead)"
                />
                <text
                  x={midX}
                  y={midY - 10}
                  textAnchor="middle"
                  className="fill-gray-700 font-semibold text-sm"
                  style={{ paintOrder: 'stroke', stroke: 'white', strokeWidth: '4px', strokeLinejoin: 'round' }}
                >
                  {group.phrase}
                </text>
              </React.Fragment>
            );
          });
        })}
      </svg>

      <div className="relative w-full h-full" style={{ minWidth: '2400px' }}>
        {Object.entries(elements).map(([id, element]) => {
          // An element is clickable if it's a potential effect (Effect or EffectCause) OR
          // if it's a pure Cause that has been unlocked. This allows selecting an
          // element as an effect target at any time.
          const isClickable =
            element.type === ElementType.Effect ||
            element.type === ElementType.EffectCause ||
            (element.type === ElementType.Cause && availableElements.has(id));

          return (
            <ElementNode
              key={id}
              id={id}
              data={element}
              isSelected={selectedCauses.has(id) || selectedEffect === id}
              isClickable={isClickable}
              onClick={onElementClick}
            />
          );
        })}
      </div>
    </div>
  );
};

export default GameBoard;