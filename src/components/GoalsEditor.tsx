'use client';

import { useState } from 'react';

interface MonthlyGoal {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  month: string;
  score: number;
}

interface YearlyGoal {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  isOptional?: boolean;
}

interface GoalsEditorProps {
  userId: number;
  monthlyGoals: Record<string, MonthlyGoal[]>;
  yearlyGoals: YearlyGoal[];
  onSave: (type: 'monthly' | 'yearly', goals: any) => void;
  onClose: () => void;
}

export default function GoalsEditor({ userId, monthlyGoals, yearlyGoals, onSave, onClose }: GoalsEditorProps) {
  const [activeTab, setActiveTab] = useState<'monthly' | 'yearly'>('monthly');
  const [activeMonth, setActiveMonth] = useState<string>('January');
  const [editedMonthlyGoals, setEditedMonthlyGoals] = useState<Record<string, MonthlyGoal[]>>(monthlyGoals);
  const [editedYearlyGoals, setEditedYearlyGoals] = useState<YearlyGoal[]>(yearlyGoals);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Initialize empty goals for months that don't have any
  months.forEach(month => {
    if (!editedMonthlyGoals[month]) {
      editedMonthlyGoals[month] = [];
    }
  });

  const handleMonthlyGoalChange = (month: string, index: number, field: keyof MonthlyGoal, value: any) => {
    const updatedGoals = { ...editedMonthlyGoals };
    
    if (updatedGoals[month] && updatedGoals[month][index]) {
      updatedGoals[month] = [...updatedGoals[month]];
      updatedGoals[month][index] = {
        ...updatedGoals[month][index],
        [field]: value
      };
      setEditedMonthlyGoals(updatedGoals);
    }
  };

  const handleYearlyGoalChange = (index: number, field: keyof YearlyGoal, value: any) => {
    const updatedGoals = [...editedYearlyGoals];
    
    if (updatedGoals[index]) {
      updatedGoals[index] = {
        ...updatedGoals[index],
        [field]: value
      };
      setEditedYearlyGoals(updatedGoals);
    }
  };

  const addMonthlyGoal = (month: string) => {
    const updatedGoals = { ...editedMonthlyGoals };
    const newGoal: MonthlyGoal = {
      id: Date.now(), // Simple ID generation
      title: '',
      description: '',
      completed: false,
      month: month,
      score: 0
    };
    
    updatedGoals[month] = [...(updatedGoals[month] || []), newGoal];
    setEditedMonthlyGoals(updatedGoals);
  };

  const addYearlyGoal = () => {
    const newGoal: YearlyGoal = {
      id: Date.now(), // Simple ID generation
      title: '',
      description: '',
      completed: false,
      isOptional: false
    };
    
    setEditedYearlyGoals([...editedYearlyGoals, newGoal]);
  };

  const removeMonthlyGoal = (month: string, index: number) => {
    const updatedGoals = { ...editedMonthlyGoals };
    
    if (updatedGoals[month] && updatedGoals[month].length > index) {
      updatedGoals[month] = updatedGoals[month].filter((_, i) => i !== index);
      setEditedMonthlyGoals(updatedGoals);
    }
  };

  const removeYearlyGoal = (index: number) => {
    setEditedYearlyGoals(editedYearlyGoals.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    setIsSubmitting(true);
    
    // Simulate API call with a delay
    setTimeout(() => {
      try {
        if (activeTab === 'monthly') {
          onSave('monthly', editedMonthlyGoals);
        } else {
          onSave('yearly', editedYearlyGoals);
        }
        
        setSuccessMessage(`${activeTab === 'monthly' ? 'Monthly' : 'Yearly'} goals saved successfully!`);
        
        // Clear the success message after a delay
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } finally {
        setIsSubmitting(false);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="border-b dark:border-gray-700">
          <div className="flex p-4 items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Manage Your Goals</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex px-4">
            <button
              className={`relative px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === 'monthly'
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('monthly')}
            >
              Monthly Goals
              {activeTab === 'monthly' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400"></div>
              )}
            </button>
            <button
              className={`relative px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === 'yearly'
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('yearly')}
            >
              Yearly Goals
              {activeTab === 'yearly' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400"></div>
              )}
            </button>
          </div>
        </div>
        
        {successMessage && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4">
            <div className="flex">
              <div className="py-1"><svg className="h-6 w-6 text-green-500 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg></div>
              <div>
                <p className="font-bold">Success!</p>
                <p className="text-sm">{successMessage}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="overflow-y-auto flex-grow p-6">
          {activeTab === 'monthly' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Monthly Goals</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your goals for each month</p>
                </div>
                <div className="flex space-x-2">
                  <select
                    value={activeMonth}
                    onChange={(e) => setActiveMonth(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {months.map(month => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => addMonthlyGoal(activeMonth)}
                    className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Goal
                  </button>
                </div>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                {editedMonthlyGoals[activeMonth] && editedMonthlyGoals[activeMonth].map((goal, index) => (
                  <div key={goal.id} className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
                    <div className="p-5">
                      <div className="space-y-4">
                        <div className="flex justify-between gap-4">
                          <div className="flex-grow">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                              Goal Title
                            </label>
                            <input
                              type="text"
                              value={goal.title}
                              onChange={(e) => handleMonthlyGoalChange(activeMonth, index, 'title', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="Enter goal title"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                              Score (0-10)
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="range"
                                min="0"
                                max="10"
                                value={goal.score}
                                onChange={(e) => handleMonthlyGoalChange(activeMonth, index, 'score', parseInt(e.target.value))}
                                className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
                              />
                              <div className="w-8 h-8 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-medium">
                                {goal.score}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Description
                          </label>
                          <textarea
                            value={goal.description}
                            onChange={(e) => handleMonthlyGoalChange(activeMonth, index, 'description', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Enter goal description"
                            rows={3}
                          />
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <label className="flex items-center bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                            <input
                              type="checkbox"
                              checked={goal.completed}
                              onChange={(e) => handleMonthlyGoalChange(activeMonth, index, 'completed', e.target.checked)}
                              className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                            />
                            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Completed</span>
                          </label>
                          
                          <button
                            onClick={() => removeMonthlyGoal(activeMonth, index)}
                            className="text-red-500 hover:text-red-700 transition-colors bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 px-3 py-2 rounded-lg"
                          >
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span className="text-sm font-medium">Remove</span>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {(!editedMonthlyGoals[activeMonth] || editedMonthlyGoals[activeMonth].length === 0) && (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                  <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No goals for {activeMonth}</h3>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">Start by adding your first goal for this month.</p>
                  <button
                    onClick={() => addMonthlyGoal(activeMonth)}
                    className="mt-6 px-5 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    Add Your First Goal
                  </button>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'yearly' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Yearly Goals</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">Define your major goals for the year</p>
                </div>
                <button
                  onClick={addYearlyGoal}
                  className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Goal
                </button>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                {editedYearlyGoals.map((goal, index) => (
                  <div key={goal.id} className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
                    <div className="p-5">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Goal Title
                          </label>
                          <input
                            type="text"
                            value={goal.title}
                            onChange={(e) => handleYearlyGoalChange(index, 'title', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Enter goal title"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Description
                          </label>
                          <textarea
                            value={goal.description}
                            onChange={(e) => handleYearlyGoalChange(index, 'description', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Enter goal description"
                            rows={3}
                          />
                        </div>
                        
                        <div className="flex flex-wrap gap-4 pt-2">
                          <label className="flex items-center bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                            <input
                              type="checkbox"
                              checked={goal.completed}
                              onChange={(e) => handleYearlyGoalChange(index, 'completed', e.target.checked)}
                              className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                            />
                            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Completed</span>
                          </label>
                          
                          <label className="flex items-center bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                            <input
                              type="checkbox"
                              checked={goal.isOptional || false}
                              onChange={(e) => handleYearlyGoalChange(index, 'isOptional', e.target.checked)}
                              className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                            />
                            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Optional</span>
                          </label>
                          
                          <button
                            onClick={() => removeYearlyGoal(index)}
                            className="ml-auto text-red-500 hover:text-red-700 transition-colors bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 px-3 py-2 rounded-lg"
                          >
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span className="text-sm font-medium">Remove</span>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {editedYearlyGoals.length === 0 && (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                  <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No yearly goals yet</h3>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">Start by adding your first goal for the year.</p>
                  <button
                    onClick={addYearlyGoal}
                    className="mt-6 px-5 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    Add Your First Goal
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="border-t dark:border-gray-700 p-6 flex justify-end space-x-4 bg-gray-50 dark:bg-gray-800">
          {successMessage && (
            <div className="flex-grow flex items-center">
              <div className="bg-success-50 dark:bg-success-900/30 text-success-700 dark:text-success-400 px-4 py-2 rounded-lg flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {successMessage}
              </div>
            </div>
          )}
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className={`px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-sm flex items-center ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
} 