
import React, { useState, useMemo, useEffect } from 'react';
import { useCauseEffectGame } from './hooks/useCauseEffectGame';
import Header from './components/Header';
import Instructions from './components/Instructions';
import FeedbackBar from './components/FeedbackBar';
import GameBoard from './components/GameBoard';
import ControlPanel from './components/ControlPanel';
import SuccessMessage from './components/SuccessMessage';
import CausalChainDisplay from './components/CausalChainDisplay';
import Tabs from './components/Tabs';
import StageStepper from './components/StageStepper';
import StoryReadingStage from './components/StoryReadingStage';
import ParagraphBuilderStage from './components/ParagraphBuilderStage';
import VideoComprehensionStage from './components/VideoComprehensionStage';
import SOLOProgressIndicator from './components/SOLOProgressIndicator';
import GuidedMode from './components/GuidedMode';
import { SimpleTooltip } from './components/TranslationTooltip';
import { levelData } from './constants/levels';

type LevelKey = keyof typeof levelData;

const tabs = Object.keys(levelData).map(key => ({
    id: key,
    label: levelData[key as LevelKey].title
}));

interface Stage {
    id: number;
    title: string;
    component: 'video' | 'chain' | 'analysis' | 'write';
}

interface GameInstanceProps {
    levelKey: LevelKey;
}

const GameInstance: React.FC<GameInstanceProps> = ({ levelKey }) => {
    const currentLevel = levelData[levelKey];
    const { elements, combos, initial, title, description, story, videoUrl, comprehensionQuestions } = currentLevel;

    const game = useCauseEffectGame(elements, combos, initial);

    const availableStages = useMemo<Stage[]>(() => {
      const stages: Stage[] = [];

      // Video first (if exists)
      if (videoUrl && comprehensionQuestions && comprehensionQuestions.length > 0) {
        stages.push({ id: stages.length + 1, title: 'Watch & Learn', component: 'video' });
      }

      // Story BEFORE building (if exists)
      if (story) {
        stages.push({ id: stages.length + 1, title: 'Read the Story', component: 'analysis' });
      }

      // Then build the chain (always guided)
      stages.push({ id: stages.length + 1, title: 'Build the Chain', component: 'chain' });

      // Finally write
      if (story) {
        stages.push({ id: stages.length + 1, title: 'Write Your Paragraph', component: 'write' });
      }

      return stages;
    }, [videoUrl, comprehensionQuestions, story]);

    const [currentStage, setCurrentStage] = useState(1);
    const [unlockedStage, setUnlockedStage] = useState(1);
    
    // Stage completion states are managed within their respective components
    
    const isChainComplete = useMemo(() => {
        const totalPossibleGroups = Object.keys(combos).length;
        return game.connectionGroups.length >= totalPossibleGroups && totalPossibleGroups > 0;
    }, [game.connectionGroups, combos]);

    const handleNextStage = () => {
        if (currentStage < availableStages.length) {
            const next = currentStage + 1;
            setCurrentStage(next);
            setUnlockedStage(prev => Math.max(prev, next));
        }
    };

    useEffect(() => {
        // Reset state when level changes
        setCurrentStage(1);
        setUnlockedStage(1);
        game.resetGame();
    }, [levelKey, game.resetGame]);

    const currentStageInfo = availableStages.find(s => s.id === currentStage);

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <Header score={game.score} onReset={game.resetGame} title={title} />
            <StageStepper 
                stages={availableStages}
                currentStage={currentStage}
                unlockedStage={unlockedStage}
                setStage={setCurrentStage}
            />
            <Instructions 
                title={title} 
                description={description} 
                story={story} 
                stageComponent={currentStageInfo?.component}
            />
            
            {currentStageInfo?.component === 'video' && videoUrl && comprehensionQuestions &&
                <VideoComprehensionStage 
                    videoUrl={videoUrl}
                    questions={comprehensionQuestions}
                    onComplete={() => {}} // Can be used for tracking if needed
                    goToNextStage={handleNextStage}
                />
            }

            {currentStageInfo?.component === 'chain' && (
                <GuidedMode
                    elements={elements}
                    validCombos={combos}
                    onComplete={handleNextStage}
                />
            )}
            
            {currentStageInfo?.component === 'analysis' && story && (
                <StoryReadingStage
                    story={story}
                    onNext={handleNextStage}
                    nextStageTitle={availableStages.find(s => s.id === currentStage + 1)?.title}
                />
            )}

            {currentStageInfo?.component === 'write' && (
                <ParagraphBuilderStage elements={elements} connections={game.connectionGroups} />
            )}
        </div>
    );
};

const App = () => {
    const [activeTab, setActiveTab] = useState<LevelKey>('storm');

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <Tabs tabs={tabs} activeTab={activeTab} onTabClick={(id) => setActiveTab(id as LevelKey)} />
                <GameInstance key={activeTab} levelKey={activeTab} />
            </div>
        </div>
    );
}

export default App;