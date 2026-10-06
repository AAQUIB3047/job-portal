import { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem("user") || localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password, rememberMe = false) => {
    setLoading(true);
    try {
      const response = await authApi.login({ email, password });
      const data = response.data;
      const storage = rememberMe ? localStorage : sessionStorage;

      storage.setItem("accessToken", data.accessToken);
      storage.setItem("refreshToken", data.refreshToken);
      storage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const response = await authApi.register(formData);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore network failure on logout
    } finally {
      sessionStorage.clear();
      localStorage.clear();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
