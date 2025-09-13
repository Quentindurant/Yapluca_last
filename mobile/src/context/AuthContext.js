import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(async (user) => {
      if (user) {
        setUser(user);
        setIsAuthenticated(true);
        
        // Get additional user data from Firestore
        const userData = await authService.getUserData(user.uid);
        setUserData(userData);
      } else {
        setUser(null);
        setUserData(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    // Check for existing session
    checkExistingSession();

    return unsubscribe;
  }, []);

  const checkExistingSession = async () => {
    const session = await authService.checkSession();
    if (session && !authService.getCurrentUser()) {
      // Session exists but user not authenticated, clear session
      await authService.logout();
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    const result = await authService.login(email, password);
    setLoading(false);
    return result;
  };

  const register = async (email, password, userData) => {
    setLoading(true);
    const result = await authService.register(email, password, userData);
    setLoading(false);
    return result;
  };

  const logout = async () => {
    setLoading(true);
    const result = await authService.logout();
    setLoading(false);
    return result;
  };

  const value = {
    user,
    userData,
    loading,
    isAuthenticated,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
