
import React from 'react';
import { RotateCcwIcon } from './Icons';
import { SimpleTooltip } from './TranslationTooltip';

interface HeaderProps {
  score: number;
  onReset: () => void;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ score, onReset, title }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 tracking-tight">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <SimpleTooltip bmText="Skor" enabled={true}>
          <div className="bg-yellow-100 text-yellow-800 font-bold px-4 py-2 rounded-full text-lg shadow-sm border border-yellow-200">
            Score: {score}
          </div>
        </SimpleTooltip>
        <SimpleTooltip bmText="Set Semula" enabled={true}>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <RotateCcwIcon className="w-5 h-5" />
            Reset
          </button>
        </SimpleTooltip>
      </div>
    </div>
  );
};

export default Header;