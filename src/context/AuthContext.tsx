import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import type { User } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  currentUser: User | null;
  userData: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithOAuth: (provider: 'google' | 'apple') => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setCurrentUser(null);
          setUserData(null);
        } else if (session?.user) {
          console.log('Found existing session for:', session.user.email);
          setCurrentUser(session.user);
          await ensureUserProfile(session.user);
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event);
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in:', session.user.email);
          setCurrentUser(session.user);
          
          // For OAuth sign-ins, ensure profile exists
          await ensureUserProfile(session.user);
          await fetchUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setCurrentUser(null);
          setUserData(null);
        } else if (event === 'USER_UPDATED' && session?.user) {
          console.log('User updated:', session.user.email);
          setCurrentUser(session.user);
          await fetchUserProfile(session.user.id);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          console.log('Token refreshed for:', session.user.email);
          setCurrentUser(session.user);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Ensure user profile exists (mainly for OAuth users)
  const ensureUserProfile = async (user: User) => {
    try {
      // Check if profile already exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error checking profile:', fetchError);
        return;
      }

      if (!existingProfile) {
        console.log('Creating profile for new OAuth user:', user.email);
        
        // Extract name from user metadata
        const metadata = user.user_metadata || {};
        
        // Try different fields that OAuth providers might use
        let firstName = metadata.given_name || 
                       metadata.first_name || 
                       metadata.full_name?.split(' ')[0] || 
                       metadata.name?.split(' ')[0] || 
                       user.email?.split('@')[0] || 
                       'User';
                       
        let lastName = metadata.family_name || 
                      metadata.last_name || 
                      metadata.full_name?.split(' ').slice(1).join(' ') || 
                      metadata.name?.split(' ').slice(1).join(' ') || 
                      '';

        // Create the profile
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            id: user.id,
            first_name: firstName,
            last_name: lastName
          });

        if (insertError) {
          // Ignore duplicate key errors (race condition)
          if (insertError.code !== '23505') {
            console.error('Error creating profile:', insertError);
          }
        } else {
          console.log('Profile created successfully');
        }
      }
    } catch (error) {
      console.error('Error in ensureUserProfile:', error);
    }
  };

  // Fetch user profile data
  const fetchUserProfile = async (userId: string): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('Profile not found yet');
          // Profile might still be creating, retry once
          setTimeout(async () => {
            const { data: retryData } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', userId)
              .single();
            
            if (retryData) {
              setUserData(retryData);
            }
          }, 1000);
        } else {
          console.error('Error fetching profile:', error);
        }
      } else if (data) {
        setUserData(data);
        console.log('Profile fetched:', data);
      }
    } catch (error) {
      console.error('Exception in fetchUserProfile:', error);
    }
  };

  // Email/Password login
  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        console.log('Login successful:', email);
        setCurrentUser(data.user);
        await fetchUserProfile(data.user.id);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  // OAuth login (Google, Apple, etc.)
  const loginWithOAuth = async (provider: 'google' | 'apple'): Promise<void> => {
    try {
      console.log(`Initiating ${provider} OAuth flow`);
      
      // Simple approach following Supabase docs
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        console.error(`OAuth error for ${provider}:`, error);
        throw error;
      }

      // If we get here, the redirect should happen automatically
      if (data?.url) {
        console.log('Redirecting to OAuth provider...');
        // The Supabase client should handle the redirect automatically
        // but if it doesn't, we can do it manually:
        // window.location.href = data.url;
      }
    } catch (error: any) {
      console.error(`OAuth ${provider} error:`, error);
      throw new Error(error.message || `Failed to sign in with ${provider}`);
    }
  };

  // Register new user
  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<void> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            first_name: firstName,
            last_name: lastName
          });

        if (profileError && profileError.code !== '23505') {
          console.error('Profile creation error:', profileError);
        }

        console.log('Registration successful:', email);
        setCurrentUser(data.user);
        await fetchUserProfile(data.user.id);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        throw error;
      }
      
      setCurrentUser(null);
      setUserData(null);
      console.log('Logged out successfully');
    } catch (error: any) {
      console.error('Logout exception:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    currentUser,
    userData,
    loading,
    login,
    loginWithOAuth,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};