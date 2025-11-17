import { useState, useCallback } from 'react';
import { ConnectionGroup, ElementType, ElementsMap } from '../types';

const areSetsEqual = (a: Set<string>, b: Set<string>): boolean => {
  if (a.size !== b.size) return false;
  for (const item of a) {
    if (!b.has(item)) return false;
  }
  return true;
};

export const useCauseEffectGame = (
    elements: ElementsMap,
    validCauseCombos: { [effectId: string]: { combos: string[][]; phrase: string } },
    initialAvailableElements: Set<string>
) => {
  const [selectedCauses, setSelectedCauses] = useState<Set<string>>(new Set());
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null);
  const [connectionGroups, setConnectionGroups] = useState<ConnectionGroup[]>([]);
  const [availableElements, setAvailableElements] = useState<Set<string>>(initialAvailableElements);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | 'info' }>({
    message: 'Select one or more causes, then an effect to connect.',
    type: 'info',
  });

  const resetGame = useCallback(() => {
    setSelectedCauses(new Set());
    setSelectedEffect(null);
    setConnectionGroups([]);
    setAvailableElements(initialAvailableElements);
    setScore(0);
    setFeedback({
      message: 'Select one or more causes, then an effect to connect.',
      type: 'info',
    });
  }, [initialAvailableElements]);

  const handleElementClick = useCallback((elementId: string) => {
    const element = elements[elementId];
    if (!element) return;

    const isAvailable = availableElements.has(elementId);
    const isCauseType = element.type === ElementType.Cause || element.type === ElementType.EffectCause;
    const isEffectType = element.type === ElementType.Effect || element.type === ElementType.EffectCause;

    // ACTION 1: Handle selection of AVAILABLE CAUSES.
    // If the clicked element is an available cause type, it's a cause-selection action.
    if (isCauseType && isAvailable) {
      const newSelectedCauses = new Set(selectedCauses);
      if (newSelectedCauses.has(elementId)) {
        newSelectedCauses.delete(elementId);
        setFeedback({ message: `Deselected cause: "${element.text}".`, type: 'info' });
      } else {
        newSelectedCauses.add(elementId);
        setFeedback({ message: `Selected cause: "${element.text}".`, type: 'info' });
      }
      setSelectedCauses(newSelectedCauses);
      
      // If the item we just selected as a cause was also the selected effect,
      // we must clear the effect selection to avoid a conflict.
      if (selectedEffect === elementId) {
          setSelectedEffect(null);
      }
      return;
    }

    // ACTION 2: Handle selection of EFFECTS.
    // If the element is an effect type AND is not one of the causes we've already selected,
    // it's an effect-selection action. This works for locked and unlocked effects.
    if (isEffectType && !selectedCauses.has(elementId)) {
      if (selectedEffect === elementId) {
        setSelectedEffect(null); // Toggle off if already selected
        setFeedback({ message: 'Effect selection cleared.', type: 'info' });
      } else {
        setSelectedEffect(elementId);
        setFeedback({ message: `Selected effect: "${element.text}".`, type: 'info' });
      }
      return;
    }

    // Fallback: Clicked on a locked element that isn't a valid effect target right now.
    setFeedback({ message: "⏳ This element isn't available yet - connect the previous steps first!", type: 'error' });

  }, [elements, availableElements, selectedCauses, selectedEffect]);


  const makeConnection = useCallback(() => {
    if (selectedCauses.size === 0 || !selectedEffect) {
      setFeedback({ message: '❗ Please select at least one cause AND an effect first!', type: 'error' });
      return;
    }

    const validCauseCombosData = validCauseCombos[selectedEffect];
    if (!validCauseCombosData) {
      setFeedback({ message: `❌ That's not a valid effect for the selected cause(s).`, type: 'error' });
      return;
    }

    const alreadyConnected = connectionGroups.some(group => group.effect === selectedEffect);
    if (alreadyConnected) {
        setFeedback({ message: '🔗 That effect has already been caused by another event.', type: 'error' });
        return;
    }
    
    const validCombosForEffect = validCauseCombosData.combos;
    const selectedCausesArray = Array.from(selectedCauses);

    // Check for an exact match first
    const exactMatchCombo = validCombosForEffect.find(combo => areSetsEqual(new Set(combo), selectedCauses));

    if (exactMatchCombo) {
      const newConnectionGroup: ConnectionGroup = { 
        causes: selectedCausesArray, 
        effect: selectedEffect,
        phrase: validCauseCombosData.phrase 
      };
      setConnectionGroups(prev => [...prev, newConnectionGroup]);
      setAvailableElements(prev => new Set([...prev, selectedEffect]));
      setScore(prev => prev + 20 * selectedCauses.size);
      setFeedback({ message: `🎉 Correct! You've connected all the causes for "${elements[selectedEffect]?.text}".`, type: 'success' });
      setSelectedCauses(new Set());
      setSelectedEffect(null);
      return;
    }

    // If no exact match, check for a partial match (is the selection a valid subset of a larger combo?)
    const isPartialMatch = validCombosForEffect.some(combo => {
      const comboSet = new Set(combo);
      return selectedCausesArray.length < combo.length && selectedCausesArray.every(sc => comboSet.has(sc));
    });

    if (isPartialMatch) {
      setScore(prev => prev + 5 * selectedCauses.size); // smaller reward for partial
      setFeedback({ message: `👍 On the right track! You've found some of the causes for "${elements[selectedEffect]?.text}". Are there any others?`, type: 'info' });
      // We don't clear selections here, so the user can add to their selection.
      return;
    }

    // If neither, it's a wrong combination
    setScore(prev => Math.max(0, prev - 5));
    setFeedback({ message: `❌ That combination of causes doesn't produce the selected effect. Try again!`, type: 'error' });
    setSelectedCauses(new Set());
    setSelectedEffect(null);

  }, [selectedCauses, selectedEffect, connectionGroups, validCauseCombos, elements]);

  return {
    score,
    feedback,
    connectionGroups,
    availableElements,
    selectedCauses,
    selectedEffect,
    resetGame,
    handleElementClick,
    makeConnection
  };
};