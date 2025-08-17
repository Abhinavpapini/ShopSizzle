import { createContext, useContext } from "react";
import { useUser, useClerk } from '@clerk/clerk-react';

export type UserRole = 'user' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: UserRole | null;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  hasRole: boolean;
  signIn: () => void;
  signUp: () => void;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to get user role from localStorage
const getUserRole = (email: string): UserRole | null => {
  try {
    const role = localStorage.getItem(`user_role_${email}`);
    return (role === 'user' || role === 'admin') ? role : null;
  } catch {
    return null;
  }
};

export const useAuth = (): AuthContextType => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut, openSignIn, openSignUp } = useClerk();

  const userEmail = user?.primaryEmailAddress?.emailAddress || '';
  const userRole = userEmail ? getUserRole(userEmail) : null;

  return {
    user: user ? {
      id: user.id,
      email: userEmail,
      name: user.fullName || user.firstName || '',
      avatar: user.imageUrl || '',
      role: userRole,
    } : null,
    loading: !isLoaded,
    isAuthenticated: isSignedIn || false,
    isAdmin: userRole === 'admin',
    hasRole: userRole !== null,
    signIn: () => openSignIn(),
    signUp: () => openSignUp(),
    signOut: () => signOut(),
  };
};
