import { createClient } from '@supabase/supabase-js';
import Cookies from 'js-cookie';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === '' || supabaseAnonKey === '') {
  console.error('❌ Missing Supabase environment variables');
  throw new Error('Missing required Supabase environment variables');
}

// ✅ Environment Detection
const isWebContainer = 
  typeof window !== 'undefined' && (
    window.location.hostname.includes('webcontainer') ||
    window.location.hostname.includes('stackblitz') ||
    window.location.hostname.includes('bolt.new') ||
    window.location.hostname.includes('credentialless')
  );

const isDevelopment = 
  typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.protocol === 'http:'
  );

const isProduction = !isDevelopment && !isWebContainer;

// ✅ Cookie Storage Implementation (for production)
const cookieStorage = {
  getItem: (key: string): string | null => {
    try {
      return Cookies.get(key) || null;
    } catch (error) {
      console.error('Error reading cookie:', error);
      return null;
    }
  },
  
  setItem: (key: string, value: string): void => {
    try {
      Cookies.set(key, value, {
        expires: 7,
        secure: isProduction,
        sameSite: 'lax',
        path: '/'
      });
    } catch (error) {
      console.error('Error saving cookie:', error);
    }
  },
  
  removeItem: (key: string): void => {
    try {
      Cookies.remove(key, { path: '/' });
    } catch (error) {
      console.error('Error removing cookie:', error);
    }
  }
};

// ✅ localStorage Storage Implementation (for WebContainer)
const localStorageWrapper = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error reading localStorage:', error);
      return null;
    }
  },
  
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },
  
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
};

// ✅ Create Supabase Client with environment-specific storage
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: isWebContainer ? localStorageWrapper : cookieStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

// ✅ Export helper functions
export const getAuthState = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  } catch (error) {
    console.error('Error getting auth state:', error);
    return { session: null, error };
  }
};

export const refreshSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    return { session, error };
  } catch (error) {
    console.error('Error refreshing session:', error);
    return { session: null, error };
  }
};