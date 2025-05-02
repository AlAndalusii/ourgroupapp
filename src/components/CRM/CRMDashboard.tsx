import { useState, useEffect } from 'react';
import { Business, BusinessTask, MonthlyGoal } from '@/components/types';
import BusinessOverview from './BusinessOverview';
import TaskManager from './TaskManager';
import GoalTracker from './GoalTracker';
import AnalyticsDashboard from './AnalyticsDashboard';
import ZakariyaDashboard from './ZakariyaDashboard';
import FattyDashboard from './FattyDashboard';
import AbdullahiDashboard from './AbdullahiDashboard';

interface CRMDashboardProps {
  business: Business;
  updateBusiness: (updatedBusiness: Business) => void;
  userId: number;
  currentMonth: string;
}

const CRMDashboard: React.FC<CRMDashboardProps> = ({
  business,
  updateBusiness,
  userId,
  currentMonth
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'goals' | 'analytics'>('overview');
  const [activeMonth, setActiveMonth] = useState<string>(currentMonth);

  useEffect(() => {
    setActiveMonth(currentMonth);
  }, [currentMonth]);

  // Render specific dashboard based on userId
  const renderUserSpecificDashboard = () => {
    switch (userId) {
      case 1: // Zakariya
        return (
          <ZakariyaDashboard 
            business={business} 
            updateBusiness={updateBusiness} 
            currentMonth={activeMonth} 
          />
        );
      case 2: // Fatty
        return (
          <FattyDashboard 
            business={business} 
            updateBusiness={updateBusiness} 
            currentMonth={activeMonth} 
          />
        );
      case 3: // Abdullahi
        return (
          <AbdullahiDashboard 
            business={business} 
            updateBusiness={updateBusiness}
            currentMonth={activeMonth} 
          />
        );
      default:
        return (
          <BusinessOverview 
            business={business} 
            updateBusiness={updateBusiness} 
            currentMonth={activeMonth} 
          />
        );
    }
  };

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="flex flex-col h-full">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="flex px-6">
          <button
            className={`py-4 px-6 border-b-2 font-medium text-sm ${
              activeTab === 'overview' 
                ? 'border-indigo-500 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`py-4 px-6 border-b-2 font-medium text-sm ${
              activeTab === 'tasks' 
                ? 'border-indigo-500 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('tasks')}
          >
            Tasks
          </button>
          <button
            className={`py-4 px-6 border-b-2 font-medium text-sm ${
              activeTab === 'goals' 
                ? 'border-indigo-500 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('goals')}
          >
            Goals
          </button>
          <button
            className={`py-4 px-6 border-b-2 font-medium text-sm ${
              activeTab === 'analytics' 
                ? 'border-indigo-500 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </div>
      </div>

      {/* Month Selector */}
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Month:</label>
          <select
            className="bg-white border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={activeMonth}
            onChange={(e) => setActiveMonth(e.target.value)}
          >
            {months.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
          <button 
            onClick={() => setActiveMonth(currentMonth)}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              activeMonth === currentMonth 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Current Month
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-6 bg-gray-50">
        {activeTab === 'overview' && renderUserSpecificDashboard()}
        
        {activeTab === 'tasks' && (
          <TaskManager 
            business={business} 
            updateBusiness={updateBusiness} 
          />
        )}
        
        {activeTab === 'goals' && (
          <GoalTracker 
            business={business} 
            updateBusiness={updateBusiness} 
            currentMonth={activeMonth}
          />
        )}
        
        {activeTab === 'analytics' && (
          <AnalyticsDashboard 
            business={business} 
            currentMonth={activeMonth}
          />
        )}
      </div>
    </div>
  );
};

export default CRMDashboard; 