
import React from 'react';

interface FeedbackBarProps {
  message: string;
  type: 'success' | 'error' | 'info';
}

const FeedbackBar: React.FC<FeedbackBarProps> = ({ message, type }) => {
  const baseClasses = "p-3 rounded-lg mb-6 border-l-4 text-sm font-medium transition-all duration-300";
  const typeClasses = {
    info: 'bg-blue-50 border-blue-400 text-blue-800',
    success: 'bg-green-50 border-green-400 text-green-800',
    error: 'bg-red-50 border-red-400 text-red-800',
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <p>{message}</p>
    </div>
  );
};

export default FeedbackBar;
