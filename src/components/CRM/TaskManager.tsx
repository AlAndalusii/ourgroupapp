import { useState } from 'react';
import { Business, BusinessTask } from '@/components/types';

interface TaskManagerProps {
  business: Business;
  updateBusiness: (updatedBusiness: Business) => void;
}

const TaskManager: React.FC<TaskManagerProps> = ({
  business,
  updateBusiness
}) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState<Partial<BusinessTask>>({ 
    title: '', 
    description: '', 
    completed: false, 
    isWeekly: false 
  });
  const [editingTask, setEditingTask] = useState<BusinessTask | null>(null);
  const [editedTask, setEditedTask] = useState<Partial<BusinessTask>>({});
  const [taskFilter, setTaskFilter] = useState<'all' | 'weekly' | 'monthly'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddTask = () => {
    if (!business || !newTask.title) return;
    
    const task: BusinessTask = {
      id: Math.max(0, ...business.tasks.map((t: BusinessTask) => t.id), 0) + 1,
      title: newTask.title,
      description: newTask.description || '',
      completed: false,
      dueDate: newTask.dueDate,
      isWeekly: newTask.isWeekly || false
    };
    
    const updatedBusiness = {
      ...business,
      tasks: [...business.tasks, task]
    };
    
    updateBusiness(updatedBusiness);
    setNewTask({ title: '', description: '', completed: false, isWeekly: false });
    setIsAddingTask(false);
  };

  const handleToggleTaskComplete = (taskId: number) => {
    if (!business) return;
    
    const updatedTasks = business.tasks.map((task: BusinessTask) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    
    updateBusiness({
      ...business,
      tasks: updatedTasks
    });
  };

  const handleEditTask = (task: BusinessTask) => {
    setEditingTask(task);
    setEditedTask({ ...task });
  };

  const saveTaskEdit = () => {
    if (!business || !editingTask || Object.keys(editedTask).length === 0) return;
    
    const updatedTasks = business.tasks.map((task: BusinessTask) =>
      task.id === editingTask.id ? { ...task, ...editedTask } : task
    );
    
    updateBusiness({
      ...business,
      tasks: updatedTasks
    });
    
    setEditingTask(null);
    setEditedTask({});
  };

  const cancelTaskEdit = () => {
    setEditingTask(null);
    setEditedTask({});
  };

  const handleDeleteTask = (taskId: number) => {
    if (!business) return;
    
    const updatedTasks = business.tasks.filter((task: BusinessTask) => task.id !== taskId);
    
    updateBusiness({
      ...business,
      tasks: updatedTasks
    });
  };

  const getWeeklyTasks = () => {
    return business.tasks.filter(task => task.isWeekly) || [];
  };

  const getMonthlyTasks = () => {
    return business.tasks.filter(task => !task.isWeekly) || [];
  };

  const getFilteredTasks = () => {
    let filteredTasks;
    
    switch (taskFilter) {
      case 'weekly':
        filteredTasks = getWeeklyTasks();
        break;
      case 'monthly':
        filteredTasks = getMonthlyTasks();
        break;
      default:
        filteredTasks = business.tasks;
    }
    
    // Apply search filter if query exists
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filteredTasks = filteredTasks.filter(task => 
        task.title.toLowerCase().includes(query) || 
        (task.description && task.description.toLowerCase().includes(query))
      );
    }
    
    return filteredTasks;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Task Manager</h2>
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center text-sm transition-colors"
          onClick={() => setIsAddingTask(true)}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Task
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        {/* Task Filters */}
        <div className="bg-gray-50 p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex space-x-2">
              <button 
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${taskFilter === 'all' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setTaskFilter('all')}
              >
                All Tasks
              </button>
              <button 
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${taskFilter === 'weekly' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setTaskFilter('weekly')}
              >
                Weekly
              </button>
              <button 
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${taskFilter === 'monthly' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setTaskFilter('monthly')}
              >
                Monthly
              </button>
            </div>
            
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search tasks..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {/* Task Form */}
        {isAddingTask && (
          <div className="p-4 border-b border-gray-200 bg-indigo-50">
            <h3 className="text-lg font-bold text-indigo-800 mb-4">Add New Task</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  placeholder="Task title"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  placeholder="Task description (optional)"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={newTask.description || ''}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date (Optional)</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={newTask.dueDate || ''}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isWeekly"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={newTask.isWeekly || false}
                  onChange={(e) => setNewTask({...newTask, isWeekly: e.target.checked})}
                />
                <label htmlFor="isWeekly" className="ml-2 block text-sm text-gray-700">
                  Weekly recurring task
                </label>
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  onClick={handleAddTask}
                >
                  Add Task
                </button>
                <button
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setIsAddingTask(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Task List */}
        <div className="p-4">
          <div className="mb-2 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              {taskFilter === 'all' ? 'All Tasks' : taskFilter === 'weekly' ? 'Weekly Tasks' : 'Monthly Tasks'}
            </h3>
            <span className="text-sm text-gray-500">
              {getFilteredTasks().length} tasks, {getFilteredTasks().filter(t => t.completed).length} completed
            </span>
          </div>
          
          <ul className="space-y-3 max-h-[calc(100vh-26rem)] overflow-y-auto">
            {getFilteredTasks().length > 0 ? (
              getFilteredTasks().map((task: BusinessTask) => (
                <li 
                  key={task.id} 
                  className={`p-4 rounded-lg border ${
                    editingTask && editingTask.id === task.id 
                      ? 'border-indigo-300 bg-indigo-50' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  } transition-all`}
                >
                  {editingTask && editingTask.id === task.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        value={editedTask.title || ''}
                        onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
                      />
                      <textarea
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        value={editedTask.description || ''}
                        onChange={(e) => setEditedTask({...editedTask, description: e.target.value})}
                        rows={2}
                      />
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`edit-isWeekly-${task.id}`}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={editedTask.isWeekly || false}
                          onChange={(e) => setEditedTask({...editedTask, isWeekly: e.target.checked})}
                        />
                        <label htmlFor={`edit-isWeekly-${task.id}`} className="ml-2 block text-sm text-gray-700">
                          Weekly recurring task
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="bg-indigo-600 text-white px-3 py-1 rounded text-sm"
                          onClick={saveTaskEdit}
                        >
                          Save
                        </button>
                        <button
                          className="text-gray-600 px-3 py-1 rounded text-sm border border-gray-300"
                          onClick={cancelTaskEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 pt-0.5">
                        <input 
                          type="checkbox" 
                          checked={task.completed}
                          onChange={() => handleToggleTaskComplete(task.id)}
                          className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                          <div>
                            <h4 className={`font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                              {task.title}
                            </h4>
                            {task.description && (
                              <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                            )}
                            <div className="mt-2 flex flex-wrap gap-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                task.isWeekly 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-purple-100 text-purple-800'
                              }`}>
                                {task.isWeekly ? 'Weekly' : 'Monthly'}
                              </span>
                              {task.dueDate && (
                                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                                  Due: {new Date(task.dueDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3 md:mt-0">
                            <button
                              className="text-gray-400 hover:text-indigo-600 transition-colors"
                              onClick={() => handleEditTask(task)}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button
                              className="text-gray-400 hover:text-red-600 transition-colors"
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              ))
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No tasks found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchQuery 
                    ? `No tasks match your search "${searchQuery}"` 
                    : `No ${taskFilter === 'weekly' ? 'weekly' : taskFilter === 'monthly' ? 'monthly' : ''} tasks yet`
                  }
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => setIsAddingTask(true)}
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add a task
                  </button>
                </div>
              </div>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TaskManager; 