import React, { useState } from 'react';
import { Menu, X, User, ChevronDown, UserCircle, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onAuthModalOpen: (mode: 'login' | 'register') => void;
  onProfileModalOpen: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onAuthModalOpen, onProfileModalOpen }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { currentUser, logout, userData } = useAuth();

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    
    try {
      await logout();
      
      // Navigate to home page after logout
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    } catch (error) {
      // Force redirect on error
      window.location.href = '/';
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-transparent backdrop-blur-sm z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/4arentals-logo.png" 
              alt="4A Rentals" 
              className="h-20 w-auto cursor-pointer"
            />
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">Home</a>
            <a href="/fleet" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">Vehicles</a>
            <a href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">Contact</a>
            
            {/* ✅ NEW: My Bookings link - only shows when logged in */}
            {currentUser && (
              <Link 
                to="/my-bookings" 
                className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium flex items-center gap-1"
              >
                <Calendar className="w-4 h-4" />
                My Bookings
              </Link>
            )}
            
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="bg-gray-900 text-white px-4 py-2.5 rounded-full hover:bg-gray-800 transition-all duration-200 text-sm font-medium flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {userData?.first_name ? `${userData.first_name} ${userData.last_name || ''}` : currentUser.email}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                      </div>
                      <button 
                        onClick={() => {
                          onProfileModalOpen();
                          setIsDropdownOpen(false);
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full text-left"
                      >
                        <UserCircle className="w-4 h-4" />
                        Profile
                      </button>
                      
                      {/* ✅ NEW: My Bookings in dropdown too */}
                      <Link 
                        to="/my-bookings"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full text-left"
                      >
                        <Calendar className="w-4 h-4" />
                        My Bookings
                      </Link>
                      
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button 
                onClick={() => onAuthModalOpen('login')}
                className="bg-gray-900 text-white px-5 py-2.5 rounded-full hover:bg-gray-800 transition-all duration-200 text-sm font-medium"
              >
                Sign In
              </button>
            )}
          </div>

          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="/" className="block px-3 py-2 text-gray-600 text-sm">Home</a>
            <a href="/fleet" className="block px-3 py-2 text-gray-600 text-sm">Vehicles</a>
            <a href="/contact" className="block px-3 py-2 text-gray-600 text-sm">Contact</a>
            
            {currentUser ? (
              <>
                <div className="px-3 py-2 text-sm text-gray-600 border-b border-gray-200">
                  {userData?.first_name ? `${userData.first_name} ${userData.last_name || ''}` : currentUser.email}
                </div>
                
                {/* ✅ NEW: My Bookings in mobile menu */}
                <Link 
                  to="/my-bookings"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 text-sm"
                >
                  <Calendar className="w-4 h-4" />
                  My Bookings
                </Link>
                
                <button 
                  onClick={() => {
                    onProfileModalOpen();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 text-gray-600 text-sm"
                >
                  <UserCircle className="w-4 h-4" />
                  Profile
                </button>
                
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 bg-gray-900 text-white rounded-md text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <button 
                onClick={() => onAuthModalOpen('login')}
                className="block w-full text-left px-3 py-2 bg-gray-900 text-white rounded-md text-sm"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};