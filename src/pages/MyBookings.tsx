import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, DollarSign, ArrowLeft, Car, AlertCircle, CheckCircle, XCircle, Loader as LoaderIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/bookingService';
import { vehicleService } from '../services/vehicleService';
import { Booking, Vehicle } from '../types';
import Loader from '../components/Loader';

export const MyBookings: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [vehicles, setVehicles] = useState<Record<string, Vehicle>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }
    fetchBookings();
  }, [currentUser, navigate]);

  const fetchBookings = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch user's bookings
      const userBookings = await bookingService.getUserBookings(currentUser.id);
      setBookings(userBookings);

      // Fetch vehicle details for each booking
      const vehicleIds = [...new Set(userBookings.map(b => b.vehicleId))];
      const vehicleData: Record<string, Vehicle> = {};

      for (const vehicleId of vehicleIds) {
        try {
          const vehicle = await vehicleService.getVehicle(vehicleId);
          if (vehicle) {
            vehicleData[vehicleId] = vehicle;
          }
        } catch (err) {
          console.error(`Failed to fetch vehicle ${vehicleId}:`, err);
        }
      }

      setVehicles(vehicleData);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: Booking['status']) => {
    const badges = {
      pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: <Clock className="w-4 h-4" />,
        label: 'Pending'
      },
      confirmed: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        icon: <CheckCircle className="w-4 h-4" />,
        label: 'Confirmed'
      },
      active: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: <Car className="w-4 h-4" />,
        label: 'Active'
      },
      inspection: {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        icon: <AlertCircle className="w-4 h-4" />,
        label: 'Inspection'
      },
      completed: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        icon: <CheckCircle className="w-4 h-4" />,
        label: 'Completed'
      },
      cancelled: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: <XCircle className="w-4 h-4" />,
        label: 'Cancelled'
      }
    };

    const badge = badges[status] || badges.pending;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.icon}
        {badge.label}
      </span>
    );
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Loader />
          </div>
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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

      {/* Main Content */}
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
            <p className="text-gray-600">View and manage your vehicle rental bookings</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Filter Tabs */}
          <div className="mb-6 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {[
                { value: 'all', label: 'All Bookings' },
                { value: 'pending', label: 'Pending' },
                { value: 'confirmed', label: 'Confirmed' },
                { value: 'active', label: 'Active' },
                { value: 'completed', label: 'Completed' },
                { value: 'cancelled', label: 'Cancelled' }
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setFilter(tab.value as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === tab.value
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                  {tab.value === 'all' && ` (${bookings.length})`}
                  {tab.value !== 'all' && ` (${bookings.filter(b => b.status === tab.value).length})`}
                </button>
              ))}
            </div>
          </div>

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all' 
                  ? "You haven't made any bookings yet. Browse our fleet to get started!"
                  : `You don't have any ${filter} bookings.`}
              </p>
              <Link
                to="/fleet"
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Car className="w-4 h-4" />
                Browse Vehicles
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => {
                const vehicle = vehicles[booking.vehicleId];
                const pickupDate = new Date(booking.pickupDate);
                const returnDate = new Date(booking.returnDate);
                const duration = Math.ceil((returnDate.getTime() - pickupDate.getTime()) / (1000 * 3600 * 24));

                return (
                  <div
                    key={booking.id}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Vehicle Image */}
                        <div className="lg:w-64 flex-shrink-0">
                          {vehicle ? (
                            <img
                              src={Array.isArray(vehicle.image) ? vehicle.image[0] : vehicle.image}
                              alt={vehicle.name}
                              className="w-full h-48 lg:h-full object-cover rounded-xl"
                            />
                          ) : (
                            <div className="w-full h-48 lg:h-full bg-gray-200 rounded-xl flex items-center justify-center">
                              <Car className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Booking Details */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1">
                                {vehicle ? vehicle.name : 'Vehicle Details Unavailable'}
                              </h3>
                              {vehicle && (
                                <p className="text-gray-600 text-sm capitalize">
                                  {vehicle.specifications.seats} seats • {vehicle.specifications.transmission} • {vehicle.specifications.fuelType}
                                </p>
                              )}
                            </div>
                            {getStatusBadge(booking.status)}
                          </div>

                          {/* Booking Info Grid */}
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Pickup Date</p>
                                <p className="text-sm font-semibold text-gray-900">
                                  {pickupDate.toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric', 
                                    year: 'numeric' 
                                  })}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {pickupDate.toLocaleTimeString('en-US', { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Return Date</p>
                                <p className="text-sm font-semibold text-gray-900">
                                  {returnDate.toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric', 
                                    year: 'numeric' 
                                  })}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {returnDate.toLocaleTimeString('en-US', { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Clock className="w-5 h-5 text-purple-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Duration</p>
                                <p className="text-sm font-semibold text-gray-900">
                                  {duration} {duration === 1 ? 'day' : 'days'}
                                </p>
                                <p className="text-xs text-gray-500">
                                  ({Math.ceil(duration / 30)} {Math.ceil(duration / 30) === 1 ? 'month' : 'months'})
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <MapPin className="w-5 h-5 text-orange-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Pickup Location</p>
                                <p className="text-sm font-semibold text-gray-900">
                                  {booking.pickupLocation}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <DollarSign className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Total Price</p>
                                <p className="text-lg font-bold text-gray-900">
                                  ${booking.totalPrice.toLocaleString()}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-5 h-5 text-gray-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Booked On</p>
                                <p className="text-sm font-semibold text-gray-900">
                                  {new Date(booking.createdAt).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric', 
                                    year: 'numeric' 
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Customer Info */}
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Customer Information</h4>
                            <div className="grid md:grid-cols-3 gap-3 text-sm">
                              <div>
                                <span className="text-gray-500">Name:</span>{' '}
                                <span className="font-medium text-gray-900">
                                  {booking.customerInfo.firstName} {booking.customerInfo.lastName}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">Email:</span>{' '}
                                <span className="font-medium text-gray-900">{booking.customerInfo.email}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Phone:</span>{' '}
                                <span className="font-medium text-gray-900">{booking.customerInfo.phone}</span>
                              </div>
                            </div>
                          </div>

                          {/* Status Message */}
                          {booking.status === 'pending' && (
                            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                              <p className="text-sm text-yellow-800">
                                <strong>Pending Confirmation:</strong> We'll contact you within 24 hours to confirm your reservation and arrange payment.
                              </p>
                            </div>
                          )}
                          {booking.status === 'confirmed' && (
                            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <p className="text-sm text-blue-800">
                                <strong>Confirmed:</strong> Your booking is confirmed! We'll contact you before the pickup date with further instructions.
                              </p>
                            </div>
                          )}
                          {booking.status === 'active' && (
                            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                              <p className="text-sm text-green-800">
                                <strong>Active Rental:</strong> You currently have this vehicle. Please return it by the return date.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};