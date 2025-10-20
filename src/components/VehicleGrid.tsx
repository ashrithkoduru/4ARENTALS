import { Car, Star, CheckCircle } from 'lucide-react';
import { useVehicles } from '../hooks/useVehicles';
import { useAuth } from '../context/AuthContext';
import { BookingModal } from './BookingModal';
import { Vehicle } from '../types';
import Loader from './Loader';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface VehicleGridProps {
  onAuthModalOpen: (mode: 'login' | 'register') => void;
}

export const VehicleGrid: React.FC<VehicleGridProps> = ({ onAuthModalOpen }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [bookingVehicle, setBookingVehicle] = useState<Vehicle | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { vehicles: allVehicles, loading: vehiclesLoading, error: vehiclesError, refetch } = useVehicles(selectedCategory);

  // Enhanced filtering logic for vehicles
  const filteredVehicles = React.useMemo(() => {
    if (selectedCategory === 'all') {
      return allVehicles;
    }
    return allVehicles.filter(vehicle => vehicle.category === selectedCategory);
  }, [allVehicles, selectedCategory]);

  const handleVehicleClick = (vehicle: Vehicle) => {
    navigate(`/vehicle/${vehicle.id}`);
  };

  const handleBookingModalOpen = (vehicle: Vehicle) => {
    setBookingVehicle(vehicle);
    setIsBookingModalOpen(true);
  };

  const handleBookingModalClose = () => {
    setIsBookingModalOpen(false);
    setBookingVehicle(null);
    // Refresh vehicles list to update availability status
    refetch();
  };

  return (
    <>
      <section id="vehicles" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            Our Vehicle Categories
          </h2>
          <p className="text-lg text-gray-600">
            Choose from our diverse fleet of premium vehicles
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white p-1 rounded-full shadow-sm border border-gray-100">
            {['all', 'economy', 'suv', 'luxury'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all text-sm ${
                  selectedCategory === category
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Vehicle Grid */}
        {vehiclesLoading ? (
          <div className="text-center py-12">
            <div className="flex justify-center">
              <Loader />
            </div>
            <p className="mt-4 text-gray-600">Loading vehicles...</p>
          </div>
        ) : vehiclesError ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Error loading vehicles: {vehiclesError}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="text-center py-12">
            <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No vehicles available in this category</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVehicles.map((vehicle) => (
              <div 
                key={vehicle.id} 
                onClick={() => handleVehicleClick(vehicle)}
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100 cursor-pointer"
              >
                <img 
  src={Array.isArray(vehicle.image) ? vehicle.image[0] : vehicle.image}  // ✅ Get first image if array
  alt={vehicle.name}
  className="w-full h-52 object-cover"
/>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{vehicle.name}</h3>
                  <div className="flex justify-between items-center mb-4">
                    {/* ✅ FIXED: Changed to price_per_unit and hardcoded 'month' */}
                    <span className="text-xl font-semibold text-gray-900">
                      ${vehicle.price}/month
                    </span>
                    <div className="flex items-center text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-4">
                    <p className="mb-1">{vehicle.specifications.seats} seats • {vehicle.specifications.transmission}</p>
                    <p className="mb-1">{vehicle.specifications.fuelType} • {vehicle.specifications.year}</p>
                    <p>{vehicle.specifications.brand} {vehicle.specifications.model}</p>
                  </div>
                  <ul className="text-sm text-gray-500 space-y-1 mb-4">
                    {vehicle.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {/* ✅ REMOVED: Status badge - customers don't need to see this */}
                  
                  {/* ✅ SIMPLIFIED: All vehicles shown are available, so button is always enabled */}
                  {currentUser ? (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookingModalOpen(vehicle);
                      }}
                      className="w-full py-3 rounded-xl font-medium transition-colors bg-gray-900 text-white hover:bg-gray-800"
                    >
                      Book Now
                    </button>
                  ) : (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onAuthModalOpen('login');
                      }}
                      className="w-full py-3 rounded-xl font-medium transition-colors bg-gray-900 text-white hover:bg-gray-800"
                    >
                      Sign In to Book
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </section>
      
      <BookingModal
        vehicle={bookingVehicle}
        isOpen={isBookingModalOpen}
        onClose={handleBookingModalClose}
        onBookingSuccess={refetch}
      />
    </>
  );
};