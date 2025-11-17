
import React, { useState, useMemo } from 'react';
import { ElementsMap } from '../types';
import { SENTENCE_PARTS } from '../constants';
import SuccessMessage from './SuccessMessage';

interface SentenceBuilderStageProps {
    elements: ElementsMap;
}

const SentenceBuilderStage: React.FC<SentenceBuilderStageProps> = ({ elements }) => {
    const [builtSentence, setBuiltSentence] = useState<{ text: string, type: string }[]>([]);
    
    const causesFromElements = useMemo(() => {
        return Object.values(elements).filter(el => el.type === 'cause' || el.type === 'effect-cause');
    }, [elements]);

    const effectsFromElements = useMemo(() => {
        return Object.values(elements).filter(el => el.type === 'effect' || el.type === 'effect-cause');
    }, [elements]);

    const addToSentence = (text: string, type: string) => {
        setBuiltSentence(prev => [...prev, { text, type }]);
    };

    const clearSentence = () => {
        setBuiltSentence([]);
    };

    const renderWordBank = (title: string, items: { text: string }[], type: string, color: string) => (
        <div>
            <h4 className={`font-semibold text-${color}-800 mb-2`}>{title}</h4>
            <div className={`space-y-2 max-h-64 overflow-y-auto pr-2`}>
                {items.map((item, idx) => (
                    <button
                        key={idx}
                        onClick={() => addToSentence(item.text, type)}
                        className={`block w-full text-left p-2 bg-${color}-50 border border-${color}-300 rounded hover:bg-${color}-100 text-sm text-${color}-900`}
                        title={item.text}
                    >
                        <span className="line-clamp-2">{item.text}</span>
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {renderWordBank("Cause Starters", SENTENCE_PARTS.starters.map(s => ({text: s})), "starter", "indigo")}
                {renderWordBank("Causes from Passage", causesFromElements, "cause", "rose")}
                {renderWordBank("Connectors", SENTENCE_PARTS.connectors.map(c => ({text: c})), "connector", "emerald")}
                {renderWordBank("Effects from Passage", effectsFromElements, "effect", "sky")}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200 mb-4 min-h-[80px]">
                <h4 className="font-semibold text-gray-800 mb-2">Your Sentence:</h4>
                <div className="text-lg leading-relaxed">
                    {builtSentence.length === 0 ? (
                        <span className="text-gray-400 italic">Click words above to build your sentence...</span>
                    ) : (
                        builtSentence.map((part, idx) => (
                            <span
                                key={idx}
                                className={`mr-1 ${
                                    part.type === "starter" ? "text-indigo-600 font-semibold"
                                    : part.type === "connector" ? "text-emerald-600 font-semibold"
                                    : part.type === "cause" ? "text-black bg-rose-50 px-1 rounded"
                                    : part.type === "effect" ? "text-black bg-sky-50 px-1 rounded"
                                    : ""
                                }`}
                            >
                                {part.text}
                            </span>
                        ))
                    )}
                </div>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={clearSentence}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                    Clear Sentence
                </button>
            </div>

            {builtSentence.length > 2 && (
                <SuccessMessage title="Excellent Work!">
                    You've constructed a well-formed academic sentence demonstrating your understanding of cause and effect!
                </SuccessMessage>
            )}
        </div>
    );
};

export default SentenceBuilderStage;
