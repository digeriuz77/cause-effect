export enum ElementType {
  Cause = 'cause',
  EffectCause = 'effect-cause',
  Effect = 'effect',
}

export interface ElementData {
  text: string;
  emoji: string;
  type: ElementType;
  x: number;
  y: number;
}

export interface ElementsMap {
  [key:string]: ElementData;
}

export interface ConnectionGroup {
  causes: string[];
  effect: string;
  phrase: string;
}

export interface ComprehensionQuestion {
  question: string;
  answer: boolean; // true for "True", false for "False"
}