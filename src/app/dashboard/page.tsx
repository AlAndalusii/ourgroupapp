'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';
import UserSelector from '@/components/UserSelector';
import UserDashboard from '@/components/UserDashboard';
import UserSelectionPage from '@/components/UserSelectionPage';
import StorageDebug from '@/components/StorageDebug';

// Define our users
const USERS = [
  { id: 1, name: 'Zakariya', color: 'primary' },
  { id: 2, name: 'Fatty', color: 'primary' },
  { id: 3, name: 'Abdullahi', color: 'primary' },
];

export default function Dashboard() {
  const searchParams = useSearchParams();
  const userIdParam = searchParams?.get('userId');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(
    userIdParam ? parseInt(userIdParam, 10) : null
  );

  useEffect(() => {
    if (userIdParam) {
      const userId = parseInt(userIdParam, 10);
      if (!isNaN(userId) && userId >= 1 && userId <= 3) {
        setSelectedUserId(userId);
        console.log('Selected user ID:', userId);
      }
    }
  }, [userIdParam]);

  const handleUserChange = (userId: number) => {
    setSelectedUserId(userId);
    // Update URL without reload
    window.history.pushState({}, '', `/dashboard?userId=${userId}`);
  };

  const selectedUser = USERS.find(user => user.id === selectedUserId);

  console.log('Dashboard rendering with selectedUserId:', selectedUserId);

  // If no user is selected, show the selection page
  if (selectedUserId === null) {
    return <UserSelectionPage />;
  }

  // If a user is selected, show their dashboard
  return (
    <div className="max-w-7xl mx-auto p-4">
      <header className="mb-8 flex items-center justify-between">
        <Logo />
        <div className="flex gap-4 items-center">
          <StorageDebug />
          <UserSelector 
            users={USERS} 
            selectedUserId={selectedUserId} 
            onSelectUser={handleUserChange} 
          />
        </div>
      </header>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-500">
          {selectedUser?.name}
        </h1>
        <p className="text-gray-600 mb-6 max-w-3xl">
          Track your goals, visualize progress, and stay motivated on your journey of self-improvement.
        </p>
        <div className="h-1 w-32 bg-primary-500 rounded"></div>
      </div>

      {selectedUserId && selectedUser?.name && (
        <UserDashboard 
          userId={selectedUserId} 
          userName={selectedUser.name} 
          key={`dashboard-${selectedUserId}`} // Force re-mount when user changes
        />
      )}
    </div>
  );
} 