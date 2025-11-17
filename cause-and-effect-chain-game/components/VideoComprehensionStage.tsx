import React, { useState } from 'react';
import { ComprehensionQuestion } from '../types';
import SuccessMessage from './SuccessMessage';

interface VideoComprehensionStageProps {
    videoUrl: string;
    questions: ComprehensionQuestion[];
    onComplete: () => void;
    goToNextStage: () => void;
}

const getEmbedUrl = (url: string): string => {
    let videoId = '';
    try {
        if (url.includes('watch?v=')) {
            videoId = new URL(url).searchParams.get('v') || '';
        } else if (url.includes('youtu.be/')) {
            videoId = new URL(url).pathname.substring(1);
        }
    } catch (error) {
        console.error("Invalid video URL:", url);
        return '';
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
};

const VideoComprehensionStage: React.FC<VideoComprehensionStageProps> = ({ videoUrl, questions, onComplete, goToNextStage }) => {
    const embedUrl = getEmbedUrl(videoUrl);
    const [answers, setAnswers] = useState<Record<number, boolean | null>>({});
    const [submitted, setSubmitted] = useState(false);

    const handleAnswer = (questionIndex: number, answer: boolean) => {
        setAnswers(prev => ({ ...prev, [questionIndex]: answer }));
        setSubmitted(false); // Allow re-submission if they change an answer
    };

    const handleSubmit = () => {
        setSubmitted(true);
        if (isComplete) {
            onComplete();
        }
    };

    const score = Object.entries(answers).reduce((acc, [index, answer]) => {
        const questionIndex = parseInt(index, 10);
        return questions[questionIndex]?.answer === answer ? acc + 1 : acc;
    }, 0);
    
    const isComplete = score / questions.length >= 0.8; // Require 80% correct

    return (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            {embedUrl && (
                <div className="aspect-w-16 aspect-h-9 mb-6 rounded-lg overflow-hidden border">
                    <iframe
                        src={embedUrl}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                    ></iframe>
                </div>
            )}
            
            <div className="space-y-4">
                {questions.map((q, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${submitted ? (answers[index] === q.answer ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50') : 'border-gray-200 bg-gray-50'}`}>
                        <p className="font-medium text-gray-800 mb-3">{index + 1}. {q.question}</p>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => handleAnswer(index, true)}
                                className={`px-4 py-2 rounded-md font-semibold transition-colors w-24 ${answers[index] === true ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                            >
                                True
                            </button>
                            <button 
                                onClick={() => handleAnswer(index, false)}
                                className={`px-4 py-2 rounded-md font-semibold transition-colors w-24 ${answers[index] === false ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                            >
                                False
                            </button>
                            {submitted && (
                                <span className={`font-bold ${answers[index] === q.answer ? 'text-green-600' : 'text-red-600'}`}>
                                    {answers[index] === q.answer ? 'Correct!' : `Incorrect. The answer is ${q.answer ? 'True' : 'False'}.`}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex justify-center">
                 <button 
                    onClick={handleSubmit}
                    disabled={Object.keys(answers).length !== questions.length}
                    className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                    Check Answers
                </button>
            </div>

             {submitted && isComplete && (
                 <SuccessMessage
                    title="Great Start!"
                    buttonText="Next Stage: Build the Chain"
                    onNext={goToNextStage}
                >
                    You've mastered the key concepts from the video. Now, let's build the cause and effect chain.
                </SuccessMessage>
            )}
        </div>
    );
};

export default VideoComprehensionStage;
