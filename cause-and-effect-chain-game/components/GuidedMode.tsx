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
  isDemo?: boolean; // If true, show as a completed example (tour mode)
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

    // Step 0: DEMO - Show an example connection first (tour mode)
    if (effectIds.length > 0) {
      const firstEffect = effectIds[0];
      const firstCauses = validCombos[firstEffect].combos[0];

      steps.push({
        visibleElements: [...firstCauses, firstEffect],
        instruction: 'Here is an example of cause and effect:',
        instructionBM: 'Ini adalah contoh sebab dan akibat:',
        correctConnection: { causes: firstCauses, effect: firstEffect },
        showLanguageAfter: true,
        isDemo: true
      });
    }

    // Step 1: First connection (forced - only 2 elements)
    if (effectIds.length > 0) {
      const firstEffect = effectIds[0];
      const firstCauses = validCombos[firstEffect].combos[0];

      steps.push({
        visibleElements: [...firstCauses, firstEffect],
        instruction: 'Now you try. Connect these two:',
        instructionBM: 'Sekarang anda cuba. Hubungkan kedua-dua ini:',
        correctConnection: { causes: firstCauses, effect: firstEffect },
        showLanguageAfter: true
      });
    }

    // Step 2-N: Add one element at a time with choices (right vs wrong)
    for (let i = 1; i < effectIds.length; i++) {
      const effectId = effectIds[i];
      const causes = validCombos[effectId].combos[0];

      // Find wrong choices (elements that are NOT valid causes for this effect)
      const allElementIds = Object.keys(elements);

      // Calculate how many wrong choices based on step number
      // Early steps: 1 wrong choice, later steps: 2-3 wrong choices for genuine decision-making
      const numWrongChoices = i <= 1 ? 1 : (i <= 3 ? 2 : 3);

      const wrongChoices = allElementIds
        .filter(id =>
          !causes.includes(id) &&
          id !== effectId &&
          !effectIds.slice(0, i).includes(id) // Not a previous effect
        )
        .slice(0, numWrongChoices);

      const visibleElements = [
        ...causes,
        effectId,
        ...wrongChoices
      ];

      steps.push({
        visibleElements,
        instruction: `What happens next?`,
        instructionBM: 'Apa yang berlaku seterusnya?',
        correctConnection: { causes, effect: effectId },
        wrongChoices: wrongChoices.length > 0 ? wrongChoices : undefined,
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

            // In demo mode, show all elements as connected
            const isSelected = currentStep.isDemo ? true : selectedElements.includes(elementId);
            const isCause = element.type === ElementType.Cause || element.type === ElementType.EffectCause;
            const isEffect = element.type === ElementType.Effect || element.type === ElementType.EffectCause;

            return (
              <button
                key={elementId}
                onClick={() => !currentStep.isDemo && handleElementClick(elementId)}
                disabled={showFeedback || currentStep.isDemo}
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
                  ${showFeedback || currentStep.isDemo ? 'opacity-80' : 'cursor-pointer'}
                  ${currentStep.isDemo ? 'cursor-default' : ''}
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

      {/* Demo Mode: Show the connection phrase */}
      {currentStep.isDemo && (
        <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
          <div className="text-center">
            <span className="text-gray-700 font-medium">
              {currentStep.correctConnection.causes.map(c => elements[c]?.text).join(' + ')}
            </span>
            <span className="text-purple-700 font-bold text-xl mx-3">
              {validCombos[currentStep.correctConnection.effect]?.phrase || 'leads to'}
            </span>
            <span className="text-gray-700 font-medium">
              {elements[currentStep.correctConnection.effect]?.text}
            </span>
          </div>
          <p className="text-center text-sm text-gray-600 mt-3">
            👆 This shows how a CAUSE leads to an EFFECT
          </p>
        </div>
      )}

      {/* Check Button / Next Button */}
      <div className="flex justify-center">
        {currentStep.isDemo ? (
          <SimpleTooltip bmText="Seterusnya" enabled={true}>
            <button
              onClick={() => {
                setCurrentStepIndex(prev => prev + 1);
              }}
              className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              Next: Try It Yourself →
            </button>
          </SimpleTooltip>
        ) : (
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
        )}
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
