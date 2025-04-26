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