import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';
import { Offer } from '../types';

export const useOffers = (activeOnly: boolean = false) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOffers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Add a small delay to ensure Supabase client is ready
      await new Promise(resolve => setTimeout(resolve, 100));
      
      let query = supabase.from('offers').select('*');
      
      if (activeOnly) {
        query = query.eq('active', true);
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
      
      // Map the data to match our Offer interface
      const mappedOffers: Offer[] = (data || []).map(offer => ({
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
      
      setOffers(mappedOffers);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch offers';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [activeOnly]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  return { offers, loading, error, refetch: fetchOffers };
};