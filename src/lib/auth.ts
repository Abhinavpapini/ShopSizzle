import { createContext, useContext } from "react";
import { useUser, useClerk } from '@clerk/clerk-react';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: () => void;
  signUp: () => void;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut, openSignIn, openSignUp } = useClerk();

  return {
    user: user ? {
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress || '',
      name: user.fullName || user.firstName || '',
      avatar: user.imageUrl || '',
    } : null,
    loading: !isLoaded,
    isAuthenticated: isSignedIn || false,
    signIn: () => openSignIn(),
    signUp: () => openSignUp(),
    signOut: () => signOut(),
  };
};
