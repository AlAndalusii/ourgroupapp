import { useState } from 'react';

interface User {
  id: number;
  name: string;
  color: string;
}

interface UserSelectorProps {
  users: User[];
  selectedUserId: number | null;
  onSelectUser: (userId: number) => void;
}

export default function UserSelector({
  users,
  selectedUserId,
  onSelectUser,
}: UserSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (userId: number) => {
    onSelectUser(userId);
    setIsOpen(false);
  };

  const selectedUser = selectedUserId !== null 
    ? users.find(user => user.id === selectedUserId) 
    : null;

  const getUserAvatarColor = () => {
    return "bg-primary-500";
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 shadow-sm poppins-medium"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center poppins-medium ${getUserAvatarColor()}`}>
          {selectedUser?.name.charAt(0) || '?'}
        </div>
        <span>
          {selectedUser?.name || 'Select User'}
        </span>
        <svg
          className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-100">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {users.map((user) => (
              <button
                key={user.id}
                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 poppins-regular ${
                  user.id === selectedUserId
                    ? 'bg-primary-50 text-primary-500'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                role="menuitem"
                onClick={() => handleSelect(user.id)}
              >
                <div className="w-8 h-8 rounded-full text-white flex items-center justify-center poppins-medium bg-primary-500">
                  {user.name.charAt(0)}
                </div>
                {user.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 