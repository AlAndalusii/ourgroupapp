'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import GoalForm from './GoalForm';
import GoalList from './GoalList';
import ProgressTracker from './ProgressTracker';
import GoalsEditor from './GoalsEditor';
import BusinessManager from './BusinessManager';
import Image from 'next/image';
import CSVExporter from './CSVExporter';
import { 
  getUserData, 
  saveMonthlyGoals, 
  saveYearlyGoals, 
  saveMonthlyScore, 
  saveBusinesses,
  initializeUserDataIfNeeded,
  getCurrentMonth
} from '@/utils/storage';
import { UserData, Goal, MonthlyGoal, Business, BusinessTask } from '@/types';

// Dynamically import chart components to avoid SSR issues
const Line = dynamic(
  () => import('react-chartjs-2').then((mod) => mod.Line),
  { ssr: false }
);

const Bar = dynamic(
  () => import('react-chartjs-2').then((mod) => mod.Bar),
  { ssr: false }
);

const Pie = dynamic(
  () => import('react-chartjs-2').then((mod) => mod.Pie),
  { ssr: false }
);

// Only import chart.js on the client side
const initChartJS = async () => {
  if (typeof window !== 'undefined') {
    const { 
      Chart, 
      CategoryScale, 
      LinearScale, 
      PointElement, 
      LineElement, 
      BarElement, 
      Title, 
      Tooltip, 
      Legend, 
      ArcElement 
    } = await import('chart.js');
    
    Chart.register(
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      BarElement,
      Title,
      Tooltip,
      Legend,
      ArcElement
    );
  }
};

// Initialize chart.js
initChartJS();

// Sample data - in a real app this would come from a database
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Sample User Data
const USER_DATA: Record<number, UserData> = {
  1: {
    userId: 1,
    yearlyGoals: [
      { id: 1, title: 'Quran: Memorised Ten Juzz', description: 'Memorised Ten Juzz', completed: false },
      { id: 2, title: 'Quran: Recite Everyday', description: 'Recite Everyday', completed: false },
      { id: 3, title: 'Quran: Improve Makharij al-Huroof', description: 'Improve Makharij al-Huroof', completed: false },
      { id: 4, title: 'Tafsir: Finish Surah Baqarah Tafsir', description: 'Finish Surah Baqarah Tafsir', completed: false },
      { id: 5, title: 'Tafsir: Start Last Juzz', description: 'Start Last Juzz', completed: false },
      { id: 6, title: 'Tafsir: Surah Al Imran Begin', description: 'Surah Al Imran Begin', completed: false },
      { id: 7, title: 'Matters of the Heart: Begin Reading the Arabic', description: 'Begin Reading the Arabic', completed: false },
      { id: 8, title: 'Matters of the Heart: Weekly Session on Thursdays and Sundays', description: 'Weekly Session on Thursdays and Sundays', completed: false },
      { id: 9, title: 'Arabic: Finish Mustawa 4 Complete the test', description: 'Finish Mustawa 4 Complete the test', completed: false },
      { id: 10, title: 'Arabic: Begin private classes and get to level B1 Level', description: 'Begin private classes and get to level B1 Level', completed: false },
      { id: 11, title: 'Spanish: Start Spanish classes and get to Level B2 Level', description: 'Start Spanish classes and get to Level B2 Level', completed: false },
      { id: 12, title: 'Spanish: Record an entire Video En Espanol', description: 'Record an entire Video En Espanol', completed: false },
      { id: 13, title: 'Business: Set up my Company', description: 'Set up my Company', completed: false },
      { id: 14, title: 'Business: Begin Business with the Boys', description: 'Begin Business with the Boys', completed: false },
      { id: 15, title: 'Business: Reach 2000 MRR', description: 'Reach 2000 MRR', completed: false },
      { id: 16, title: 'Business: Grow my Newsletter to 2000 subs', description: 'Grow my Newsletter to 2000 subs', completed: false },
      { id: 17, title: 'Business: Consult 4 clients', description: 'Consult 4 clients', completed: false },
    ],
    monthlyGoals: {
      'February': [
        { id: 1, title: 'Quran: Memorise Last Two Juzz', description: 'Memorise Last Two Juzz', completed: false, month: 'February', score: 0 },
        { id: 2, title: 'Quran: Memorise the First Two Juzz and Half', description: 'Memorise the First Two Juzz and Half', completed: false, month: 'February', score: 0 },
        { id: 3, title: 'Arabic: Finish Mustawa 3 and Complete The Exam', description: 'Finish Mustawa 3 and Complete The Exam', completed: false, month: 'February', score: 0 },
        { id: 4, title: 'Arabic: Private Teacher?', description: 'Private Teacher?', completed: false, month: 'February', score: 0 },
        { id: 5, title: 'Arabic: Increase Vocab for Next Mustawa', description: 'Increase Vocab for Next Mustawa', completed: false, month: 'February', score: 0 },
        { id: 6, title: 'Arabic: Head Start on next Mustawa, Complete Writing book by 4 pages', description: 'Head Start on next Mustawa, Complete Writing book by 4 pages', completed: false, month: 'February', score: 0 },
        { id: 7, title: 'Tafsir: Revision for Verses Related to Hajj', description: 'Revision for Verses Related to Hajj', completed: false, month: 'February', score: 0 },
        { id: 8, title: 'Tafsir: From Ayat 202 until 219 (Verses Related to Hajj, Alcohol, Charity, Fighting in Sacred Months And Alcohol)', description: 'From Ayat 202 until 219 (Verses Related to Hajj, Alcohol, Charity, Fighting in Sacred Months And Alcohol)', completed: false, month: 'February', score: 0 },
        { id: 9, title: 'Spanish: Ability to Convey What I learnt to Someone Who Knows Absolutely Nothing About Arabic', description: 'Ability to Convey What I learnt to Someone Who Knows Absolutely Nothing About Arabic', completed: false, month: 'February', score: 0 },
      ],
      'March': [
        { id: 1, title: 'Quran: Revision of what I learn', description: 'Revision of what I learn', completed: false, month: 'March', score: 0 },
        { id: 2, title: 'Quran: Memoise most of the 3 last juzz', description: 'Memoise most of the 3 last juzz', completed: false, month: 'March', score: 0 },
        { id: 3, title: 'Arabic: Finish 5 more chapters in the book', description: 'Finish 5 more chapters in the book', completed: false, month: 'March', score: 0 },
        { id: 4, title: 'Arabic: Continue Arabic classes with teacher', description: 'Continue Arabic classes with teacher', completed: false, month: 'March', score: 0 },
        { id: 5, title: 'Tafsir: Start with verse 219(verse about Alcohol) and its ruling', description: 'Start with verse 219(verse about Alcohol) and its ruling', completed: false, month: 'March', score: 0 },
        { id: 6, title: 'Tafsir: Verses related to orphans and marriage to non Muslim or Murskrik', description: 'Verses related to orphans and marriage to non Muslim or Murskrik', completed: false, month: 'March', score: 0 },
        { id: 7, title: 'Tafsir: Verses related to divorce', description: 'Verses related to divorce', completed: false, month: 'March', score: 0 },
        { id: 8, title: 'Tafsir: Present verses related to Ramadan', description: 'Present verses related to Ramadan', completed: false, month: 'March', score: 0 },
        { id: 9, title: 'Spanish: Ability to Convey What I learnt to Someone Who Knows Absolutely Nothing About Arabic', description: 'Ability to Convey What I learnt to Someone Who Knows Absolutely Nothing About Arabic', completed: false, month: 'March', score: 0 },
      ],
      'April': [
        { id: 1, title: 'Quran: Revision of 3 juzz', description: 'Revision of 3 juzz', completed: false, month: 'April', score: 0 },
        { id: 2, title: 'Quran: Memorise the rest of Juzz 3', description: 'Memorise the rest of Juzz 3', completed: false, month: 'April', score: 0 },
        { id: 3, title: 'Arabic: Work on Arabic book, the workbook', description: 'Work on Arabic book, the workbook', completed: false, month: 'April', score: 0 },
        { id: 4, title: 'Arabic: Start classes again', description: 'Start classes again', completed: false, month: 'April', score: 0 },
        { id: 5, title: 'Arabic: Finish the rest of the topics and start level 5', description: 'Finish the rest of the topics and start level 5', completed: false, month: 'April', score: 0 },
        { id: 6, title: 'Tafsir: Begin the verses related to divorce, try and understand them and its ruling', description: 'Begin the verses related to divorce, try and understand them and its ruling', completed: false, month: 'April', score: 0 },
        { id: 7, title: 'Tafsir: Verses related to divorce from the first Ayat', description: 'Verses related to divorce from the first Ayat', completed: false, month: 'April', score: 0 },
        { id: 8, title: 'Spanish: Start Reading the book', description: 'Start Reading the book', completed: false, month: 'April', score: 0 },
        { id: 9, title: 'Spanish: Plan for return, work out my weaknesses', description: 'Plan for return, work out my weaknesses', completed: false, month: 'April', score: 0 },
        { id: 10, title: 'Business: Work on the Newsletter', description: 'Work on the Newsletter', completed: false, month: 'April', score: 0 },
        { id: 11, title: 'Business: Cold Email Strategy For Subs', description: 'Cold Email Strategy For Subs', completed: false, month: 'April', score: 0 },
        { id: 12, title: 'Business: Work on Two other projects related to my flights idea', description: 'Work on Two other projects related to my flights idea', completed: false, month: 'April', score: 0 },
        { id: 13, title: 'Business: Scraping Fights', description: 'Scraping Fights', completed: false, month: 'April', score: 0 },
        { id: 14, title: 'Matters of the heart: Read and go through previous notes', description: 'Read and go through previous notes', completed: false, month: 'April', score: 0 },
        { id: 15, title: 'Matters of the heart: Start the book again', description: 'Start the book again', completed: false, month: 'April', score: 0 },
        { id: 16, title: 'Matters of the heart: Start on Thursday', description: 'Start on Thursday', completed: false, month: 'April', score: 0 },
      ],
      'May': [
        { id: 1, title: 'Quran:', description: '', completed: false, month: 'May', score: 0 },
        { id: 2, title: 'Arabic:', description: '', completed: false, month: 'May', score: 0 },
        { id: 3, title: 'Tafsir:', description: '', completed: false, month: 'May', score: 0 },
        { id: 4, title: 'Spanish:', description: '', completed: false, month: 'May', score: 0 },
        { id: 5, title: 'Matters of the Heart:', description: '', completed: false, month: 'May', score: 0 },
      ],
      'June': [
        { id: 1, title: 'Arabic:', description: '', completed: false, month: 'June', score: 0 },
        { id: 2, title: 'Quran:', description: '', completed: false, month: 'June', score: 0 },
        { id: 3, title: 'Gym:', description: '', completed: false, month: 'June', score: 0 },
        { id: 4, title: 'Tafsir:', description: '', completed: false, month: 'June', score: 0 },
        { id: 5, title: 'Learning Islam:', description: '', completed: false, month: 'June', score: 0 },
        { id: 6, title: 'History:', description: '', completed: false, month: 'June', score: 0 },
        { id: 7, title: 'Business:', description: '', completed: false, month: 'June', score: 0 },
      ],
      'July': [
        { id: 1, title: 'Arabic:', description: '', completed: false, month: 'July', score: 0 },
        { id: 2, title: 'Quran:', description: '', completed: false, month: 'July', score: 0 },
        { id: 3, title: 'Gym:', description: '', completed: false, month: 'July', score: 0 },
        { id: 4, title: 'Tafsir:', description: '', completed: false, month: 'July', score: 0 },
        { id: 5, title: 'Learning Islam:', description: '', completed: false, month: 'July', score: 0 },
        { id: 6, title: 'History:', description: '', completed: false, month: 'July', score: 0 },
        { id: 7, title: 'Business:', description: '', completed: false, month: 'July', score: 0 },
      ],
      'August': [
        { id: 1, title: 'Arabic:', description: '', completed: false, month: 'August', score: 0 },
        { id: 2, title: 'Quran:', description: '', completed: false, month: 'August', score: 0 },
        { id: 3, title: 'Gym:', description: '', completed: false, month: 'August', score: 0 },
        { id: 4, title: 'Tafsir:', description: '', completed: false, month: 'August', score: 0 },
        { id: 5, title: 'Learning Islam:', description: '', completed: false, month: 'August', score: 0 },
        { id: 6, title: 'History:', description: '', completed: false, month: 'August', score: 0 },
        { id: 7, title: 'Business:', description: '', completed: false, month: 'August', score: 0 },
      ],
      'September': [
        { id: 1, title: 'Arabic:', description: '', completed: false, month: 'September', score: 0 },
        { id: 2, title: 'Quran:', description: '', completed: false, month: 'September', score: 0 },
        { id: 3, title: 'Gym:', description: '', completed: false, month: 'September', score: 0 },
        { id: 4, title: 'Tafsir:', description: '', completed: false, month: 'September', score: 0 },
        { id: 5, title: 'Learning Islam:', description: '', completed: false, month: 'September', score: 0 },
        { id: 6, title: 'History:', description: '', completed: false, month: 'September', score: 0 },
        { id: 7, title: 'Business:', description: '', completed: false, month: 'September', score: 0 },
      ],
      'October': [
        { id: 1, title: 'Arabic:', description: '', completed: false, month: 'October', score: 0 },
        { id: 2, title: 'Quran:', description: '', completed: false, month: 'October', score: 0 },
        { id: 3, title: 'Gym:', description: '', completed: false, month: 'October', score: 0 },
        { id: 4, title: 'Tafsir:', description: '', completed: false, month: 'October', score: 0 },
        { id: 5, title: 'Learning Islam:', description: '', completed: false, month: 'October', score: 0 },
        { id: 6, title: 'History:', description: '', completed: false, month: 'October', score: 0 },
        { id: 7, title: 'Business:', description: '', completed: false, month: 'October', score: 0 },
      ],
      'November': [
        { id: 1, title: 'Arabic:', description: '', completed: false, month: 'November', score: 0 },
        { id: 2, title: 'Quran:', description: '', completed: false, month: 'November', score: 0 },
        { id: 3, title: 'Gym:', description: '', completed: false, month: 'November', score: 0 },
        { id: 4, title: 'Tafsir:', description: '', completed: false, month: 'November', score: 0 },
        { id: 5, title: 'Learning Islam:', description: '', completed: false, month: 'November', score: 0 },
        { id: 6, title: 'History:', description: '', completed: false, month: 'November', score: 0 },
        { id: 7, title: 'Business:', description: '', completed: false, month: 'November', score: 0 },
      ],
      'December': [
        { id: 1, title: 'Arabic:', description: '', completed: false, month: 'December', score: 0 },
        { id: 2, title: 'Quran:', description: '', completed: false, month: 'December', score: 0 },
        { id: 3, title: 'Gym:', description: '', completed: false, month: 'December', score: 0 },
        { id: 4, title: 'Tafsir:', description: '', completed: false, month: 'December', score: 0 },
        { id: 5, title: 'Learning Islam:', description: '', completed: false, month: 'December', score: 0 },
        { id: 6, title: 'History:', description: '', completed: false, month: 'December', score: 0 },
        { id: 7, title: 'Business:', description: '', completed: false, month: 'December', score: 0 },
      ],
    },
    monthlyScores: {
      'January': 0,
      'February': 0,
      'March': 0,
      'April': 0,
      'May': 0,
      'June': 0,
      'July': 0,
      'August': 0,
      'September': 0,
      'October': 0,
      'November': 0,
      'December': 0,
    },
    businesses: [
      {
        id: 1,
        name: 'ThewebTailors',
        logo: '/logos/thewebtailors.svg',
        tasks: [
          { id: 1, title: 'Client Website Redesign', completed: false, isWeekly: false },
          { id: 2, title: 'SEO Optimization', completed: false, isWeekly: true },
          { id: 3, title: 'Social Media Integration', completed: false, isWeekly: false }
        ],
        monthlyGoals: {
          'June': [
            { id: 1, title: 'Acquire 2 new clients', description: 'Focus on e-commerce businesses', completed: false, month: 'June', score: 0 },
            { id: 2, title: 'Launch new portfolio website', description: 'Showcase recent projects', completed: false, month: 'June', score: 0 },
          ]
        },
        metrics: {
          clientTarget: 10,
          currentClients: 3
        }
      },
      {
        id: 2,
        name: 'BestFlightAlerts',
        logo: '/logos/bestflightalerts.svg',
        tasks: [
          { id: 1, title: 'Implement flight scraping service', completed: false },
          { id: 2, title: 'Design email template', completed: false },
          { id: 3, title: 'Set up subscriber database', completed: false }
        ],
        monthlyGoals: {
          'June': [
            { id: 1, title: 'Reach 500 subscribers', description: 'Through social media promotion', completed: false, month: 'June', score: 0 },
            { id: 2, title: 'Send weekly flight deals', description: 'Focus on popular destinations', completed: false, month: 'June', score: 0 },
          ]
        }
      },
      {
        id: 3,
        name: 'Freelance work',
        logo: '/logos/freelancework.svg',
        tasks: [
          { id: 1, title: 'Update portfolio', completed: false },
          { id: 2, title: 'Network with potential clients', completed: false },
          { id: 3, title: 'Create service packages', completed: false }
        ],
        monthlyGoals: {
          'June': [
            { id: 1, title: 'Complete 3 freelance projects', description: 'Prioritize higher-paying clients', completed: false, month: 'June', score: 0 },
            { id: 2, title: 'Set up automated invoicing', description: 'Streamline payment collection', completed: false, month: 'June', score: 0 },
          ]
        }
      }
    ]
  },
  2: {
    userId: 2,
    yearlyGoals: [],
    monthlyGoals: {
      'January': [],
      'February': [],
      'March': [],
      'April': [],
      'May': [],
      'June': [],
      'July': [],
      'August': [],
      'September': [],
      'October': [],
      'November': [],
      'December': []
    },
    monthlyScores: {
      'January': 0,
      'February': 0,
      'March': 0,
      'April': 0,
      'May': 0,
      'June': 0,
      'July': 0,
      'August': 0,
      'September': 0,
      'October': 0,
      'November': 0,
      'December': 0
    }
  },
  3: {
    userId: 3,
    yearlyGoals: [],
    monthlyGoals: {
      'January': [],
      'February': [],
      'March': [],
      'April': [],
      'May': [],
      'June': [],
      'July': [],
      'August': [],
      'September': [],
      'October': [],
      'November': [],
      'December': []
    },
    monthlyScores: {
      'January': 0,
      'February': 0,
      'March': 0,
      'April': 0,
      'May': 0,
      'June': 0,
      'July': 0,
      'August': 0,
      'September': 0,
      'October': 0,
      'November': 0,
      'December': 0
    }
  }
};

// Prepare chart data for a given user
const prepareChartData = (userId: number, customUserData?: UserData) => {
  const userData = customUserData || USER_DATA[userId];
  
  // For line chart - monthly scores
  const months = Object.keys(userData.monthlyScores);
  const scores = Object.values(userData.monthlyScores);
  
  // For bar chart - goals completed each month
  const monthlyGoals = userData.monthlyGoals;
  const completedGoalsByMonth: Record<string, number> = {};
  
  Object.entries(monthlyGoals).forEach(([month, goals]) => {
    completedGoalsByMonth[month] = goals.filter(goal => goal.completed).length;
  });
  
  // For pie chart - yearly goals progress
  const yearlyGoals = userData.yearlyGoals;
  const completedYearlyGoals = yearlyGoals.filter(goal => goal.completed).length;
  const remainingYearlyGoals = yearlyGoals.length - completedYearlyGoals;
  
  return {
    lineData: {
      labels: months,
      datasets: [
        {
          label: 'Monthly Score (0-10)',
          data: scores,
          borderColor: 'rgb(14, 165, 233)',
          backgroundColor: 'rgba(14, 165, 233, 0.5)',
          tension: 0.3,
        },
      ],
    },
    barData: {
      labels: Object.keys(completedGoalsByMonth),
      datasets: [
        {
          label: 'Completed Goals',
          data: Object.values(completedGoalsByMonth),
          backgroundColor: 'rgba(14, 165, 233, 0.8)',
        },
      ],
    },
    pieData: {
      labels: ['Completed', 'Remaining'],
      datasets: [
        {
          data: [completedYearlyGoals, remainingYearlyGoals],
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)',
            'rgba(239, 68, 68, 0.8)',
          ],
          borderColor: [
            'rgb(34, 197, 94)',
            'rgb(239, 68, 68)',
          ],
          borderWidth: 1,
        },
      ],
    },
  };
};

interface UserDashboardProps {
  userId: number;
  userName: string;
}

export default function UserDashboard({ userId, userName }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth());
  const [userData, setUserData] = useState<UserData | null>(null);
  const [profileImage, setProfileImage] = useState('');
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [editingMonthlyGoals, setEditingMonthlyGoals] = useState<MonthlyGoal[]>([]);
  const [editingYearlyGoals, setEditingYearlyGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load user data on initial render and when userId changes
  useEffect(() => {
    setIsLoading(true);
    try {
      // Initialize user data if not present in localStorage
      if (typeof window !== 'undefined') {
        const initializedData = initializeUserDataIfNeeded(userId, USER_DATA[userId]);
        console.log('User data loaded:', initializedData, 'for user ID:', userId);
        setUserData(initializedData || USER_DATA[userId]); // Fallback to sample data if initialization fails
        
        // Set profile image
        setProfileImage(getProfileImage() || '');
        
        // Set active tab to overview
        setActiveTab('overview');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // Fallback to sample data
      setUserData(USER_DATA[userId]);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);
  
  const getProfileImage = () => {
    // For Fatty (userId=2), use the custom image
    if (userId === 2) {
      return '/IMG_3132.png';
    }
    // For others, return null (will use default letter avatar)
    return null;
  };
  
  // Update data in localStorage whenever it changes
  useEffect(() => {
    if (userData) {
      // Individual save functions could be called in the specific handlers,
      // but this ensures any changes to userData are saved
      saveMonthlyGoals(userId, currentMonth, userData.monthlyGoals[currentMonth] || []);
      saveYearlyGoals(userId, userData.yearlyGoals);
      if (userData.businesses) {
        saveBusinesses(userId, userData.businesses);
      }
      
      // Calculate and save monthly score
      const monthlyGoals = userData.monthlyGoals[currentMonth] || [];
      if (monthlyGoals.length > 0) {
        const totalScore = monthlyGoals.reduce((sum, goal) => sum + goal.score, 0);
        const averageScore = totalScore / monthlyGoals.length;
        saveMonthlyScore(userId, currentMonth, averageScore);
      }
    }
  }, [userData, currentMonth, userId]);
  
  const handleSaveGoals = (type: 'monthly' | 'yearly', goals: Goal[] | MonthlyGoal[]) => {
    if (!userData) return;
    
    if (type === 'monthly') {
      // Save monthly goals
      const monthlyGoals = goals as MonthlyGoal[];
      setUserData({
        ...userData,
        monthlyGoals: {
          ...userData.monthlyGoals,
          [currentMonth]: monthlyGoals
        }
      });
    } else {
      // Save yearly goals
      const yearlyGoals = goals as Goal[];
      setUserData({
        ...userData,
        yearlyGoals
      });
    }
    
    setIsEditingGoals(false);
  };
  
  const handleEditGoal = (goal: Goal | MonthlyGoal) => {
    // Determine if it's a monthly or yearly goal
    const isMonthly = 'month' in goal && goal.month !== undefined;
    setEditingMonthlyGoals(isMonthly ? [goal as MonthlyGoal] : []);
    setEditingYearlyGoals(isMonthly ? [] : [goal as Goal]);
  };
  
  const handleSaveIndividualGoal = (updatedGoal: Goal | MonthlyGoal) => {
    if (!userData) return;
    
    // Check if it's a monthly or yearly goal by the presence of month property
    if ('month' in updatedGoal) {
      const monthlyGoal = updatedGoal as MonthlyGoal;
      const month = monthlyGoal.month;
      
      // Update the goal in the monthly goals list
      const updatedMonthlyGoals = userData.monthlyGoals[month]?.map(goal => 
        goal.id === monthlyGoal.id ? monthlyGoal : goal
      ) || [];
      
      setUserData({
        ...userData,
        monthlyGoals: {
          ...userData.monthlyGoals,
          [month]: updatedMonthlyGoals
        }
      });
    } else {
      // Update the yearly goal
      const yearlyGoal = updatedGoal as Goal;
      const updatedYearlyGoals = userData.yearlyGoals.map(goal => 
        goal.id === yearlyGoal.id ? yearlyGoal : goal
      );
      
      setUserData({
        ...userData,
        yearlyGoals: updatedYearlyGoals
      });
    }
  };
  
  const handleBusinessUpdate = (updatedBusinesses: Business[]) => {
    if (!userData) return;
    
    setUserData({
      ...userData,
      businesses: updatedBusinesses
    });
  };
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'yearlyGoals', label: 'Yearly Goals', icon: '🎯' },
    { id: 'monthlyGoals', label: 'Monthly Goals', icon: '📅' },
    { id: 'business', label: 'Business', icon: '💼' },
    { id: 'progress', label: 'Progress Tracker', icon: '📈' },
    { id: 'addGoal', label: 'Add Goal', icon: '➕' },
  ];

  // Utility functions for the monthly goals display
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Quran':
        return '📖';
      case 'Arabic':
        return '🔤';
      case 'Tafsir':
        return '📚';
      case 'Spanish':
        return '🌍';
      case 'Matters of the Heart':
        return '❤️';
      case 'Business':
        return '💼';
      default:
        return '📝';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'bg-success-500';
    if (score >= 6) return 'bg-primary-500';
    if (score >= 4) return 'bg-yellow-500';
    return 'bg-danger-500';
  };

  // Get current week's business tasks
  const getCurrentWeekBusinessTasks = () => {
    if (!userData?.businesses || userData.businesses.length === 0) return [];
    
    const tasks: {task: BusinessTask, business: Business}[] = [];
    
    userData.businesses.forEach(business => {
      const weeklyTasks = business.tasks.filter(task => task.isWeekly);
      weeklyTasks.forEach(task => {
        tasks.push({
          task,
          business
        });
      });
    });
    
    return tasks;
  };

  // Get monthly goals for current month
  const getCurrentMonthGoals = () => {
    return userData?.monthlyGoals[currentMonth] || [];
  };

  // Get improvement suggestions based on low scores
  const getImprovementSuggestions = () => {
    const suggestions: {category: string, score: number, suggestion: string}[] = [];
    const monthGoals = userData?.monthlyGoals[currentMonth] || [];
    
    // Group goals by category
    const categories: Record<string, {goals: MonthlyGoal[], avgScore: number}> = {};
    
    monthGoals.forEach(goal => {
      let category = 'Other';
      
      if (goal.title.toLowerCase().includes('quran')) category = 'Quran';
      else if (goal.title.toLowerCase().includes('arabic')) category = 'Arabic';
      else if (goal.title.toLowerCase().includes('tafsir')) category = 'Tafsir';
      else if (goal.title.toLowerCase().includes('spanish')) category = 'Spanish';
      else if (goal.title.toLowerCase().includes('heart')) category = 'Matters of the Heart';
      else if (goal.title.toLowerCase().includes('business')) category = 'Business';
      
      if (!categories[category]) {
        categories[category] = {
          goals: [],
          avgScore: 0
        };
      }
      
      categories[category].goals.push(goal);
    });
    
    // Calculate average scores and find low-scoring categories
    Object.entries(categories).forEach(([category, data]) => {
      if (data.goals.length === 0) return;
      
      const totalScore = data.goals.reduce((sum, goal) => sum + goal.score, 0);
      const avgScore = totalScore / data.goals.length;
      
      categories[category].avgScore = avgScore;
      
      if (avgScore < 6) {
        let suggestion = '';
        
        switch(category) {
          case 'Quran':
            suggestion = 'Try setting aside 15 minutes each day for consistent Quran study.';
            break;
          case 'Arabic':
            suggestion = 'Consider joining a language study group to practice speaking.';
            break;
          case 'Tafsir':
            suggestion = 'Use a structured study guide or join weekly tafsir sessions.';
            break;
          case 'Spanish':
            suggestion = 'Practice with language apps daily and find a conversation partner.';
            break;
          case 'Matters of the Heart':
            suggestion = 'Incorporate reflection time and journaling into your routine.';
            break;
          case 'Business':
            suggestion = 'Set smaller, achievable weekly targets to build momentum.';
            break;
          default:
            suggestion = 'Break down your goals into smaller daily actions.';
        }
        
        suggestions.push({
          category,
          score: avgScore,
          suggestion
        });
      }
    });
    
    return suggestions;
  };

  useEffect(() => {
    console.log('Current active tab:', activeTab);
    console.log('Current month:', currentMonth);
    console.log('User dashboard rendering for userId:', userId, 'userData:', userData);
  }, [activeTab, userData, currentMonth]);

  if (isLoading) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-md">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Always render something, even if userData is null
  const safeUserData = userData || USER_DATA[userId];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                {userName.charAt(0)}
              </div>
              <h1 className="text-xl font-semibold text-gray-800">{userName}'s Dashboard</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <CSVExporter userId={userId} userName={userName} />
              <button 
                onClick={() => setIsEditingGoals(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-300 text-sm font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit Goals
              </button>
            </div>
          </div>
          
          {/* Month selector */}
          <div className="mt-4 flex items-center">
            <span className="text-gray-700 mr-2">Current Month:</span>
            <select
              className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={currentMonth}
              onChange={(e) => setCurrentMonth(e.target.value)}
            >
              {MONTHS.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Tabs Navigation */}
      <div className="container mx-auto px-4 py-4">
        <div className="bg-white rounded-xl shadow-md p-1 flex overflow-x-auto mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-primary-500 text-white font-medium shadow-md' 
                  : 'text-gray-600 hover:bg-primary-50'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Dashboard Content */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          {activeTab === 'overview' && safeUserData && (
            <div className="space-y-8">
              {/* Overall Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-6 rounded-xl border border-primary-200">
                  <h3 className="text-lg font-semibold text-primary-800 mb-2">Overall Score</h3>
                  <div className="flex items-end">
                    <span className="text-3xl font-bold text-primary-700">
                      {safeUserData.monthlyScores[currentMonth] || 0}
                    </span>
                    <span className="text-primary-600 ml-1 mb-1">/10</span>
                  </div>
                  <div className="mt-2 w-full bg-white bg-opacity-50 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full" 
                      style={{ width: `${(safeUserData.monthlyScores[currentMonth] || 0) * 10}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-success-50 to-success-100 p-6 rounded-xl border border-success-200">
                  <h3 className="text-lg font-semibold text-success-800 mb-2">Monthly Goals</h3>
                  <div className="flex items-end">
                    <span className="text-3xl font-bold text-success-700">
                      {getCurrentMonthGoals().filter(g => g.completed).length}
                    </span>
                    <span className="text-success-600 ml-1 mb-1">/{getCurrentMonthGoals().length}</span>
                  </div>
                  <div className="mt-2 w-full bg-white bg-opacity-50 rounded-full h-2">
                    <div 
                      className="bg-success-500 h-2 rounded-full" 
                      style={{ 
                        width: `${getCurrentMonthGoals().length > 0 ? 
                          ((getCurrentMonthGoals().filter(g => g.completed).length / 
                          getCurrentMonthGoals().length) * 100) : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Yearly Goals</h3>
                  <div className="flex items-end">
                    <span className="text-3xl font-bold text-blue-700">
                      {safeUserData.yearlyGoals.filter(g => g.completed).length}
                    </span>
                    <span className="text-blue-600 ml-1 mb-1">/{safeUserData.yearlyGoals.length}</span>
                  </div>
                  <div className="mt-2 w-full bg-white bg-opacity-50 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ 
                        width: `${(safeUserData.yearlyGoals.filter(g => g.completed).length / safeUserData.yearlyGoals.length) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {/* Monthly Goals */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {currentMonth} Goals
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {getCurrentMonthGoals().length > 0 ? (
                    <div className="space-y-3">
                      {getCurrentMonthGoals().map((goal) => (
                        <div key={goal.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start space-x-3">
                              <div 
                                className={`mt-1 w-5 h-5 rounded-full flex-shrink-0 ${
                                  goal.completed ? 'bg-green-500' : 'border-2 border-gray-300'
                                }`}
                              >
                                {goal.completed && (
                                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                              <div>
                                <h5 className={`font-medium ${goal.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                                  {goal.title}
                                </h5>
                                {goal.description && (
                                  <p className="text-sm text-gray-500 mt-1">{goal.description}</p>
                                )}
                              </div>
                            </div>
                            <span className={`ml-2 px-2 py-1 text-xs font-bold rounded-full text-white ${getScoreColor(goal.score)}`}>
                              {goal.score}/10
                            </span>
                          </div>
                          <div className="mt-2 flex justify-end">
                            <button 
                              onClick={() => handleEditGoal(goal)}
                              className="text-xs px-2 py-1 text-primary-600 hover:bg-primary-50 rounded transition-colors"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">No goals for {currentMonth}</p>
                      <button
                        onClick={() => setActiveTab('addGoal')}
                        className="mt-3 text-primary-600 hover:text-primary-800 font-medium text-sm"
                      >
                        Add a goal
                      </button>
                    </div>
                  )}
                  
                  {/* Improvement Suggestions */}
                  <div className="bg-gray-50 rounded-xl p-4 h-full">
                    <h4 className="font-bold text-gray-700 mb-3 flex items-center">
                      <span className="mr-2">💡</span> Areas for Improvement
                    </h4>
                    
                    {getImprovementSuggestions().length > 0 ? (
                      <div className="space-y-3">
                        {getImprovementSuggestions().map((item, index) => (
                          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex items-center mb-2">
                              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold mr-2">
                                {getCategoryIcon(item.category)}
                              </div>
                              <h5 className="font-medium text-gray-800">{item.category}</h5>
                              <span className={`ml-auto px-2 py-1 text-xs font-bold rounded-full text-white ${getScoreColor(item.score)}`}>
                                {item.score.toFixed(1)}/10
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Suggestion:</span> {item.suggestion}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
                        <div className="flex items-center text-green-700">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium">Great work!</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                          You're doing well in all areas. Keep up the good work!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Business Weekly Tasks */}
              {safeUserData.businesses && safeUserData.businesses.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-primary-800 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Business Weekly Tasks
                    </h3>
                    <div className="text-sm text-primary-600 font-medium">
                      <span className="mr-1">Current Month:</span>
                      <span className="bg-primary-50 px-2 py-1 rounded">{currentMonth}</span>
                    </div>
                  </div>
                  
                  {getCurrentWeekBusinessTasks().length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {getCurrentWeekBusinessTasks().map(({task, business}, index) => (
                        <div key={`${business.id}-${task.id}`} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-start">
                          <div className="mr-3 flex-shrink-0">
                            {business.logo ? (
                              <Image
                                src={business.logo}
                                alt={business.name}
                                width={32}
                                height={32}
                                className="rounded"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-primary-100 rounded flex items-center justify-center text-primary-700 font-semibold">
                                {business.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="font-medium text-gray-800">{task.title}</h5>
                                <p className="text-xs text-primary-600 mt-0.5">{business.name}</p>
                                {task.description && (
                                  <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                                )}
                              </div>
                              <input 
                                type="checkbox" 
                                checked={task.completed}
                                className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
                                readOnly
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">No weekly business tasks assigned</p>
                      <button
                        onClick={() => setActiveTab('business')}
                        className="mt-3 text-primary-600 hover:text-primary-800 font-medium text-sm"
                      >
                        Go to Business Manager
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'yearlyGoals' && safeUserData && (
            <GoalList 
              goals={safeUserData.yearlyGoals} 
              title="Yearly Goals" 
              description="Track your progress on yearly goals"
              onEditGoal={handleEditGoal}
            />
          )}
          
          {activeTab === 'monthlyGoals' && safeUserData && (
            <div className="space-y-6">
              {Object.entries(safeUserData.monthlyGoals).map(([month, goals]) => (
                goals.length > 0 && (
                  <div key={month} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4">
                      <h3 className="text-xl font-bold">{month} Goals</h3>
                    </div>
                    <div className="p-4">
                      <div className="space-y-3">
                        {goals.map(goal => (
                          <div key={goal.id} className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                            <div className="flex items-start">
                              <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full ${goal.completed ? 'bg-success-500' : 'border-2 border-gray-300'} flex items-center justify-center`}>
                                {goal.completed && (
                                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                              <div className="ml-3 flex-grow">
                                <h5 className="font-medium text-gray-800">{goal.title}</h5>
                                <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                              </div>
                              <div className="ml-4 flex items-center space-x-2">
                                <span className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${getScoreColor(goal.score)}`}>
                                  {goal.score}/10
                                </span>
                                <button 
                                  onClick={() => handleEditGoal(goal)}
                                  className="p-1.5 text-primary-500 hover:text-primary-700 hover:bg-primary-50 rounded-full transition-colors"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
          
          {activeTab === 'business' && safeUserData && (
            <BusinessManager 
              businesses={safeUserData.businesses || []} 
              onBusinessUpdate={handleBusinessUpdate}
              userId={userId}
              currentMonth={currentMonth}
            />
          )}
          
          {activeTab === 'progress' && safeUserData && (
            <ProgressTracker 
              monthlyScores={safeUserData.monthlyScores}
              monthlyGoals={safeUserData.monthlyGoals}
            />
          )}
          
          {activeTab === 'addGoal' && (
            <GoalForm userId={userId} />
          )}
        </div>
      </div>
      
      {/* Goal Editor Modal */}
      {isEditingGoals && safeUserData && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
            <GoalsEditor 
              userId={userId}
              monthlyGoals={safeUserData.monthlyGoals}
              yearlyGoals={safeUserData.yearlyGoals}
              onSave={handleSaveGoals}
              onClose={() => setIsEditingGoals(false)}
            />
          </div>
        </div>
      )}
      
      {/* Individual Goal Editor */}
      {(editingMonthlyGoals.length > 0 || editingYearlyGoals.length > 0) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-3xl w-full">
            <GoalForm 
              userId={userId} 
              existingGoal={editingMonthlyGoals.length > 0 ? editingMonthlyGoals[0] : editingYearlyGoals[0]}
              onClose={() => {
                setEditingMonthlyGoals([]);
                setEditingYearlyGoals([]);
              }}
              onSave={handleSaveIndividualGoal}
            />
          </div>
        </div>
      )}
    </div>
  );
} 