'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import GoalForm from './GoalForm';
import GoalList from './GoalList';
import ProgressTracker from './ProgressTracker';
import GoalsEditor from './GoalsEditor';
import BusinessManager from './BusinessManager';
import Image from 'next/image';

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

interface UserData {
  userId: number;
  yearlyGoals: Goal[];
  monthlyGoals: Record<string, MonthlyGoal[]>;
  monthlyScores: Record<string, number>;
  userLogo?: string; // Optional user logo
  businesses?: Business[]; // Optional businesses array
}

interface Goal {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  isOptional?: boolean;
}

interface MonthlyGoal extends Goal {
  month: string;
  score: number; // 0-10
}

interface Business {
  id: number;
  name: string;
  logo?: string;
  tasks: BusinessTask[];
  monthlyGoals?: Record<string, MonthlyGoal[]>;
  metrics?: {
    [key: string]: any;
  };
}

interface BusinessTask {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  isWeekly?: boolean;
}

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
    yearlyGoals: [
      { id: 1, title: 'Ability to convey the message of Islam', description: 'Learning Islam', completed: false },
      { id: 2, title: 'Arabic lesson with el Profe', description: 'Arabic', completed: false },
      { id: 3, title: 'Memorise Juz Tabarak', description: 'Quran', completed: false },
      { id: 4, title: 'Tafsir Juz Amma + notes', description: 'Tafsir', completed: false },
      { id: 5, title: 'Stay consistent in Gym and get back to football', description: 'Gym', completed: false },
    ],
    monthlyGoals: {
      'January': [
        { id: 1, title: 'Memorize Surah Mulk', description: 'Complete memorization with tajweed', completed: true, month: 'January', score: 8 },
        { id: 2, title: 'Night Prayer 3x/week', description: 'Establish consistent night prayers', completed: false, month: 'January', score: 5 },
        { id: 3, title: 'Read 1 Book', description: 'Complete one Islamic book', completed: true, month: 'January', score: 10 },
        { id: 4, title: 'Learning Islam:', description: '', completed: false, month: 'January', score: 0 },
      ],
      'February': [
        { id: 5, title: 'Learning Islam: Learn 2 facts about Islam', description: 'Create a structured way of saying it to others and memorise it', completed: false, month: 'February', score: 0 },
        { id: 6, title: 'Quran: Memorise Al insan + revision', description: 'Complete memorization and review', completed: false, month: 'February', score: 0 },
        { id: 7, title: 'Arabic: Start session with el profe', description: 'Begin Arabic classes with el profe', completed: false, month: 'February', score: 0 },
        { id: 8, title: 'Tafsir: Tafsir notes al insan', description: 'Study and create notes on Surah Al-Insan', completed: false, month: 'February', score: 0 },
        { id: 9, title: 'Gym: Complete 12 gym sessions', description: 'Maintain consistent gym attendance', completed: false, month: 'February', score: 0 },
      ],
      'March': [
        { id: 1, title: 'Learning Islam:', description: '', completed: false, month: 'March', score: 0 },
        { id: 2, title: 'Arabic:', description: '', completed: false, month: 'March', score: 0 },
        { id: 3, title: 'Tafsir:', description: '', completed: false, month: 'March', score: 0 },
        { id: 4, title: 'Gym:', description: '', completed: false, month: 'March', score: 0 },
      ],
      'April': [
        { id: 1, title: 'Quran: Surah Al quiyamah', description: 'Memorization', completed: false, month: 'April', score: 0 },
        { id: 2, title: 'Learning: Finish Health and safety course', description: 'One off task', completed: false, month: 'April', score: 0 },
        { id: 9, title: 'Gym: Gym 8 times', description: '', completed: false, month: 'April', score: 0 },
        { id: 10, title: 'Tafsir: Tafseer Surah Al qiyammah', description: '', completed: false, month: 'April', score: 0 },
        { id: 11, title: 'Tafsir: Tafseer juz amma: Al insaan & al mursalat', description: '', completed: false, month: 'April', score: 0 },
        { id: 12, title: 'History: Book Muhammad', description: '10 pages minimum or finish topic + notes', completed: false, month: 'April', score: 0 },
        { id: 13, title: 'Arabic: Arabic language 10 new words with rules learned', description: '', completed: false, month: 'April', score: 0 },
      ],
      'May': [
        { id: 1, title: 'Arabic:', description: '', completed: false, month: 'May', score: 0 },
        { id: 2, title: 'Quran:', description: '', completed: false, month: 'May', score: 0 },
        { id: 3, title: 'Gym:', description: '', completed: false, month: 'May', score: 0 },
        { id: 4, title: 'Tafsir:', description: '', completed: false, month: 'May', score: 0 },
        { id: 5, title: 'Learning Islam:', description: '', completed: false, month: 'May', score: 0 },
        { id: 6, title: 'History:', description: '', completed: false, month: 'May', score: 0 },
      ],
      'June': [
        { id: 1, title: 'Arabic:', description: '', completed: false, month: 'June', score: 0 },
        { id: 2, title: 'Quran:', description: '', completed: false, month: 'June', score: 0 },
        { id: 3, title: 'Gym:', description: '', completed: false, month: 'June', score: 0 },
        { id: 4, title: 'Tafsir:', description: '', completed: false, month: 'June', score: 0 },
        { id: 5, title: 'Learning Islam:', description: '', completed: false, month: 'June', score: 0 },
        { id: 6, title: 'History:', description: '', completed: false, month: 'June', score: 0 },
      ],
      'July': [
        { id: 1, title: 'Arabic:', description: '', completed: false, month: 'July', score: 0 },
        { id: 2, title: 'Quran:', description: '', completed: false, month: 'July', score: 0 },
        { id: 3, title: 'Gym:', description: '', completed: false, month: 'July', score: 0 },
        { id: 4, title: 'Tafsir:', description: '', completed: false, month: 'July', score: 0 },
        { id: 5, title: 'Learning Islam:', description: '', completed: false, month: 'July', score: 0 },
        { id: 6, title: 'History:', description: '', completed: false, month: 'July', score: 0 },
      ],
      'August': [
        { id: 1, title: 'Arabic:', description: '', completed: false, month: 'August', score: 0 },
        { id: 2, title: 'Quran:', description: '', completed: false, month: 'August', score: 0 },
        { id: 3, title: 'Gym:', description: '', completed: false, month: 'August', score: 0 },
        { id: 4, title: 'Tafsir:', description: '', completed: false, month: 'August', score: 0 },
        { id: 5, title: 'Learning Islam:', description: '', completed: false, month: 'August', score: 0 },
        { id: 6, title: 'History:', description: '', completed: false, month: 'August', score: 0 },
      ],
      'September': [
        { id: 1, title: 'Arabic:', description: '', completed: false, month: 'September', score: 0 },
        { id: 2, title: 'Quran:', description: '', completed: false, month: 'September', score: 0 },
        { id: 3, title: 'Gym:', description: '', completed: false, month: 'September', score: 0 },
        { id: 4, title: 'Tafsir:', description: '', completed: false, month: 'September', score: 0 },
        { id: 5, title: 'Learning Islam:', description: '', completed: false, month: 'September', score: 0 },
        { id: 6, title: 'History:', description: '', completed: false, month: 'September', score: 0 },
      ],
      'October': [
        { id: 1, title: 'Arabic:', description: '', completed: false, month: 'October', score: 0 },
        { id: 2, title: 'Quran:', description: '', completed: false, month: 'October', score: 0 },
        { id: 3, title: 'Gym:', description: '', completed: false, month: 'October', score: 0 },
        { id: 4, title: 'Tafsir:', description: '', completed: false, month: 'October', score: 0 },
        { id: 5, title: 'Learning Islam:', description: '', completed: false, month: 'October', score: 0 },
        { id: 6, title: 'History:', description: '', completed: false, month: 'October', score: 0 },
      ],
      'November': [
        { id: 1, title: 'Arabic:', description: '', completed: false, month: 'November', score: 0 },
        { id: 2, title: 'Quran:', description: '', completed: false, month: 'November', score: 0 },
        { id: 3, title: 'Gym:', description: '', completed: false, month: 'November', score: 0 },
        { id: 4, title: 'Tafsir:', description: '', completed: false, month: 'November', score: 0 },
        { id: 5, title: 'Learning Islam:', description: '', completed: false, month: 'November', score: 0 },
        { id: 6, title: 'History:', description: '', completed: false, month: 'November', score: 0 },
      ],
      'December': [
        { id: 1, title: 'Arabic:', description: '', completed: false, month: 'December', score: 0 },
        { id: 2, title: 'Quran:', description: '', completed: false, month: 'December', score: 0 },
        { id: 3, title: 'Gym:', description: '', completed: false, month: 'December', score: 0 },
        { id: 4, title: 'Tafsir:', description: '', completed: false, month: 'December', score: 0 },
        { id: 5, title: 'Learning Islam:', description: '', completed: false, month: 'December', score: 0 },
        { id: 6, title: 'History:', description: '', completed: false, month: 'December', score: 0 },
      ],
    },
    monthlyScores: {
      'January': 7.7,
      'February': 6.3,
      'March': 7.7,
      'April': 8.9,
      'May': 8.2,
      'June': 7.5,
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
        name: 'Mande',
        logo: '/IMG_3132.png',
        tasks: [
          { id: 1, title: 'Meet with French designer', completed: false, isWeekly: false },
          { id: 2, title: 'Organise Marketing plan in dates', completed: false, isWeekly: true },
          { id: 3, title: 'Review Shoes cost after all expenses with Bryan', completed: false, isWeekly: false },
          { id: 4, title: 'Prepare campaign for Zellerfeld Mule', completed: false, isWeekly: true }
        ],
        monthlyGoals: {
          'February': [
            { id: 1, title: 'Meet with French designer', description: 'Discuss new designs and collaboration', completed: false, month: 'February', score: 0 },
            { id: 2, title: 'Organise Marketing plan in dates', description: 'Create timeline for marketing activities', completed: false, month: 'February', score: 0 },
            { id: 3, title: 'Review Shoes cost after all expenses with Bryan', description: 'Analyze production costs and pricing', completed: false, month: 'February', score: 0 },
            { id: 4, title: 'Prepare campaign for Zellerfeld Mule', description: 'Teasing post, get photographer (within fashion and clothing brands), model and shooting session (Photos) and still video', completed: false, month: 'February', score: 0 },
          ],
          'March': [
            { id: 1, title: 'Business planning', description: 'Continue business development', completed: false, month: 'March', score: 0 },
          ],
          'April': [
            { id: 1, title: 'Finish Nikeghinius campaign', description: '', completed: false, month: 'April', score: 0 },
            { id: 2, title: 'Finish Mule - Zellerfeld campaign', description: 'Renders, model shoot, self shoot', completed: false, month: 'April', score: 0 },
            { id: 3, title: 'Build Mande website (landing page)', description: '', completed: false, month: 'April', score: 0 },
            { id: 4, title: 'Order 100 pairs', description: '', completed: false, month: 'April', score: 0 },
            { id: 5, title: 'Send finances to accountant and recalculate finances', description: '', completed: false, month: 'April', score: 0 },
            { id: 6, title: 'Raise £1500 (investment or borrowed)', description: 'Get refund ScottishP. & tax refund', completed: false, month: 'April', score: 0 },
          ],
          'May': [
            { id: 1, title: 'Business development', description: '', completed: false, month: 'May', score: 0 },
          ],
          'June': [
            { id: 1, title: 'Marketing strategy', description: 'Develop social media campaigns', completed: false, month: 'June', score: 0 },
            { id: 2, title: 'Product development', description: 'Finalize new shoe designs', completed: false, month: 'June', score: 0 },
            { id: 3, title: 'Business operations', description: '', completed: false, month: 'June', score: 0 },
          ],
          'July': [
            { id: 1, title: 'Business strategy', description: '', completed: false, month: 'July', score: 0 },
          ],
          'August': [
            { id: 1, title: 'Business review', description: '', completed: false, month: 'August', score: 0 },
          ],
          'September': [
            { id: 1, title: 'Business planning', description: '', completed: false, month: 'September', score: 0 },
          ],
          'October': [
            { id: 1, title: 'Business development', description: '', completed: false, month: 'October', score: 0 },
          ],
          'November': [
            { id: 1, title: 'Business growth', description: '', completed: false, month: 'November', score: 0 },
          ],
          'December': [
            { id: 1, title: 'Year-end business review', description: '', completed: false, month: 'December', score: 0 },
          ]
        },
        metrics: {
          launchDate: '2023-12-01',
          shoesSold: 87
        }
      }
    ]
  },
  3: {
    userId: 3,
    yearlyGoals: [
      { id: 1, title: 'Complete Arabic Course', description: 'Finish an Arabic language course', completed: false },
      { id: 2, title: 'Regular Charity', description: 'Give regular charity each month', completed: true },
      { id: 3, title: 'Attend Islamic Classes', description: 'Attend weekly Islamic knowledge classes', completed: true },
      { id: 4, title: 'Daily Quran Recitation', description: 'Recite at least one page daily', completed: false },
      { id: 5, title: 'Islamic Community Service', description: 'Volunteer for community service', completed: false, isOptional: true },
    ],
    monthlyGoals: {
      'January': [
        { id: 1, title: 'Arabic Lesson 3x/week', description: 'Complete Arabic lessons regularly', completed: false, month: 'January', score: 5 },
        { id: 2, title: 'Charity Project', description: 'Contribute to one charity project', completed: true, month: 'January', score: 10 },
        { id: 3, title: 'Attend All Classes', description: 'Attend all scheduled Islamic classes', completed: true, month: 'January', score: 9 },
      ],
      'February': [
        { id: 4, title: 'Arabic Lesson 4x/week', description: 'Increase Arabic study frequency', completed: true, month: 'February', score: 8 },
        { id: 5, title: 'Charity Project', description: 'Contribute to one charity project', completed: true, month: 'February', score: 10 },
        { id: 6, title: 'Attend All Classes', description: 'Attend all scheduled Islamic classes', completed: false, month: 'February', score: 6 },
      ],
      'March': [
        { id: 7, title: 'Arabic Lesson 5x/week', description: 'Further increase Arabic study', completed: true, month: 'March', score: 9 },
        { id: 8, title: 'Charity Project', description: 'Contribute to one charity project', completed: true, month: 'March', score: 10 },
        { id: 9, title: 'Attend All Classes', description: 'Attend all scheduled Islamic classes', completed: true, month: 'March', score: 8 },
      ],
    },
    monthlyScores: {
      'January': 8,
      'February': 8,
      'March': 9,
      'April': 7.5,
      'May': 8.8,
      'June': 9.2,
    },
  },
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
  const [currentMonth, setCurrentMonth] = useState<string>('June');
  const [selectedMonth, setSelectedMonth] = useState<string>('June');
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<UserData>(USER_DATA[userId]);
  const [editingGoal, setEditingGoal] = useState<{goal: Goal | MonthlyGoal, isMonthly: boolean} | null>(null);
  const [chartData, setChartData] = useState(prepareChartData(userId));
  
  // Get the profile image based on user ID
  const getProfileImage = () => {
    // For Fatty (userId=2), use the custom image
    if (userId === 2) {
      return '/IMG_3132.png';
    }
    // For others, return null (will use default letter avatar)
    return null;
  };
  
  // Update user data when userId changes
  useEffect(() => {
    setUserData(USER_DATA[userId]);
    setChartData(prepareChartData(userId));
    setSelectedMonth(new Date().toLocaleString('default', { month: 'long' }));
  }, [userId]);
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'yearlyGoals', label: 'Yearly Goals', icon: '🎯' },
    { id: 'monthlyGoals', label: 'Monthly Goals', icon: '📅' },
    { id: 'business', label: 'Business', icon: '💼' },
    { id: 'progress', label: 'Progress Tracker', icon: '📈' },
    { id: 'addGoal', label: 'Add Goal', icon: '➕' },
  ];

  const handleSaveGoals = (type: 'monthly' | 'yearly', goals: any) => {
    // Create a new userData object with the updated goals
    const updatedUserData = { ...userData };
    
    if (type === 'monthly') {
      updatedUserData.monthlyGoals = goals as Record<string, MonthlyGoal[]>;
      
      // Recalculate monthly scores based on goals
      const updatedScores: Record<string, number> = {};
      
      Object.entries(goals).forEach(([month, monthGoals]) => {
        const typedMonthGoals = monthGoals as MonthlyGoal[];
        if (typedMonthGoals.length > 0) {
          // Calculate the average score of all goals for this month
          const totalScore = typedMonthGoals.reduce((acc, goal) => acc + goal.score, 0);
          updatedScores[month] = Number((totalScore / typedMonthGoals.length).toFixed(1));
        } else {
          // If no goals, keep the existing score or set to 0
          updatedScores[month] = userData.monthlyScores[month] || 0;
        }
      });
      
      updatedUserData.monthlyScores = updatedScores;
    } else {
      updatedUserData.yearlyGoals = goals as Goal[];
    }
    
    // Update the user data state
    setUserData(updatedUserData);
    
    // Update the chart data
    setChartData(prepareChartData(userId, updatedUserData));
    
    // Close the editor
    setIsEditing(false);
  };

  const handleEditGoal = (goal: Goal | MonthlyGoal) => {
    // Determine if it's a monthly or yearly goal
    const isMonthly = 'month' in goal && goal.month !== undefined;
    setEditingGoal({goal, isMonthly});
  };

  const handleSaveIndividualGoal = (updatedGoal: Goal | MonthlyGoal) => {
    if (!editingGoal) return;
    
    const {isMonthly} = editingGoal;
    const updatedUserData = {...userData};
    
    if (isMonthly && 'month' in updatedGoal) {
      // It's a monthly goal
      const month = updatedGoal.month;
      const monthlyGoals = [...updatedUserData.monthlyGoals[month]];
      const index = monthlyGoals.findIndex(g => g.id === updatedGoal.id);
      
      if (index !== -1) {
        monthlyGoals[index] = updatedGoal as MonthlyGoal;
        updatedUserData.monthlyGoals[month] = monthlyGoals;
        
        // Recalculate the month's score
        const totalScore = monthlyGoals.reduce((acc, goal) => acc + goal.score, 0);
        updatedUserData.monthlyScores[month] = Number((totalScore / monthlyGoals.length).toFixed(1));
      }
    } else {
      // It's a yearly goal
      const yearlyGoals = [...updatedUserData.yearlyGoals];
      const index = yearlyGoals.findIndex(g => g.id === updatedGoal.id);
      
      if (index !== -1) {
        yearlyGoals[index] = updatedGoal as Goal;
        updatedUserData.yearlyGoals = yearlyGoals;
      }
    }
    
    // Update state
    setUserData(updatedUserData);
    setChartData(prepareChartData(userId, updatedUserData));
    setEditingGoal(null);
  };

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

  const handleBusinessUpdate = (updatedBusinesses: Business[]) => {
    const updatedUserData = { ...userData, businesses: updatedBusinesses };
    setUserData(updatedUserData);
    
    // Also update the USER_DATA to persist changes
    USER_DATA[userId] = updatedUserData;
  };

  // Get current week's business tasks
  const getCurrentWeekBusinessTasks = () => {
    if (!userData.businesses || userData.businesses.length === 0) return [];
    
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
    return userData.monthlyGoals[currentMonth] || [];
  };

  // Get improvement suggestions based on low scores
  const getImprovementSuggestions = () => {
    const suggestions: {category: string, score: number, suggestion: string}[] = [];
    const monthGoals = userData.monthlyGoals[selectedMonth] || [];
    
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

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-primary-100 to-primary-50 rounded-2xl p-6 shadow-md mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-primary-800">{userName}</h2>
            <p className="text-primary-600 mt-1">Track your progress and manage your goals</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-primary-100 flex items-center">
              <span className="text-primary-800 mr-2 whitespace-nowrap">Current Month:</span>
              <select
                className="text-primary-600 font-medium bg-transparent border-none focus:ring-0 p-0"
                value={currentMonth}
                onChange={(e) => setCurrentMonth(e.target.value)}
              >
                {Object.keys(userData.monthlyGoals).map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg shadow-sm border border-primary-700 flex items-center transition-colors duration-300"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Goals
            </button>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-primary-100 flex items-center">
              <span className="text-primary-800 mr-2">Overall Score:</span>
              <span className="text-2xl font-bold text-primary-600">
                {(Object.values(userData.monthlyScores).reduce((acc, score) => acc + score, 0) / 
                 Object.values(userData.monthlyScores).length || 0).toFixed(1)}
                <span className="text-sm font-normal">/10</span>
              </span>
            </div>
            {userId === 2 ? (
              <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg">
                <Image
                  src="/IMG_3132.png"
                  alt={`${userName}'s profile`}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="bg-primary-600 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
                {userName.charAt(0)}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md p-1 flex overflow-x-auto">
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

      {/* Tab Content */}
      <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-100">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Dashboard Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-primary-800">Performance Dashboard</h3>
                  <div className="text-sm text-gray-500">
                    Last updated: {new Date().toLocaleDateString()}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-64">
                    <Line 
                      data={chartData.lineData} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            min: 0,
                            max: 10,
                            ticks: {
                              color: '#64748b',
                            },
                            grid: {
                              color: '#e2e8f0',
                            }
                          },
                          x: {
                            ticks: {
                              color: '#64748b',
                            },
                            grid: {
                              color: '#e2e8f0',
                            }
                          }
                        },
                        plugins: {
                          legend: {
                            labels: {
                              color: '#64748b',
                              font: {
                                family: "'Poppins', sans-serif",
                              }
                            }
                          }
                        }
                      }} 
                    />
                  </div>
                  <div className="h-64">
                    <Pie 
                      data={chartData.pieData} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom',
                            labels: {
                              color: '#64748b',
                              font: {
                                family: "'Poppins', sans-serif",
                              },
                              padding: 15,
                            }
                          }
                        }
                      }} 
                    />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold mb-4 text-primary-800">Progress Summary</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-600">Overall Score</span>
                      <span className="text-sm font-medium text-primary-700">
                        {(Object.values(userData.monthlyScores).reduce((acc, score) => acc + score, 0) / 
                        Object.values(userData.monthlyScores).length || 0).toFixed(1)}
                        /10
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary-500" 
                        style={{ 
                          width: `${(Object.values(userData.monthlyScores).reduce((acc, score) => acc + score, 0) / 
                          Object.values(userData.monthlyScores).length || 0) * 10}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-600">Yearly Goals</span>
                      <span className="text-sm font-medium text-primary-700">
                        {userData.yearlyGoals.filter(g => g.completed).length}/{userData.yearlyGoals.length}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-success-500" 
                        style={{ 
                          width: `${(userData.yearlyGoals.filter(g => g.completed).length / userData.yearlyGoals.length) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-600">Monthly Goals ({selectedMonth})</span>
                      <span className="text-sm font-medium text-primary-700">
                        {(userData.monthlyGoals[selectedMonth] || []).filter(g => g.completed).length}/{(userData.monthlyGoals[selectedMonth] || []).length}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary-600" 
                        style={{ 
                          width: `${(userData.monthlyGoals[selectedMonth] || []).length > 0 ? 
                            ((userData.monthlyGoals[selectedMonth] || []).filter(g => g.completed).length / 
                            (userData.monthlyGoals[selectedMonth] || []).length) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Personal Monthly Tasks */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-primary-800 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Personal Tasks
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <button 
                      onClick={() => setSelectedMonth(currentMonth)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${selectedMonth === currentMonth ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      Current Month ({currentMonth})
                    </button>
                  </div>
                  <div className="flex items-center">
                    <label className="mr-2 text-sm font-medium text-gray-700">View Month:</label>
                    <select
                      className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                      {Object.keys(userData.monthlyGoals).map(month => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tasks Grid */}
                <div className="bg-gray-50 rounded-xl p-4 h-96 overflow-auto">
                  <h4 className="font-bold text-gray-700 mb-3 flex items-center">
                    <span className="mr-2">📝</span> {selectedMonth} Tasks
                  </h4>
                  
                  {(userData.monthlyGoals[selectedMonth] || []).length > 0 ? (
                    <div className="space-y-3">
                      {(userData.monthlyGoals[selectedMonth] || []).map((goal) => (
                        <div key={goal.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start space-x-3">
                              <div className={`mt-1 w-4 h-4 rounded-full flex-shrink-0 ${goal.completed ? 'bg-green-500' : 'border border-gray-300'}`}>
                                {goal.completed && (
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                              <div>
                                <h5 className={`font-medium ${goal.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>{goal.title}</h5>
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
                    <div className="text-center py-10 text-gray-500">
                      No tasks for {selectedMonth}
                    </div>
                  )}
                </div>
                
                {/* Areas for Improvement */}
                <div className="bg-gray-50 rounded-xl p-4 h-96 overflow-auto">
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
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
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
          </div>
        )}

        {activeTab === 'yearlyGoals' && (
          <GoalList 
            goals={userData.yearlyGoals} 
            title="Yearly Goals" 
            description="Track your progress on yearly goals"
            onEditGoal={handleEditGoal}
          />
        )}

        {activeTab === 'monthlyGoals' && (
          <div className="space-y-8">
            {Object.entries(userData.monthlyGoals).map(([month, goals]) => {
              // Organize goals by categories
              const categorizedGoals = {
                'Quran': goals.filter(goal => goal.title.toLowerCase().includes('quran')),
                'Arabic': goals.filter(goal => goal.title.toLowerCase().includes('arabic')),
                'Tafsir': goals.filter(goal => goal.title.toLowerCase().includes('tafsir')),
                'Spanish': goals.filter(goal => goal.title.toLowerCase().includes('spanish')),
                'Matters of the Heart': goals.filter(goal => goal.title.toLowerCase().includes('matters of the heart') || 
                                                         goal.title.toLowerCase().includes('heart')),
                'Business': goals.filter(goal => goal.title.toLowerCase().includes('business')),
                'Other': goals.filter(goal => 
                  !goal.title.toLowerCase().includes('quran') && 
                  !goal.title.toLowerCase().includes('arabic') && 
                  !goal.title.toLowerCase().includes('tafsir') && 
                  !goal.title.toLowerCase().includes('spanish') && 
                  !goal.title.toLowerCase().includes('heart') && 
                  !goal.title.toLowerCase().includes('matters of the heart') &&
                  !goal.title.toLowerCase().includes('business')
                )
              };

              // Calculate completion percentage for the month
              const totalGoals = goals.length;
              const completedGoals = goals.filter(goal => goal.completed).length;
              const completionPercentage = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

              return (
                <div key={month} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                  {/* Month header with progress */}
                  <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-xl font-bold">
                          {month.substring(0, 3)}
                        </div>
                        <h3 className="ml-3 text-2xl font-bold">{month} Goals</h3>
                      </div>
                      <div className="text-right">
                        <div className="text-sm opacity-90 mb-1">Completion</div>
                        <div className="font-semibold text-xl">{completionPercentage}%</div>
                      </div>
                    </div>
                    <div className="mt-3 w-full bg-white bg-opacity-20 rounded-full h-2">
                      <div className="bg-white h-2 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
                    </div>
                  </div>

                  {/* Goals organized by category */}
                  <div className="p-5 space-y-6">
                    {Object.entries(categorizedGoals).map(([category, categoryGoals]) => 
                      categoryGoals.length > 0 && (
                        <div key={category} className="border border-gray-100 rounded-xl overflow-hidden">
                          <div className="bg-gray-50 p-3 flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-sm">
                                {getCategoryIcon(category)}
                              </div>
                              <h4 className="ml-2 font-semibold text-gray-800">{category}</h4>
                            </div>
                            <div className="text-xs font-medium px-2 py-1 rounded-lg bg-white shadow-sm text-primary-700">
                              {categoryGoals.filter(g => g.completed).length}/{categoryGoals.length}
                            </div>
                          </div>

                          <div className="divide-y divide-gray-100">
                            {categoryGoals.map(goal => (
                              <div key={goal.id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start mb-2">
                                  <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full ${goal.completed ? 'bg-success-500' : 'border-2 border-gray-300'} flex items-center justify-center`}>
                                    {goal.completed && (
                                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                  </div>
                                  <div className="ml-3 flex-grow">
                                    <h5 className="font-medium text-gray-800">{goal.title.split(': ')[1] || goal.title}</h5>
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
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'business' && (
          <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-medium text-gray-700">Active Month:</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <select
                  className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={currentMonth}
                  onChange={(e) => setCurrentMonth(e.target.value)}
                >
                  {Object.keys(userData.monthlyGoals).map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
                <div className="bg-primary-100 text-primary-800 px-3 py-1 rounded-lg text-sm font-medium">
                  Current: {currentMonth}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'business' && (
          <BusinessManager 
            businesses={userData.businesses || []} 
            onBusinessUpdate={handleBusinessUpdate}
            userId={userId}
            currentMonth={currentMonth}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressTracker 
            monthlyScores={userData.monthlyScores}
            monthlyGoals={userData.monthlyGoals}
          />
        )}

        {activeTab === 'addGoal' && (
          <GoalForm userId={userId} />
        )}
      </div>
      
      {/* Goals Editor Modal */}
      {isEditing && (
        <GoalsEditor 
          userId={userId}
          monthlyGoals={userData.monthlyGoals}
          yearlyGoals={userData.yearlyGoals}
          onSave={handleSaveGoals}
          onClose={() => setIsEditing(false)}
        />
      )}
      
      {/* Individual Goal Editor */}
      {editingGoal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl p-6 max-w-3xl w-full">
            <GoalForm 
              userId={userId} 
              existingGoal={editingGoal.goal}
              onClose={() => setEditingGoal(null)}
              onSave={handleSaveIndividualGoal}
            />
          </div>
        </div>
      )}
    </div>
  );
} 