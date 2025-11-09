import React, { createContext, useContext, useState, useEffect } from 'react';

const MockAuthContext = createContext();

export const useAuth = () => {
  const context = useContext(MockAuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a MockAuthProvider');
  }
  return context;
};

export const MockAuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sample user profile for demo
  const sampleUserProfile = {
    businessName: 'Demo Business',
    tier: 'intermediate',
    registrationType: 'manual',
    phoneNumber: '+27 123 456 789',
    email: 'demo@merchantboost.com',
    consent: {
      incubators: true,
      municipalities: false,
      lenders: true,
      insurers: false
    }
  };

  useEffect(() => {
    // Check if user is logged in (demo mode)
    const isLoggedIn = localStorage.getItem('demoLoggedIn') === 'true';
    
    if (isLoggedIn) {
      setCurrentUser({ uid: 'demo-user-id', email: 'demo@merchantboost.com' });
      setUserProfile(sampleUserProfile);
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulate login
    setCurrentUser({ uid: 'demo-user-id', email });
    setUserProfile(sampleUserProfile);
    localStorage.setItem('demoLoggedIn', 'true');
    return Promise.resolve();
  };

  const register = async (email, password, userData) => {
    // Simulate registration
    const newUserProfile = {
      ...sampleUserProfile,
      ...userData,
      email: email
    };
    
    setCurrentUser({ uid: 'demo-user-id', email });
    setUserProfile(newUserProfile);
    localStorage.setItem('demoLoggedIn', 'true');
    return Promise.resolve();
  };

  const logout = () => {
    setCurrentUser(null);
    setUserProfile(null);
    localStorage.setItem('demoLoggedIn', 'false');
    return Promise.resolve();
  };

  const updateProfile = async (updates) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
    return Promise.resolve();
  };

  const value = {
    currentUser,
    userProfile,
    login,
    register,
    logout,
    updateProfile,
    loading
  };

  return (
    <MockAuthContext.Provider value={value}>
      {!loading && children}
    </MockAuthContext.Provider>
  );
};