import { useState, useEffect } from 'react';
import { Business, MonthlyGoal } from '@/components/types';

interface AnalyticsDashboardProps {
  business: Business;
  currentMonth: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  business,
  currentMonth
}) => {
  const metrics = business.metrics || {};
  const [timeFrame, setTimeFrame] = useState<'month' | 'quarter' | 'year'>('month');
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  // Get index of current month for calculations
  const currentMonthIndex = months.indexOf(currentMonth);

  // Calculate insights based on goal scores
  const calculateInsights = () => {
    if (!business.monthlyGoals) return [];

    const insights: string[] = [];
    
    // Get current month goals
    const currentMonthGoals = business.monthlyGoals[currentMonth] || [];
    
    // Get previous month (accounting for year boundary)
    const prevMonthIndex = currentMonthIndex > 0 ? currentMonthIndex - 1 : 11;
    const prevMonth = months[prevMonthIndex];
    const prevMonthGoals = business.monthlyGoals[prevMonth] || [];
    
    // Calculate average scores
    const currentAvgScore = currentMonthGoals.length > 0 
      ? currentMonthGoals.reduce((sum, goal) => sum + goal.score, 0) / currentMonthGoals.length 
      : 0;
    
    const prevAvgScore = prevMonthGoals.length > 0 
      ? prevMonthGoals.reduce((sum, goal) => sum + goal.score, 0) / prevMonthGoals.length 
      : 0;
    
    // Generate insights based on scores
    if (currentMonthGoals.length > 0) {
      if (currentAvgScore > prevAvgScore) {
        insights.push(`Your average goal score improved from ${prevAvgScore.toFixed(1)} to ${currentAvgScore.toFixed(1)} compared to last month.`);
      } else if (currentAvgScore < prevAvgScore) {
        insights.push(`Your average goal score decreased from ${prevAvgScore.toFixed(1)} to ${currentAvgScore.toFixed(1)} compared to last month.`);
      }
      
      // Find goals with lowest scores
      const lowScoreGoals = currentMonthGoals.filter(goal => goal.score < 5);
      if (lowScoreGoals.length > 0) {
        insights.push(`You have ${lowScoreGoals.length} goals with low scores (below 5). Focus on these areas for improvement.`);
      }
      
      // Find completed vs total goals
      const completedGoals = currentMonthGoals.filter(goal => goal.completed);
      insights.push(`You've completed ${completedGoals.length} out of ${currentMonthGoals.length} goals (${Math.round((completedGoals.length / currentMonthGoals.length) * 100)}%) this month.`);
    } else {
      insights.push(`You haven't set any goals for ${currentMonth} yet. Add some goals to track your progress.`);
    }
    
    return insights;
  };

  // Get monthly goal data for visualization
  const getGoalDataByMonth = () => {
    if (!business.monthlyGoals) return [];

    let relevantMonths: string[] = [];
    
    if (timeFrame === 'month') {
      // Just show current month
      relevantMonths = [currentMonth];
    } else if (timeFrame === 'quarter') {
      // Show current quarter (3 months)
      const startMonthIndex = Math.floor(currentMonthIndex / 3) * 3;
      relevantMonths = months.slice(startMonthIndex, startMonthIndex + 3);
    } else {
      // Show full year
      relevantMonths = [...months];
    }
    
    return relevantMonths.map(month => {
      const monthGoals = business.monthlyGoals?.[month] || [];
      const totalGoals = monthGoals.length;
      const completedGoals = monthGoals.filter(goal => goal.completed).length;
      const avgScore = totalGoals > 0 
        ? monthGoals.reduce((sum, goal) => sum + goal.score, 0) / totalGoals 
        : 0;
      
      return {
        month,
        totalGoals,
        completedGoals,
        avgScore,
        completionRate: totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0
      };
    });
  };

  const goalData = getGoalDataByMonth();
  const insights = calculateInsights();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Analytics & Insights</h2>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            className={`px-3 py-1 rounded text-sm font-medium ${
              timeFrame === 'month' 
                ? 'bg-white shadow-sm text-indigo-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setTimeFrame('month')}
          >
            Month
          </button>
          <button
            className={`px-3 py-1 rounded text-sm font-medium ${
              timeFrame === 'quarter' 
                ? 'bg-white shadow-sm text-indigo-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setTimeFrame('quarter')}
          >
            Quarter
          </button>
          <button
            className={`px-3 py-1 rounded text-sm font-medium ${
              timeFrame === 'year' 
                ? 'bg-white shadow-sm text-indigo-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setTimeFrame('year')}
          >
            Year
          </button>
        </div>
      </div>

      {/* Performance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h4 className="text-sm font-medium text-gray-500 mb-1">Total Goals</h4>
          <div className="text-2xl font-bold text-gray-800">
            {goalData.reduce((sum, month) => sum + month.totalGoals, 0)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {timeFrame === 'month' ? 'This month' : timeFrame === 'quarter' ? 'This quarter' : 'This year'}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h4 className="text-sm font-medium text-gray-500 mb-1">Completed Goals</h4>
          <div className="text-2xl font-bold text-gray-800">
            {goalData.reduce((sum, month) => sum + month.completedGoals, 0)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {timeFrame === 'month' ? 'This month' : timeFrame === 'quarter' ? 'This quarter' : 'This year'}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h4 className="text-sm font-medium text-gray-500 mb-1">Completion Rate</h4>
          <div className="text-2xl font-bold text-gray-800">
            {Math.round(
              goalData.reduce((sum, month) => sum + month.completedGoals, 0) / 
              Math.max(1, goalData.reduce((sum, month) => sum + month.totalGoals, 0)) * 100
            )}%
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {timeFrame === 'month' ? 'This month' : timeFrame === 'quarter' ? 'This quarter' : 'This year'}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h4 className="text-sm font-medium text-gray-500 mb-1">Average Score</h4>
          <div className="text-2xl font-bold text-gray-800">
            {(goalData.reduce((sum, month) => sum + month.avgScore * month.totalGoals, 0) / 
              Math.max(1, goalData.reduce((sum, month) => sum + month.totalGoals, 0))).toFixed(1)}
            <span className="text-base font-normal">/10</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {timeFrame === 'month' ? 'This month' : timeFrame === 'quarter' ? 'This quarter' : 'This year'}
          </div>
        </div>
      </div>

      {/* Charts and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goal Completion Chart */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Goal Completion</h3>
          
          <div className="space-y-4">
            {goalData.map(data => (
              <div key={data.month} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">{data.month}</span>
                  <span className="text-gray-500">
                    {data.completedGoals}/{data.totalGoals} goals completed
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.min(100, data.completionRate)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Completion rate: {Math.round(data.completionRate)}%</span>
                  <span>Avg score: {data.avgScore.toFixed(1)}/10</span>
                </div>
              </div>
            ))}
            
            {goalData.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No goal data available for the selected time frame
              </div>
            )}
          </div>
        </div>
        
        {/* Insights */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Improvement Insights</h3>
          
          <ul className="space-y-4">
            {insights.map((insight, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center">
                    <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                </div>
                <p className="text-gray-700">{insight}</p>
              </li>
            ))}
            
            {insights.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Not enough data to generate insights yet
              </div>
            )}
          </ul>
        </div>
      </div>

      {/* Business Metrics */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Business Metrics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Clients Metric */}
          {'clientTarget' in metrics && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">Clients</h4>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-gray-800">{metrics.currentClients || 0}</span>
                  <span className="text-gray-500 ml-2">/ {metrics.clientTarget || 0}</span>
                </div>
                <div className="text-sm font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                  {Math.round(
                    ((metrics.currentClients || 0) / Math.max(1, (metrics.clientTarget || 1))) * 100
                  )}%
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ 
                    width: `${Math.min(100, ((metrics.currentClients || 0) / Math.max(1, (metrics.clientTarget || 1))) * 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          )}
          
          {/* Revenue Metric */}
          {'revenueTarget' in metrics && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">Revenue</h4>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-gray-800">£{(metrics.currentRevenue || 0).toLocaleString()}</span>
                  <span className="text-gray-500 ml-2">/ £{(metrics.revenueTarget || 0).toLocaleString()}</span>
                </div>
                <div className="text-sm font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">
                  {Math.round(
                    ((metrics.currentRevenue || 0) / Math.max(1, (metrics.revenueTarget || 1))) * 100
                  )}%
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
          
          {/* Shoes Metric */}
          {'shoesSold' in metrics && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">Shoes Sold</h4>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-gray-800">{metrics.shoesSold || 0}</span>
                  <span className="text-gray-500 ml-2">/ {metrics.shoesTarget || 100}</span>
                </div>
                <div className="text-sm font-medium px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                  {Math.round(
                    ((metrics.shoesSold || 0) / Math.max(1, (metrics.shoesTarget || 100))) * 100
                  )}%
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-purple-600 h-2.5 rounded-full" 
                  style={{ 
                    width: `${Math.min(100, ((metrics.shoesSold || 0) / Math.max(1, (metrics.shoesTarget || 100))) * 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          )}
          
          {/* Designs Metric */}
          {'designsCreated' in metrics && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">Designs Created</h4>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-gray-800">{metrics.designsCreated || 0}</span>
                  <span className="text-gray-500 ml-2">/ {metrics.designsTarget || 10}</span>
                </div>
                <div className="text-sm font-medium px-2 py-1 rounded-full bg-teal-100 text-teal-800">
                  {Math.round(
                    ((metrics.designsCreated || 0) / Math.max(1, (metrics.designsTarget || 10))) * 100
                  )}%
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-teal-600 h-2.5 rounded-full" 
                  style={{ 
                    width: `${Math.min(100, ((metrics.designsCreated || 0) / Math.max(1, (metrics.designsTarget || 10))) * 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 