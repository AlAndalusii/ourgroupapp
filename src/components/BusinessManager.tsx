import { useState, useEffect } from 'react';
import Image from 'next/image';
import BusinessLogo from './BusinessLogo';
import { Business, BusinessTask, MonthlyGoal } from '@/components/types';

interface BusinessManagerProps {
  businesses: Business[];
  onBusinessUpdate: (updatedBusinesses: Business[]) => void;
  userId: number;
  currentMonth?: string;
}

const BusinessManager: React.FC<BusinessManagerProps> = ({ 
  businesses, 
  onBusinessUpdate,
  userId,
  currentMonth = 'April'
}) => {
  const [activeBusinessId, setActiveBusinessId] = useState<number | null>(businesses.length > 0 ? businesses[0].id : null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState<Partial<BusinessTask>>({ title: '', completed: false, isWeekly: false });
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState<Partial<MonthlyGoal>>({ title: '', completed: false, month: currentMonth, score: 0 });
  const [isAddingBusiness, setIsAddingBusiness] = useState(false);
  const [newBusiness, setNewBusiness] = useState<Partial<Business>>({ name: '', tasks: [] });
  const [activeMonth, setActiveMonth] = useState<string>(currentMonth);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    tasks: true,
    weeklyTasks: true,
    goals: true
  });
  const [editingTask, setEditingTask] = useState<BusinessTask | null>(null);
  const [editedTask, setEditedTask] = useState<Partial<BusinessTask>>({});
  const [taskFilter, setTaskFilter] = useState<'all' | 'weekly' | 'monthly'>('all');

  useEffect(() => {
    setActiveMonth(currentMonth);
    setNewGoal(prev => ({...prev, month: currentMonth}));
  }, [currentMonth]);

  useEffect(() => {
    if (businesses.length > 0) {
      setActiveBusinessId(businesses[0].id);
    } else {
      setActiveBusinessId(null);
    }
  }, [businesses]);

  const activeBusiness = businesses.find(b => b.id === activeBusinessId) || null;
  
  const updateBusiness = (updatedBusiness: Business) => {
    const updatedBusinesses = businesses.map(b => 
      b.id === updatedBusiness.id ? updatedBusiness : b
    );
    onBusinessUpdate(updatedBusinesses);
  };

  const handleLogoChange = (businessId: number, logoUrl: string) => {
    const business = businesses.find(b => b.id === businessId);
    if (business) {
      const updatedBusiness = { ...business, logo: logoUrl };
      updateBusiness(updatedBusiness);
    }
  };

  const handleAddTask = () => {
    if (!activeBusiness || !newTask.title) return;
    
    const task: BusinessTask = {
      id: Math.max(0, ...activeBusiness.tasks.map((t: BusinessTask) => t.id), 0) + 1,
      title: newTask.title,
      description: newTask.description || '',
      completed: false,
      dueDate: newTask.dueDate,
      isWeekly: newTask.isWeekly || false
    };
    
    const updatedBusiness = {
      ...activeBusiness,
      tasks: [...activeBusiness.tasks, task]
    };
    
    updateBusiness(updatedBusiness);
    setNewTask({ title: '', completed: false, isWeekly: false });
    setIsAddingTask(false);
  };

  const handleToggleTaskComplete = (taskId: number) => {
    if (!activeBusiness) return;
    
    const updatedTasks = activeBusiness.tasks.map((task: BusinessTask) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    
    updateBusiness({
      ...activeBusiness,
      tasks: updatedTasks
    });
  };

  const handleEditTask = (task: BusinessTask) => {
    setEditingTask(task);
    setEditedTask({ ...task });
  };

  const saveTaskEdit = () => {
    if (!activeBusiness || !editingTask || Object.keys(editedTask).length === 0) return;
    
    const updatedTasks = activeBusiness.tasks.map((task: BusinessTask) =>
      task.id === editingTask.id ? { ...task, ...editedTask } : task
    );
    
    updateBusiness({
      ...activeBusiness,
      tasks: updatedTasks
    });
    
    setEditingTask(null);
    setEditedTask({});
  };

  const cancelTaskEdit = () => {
    setEditingTask(null);
    setEditedTask({});
  };

  const handleAddGoal = () => {
    if (!activeBusiness || !newGoal.title || !newGoal.month) return;
    
    const month = newGoal.month;
    const monthlyGoals = activeBusiness.monthlyGoals || {};
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
      ...activeBusiness,
      monthlyGoals: updatedMonthlyGoals
    };
    
    updateBusiness(updatedBusiness);
    setNewGoal({ title: '', completed: false, month: 'June', score: 0 });
    setIsAddingGoal(false);
  };

  const handleAddBusiness = () => {
    if (!newBusiness.name) return;
    
    const business: Business = {
      id: Math.max(0, ...businesses.map(b => b.id), 0) + 1,
      name: newBusiness.name,
      tasks: [],
      monthlyGoals: { 'June': [] },
      metrics: {}
    };
    
    onBusinessUpdate([...businesses, business]);
    setNewBusiness({ name: '', tasks: [] });
    setIsAddingBusiness(false);
    setActiveBusinessId(business.id);
  };

  const toggleSection = (section: string) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  const updateGoalScore = (month: string, goalId: number, score: number) => {
    if (!activeBusiness || !activeBusiness.monthlyGoals) return;
    
    const monthlyGoals = { ...activeBusiness.monthlyGoals };
    const monthGoals = [...(monthlyGoals[month] || [])];
    
    const updatedMonthGoals = monthGoals.map((goal: MonthlyGoal) =>
      goal.id === goalId ? { ...goal, score } : goal
    );
    
    monthlyGoals[month] = updatedMonthGoals;
    
    updateBusiness({
      ...activeBusiness,
      monthlyGoals
    });
  };

  const updateMetric = (key: string, value: string | number) => {
    if (!activeBusiness) return;
    
    const updatedMetrics = {
      ...(activeBusiness.metrics || {}),
      [key]: value
    };
    
    updateBusiness({
      ...activeBusiness,
      metrics: updatedMetrics
    });
  };

  const getWeeklyTasks = () => {
    return activeBusiness?.tasks.filter(task => task.isWeekly) || [];
  };

  const getMonthlyTasks = () => {
    return activeBusiness?.tasks.filter(task => !task.isWeekly) || [];
  };

  const getFilteredTasks = () => {
    if (!activeBusiness) return [];
    switch (taskFilter) {
      case 'weekly':
        return getWeeklyTasks();
      case 'monthly':
        return getMonthlyTasks();
      default:
        return activeBusiness.tasks;
    }
  };

  const months = ['All', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Custom metrics based on userId
  const renderCustomMetrics = () => {
    if (!activeBusiness) return null;
    
    const metrics = activeBusiness.metrics || {};
    
    if (userId === 1 && activeBusiness.name === 'ThewebTailors') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Targets for Clients</h4>
            <div className="flex items-center justify-between">
              <input
                type="number"
                className="w-20 p-2 text-xl font-bold text-primary-700 border border-gray-200 rounded"
                value={metrics.clientTarget || 0}
                onChange={(e) => updateMetric('clientTarget', parseInt(e.target.value) || 0)}
              />
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-500 mr-2">Current:</span>
                <input
                  type="number"
                  className="w-20 p-2 text-lg font-medium text-gray-700 border border-gray-200 rounded"
                  value={metrics.currentClients || 0}
                  onChange={(e) => updateMetric('currentClients', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (userId === 2 && activeBusiness.name === 'Mande') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Launch Date</h4>
            <input
              type="date"
              className="w-full p-2 text-lg font-medium text-primary-700 border border-gray-200 rounded"
              value={metrics.launchDate || ''}
              onChange={(e) => updateMetric('launchDate', e.target.value)}
            />
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Shoes Sold</h4>
            <input
              type="number"
              className="w-full p-2 text-xl font-bold text-primary-700 border border-gray-200 rounded"
              value={metrics.shoesSold || 0}
              onChange={(e) => updateMetric('shoesSold', parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-primary-800">Business Manager</h2>
        <button
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center"
          onClick={() => setIsAddingBusiness(true)}
        >
          <svg 
            className="w-4 h-4 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 4v16m8-8H4" 
            />
          </svg>
          Add Business
        </button>
      </div>

      {/* Business Selector */}
      {businesses.length > 0 ? (
        <div className="flex flex-wrap gap-3 mb-6">
          {businesses.map(business => (
            <button
              key={business.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                activeBusinessId === business.id 
                  ? 'bg-primary-50 border-primary-500 text-primary-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-primary-300'
              }`}
              onClick={() => setActiveBusinessId(business.id)}
            >
              {business.logo ? (
                <div className="w-6 h-6 relative">
                  <Image 
                    src={business.logo} 
                    alt={business.name} 
                    width={24} 
                    height={24}
                    className="object-contain" 
                  />
                </div>
              ) : (
                <div className="w-6 h-6 bg-gray-200 rounded-md flex items-center justify-center text-xs">
                  {business.name.charAt(0)}
                </div>
              )}
              <span>{business.name}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 text-center p-6 bg-gray-50 rounded-lg">
          No businesses added yet. Add your first business to get started.
        </div>
      )}

      {/* Active Business Section */}
      {activeBusiness && (
        <div className="grid grid-cols-1 gap-6">
          {/* Business Info */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="mr-4">
                  <BusinessLogo 
                    businessName={activeBusiness.name}
                    logoUrl={activeBusiness.logo}
                    onLogoChange={(logo) => handleLogoChange(activeBusiness.id, logo)}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{activeBusiness.name}</h3>
                  <div className="text-sm text-gray-600 mt-1">
                    <p>Tasks: {activeBusiness.tasks.length} | Completed: {activeBusiness.tasks.filter((t: BusinessTask) => t.completed).length}</p>
                    <p>Monthly Goals: {
                      Object.values(activeBusiness.monthlyGoals || {})
                        .reduce((sum: number, goals) => sum + (goals as MonthlyGoal[]).length, 0)
                    }</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Custom Metrics Section */}
          {renderCustomMetrics()}

          {/* Month filter selector */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Month:</label>
                <div className="flex items-center space-x-2">
                  <select
                    className="w-full md:w-48 p-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    value={activeMonth}
                    onChange={(e) => setActiveMonth(e.target.value)}
                  >
                    {months.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                  <button 
                    onClick={() => setActiveMonth(currentMonth)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${activeMonth === currentMonth ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    Current Month
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter Tasks:</label>
                <div className="flex space-x-2">
                  <button 
                    className={`px-3 py-2 rounded-lg ${taskFilter === 'all' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                    onClick={() => setTaskFilter('all')}
                  >
                    All
                  </button>
                  <button 
                    className={`px-3 py-2 rounded-lg ${taskFilter === 'weekly' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                    onClick={() => setTaskFilter('weekly')}
                  >
                    Weekly
                  </button>
                  <button 
                    className={`px-3 py-2 rounded-lg ${taskFilter === 'monthly' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                    onClick={() => setTaskFilter('monthly')}
                  >
                    Monthly
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tasks Section */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center cursor-pointer"
                 onClick={() => toggleSection('tasks')}>
              <h3 className="text-lg font-bold text-primary-800 flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {taskFilter === 'all' ? 'All Tasks' : taskFilter === 'weekly' ? 'Weekly Tasks' : 'Monthly Tasks'}
              </h3>
              <div className="flex items-center">
                <button
                  className="text-primary-600 hover:text-primary-800 mr-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAddingTask(true);
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
                <svg 
                  className={`w-5 h-5 transition-transform ${expandedSections['tasks'] ? 'transform rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {expandedSections['tasks'] && (
              <div className="p-4">
                {isAddingTask ? (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <input
                      type="text"
                      placeholder="Task title"
                      className="w-full p-2 mb-2 border border-gray-300 rounded"
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    />
                    <input
                      type="text"
                      placeholder="Description (optional)"
                      className="w-full p-2 mb-2 border border-gray-300 rounded"
                      value={newTask.description || ''}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    />
                    <div className="flex items-center mb-2">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-primary-600"
                          checked={newTask.isWeekly || false}
                          onChange={(e) => setNewTask({...newTask, isWeekly: e.target.checked})}
                        />
                        <span className="ml-2 text-gray-700">Weekly Task</span>
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="bg-primary-600 text-white px-3 py-1 rounded"
                        onClick={handleAddTask}
                      >
                        Add
                      </button>
                      <button
                        className="text-gray-600 px-3 py-1 rounded"
                        onClick={() => setIsAddingTask(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}
                
                <ul className="space-y-2 max-h-64 overflow-y-auto">
                  {getFilteredTasks().length > 0 ? (
                    getFilteredTasks().map((task: BusinessTask) => (
                      <li 
                        key={task.id} 
                        className="flex items-start gap-2 p-3 hover:bg-gray-50 rounded border border-gray-100"
                      >
                        {editingTask && editingTask.id === task.id ? (
                          <div className="w-full space-y-2">
                            <input
                              type="text"
                              className="w-full p-2 border border-gray-300 rounded"
                              value={editedTask.title || ''}
                              onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
                            />
                            <textarea
                              className="w-full p-2 border border-gray-300 rounded"
                              value={editedTask.description || ''}
                              onChange={(e) => setEditedTask({...editedTask, description: e.target.value})}
                            />
                            <div className="flex items-center">
                              <label className="inline-flex items-center">
                                <input
                                  type="checkbox"
                                  className="form-checkbox h-5 w-5 text-primary-600"
                                  checked={editedTask.isWeekly || false}
                                  onChange={(e) => setEditedTask({...editedTask, isWeekly: e.target.checked})}
                                />
                                <span className="ml-2 text-gray-700">Weekly Task</span>
                              </label>
                            </div>
                            <div className="flex gap-2">
                              <button
                                className="bg-primary-600 text-white px-3 py-1 rounded"
                                onClick={saveTaskEdit}
                              >
                                Save
                              </button>
                              <button
                                className="text-gray-600 px-3 py-1 rounded"
                                onClick={cancelTaskEdit}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex-shrink-0 pt-0.5">
                              <input 
                                type="checkbox" 
                                checked={task.completed}
                                onChange={() => handleToggleTaskComplete(task.id)}
                                className="h-4 w-4 text-primary-600 rounded"
                              />
                            </div>
                            <div className="flex-grow">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className={`font-medium ${task.completed ? 'line-through text-gray-400' : ''}`}>
                                    {task.title}
                                  </p>
                                  {task.description && (
                                    <p className="text-sm text-gray-500">{task.description}</p>
                                  )}
                                  <div className="mt-1">
                                    <span className={`text-xs px-2 py-1 rounded-full ${task.isWeekly ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                                      {task.isWeekly ? 'Weekly' : 'Monthly'}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  className="text-gray-400 hover:text-primary-600 transition-colors"
                                  onClick={() => handleEditTask(task)}
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center p-4">No tasks yet</p>
                  )}
                </ul>
              </div>
            )}
          </div>
          
          {/* Monthly Goals Section */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center cursor-pointer"
                 onClick={() => toggleSection('goals')}>
              <h3 className="text-lg font-bold text-primary-800 flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Monthly Goals
              </h3>
              <div className="flex items-center">
                <button
                  className="text-primary-600 hover:text-primary-800 mr-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAddingGoal(true);
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
                <svg 
                  className={`w-5 h-5 transition-transform ${expandedSections['goals'] ? 'transform rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {expandedSections['goals'] && (
              <div className="p-4">
                {isAddingGoal ? (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <input
                      type="text"
                      placeholder="Goal title"
                      className="w-full p-2 mb-2 border border-gray-300 rounded"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                    />
                    <input
                      type="text"
                      placeholder="Description (optional)"
                      className="w-full p-2 mb-2 border border-gray-300 rounded"
                      value={newGoal.description || ''}
                      onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                    />
                    <select
                      className="w-full p-2 mb-2 border border-gray-300 rounded"
                      value={newGoal.month}
                      onChange={(e) => setNewGoal({...newGoal, month: e.target.value})}
                    >
                      {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <button
                        className="bg-primary-600 text-white px-3 py-1 rounded"
                        onClick={handleAddGoal}
                      >
                        Add
                      </button>
                      <button
                        className="text-gray-600 px-3 py-1 rounded"
                        onClick={() => setIsAddingGoal(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}
                
                <div className="space-y-6 max-h-96 overflow-y-auto">
                  {activeBusiness.monthlyGoals ? (
                    Object.entries(activeBusiness.monthlyGoals)
                      .filter(([month, _]) => activeMonth === 'All' || month === activeMonth)
                      .map(([month, goals]) => {
                        const typedGoals = goals as MonthlyGoal[];
                        return typedGoals.length > 0 && (
                          <div key={month} className="border border-gray-100 rounded-lg overflow-hidden">
                            <div className="bg-primary-50 p-3 font-medium text-primary-800 flex items-center justify-between cursor-pointer"
                                 onClick={() => toggleSection(`month-${month}`)}>
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold mr-2">
                                  {month.charAt(0)}
                                </div>
                                {month}
                              </div>
                              <svg 
                                className={`w-5 h-5 transition-transform ${expandedSections[`month-${month}`] ? 'transform rotate-180' : ''}`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24" 
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                            
                            {expandedSections[`month-${month}`] && (
                              <ul className="divide-y divide-gray-100">
                                {typedGoals.map(goal => (
                                  <li key={goal.id} className="p-3 hover:bg-gray-50">
                                    <div className="flex justify-between items-start">
                                      <div className="flex-grow">
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
                                            onChange={(e) => updateGoalScore(month, goal.id, parseInt(e.target.value))}
                                          >
                                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => (
                                              <option key={score} value={score}>{score}</option>
                                            ))}
                                          </select>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      })
                  ) : (
                    <p className="text-gray-500 text-center p-4">No monthly goals yet</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Business Modal */}
      {isAddingBusiness && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 max-w-full">
            <h3 className="text-xl font-bold mb-4">Add New Business</h3>
            <input
              type="text"
              placeholder="Business name"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
              value={newBusiness.name}
              onChange={(e) => setNewBusiness({...newBusiness, name: e.target.value})}
            />
            <div className="flex justify-end gap-2">
              <button
                className="text-gray-600 px-4 py-2 rounded"
                onClick={() => setIsAddingBusiness(false)}
              >
                Cancel
              </button>
              <button
                className="bg-primary-600 text-white px-4 py-2 rounded"
                onClick={handleAddBusiness}
              >
                Add Business
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessManager; 