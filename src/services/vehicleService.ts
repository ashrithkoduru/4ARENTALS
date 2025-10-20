import { supabase } from '../config/supabase';
import { Vehicle } from '../types';

export const vehicleService = {
  // Get all vehicles (customer portal - only available)
  async getAllVehicles(): Promise<Vehicle[]> {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('status', 'available')  // ✅ ADDED: Only fetch available vehicles
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Get all vehicles error:', error);
        throw new Error('Failed to fetch vehicles: ' + error.message);
      }

      return (data || []).map(vehicle => ({
        id: vehicle.id,
        name: vehicle.name,
        category: vehicle.category,
        price: vehicle.price,        // ✅ FIXED: Map to price_per_unit
        priceUnit: 'month',                   // ✅ FIXED: Always 'month'
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
      }));
    } catch (error) {
      console.error('Get all vehicles error:', error);
      throw error;
    }
  },

  // Get vehicles by category (customer portal - only available)
  async getVehiclesByCategory(category: string): Promise<Vehicle[]> {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('status', 'available')  // ✅ ADDED: Only fetch available vehicles
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Get vehicles by category error:', error);
        throw new Error('Failed to fetch vehicles by category: ' + error.message);
      }

      return (data || []).map(vehicle => ({
        id: vehicle.id,
        name: vehicle.name,
        category: vehicle.category,
        price: vehicle.price,
        priceUnit: 'month',
        image: vehicle.image,
        features: vehicle.features || [],
        status: vehicle.status,
        specifications: vehicle.specifications,
        
        stockNumber: vehicle.stock_number,
        licensePlate: vehicle.license_plate,
        vin: vehicle.vin,
        currentMileage: vehicle.current_mileage,
        lastServiceDate: vehicle.last_service_date,
        notes: vehicle.notes,
        
        createdAt: new Date(vehicle.created_at),
        updatedAt: new Date(vehicle.updated_at)
      }));
    } catch (error) {
      console.error('Get vehicles by category error:', error);
      throw error;
    }
  },

  // Get single vehicle (checks if available for customer portal)
  async getVehicle(id: string): Promise<Vehicle | null> {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Vehicle not found
        }
        console.error('Get vehicle error:', error);
        throw new Error('Failed to fetch vehicle: ' + error.message);
      }

      // ✅ Map database fields to Vehicle interface
      return {
        id: data.id,
        name: data.name,
        category: data.category,
        price: data.price,
        priceUnit: 'month',
        image: data.image,
        features: data.features || [],
        status: data.status,
        specifications: data.specifications,
        
        stockNumber: data.stock_number,
        licensePlate: data.license_plate,
        vin: data.vin,
        currentMileage: data.current_mileage,
        lastServiceDate: data.last_service_date,
        notes: data.notes,
        
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      console.error('Get vehicle error:', error);
      throw error;
    }
  },

  // ✅ ADMIN ONLY METHODS BELOW (used by workers portal)
  
  // Add new vehicle (admin only - NOT used by customer portal)
  async addVehicle(vehicleData: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .insert([{
          name: vehicleData.name,
          category: vehicleData.category,
          price_per_unit: vehicleData.price,           // ✅ FIXED
          price_unit: 'month',                         // ✅ FIXED: Always 'month'
          image: vehicleData.image,
          features: vehicleData.features,
          status: vehicleData.status || 'available',   // ✅ FIXED: Removed available/manual_status
          specifications: vehicleData.specifications,
          
          // ✅ NEW FIELDS (optional)
          stock_number: vehicleData.stockNumber,
          license_plate: vehicleData.licensePlate,
          vin: vehicleData.vin,
          current_mileage: vehicleData.currentMileage,
          last_service_date: vehicleData.lastServiceDate,
          notes: vehicleData.notes
        }])
        .select()
        .single();

      if (error) {
        console.error('Add vehicle error:', error);
        throw new Error('Failed to add vehicle: ' + error.message);
      }

      return data.id;
    } catch (error) {
      console.error('Add vehicle error:', error);
      throw error;
    }
  },

  // Update vehicle (admin only - NOT used by customer portal)
  async updateVehicle(id: string, updates: Partial<Vehicle>): Promise<void> {
    try {
      const updateData: any = {};
      
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.price !== undefined) updateData.price = updates.price;  // ✅ FIXED
      if (updates.priceUnit !== undefined) updateData.price_unit = 'month';        // ✅ FIXED
      if (updates.image !== undefined) updateData.image = updates.image;
      if (updates.features !== undefined) updateData.features = updates.features;
      if (updates.status !== undefined) updateData.status = updates.status;        // ✅ FIXED
      if (updates.specifications !== undefined) updateData.specifications = updates.specifications;
      
      // ✅ REMOVED: available, manual_status (deleted from schema)
      
      // ✅ NEW FIELDS (optional)
      if (updates.stockNumber !== undefined) updateData.stock_number = updates.stockNumber;
      if (updates.licensePlate !== undefined) updateData.license_plate = updates.licensePlate;
      if (updates.vin !== undefined) updateData.vin = updates.vin;
      if (updates.currentMileage !== undefined) updateData.current_mileage = updates.currentMileage;
      if (updates.lastServiceDate !== undefined) updateData.last_service_date = updates.lastServiceDate;
      if (updates.notes !== undefined) updateData.notes = updates.notes;

      const { error } = await supabase
        .from('vehicles')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Update vehicle error:', error);
        throw new Error('Failed to update vehicle: ' + error.message);
      }
    } catch (error) {
      console.error('Update vehicle error:', error);
      throw error;
    }
  },

  // Delete vehicle (admin only - NOT used by customer portal)
  async deleteVehicle(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete vehicle error:', error);
        throw new Error('Failed to delete vehicle: ' + error.message);
      }
    } catch (error) {
      console.error('Delete vehicle error:', error);
      throw error;
    }
  }
};