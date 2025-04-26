'use client';

import { useState } from 'react';

interface GoalFormProps {
  userId: number;
  existingGoal?: {
    id: number;
    title: string;
    description: string;
    month?: string;
    isOptional?: boolean;
    score?: number;
    completed?: boolean;
  };
  onClose?: () => void;
  onSave?: (updatedGoal: any) => void;
}

export default function GoalForm({ userId, existingGoal, onClose, onSave }: GoalFormProps) {
  const [formData, setFormData] = useState({
    title: existingGoal?.title || '',
    description: existingGoal?.description || '',
    month: existingGoal?.month || '',
    goalType: existingGoal?.month ? 'monthly' : 'yearly',
    isOptional: existingGoal?.isOptional || false,
    score: existingGoal?.score || 0,
    completed: existingGoal?.completed || false,
  });
  
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : type === 'number' 
          ? parseInt(value, 10) || 0 
          : value,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Basic validation
    if (!formData.title.trim()) {
      setErrorMessage('Please enter a goal title');
      setIsSubmitting(false);
      return;
    }
    
    if (formData.goalType === 'monthly' && !formData.month) {
      setErrorMessage('Please select a month for monthly goals');
      setIsSubmitting(false);
      return;
    }
    
    // Simulate API call with delay
    setTimeout(() => {
      try {
        // Prepare the updated goal object
        const updatedGoal = {
          id: existingGoal?.id || Date.now(), // Use existing ID or generate a new one
          title: formData.title,
          description: formData.description,
          completed: formData.completed,
          ...(formData.goalType === 'monthly' ? {
            month: formData.month,
            score: formData.score
          } : {
            isOptional: formData.isOptional
          })
        };
        
        // In a real app, you would save this to a database
        console.log('Goal for user', userId, existingGoal ? 'updated' : 'added', updatedGoal);
        
        // Call the onSave callback if provided
        if (onSave) {
          onSave(updatedGoal);
        }
        
        // Show success message
        setSuccessMessage(existingGoal ? 'Goal updated successfully!' : 'Goal added successfully!');
        setErrorMessage('');
        
        if (!existingGoal) {
          // Reset form for new goals
          setFormData({
            title: '',
            description: '',
            month: '',
            goalType: 'monthly',
            isOptional: false,
            score: 0,
            completed: false,
          });
        }
        
        // Close the form if it's an edit and we have a close handler
        if (existingGoal && onClose) {
          setTimeout(() => {
            onClose();
          }, 1500);
        }
      } catch (error) {
        setErrorMessage('An error occurred. Please try again.');
      } finally {
        setIsSubmitting(false);
        
        // Clear success message after a few seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    }, 600);
  };
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="bg-primary-50 dark:bg-primary-900/20 p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {existingGoal ? 'Edit Goal' : 'Add New Goal'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {existingGoal 
            ? 'Update your goal details and progress' 
            : 'Create a new goal to track your progress and improvements'}
        </p>
      </div>
      
      <div className="p-6">
        {successMessage && (
          <div className="mb-6 p-4 bg-success-50 dark:bg-success-900/30 border border-success-200 dark:border-success-800 text-success-700 dark:text-success-400 rounded-lg flex items-center">
            <svg className="w-5 h-5 mr-3 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {successMessage}
          </div>
        )}
        
        {errorMessage && (
          <div className="mb-6 p-4 bg-danger-50 dark:bg-danger-900/30 border border-danger-200 dark:border-danger-800 text-danger-700 dark:text-danger-400 rounded-lg flex items-center">
            <svg className="w-5 h-5 mr-3 text-danger-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {errorMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="goalType" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Goal Type
            </label>
            <div className="flex gap-4 mt-1">
              <label className={`inline-flex items-center px-4 py-2.5 rounded-lg border shadow-sm cursor-pointer transition-all duration-200 ${
                formData.goalType === 'monthly' 
                  ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-200 dark:border-primary-700' 
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}>
                <input
                  type="radio"
                  name="goalType"
                  value="monthly"
                  checked={formData.goalType === 'monthly'}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <span className={`ml-2 font-medium ${
                  formData.goalType === 'monthly' 
                    ? 'text-primary-700 dark:text-primary-400' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}>Monthly Goal</span>
              </label>
              <label className={`inline-flex items-center px-4 py-2.5 rounded-lg border shadow-sm cursor-pointer transition-all duration-200 ${
                formData.goalType === 'yearly' 
                  ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-200 dark:border-primary-700' 
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}>
                <input
                  type="radio"
                  name="goalType"
                  value="yearly"
                  checked={formData.goalType === 'yearly'}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <span className={`ml-2 font-medium ${
                  formData.goalType === 'yearly' 
                    ? 'text-primary-700 dark:text-primary-400' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}>Yearly Goal</span>
              </label>
            </div>
          </div>
          
          {formData.goalType === 'monthly' && (
            <div>
              <label htmlFor="month" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Month
              </label>
              <select
                id="month"
                name="month"
                value={formData.month}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 bg-white dark:bg-gray-800 dark:text-gray-200 transition duration-200"
                required={formData.goalType === 'monthly'}
              >
                <option value="">Select Month</option>
                {months.map(month => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Goal Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 bg-white dark:bg-gray-800 dark:text-gray-200 transition duration-200"
              placeholder="Enter goal title"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 bg-white dark:bg-gray-800 dark:text-gray-200 transition duration-200"
              placeholder="Enter goal description"
            ></textarea>
          </div>
          
          {formData.goalType === 'monthly' && (
            <div>
              <label htmlFor="score" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Score (0-10)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  id="score"
                  name="score"
                  min="0"
                  max="10"
                  value={formData.score}
                  onChange={handleChange}
                  className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-700 dark:text-primary-400 font-semibold">
                  {formData.score}
                </div>
              </div>
            </div>
          )}
          
          {existingGoal && (
            <div>
              <label className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                <input
                  type="checkbox"
                  name="completed"
                  checked={formData.completed}
                  onChange={handleChange}
                  className="h-5 w-5 text-primary-600 rounded border-gray-300 dark:border-gray-600 focus:ring-primary-500"
                />
                <span className="font-medium text-gray-800 dark:text-gray-200">Mark as Completed</span>
              </label>
            </div>
          )}
          
          {formData.goalType === 'yearly' && (
            <div>
              <label className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                <input
                  type="checkbox"
                  name="isOptional"
                  checked={formData.isOptional}
                  onChange={handleChange}
                  className="h-5 w-5 text-primary-600 rounded border-gray-300 dark:border-gray-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  This is an optional goal (not required but beneficial)
                </span>
              </label>
            </div>
          )}
          
          <div className="flex justify-end space-x-4 pt-4">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 font-medium transition duration-200"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2.5 bg-primary-600 rounded-lg shadow-sm text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 font-medium transition duration-200 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : existingGoal ? 'Update Goal' : 'Add Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 