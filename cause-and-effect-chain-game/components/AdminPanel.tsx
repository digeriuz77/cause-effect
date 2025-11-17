
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ElementType, ElementsMap, ConnectionGroup } from '../types';

interface AdminPanelProps {
  onClose?: () => void;
}

interface AdminConfig {
  elements: ElementsMap;
  connectionGroups: ConnectionGroup[];
  initialAvailableElements: string[];
}

interface DragState {
  elementId: string | null;
  startX: number;
  startY: number;
}

const ADMIN_PASSWORD = 'Spg54'; // In production, use environment variable

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  // Editor state
  const [config, setConfig] = useState<AdminConfig>({
    elements: {},
    connectionGroups: [],
    initialAvailableElements: []
  });

  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedConnectionIndex, setSelectedConnectionIndex] = useState<number | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showConnectionForm, setShowConnectionForm] = useState(false);
  
  // Drag state
  const [dragState, setDragState] = useState<DragState>({
    elementId: null,
    startX: 0,
    startY: 0
  });

  // Canvas ref
  const canvasRef = useRef<HTMLDivElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedAuth = sessionStorage.getItem('adminAuthenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }

    const savedConfig = localStorage.getItem('adminPanelConfig');
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
      } catch (e) {
        console.error('Failed to load saved config:', e);
      }
    }
  }, []);

  // Save to localStorage on config change
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('adminPanelConfig', JSON.stringify(config));
    }
  }, [config, isAuthenticated]);

  // Authentication handler
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuthenticated', 'true');
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  // Element management
  const addElement = useCallback((x: number, y: number) => {
    const id = `element-${Date.now()}`;
    const newElement = {
      text: 'New Element',
      emoji: '🔵',
      type: ElementType.Cause,
      x,
      y
    };
    
    setConfig(prev => ({
      ...prev,
      elements: {
        ...prev.elements,
        [id]: newElement
      }
    }));
    
    setSelectedElementId(id);
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<typeof config.elements[string]>) => {
    setConfig(prev => ({
      ...prev,
      elements: {
        ...prev.elements,
        [id]: {
          ...prev.elements[id],
          ...updates
        }
      }
    }));
  }, []);

  const deleteElement = useCallback((id: string) => {
    setConfig(prev => {
      const newElements = { ...prev.elements };
      delete newElements[id];
      
      // Remove from connections
      const newConnections = prev.connectionGroups.map(group => ({
        ...group,
        causes: group.causes.filter(causeId => causeId !== id)
      })).filter(group => group.effect !== id && group.causes.length > 0);
      
      // Remove from initial available
      const newInitial = prev.initialAvailableElements.filter(elId => elId !== id);
      
      return {
        elements: newElements,
        connectionGroups: newConnections,
        initialAvailableElements: newInitial
      };
    });
    
    setSelectedElementId(null);
  }, []);

  // Connection management
  const addConnection = useCallback((causes: string[], effect: string, phrase: string) => {
    setConfig(prev => ({
      ...prev,
      connectionGroups: [...prev.connectionGroups, { causes, effect, phrase }]
    }));
  }, []);

  const updateConnection = useCallback((index: number, updates: Partial<ConnectionGroup>) => {
    setConfig(prev => ({
      ...prev,
      connectionGroups: prev.connectionGroups.map((group, i) => 
        i === index ? { ...group, ...updates } : group
      )
    }));
  }, []);

  const deleteConnection = useCallback((index: number) => {
    setConfig(prev => ({
      ...prev,
      connectionGroups: prev.connectionGroups.filter((_, i) => i !== index)
    }));
    setSelectedConnectionIndex(null);
  }, []);

  // Initial available elements management
  const toggleInitialAvailable = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      initialAvailableElements: prev.initialAvailableElements.includes(id)
        ? prev.initialAvailableElements.filter(elId => elId !== id)
        : [...prev.initialAvailableElements, id]
    }));
  }, []);

  // Import/Export
  const exportConfig = useCallback(() => {
    const exportData = {
      elements: config.elements,
      validCauseCombos: config.connectionGroups.reduce((acc, group) => {
        if (!acc[group.effect]) {
            acc[group.effect] = {
                combos: [],
                phrase: group.phrase
            };
        }
        acc[group.effect].combos.push(group.causes);
        return acc;
      }, {} as Record<string, { combos: string[][], phrase: string }>),
      initialAvailableElements: config.initialAvailableElements
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cause-effect-config-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [config]);

  const importConfig = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        // Convert from export format back to admin format
        const connectionGroups: ConnectionGroup[] = [];
        if (data.validCauseCombos) {
          Object.entries(data.validCauseCombos).forEach(([effectId, combo]: [string, any]) => {
            combo.combos.forEach((causes: string[]) => {
              connectionGroups.push({
                causes,
                effect: effectId,
                phrase: combo.phrase
              });
            });
          });
        }
        
        setConfig({
          elements: data.elements || {},
          connectionGroups,
          initialAvailableElements: data.initialAvailableElements || []
        });
      } catch (err) {
        alert('Failed to import file. Please check the format.');
      }
    };
    reader.readAsText(file);
  }, []);

  // Canvas click handler
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPreviewMode && (e.target === e.currentTarget || e.target === canvasRef.current)) {
      const rect = canvasRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left + canvasRef.current!.scrollLeft;
      const y = e.clientY - rect.top + canvasRef.current!.scrollTop;
      addElement(x, y);
    }
  }, [addElement, isPreviewMode]);

  // Drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent, elementId: string) => {
    if (!isPreviewMode) {
      const element = config.elements[elementId];
      setDragState({
        elementId,
        startX: e.clientX - element.x,
        startY: e.clientY - element.y
      });
      e.preventDefault();
    }
  }, [config.elements, isPreviewMode]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragState.elementId && !isPreviewMode) {
      const newX = e.clientX - dragState.startX;
      const newY = e.clientY - dragState.startY;
      updateElement(dragState.elementId, { x: newX, y: newY });
    }
  }, [dragState, updateElement, isPreviewMode]);

  const handleMouseUp = useCallback(() => {
    setDragState({ elementId: null, startX: 0, startY: 0 });
  }, []);

  // Authentication screen
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/95 to-indigo-900/95 flex items-center justify-center z-50">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 max-w-md w-full">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Admin Access</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400"
              autoFocus
            />
            {passwordError && (
              <p className="text-red-300 text-sm">Incorrect password. Please try again.</p>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105"
            >
              Access Admin Panel
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-all duration-300"
              >
                Cancel
              </button>
            )}
          </form>
        </div>
        
        {/* Floating orb effect */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-purple-400 rounded-full filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-indigo-400 rounded-full filter blur-3xl opacity-20 animate-pulse animation-delay-2000" />
      </div>
    );
  }

  const selectedElement = selectedElementId ? config.elements[selectedElementId] : null;

  // Main admin panel
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 to-indigo-900 overflow-hidden z-50">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Cause & Effect Chain Builder</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                isPreviewMode 
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {isPreviewMode ? 'Preview Mode' : 'Edit Mode'}
            </button>
            <button
              onClick={exportConfig}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all duration-300"
            >
              Export JSON
            </button>
            <label className="px-4 py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-all duration-300 cursor-pointer">
              Import JSON
              <input
                type="file"
                accept=".json"
                onChange={(e) => e.target.files?.[0] && importConfig(e.target.files[0])}
                className="hidden"
              />
            </label>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all duration-300"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-72px)]">
        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <div
            ref={canvasRef}
            className="absolute inset-0 overflow-auto"
            onClick={handleCanvasClick}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <div className="relative w-full h-full min-w-[2400px] min-h-[1800px] bg-gradient-to-br from-gray-50 to-slate-100 p-4">
              {/* SVG for connections */}
              <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9.5" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" className="fill-emerald-500" />
                  </marker>
                </defs>
                {config.connectionGroups.map((group, index) => {
                  const toEl = config.elements[group.effect];
                  if (!toEl) return null;

                  return group.causes.map((causeId, causeIndex) => {
                    const fromEl = config.elements[causeId];
                    if (!fromEl) return null;

                    const x1 = fromEl.x + 160;
                    const y1 = fromEl.y + 56;
                    const x2 = toEl.x;
                    const y2 = toEl.y + 56;
                    const midX = (x1 + x2) / 2;
                    const midY = (y1 + y2) / 2;

                    return (
                      <g key={`${index}-${causeIndex}`}>
                        <line
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          className="stroke-emerald-500"
                          strokeWidth="3"
                          markerEnd="url(#arrowhead)"
                        />
                        <text
                          x={midX}
                          y={midY - 10}
                          textAnchor="middle"
                          className="fill-gray-700 font-semibold text-sm"
                          style={{ paintOrder: 'stroke', stroke: 'white', strokeWidth: '4px' }}
                        >
                          {group.phrase}
                        </text>
                      </g>
                    );
                  });
                })}
              </svg>

              {/* Elements */}
              {Object.entries(config.elements).map(([id, element]) => (
                <div
                  key={id}
                  className={`absolute flex items-center justify-center p-4 rounded-lg shadow-lg transition-all duration-300 ${
                    element.type === ElementType.Cause
                      ? 'bg-blue-100 border-2 border-blue-300'
                      : element.type === ElementType.EffectCause
                      ? 'bg-purple-100 border-2 border-purple-300'
                      : 'bg-green-100 border-2 border-green-300'
                  } ${
                    selectedElementId === id ? 'ring-4 ring-indigo-400' : ''
                  } ${
                    !isPreviewMode ? 'cursor-move hover:shadow-xl' : ''
                  }`}
                  style={{
                    left: `${element.x}px`,
                    top: `${element.y}px`,
                    width: '320px',
                    height: '112px'
                  }}
                  onMouseDown={(e) => handleMouseDown(e, id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedElementId(id);
                  }}
                >
                  <div className="text-4xl mr-3">{element.emoji}</div>
                  <div className="flex-1 text-sm font-medium">{element.text}</div>
                  {!isPreviewMode && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Delete this element?')) {
                          deleteElement(id);
                        }
                      }}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}

              {!isPreviewMode && (
                <div className="absolute bottom-4 left-4 text-gray-600 bg-white/80 px-3 py-2 rounded-lg">
                  Click empty space to add element • Drag elements to move
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-96 bg-white/10 backdrop-blur-lg border-l border-white/20 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Element Properties */}
            {selectedElement && (
              <div className="bg-white/10 rounded-lg p-4 space-y-4">
                <h3 className="text-lg font-semibold text-white">Element Properties</h3>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">Text</label>
                  <textarea
                    value={selectedElement.text}
                    onChange={(e) => updateElement(selectedElementId!, { text: e.target.value })}
                    className="w-full px-3 py-2 bg-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">Emoji</label>
                  <input
                    type="text"
                    value={selectedElement.emoji}
                    onChange={(e) => updateElement(selectedElementId!, { emoji: e.target.value })}
                    className="w-full px-3 py-2 bg-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">Type</label>
                  <select
                    value={selectedElement.type}
                    onChange={(e) => updateElement(selectedElementId!, { type: e.target.value as ElementType })}
                    className="w-full px-3 py-2 bg-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    <option value={ElementType.Cause}>Cause</option>
                    <option value={ElementType.EffectCause}>Effect-Cause</option>
                    <option value={ElementType.Effect}>Effect</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">X</label>
                    <input
                      type="number"
                      value={selectedElement.x}
                      onChange={(e) => updateElement(selectedElementId!, { x: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 bg-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">Y</label>
                    <input
                      type="number"
                      value={selectedElement.y}
                      onChange={(e) => updateElement(selectedElementId!, { y: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 bg-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Connections */}
            <div className="bg-white/10 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Connections</h3>
                <button
                  onClick={() => setShowConnectionForm(true)}
                  className="px-3 py-1 bg-emerald-500 text-white rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-colors"
                >
                  Add Connection
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {config.connectionGroups.map((group, index) => (
                  <div
                    key={index}
                    className={`p-3 bg-white/10 rounded-lg cursor-pointer transition-all ${
                      selectedConnectionIndex === index ? 'ring-2 ring-purple-400' : ''
                    }`}
                    onClick={() => setSelectedConnectionIndex(index)}
                  >
                    <div className="text-sm text-white/80">
                      {group.causes.map(c => config.elements[c]?.text || '...').join(' + ')} → {config.elements[group.effect]?.text || '...'}
                    </div>
                    <div className="text-xs text-white/60 mt-1">"{group.phrase}"</div>
                    {selectedConnectionIndex === index && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteConnection(index);
                        }}
                        className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Initial Available Elements */}
            <div className="bg-white/10 rounded-lg p-4 space-y-4">
              <h3 className="text-lg font-semibold text-white">Initial Available Elements</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {Object.entries(config.elements)
                  .filter(([_, el]) => el.type === ElementType.Cause)
                  .map(([id, element]) => (
                    <label key={id} className="flex items-center text-white/80 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.initialAvailableElements.includes(id)}
                        onChange={() => toggleInitialAvailable(id)}
                        className="mr-2"
                      />
                      <span className="text-sm">{element.text}</span>
                    </label>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Connection Form Modal */}
      {showConnectionForm && (
        <ConnectionFormModal
          elements={config.elements}
          onAdd={addConnection}
          onClose={() => setShowConnectionForm(false)}
        />
      )}
    </div>
  );
};

// Connection Form Modal Component
interface ConnectionFormModalProps {
  elements: ElementsMap;
  onAdd: (causes: string[], effect: string, phrase: string) => void;
  onClose: () => void;
}

const ConnectionFormModal: React.FC<ConnectionFormModalProps> = ({ elements, onAdd, onClose }) => {
  const [selectedCauses, setSelectedCauses] = useState<string[]>([]);
  const [selectedEffect, setSelectedEffect] = useState<string>('');
  const [phrase, setPhrase] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCauses.length > 0 && selectedEffect && phrase) {
      onAdd(selectedCauses, selectedEffect, phrase);
      onClose();
    }
  };

  const toggleCause = (id: string) => {
    setSelectedCauses(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-white mb-4">Add Connection</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Select Causes</label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {Object.entries(elements)
                .filter(([_, el]) => el.type === ElementType.Cause || el.type === ElementType.EffectCause)
                .map(([id, element]) => (
                  <label key={id} className="flex items-center text-white/80 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCauses.includes(id)}
                      onChange={() => toggleCause(id)}
                      className="mr-2"
                    />
                    <span className="text-sm">{element.text}</span>
                  </label>
                ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Select Effect</label>
            <select
              value={selectedEffect}
              onChange={(e) => setSelectedEffect(e.target.value)}
              className="w-full px-3 py-2 bg-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="">Choose an effect...</option>
              {Object.entries(elements)
                .filter(([_, el]) => el.type === ElementType.Effect || el.type === ElementType.EffectCause)
                .map(([id, element]) => (
                  <option key={id} value={id}>{element.text}</option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Connection Phrase</label>
            <input
              type="text"
              value={phrase}
              onChange={(e) => setPhrase(e.target.value)}
              placeholder="e.g., 'leads to', 'causes', 'results in'"
              className="w-full px-3 py-2 bg-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
            >
              Add Connection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPanel;