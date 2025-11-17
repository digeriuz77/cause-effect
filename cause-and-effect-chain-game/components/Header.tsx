
import React from 'react';
import { AwardIcon, RotateCcwIcon } from './Icons';

interface HeaderProps {
  score: number;
  onReset: () => void;
  title: string;
  onOpenAdmin: () => void;
}

const Header: React.FC<HeaderProps> = ({ score, onReset, title, onOpenAdmin }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenAdmin}
          className="p-1 rounded-full hover:bg-yellow-100 transition-colors"
          aria-label="Open Admin Panel"
        >
          <AwardIcon className="w-8 h-8 text-yellow-500 flex-shrink-0" />
        </button>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 tracking-tight">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="bg-yellow-100 text-yellow-800 font-bold px-4 py-2 rounded-full text-lg shadow-sm border border-yellow-200">
          Score: {score}
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <RotateCcwIcon className="w-5 h-5" />
          Reset
        </button>
      </div>
    </div>
  );
};

export default Header;