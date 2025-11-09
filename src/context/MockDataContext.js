import React, { createContext, useContext, useState, useEffect } from 'react';

const MockDataContext = createContext();

export const useMockData = () => {
  const context = useContext(MockDataContext);
  if (!context) {
    throw new Error('useMockData must be used within a MockDataProvider');
  }
  return context;
};

export const MockDataProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sample transactions data
  const sampleTransactions = [
    {
      id: '1',
      type: 'cash',
      amount: 2500,
      description: 'Weekly sales from store',
      merchant: 'Retail Store',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'completed',
      validated: true,
      qrCode: 'MB-QR-001'
    },
    {
      id: '2',
      type: 'non-cash',
      amount: 1500,
      description: 'Online customer payment',
      merchant: 'E-commerce',
      bankName: 'FNB',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: 'completed',
      validated: true
    },
    {
      id: '3',
      type: 'receipt',
      amount: 450,
      description: 'Office supplies purchase',
      merchant: 'Stationery Store',
      date: new Date(),
      status: 'completed',
      validated: true,
      receiptImage: 'mock-receipt-url'
    },
    {
      id: '4',
      type: 'cash',
      amount: 3200,
      description: 'Weekend market sales',
      merchant: 'Market Stall',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: 'completed',
      validated: true,
      qrCode: 'MB-QR-002'
    },
    {
      id: '5',
      type: 'non-cash',
      amount: 800,
      description: 'Supplier payment',
      merchant: 'Wholesaler',
      bankName: 'Standard Bank',
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      status: 'completed',
      validated: true
    }
  ];

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
    // Load sample data on startup
    setTransactions(sampleTransactions);
    setUserProfile(sampleUserProfile);
  }, []);

  const addTransaction = (transaction) => {
    const newTransaction = {
      id: Date.now().toString(),
      ...transaction,
      date: new Date(),
      status: 'completed',
      validated: true
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    return Promise.resolve(newTransaction);
  };

  const updateUserProfile = (updates) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
    return Promise.resolve();
  };

  const resetData = () => {
    setTransactions(sampleTransactions);
    setUserProfile(sampleUserProfile);
  };

  const value = {
    transactions,
    userProfile,
    loading,
    addTransaction,
    updateUserProfile,
    resetData
  };

  return (
    <MockDataContext.Provider value={value}>
      {children}
    </MockDataContext.Provider>
  );
};