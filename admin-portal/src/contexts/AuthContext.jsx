import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const API = import.meta.env.VITE_API_BASE_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    () => localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(true);

  /* -------------------- INIT -------------------- */
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  /* -------------------- LOAD USER -------------------- */
  const loadUser = async () => {
    try {
      const res = await axios.get(`${API}/auth/me`);
      setUser(res.data.data);
    } catch (err) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- LOGIN -------------------- */
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API}/auth/login`, {
        email,
        password,
      });

      const { token, user } = res.data.data;

      localStorage.setItem("token", token);
      setToken(token); // 🔥 THIS triggers re-render
      setUser(user);

      axios.defaults.headers.common.Authorization = `Bearer ${token}`;

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

  /* -------------------- REGISTER -------------------- */
  const register = async (data) => {
    try {
      const res = await axios.post(`${API}/auth/register`, data);

      const { token, user } = res.data.data;

      localStorage.setItem("token", token);
      setToken(token);
      setUser(user);

      axios.defaults.headers.common.Authorization = `Bearer ${token}`;

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed",
      };
    }
  };

  /* -------------------- LOGOUT -------------------- */
  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common.Authorization;
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token, // ✅ KEY FIX
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

