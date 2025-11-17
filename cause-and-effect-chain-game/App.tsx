
import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
import TextAnalysisStage from './components/TextAnalysisStage';
import SentenceBuilderStage from './components/SentenceBuilderStage';
import VideoComprehensionStage from './components/VideoComprehensionStage';
import { levelData } from './constants/levels';
import AdminPanel from './components/AdminPanel';

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
    onOpenAdmin: () => void;
}

const GameInstance: React.FC<GameInstanceProps> = ({ levelKey, onOpenAdmin }) => {
    const currentLevel = levelData[levelKey];
    const { elements, combos, initial, title, description, story, videoUrl, comprehensionQuestions } = currentLevel;
    
    const game = useCauseEffectGame(elements, combos, initial);
    
    const availableStages = useMemo<Stage[]>(() => {
      const stages: Stage[] = [];
      if (videoUrl && comprehensionQuestions && comprehensionQuestions.length > 0) {
        stages.push({ id: stages.length + 1, title: 'Watch & Learn', component: 'video' });
      }
      stages.push({ id: stages.length + 1, title: 'Build the Chain', component: 'chain' });
      if (story) {
        stages.push({ id: stages.length + 1, title: 'Analyze the Text', component: 'analysis' });
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
            <Header score={game.score} onReset={game.resetGame} title={title} onOpenAdmin={onOpenAdmin} />
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
                <>
                    <FeedbackBar message={game.feedback.message} type={game.feedback.type} />
                    <GameBoard
                        elements={elements}
                        connectionGroups={game.connectionGroups}
                        selectedCauses={game.selectedCauses}
                        selectedEffect={game.selectedEffect}
                        availableElements={game.availableElements}
                        onElementClick={game.handleElementClick}
                    />
                    <ControlPanel
                        elements={elements}
                        selectedCauses={game.selectedCauses}
                        selectedEffect={game.selectedEffect}
                        connectionGroups={game.connectionGroups}
                        onMakeConnection={game.makeConnection}
                    />
                    {isChainComplete && (
                        <SuccessMessage
                            title="Chain Complete!"
                            buttonText={availableStages.length > currentStage ? `Next Stage: ${availableStages[currentStage].title}` : undefined}
                            onNext={availableStages.length > currentStage ? handleNextStage : undefined}
                        >
                            You've successfully built the entire cause and effect chain!
                        </SuccessMessage>
                    )}
                    <CausalChainDisplay elements={elements} connectionGroups={game.connectionGroups} />
                </>
            )}
            
            {currentStageInfo?.component === 'analysis' && story && (
                <TextAnalysisStage
                    story={story}
                    elements={elements}
                    combos={combos}
                    onComplete={() => {}} // Can be used for tracking if needed
                    goToNextStage={handleNextStage}
                    nextStageTitle={availableStages.find(s => s.id === currentStage + 1)?.title}
                />
            )}

            {currentStageInfo?.component === 'write' && (
                <SentenceBuilderStage elements={elements} />
            )}
        </div>
    );
};

const App = () => {
    const [activeTab, setActiveTab] = useState<LevelKey>('storm');
    const [showAdminPanel, setShowAdminPanel] = useState(false);
    
    const handleOpenAdmin = () => setShowAdminPanel(true);

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <Tabs tabs={tabs} activeTab={activeTab} onTabClick={(id) => setActiveTab(id as LevelKey)} />
                <GameInstance key={activeTab} levelKey={activeTab} onOpenAdmin={handleOpenAdmin} />
            </div>
            {showAdminPanel && createPortal(
                <AdminPanel onClose={() => setShowAdminPanel(false)} />,
                document.body
            )}
        </div>
    );
}

export default App;