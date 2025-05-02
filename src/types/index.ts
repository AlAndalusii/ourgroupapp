// User related types

export interface User {
  id: number;
  name: string;
  color: string;
}

export interface UserData {
  userId: number;
  yearlyGoals: Goal[];
  monthlyGoals: Record<string, MonthlyGoal[]>;
  monthlyScores: Record<string, number>;
  userLogo?: string; // Optional user logo
  businesses?: Business[]; // Optional businesses array
}

export interface Business {
  id: number;
  name: string;
  logo?: string;
  tasks: BusinessTask[];
  monthlyGoals?: Record<string, MonthlyGoal[]>;
  metrics?: Record<string, any>; // For storing custom metrics
}

export interface BusinessTask {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  isWeekly?: boolean; // To differentiate weekly vs monthly tasks
}

export interface UserSelectorProps {
  users: User[];
  selectedUserId: number | null;
  onSelectUser: (userId: number) => void;
}

// Goal related types

export interface Goal {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  isOptional?: boolean;
}

export interface MonthlyGoal extends Goal {
  month: string;
  score: number; // 0-10
}

export interface GoalListProps {
  goals: Goal[];
  title: string;
  description: string;
  showScores?: boolean;
  onEditGoal?: (goal: Goal) => void;
}

// Hadith related types

export interface Hadith {
  id: number;
  english: string;
  arabic: string;
  narrator: string;
}

// Animation variants types
export interface AnimationVariants {
  hidden: object;
  visible: object;
  exit?: object;
}

export interface CSVExportOptions {
  month?: string;
  section?: 'personal' | 'business' | 'all';
  userId: number;
} 