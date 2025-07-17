import { AgeRange } from '@/constants/Settings';
import { changeLanguage, getStoredLanguage, SupportedLanguage } from '@/i18n';
import { getStoredAge, storeAge } from '@/lib/settings';
import { supabase } from '@/lib/supabase/client';
import { Session } from '@supabase/supabase-js';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Define the shape of the user data
interface User {
  id: string;
  email: string;
  // Add other user properties as needed
}

// Define the shape of the context value
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  session: Session | null;
  isLoading: boolean;
  language: SupportedLanguage | null;
  ageRange: AgeRange | null;
  setLanguage: (language: SupportedLanguage) => Promise<void>;
  setAgeRange: (ageRange: AgeRange) => Promise<void>;
  isSettingsLoading: boolean;
}

// Create the User Context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create the User Provider component
interface UserProviderProps {
  children: ReactNode;
  initialUser?: User | null; // Add initialUser prop
}

export const UserProvider: React.FC<UserProviderProps> = ({ children, initialUser = null }) => {
  const [user, setUser] = useState<User | null>(initialUser); // Initialize with initialUser
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [language, setLanguageState] = useState<SupportedLanguage | null>(null);
  const [ageRange, setAgeRangeState] = useState<AgeRange | null>(null);
  const [isSettingsLoading, setIsSettingsLoading] = useState<boolean>(true);

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      setIsSettingsLoading(true);
      try {
        const [storedLanguage, storedAge] = await Promise.all([
          getStoredLanguage(),
          getStoredAge()
        ]);
        setLanguageState(storedLanguage);
        setAgeRangeState(storedAge);
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsSettingsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Handle authentication state
  useEffect(() => {
    setIsLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user as User ?? null);
      setIsLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user as User ?? null);
        setIsLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Language setter function
  const setLanguage = async (newLanguage: SupportedLanguage) => {
    try {
      await changeLanguage(newLanguage);
      setLanguageState(newLanguage);
    } catch (error) {
      console.error('Error setting language:', error);
      throw error;
    }
  };

  // Age range setter function
  const setAgeRange = async (newAgeRange: AgeRange) => {
    try {
      await storeAge(newAgeRange);
      setAgeRangeState(newAgeRange);
    } catch (error) {
      console.error('Error setting age range:', error);
      throw error;
    }
  };

  const contextValue: UserContextType = {
    user,
    setUser,
    session,
    isLoading,
    language,
    ageRange,
    setLanguage,
    setAgeRange,
    isSettingsLoading
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the User Context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
