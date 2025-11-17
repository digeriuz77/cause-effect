import React, { useState } from 'react';
import { findTranslationByText } from '../translations/bahasaMelayu';

interface TranslationTooltipProps {
  text: string;
  children: React.ReactNode;
  className?: string;
  enabled?: boolean; // Allow toggling tooltips on/off
}

/**
 * Tooltip component that shows Bahasa Melayu translation on hover
 * Wraps any text element and automatically looks up the translation
 */
const TranslationTooltip: React.FC<TranslationTooltipProps> = ({
  text,
  children,
  className = '',
  enabled = true
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Look up translation
  const translation = findTranslationByText(text);

  // If no translation found or disabled, just render children
  if (!translation || !enabled) {
    return <>{children}</>;
  }

  return (
    <span
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}

      {/* Tooltip */}
      {isVisible && (
        <span className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap pointer-events-none animate-fadeIn">
          {/* BM Translation */}
          <span className="block font-semibold">{translation.bm}</span>

          {/* Context if available */}
          {translation.context && (
            <span className="block text-xs text-gray-300 mt-1">
              {translation.context}
            </span>
          )}

          {/* Arrow pointing down */}
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
            <svg width="10" height="5" viewBox="0 0 10 5">
              <path d="M0 0 L5 5 L10 0 Z" fill="#111827" />
            </svg>
          </span>
        </span>
      )}
    </span>
  );
};

/**
 * Simpler tooltip component that accepts BM translation directly
 */
export const SimpleTooltip: React.FC<{
  bmText: string;
  children: React.ReactNode;
  context?: string;
  enabled?: boolean;
}> = ({ bmText, children, context, enabled = true }) => {
  const [isVisible, setIsVisible] = useState(false);

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}

      {isVisible && (
        <span className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap pointer-events-none animate-fadeIn">
          <span className="block font-semibold">{bmText}</span>

          {context && (
            <span className="block text-xs text-gray-300 mt-1 max-w-xs whitespace-normal">
              {context}
            </span>
          )}

          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
            <svg width="10" height="5" viewBox="0 0 10 5">
              <path d="M0 0 L5 5 L10 0 Z" fill="#111827" />
            </svg>
          </span>
        </span>
      )}
    </span>
  );
};

export default TranslationTooltip;
