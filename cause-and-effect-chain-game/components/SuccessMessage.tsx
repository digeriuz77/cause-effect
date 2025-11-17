
import React from 'react';
import { AwardIcon } from './Icons';

interface SuccessMessageProps {
    title: string;
    children: React.ReactNode;
    buttonText?: string;
    onNext?: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ title, children, buttonText, onNext }) => {
  return (
    <div className="mt-6 bg-green-100 border-t-4 border-green-500 rounded-b text-green-900 px-4 py-3 shadow-md" role="alert">
        <div className="flex flex-col sm:flex-row items-center gap-4">
            <AwardIcon className="w-10 h-10 text-green-600 flex-shrink-0" />
            <div className="flex-grow">
                <p className="font-bold text-lg">{title}</p>
                <p className="text-sm">{children}</p>
            </div>
            {onNext && buttonText && (
                <button 
                    onClick={onNext}
                    className="mt-2 sm:mt-0 px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
                >
                    {buttonText} &rarr;
                </button>
            )}
        </div>
    </div>
  );
};

export default SuccessMessage;
