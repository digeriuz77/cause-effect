import React from 'react';
import { ConnectionGroup } from '../types';
import { calculateOverallProgress, SOLO_LEVEL_INFO, SOLOLevel } from '../utils/soloTaxonomy';
import { SimpleTooltip } from './TranslationTooltip';

interface SOLOProgressIndicatorProps {
  connections: ConnectionGroup[];
  compact?: boolean;
}

/**
 * Visual indicator showing student's SOLO taxonomy progress
 * Displays current thinking level and achievements
 */
const SOLOProgressIndicator: React.FC<SOLOProgressIndicatorProps> = ({
  connections,
  compact = false
}) => {
  const progress = calculateOverallProgress(connections);
  const currentLevelInfo = SOLO_LEVEL_INFO[progress.highestLevel];

  // If no connections yet, show encouragement
  if (connections.length === 0) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🌱</span>
          <div>
            <p className="font-semibold text-gray-800">Ready to start!</p>
            <p className="text-sm text-gray-600">Make your first connection to begin</p>
          </div>
        </div>
      </div>
    );
  }

  // Compact version (for header/sidebar)
  if (compact) {
    return (
      <SimpleTooltip
        bmText={`Tahap: ${currentLevelInfo.label}`}
        context="Your current thinking level"
        enabled={true}
      >
        <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <span className="text-xl">{currentLevelInfo.emoji}</span>
          <div className="text-sm">
            <span className="font-semibold text-gray-800">{currentLevelInfo.label}</span>
          </div>
        </div>
      </SimpleTooltip>
    );
  }

  // Full version
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-purple-200 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <SimpleTooltip
            bmText="Tahap Pemikiran Anda"
            context="Based on SOLO Taxonomy"
            enabled={true}
          >
            <h3 className="text-lg font-bold text-gray-800 mb-1">Your Thinking Level</h3>
          </SimpleTooltip>
          <p className="text-sm text-gray-600">{currentLevelInfo.description}</p>
        </div>
        <span className="text-4xl">{currentLevelInfo.emoji}</span>
      </div>

      {/* Current Level Badge */}
      <div className={`inline-block px-4 py-2 rounded-full font-semibold text-white mb-4 ${currentLevelInfo.color}`}>
        {currentLevelInfo.label}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <SimpleTooltip bmText="Kemajuan" enabled={true}>
            <span className="font-medium text-gray-700">Progress toward Relational Thinking</span>
          </SimpleTooltip>
          <span className="font-bold text-purple-600">{progress.percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-500 to-green-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </div>

      {/* Connection Breakdown */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        {progress.uniCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-lg">{SOLO_LEVEL_INFO[SOLOLevel.UniStructural].emoji}</span>
            <SimpleTooltip bmText="Uni-Struktur" enabled={true}>
              <span className="text-gray-700">
                <span className="font-semibold">{progress.uniCount}</span> Simple
              </span>
            </SimpleTooltip>
          </div>
        )}

        {progress.multiCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-lg">{SOLO_LEVEL_INFO[SOLOLevel.MultiStructural].emoji}</span>
            <SimpleTooltip bmText="Multi-Struktur" enabled={true}>
              <span className="text-gray-700">
                <span className="font-semibold">{progress.multiCount}</span> Multiple
              </span>
            </SimpleTooltip>
          </div>
        )}

        {progress.relationalCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-lg">{SOLO_LEVEL_INFO[SOLOLevel.Relational].emoji}</span>
            <SimpleTooltip bmText="Relasi" enabled={true}>
              <span className="text-gray-700">
                <span className="font-semibold">{progress.relationalCount}</span> Relational
              </span>
            </SimpleTooltip>
          </div>
        )}

        {progress.extendedCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-lg">{SOLO_LEVEL_INFO[SOLOLevel.ExtendedAbstract].emoji}</span>
            <SimpleTooltip bmText="Abstrak Lanjutan" enabled={true}>
              <span className="text-gray-700">
                <span className="font-semibold">{progress.extendedCount}</span> Extended
              </span>
            </SimpleTooltip>
          </div>
        )}
      </div>

      {/* Achievement message */}
      {progress.relationalCount > 0 && (
        <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
          <p className="text-sm font-semibold text-green-800">
            🎉 Great! You're showing relational thinking by connecting ideas together!
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * Mini badge version - shows just the current level
 */
export const SOLOBadge: React.FC<{ level: SOLOLevel }> = ({ level }) => {
  const info = SOLO_LEVEL_INFO[level];

  return (
    <SimpleTooltip bmText={info.label} context={info.description} enabled={true}>
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold text-white ${info.color}`}>
        <span>{info.emoji}</span>
        <span>{info.label}</span>
      </span>
    </SimpleTooltip>
  );
};

export default SOLOProgressIndicator;
