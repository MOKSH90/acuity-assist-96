import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

type UserRole = "admin" | "doctor" | "nurse";

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

interface JWTPayload {
  sub: string; // usually the user ID
  email: string;
  name: string;
  role: UserRole;
  exp: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load user from stored token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<JWTPayload>(token);
        setUser({
          id: decoded.sub,
          email: decoded.email,
          name: decoded.name,
          role: (localStorage.getItem("role") as UserRole) || "nurse",
        });
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log("Attempting login with:", email, password);
    try {
      const res = await axios.post(
        "https://3cd378cbfa6f.ngrok-free.app/auth/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
console.log("Login response:", res);
      const data = res.data;

      console.log("Login successful, received data:", data);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("refreshToken", data.refresh_token);
localStorage.setItem("role", data.role);
      const decoded = jwtDecode<JWTPayload>(data.access_token);
      setUser({
        id: decoded.sub,
        email: email,
        name: decoded.name,
        role: data.role,
      });

      return true;
    } catch (err) {
      console.error("Login failed", err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
