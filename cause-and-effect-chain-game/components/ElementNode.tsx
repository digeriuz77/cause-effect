
import React from 'react';
import { ElementData, ElementType } from '../types';
import { CheckCircleIcon } from './Icons';

interface ElementNodeProps {
  id: string;
  data: ElementData;
  isSelected: boolean;
  isClickable: boolean;
  onClick: (id: string) => void;
}

const ElementNode: React.FC<ElementNodeProps> = ({ id, data, isSelected, isClickable, onClick }) => {
  const typeStyles = {
    [ElementType.Cause]: 'bg-rose-100 border-rose-400 hover:bg-rose-200',
    [ElementType.EffectCause]: 'bg-violet-100 border-violet-400 hover:bg-violet-200',
    [ElementType.Effect]: 'bg-sky-100 border-sky-400 hover:bg-sky-200',
  };

  let finalClassName = "w-40 h-28 rounded-xl border-2 p-2 flex flex-col items-center justify-center text-center transition-all duration-300 shadow-md";

  if (!isClickable) {
    finalClassName += " bg-gray-200 border-gray-300 opacity-60 cursor-not-allowed";
  } else if (isSelected) {
    finalClassName += " border-yellow-500 bg-yellow-200 shadow-xl scale-105 ring-4 ring-yellow-300 cursor-pointer";
  } else {
    finalClassName += ` ${typeStyles[data.type]} cursor-pointer hover:shadow-lg hover:scale-105`;
  }

  return (
    <div
      className={finalClassName}
      style={{ position: 'absolute', left: data.x, top: data.y }}
      onClick={() => isClickable && onClick(id)}
    >
      {isSelected && (
        <CheckCircleIcon className="absolute -top-3 -right-3 w-6 h-6 text-yellow-600 bg-white rounded-full" />
      )}
      <div className="text-3xl mb-1 select-none">{data.emoji}</div>
      <div className="text-xs font-semibold leading-tight text-gray-700 select-none">
        {data.text}
      </div>
    </div>
  );
};

export default ElementNode;
