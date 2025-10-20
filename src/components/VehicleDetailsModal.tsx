import React from 'react';
import { X, ArrowLeft, Star, CheckCircle, Users, Settings, Fuel, Calendar } from 'lucide-react';
import { Vehicle } from '../types';
import { useAuth } from '../context/AuthContext';

interface VehicleDetailsModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onAuthModalOpen: (mode: 'login' | 'register') => void;
  onBookingModalOpen: (vehicle: Vehicle) => void;
}

export const VehicleDetailsModal: React.FC<VehicleDetailsModalProps> = ({ 
  vehicle, 
  isOpen, 
  onClose, 
  onAuthModalOpen,
  onBookingModalOpen
}) => {
  const { currentUser } = useAuth();

  if (!isOpen || !vehicle) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Vehicle Image */}
        <div className="relative">
          <img 
            src={vehicle.image} 
            alt={vehicle.name}
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              vehicle.status === 'available'
                ? 'bg-green-100 text-green-800'
                : vehicle.status === 'reserved'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {vehicle.status === 'available' 
                ? 'Available' 
                : vehicle.status === 'reserved'
                ? 'Reserved'
                : 'Not Available'
              }
            </span>
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="p-6">
          {/* Title and Price */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">{vehicle.name}</h2>
              <p className="text-gray-600 capitalize">{vehicle.category} Vehicle</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                ${vehicle.price}/{vehicle.priceUnit}
              </div>
              <div className="flex items-center text-yellow-500 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Users className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Seats</p>
                <p className="font-medium text-gray-900">{vehicle.specifications.seats} People</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Settings className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Transmission</p>
                <p className="font-medium text-gray-900 capitalize">{vehicle.specifications.transmission}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Fuel className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Fuel Type</p>
                <p className="font-medium text-gray-900 capitalize">{vehicle.specifications.fuelType}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Year</p>
                <p className="font-medium text-gray-900">{vehicle.specifications.year}</p>
              </div>
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Vehicle Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Brand:</span>
                <span className="ml-2 font-medium text-gray-900">{vehicle.specifications.brand}</span>
              </div>
              <div>
                <span className="text-gray-600">Model:</span>
                <span className="ml-2 font-medium text-gray-900">{vehicle.specifications.model}</span>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Features & Amenities</h3>
            <div className="grid grid-cols-1 gap-3">
              {vehicle.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="border-t border-gray-100 pt-6">
            {currentUser ? (
              <button 
                onClick={() => {
                  if (vehicle) {
                    onClose();
                    onBookingModalOpen(vehicle);
                  }
                }}
                className={`w-full py-4 rounded-xl font-medium transition-colors text-lg ${
                  vehicle.status === 'available'
                    ? 'bg-gray-900 text-white hover:bg-gray-800' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
                disabled={vehicle.status !== 'available'}
              >
                {vehicle.status === 'available' 
                  ? 'Book This Vehicle' 
                  : vehicle.status === 'reserved'
                  ? 'Currently Reserved'
                  : 'Not Available'
                }
              </button>
            ) : (
              <button 
                onClick={() => {
                  onClose();
                  onAuthModalOpen('login');
                }}
                className={`w-full py-4 rounded-xl font-medium text-lg transition-colors ${
                  vehicle.status === 'available'
                    ? 'bg-gray-900 text-white hover:bg-gray-800' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
                disabled={vehicle.status !== 'available'}
              >
                {vehicle.status === 'available' 
                  ? 'Sign In to Book' 
                  : vehicle.status === 'reserved'
                  ? 'Currently Reserved'
                  : 'Not Available'
                }
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};