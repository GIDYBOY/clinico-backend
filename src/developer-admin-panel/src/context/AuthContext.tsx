// context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from 'react';
import { baseApiUrl } from '@/utils/constants';
import { Loader2 } from 'lucide-react';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  username: string;
  role: "patient" | "doctor" | "admin";
  createdAt: string;
  updatedAt: string;
  image?: string; // Optional field for profile picture URL
  address?: string; // Optional field for address
  dateOfBirth?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

interface LoginData {
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  const fetchSession = async () => {
    try {
      const res = await fetch(`${baseApiUrl}/auth/me`, {
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Session invalid');

      const data = await res.json();
      const normalizedUser: User = {
        ...data,
        role: data.role.toLowerCase(),
      };
      setUser(normalizedUser);
    } catch (err) {
      setUser(null);
      console.warn('No valid session:', err);
    } finally {
      setLoading(false);
    }
  };
  console.log('AuthProvider rendered');
  useEffect(() => {
    console.log('AuthProvider rendered in effect');
    fetchSession();
  }, []);

  const login = async (userData: LoginData) => {
    try {
      const response = await fetch(`${baseApiUrl}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      const normalizedUser: User = {
        ...data,
        role: data.role.toLowerCase(),
      };
      setUser(normalizedUser);
    } catch (error) {
      throw new Error('Login failed. Please check your credentials.');
    }
  };

  const logout = async () => {
    try {
      await fetch(`${baseApiUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.warn('Logout error:', err);
    } finally {
      setUser(null);
    }
  };

  const authContextValue = useMemo(() => ({
    user,
    isAuthenticated,
    login,
    logout,
    loading, // If you have a loading state for initial auth check
  }), [user, isAuthenticated, loading]);

  // Loading fallback spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
        <p className="ml-2 text-blue-600 font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
