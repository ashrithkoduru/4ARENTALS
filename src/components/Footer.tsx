import React from 'react';
import { Link } from 'react-router-dom';
import { Car } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/4arentals-logo.png"
                alt="4A Rentals" 
                className="h-12 w-auto"
              />
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              Your trusted partner for car rentals. Experience the freedom of the road with our exceptional service.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-4 text-gray-900">Quick Links</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><Link to="/" className="hover:text-gray-900 transition-colors">Home</Link></li>
              <li><Link to="/fleet" className="hover:text-gray-900 transition-colors">Vehicles</Link></li>
              <li><Link to="/my-bookings" className="hover:text-gray-900 transition-colors">My Bookings</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4 text-gray-900">Services</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>Economy Cars</li>
              <li>SUV Rentals</li>
              <li>Luxury Vehicles</li>
              <li>Long-term Rentals</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4 text-gray-900">Contact</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>+1 (555) 123-4567</li>
              <li>info@4arentals.com</li>
              <li>123 Rental Street</li>
              <li>City, State 12345</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">&copy; 2025 4A Rentals. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link 
              to="/privacy-policy" 
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              Privacy Policy
            </Link>
            <a 
              href="#" 
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};