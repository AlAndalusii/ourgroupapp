import { UserData, Business, MonthlyGoal, Goal, CSVExportOptions } from '@/types';

// Get current month name
export const getCurrentMonth = (): string => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return months[new Date().getMonth()];
};

// Get current year
export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

// Storage keys
const STORAGE_KEY_PREFIX = 'our_group_app';
const getUserStorageKey = (userId: number) => `${STORAGE_KEY_PREFIX}_user_${userId}`;

// Save user data to localStorage
export const saveUserData = (userId: number, userData: UserData): void => {
  try {
    localStorage.setItem(getUserStorageKey(userId), JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

// Add storage availability test
export const isStorageAvailable = (): boolean => {
  try {
    const testKey = `${STORAGE_KEY_PREFIX}_test`;
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    console.error('localStorage not available:', error);
    return false;
  }
};

// Get user data from localStorage with fallback
export const getUserData = (userId: number): UserData | null => {
  if (!isStorageAvailable()) {
    console.warn('localStorage not available, returning null');
    return null;
  }

  try {
    const data = localStorage.getItem(getUserStorageKey(userId));
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

// Save monthly goals for a user
export const saveMonthlyGoals = (userId: number, month: string, goals: MonthlyGoal[]): void => {
  try {
    const userData = getUserData(userId);
    if (userData) {
      userData.monthlyGoals = {
        ...userData.monthlyGoals,
        [month]: goals,
      };
      saveUserData(userId, userData);
    }
  } catch (error) {
    console.error('Error saving monthly goals:', error);
  }
};

// Get monthly goals for a user
export const getMonthlyGoals = (userId: number, month: string): MonthlyGoal[] => {
  try {
    const userData = getUserData(userId);
    return userData?.monthlyGoals?.[month] || [];
  } catch (error) {
    console.error('Error getting monthly goals:', error);
    return [];
  }
};

// Save yearly goals for a user
export const saveYearlyGoals = (userId: number, goals: Goal[]): void => {
  try {
    const userData = getUserData(userId);
    if (userData) {
      userData.yearlyGoals = goals;
      saveUserData(userId, userData);
    }
  } catch (error) {
    console.error('Error saving yearly goals:', error);
  }
};

// Get yearly goals for a user
export const getYearlyGoals = (userId: number): Goal[] => {
  try {
    const userData = getUserData(userId);
    return userData?.yearlyGoals || [];
  } catch (error) {
    console.error('Error getting yearly goals:', error);
    return [];
  }
};

// Save monthly score for a user
export const saveMonthlyScore = (userId: number, month: string, score: number): void => {
  try {
    const userData = getUserData(userId);
    if (userData) {
      userData.monthlyScores = {
        ...userData.monthlyScores,
        [month]: score,
      };
      saveUserData(userId, userData);
    }
  } catch (error) {
    console.error('Error saving monthly score:', error);
  }
};

// Get monthly score for a user
export const getMonthlyScore = (userId: number, month: string): number => {
  try {
    const userData = getUserData(userId);
    return userData?.monthlyScores?.[month] || 0;
  } catch (error) {
    console.error('Error getting monthly score:', error);
    return 0;
  }
};

// Save businesses for a user
export const saveBusinesses = (userId: number, businesses: Business[]): void => {
  try {
    const userData = getUserData(userId);
    if (userData) {
      userData.businesses = businesses;
      saveUserData(userId, userData);
    }
  } catch (error) {
    console.error('Error saving businesses:', error);
  }
};

// Get businesses for a user
export const getBusinesses = (userId: number): Business[] => {
  try {
    const userData = getUserData(userId);
    return userData?.businesses || [];
  } catch (error) {
    console.error('Error getting businesses:', error);
    return [];
  }
};

// Check if we have any data stored for the user
export const hasUserData = (userId: number): boolean => {
  return localStorage.getItem(getUserStorageKey(userId)) !== null;
};

// Initialize user data from sample data if not present
export const initializeUserDataIfNeeded = (userId: number, sampleData: UserData): UserData => {
  // Add debugging
  console.log('Initializing user data if needed for user ID:', userId);
  console.log('Has existing user data?', hasUserData(userId));
  
  try {
    if (!hasUserData(userId)) {
      console.log('No existing data, saving sample data:', sampleData);
      saveUserData(userId, sampleData);
      return sampleData;
    }
    
    // Data exists, retrieve it
    const existingData = getUserData(userId);
    console.log('Found existing data:', existingData);
    
    if (!existingData) {
      // Fallback in case getUserData returns null even though hasUserData was true
      console.log('Existing data is null, using sample data instead');
      saveUserData(userId, sampleData);
      return sampleData;
    }
    
    return existingData;
  } catch (error) {
    console.error('Error in initializeUserDataIfNeeded:', error);
    // If there's any error, return the sample data as fallback
    return sampleData;
  }
};

// Export user data to CSV
export const exportUserDataToCsv = (
  userId: number, 
  options: { month?: string; section?: 'personal' | 'business' | 'all' } = { section: 'all' }
): string => {
  const userData = getUserData(userId);
  if (!userData) return '';
  
  let csvContent = 'Category,Title,Description,Completed,Score\n';
  
  // Filter by month if specified
  const month = options.month;
  
  // Add personal goals if requested
  if (options.section === 'all' || options.section === 'personal') {
    // Add yearly goals
    userData.yearlyGoals.forEach(goal => {
      csvContent += `Yearly Goal,${escapeCSV(goal.title)},${escapeCSV(goal.description)},${goal.completed ? 'Yes' : 'No'},N/A\n`;
    });
    
    // Add monthly goals (filtered by month if specified)
    Object.entries(userData.monthlyGoals).forEach(([goalMonth, goals]) => {
      if (!month || month === goalMonth) {
        goals.forEach(goal => {
          csvContent += `Monthly Goal (${goalMonth}),${escapeCSV(goal.title)},${escapeCSV(goal.description)},${goal.completed ? 'Yes' : 'No'},${goal.score}\n`;
        });
      }
    });
    
    // Add monthly scores (filtered by month if specified)
    Object.entries(userData.monthlyScores).forEach(([scoreMonth, score]) => {
      if (!month || month === scoreMonth) {
        csvContent += `Monthly Score,${scoreMonth},Overall Performance,N/A,${score}\n`;
      }
    });
  }
  
  // Add business data if requested
  if ((options.section === 'all' || options.section === 'business') && userData.businesses) {
    userData.businesses.forEach(business => {
      csvContent += `Business,${escapeCSV(business.name)},Business Entity,N/A,N/A\n`;
      
      // Add business tasks
      business.tasks.forEach(task => {
        csvContent += `Business Task,${escapeCSV(task.title)},${escapeCSV(task.description || '')},${task.completed ? 'Yes' : 'No'},N/A\n`;
      });
      
      // Add business monthly goals if available (filtered by month if specified)
      if (business.monthlyGoals) {
        Object.entries(business.monthlyGoals).forEach(([goalMonth, goals]) => {
          if (!month || month === goalMonth) {
            goals.forEach(goal => {
              csvContent += `Business Goal (${goalMonth}),${escapeCSV(goal.title)},${escapeCSV(goal.description)},${goal.completed ? 'Yes' : 'No'},${goal.score}\n`;
            });
          }
        });
      }
    });
  }
  
  return csvContent;
};

// Helper function to escape CSV values
const escapeCSV = (value: string): string => {
  // If the value contains a comma, quote, or newline, wrap it in quotes and escape any quotes
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

// Helper function to trigger CSV download
export const downloadCsv = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}; 