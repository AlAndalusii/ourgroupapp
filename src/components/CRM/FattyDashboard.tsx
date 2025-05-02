import { useState } from 'react';
import { Business, BusinessTask } from '@/components/types';
import Image from 'next/image';

interface FattyDashboardProps {
  business: Business;
  updateBusiness: (updatedBusiness: Business) => void;
  currentMonth: string;
}

const FattyDashboard: React.FC<FattyDashboardProps> = ({
  business,
  updateBusiness,
  currentMonth
}) => {
  const metrics = business.metrics || {};
  
  const updateMetric = (key: string, value: string | number) => {
    const updatedMetrics = {
      ...metrics,
      [key]: value
    };
    
    updateBusiness({
      ...business,
      metrics: updatedMetrics
    });
  };

  // Get weekly tasks
  const weeklyTasks = business.tasks.filter(task => task.isWeekly) || [];
  
  // Get monthly goals for current month
  const monthlyGoals = (business.monthlyGoals && business.monthlyGoals[currentMonth]) || [];
  
  // Calculate progress percentages
  const completedTasks = weeklyTasks.filter(task => task.completed).length;
  const taskProgress = weeklyTasks.length > 0 ? (completedTasks / weeklyTasks.length) * 100 : 0;
  
  const completedGoals = monthlyGoals.filter(goal => goal.completed).length;
  const goalProgress = monthlyGoals.length > 0 ? (completedGoals / monthlyGoals.length) * 100 : 0;

  // Shoe design and sales statistics
  const shoesTarget = parseInt(metrics.shoesTarget) || 100;
  const shoesSold = parseInt(metrics.shoesSold) || 0;
  const shoesProgress = (shoesSold / shoesTarget) * 100;
  
  const designsTarget = parseInt(metrics.designsTarget) || 10;
  const designsCreated = parseInt(metrics.designsCreated) || 0;
  const designsProgress = (designsCreated / designsTarget) * 100;
  
  const revenue = parseInt(metrics.revenue) || 0;
  const revenueTarget = parseInt(metrics.revenueTarget) || 5000;
  const revenueProgress = (revenue / revenueTarget) * 100;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-500 rounded-xl p-6 text-white shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome to {business.name}</h2>
            <p className="opacity-90">Track your shoe designs, sales, and revenue all in one place.</p>
          </div>
          {business.logo && (
            <div className="h-16 w-16 bg-white rounded-lg p-2 shadow-md">
              <Image
                src={business.logo}
                alt={business.name}
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
          )}
        </div>
      </div>

      {/* Launch Date */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Launch Planning</h3>
            <p className="text-gray-600 mb-4 md:mb-0">Set your target launch date and track your progress</p>
          </div>
          <div className="w-full md:w-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Launch Date</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={metrics.launchDate || ''}
                  onChange={(e) => updateMetric('launchDate', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marketing Budget (£)</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={metrics.marketingBudget || 0}
                  onChange={(e) => updateMetric('marketingBudget', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Shoes Sold */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-gray-800">Shoes Sold</h3>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
              {currentMonth}
            </span>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-3xl font-bold text-gray-800">{shoesSold}</span>
              <span className="text-gray-500 ml-2">/ {shoesTarget}</span>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium" 
                 style={{ backgroundColor: shoesProgress >= 100 ? '#10B981' : '#0EA5E9' }}>
              {Math.round(shoesProgress)}%
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${Math.min(100, shoesProgress)}%` }}></div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sales Target</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={shoesTarget}
                onChange={(e) => updateMetric('shoesTarget', parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shoes Sold</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={shoesSold}
                onChange={(e) => updateMetric('shoesSold', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>
        
        {/* Designs Created */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-gray-800">Designs Created</h3>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-teal-100 text-teal-800">
              {currentMonth}
            </span>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-3xl font-bold text-gray-800">{designsCreated}</span>
              <span className="text-gray-500 ml-2">/ {designsTarget}</span>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium" 
                 style={{ backgroundColor: designsProgress >= 100 ? '#10B981' : '#14B8A6' }}>
              {Math.round(designsProgress)}%
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div className="bg-teal-500 h-2.5 rounded-full" style={{ width: `${Math.min(100, designsProgress)}%` }}></div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Design Target</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={designsTarget}
                onChange={(e) => updateMetric('designsTarget', parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Designs Created</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={designsCreated}
                onChange={(e) => updateMetric('designsCreated', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>
        
        {/* Revenue */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-gray-800">Revenue</h3>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">
              {currentMonth}
            </span>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-3xl font-bold text-gray-800">£{revenue.toLocaleString()}</span>
              <span className="text-gray-500 ml-2">/ £{revenueTarget.toLocaleString()}</span>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium" 
                 style={{ backgroundColor: revenueProgress >= 100 ? '#10B981' : '#059669' }}>
              {Math.round(revenueProgress)}%
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${Math.min(100, revenueProgress)}%` }}></div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Revenue Target (£)</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={revenueTarget}
                onChange={(e) => updateMetric('revenueTarget', parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Revenue (£)</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={revenue}
                onChange={(e) => updateMetric('revenue', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Weekly Tasks & Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weekly Tasks */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="bg-blue-50 p-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-blue-800">Weekly Tasks</h3>
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
                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
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
        
        {/* Monthly Goals */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="bg-teal-50 p-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-teal-800">
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
                      <div>
                        <p className="font-medium">{goal.title}</p>
                        {goal.description && (
                          <p className="text-sm text-gray-500">{goal.description}</p>
                        )}
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

export default FattyDashboard; 