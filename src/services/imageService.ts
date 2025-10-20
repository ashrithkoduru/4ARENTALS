import { supabase } from '../config/supabase';

export const imageService = {
  // Upload image to Supabase storage
  async uploadImage(file: File, fileName: string): Promise<string> {
    try {
      // Generate unique filename to avoid conflicts
      const timestamp = Date.now();
      const uniqueFileName = `${timestamp}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      
      const { data, error } = await supabase.storage
        .from('car images')
        .upload(uniqueFileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw new Error(`Failed to upload image: ${error.message}`);
      }

      // Get public URL for the uploaded image
      const { data: urlData } = supabase.storage
        .from('car images')
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      throw error;
    }
  },

  // Delete image from Supabase storage
  async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extract filename from URL
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      if (!fileName || fileName.includes('pexels.com') || fileName.includes('images.')) {
        // Skip deletion for external URLs
        return;
      }

      const { error } = await supabase.storage
        .from('car images')
        .remove([fileName]);

      if (error) {
        // Don't throw error for deletion failures, just log
      } else {
      }
    } catch (error) {
      // Don't throw error for deletion failures
    }
  },

  // Get all images from the bucket
  async listImages(): Promise<string[]> {
    try {
      const { data, error } = await supabase.storage
        .from('car images')
        .list('', {
          limit: 100,
          offset: 0
        });

      if (error) {
        throw new Error(`Failed to list images: ${error.message}`);
      }

      const imageUrls = (data || []).map(file => {
        const { data: urlData } = supabase.storage
          .from('car images')
          .getPublicUrl(file.name);
        return urlData.publicUrl;
      });

      return imageUrls;
    } catch (error) {
      throw error;
    }
  }
};