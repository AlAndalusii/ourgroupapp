'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import chart components to avoid SSR issues
const Line = dynamic(
  () => import('react-chartjs-2').then((mod) => mod.Line),
  { ssr: false }
);

const Bar = dynamic(
  () => import('react-chartjs-2').then((mod) => mod.Bar),
  { ssr: false }
);

const Radar = dynamic(
  () => import('react-chartjs-2').then((mod) => mod.Radar),
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
      RadialLinearScale 
    } = await import('chart.js');
    
    Chart.register(
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      BarElement,
      RadialLinearScale,
      Title,
      Tooltip,
      Legend
    );
  }
};

// Initialize chart.js
initChartJS();

interface MonthlyGoal {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  month: string;
  score: number;
  isOptional?: boolean;
}

interface ProgressTrackerProps {
  monthlyScores: Record<string, number>;
  monthlyGoals: Record<string, MonthlyGoal[]>;
}

export default function ProgressTracker({
  monthlyScores,
  monthlyGoals,
}: ProgressTrackerProps) {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  
  // Data calculations
  const months = Object.keys(monthlyScores);
  const scores = Object.values(monthlyScores);
  
  // Find trends - is the user improving?
  const improvement = calculateImprovement(monthlyScores);
  
  // Calculate completion rates by month
  const completionRates = calculateCompletionRates(monthlyGoals);
  
  // Calculate areas of strength and weakness based on goal categories
  const strengthsAndWeaknesses = calculateStrengthsAndWeaknesses(monthlyGoals);
  
  // Chart data
  const lineData = {
    labels: months,
    datasets: [
      {
        label: 'Monthly Score',
        data: scores,
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const barData = {
    labels: Object.keys(completionRates),
    datasets: [
      {
        label: 'Goal Completion Rate (%)',
        data: Object.values(completionRates),
        backgroundColor: 'rgba(249, 115, 22, 0.7)',
      },
    ],
  };

  const radarData = {
    labels: Object.keys(strengthsAndWeaknesses),
    datasets: [
      {
        label: 'Performance by Category',
        data: Object.values(strengthsAndWeaknesses),
        backgroundColor: 'rgba(14, 165, 233, 0.2)',
        borderColor: 'rgb(14, 165, 233)',
        pointBackgroundColor: 'rgb(14, 165, 233)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(14, 165, 233)',
      },
    ],
  };

  return (
    <div className="space-y-8">
      <div className="luxury-card">
        <h2 className="text-2xl font-bold mb-4">Progress Overview</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Track your progress over time and identify areas of improvement.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-primary-700 dark:text-primary-300">
              Average Score
            </h3>
            <p className="text-3xl font-bold">
              {(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)}/10
            </p>
          </div>
          
          <div className="p-4 bg-secondary-50 dark:bg-secondary-900/30 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-secondary-700 dark:text-secondary-300">
              Progress Trend
            </h3>
            <p className="text-3xl font-bold">
              {improvement > 0 ? '+' : ''}{improvement}%
            </p>
          </div>
          
          <div className="p-4 bg-success-50 dark:bg-success-900/30 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-success-700 dark:text-success-300">
              Completion Rate
            </h3>
            <p className="text-3xl font-bold">
              {calculateAverageCompletionRate(completionRates)}%
            </p>
          </div>
        </div>
        
        <div className="h-80">
          <Line 
            data={lineData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  min: 0,
                  max: 10,
                  title: {
                    display: true,
                    text: 'Score (0-10)',
                  },
                },
              },
              plugins: {
                title: {
                  display: true,
                  text: 'Monthly Performance Scores',
                },
              },
            }} 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="luxury-card">
          <h3 className="text-xl font-bold mb-4">Goal Completion By Month</h3>
          <div className="h-64">
            <Bar 
              data={barData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                      display: true,
                      text: 'Completion Rate (%)',
                    },
                  },
                },
              }} 
            />
          </div>
        </div>
        
        <div className="luxury-card">
          <h3 className="text-xl font-bold mb-4">Strengths & Weaknesses</h3>
          <div className="h-64">
            <Radar 
              data={radarData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  r: {
                    min: 0,
                    max: 10,
                    ticks: {
                      stepSize: 2,
                    },
                  },
                },
              }} 
            />
          </div>
        </div>
      </div>
      
      <div className="luxury-card">
        <h3 className="text-xl font-bold mb-4">Improvement Areas</h3>
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Based on your performance, here are the areas where you could focus for improvement:
          </p>
          
          <div className="space-y-2">
            {/* Show goals with scores below 5 */}
            {Object.entries(monthlyGoals).flatMap(([month, goals]) => 
              goals.filter(goal => goal.score < 5)
                .map(goal => (
                  <div key={`${month}-${goal.id}`} className="p-3 border border-danger-200 dark:border-danger-800 bg-danger-50 dark:bg-danger-900/20 rounded-lg">
                    <h4 className="font-medium flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-danger-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                      {goal.title}
                    </h4>
                    <p className="ml-7 text-sm text-gray-600 dark:text-gray-400">
                      Month: {goal.month} | Score: {goal.score.toFixed(1)}/10
                    </p>
                  </div>
                ))
            )}
            {/* If no goals with scores below 5 */}
            {Object.entries(monthlyGoals).flatMap(([month, goals]) => 
              goals.filter(goal => goal.score < 5)).length === 0 && (
              <div className="p-3 border border-success-200 dark:border-success-800 bg-success-50 dark:bg-success-900/20 rounded-lg">
                <p className="text-success-700 dark:text-success-300">
                  Great job! You don't have any goals with low scores that need improvement.
                </p>
              </div>
            )}
          </div>
          
          <div className="space-y-2 mt-4">
            <h4 className="text-lg font-medium">Your Strengths</h4>
            <div className="space-y-2">
              {/* Show goals with scores above 7 */}
              {Object.entries(monthlyGoals).flatMap(([month, goals]) => 
                goals.filter(goal => goal.score > 7)
                  .map(goal => (
                    <div key={`${month}-${goal.id}`} className="p-3 border border-success-200 dark:border-success-800 bg-success-50 dark:bg-success-900/20 rounded-lg">
                      <h4 className="font-medium flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        {goal.title}
                      </h4>
                      <p className="ml-7 text-sm text-gray-600 dark:text-gray-400">
                        Month: {goal.month} | Score: {goal.score.toFixed(1)}/10
                      </p>
                    </div>
                  ))
              )}
              {/* If no goals with scores above 7 */}
              {Object.entries(monthlyGoals).flatMap(([month, goals]) => 
                goals.filter(goal => goal.score > 7)).length === 0 && (
                <div className="p-3 border border-danger-200 dark:border-danger-800 bg-danger-50 dark:bg-danger-900/20 rounded-lg">
                  <p className="text-danger-700 dark:text-danger-300">
                    You don't have any high-scoring goals yet. Keep working to develop your strengths!
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <h4 className="text-lg font-medium">Missed Goals</h4>
            <div className="space-y-2">
              {/* Show incomplete goals */}
              {Object.entries(monthlyGoals).flatMap(([month, goals]) => 
                goals.filter(goal => !goal.completed)
                  .map(goal => (
                    <div key={`${month}-${goal.id}`} className="p-3 border border-warning-200 dark:border-warning-800 bg-warning-50 dark:bg-warning-900/20 rounded-lg">
                      <h4 className="font-medium flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-warning-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {goal.title}
                      </h4>
                      <p className="ml-7 text-sm text-gray-600 dark:text-gray-400">
                        Month Missed: {goal.month}
                      </p>
                    </div>
                  ))
              )}
              {/* If no incomplete goals */}
              {Object.entries(monthlyGoals).flatMap(([month, goals]) => 
                goals.filter(goal => !goal.completed)).length === 0 && (
                <div className="p-3 border border-success-200 dark:border-success-800 bg-success-50 dark:bg-success-900/20 rounded-lg">
                  <p className="text-success-700 dark:text-success-300">
                    Excellent! You've completed all your goals so far.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function calculateImprovement(monthlyScores: Record<string, number>): number {
  const months = Object.keys(monthlyScores);
  if (months.length < 2) return 0;
  
  const firstMonth = monthlyScores[months[0]];
  const lastMonth = monthlyScores[months[months.length - 1]];
  
  const percentChange = ((lastMonth - firstMonth) / firstMonth) * 100;
  return Math.round(percentChange);
}

function calculateCompletionRates(monthlyGoals: Record<string, MonthlyGoal[]>): Record<string, number> {
  const result: Record<string, number> = {};
  
  Object.entries(monthlyGoals).forEach(([month, goals]) => {
    const totalGoals = goals.length;
    const completedGoals = goals.filter(goal => goal.completed).length;
    result[month] = Math.round((completedGoals / totalGoals) * 100);
  });
  
  return result;
}

function calculateAverageCompletionRate(completionRates: Record<string, number>): number {
  const rates = Object.values(completionRates);
  if (rates.length === 0) return 0;
  return Math.round(rates.reduce((a, b) => a + b, 0) / rates.length);
}

function calculateStrengthsAndWeaknesses(monthlyGoals: Record<string, MonthlyGoal[]>): Record<string, number> {
  // Simplified version - in a real app, you'd categorize goals
  const categories = {
    'Quran & Reading': [] as number[],
    'Dhikr & Prayer': [] as number[],
    'Arabic & Knowledge': [] as number[],
    'Charity & Service': [] as number[],
  };
  
  // Categorize goals based on keywords in titles (simplified approach)
  Object.values(monthlyGoals).flat().forEach(goal => {
    const title = goal.title.toLowerCase();
    
    if (title.includes('quran') || title.includes('read') || title.includes('juz')) {
      categories['Quran & Reading'].push(goal.score);
    } else if (title.includes('dhikr') || title.includes('adhkar') || title.includes('prayer')) {
      categories['Dhikr & Prayer'].push(goal.score);
    } else if (title.includes('arabic') || title.includes('hadith') || title.includes('knowledge') || title.includes('class') || title.includes('memorize')) {
      categories['Arabic & Knowledge'].push(goal.score);
    } else if (title.includes('charity') || title.includes('service') || title.includes('volunteer')) {
      categories['Charity & Service'].push(goal.score);
    }
  });
  
  // Calculate average score for each category
  const result: Record<string, number> = {};
  
  Object.entries(categories).forEach(([category, scores]) => {
    if (scores.length > 0) {
      result[category] = scores.reduce((a, b) => a + b, 0) / scores.length;
    } else {
      result[category] = 0; // No goals in this category
    }
  });
  
  return result;
} 