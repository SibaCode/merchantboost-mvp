import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const LanguageSelector = () => {
  const { language, changeLanguage, availableLanguages } = useLanguage();

  return (
    <select 
      value={language} 
      onChange={(e) => changeLanguage(e.target.value)}
      style={styles.select}
    >
      {Object.entries(availableLanguages).map(([code, lang]) => (
        <option key={code} value={code}>
          {lang.nativeName}
        </option>
      ))}
    </select>
  );
};

const styles = {
  select: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'var(--white)',
    cursor: 'pointer'
  }
};

export default LanguageSelector;