'use client';

import { useState, useEffect } from 'react';
import { isStorageAvailable } from '@/utils/storage';

export default function StorageDebug() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasStorage, setHasStorage] = useState(false);

  useEffect(() => {
    // Check if localStorage is available
    const storageAvailable = isStorageAvailable();
    console.log('LocalStorage available:', storageAvailable);
    setHasStorage(storageAvailable);
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return <div className="p-4 bg-gray-100 rounded-lg">Checking storage...</div>;
  }

  return (
    <div className={`p-4 rounded-lg ${hasStorage ? 'bg-green-100' : 'bg-red-100'}`}>
      <h2 className="font-semibold">Storage Status</h2>
      <p>LocalStorage is {hasStorage ? 'available' : 'not available'}</p>
      {!hasStorage && (
        <p className="text-red-600 text-sm mt-2">
          Your browser may have localStorage disabled or in private browsing mode.
          Dashboard content may not persist between sessions.
        </p>
      )}
    </div>
  );
} 