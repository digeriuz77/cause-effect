
import React from 'react';

interface InstructionsProps {
    title: string;
    description: string;
    story?: string;
    stageComponent?: 'video' | 'chain' | 'analysis' | 'write';
}

const LegendItem: React.FC<{ colorClass: string; label: string }> = ({ colorClass, label }) => (
  <div className="flex items-center gap-2">
    <div className={`w-4 h-4 ${colorClass} rounded border border-gray-300`}></div>
    <span className="text-gray-600">{label}</span>
  </div>
);

const stageInstructions = {
    video: "Watch the video to learn about the topic. Then, answer the comprehension questions to check your understanding before moving on.",
    chain: "Connect causes to effects to reveal how events create a chain reaction! Click one or more causes, then an effect, and hit 'Make Connection'.",
    analysis: "Read the story and use the highlighters. The red words are connectors. Highlight the CAUSE before the red words and the EFFECT after them.",
    write: "Use the word banks to build proper cause-and-effect sentences. Show your understanding of how one event leads to another!"
};


const Instructions: React.FC<InstructionsProps> = ({ title, description, story, stageComponent }) => {
  const stageDescription = stageComponent ? stageInstructions[stageComponent] : description;
  const showStory = story && (stageComponent === 'analysis');
  
  return (
    <div className="bg-white p-4 rounded-lg mb-6 border border-gray-200 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-700 mb-2">🎯 Mission: {title.split(': ')[1]}</h2>
      <p className="text-gray-600 mb-4">
        {stageDescription}
      </p>
      
      {showStory && (
        <div className="mb-4 mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
            <h3 className="font-semibold text-gray-700 mb-2">Story Text</h3>
            <div className="prose prose-sm text-gray-600 space-y-4">
                {story.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>
        </div>
      )}

      {stageComponent === 'chain' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm pt-4 border-t border-gray-200">
          <LegendItem colorClass="bg-rose-200" label="Starting Causes" />
          <LegendItem colorClass="bg-violet-200" label="Effect → Cause" />
          <LegendItem colorClass="bg-sky-200" label="Final Effects" />
          <LegendItem colorClass="bg-yellow-300" label="Selected Item" />
        </div>
      )}
    </div>
  );
};

export default Instructions;
