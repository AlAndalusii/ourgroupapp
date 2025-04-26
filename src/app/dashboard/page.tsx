'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Logo from '@/components/Logo';

// Define our users
const USERS = [
  { id: 1, name: 'Zakariya', color: 'primary' },
  { id: 2, name: 'Fatty', color: 'primary' },
  { id: 3, name: 'Abdullahi', color: 'primary' },
];

// Dynamically import components to avoid import errors
const UserSelector = dynamic(() => import('@/components/UserSelector'), {
  ssr: false,
  loading: () => <div className="h-10 w-48 bg-gray-200 animate-pulse rounded-lg"></div>
});

const UserDashboard = dynamic(() => import('@/components/UserDashboard'), {
  ssr: false,
  loading: () => (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-64 bg-gray-200 rounded"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
});

export default function Dashboard() {
  const searchParams = useSearchParams();
  const userIdParam = searchParams.get('userId');
  const [selectedUserId, setSelectedUserId] = useState(userIdParam ? parseInt(userIdParam, 10) : 1);

  useEffect(() => {
    if (userIdParam) {
      const userId = parseInt(userIdParam, 10);
      if (!isNaN(userId) && userId >= 1 && userId <= 3) {
        setSelectedUserId(userId);
      }
    }
  }, [userIdParam]);

  const handleUserChange = (userId: number) => {
    setSelectedUserId(userId);
    // Update URL without reload
    window.history.pushState({}, '', `/dashboard?userId=${userId}`);
  };

  const selectedUser = USERS.find(user => user.id === selectedUserId);

  return (
    <div className="max-w-7xl mx-auto">
      <header className="navbar mb-8">
        <Logo />
        <UserSelector 
          users={USERS} 
          selectedUserId={selectedUserId} 
          onSelectUser={handleUserChange} 
        />
      </header>

      <div className="mb-8">
        <h1 className="page-header poppins-bold text-primary-500">
          {selectedUser?.name}
        </h1>
        <p className="poppins-regular text-gray-600 mb-6 max-w-3xl">
          Track your goals, visualize progress, and stay motivated on your journey of self-improvement.
        </p>
        <div className="elegant-divider"></div>
      </div>

      <UserDashboard userId={selectedUserId} userName={selectedUser?.name || ''} />
    </div>
  );
} 