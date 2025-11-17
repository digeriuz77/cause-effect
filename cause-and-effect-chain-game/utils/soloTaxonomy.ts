import { ConnectionGroup } from '../types';

/**
 * SOLO Taxonomy Levels
 * Based on connection quality and cognitive complexity
 */
export enum SOLOLevel {
  PreStructural = 'pre-structural',
  UniStructural = 'unistructural',
  MultiStructural = 'multistructural',
  Relational = 'relational',
  ExtendedAbstract = 'extended-abstract'
}

export interface SOLOLevelInfo {
  level: SOLOLevel;
  label: string;
  description: string;
  color: string;
  emoji: string;
}

export const SOLO_LEVEL_INFO: Record<SOLOLevel, SOLOLevelInfo> = {
  [SOLOLevel.PreStructural]: {
    level: SOLOLevel.PreStructural,
    label: 'Pre-Structural',
    description: 'Getting started',
    color: 'bg-gray-400',
    emoji: '🌱'
  },
  [SOLOLevel.UniStructural]: {
    level: SOLOLevel.UniStructural,
    label: 'Unistructural',
    description: 'Simple connection: one cause → one effect',
    color: 'bg-blue-400',
    emoji: '🔵'
  },
  [SOLOLevel.MultiStructural]: {
    level: SOLOLevel.MultiStructural,
    label: 'Multistructural',
    description: 'Multiple causes identified',
    color: 'bg-purple-400',
    emoji: '🟣'
  },
  [SOLOLevel.Relational]: {
    level: SOLOLevel.Relational,
    label: 'Relational',
    description: 'Understanding how causes work together',
    color: 'bg-green-500',
    emoji: '🟢'
  },
  [SOLOLevel.ExtendedAbstract]: {
    level: SOLOLevel.ExtendedAbstract,
    label: 'Extended Abstract',
    description: 'Applying patterns to new contexts',
    color: 'bg-yellow-500',
    emoji: '⭐'
  }
};

/**
 * Calculate SOLO level for a connection based on:
 * - Number of causes
 * - Whether causes have been used before (showing integration)
 * - Connection complexity
 */
export function calculateSOLOLevel(
  currentConnection: ConnectionGroup,
  allConnections: ConnectionGroup[]
): SOLOLevel {
  const { causes } = currentConnection;
  const numCauses = causes.length;

  // Get all previous connections (excluding current)
  const previousConnections = allConnections.filter(
    conn => !(conn.causes.every(c => causes.includes(c)) && conn.effect === currentConnection.effect)
  );

  // Check if any causes have been used before
  const reusedCauses = causes.filter(causeId =>
    previousConnections.some(conn => conn.causes.includes(causeId))
  );
  const hasReusedCauses = reusedCauses.length > 0;

  // Check if this effect has been targeted before with different causes
  const sameEffectConnections = previousConnections.filter(
    conn => conn.effect === currentConnection.effect
  );
  const hasMultiplePathsToEffect = sameEffectConnections.length > 0;

  // SOLO level logic
  if (numCauses === 1) {
    return SOLOLevel.UniStructural;
  }

  if (numCauses === 2 && !hasReusedCauses) {
    return SOLOLevel.MultiStructural;
  }

  // 3+ causes OR causes are being integrated from previous connections = Relational
  if (numCauses >= 3 || hasReusedCauses || hasMultiplePathsToEffect) {
    return SOLOLevel.Relational;
  }

  return SOLOLevel.MultiStructural;
}

/**
 * Generate feedback message based on SOLO level achievement
 */
export function getSOLOFeedback(level: SOLOLevel, numCauses: number): string {
  const info = SOLO_LEVEL_INFO[level];

  switch (level) {
    case SOLOLevel.UniStructural:
      return `${info.emoji} You made a simple connection! This is ${info.label} thinking - linking one cause to one effect.`;

    case SOLOLevel.MultiStructural:
      return `${info.emoji} Great! You connected ${numCauses} causes! This is ${info.label} thinking - identifying multiple factors.`;

    case SOLOLevel.Relational:
      return `${info.emoji} Excellent! You're showing ${info.label} thinking by understanding how multiple causes work together as a system!`;

    case SOLOLevel.ExtendedAbstract:
      return `${info.emoji} Outstanding! This is ${info.label} thinking - you're applying these patterns to new contexts!`;

    default:
      return '';
  }
}

/**
 * Calculate overall SOLO progress for all connections
 */
export function calculateOverallProgress(connections: ConnectionGroup[]): {
  uniCount: number;
  multiCount: number;
  relationalCount: number;
  extendedCount: number;
  highestLevel: SOLOLevel;
  percentage: number;
} {
  let uniCount = 0;
  let multiCount = 0;
  let relationalCount = 0;
  let extendedCount = 0;

  connections.forEach((conn, index) => {
    const level = calculateSOLOLevel(conn, connections.slice(0, index));

    switch (level) {
      case SOLOLevel.UniStructural:
        uniCount++;
        break;
      case SOLOLevel.MultiStructural:
        multiCount++;
        break;
      case SOLOLevel.Relational:
        relationalCount++;
        break;
      case SOLOLevel.ExtendedAbstract:
        extendedCount++;
        break;
    }
  });

  // Determine highest level achieved
  let highestLevel = SOLOLevel.PreStructural;
  if (uniCount > 0) highestLevel = SOLOLevel.UniStructural;
  if (multiCount > 0) highestLevel = SOLOLevel.MultiStructural;
  if (relationalCount > 0) highestLevel = SOLOLevel.Relational;
  if (extendedCount > 0) highestLevel = SOLOLevel.ExtendedAbstract;

  // Calculate percentage toward relational thinking (our main goal)
  const totalConnections = connections.length || 1;
  const advancedConnections = multiCount + relationalCount + extendedCount;
  const percentage = Math.round((advancedConnections / totalConnections) * 100);

  return {
    uniCount,
    multiCount,
    relationalCount,
    extendedCount,
    highestLevel,
    percentage
  };
}

/**
 * Get Bahasa Melayu translation for SOLO level
 */
export function getSOLOLevelBM(level: SOLOLevel): string {
  const translations: Record<SOLOLevel, string> = {
    [SOLOLevel.PreStructural]: 'Pra-Struktur',
    [SOLOLevel.UniStructural]: 'Uni-Struktur',
    [SOLOLevel.MultiStructural]: 'Multi-Struktur',
    [SOLOLevel.Relational]: 'Relasi',
    [SOLOLevel.ExtendedAbstract]: 'Abstrak Lanjutan'
  };
  return translations[level];
}
