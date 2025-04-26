interface Goal {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  isOptional?: boolean;
  score?: number;
  month?: string;
}

interface GoalListProps {
  goals: Goal[];
  title: string;
  description: string;
  showScores?: boolean;
  onEditGoal?: (goal: Goal) => void;
}

export default function GoalList({ goals, title, description, showScores = false, onEditGoal }: GoalListProps) {
  const completedGoals = goals.filter(goal => goal.completed);
  const completionPercentage = Math.round((completedGoals.length / goals.length) * 100) || 0;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{title}</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{description}</p>
          </div>
          <div className="flex-shrink-0 bg-primary-50 dark:bg-primary-900/30 rounded-full p-3">
            <div className="h-16 w-16 rounded-full flex items-center justify-center border-4 border-primary-100 dark:border-primary-800 bg-white dark:bg-gray-800">
              <div className="text-center">
                <span className="block text-xl font-bold text-primary-600 dark:text-primary-400">{completionPercentage}%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Progress: {completedGoals.length} of {goals.length} goals completed
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-primary-600 dark:bg-primary-500 h-3 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid gap-4 md:grid-cols-2">
          {goals.map(goal => (
            <div 
              key={goal.id}
              className={`p-5 rounded-lg transition-all duration-200 hover:shadow-md ${
                goal.completed 
                  ? 'bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-700' 
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex space-x-4">
                <div className={`mt-0.5 flex-shrink-0 h-6 w-6 rounded-full ${
                  goal.completed 
                    ? 'bg-success-500 text-white' 
                    : 'border-2 border-gray-300 dark:border-gray-600'
                }`}>
                  {goal.completed && (
                    <svg className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className={`text-lg font-semibold ${
                      goal.completed ? 'text-success-700 dark:text-success-400' : 'text-gray-800 dark:text-white'
                    }`}>
                      {goal.title}
                    </h3>
                    <div className="flex space-x-1">
                      {goal.isOptional && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 flex items-center">
                          Optional
                        </span>
                      )}
                      {onEditGoal && (
                        <button
                          onClick={() => onEditGoal(goal)}
                          className="ml-2 p-1 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-full transition-colors"
                          title="Edit goal"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
                    {goal.description}
                  </p>
                  {showScores && goal.score !== undefined && (
                    <div className="mt-3">
                      <div className={`inline-block text-sm font-medium rounded-full px-3 py-1 ${
                        goal.score >= 7
                          ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                          : goal.score >= 4
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                          : 'bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-300'
                      }`}>
                        Score: {goal.score}/10
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {goals.length === 0 && (
          <div className="text-center py-10">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No goals</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new goal.</p>
          </div>
        )}
      </div>
    </div>
  );
} 