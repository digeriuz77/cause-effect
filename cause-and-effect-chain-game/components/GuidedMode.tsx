import React, { useState, useCallback, useMemo } from 'react';
import { ElementsMap, ConnectionGroup, ElementType } from '../types';
import { SimpleTooltip } from './TranslationTooltip';
import { CheckCircleIcon } from './Icons';

interface GuidedModeProps {
  elements: ElementsMap;
  validCombos: { [effectId: string]: { combos: string[][]; phrase: string } };
  onComplete: () => void;
}

interface GuidedStep {
  visibleElements: string[]; // Element IDs to show
  instruction: string; // Simple instruction
  instructionBM: string; // Bahasa Melayu
  correctConnection: { causes: string[]; effect: string };
  wrongChoices?: string[]; // Optional wrong choices to present
  showLanguageAfter?: boolean; // Show connective phrase after correct connection
}

/**
 * Scaffolded, guided mode that teaches students HOW to relate information
 * Shows 2-3 elements at a time, forces connections, gradually adds complexity
 */
const GuidedMode: React.FC<GuidedModeProps> = ({ elements, validCombos, onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedConnections, setCompletedConnections] = useState<ConnectionGroup[]>([]);
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);

  // Generate guided steps from the level data
  const guidedSteps = useMemo<GuidedStep[]>(() => {
    const steps: GuidedStep[] = [];
    const effectIds = Object.keys(validCombos);

    // Step 1: First connection (forced - only 2 elements)
    if (effectIds.length > 0) {
      const firstEffect = effectIds[0];
      const firstCauses = validCombos[firstEffect].combos[0];

      steps.push({
        visibleElements: [...firstCauses, firstEffect],
        instruction: 'Connect these two:',
        instructionBM: 'Hubungkan kedua-dua ini:',
        correctConnection: { causes: firstCauses, effect: firstEffect },
        showLanguageAfter: true
      });
    }

    // Step 2-N: Add one element at a time with choices (right vs wrong)
    for (let i = 1; i < effectIds.length; i++) {
      const effectId = effectIds[i];
      const causes = validCombos[effectId].combos[0];

      // Find a wrong choice (an element that's NOT a valid cause for this effect)
      const allElementIds = Object.keys(elements);
      const wrongChoice = allElementIds.find(id =>
        !causes.includes(id) &&
        id !== effectId &&
        !effectIds.slice(0, i).includes(id) // Not a previous effect
      );

      const previousEffects = effectIds.slice(0, i);
      const visibleElements = [
        ...causes,
        effectId,
        ...(wrongChoice ? [wrongChoice] : [])
      ];

      steps.push({
        visibleElements,
        instruction: `What happens next?`,
        instructionBM: 'Apa yang berlaku seterusnya?',
        correctConnection: { causes, effect: effectId },
        wrongChoices: wrongChoice ? [wrongChoice] : undefined,
        showLanguageAfter: true
      });
    }

    return steps;
  }, [elements, validCombos]);

  const currentStep = guidedSteps[currentStepIndex];
  const isLastStep = currentStepIndex === guidedSteps.length - 1;

  const handleElementClick = useCallback((elementId: string) => {
    if (showFeedback) return; // Don't allow clicking during feedback

    setSelectedElements(prev => {
      if (prev.includes(elementId)) {
        return prev.filter(id => id !== elementId);
      } else {
        return [...prev, elementId];
      }
    });
  }, [showFeedback]);

  const handleCheck = useCallback(() => {
    if (!currentStep) return;

    const { correctConnection } = currentStep;
    const selectedCauses = selectedElements.filter(id => id !== correctConnection.effect);
    const selectedEffect = selectedElements.find(id => id === correctConnection.effect);

    // Check if correct
    const causesMatch =
      selectedCauses.length === correctConnection.causes.length &&
      selectedCauses.every(c => correctConnection.causes.includes(c));

    const effectMatches = selectedEffect === correctConnection.effect;

    if (causesMatch && effectMatches) {
      // Correct!
      setIsCorrect(true);
      const phrase = validCombos[correctConnection.effect]?.phrase || 'leads to';
      setFeedbackMessage(`✓ Yes! ${phrase}`);
      setShowFeedback(true);

      // Add to completed connections
      setCompletedConnections(prev => [
        ...prev,
        {
          causes: correctConnection.causes,
          effect: correctConnection.effect,
          phrase
        }
      ]);

      // Auto-advance after 1.5 seconds
      setTimeout(() => {
        if (isLastStep) {
          onComplete();
        } else {
          setCurrentStepIndex(prev => prev + 1);
          setSelectedElements([]);
          setShowFeedback(false);
        }
      }, 1500);
    } else {
      // Wrong
      setIsCorrect(false);
      setFeedbackMessage('Not quite. Try again.');
      setShowFeedback(true);

      setTimeout(() => {
        setShowFeedback(false);
      }, 1500);
    }
  }, [currentStep, selectedElements, validCombos, isLastStep, onComplete]);

  if (!currentStep) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  const canCheck = selectedElements.length >= 2;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <SimpleTooltip bmText="Langkah" enabled={true}>
            <span className="text-sm font-medium text-gray-700">
              Step {currentStepIndex + 1} of {guidedSteps.length}
            </span>
          </SimpleTooltip>
          <span className="text-sm text-gray-600">
            {completedConnections.length} connections made
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / guidedSteps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Instruction */}
      <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
        <SimpleTooltip bmText={currentStep.instructionBM} enabled={true}>
          <h3 className="text-2xl font-bold text-blue-900 text-center">
            {currentStep.instruction}
          </h3>
        </SimpleTooltip>
      </div>

      {/* Visible Elements */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex flex-wrap gap-4 justify-center">
          {currentStep.visibleElements.map(elementId => {
            const element = elements[elementId];
            if (!element) return null;

            const isSelected = selectedElements.includes(elementId);
            const isCause = element.type === ElementType.Cause || element.type === ElementType.EffectCause;
            const isEffect = element.type === ElementType.Effect || element.type === ElementType.EffectCause;

            return (
              <button
                key={elementId}
                onClick={() => handleElementClick(elementId)}
                disabled={showFeedback}
                className={`
                  p-6 rounded-xl shadow-lg transition-all duration-200
                  min-w-[200px] max-w-[280px]
                  ${isSelected
                    ? 'ring-4 ring-purple-500 scale-105'
                    : 'hover:scale-102 hover:shadow-xl'
                  }
                  ${isCause && !isEffect ? 'bg-rose-100 border-2 border-rose-300' : ''}
                  ${isEffect && !isCause ? 'bg-sky-100 border-2 border-sky-300' : ''}
                  ${isCause && isEffect ? 'bg-purple-100 border-2 border-purple-300' : ''}
                  ${showFeedback ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div className="text-4xl mb-2 text-center">{element.emoji}</div>
                <div className="text-sm font-medium text-gray-800 text-center leading-tight">
                  {element.text}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Check Button */}
      <div className="flex justify-center">
        <button
          onClick={handleCheck}
          disabled={!canCheck || showFeedback}
          className={`
            px-8 py-4 rounded-lg font-bold text-lg
            transition-all duration-300
            ${canCheck && !showFeedback
              ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {showFeedback ? 'Checking...' : 'Check Connection'}
        </button>
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div
          className={`
            p-6 rounded-lg text-center text-xl font-bold
            ${isCorrect
              ? 'bg-green-100 text-green-800 border-2 border-green-300'
              : 'bg-red-100 text-red-800 border-2 border-red-300'
            }
          `}
        >
          {feedbackMessage}
        </div>
      )}

      {/* Completed Connections (shown at bottom) */}
      {completedConnections.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Connections Made:</h4>
          <div className="space-y-2">
            {completedConnections.map((conn, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <CheckCircleIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">
                  {conn.causes.map(c => elements[c]?.text).join(' + ')}
                  <span className="text-purple-600 font-semibold mx-1">{conn.phrase}</span>
                  {elements[conn.effect]?.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GuidedMode;
