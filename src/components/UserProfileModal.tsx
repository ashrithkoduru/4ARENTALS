import React from 'react';
import { X, User, Mail, Calendar, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, userData } = useAuth();
  const isAdmin = currentUser?.email === 'admin@4arentals.com';

  if (!isOpen || !currentUser) return null;

  const formatDate = (date: string | undefined) => {
    if (!date) return 'N/A';
    
    try {
      const dateObj = new Date(date);
      
      if (isNaN(dateObj.getTime())) {
        return 'N/A';
      }
      
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full my-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">User Profile</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          {/* Profile Picture Placeholder */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
              {currentUser.user_metadata?.avatar_url ? (
                <img 
                  src={currentUser.user_metadata.avatar_url} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-gray-400" />
              )}
            </div>
          </div>

          {/* User Information */}
          <div className="space-y-4">
            {/* Name */}
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Full Name</p>
                <p className="text-gray-900">
                  {userData?.first_name || userData?.last_name 
                    ? `${userData.first_name || ''} ${userData.last_name || ''}`.trim()
                    : currentUser.user_metadata?.first_name || currentUser.user_metadata?.last_name
                    ? `${currentUser.user_metadata.first_name || ''} ${currentUser.user_metadata.last_name || ''}`.trim()
                    : 'Not provided'
                  }
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Email Address</p>
                <p className="text-gray-900 break-all">{currentUser.email}</p>
              </div>
            </div>

            {/* Account Created */}
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Member Since</p>
                <p className="text-gray-900">
                  {formatDate(userData?.created_at || currentUser.created_at)}
                </p>
              </div>
            </div>

            {/* Account Type */}
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Account Type</p>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isAdmin 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {isAdmin ? 'Administrator' : 'Customer'}
                  </span>
                </div>
              </div>
            </div>

            {/* Email Verification Status */}
            {currentUser.email_confirmed_at !== undefined && (
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Email Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    currentUser.email_confirmed_at 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {currentUser.email_confirmed_at ? 'Verified' : 'Unverified'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};