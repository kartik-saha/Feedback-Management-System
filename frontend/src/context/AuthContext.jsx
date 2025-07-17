// src/context/AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check auth on load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const loginTime = parseInt(localStorage.getItem('loginTime'), 10);
    const now = Date.now();

    // 30 minutes = 30 * 60 * 1000 = 1800000ms
    if (token && loginTime && now - loginTime < 30 * 60 * 1000) {
      setIsLoggedIn(true);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('loginTime');
      setIsLoggedIn(false);
    }
  }, []);

  const login = () => {
    const timeNow = Date.now();
    localStorage.setItem('loginTime', timeNow.toString());
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loginTime');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
