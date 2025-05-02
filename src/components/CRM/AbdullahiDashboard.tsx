import { useState } from 'react';
import { Business, BusinessTask } from '@/components/types';
import Image from 'next/image';

interface AbdullahiDashboardProps {
  business: Business;
  updateBusiness: (updatedBusiness: Business) => void;
  currentMonth: string;
}

const AbdullahiDashboard: React.FC<AbdullahiDashboardProps> = ({
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
  
  const clientPercentage = metrics.clientTarget && metrics.clientTarget > 0 
    ? Math.min(100, ((metrics.currentClients || 0) / (metrics.clientTarget || 1)) * 100) 
    : 0;
  
  const revenuePercentage = metrics.revenueTarget && metrics.revenueTarget > 0
    ? Math.min(100, ((metrics.currentRevenue || 0) / (metrics.revenueTarget || 1)) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome to {business.name}</h2>
            <p className="opacity-90">Track your clients, revenue, and business growth all in one place.</p>
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

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h4 className="text-sm font-medium text-gray-500 mb-1">Total Clients</h4>
          <div className="text-2xl font-bold text-gray-800">
            {metrics.currentClients || 0}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h4 className="text-sm font-medium text-gray-500 mb-1">Revenue</h4>
          <div className="text-2xl font-bold text-gray-800">
            £{(metrics.currentRevenue || 0).toLocaleString()}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h4 className="text-sm font-medium text-gray-500 mb-1">Tasks Completed</h4>
          <div className="text-2xl font-bold text-gray-800">
            {completedTasks}/{weeklyTasks.length}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h4 className="text-sm font-medium text-gray-500 mb-1">Goals Progress</h4>
          <div className="text-2xl font-bold text-gray-800">
            {Math.round(goalProgress)}%
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client Tracker */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-gray-800">Client Tracker</h3>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-800">
              {currentMonth}
            </span>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-3xl font-bold text-gray-800">{metrics.currentClients || 0}</span>
              <span className="text-gray-500 ml-2">/ {metrics.clientTarget || 0}</span>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium" 
                 style={{ backgroundColor: clientPercentage >= 100 ? '#10B981' : '#F59E0B' }}>
              {Math.round(clientPercentage)}%
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: `${clientPercentage}%` }}></div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Clients</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                value={metrics.clientTarget || 0}
                onChange={(e) => updateMetric('clientTarget', parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Clients</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                value={metrics.currentClients || 0}
                onChange={(e) => updateMetric('currentClients', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
          
          {/* Client List */}
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Client Segments</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-amber-50 p-2 rounded border border-amber-100">
                <div className="text-xs text-amber-600 mb-1">New Clients</div>
                <div className="text-lg font-semibold text-amber-700">
                  {metrics.newClients || 0}
                </div>
              </div>
              <div className="bg-blue-50 p-2 rounded border border-blue-100">
                <div className="text-xs text-blue-600 mb-1">Returning</div>
                <div className="text-lg font-semibold text-blue-700">
                  {metrics.returningClients || 0}
                </div>
              </div>
              <div className="bg-green-50 p-2 rounded border border-green-100">
                <div className="text-xs text-green-600 mb-1">Premium</div>
                <div className="text-lg font-semibold text-green-700">
                  {metrics.premiumClients || 0}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Revenue Tracker */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-gray-800">Revenue</h3>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">
              {currentMonth}
            </span>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-3xl font-bold text-gray-800">£{(metrics.currentRevenue || 0).toLocaleString()}</span>
              <span className="text-gray-500 ml-2">/ £{(metrics.revenueTarget || 0).toLocaleString()}</span>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium" 
                 style={{ backgroundColor: revenuePercentage >= 100 ? '#10B981' : '#34D399' }}>
              {Math.round(revenuePercentage)}%
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${revenuePercentage}%` }}></div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Revenue Target (£)</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={metrics.revenueTarget || 0}
                onChange={(e) => updateMetric('revenueTarget', parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Revenue (£)</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={metrics.currentRevenue || 0}
                onChange={(e) => updateMetric('currentRevenue', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
          
          {/* Revenue Breakdown */}
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Revenue Sources</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-emerald-50 p-2 rounded border border-emerald-100">
                <div className="text-xs text-emerald-600 mb-1">Products</div>
                <div className="text-lg font-semibold text-emerald-700">
                  £{(metrics.productRevenue || 0).toLocaleString()}
                </div>
              </div>
              <div className="bg-cyan-50 p-2 rounded border border-cyan-100">
                <div className="text-xs text-cyan-600 mb-1">Services</div>
                <div className="text-lg font-semibold text-cyan-700">
                  £{(metrics.serviceRevenue || 0).toLocaleString()}
                </div>
              </div>
              <div className="bg-violet-50 p-2 rounded border border-violet-100">
                <div className="text-xs text-violet-600 mb-1">Consulting</div>
                <div className="text-lg font-semibold text-violet-700">
                  £{(metrics.consultingRevenue || 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Weekly Tasks & Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weekly Tasks */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="bg-amber-50 p-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-amber-800">Weekly Tasks</h3>
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
                        className="h-4 w-4 text-amber-600 rounded focus:ring-amber-500"
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
          <div className="bg-green-50 p-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-green-800">
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

export default AbdullahiDashboard; 