import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';
import { Vehicle } from '../types';

export const useVehicles = (category?: string) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Add a small delay to ensure Supabase client is ready
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // ✅ FIXED: Only fetch available vehicles
      let query = supabase
        .from('vehicles')
        .select('*')
        .eq('status', 'available');  // ✅ CRITICAL: Only available vehicles
      
      if (category && category !== 'all' && category !== 'best-fit') {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        // Check if it's an auth error
        if (error.message?.includes('JWT') || error.message?.includes('auth')) {
          setError('Authentication error. Please refresh the page.');
        } else {
          throw new Error(`Database error: ${error.message}`);
        }
        return;
      }
      
      // ✅ FIXED: Map to new schema fields
      const mappedVehicles: Vehicle[] = (data || []).map(vehicle => {
        // ✅ DEBUG: Log each vehicle
        
        return {
          id: vehicle.id,
          name: vehicle.name,
          category: vehicle.category,
          price: vehicle.price,        // ✅ CRITICAL FIX!
          priceUnit: 'month',                   // ✅ Always 'month'
          image: vehicle.image,
          features: vehicle.features || [],
          status: vehicle.status,
          specifications: vehicle.specifications,
          
          // ✅ NEW FIELDS (optional)
          stockNumber: vehicle.stock_number,
          licensePlate: vehicle.license_plate,
          vin: vehicle.vin,
          currentMileage: vehicle.current_mileage,
          lastServiceDate: vehicle.last_service_date,
          notes: vehicle.notes,
          
          createdAt: new Date(vehicle.created_at),
          updatedAt: new Date(vehicle.updated_at)
        };
      });
    
      setVehicles(mappedVehicles);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch vehicles';
      console.error('❌ Error fetching vehicles:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // Set up real-time subscription for vehicle status changes
  useEffect(() => {
    const subscription = supabase
      .channel('vehicles-changes')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'vehicles' 
        }, 
        (payload) => {
          // Refresh vehicles when any vehicle is updated
          fetchVehicles();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchVehicles]);

  return { vehicles, loading, error, refetch: fetchVehicles };
};