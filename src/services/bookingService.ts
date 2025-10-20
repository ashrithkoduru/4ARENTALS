import { supabase } from '../config/supabase';
import { Booking } from '../types';

export const bookingService = {
  // Create new booking
  async createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([{
  user_id: bookingData.userId,
  vehicle_id: bookingData.vehicleId,
  pickup_location: bookingData.pickupLocation,
  pickup_date: bookingData.pickupDate,
  return_date: bookingData.returnDate,
  rental_months: bookingData.rentalMonths, // ✅ NEW
  rental_amount: bookingData.rentalAmount,
  security_deposit: bookingData.securityDeposit,
  total_price: bookingData.totalPrice,
  status: bookingData.status,
  customer_info: bookingData.customerInfo
}])
        .select()
        .single();

      if (error) {
        console.error('Booking creation error:', error);
        throw new Error('Failed to create booking: ' + error.message);
      }

      return data.id;
    } catch (error) {
      console.error('Booking service error:', error);
      throw error;
    }
  },

  // Get user bookings
  async getUserBookings(userId: string): Promise<Booking[]> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Fetch user bookings error:', error);
        throw new Error('Failed to fetch bookings: ' + error.message);
      }

      return (data || []).map(booking => ({
        id: booking.id,
        userId: booking.user_id,
        vehicleId: booking.vehicle_id,
        pickupLocation: booking.pickup_location,
        pickupDate: booking.pickup_date,
        returnDate: booking.return_date,
        rentalAmount: booking.rental_amount || 0,           // ✅ NEW
        securityDeposit: booking.security_deposit || 0,     // ✅ NEW
        totalPrice: booking.total_price,
        status: booking.status,
        customerInfo: booking.customer_info,
        
        // Optional fields
        actualPickupDate: booking.actual_pickup_date || null,
        actualReturnDate: booking.actual_return_date || null,
        extensionCount: booking.extension_count || 0,
        pickupMileage: booking.pickup_mileage || null,
        returnMileage: booking.return_mileage || null,
        adminNotes: booking.admin_notes || '',
        
        // ✅ NEW: Deposit tracking
        securityDepositDeduction: booking.security_deposit_deduction || 0,
        securityDepositAmountReturned: booking.security_deposit_amount_returned || 0,
        securityDepositReturned: booking.security_deposit_returned || false,
        securityDepositReturnDate: booking.security_deposit_return_date || null,
        deductionReason: booking.deduction_reason || '',
        
        createdAt: new Date(booking.created_at),
        updatedAt: new Date(booking.updated_at)
      }));
    } catch (error) {
      console.error('Get user bookings error:', error);
      throw error;
    }
  },

  // Get single booking
  async getBooking(id: string): Promise<Booking | null> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Booking not found
        }
        console.error('Fetch booking error:', error);
        throw new Error('Failed to fetch booking: ' + error.message);
      }

      return {
        id: data.id,
        userId: data.user_id,
        vehicleId: data.vehicle_id,
        pickupLocation: data.pickup_location,
        pickupDate: data.pickup_date,
        returnDate: data.return_date,
        rentalAmount: data.rental_amount || 0,              // ✅ NEW
        securityDeposit: data.security_deposit || 0,        // ✅ NEW
        totalPrice: data.total_price,
        status: data.status,
        customerInfo: data.customer_info,
        
        // Optional fields
        actualPickupDate: data.actual_pickup_date || null,
        actualReturnDate: data.actual_return_date || null,
        extensionCount: data.extension_count || 0,
        pickupMileage: data.pickup_mileage || null,
        returnMileage: data.return_mileage || null,
        adminNotes: data.admin_notes || '',
        
        // ✅ NEW: Deposit tracking
        securityDepositDeduction: data.security_deposit_deduction || 0,
        securityDepositAmountReturned: data.security_deposit_amount_returned || 0,
        securityDepositReturned: data.security_deposit_returned || false,
        securityDepositReturnDate: data.security_deposit_return_date || null,
        deductionReason: data.deduction_reason || '',
        
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      console.error('Get booking error:', error);
      throw error;
    }
  },

  // Update booking status
  async updateBookingStatus(id: string, status: Booking['status']): Promise<void> {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error('Update booking status error:', error);
        throw new Error('Failed to update booking status: ' + error.message);
      }
    } catch (error) {
      console.error('Update status error:', error);
      throw error;
    }
  },

  // Get all bookings (admin only)
  async getAllBookings(): Promise<Booking[]> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Fetch all bookings error:', error);
        throw new Error('Failed to fetch bookings: ' + error.message);
      }

      return (data || []).map(booking => ({
        id: booking.id,
        userId: booking.user_id,
        vehicleId: booking.vehicle_id,
        pickupLocation: booking.pickup_location,
        pickupDate: booking.pickup_date,
        returnDate: booking.return_date,
        rentalAmount: booking.rental_amount || 0,           // ✅ NEW
        securityDeposit: booking.security_deposit || 0,     // ✅ NEW
        totalPrice: booking.total_price,
        status: booking.status,
        customerInfo: booking.customer_info,
        
        // Optional fields
        actualPickupDate: booking.actual_pickup_date || null,
        actualReturnDate: booking.actual_return_date || null,
        extensionCount: booking.extension_count || 0,
        pickupMileage: booking.pickup_mileage || null,
        returnMileage: booking.return_mileage || null,
        adminNotes: booking.admin_notes || '',
        
        // ✅ NEW: Deposit tracking
        securityDepositDeduction: booking.security_deposit_deduction || 0,
        securityDepositAmountReturned: booking.security_deposit_amount_returned || 0,
        securityDepositReturned: booking.security_deposit_returned || false,
        securityDepositReturnDate: booking.security_deposit_return_date || null,
        deductionReason: booking.deduction_reason || '',
        
        createdAt: new Date(booking.created_at),
        updatedAt: new Date(booking.updated_at)
      }));
    } catch (error) {
      console.error('Get all bookings error:', error);
      throw error;
    }
  }
};