import { useState } from 'react';
import { exportUserDataToCsv, downloadCsv, getCurrentMonth } from '@/utils/storage';
import { CSVExportOptions } from '@/types';

interface CSVExporterProps {
  userId: number;
  userName: string;
}

export default function CSVExporter({ userId, userName }: CSVExporterProps) {
  const [month, setMonth] = useState<string>(getCurrentMonth());
  const [section, setSection] = useState<'personal' | 'business' | 'all'>('all');
  const [isOpen, setIsOpen] = useState(false);
  
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const handleExportCSV = () => {
    const options: CSVExportOptions = {
      month,
      section,
      userId
    };
    
    const csvContent = exportUserDataToCsv(userId, options);
    const filename = `${userName.toLowerCase()}_${section}_${month.toLowerCase()}_data.csv`;
    downloadCsv(csvContent, filename);
  };
  
  return (
    <div className="relative">
      <button 
        className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-primary-50 text-primary-600 rounded-lg shadow-sm border border-primary-200 transition-all duration-200 poppins-medium"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
          />
        </svg>
        <span>Download CSV</span>
      </button>
      
      {isOpen && (
        <div className="absolute z-20 top-full right-0 mt-2 p-4 bg-white rounded-lg shadow-lg border border-gray-100 w-64">
          <div className="mb-4">
            <label htmlFor="month-select" className="block text-sm font-medium text-gray-700 mb-1">
              Month
            </label>
            <select
              id="month-select"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Months</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="section-select" className="block text-sm font-medium text-gray-700 mb-1">
              Section
            </label>
            <select
              id="section-select"
              value={section}
              onChange={(e) => setSection(e.target.value as 'personal' | 'business' | 'all')}
              className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Data</option>
              <option value="personal">Personal Goals</option>
              <option value="business">Business Data</option>
            </select>
          </div>
          
          <div className="flex justify-between">
            <button
              className="px-3 py-1.5 text-gray-600 text-sm hover:bg-gray-100 rounded"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1.5 bg-primary-500 text-white text-sm hover:bg-primary-600 rounded"
              onClick={() => {
                handleExportCSV();
                setIsOpen(false);
              }}
            >
              Export
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 