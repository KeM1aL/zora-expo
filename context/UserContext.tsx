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
  isLoading: boolean
  // Add other context values/functions as needed
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

  const contextValue: UserContextType = {
    user,
    setUser,
    session,
    isLoading
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
