export type GameStationId = 1 | 2 | 3 | 4 | 5;

export interface GameStation {
  id: GameStationId;
  name: string;
  subtitle: string;
  structurePart: 'Pernyataan Umum' | 'Deretan Penjelas' | 'Penutup / Interpretasi';
  description: string;
  voiceIntro: string;
  x: number; // Percentage on map (0-100)
  y: number; // Percentage on map (0-100)
  iconName: 'sun' | 'droplet' | 'prism' | 'reflect' | 'rainbow';
  starsRequired: number;
}

export interface Question {
  id: string;
  stationId: GameStationId;
  question: string;
  voiceQuestion: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
    correctVoice: string;
    wrongVoice: string;
  }[];
}

export interface StoryboardScene {
  sceneNumber: number;
  title: string;
  structureSection: 'Pernyataan Umum' | 'Deretan Penjelas (Sebab-Akibat)' | 'Penutup (Interpretasi)';
  visualDescription: string;
  mascotNarration: string;
  gameMechanic: string;
  estimatedDuration: string;
  learningObjective: string;
}

export interface UserProgress {
  studentName: string;
  completedStations: GameStationId[];
  stationStars: Record<GameStationId, number>;
  totalScore: number;
  coins: number;
  activeStationId: GameStationId | null;
  gameStartTime: number | null;
  elapsedSeconds: number;
  hasFinishedGame: boolean;
}
