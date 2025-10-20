import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Users, Settings, Fuel, Calendar, CheckCircle, Car } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useVehicles } from '../hooks/useVehicles';
import { useAuth } from '../context/AuthContext';
import { BookingModal } from '../components/BookingModal';
import { AuthModal } from '../components/AuthModal';
import { Vehicle } from '../types';
import Loader from '../components/Loader';

export const Fleet: React.FC = () => {
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [bookingVehicle, setBookingVehicle] = useState<Vehicle | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { vehicles: allVehicles, loading, error, refetch } = useVehicles(selectedCategory);

  const categories = ['all', 'economy', 'suv', 'luxury'];
  
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
    refetch();
  };

  const getFirstImage = (image: string | string[]) => {
    if (Array.isArray(image)) {
      return image[0] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400';
    }
    return image || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400';
  };

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      <Navbar 
        onAuthModalOpen={(mode) => {
          setAuthModalMode(mode);
          setShowAuthModal(true);
        }}
        onProfileModalOpen={() => setShowProfileModal(true)}
      />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">
              Our Premium Fleet
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Choose from our diverse collection of vehicles, from budget-friendly economy cars 
              to luxury sedans. All vehicles are regularly maintained and thoroughly cleaned.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-8">
            <div className="bg-white p-1 rounded-full shadow-sm border border-gray-100">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2.5 rounded-full font-medium transition-all text-sm capitalize ${
                    selectedCategory === category
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Grid */}
      <section className="pb-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="flex justify-center">
                <Loader />
              </div>
              <p className="mt-4 text-gray-600">Loading vehicles...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Error loading vehicles: {error}</p>
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
                    src={getFirstImage(vehicle.image)} 
                    alt={vehicle.name}
                    className="w-full h-52 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{vehicle.name}</h3>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-semibold text-gray-900">
                        ${vehicle.price}/{vehicle.priceUnit}
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
                    
                    {/* Vehicle Status */}
                    <div className="mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
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
                    
                    {currentUser ? (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookingModalOpen(vehicle);
                        }}
                        className={`w-full py-3 rounded-xl font-medium transition-colors ${
                          vehicle.status === 'available'
                            ? 'bg-gray-900 text-white hover:bg-gray-800' 
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={vehicle.status !== 'available'}
                      >
                        {vehicle.status === 'available' 
                          ? 'Book Now' 
                          : vehicle.status === 'reserved'
                          ? 'Reserved'
                          : 'Not Available'
                        }
                      </button>
                    ) : (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowAuthModal(true);
                        }}
                        className={`w-full py-3 rounded-xl font-medium transition-colors ${
                          vehicle.status === 'available'
                            ? 'bg-gray-900 text-white hover:bg-gray-800' 
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={vehicle.status !== 'available'}
                      >
                        {vehicle.status === 'available' 
                          ? 'Sign In to Book' 
                          : vehicle.status === 'reserved'
                          ? 'Reserved'
                          : 'Not Available'
                        }
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modals */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
      
      <BookingModal
        vehicle={bookingVehicle}
        isOpen={isBookingModalOpen}
        onClose={handleBookingModalClose}
        onBookingSuccess={refetch}
      />
    </div>
  );
};