import React, { useState, useMemo } from 'react';
import { ElementsMap, ConnectionGroup } from '../types';
import { SENTENCE_PARTS } from '../constants';
import { calculateSOLOLevel, SOLO_LEVEL_INFO, SOLOLevel } from '../utils/soloTaxonomy';
import { SOLOBadge } from './SOLOProgressIndicator';
import TranslationTooltip, { SimpleTooltip } from './TranslationTooltip';
import SuccessMessage from './SuccessMessage';

interface ParagraphBuilderStageProps {
  elements: ElementsMap;
  connections: ConnectionGroup[];
}

interface Sentence {
  text: string;
  soloLevel: SOLOLevel;
  causesUsed: number;
}

/**
 * Enhanced paragraph builder that guides students to write
 * paragraphs demonstrating relational knowledge
 */
const ParagraphBuilderStage: React.FC<ParagraphBuilderStageProps> = ({
  elements,
  connections
}) => {
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [currentSentence, setCurrentSentence] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

  const causesFromElements = useMemo(() => {
    return Object.values(elements).filter(
      el => el.type === 'cause' || el.type === 'effect-cause'
    );
  }, [elements]);

  const effectsFromElements = useMemo(() => {
    return Object.values(elements).filter(
      el => el.type === 'effect' || el.type === 'effect-cause'
    );
  }, [elements]);

  // Scaffolded prompts for each sentence
  const prompts = [
    {
      title: "Start with the main cause",
      prompt: "Introduce the main cause or starting point of this process.",
      bmTranslation: "Mulakan dengan sebab utama",
      example: "Due to the presence of moisture in the atmosphere...",
      minSolo: SOLOLevel.UniStructural
    },
    {
      title: "Add another cause or factor",
      prompt: "Identify a second factor that contributes to the effect.",
      bmTranslation: "Tambah satu lagi sebab atau faktor",
      example: "Combined with unstable air, this creates conditions for...",
      minSolo: SOLOLevel.MultiStructural
    },
    {
      title: "Explain how causes work together",
      prompt: "Show how multiple causes interact or combine to create the effect.",
      bmTranslation: "Jelaskan bagaimana sebab-sebab bekerjasama",
      example: "When these factors interact, they result in...",
      minSolo: SOLOLevel.Relational
    },
    {
      title: "Describe the final effect",
      prompt: "State the final outcome or effect clearly.",
      bmTranslation: "Huraikan kesan akhir",
      example: "Consequently, this leads to the formation of...",
      minSolo: SOLOLevel.UniStructural
    },
    {
      title: "Apply to a new context (Optional)",
      prompt: "Can you think of another situation where this same pattern applies?",
      bmTranslation: "Gunakan dalam konteks baru",
      example: "This same principle can be seen in...",
      minSolo: SOLOLevel.ExtendedAbstract
    }
  ];

  const currentPrompt = prompts[currentStep];

  // Analyze current sentence to determine SOLO level
  const analyzeSentence = (text: string): { soloLevel: SOLOLevel; causesUsed: number } => {
    const lowerText = text.toLowerCase();

    // Count how many cause elements are mentioned
    const causesUsed = causesFromElements.filter(cause =>
      lowerText.includes(cause.text.toLowerCase())
    ).length;

    const effectsUsed = effectsFromElements.filter(effect =>
      lowerText.includes(effect.text.toLowerCase())
    ).length;

    // Check for connective phrases indicating relational thinking
    const relationalPhrases = [
      'interact', 'combine', 'work together', 'together with',
      'when these', 'both', 'along with', 'as well as'
    ];
    const hasRelationalLanguage = relationalPhrases.some(phrase =>
      lowerText.includes(phrase)
    );

    // Check for extended abstract indicators
    const extendedPhrases = [
      'this same', 'similar to', 'applies to', 'can be seen in',
      'another example', 'this principle', 'pattern'
    ];
    const hasExtendedLanguage = extendedPhrases.some(phrase =>
      lowerText.includes(phrase)
    );

    // Determine SOLO level
    let soloLevel: SOLOLevel;

    if (hasExtendedLanguage) {
      soloLevel = SOLOLevel.ExtendedAbstract;
    } else if (hasRelationalLanguage && causesUsed >= 2) {
      soloLevel = SOLOLevel.Relational;
    } else if (causesUsed >= 2 && effectsUsed >= 1) {
      soloLevel = SOLOLevel.MultiStructural;
    } else if (causesUsed >= 1 || effectsUsed >= 1) {
      soloLevel = SOLOLevel.UniStructural;
    } else {
      soloLevel = SOLOLevel.PreStructural;
    }

    return { soloLevel, causesUsed };
  };

  const addSentence = () => {
    if (currentSentence.trim().length < 10) {
      alert('Please write a more complete sentence (at least 10 characters).');
      return;
    }

    const analysis = analyzeSentence(currentSentence);
    setSentences(prev => [...prev, { text: currentSentence.trim(), ...analysis }]);
    setCurrentSentence('');

    if (currentStep < prompts.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const insertWord = (word: string) => {
    setCurrentSentence(prev => {
      const needsSpace = prev.length > 0 && !prev.endsWith(' ');
      return prev + (needsSpace ? ' ' : '') + word;
    });
  };

  const clearCurrentSentence = () => {
    setCurrentSentence('');
  };

  const deleteSentence = (index: number) => {
    setSentences(prev => prev.filter((_, i) => i !== index));
    if (currentStep > index) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const isComplete = sentences.length >= 3;
  const hasRelationalThinking = sentences.some(s =>
    s.soloLevel === SOLOLevel.Relational ||
    s.soloLevel === SOLOLevel.ExtendedAbstract
  );

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
      {/* Instructions */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
        <SimpleTooltip bmText="Tulis Perenggan Anda" enabled={true}>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            📝 Write Your Paragraph
          </h3>
        </SimpleTooltip>
        <p className="text-gray-700">
          Build a paragraph that shows your understanding of how causes and effects work together.
          Follow the prompts below to demonstrate <strong>relational thinking</strong>.
        </p>
      </div>

      {/* Completed Sentences */}
      {sentences.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <SimpleTooltip bmText="Perenggan Anda" enabled={true}>
              <h4 className="font-semibold text-gray-800">Your Paragraph:</h4>
            </SimpleTooltip>
            <span className="text-sm text-gray-600">
              {sentences.length} sentence{sentences.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="space-y-3">
            {sentences.map((sentence, index) => (
              <div key={index} className="bg-white p-3 rounded border border-gray-300 relative">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <p className="text-gray-800 leading-relaxed">{sentence.text}</p>
                  </div>
                  <button
                    onClick={() => deleteSentence(index)}
                    className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded hover:bg-red-50"
                    title="Delete this sentence"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <SOLOBadge level={sentence.soloLevel} />
                  {sentence.causesUsed > 0 && (
                    <span className="text-xs text-gray-600">
                      {sentence.causesUsed} cause{sentence.causesUsed !== 1 ? 's' : ''} mentioned
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Sentence Builder */}
      {currentStep < prompts.length && (
        <div className="space-y-4">
          {/* Prompt */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start justify-between mb-2">
              <div>
                <SimpleTooltip bmText={currentPrompt.bmTranslation} enabled={true}>
                  <h4 className="font-semibold text-blue-900">
                    Step {currentStep + 1}: {currentPrompt.title}
                  </h4>
                </SimpleTooltip>
                <p className="text-sm text-blue-800 mt-1">{currentPrompt.prompt}</p>
              </div>
              <SOLOBadge level={currentPrompt.minSolo} />
            </div>
            <p className="text-xs text-blue-700 italic mt-2">
              Example: {currentPrompt.example}
            </p>
          </div>

          {/* Text Input */}
          <div>
            <SimpleTooltip bmText="Tulis ayat anda di sini" enabled={true}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Write your sentence:
              </label>
            </SimpleTooltip>
            <textarea
              value={currentSentence}
              onChange={(e) => setCurrentSentence(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Type your sentence here, or use the word banks below..."
            />
          </div>

          {/* Word Banks */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Starters */}
            <div>
              <SimpleTooltip bmText="Permulaan Ayat" enabled={true}>
                <h5 className="text-sm font-semibold text-indigo-800 mb-2">Starters</h5>
              </SimpleTooltip>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {SENTENCE_PARTS.starters.map((starter, idx) => (
                  <button
                    key={idx}
                    onClick={() => insertWord(starter)}
                    className="block w-full text-left p-2 bg-indigo-50 border border-indigo-200 rounded hover:bg-indigo-100 text-xs text-indigo-900"
                  >
                    {starter}
                  </button>
                ))}
              </div>
            </div>

            {/* Causes */}
            <div>
              <SimpleTooltip bmText="Sebab" enabled={true}>
                <h5 className="text-sm font-semibold text-rose-800 mb-2">Causes</h5>
              </SimpleTooltip>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {causesFromElements.map((cause, idx) => (
                  <button
                    key={idx}
                    onClick={() => insertWord(cause.text)}
                    className="block w-full text-left p-2 bg-rose-50 border border-rose-200 rounded hover:bg-rose-100 text-xs text-rose-900"
                  >
                    <span className="mr-1">{cause.emoji}</span>
                    <span className="line-clamp-2">{cause.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Connectors */}
            <div>
              <SimpleTooltip bmText="Kata Hubung" enabled={true}>
                <h5 className="text-sm font-semibold text-emerald-800 mb-2">Connectors</h5>
              </SimpleTooltip>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {SENTENCE_PARTS.connectors.map((connector, idx) => (
                  <button
                    key={idx}
                    onClick={() => insertWord(connector)}
                    className="block w-full text-left p-2 bg-emerald-50 border border-emerald-200 rounded hover:bg-emerald-100 text-xs text-emerald-900"
                  >
                    {connector}
                  </button>
                ))}
                {/* Additional relational connectors */}
                {['combined with', 'together with', 'interacts with', 'along with'].map((connector, idx) => (
                  <button
                    key={`rel-${idx}`}
                    onClick={() => insertWord(connector)}
                    className="block w-full text-left p-2 bg-green-50 border border-green-200 rounded hover:bg-green-100 text-xs text-green-900"
                  >
                    {connector}
                  </button>
                ))}
              </div>
            </div>

            {/* Effects */}
            <div>
              <SimpleTooltip bmText="Akibat" enabled={true}>
                <h5 className="text-sm font-semibold text-sky-800 mb-2">Effects</h5>
              </SimpleTooltip>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {effectsFromElements.map((effect, idx) => (
                  <button
                    key={idx}
                    onClick={() => insertWord(effect.text)}
                    className="block w-full text-left p-2 bg-sky-50 border border-sky-200 rounded hover:bg-sky-100 text-xs text-sky-900"
                  >
                    <span className="mr-1">{effect.emoji}</span>
                    <span className="line-clamp-2">{effect.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={addSentence}
              disabled={currentSentence.trim().length < 10}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Add Sentence
            </button>
            <button
              onClick={clearCurrentSentence}
              className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Clear
            </button>
            {sentences.length >= 3 && (
              <button
                onClick={() => setCurrentStep(prompts.length)}
                className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Finish Paragraph
              </button>
            )}
          </div>
        </div>
      )}

      {/* Success Message */}
      {isComplete && (
        <SuccessMessage title="Paragraph Complete! 🎉">
          {hasRelationalThinking ? (
            <p>
              Excellent work! You've demonstrated <strong>relational thinking</strong> by
              showing how multiple causes work together. This is exactly the kind of deep
              understanding we're building!
            </p>
          ) : (
            <p>
              Good start! You've written a complete paragraph. Try to show how the causes
              <strong> work together</strong> to demonstrate relational thinking.
            </p>
          )}
        </SuccessMessage>
      )}
    </div>
  );
};

export default ParagraphBuilderStage;
