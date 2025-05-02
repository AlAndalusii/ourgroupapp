import { useState } from 'react';
import { Business, BusinessTask } from '@/components/types';
import Image from 'next/image';
import BusinessLogo from '../BusinessLogo';

interface BusinessOverviewProps {
  business: Business;
  updateBusiness: (updatedBusiness: Business) => void;
  currentMonth: string;
}

const BusinessOverview: React.FC<BusinessOverviewProps> = ({
  business,
  updateBusiness,
  currentMonth
}) => {
  const metrics = business.metrics || {};
  
  // Get weekly tasks
  const weeklyTasks = business.tasks.filter(task => task.isWeekly) || [];
  
  // Get monthly goals for current month
  const monthlyGoals = (business.monthlyGoals && business.monthlyGoals[currentMonth]) || [];
  
  // Calculate progress percentages
  const completedTasks = weeklyTasks.filter(task => task.completed).length;
  const taskProgress = weeklyTasks.length > 0 ? (completedTasks / weeklyTasks.length) * 100 : 0;
  
  const completedGoals = monthlyGoals.filter(goal => goal.completed).length;
  const goalProgress = monthlyGoals.length > 0 ? (completedGoals / monthlyGoals.length) * 100 : 0;

  const handleLogoChange = (logoUrl: string) => {
    updateBusiness({
      ...business,
      logo: logoUrl
    });
  };

  return (
    <div className="space-y-6">
      {/* Business Header */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16">
              <BusinessLogo 
                businessName={business.name}
                logoUrl={business.logo}
                onLogoChange={handleLogoChange}
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{business.name}</h2>
              <p className="text-gray-500 mt-1">
                {business.tasks.length} tasks, {monthlyGoals.length} goals for {currentMonth}
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm">
              Edit Business Details
            </button>
          </div>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Weekly Tasks</h3>
          <div className="flex justify-between items-end mb-2">
            <div className="text-2xl font-bold text-gray-800">{completedTasks}/{weeklyTasks.length}</div>
            <div className="text-sm font-medium text-gray-500">
              {Math.round(taskProgress)}% complete
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${taskProgress}%` }}></div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Monthly Goals</h3>
          <div className="flex justify-between items-end mb-2">
            <div className="text-2xl font-bold text-gray-800">{completedGoals}/{monthlyGoals.length}</div>
            <div className="text-sm font-medium text-gray-500">
              {Math.round(goalProgress)}% complete
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${goalProgress}%` }}></div>
          </div>
        </div>
        
        {'clientTarget' in metrics && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Clients</h3>
            <div className="flex justify-between items-end mb-2">
              <div className="text-2xl font-bold text-gray-800">{metrics.currentClients || 0}</div>
              <div className="text-sm font-medium text-gray-500">
                Target: {metrics.clientTarget || 0}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full" 
                style={{ 
                  width: `${Math.min(100, ((metrics.currentClients || 0) / Math.max(1, (metrics.clientTarget || 1))) * 100)}%` 
                }}
              ></div>
            </div>
          </div>
        )}
        
        {'revenueTarget' in metrics && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Revenue</h3>
            <div className="flex justify-between items-end mb-2">
              <div className="text-2xl font-bold text-gray-800">£{(metrics.currentRevenue || 0).toLocaleString()}</div>
              <div className="text-sm font-medium text-gray-500">
                Target: £{(metrics.revenueTarget || 0).toLocaleString()}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-600 h-2.5 rounded-full" 
                style={{ 
                  width: `${Math.min(100, ((metrics.currentRevenue || 0) / Math.max(1, (metrics.revenueTarget || 1))) * 100)}%` 
                }}
              ></div>
            </div>
          </div>
        )}
        
        {'shoesSold' in metrics && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Shoes Sold</h3>
            <div className="flex justify-between items-end mb-2">
              <div className="text-2xl font-bold text-gray-800">{metrics.shoesSold || 0}</div>
              <div className="text-sm font-medium text-gray-500">
                Target: {metrics.shoesTarget || 100}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ 
                  width: `${Math.min(100, ((metrics.shoesSold || 0) / Math.max(1, (metrics.shoesTarget || 100))) * 100)}%` 
                }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Weekly Tasks Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 p-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800">Weekly Tasks</h3>
          </div>
          <div className="p-4">
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {weeklyTasks.length > 0 ? (
                weeklyTasks.map((task: BusinessTask) => (
                  <li 
                    key={task.id} 
                    className="flex items-start gap-2 p-3 hover:bg-gray-50 rounded border border-gray-100"
                  >
                    <div className="flex-shrink-0 pt-0.5">
                      <input 
                        type="checkbox" 
                        checked={task.completed}
                        onChange={() => {
                          const updatedTasks = business.tasks.map(t =>
                            t.id === task.id ? { ...t, completed: !t.completed } : t
                          );
                          updateBusiness({
                            ...business,
                            tasks: updatedTasks
                          });
                        }}
                        className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                      />
                    </div>
                    <div className="flex-grow">
                      <p className={`font-medium ${task.completed ? 'line-through text-gray-400' : ''}`}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-sm text-gray-500">{task.description}</p>
                      )}
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-gray-500 text-center p-4">No weekly tasks yet</p>
              )}
            </ul>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 p-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800">
              Monthly Goals - {currentMonth}
            </h3>
          </div>
          <div className="p-4">
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {monthlyGoals.length > 0 ? (
                monthlyGoals.map((goal) => (
                  <li 
                    key={goal.id} 
                    className="p-3 hover:bg-gray-50 rounded border border-gray-100"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 pt-0.5">
                          <input 
                            type="checkbox" 
                            checked={goal.completed}
                            onChange={() => {
                              const monthlyGoals = { ...(business.monthlyGoals || {}) };
                              const monthGoals = [...(monthlyGoals[currentMonth] || [])];
                              
                              const updatedMonthGoals = monthGoals.map(g =>
                                g.id === goal.id ? { ...g, completed: !g.completed } : g
                              );
                              
                              monthlyGoals[currentMonth] = updatedMonthGoals;
                              
                              updateBusiness({
                                ...business,
                                monthlyGoals
                              });
                            }}
                            className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                          />
                        </div>
                        <div>
                          <p className={`font-medium ${goal.completed ? 'line-through text-gray-400' : ''}`}>
                            {goal.title}
                          </p>
                          {goal.description && (
                            <p className="text-sm text-gray-500">{goal.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center space-x-1">
                          <span className="text-sm text-gray-600">Score:</span>
                          <select 
                            className="border border-gray-300 rounded p-1"
                            value={goal.score}
                            onChange={(e) => {
                              const score = parseInt(e.target.value);
                              const monthlyGoals = { ...(business.monthlyGoals || {}) };
                              const monthGoals = [...(monthlyGoals[currentMonth] || [])];
                              
                              const updatedMonthGoals = monthGoals.map(g =>
                                g.id === goal.id ? { ...g, score } : g
                              );
                              
                              monthlyGoals[currentMonth] = updatedMonthGoals;
                              
                              updateBusiness({
                                ...business,
                                monthlyGoals
                              });
                            }}
                          >
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => (
                              <option key={score} value={score}>{score}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-gray-500 text-center p-4">No monthly goals for {currentMonth}</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessOverview; 