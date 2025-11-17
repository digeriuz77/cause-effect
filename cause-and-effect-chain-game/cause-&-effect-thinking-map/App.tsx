
import { useState, useMemo } from 'react';
import type { FC } from 'react';
import ThinkingMap from './components/ThinkingMap';
import { BrainCircuit } from './components/Icons';
import { japanMilitarizationMap } from './data/maps/japanMilitarization';
import { photosynthesisMap } from './data/maps/photosynthesis';

const maps = {
  'Japanese Militarization': japanMilitarizationMap,
  'Photosynthesis': photosynthesisMap,
};

type MapKey = keyof typeof maps;

const App: FC = () => {
  const [activeMapKey, setActiveMapKey] = useState<MapKey>('Japanese Militarization');

  const activeMapData = useMemo(() => maps[activeMapKey], [activeMapKey]);

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-gray-50">
      <header className="bg-white shadow-md z-20 flex-shrink-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <BrainCircuit className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                Cause & Effect Thinking Map
              </h1>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-200">
           <nav className="flex space-x-4">
            {(Object.keys(maps) as MapKey[]).map(mapKey => (
              <button
                key={mapKey}
                onClick={() => setActiveMapKey(mapKey)}
                className={`py-3 px-1 font-semibold text-lg border-b-4 transition-colors duration-200 ${
                  activeMapKey === mapKey
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {mapKey}
              </button>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-grow flex">
        <ThinkingMap key={activeMapKey} mapData={activeMapData} />
      </main>
    </div>
  );
};

export default App;
