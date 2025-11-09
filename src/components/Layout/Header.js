import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSelector from './LanguageSelector';
import { getTranslation } from '../../services/translation';

const Header = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const { language } = useLanguage();

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <div style={styles.logo}>
          <h1 style={styles.logoText}>MerchantBoost</h1>
        </div>
        
        <div style={styles.nav}>
          <LanguageSelector />
          
          {currentUser ? (
            <div style={styles.userSection}>
              <span style={styles.userName}>
                {userProfile?.businessName || userProfile?.email}
              </span>
              <button 
                onClick={logout}
                style={styles.logoutBtn}
              >
                {getTranslation('logout', language)}
              </button>
            </div>
          ) : (
            <div style={styles.authButtons}>
              <a href="/login" style={styles.authLink}>
                {getTranslation('login', language)}
              </a>
              <a href="/register" style={{...styles.authLink, ...styles.signupLink}}>
                {getTranslation('signup', language)}
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    background: 'var(--gradient-primary)',
    color: 'var(--white)',
    padding: '16px 0',
    boxShadow: 'var(--shadow)'
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px'
  },
  logoText: {
    fontSize: '24px',
    fontWeight: '700'
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  userName: {
    fontWeight: '500'
  },
  logoutBtn: {
    background: 'rgba(255, 255, 255, 0.2)',
    color: 'var(--white)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.3s ease'
  },
  authButtons: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },
  authLink: {
    color: 'var(--white)',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontWeight: '500',
    transition: 'all 0.3s ease'
  },
  signupLink: {
    background: 'rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.3)'
  }
};

export default Header;