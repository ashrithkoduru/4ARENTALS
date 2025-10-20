import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, Calendar, MapPin, User, Mail, Phone, CreditCard } from 'lucide-react';
import { Vehicle } from '../types';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/bookingService';
import { supabase } from '../config/supabase';
import Loader from './Loader';

interface BookingModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess?: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ vehicle, isOpen, onClose, onBookingSuccess }) => {
  const { currentUser, userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [bookingData, setBookingData] = useState({
    pickupDate: '',
    months: 1, // ✅ NEW: Number of months to rent
    pickupLocation: 'Denton, Texas',
    customerInfo: {
      firstName: userData?.first_name || '',
      lastName: userData?.last_name || '',
      email: currentUser?.email || '',
      phone: ''
    }
  });

  // ✅ NEW: Calculate return date based on pickup date + months
  const calculateReturnDate = () => {
    if (!bookingData.pickupDate) return '';
    
    const pickup = new Date(bookingData.pickupDate);
    const returnDate = new Date(pickup);
    returnDate.setDate(returnDate.getDate() + (bookingData.months * 30)); // Add months * 30 days
    
    return returnDate.toISOString().slice(0, 16); // Format for datetime-local
  };

  // ✅ NEW: Calculate total price (months * monthly rate)
  const calculateTotalPrice = () => {
    if (!vehicle || !bookingData.pickupDate) return 0;
    return bookingData.months * vehicle.price;
  };

  // ✅ NEW: Format return date for display
  const getReturnDateDisplay = () => {
    if (!bookingData.pickupDate) return '';
    
    const returnDate = new Date(calculateReturnDate());
    return returnDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicle || !currentUser) return;

    setLoading(true);
    setError('');
    
    try {
const rentalAmount = calculateTotalPrice();
const securityDeposit = vehicle.price;
const totalAmount = rentalAmount + securityDeposit;

const booking = {
  userId: currentUser.id,
  vehicleId: vehicle.id,
  pickupLocation: bookingData.pickupLocation,
  pickupDate: bookingData.pickupDate,
  returnDate: calculateReturnDate(),
  rentalMonths: bookingData.months, // ✅ NEW: Store the months selected
  rentalAmount: rentalAmount, 
  securityDeposit: securityDeposit, 
  totalPrice: totalAmount, 
  status: 'pending' as const,
  customerInfo: bookingData.customerInfo
};

      const bookingId = await bookingService.createBooking(booking);
      
      // Update vehicle status to 'reserved'
      const { error: vehicleError } = await supabase
        .from('vehicles')
        .update({ status: 'reserved' })
        .eq('id', vehicle.id);

      if (vehicleError) {
        console.error('Error updating vehicle status:', vehicleError);
      }
      
      setStep(4); // Show success screen
      
      if (onBookingSuccess) {
        onBookingSuccess();
      }
    } catch (error) {
      console.error('Booking error:', error);
      setError(error instanceof Error ? error.message : 'Error submitting booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setError('');
    setBookingData({
      pickupDate: '',
      months: 1,
      pickupLocation: 'Denton, Texas',
      customerInfo: {
        firstName: userData?.first_name || '',
        lastName: userData?.last_name || '',
        email: currentUser?.email || '',
        phone: ''
      }
    });
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const isStep1Valid = bookingData.pickupDate && bookingData.months > 0;

  const isStep2Valid = bookingData.customerInfo.firstName && 
    bookingData.customerInfo.lastName && 
    bookingData.customerInfo.email && 
    bookingData.customerInfo.phone;

  if (!isOpen || !vehicle) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {step > 1 && step < 4 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <h2 className="text-xl font-semibold text-gray-900">
                Book {vehicle.name}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Progress Steps */}
          {step < 4 && (
            <div className="flex items-center gap-4 mt-4">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  step >= 1 ? 'bg-gray-900 text-white' : 'bg-gray-200'
                }`}>
                  1
                </div>
                <span className="text-sm font-medium">Dates</span>
              </div>
              <div className="w-8 h-px bg-gray-200"></div>
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  step >= 2 ? 'bg-gray-900 text-white' : 'bg-gray-200'
                }`}>
                  2
                </div>
                <span className="text-sm font-medium">Details</span>
              </div>
              <div className="w-8 h-px bg-gray-200"></div>
              <div className={`flex items-center gap-2 ${step >= 3 ? 'text-gray-900' : 'text-gray-400'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  step >= 3 ? 'bg-gray-900 text-white' : 'bg-gray-200'
                }`}>
                  3
                </div>
                <span className="text-sm font-medium">Confirm</span>
              </div>
            </div>
          )}
        </div>

        {/* Vehicle Summary */}
        {step < 4 && (
          <div className="p-6 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <img 
                src={Array.isArray(vehicle.image) ? vehicle.image[0] : vehicle.image}
                alt={vehicle.name}
                className="w-24 h-20 object-cover rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
                }}
              />
              <div>
                <h3 className="font-semibold text-gray-900">{vehicle.name}</h3>
                <p className="text-gray-600 text-sm">{vehicle.specifications.seats} seats • {vehicle.specifications.transmission}</p>
                <p className="text-lg font-semibold text-gray-900">${vehicle.price}/month</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Date Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Rental Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Pickup Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={bookingData.pickupLocation}
                    readOnly
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* ✅ Pickup Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Pickup Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="datetime-local"
                      value={bookingData.pickupDate}
                      onChange={(e) => setBookingData(prev => ({ ...prev, pickupDate: e.target.value }))}
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* ✅ NEW: Rental Duration Dropdown */}
<div>
  <label className="block text-sm font-medium text-gray-600 mb-2">Rental Duration</label>
  <div className="relative">
    {/* Dropdown Arrow Icon */}
    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
    <select
      value={bookingData.months}
      onChange={(e) => setBookingData(prev => ({ ...prev, months: parseInt(e.target.value) }))}
      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent appearance-none bg-white pr-10"
      required
    >
      {[...Array(12)].map((_, index) => {
        const months = index + 1;
        return (
          <option key={months} value={months}>
            {months} {months === 1 ? 'Month' : 'Months'} (${vehicle.price * months})
          </option>
        );
      })}
    </select>
  </div>
</div>
              </div>

              {/* ✅ Auto-calculated Return Date Display */}
              {bookingData.pickupDate && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <p className="text-sm font-medium text-blue-900">Return Date (Auto-calculated)</p>
                  </div>
                  <p className="text-blue-800 font-semibold">
                    {getReturnDateDisplay()}
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    {bookingData.months * 30} days from pickup date
                  </p>
                </div>
              )}

{/* ✅ Rental Summary with Deposit Notice */}
{bookingData.pickupDate && (
  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
    <h4 className="font-medium text-gray-900 mb-3">Rental Summary</h4>
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600">Duration:</span>
        <span className="font-medium text-gray-900">
          {bookingData.months} {bookingData.months === 1 ? 'Month' : 'Months'} ({bookingData.months * 30} days)
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Monthly Rate:</span>
        <span className="font-medium text-gray-900">${vehicle.price}/month</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Rental Total:</span>
        <span className="font-medium text-gray-900">${calculateTotalPrice()}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Security Deposit:</span>
        <span className="font-medium text-gray-900">+${vehicle.price}</span>
      </div>
      <div className="flex justify-between pt-2 border-t border-gray-300">
        <span className="font-semibold text-gray-900">Total Due Now:</span>
        <span className="text-xl font-bold text-gray-900">${calculateTotalPrice() + vehicle.price}</span>
      </div>
    </div>
    
    {/* ✅ NEW: Deposit Notice */}
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="flex items-start gap-2 bg-blue-50 p-3 rounded-lg">
        <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="text-xs text-blue-800">
          <p className="font-semibold mb-1">Security Deposit Information</p>
          <p>An additional security deposit of <strong>${vehicle.price}</strong> (one month's rent) is required and will be <strong>fully refunded</strong> after the vehicle is returned in good condition.</p>
        </div>
      </div>
    </div>
    
    <p className="text-xs text-gray-500 mt-3">* Pricing is calculated per month (30 days)</p>
  </div>
)}

              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!isStep1Valid}
                className="w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Details
              </button>
            </div>
          )}

          {/* Step 2: Customer Information */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={bookingData.customerInfo.firstName}
                      onChange={(e) => setBookingData(prev => ({
                        ...prev,
                        customerInfo: { ...prev.customerInfo, firstName: e.target.value }
                      }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="John"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={bookingData.customerInfo.lastName}
                      onChange={(e) => setBookingData(prev => ({
                        ...prev,
                        customerInfo: { ...prev.customerInfo, lastName: e.target.value }
                      }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={bookingData.customerInfo.email}
                    onChange={(e) => setBookingData(prev => ({
                      ...prev,
                      customerInfo: { ...prev.customerInfo, email: e.target.value }
                    }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={bookingData.customerInfo.phone}
                    onChange={(e) => setBookingData(prev => ({
                      ...prev,
                      customerInfo: { ...prev.customerInfo, phone: e.target.value }
                    }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!isStep2Valid}
                className="w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Review Booking
              </button>
            </div>
          )}

          {/* Step 3: Confirmation */}
{step === 3 && (
  <div className="space-y-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Your Booking</h3>
    
    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
      <div>
        <h4 className="font-medium text-gray-900 mb-2">Rental Details</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>Vehicle: {vehicle.name}</p>
          <p>Pickup: {new Date(bookingData.pickupDate).toLocaleString()}</p>
          <p>Return: {getReturnDateDisplay()}</p>
          <p>Duration: {bookingData.months} {bookingData.months === 1 ? 'Month' : 'Months'} ({bookingData.months * 30} days)</p>
          <p>Location: {bookingData.pickupLocation}</p>
        </div>
      </div>
      
      <div>
        <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>Name: {bookingData.customerInfo.firstName} {bookingData.customerInfo.lastName}</p>
          <p>Email: {bookingData.customerInfo.email}</p>
          <p>Phone: {bookingData.customerInfo.phone}</p>
        </div>
      </div>

      {/* ✅ UPDATED: Payment Breakdown with Deposit */}
      <div className="border-t border-gray-200 pt-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Monthly Rate:</span>
            <span className="font-medium text-gray-900">${vehicle.price}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium text-gray-900">{bookingData.months} {bookingData.months === 1 ? 'Month' : 'Months'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Rental Total:</span>
            <span className="font-medium text-gray-900">${calculateTotalPrice()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Security Deposit (Refundable):</span>
            <span className="font-medium text-gray-900">+${vehicle.price}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-300">
            <span className="font-semibold text-gray-900">Total Due Now:</span>
            <span className="text-xl font-bold text-gray-900">${calculateTotalPrice() + vehicle.price}</span>
          </div>
        </div>
      </div>
    </div>

    {/* ✅ NEW: Deposit Notice */}
    <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
      <div className="flex items-start gap-2">
        <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-1">Important Payment Information</p>
          <p className="mb-2">Your total payment includes:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong>Rental Fee:</strong> ${calculateTotalPrice()} ({bookingData.months} {bookingData.months === 1 ? 'month' : 'months'})</li>
            <li><strong>Security Deposit:</strong> ${vehicle.price} (refundable)</li>
          </ul>
          <p className="mt-2">The security deposit will be <strong>fully refunded</strong> within 5-7 business days after the vehicle is returned in good condition.</p>
        </div>
      </div>
    </div>

    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
      <p className="text-sm text-yellow-800">
        <strong>Note:</strong> This is a booking request. We will contact you within 24 hours to confirm your reservation and arrange payment.
      </p>
    </div>

    <button
      type="submit"
      disabled={loading}
      className="w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <Loader />
          Submitting...
        </>
      ) : (
        <>
          <CreditCard className="w-4 h-4" />
          Confirm Booking
        </>
      )}
    </button>
  </div>
)}

          {/* Step 4: Success */}
{step === 4 && (
  <div className="space-y-6 text-center">
    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </div>
    
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Booking Confirmed!</h3>
      <p className="text-gray-600">
        Your booking request has been submitted successfully. We will contact you within 24 hours to confirm your reservation and arrange payment.
      </p>
    </div>

    <div className="bg-gray-50 rounded-xl p-6 text-left">
      <h4 className="font-medium text-gray-900 mb-4">Booking Summary</h4>
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Vehicle:</span>
          <span className="font-medium text-gray-900">{vehicle.name}</span>
        </div>
        <div className="flex justify-between">
          <span>Pickup:</span>
          <span className="font-medium text-gray-900">{new Date(bookingData.pickupDate).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Return:</span>
          <span className="font-medium text-gray-900">{new Date(calculateReturnDate()).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Duration:</span>
          <span className="font-medium text-gray-900">{bookingData.months} {bookingData.months === 1 ? 'Month' : 'Months'}</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-gray-200">
          <span>Rental Fee:</span>
          <span className="font-medium text-gray-900">${calculateTotalPrice()}</span>
        </div>
        <div className="flex justify-between">
          <span>Security Deposit:</span>
          <span className="font-medium text-gray-900">${vehicle.price}</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-gray-300 mt-2">
          <span className="font-medium">Total:</span>
          <span className="font-bold text-gray-900">${calculateTotalPrice() + vehicle.price}</span>
        </div>
      </div>
      
      {/* ✅ NEW: Deposit refund notice */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-600">
          * Security deposit of ${vehicle.price} will be refunded within 5-7 business days after vehicle return
        </p>
      </div>
    </div>

    <button
      onClick={handleClose}
      className="w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium"
    >
      Close
    </button>
  </div>
)}
        </form>
      </div>
    </div>
  );
};