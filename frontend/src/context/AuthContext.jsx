import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const userName = localStorage.getItem("userName");
      const userRole = localStorage.getItem("userRole");

      if (token && userId) {
        setIsLoggedIn(true);
        setUser({
          id: userId,
          name: userName,
          role: userRole || 'user'
        });
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (err) {
      console.error("Auth check error:", err);
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (token, userData) => {
    try {
      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userData.id);
      localStorage.setItem("userName", userData.name);
      localStorage.setItem("userRole", userData.role || 'user');
      localStorage.setItem("user", JSON.stringify(userData));

      // Update state
      setIsLoggedIn(true);
      setUser(userData);

      return true;
    } catch (err) {
      console.error("Login state update error:", err);
      return false;
    }
  };

  const logout = () => {
    try {
      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      localStorage.removeItem("userRole");
      localStorage.removeItem("user");
      localStorage.removeItem("admin");

      // Update state
      setIsLoggedIn(false);
      setUser(null);

      return true;
    } catch (err) {
      console.error("Logout error:", err);
      return false;
    }
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isLoggedIn, 
        user, 
        loading,
        login, 
        logout,
        isAdmin,
        checkAuthStatus 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
