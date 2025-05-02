import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Business, BusinessTask, MonthlyGoal } from '@/types';
import CRMDashboard from './CRM/CRMDashboard';
import { saveBusinesses } from '@/utils/storage';

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
  const [isAddingBusiness, setIsAddingBusiness] = useState(false);
  const [newBusiness, setNewBusiness] = useState<Partial<Business>>({ name: '', tasks: [] });
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'goals' | 'analytics'>('overview');
  
  useEffect(() => {
    if (businesses.length > 0) {
      setActiveBusinessId(businesses[0].id);
    } else {
      setActiveBusinessId(null);
    }
  }, [businesses]);

  const activeBusiness = businesses.find(b => b.id === activeBusinessId) || null;
  
  const handleBusinessChange = (updatedBusinesses: Business[]) => {
    onBusinessUpdate(updatedBusinesses);
    saveBusinesses(userId, updatedBusinesses);
  };

  const handleAddBusiness = () => {
    if (!newBusiness.name || newBusiness.name.trim() === '') return;
    
    const businessToAdd: Business = {
      id: Date.now(),
      name: newBusiness.name || '',
      tasks: [],
      monthlyGoals: {
        [currentMonth]: []
      },
      metrics: {}
    };
    
    const updatedBusinesses = [...businesses, businessToAdd];
    handleBusinessChange(updatedBusinesses);
    setNewBusiness({ name: '', tasks: [] });
    setIsAddingBusiness(false);
    setActiveBusinessId(businessToAdd.id);
  };

  return (
    <div className="bg-gray-50 rounded-xl overflow-hidden shadow-lg border border-gray-200">
      {/* Header Section */}
      <div className="bg-white p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Business Manager</h2>
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-all"
            onClick={() => setIsAddingBusiness(true)}
          >
            <svg 
              className="w-4 h-4 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Business
          </button>
        </div>

        {/* Business Selector - Modern Tab Style */}
        {businesses.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {businesses.map(business => (
              <button
                key={business.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeBusinessId === business.id 
                    ? 'bg-indigo-50 text-indigo-700 border-2 border-indigo-500'
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-indigo-300'
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
                  <div className="w-6 h-6 bg-indigo-100 rounded-md flex items-center justify-center text-xs font-semibold text-indigo-700">
                    {business.name.charAt(0)}
                  </div>
                )}
                <span className="font-medium">{business.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center p-6 bg-gray-50 rounded-lg mt-4">
            No businesses added yet. Add your first business to get started.
          </div>
        )}
      </div>

      {/* New Business Form */}
      {isAddingBusiness && (
        <div className="p-6 bg-white border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Add New Business</h3>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Business name"
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={newBusiness.name}
              onChange={(e) => setNewBusiness({...newBusiness, name: e.target.value})}
            />
            <div className="flex gap-2">
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                onClick={handleAddBusiness}
              >
                Add
              </button>
              <button
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setIsAddingBusiness(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CRM Dashboard */}
      {activeBusiness && (
        <CRMDashboard 
          business={activeBusiness} 
          updateBusiness={(updatedBusiness) => handleBusinessChange([updatedBusiness])} 
          userId={userId}
          currentMonth={currentMonth}
        />
      )}
    </div>
  );
};

export default BusinessManager; 