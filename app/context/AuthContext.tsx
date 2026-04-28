"use client";

/**
 * AuthContext - Global authentication state manager
 *
 * Provides user session, accessToken, login and logout actions
 * to the entire app via React Context.
 *
 * Usage:
 * 1. Wrap your app with <AuthProvider> in app/layout.tsx
 *
 * 2. Read auth state in any client component:
 *    const { user, accessToken, isLoading, logout } = useAuth()
 *
 * Examples:
 *    - Display user info:     <p>{user?.name}</p>
 *    - Protect a component:  if (!user) return <redirect to="/login">
 *    - Logout button:        <button onClick={logout}>Logout</button>
 *    - Show loading state:   if (isLoading) return <Spinner />
 *
 * Note: useAuth() must be called inside a component wrapped by AuthProvider.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

interface User {
  id: string;
  name: string | null;
  email: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount — try to refresh token to restore session
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data } = await axios.post("/api/auth/refresh");
        setAccessToken(data.accessToken);
        setUser(data.user);
      } catch {
        // No valid session
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await axios.post("/api/auth/login", { email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const logout = async () => {
    await axios.post("/api/auth/logout");
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, login, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
