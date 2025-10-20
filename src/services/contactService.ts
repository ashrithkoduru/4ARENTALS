import { supabase } from '../config/supabase';

export interface ContactMessage {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'read' | 'responded';
  created_at: string;
}

export const contactService = {
  // Submit contact message
  async submitMessage(messageData: Omit<ContactMessage, 'id' | 'status' | 'created_at'>): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([{
          first_name: messageData.first_name,
          last_name: messageData.last_name,
          email: messageData.email,
          phone: messageData.phone,
          message: messageData.message,
          status: 'new'
        }])
        .select()
        .single();

      if (error) {
        throw new Error('Failed to submit message');
      }

      return data.id;
    } catch (error) {
      throw error;
    }
  },

  // Get all contact messages (admin only)
  async getAllMessages(): Promise<ContactMessage[]> {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error('Failed to fetch messages');
      }

      return data || [];
    } catch (error) {
      throw error;
    }
  },

  // Update message status (admin only)
  async updateMessageStatus(id: string, status: ContactMessage['status']): Promise<void> {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', id);

      if (error) {
        throw new Error('Failed to update message status');
      }
    } catch (error) {
      throw error;
    }
  }
};