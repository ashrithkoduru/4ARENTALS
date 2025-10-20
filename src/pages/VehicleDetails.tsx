import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, CheckCircle, Users, Settings, Fuel, Calendar, MapPin, Phone, Mail } from 'lucide-react';
import { Vehicle } from '../types';
import { useAuth } from '../context/AuthContext';
import { vehicleService } from '../services/vehicleService';
import { AuthModal } from '../components/AuthModal';
import { BookingModal } from '../components/BookingModal';
import Loader from '../components/Loader';

export const VehicleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchVehicle = async () => {
      if (!id) {
        setError('Vehicle ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const vehicleData = await vehicleService.getVehicle(id);
        if (vehicleData) {
          // ✅ ADDED: Check if vehicle is available
          if (vehicleData.status !== 'available') {
            setError('This vehicle is not currently available for booking');
            setVehicle(null);
          } else {
            setVehicle(vehicleData);
          }
        } else {
          setError('Vehicle not found');
        }
      } catch (err) {
        console.error('Error fetching vehicle:', err);
        setError('Failed to load vehicle details');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  const handleBookingSuccess = () => {
    // Redirect to home after successful booking
    // Vehicle is now reserved, so shouldn't be shown anymore
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Loader />
          </div>
          <p className="text-gray-600">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Vehicle Not Available</h1>
          <p className="text-gray-600 mb-6">{error || 'The vehicle you are looking for is not available.'}</p>
          <Link 
            to="/" 
            className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/4arentals-logo.png" 
                alt="4A Rentals" 
                className="h-20 w-auto"
              />
            </Link>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <Link
                to="/"
                className="bg-gray-900 text-white px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Vehicle Details */}
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Vehicle Image Gallery */}
          <div className="relative mb-8">
            {(() => {
              const images = Array.isArray(vehicle.image) ? vehicle.image : [vehicle.image];
              
              return (
                <>
                  {/* Main Image */}
                  <div className="relative">
                    <img 
                      src={images[currentImageIndex]} 
                      alt={`${vehicle.name} - Image ${currentImageIndex + 1}`}
                      className="w-full h-96 object-cover rounded-2xl"
                    />
                    
                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                        >
                          <ArrowLeft className="w-5 h-5 text-gray-900" />
                        </button>
                        <button
                          onClick={() => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                        >
                          <ArrowLeft className="w-5 h-5 text-gray-900 rotate-180" />
                        </button>
                      </>
                    )}
                    
                    {/* ✅ REMOVED: Status Badge - customers don't need to see this */}
                    
                    {/* Image Counter */}
                    {images.length > 1 && (
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    )}
                  </div>
                  
                  {/* Thumbnail Strip */}
                  {images.length > 1 && (
                    <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                      {images.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-24 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                            currentImageIndex === index 
                              ? 'border-gray-900 shadow-md' 
                              : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          <img 
                            src={img} 
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              );
            })()}
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Title and Price */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{vehicle.name}</h1>
                  <p className="text-xl text-gray-600 capitalize">{vehicle.category} Vehicle</p>
                  <div className="flex items-center text-yellow-500 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                    <span className="ml-2 text-gray-600">(4.9)</span>
                  </div>
                </div>
                <div className="text-right">
                  {/* ✅ FIXED: Always show /month */}
                  <div className="text-3xl font-bold text-gray-900">
                    ${vehicle.price}/month
                  </div>
                </div>
              </div>

              {/* Specifications Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-gray-100">
                  <Users className="w-8 h-8 text-blue-600 mb-3" />
                  <p className="text-sm text-gray-600">Seats</p>
                  <p className="text-xl font-bold text-gray-900">{vehicle.specifications.seats}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100">
                  <Settings className="w-8 h-8 text-green-600 mb-3" />
                  <p className="text-sm text-gray-600">Transmission</p>
                  <p className="text-xl font-bold text-gray-900 capitalize">{vehicle.specifications.transmission}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100">
                  <Fuel className="w-8 h-8 text-purple-600 mb-3" />
                  <p className="text-sm text-gray-600">Fuel Type</p>
                  <p className="text-xl font-bold text-gray-900 capitalize">{vehicle.specifications.fuelType}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100">
                  <Calendar className="w-8 h-8 text-orange-600 mb-3" />
                  <p className="text-sm text-gray-600">Year</p>
                  <p className="text-xl font-bold text-gray-900">{vehicle.specifications.year}</p>
                </div>
                {vehicle.specifications.color && (
                  <div className="bg-white p-6 rounded-xl border border-gray-100">
                    <div className="w-8 h-8 bg-gray-400 rounded-full mb-3"></div>
                    <p className="text-sm text-gray-600">Color</p>
                    <p className="text-xl font-bold text-gray-900 capitalize">{vehicle.specifications.color}</p>
                  </div>
                )}
                {vehicle.specifications.cylinders && (
                  <div className="bg-white p-6 rounded-xl border border-gray-100">
                    <Settings className="w-8 h-8 text-red-600 mb-3" />
                    <p className="text-sm text-gray-600">Cylinders</p>
                    <p className="text-xl font-bold text-gray-900">{vehicle.specifications.cylinders}</p>
                  </div>
                )}
              </div>

              {/* Vehicle Information */}
              <div className="bg-white rounded-2xl p-8 border border-gray-100 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Vehicle Information</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Brand & Model</h3>
                    <p className="text-gray-600">{vehicle.specifications.brand} {vehicle.specifications.model}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Color</h3>
                    <p className="text-gray-600">{vehicle.specifications.color}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Interior</h3>
                    <p className="text-gray-600">{vehicle.specifications.interior}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Interior Color</h3>
                    <p className="text-gray-600">{vehicle.specifications.interiorColor}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Drive Train</h3>
                    <p className="text-gray-600">{vehicle.specifications.driveTrain}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Transmission</h3>
                    <p className="text-gray-600 capitalize">{vehicle.specifications.transmission}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Cylinders</h3>
                    <p className="text-gray-600">{vehicle.specifications.cylinders}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">VIN</h3>
                    <p className="text-gray-600 font-mono text-xs">{vehicle.specifications.vin}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Engine</h3>
                    <p className="text-gray-600">{vehicle.specifications.engine}</p>
                  </div>
                  {vehicle.specifications.mileage && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Mileage</h3>
                      <p className="text-gray-600">{vehicle.specifications.mileage.toLocaleString()} miles</p>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Stock #</h3>
                    <p className="text-gray-600">{vehicle.specifications.stockNumber}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Fuel Economy</h3>
                    <p className="text-gray-600">{vehicle.specifications.fuelEconomy}</p>
                    <p className="text-xs text-gray-500 mt-1">Estimated By E.P.A. - Actual Mileage May Vary</p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="bg-white rounded-2xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Features & Amenities</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {vehicle.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Booking Card */}
              <div className="bg-white rounded-2xl p-8 border border-gray-100 sticky top-24">
                <div className="text-center mb-6">
                  {/* ✅ FIXED: Always show /month */}
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    ${vehicle.price}
                    <span className="text-lg font-normal text-gray-600">/month</span>
                  </div>
                  <div className="flex items-center justify-center text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                    <span className="ml-2 text-gray-600 text-sm">(4.9 rating)</span>
                  </div>
                </div>

                {/* ✅ SIMPLIFIED: No status checks needed - vehicle is available */}
                {currentUser ? (
                  <button 
                    onClick={() => setIsBookingModalOpen(true)}
                    className="w-full py-4 rounded-xl font-medium text-lg transition-colors mb-4 bg-gray-900 text-white hover:bg-gray-800"
                  >
                    Book This Vehicle
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="w-full py-4 rounded-xl font-medium text-lg transition-colors mb-4 bg-gray-900 text-white hover:bg-gray-800"
                  >
                    Sign In to Book
                  </button>
                )}

                <div className="border-t border-gray-100 pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Need Help?</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>info@4arentals.com</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>Denton, Texas</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      
      <BookingModal
        vehicle={vehicle}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onBookingSuccess={handleBookingSuccess}
      />
    </div>
  );
};