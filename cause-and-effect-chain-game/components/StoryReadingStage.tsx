import React from 'react';
import { SimpleTooltip } from './TranslationTooltip';

interface StoryReadingStageProps {
  story: string;
  onNext: () => void;
  nextStageTitle?: string;
}

/**
 * Simple component for reading the story BEFORE building chains
 * Shows story in an easy-to-read format with a Next button
 */
const StoryReadingStage: React.FC<StoryReadingStageProps> = ({
  story,
  onNext,
  nextStageTitle
}) => {
  // Split story into paragraphs
  const paragraphs = story.split('\n\n').filter(p => p.trim().length > 0);

  return (
    <div className="space-y-6">
      {/* Story Display */}
      <div className="bg-white p-6 rounded-lg border-2 border-blue-200 shadow-sm">
        <div className="prose prose-lg max-w-none">
          {paragraphs.map((paragraph, index) => {
            // Check if paragraph is a heading (starts with **)
            if (paragraph.trim().startsWith('**')) {
              const headingText = paragraph.replace(/\*\*/g, '').trim();
              return (
                <h3 key={index} className="text-xl font-bold text-blue-900 mt-6 mb-3">
                  {headingText}
                </h3>
              );
            }

            return (
              <p key={index} className="text-gray-800 leading-relaxed mb-4 text-lg">
                {paragraph}
              </p>
            );
          })}
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-center">
        <SimpleTooltip bmText="Seterusnya" enabled={true}>
          <button
            onClick={onNext}
            className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            {nextStageTitle ? `Next: ${nextStageTitle}` : 'Next'}
          </button>
        </SimpleTooltip>
      </div>

      {/* Reading Tips */}
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <p className="text-sm text-yellow-900">
          <strong>💡 Tip:</strong> Look for CAUSES (what makes things happen) and EFFECTS (what happens as a result).
        </p>
      </div>
    </div>
  );
};

export default StoryReadingStage;
