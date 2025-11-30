
export enum WorldId {
  NUMBERS = 'numbers',
  ADD_SUB = 'add_sub',
  MULT = 'mult',
  DIV = 'div',
  GEO = 'geo',
  TIME = 'time',
  CHALLENGE = 'challenge'
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  INPUT = 'input',
  BOOLEAN = 'boolean' // True/False
}

export type Difficulty = 'easy' | 'normal' | 'hard';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[]; // For multiple choice
  correctAnswer: string;
  explanation?: string; // Static explanation
  shapeData?: { type: 'square' | 'circle' | 'triangle' | 'rectangle' | 'clock', value?: any }; // For visual rendering
}

export interface GuardianConfig {
  name: string;
  avatar: string; // Emoji
  message: string;
  themeColor: string; // Tailwind class override for boss battle
}

export interface WorldConfig {
  id: WorldId;
  title: string;
  description: string;
  storyPlot: string; // The specific narrative conflict
  color: string;
  icon: string; // Icon name
  requiredLevel: number; // Order index
  totalQuestions: number;
  orionIntro: string; // Message from Mago Orión
  guardian: GuardianConfig;
}

// --- NEW REWARD SYSTEM TYPES ---

export type ItemType = 'hat' | 'wand' | 'pet' | 'furniture' | 'outfit';

export interface StoreItem {
  id: string;
  name: string;
  type: ItemType;
  cost: number;
  icon: string; // Emoji or visual representation
  description: string;
}

export interface GrimoirePage {
  id: string;
  worldId: WorldId;
  title: string;
  content: string;
  visualSummary: string; // Simple text/emoji representation
}

export interface LevelProgress {
  stars: number; // 0-3
  completed: boolean;
  completedDifficulties: Difficulty[]; 
}

export type Race = 'human' | 'elf' | 'goblin';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string; // Tailwind bg color class
}

export interface GameState {
  unlockedLevelIndex: number;
  currentWorldId: WorldId | null;
  score: number; // Total lifetime score
  
  // New State
  crystals: number;
  levelProgress: Record<string, LevelProgress>;
  inventory: string[]; // List of item IDs owned
  
  // Avatar State
  avatar: {
    race: Race;
    skinColor: string; // CSS Filter or hex
  };
  
  equipped: {
    hat: string | null;
    wand: string | null;
    outfit: string | null;
    pet: string | null;
    furniture: string[]; // Placed furniture
  };
  unlockedGrimoirePages: string[]; // List of page IDs
  unlockedAchievements: string[]; // List of achievement IDs
}

// --- MINI GAMES ---

export type MiniGameId = 'dragon_race' | 'potion_lab' | 'shape_garden';

export interface MiniGameConfig {
  id: MiniGameId;
  title: string;
  description: string;
  icon: string;
  unlockWorldId: WorldId; // Which world must be completed to unlock
  color: string;
}
