import React, { createContext, useContext, useState, useEffect } from 'react';
import { LANGUAGES } from '../utils/constants';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('merchantboost-language');
    if (savedLanguage && LANGUAGES[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (newLanguage) => {
    if (LANGUAGES[newLanguage]) {
      setIsLoading(true);
      setLanguage(newLanguage);
      localStorage.setItem('merchantboost-language', newLanguage);
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  const value = {
    language,
    changeLanguage,
    isLoading,
    availableLanguages: LANGUAGES
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};