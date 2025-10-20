import { supabase } from '../config/supabase';
import { Offer } from '../types';

export const offerService = {
  // Get all offers
  async getAllOffers(): Promise<Offer[]> {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error('Failed to fetch offers');
      }

      return (data || []).map(offer => ({
        id: offer.id,
        title: offer.title,
        description: offer.description,
        discount: offer.discount,
        icon: offer.icon,
        iconColor: offer.icon_color,
        buttonText: offer.button_text,
        active: offer.active,
        createdAt: new Date(offer.created_at),
        updatedAt: new Date(offer.updated_at)
      }));
    } catch (error) {
      throw error;
    }
  },

  // Get active offers only
  async getActiveOffers(): Promise<Offer[]> {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error('Failed to fetch active offers');
      }

      return (data || []).map(offer => ({
        id: offer.id,
        title: offer.title,
        description: offer.description,
        discount: offer.discount,
        icon: offer.icon,
        iconColor: offer.icon_color,
        buttonText: offer.button_text,
        active: offer.active,
        createdAt: new Date(offer.created_at),
        updatedAt: new Date(offer.updated_at)
      }));
    } catch (error) {
      throw error;
    }
  },

  // Get single offer
  async getOffer(id: string): Promise<Offer | null> {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Offer not found
        }
        throw new Error('Failed to fetch offer');
      }

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        discount: data.discount,
        icon: data.icon,
        iconColor: data.icon_color,
        buttonText: data.button_text,
        active: data.active,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      throw error;
    }
  },

  // Add new offer (admin only)
  async addOffer(offerData: Omit<Offer, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('offers')
        .insert([{
          title: offerData.title,
          description: offerData.description,
          discount: offerData.discount,
          icon: offerData.icon,
          icon_color: offerData.iconColor,
          button_text: offerData.buttonText,
          active: offerData.active
        }])
        .select()
        .single();

      if (error) {
        throw new Error('Failed to add offer');
      }

      return data.id;
    } catch (error) {
      throw error;
    }
  },

  // Update offer (admin only)
  async updateOffer(id: string, updates: Partial<Offer>): Promise<void> {
    try {
      const updateData: any = {};
      
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.discount !== undefined) updateData.discount = updates.discount;
      if (updates.icon !== undefined) updateData.icon = updates.icon;
      if (updates.iconColor !== undefined) updateData.icon_color = updates.iconColor;
      if (updates.buttonText !== undefined) updateData.button_text = updates.buttonText;
      if (updates.active !== undefined) updateData.active = updates.active;

      const { error } = await supabase
        .from('offers')
        .update(updateData)
        .eq('id', id);

      if (error) {
        throw new Error('Failed to update offer');
      }
    } catch (error) {
      throw error;
    }
  },

  // Delete offer (admin only)
  async deleteOffer(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error('Failed to delete offer');
      }
    } catch (error) {
      throw error;
    }
  }
};