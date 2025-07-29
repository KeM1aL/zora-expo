import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { AgeRange } from '../constants/Settings';
import { supabase } from '../lib/supabase/client';
import { useSettingsStore } from '../store/useSettingsStore';
import { AuthContext } from './AuthContext';

interface UserProfile {
  email: string;
  name: string;
  credits: number;
  membership_plan: string;
  last_purchase_date: string | null;
  next_purchase_date: string | null;
}

interface UserPreferences {
  age: AgeRange | null;
  language: string | null;
}

interface UserContextType {
  preferences: UserPreferences;
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  reloadProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { session, isLoading: isAuthLoading } = useContext(AuthContext)!;
  const { age, language } = useSettingsStore();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const preferences: UserPreferences = {
    age: age,
    language: language,
  };

  const fetchProfile = useCallback(async () => {
    if (!session?.user?.id) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('email, name, credits, membership_plan, last_purchase_date, next_purchase_date')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      if (data) {
        setProfile({
          email: data.email || '',
          name: data.name || '',
          credits: data.credits || 0,
          membership_plan: data.membership_plan || 'free',
          last_purchase_date: data.last_purchase_date,
          next_purchase_date: data.next_purchase_date,
        });
      } else {
        setProfile(null);
      }
    } catch (err: any) {
      console.error('Error fetching user profile:', err.message);
      setError(err.message || 'Failed to load user profile.');
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (!isAuthLoading) {
      if (!session) {
        // Clear user context on sign out
        setProfile(null);
        setError(null);
        setIsLoading(false);
        return;
      }
      fetchProfile();
    }
  }, [session, isAuthLoading, fetchProfile]);

  const reloadProfile = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  const value = {
    preferences,
    profile,
    isLoading,
    error,
    reloadProfile,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
