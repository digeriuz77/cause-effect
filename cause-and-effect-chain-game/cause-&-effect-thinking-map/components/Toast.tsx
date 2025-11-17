
import type { FC } from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
}

const Toast: FC<ToastProps> = ({ message, isVisible }) => {
  return (
    <div
      className={`absolute top-4 left-1/2 -translate-x-1/2 z-20 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-lg transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
    >
      {message}
    </div>
  );
};

export default Toast;