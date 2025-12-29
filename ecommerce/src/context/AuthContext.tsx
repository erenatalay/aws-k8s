'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import Cookies from 'js-cookie';

type User = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (
    user: User,
    tokens: { accessToken: string; refreshToken: string },
  ) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in (from cookies)
    const accessToken = Cookies.get('accessToken');
    const storedUser = Cookies.get('user');
    if (accessToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (e) {
        console.error('Failed to parse user from cookie', e);
      }
    }
  }, []);

  const login = (
    user: User,
    tokens: { accessToken: string; refreshToken: string },
  ) => {
    setUser(user);
    setIsAuthenticated(true);
    // Store in cookies with secure flags
    Cookies.set('user', JSON.stringify(user), { expires: 7, sameSite: 'lax' });
    Cookies.set('accessToken', tokens.accessToken, {
      expires: 1,
      sameSite: 'lax',
    });
    Cookies.set('refreshToken', tokens.refreshToken, {
      expires: 7,
      sameSite: 'lax',
    });
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    Cookies.remove('user');
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
