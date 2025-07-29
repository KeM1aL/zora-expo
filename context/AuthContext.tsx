import { supabase } from '@/lib/supabase/client';
import { AuthContextType, AuthState } from '@/lib/supabase/types';
import { Session } from '@supabase/supabase-js';
import { useRouter } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Create the auth context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial auth state
const initialState: AuthState = {
  session: null,
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isAnonymous: false,
  error: null,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);
  const router = useRouter();

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          updateAuthState(session);
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }

        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (_event, session) => {
            updateAuthState(session);
          }
        );

        // Clean up subscription on unmount
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: error instanceof Error ? error : new Error('Unknown error') 
        }));
      }
    };

    initializeAuth();
  }, []);

  // Helper to update auth state based on session
  const updateAuthState = (session: Session | null) => {
    if (session) {
      const user = session.user;
      const isAnonymous = user?.app_metadata?.provider === 'anonymous';
      
      setState({
        session,
        user,
        isLoading: false,
        isAuthenticated: true,
        isAnonymous,
        error: null,
      });
    } else {
      setState({
        session: null,
        user: null,
        isLoading: false,
        isAuthenticated: false,
        isAnonymous: false,
        error: null,
      });
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      
      // If user was anonymous before, we need to link the accounts
      if (state.isAnonymous && state.user) {
        // This step is handled in linkAccount method
        // We would typically call linkAccount here
      }
      
      updateAuthState(data.session);
      
      // Reload after signUp
      router.reload();
    } catch (error) {
      console.error('Error signing up:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error : new Error('Failed to sign up') 
      }));
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      updateAuthState(data.session);
      
      // Reload after successful login
      router.reload();
    } catch (error) {
      console.error('Error signing in:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error : new Error('Failed to sign in') 
      }));
    }
  };

  // Sign in with Google OAuth
  const signInWithGoogle = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/auth/callback',
        },
      });

      if (error) throw error;
      
      // OAuth redirects, so we don't need to update state here
      // The onAuthStateChange listener will handle it when the user returns
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error : new Error('Failed to sign in with Google') 
      }));
    }
  };

  // Sign in anonymously
  const signInAnonymously = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { data, error } = await supabase.auth.signInAnonymously();

      if (error) throw error;
      
      updateAuthState(data.session);
      
      // Navigate to main app after anonymous login
      router.push('/');
    } catch (error) {
      console.error('Error signing in anonymously:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error : new Error('Failed to sign in as guest') 
      }));
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setState({
        ...initialState,
        isLoading: false,
      });
      
      // Reload page after logout
      router.reload();
    } catch (error) {
      console.error('Error signing out:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error : new Error('Failed to sign out') 
      }));
    }
  };

  // Link anonymous account to permanent account
  const linkAccount = async (email: string, password: string) => {
    try {
      if (!state.isAnonymous || !state.user) {
        throw new Error('No anonymous session to upgrade');
      }

      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // First create a new account
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;
      
      // Then link the anonymous identity to the new account
      // Note: This is a simplified version. In a real implementation,
      // you would need to handle the email verification flow.
      const { error: linkError } = await supabase.auth.updateUser({
        email,
        password,
      });

      if (linkError) throw linkError;
      
      // Update auth state with the new session
      if (signUpData.session) {
        updateAuthState(signUpData.session);
      }
      
      // Navigate to account page after successful account linking
      router.push('/account');
    } catch (error) {
      console.error('Error linking account:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error : new Error('Failed to upgrade account') 
      }));
    }
  };

  // Reset auth error
  const resetAuthError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  // Provide auth context value
  const contextValue: AuthContextType = {
    ...state,
    signUp,
    signIn,
    signInWithGoogle,
    signInAnonymously,
    signOut,
    linkAccount,
    resetAuthError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
