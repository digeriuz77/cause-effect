import React, { useState, useMemo, useEffect } from 'react';
import { ElementsMap } from '../types';
import SuccessMessage from './SuccessMessage';

interface TextAnalysisStageProps {
    story: string;
    elements: ElementsMap;
    combos: { [effectId: string]: { combos: string[][]; phrase: string; }; };
    onComplete: () => void;
    goToNextStage: () => void;
    nextStageTitle?: string;
}

const cleanText = (text: string): string => {
    return text.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, ' ').trim();
};

const TextAnalysisStage: React.FC<TextAnalysisStageProps> = ({ story, elements, combos, onComplete, goToNextStage, nextStageTitle }) => {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [feedback, setFeedback] = useState('Select a highlighter tool, then click and drag over text to identify causes and effects.');
    const [highlighterMode, setHighlighterMode] = useState<'cause' | 'effect' | null>(null);

    const { analysisTargets, allTargetIds, connectivesRegex } = useMemo(() => {
        const targets: { causeIds: string[], effectId: string, connective: string }[] = [];
        const allPhrases = new Set<string>();
        
        Object.entries(combos).forEach(([effectId, data]) => {
            // Each combo represents a potential target sentence.
            // For simplicity in this stage, we'll assume the first combo is the canonical one.
            if(data.combos.length > 0) {
                targets.push({
                    causeIds: data.combos[0],
                    effectId: effectId,
                    connective: data.phrase
                });
                allPhrases.add(data.phrase);
            }
        });

        const allIds = new Set<string>();
        Object.values(elements).forEach(el => allIds.add(el.text));
        
        const escapedPhrases = Array.from(allPhrases).map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        const regex = new RegExp(`(${escapedPhrases.join('|')})`, 'gi');

        return { analysisTargets: targets, allTargetIds: allIds, connectivesRegex: regex };
    }, [combos, elements]);

    const findElementIdByText = (text: string) => {
        const cleaned = cleanText(text);
        for (const id in elements) {
            if (cleanText(elements[id].text) === cleaned) {
                return id;
            }
        }
        return null;
    };

    const handleTextSelection = () => {
        if (!highlighterMode) {
            setFeedback('⚠️ Please select a highlighter tool (Cause or Effect) first!');
            return;
        }

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const selectedText = selection.toString().trim();
        if (selectedText.length < 3) return;
        
        const matchedElementId = findElementIdByText(selectedText);

        if (!matchedElementId) {
             setFeedback(`❌ That selection doesn't seem to match a key phrase.`);
             selection.removeAllRanges();
             return;
        }

        let isCorrect = false;
        for (const target of analysisTargets) {
            if (highlighterMode === 'cause' && target.causeIds.includes(matchedElementId)) {
                isCorrect = true;
                break;
            }
            if (highlighterMode === 'effect' && target.effectId === matchedElementId) {
                isCorrect = true;
                break;
            }
        }

        if (isCorrect) {
            if (selectedIds.has(matchedElementId)) {
                setFeedback(`ℹ️ You've already found that one!`);
            } else {
                setSelectedIds(prev => new Set(prev).add(matchedElementId));
                setFeedback(`✅ Great! You identified a ${highlighterMode.toUpperCase()}: "${elements[matchedElementId].text}"`);
            }
        } else {
             const wrongType = highlighterMode === 'cause' ? 'effect' : 'cause';
             setFeedback(`⚠️ That's a ${wrongType}! Try using the other highlighter.`);
        }

        selection.removeAllRanges();
    };
    
    const renderHighlightedContent = () => {
        const selectedTexts = Array.from(selectedIds).map(id => elements[id].text);
        const selectedCauseTexts = Array.from(selectedIds).filter(id => elements[id].type !== 'effect').map(id => elements[id].text);
        const selectedEffectTexts = Array.from(selectedIds).filter(id => elements[id].type !== 'cause').map(id => elements[id].text);

        // This regex finds either a connective or a previously selected phrase
        const allHighlightablePhrases = [...Object.values(combos).map(c => c.phrase), ...selectedTexts];
        const uniqueSortedPhrases = [...new Set(allHighlightablePhrases)].sort((a, b) => b.length - a.length);
        const regex = new RegExp(`(${uniqueSortedPhrases.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');

        return story.split(regex).map((part, index) => {
            const isConnective = Object.values(combos).some(c => c.phrase.toLowerCase() === part.toLowerCase());
            if (isConnective) {
                return <strong key={index} className="text-red-600 font-bold">{part}</strong>;
            }
            if (selectedCauseTexts.includes(part)) {
                return <mark key={index} className="bg-yellow-200 text-black rounded px-1 py-0.5">{part}</mark>;
            }
            if (selectedEffectTexts.includes(part)) {
                return <mark key={index} className="bg-sky-200 text-black rounded px-1 py-0.5">{part}</mark>;
            }
            return <React.Fragment key={index}>{part}</React.Fragment>;
        });
    };

    const totalTargets = useMemo(() => {
        const ids = new Set<string>();
        analysisTargets.forEach(t => {
            t.causeIds.forEach(id => ids.add(id));
            ids.add(t.effectId);
        });
        return ids.size;
    }, [analysisTargets]);

    const isStageComplete = selectedIds.size >= totalTargets;

    useEffect(() => {
        if (isStageComplete) {
            onComplete();
        }
    }, [isStageComplete, onComplete]);

    const identifiedCauses = Array.from(selectedIds).filter(id => elements[id].type === 'cause' || elements[id].type === 'effect-cause');
    const identifiedEffects = Array.from(selectedIds).filter(id => elements[id].type === 'effect' || elements[id].type === 'effect-cause');
    const totalCauses = Object.values(elements).filter(el => el.type === 'cause' || el.type === 'effect-cause').length;
    const totalEffects = Object.values(elements).filter(el => el.type === 'effect' || el.type === 'effect-cause').length;

    return (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
             <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 p-3 bg-gray-50 rounded-lg border">
                <span className="font-semibold text-gray-700">Highlighter Tool:</span>
                <div className="flex gap-3">
                    <button onClick={() => setHighlighterMode('cause')} className={`px-4 py-2 rounded-md font-semibold text-sm transition-all border-2 text-yellow-900 ${highlighterMode === 'cause' ? 'bg-yellow-300 border-yellow-500 ring-2 ring-yellow-200' : 'bg-yellow-100 border-yellow-200 hover:bg-yellow-200'}`}>
                        Highlight Cause 🟡
                    </button>
                    <button onClick={() => setHighlighterMode('effect')} className={`px-4 py-2 rounded-md font-semibold text-sm transition-all border-2 text-sky-900 ${highlighterMode === 'effect' ? 'bg-sky-300 border-sky-500 ring-2 ring-sky-200' : 'bg-sky-100 border-sky-200 hover:bg-sky-200'}`}>
                        Highlight Effect 🔵
                    </button>
                </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Highlight the Story Below:</h3>
            <div
              className="passage-text text-lg leading-relaxed cursor-pointer select-text bg-gray-50 p-4 rounded-lg mb-6 text-gray-800"
              onMouseUp={handleTextSelection}
            >
              <div className="prose max-w-none">
                <p>{renderHighlightedContent()}</p>
              </div>
            </div>

            {feedback && (
                <div className={`p-3 rounded-lg mb-6 text-sm font-medium ${feedback.includes('✅') ? 'bg-green-50 text-green-800' : feedback.includes('❌') ? 'bg-red-50 text-red-800' : 'bg-blue-50 text-blue-800'}`}>
                    {feedback}
                </div>
            )}
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 min-h-[100px]">
                    <h4 className="font-semibold text-yellow-800 mb-2">Causes Found ({identifiedCauses.length} / {totalCauses})</h4>
                    {identifiedCauses.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1 mt-2 text-yellow-900">
                            {identifiedCauses.map((id) => (
                                <li key={id} className="text-sm">{elements[id].text}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-yellow-700 italic mt-2">None yet. Use the yellow highlighter!</p>
                    )}
                </div>
                 <div className="bg-sky-50 p-3 rounded-lg border border-sky-200 min-h-[100px]">
                  <h4 className="font-semibold text-sky-800 mb-2">Effects Found ({identifiedEffects.length} / {totalEffects})</h4>
                    {identifiedEffects.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1 mt-2 text-sky-900">
                            {identifiedEffects.map((id) => (
                                <li key={id} className="text-sm">{elements[id].text}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-sky-700 italic mt-2">None yet. Use the blue highlighter!</p>
                    )}
                </div>
            </div>

            {isStageComplete && (
                 <SuccessMessage
                    title="Analysis Complete!"
                    buttonText={nextStageTitle ? `Next Stage: ${nextStageTitle}` : "Continue"}
                    onNext={goToNextStage}
                >
                    You've found the key causes and effects in the text. Now, let's use them to build your own sentences.
                </SuccessMessage>
            )}
        </div>
    );
};

export default TextAnalysisStage;