import { useState } from 'react';

interface MaintenanceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  gameName: string;
}

export const MaintenanceDialog = ({ isOpen, onClose, gameName }: MaintenanceDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="text-center">
          {/* Maintenance Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
            <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Under Maintenance
          </h3>
          
          {/* Message */}
          <p className="text-gray-600 mb-6">
            {gameName} is currently under maintenance. We're working hard to bring you the best gaming experience!
          </p>
          
          {/* Features Coming Soon */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Coming Soon:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Enhanced graphics and animations</li>
              <li>• Improved betting mechanics</li>
              <li>• Real-time multiplayer features</li>
              <li>• Progressive jackpots</li>
            </ul>
          </div>
          
          {/* Priority Games Suggestion */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Try These Popular Games:</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Aviator</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Mines</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Dragon Tiger</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Win Go</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              OK, Got It
            </button>
            <button
              onClick={() => {
                onClose();
                // Navigate to priority games or notifications
              }}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Notify Me
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};