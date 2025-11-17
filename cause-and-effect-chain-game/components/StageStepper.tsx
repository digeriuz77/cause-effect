import React from 'react';

interface Stage {
    id: number;
    title: string;
}

interface StageStepperProps {
    currentStage: number;
    unlockedStage: number;
    setStage: (stage: number) => void;
    stages: Stage[];
}

const StageStepper: React.FC<StageStepperProps> = ({ currentStage, unlockedStage, setStage, stages }) => {
    if (stages.length <= 1) {
        return null; // Don't show stepper for single-stage levels
    }

    const getStageClasses = (stageId: number) => {
        const isUnlocked = stageId <= unlockedStage;
        const isActive = stageId === currentStage;
        
        let classes = "flex items-center justify-center w-full p-3 text-sm font-medium rounded-lg transition-colors ";
        
        if (isActive) {
            classes += "bg-indigo-600 text-white shadow-md";
        } else if (isUnlocked) {
            classes += "bg-white text-gray-700 hover:bg-gray-100 cursor-pointer border";
        } else {
            classes += "bg-gray-100 text-gray-400 cursor-not-allowed border";
        }
        return classes;
    };

    return (
        <div className="mb-6">
            <div className={`grid grid-cols-${stages.length} gap-4`}>
                {stages.map((stage) => (
                    <button
                        key={stage.id}
                        onClick={() => stage.id <= unlockedStage && setStage(stage.id)}
                        disabled={stage.id > unlockedStage}
                        className={getStageClasses(stage.id)}
                    >
                        <span className="font-bold mr-2">{stage.id}.</span> {stage.title}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default StageStepper;