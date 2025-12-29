
export enum Level {
  FOUR = '4ème',
  THREE = '3ème',
  TWO = '2de',
  ONE = '1ère',
  TLE = 'Tle'
}

export interface Topic {
  id: string;
  title: string;
  category: 'Mécanique' | 'Optique' | 'Électricité' | 'Thermodynamique' | 'Nucléaire' | 'Chimie' | 'Ondes' | 'Quantique';
  levels: Level[];
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export type AppState = 'dashboard' | 'lesson' | 'exercises' | 'ai-explainer' | 'games';
