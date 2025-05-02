import { useState, useEffect } from 'react';
import { Business, MonthlyGoal } from '@/components/types';

interface GoalTrackerProps {
  business: Business;
  updateBusiness: (updatedBusiness: Business) => void;
  currentMonth: string;
}

const GoalTracker: React.FC<GoalTrackerProps> = ({
  business,
  updateBusiness,
  currentMonth
}) => {
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState<Partial<MonthlyGoal>>({ 
    title: '', 
    description: '', 
    completed: false, 
    month: currentMonth, 
    score: 0 
  });
  const [editingGoal, setEditingGoal] = useState<{month: string, goalId: number} | null>(null);
  const [editedGoal, setEditedGoal] = useState<Partial<MonthlyGoal>>({});
  const [activeMonth, setActiveMonth] = useState<string>(currentMonth);
  const [expandedMonths, setExpandedMonths] = useState<{[key: string]: boolean}>({});
  const [showCompleted, setShowCompleted] = useState(true);

  useEffect(() => {
    // Set the current month as expanded by default
    setExpandedMonths(prev => ({
      ...prev,
      [currentMonth]: true
    }));
    
    setNewGoal(prev => ({
      ...prev,
      month: currentMonth
    }));
  }, [currentMonth]);

  const handleAddGoal = () => {
    if (!business || !newGoal.title || !newGoal.month) return;
    
    const month = newGoal.month;
    const monthlyGoals = business.monthlyGoals || {};
    const monthGoals = monthlyGoals[month] || [];
    
    const goal: MonthlyGoal = {
      id: Math.max(0, ...(monthGoals.map((g: MonthlyGoal) => g.id) || [0])) + 1,
      title: newGoal.title || '',
      description: newGoal.description || '',
      completed: false,
      month,
      score: 0
    };
    
    const updatedMonthlyGoals = {
      ...monthlyGoals,
      [month]: [...monthGoals, goal]
    };
    
    const updatedBusiness = {
      ...business,
      monthlyGoals: updatedMonthlyGoals
    };
    
    updateBusiness(updatedBusiness);
    setNewGoal({ title: '', description: '', completed: false, month: currentMonth, score: 0 });
    setIsAddingGoal(false);
  };

  const handleEditGoal = (month: string, goalId: number) => {
    if (!business.monthlyGoals) return;
    
    const goal = business.monthlyGoals[month]?.find(g => g.id === goalId);
    if (!goal) return;
    
    setEditingGoal({ month, goalId });
    setEditedGoal({ ...goal });
  };

  const saveGoalEdit = () => {
    if (!business || !editingGoal || Object.keys(editedGoal).length === 0) return;
    
    const { month, goalId } = editingGoal;
    const monthlyGoals = { ...(business.monthlyGoals || {}) };
    const monthGoals = [...(monthlyGoals[month] || [])];
    
    const updatedMonthGoals = monthGoals.map((goal: MonthlyGoal) =>
      goal.id === goalId ? { ...goal, ...editedGoal } : goal
    );
    
    monthlyGoals[month] = updatedMonthGoals;
    
    updateBusiness({
      ...business,
      monthlyGoals
    });
    
    setEditingGoal(null);
    setEditedGoal({});
  };

  const cancelGoalEdit = () => {
    setEditingGoal(null);
    setEditedGoal({});
  };

  const handleDeleteGoal = (month: string, goalId: number) => {
    if (!business || !business.monthlyGoals) return;
    
    const monthlyGoals = { ...(business.monthlyGoals || {}) };
    const monthGoals = [...(monthlyGoals[month] || [])];
    
    const updatedMonthGoals = monthGoals.filter((goal: MonthlyGoal) => goal.id !== goalId);
    
    monthlyGoals[month] = updatedMonthGoals;
    
    updateBusiness({
      ...business,
      monthlyGoals
    });
  };

  const toggleGoalComplete = (month: string, goalId: number) => {
    if (!business || !business.monthlyGoals) return;
    
    const monthlyGoals = { ...(business.monthlyGoals || {}) };
    const monthGoals = [...(monthlyGoals[month] || [])];
    
    const updatedMonthGoals = monthGoals.map((goal: MonthlyGoal) =>
      goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
    );
    
    monthlyGoals[month] = updatedMonthGoals;
    
    updateBusiness({
      ...business,
      monthlyGoals
    });
  };

  const updateGoalScore = (month: string, goalId: number, score: number) => {
    if (!business || !business.monthlyGoals) return;
    
    const monthlyGoals = { ...(business.monthlyGoals || {}) };
    const monthGoals = [...(monthlyGoals[month] || [])];
    
    const updatedMonthGoals = monthGoals.map((goal: MonthlyGoal) =>
      goal.id === goalId ? { ...goal, score } : goal
    );
    
    monthlyGoals[month] = updatedMonthGoals;
    
    updateBusiness({
      ...business,
      monthlyGoals
    });
  };

  const toggleMonthExpand = (month: string) => {
    setExpandedMonths(prev => ({
      ...prev,
      [month]: !prev[month]
    }));
  };

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const getFilteredGoals = (month: string) => {
    if (!business.monthlyGoals || !business.monthlyGoals[month]) return [];
    
    const goals = business.monthlyGoals[month];
    
    if (!showCompleted) {
      return goals.filter(goal => !goal.completed);
    }
    
    return goals;
  };
  
  // Calculate monthly scores
  const calculateMonthScore = (month: string) => {
    if (!business.monthlyGoals || !business.monthlyGoals[month]) return 0;
    
    const goals = business.monthlyGoals[month];
    if (goals.length === 0) return 0;
    
    const totalScore = goals.reduce((sum, goal) => sum + goal.score, 0);
    return Math.round(totalScore / goals.length);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Goal Tracker</h2>
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center text-sm transition-colors"
          onClick={() => setIsAddingGoal(true)}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Goal
        </button>
      </div>

      {/* Goal Filters */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Month:</label>
            <select
              className="bg-white border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={activeMonth}
              onChange={(e) => setActiveMonth(e.target.value)}
            >
              <option value="All">All Months</option>
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showCompleted"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              checked={showCompleted}
              onChange={(e) => setShowCompleted(e.target.checked)}
            />
            <label htmlFor="showCompleted" className="ml-2 block text-sm text-gray-700">
              Show completed goals
            </label>
          </div>
          
          <div className="flex items-center">
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
      </div>
      
      {/* Goal Form */}
      {isAddingGoal && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Goal</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                placeholder="Goal title"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={newGoal.title}
                onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                placeholder="Goal description (optional)"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={newGoal.description || ''}
                onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={newGoal.month}
                onChange={(e) => setNewGoal({...newGoal, month: e.target.value})}
              >
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                onClick={handleAddGoal}
              >
                Add Goal
              </button>
              <button
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setIsAddingGoal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Monthly Goals */}
      <div className="space-y-4">
        {activeMonth === 'All' ? (
          // Show all months
          months.map(month => {
            const goals = business.monthlyGoals?.[month] || [];
            if (goals.length === 0) return null;
            
            const monthScore = calculateMonthScore(month);
            
            return (
              <div key={month} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div 
                  className="bg-indigo-50 p-4 border-b border-gray-200 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleMonthExpand(month)}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold mr-3">
                      {month.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{month}</h3>
                      <div className="text-sm text-gray-500">
                        {goals.length} goals, {goals.filter(g => g.completed).length} completed
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <div className="text-sm text-gray-500">Score</div>
                      <div className="text-lg font-bold text-indigo-600">{monthScore}/10</div>
                    </div>
                    <svg 
                      className={`w-5 h-5 text-gray-400 transition-transform ${expandedMonths[month] ? 'transform rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                {expandedMonths[month] && (
                  <div className="p-4">
                    <ul className="space-y-3">
                      {getFilteredGoals(month).map((goal) => (
                        <li 
                          key={goal.id} 
                          className={`p-4 rounded-lg border ${
                            editingGoal && editingGoal.month === month && editingGoal.goalId === goal.id 
                              ? 'border-indigo-300 bg-indigo-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {editingGoal && editingGoal.month === month && editingGoal.goalId === goal.id ? (
                            <div className="space-y-3">
                              <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                value={editedGoal.title || ''}
                                onChange={(e) => setEditedGoal({...editedGoal, title: e.target.value})}
                              />
                              <textarea
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                value={editedGoal.description || ''}
                                onChange={(e) => setEditedGoal({...editedGoal, description: e.target.value})}
                                rows={2}
                              />
                              <div className="flex gap-2">
                                <button
                                  className="bg-indigo-600 text-white px-3 py-1 rounded text-sm"
                                  onClick={saveGoalEdit}
                                >
                                  Save
                                </button>
                                <button
                                  className="text-gray-600 px-3 py-1 rounded text-sm border border-gray-300"
                                  onClick={cancelGoalEdit}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3 flex-grow">
                                <div className="flex-shrink-0 pt-0.5">
                                  <input 
                                    type="checkbox" 
                                    checked={goal.completed}
                                    onChange={() => toggleGoalComplete(month, goal.id)}
                                    className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                                  />
                                </div>
                                <div>
                                  <h4 className={`font-medium ${goal.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                    {goal.title}
                                  </h4>
                                  {goal.description && (
                                    <p className="text-sm text-gray-500 mt-1">{goal.description}</p>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex gap-4 items-start">
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 mb-1">Score</label>
                                  <select 
                                    className="border border-gray-300 rounded p-1 text-sm"
                                    value={goal.score}
                                    onChange={(e) => updateGoalScore(month, goal.id, parseInt(e.target.value))}
                                  >
                                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => (
                                      <option key={score} value={score}>{score}</option>
                                    ))}
                                  </select>
                                </div>
                                
                                <div className="flex gap-1">
                                  <button
                                    className="text-gray-400 hover:text-indigo-600 transition-colors"
                                    onClick={() => handleEditGoal(month, goal.id)}
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                  </button>
                                  <button
                                    className="text-gray-400 hover:text-red-600 transition-colors"
                                    onClick={() => handleDeleteGoal(month, goal.id)}
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </li>
                      ))}
                      
                      {getFilteredGoals(month).length === 0 && (
                        <div className="text-center py-6 text-gray-500">
                          {showCompleted ? 'No goals for this month' : 'No incomplete goals for this month'}
                        </div>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            );
          }).filter(Boolean)
        ) : (
          // Show only the selected month
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="bg-indigo-50 p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold mr-3">
                    {activeMonth.charAt(0)}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">{activeMonth}</h3>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Score</div>
                  <div className="text-lg font-bold text-indigo-600">{calculateMonthScore(activeMonth)}/10</div>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <ul className="space-y-3">
                {getFilteredGoals(activeMonth).length > 0 ? (
                  getFilteredGoals(activeMonth).map((goal) => (
                    <li 
                      key={goal.id} 
                      className={`p-4 rounded-lg border ${
                        editingGoal && editingGoal.month === activeMonth && editingGoal.goalId === goal.id 
                          ? 'border-indigo-300 bg-indigo-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {editingGoal && editingGoal.month === activeMonth && editingGoal.goalId === goal.id ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            value={editedGoal.title || ''}
                            onChange={(e) => setEditedGoal({...editedGoal, title: e.target.value})}
                          />
                          <textarea
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            value={editedGoal.description || ''}
                            onChange={(e) => setEditedGoal({...editedGoal, description: e.target.value})}
                            rows={2}
                          />
                          <div className="flex gap-2">
                            <button
                              className="bg-indigo-600 text-white px-3 py-1 rounded text-sm"
                              onClick={saveGoalEdit}
                            >
                              Save
                            </button>
                            <button
                              className="text-gray-600 px-3 py-1 rounded text-sm border border-gray-300"
                              onClick={cancelGoalEdit}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-grow">
                            <div className="flex-shrink-0 pt-0.5">
                              <input 
                                type="checkbox" 
                                checked={goal.completed}
                                onChange={() => toggleGoalComplete(activeMonth, goal.id)}
                                className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                              />
                            </div>
                            <div>
                              <h4 className={`font-medium ${goal.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                {goal.title}
                              </h4>
                              {goal.description && (
                                <p className="text-sm text-gray-500 mt-1">{goal.description}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-4 items-start">
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Score</label>
                              <select 
                                className="border border-gray-300 rounded p-1 text-sm"
                                value={goal.score}
                                onChange={(e) => updateGoalScore(activeMonth, goal.id, parseInt(e.target.value))}
                              >
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => (
                                  <option key={score} value={score}>{score}</option>
                                ))}
                              </select>
                            </div>
                            
                            <div className="flex gap-1">
                              <button
                                className="text-gray-400 hover:text-indigo-600 transition-colors"
                                onClick={() => handleEditGoal(activeMonth, goal.id)}
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                              </button>
                              <button
                                className="text-gray-400 hover:text-red-600 transition-colors"
                                onClick={() => handleDeleteGoal(activeMonth, goal.id)}
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </li>
                  ))
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No goals for {activeMonth}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Add your first goal to start tracking your progress
                    </p>
                    <div className="mt-6">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() => {
                          setNewGoal(prev => ({ ...prev, month: activeMonth }));
                          setIsAddingGoal(true);
                        }}
                      >
                        <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add a goal
                      </button>
                    </div>
                  </div>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalTracker; 