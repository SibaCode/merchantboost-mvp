import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../services/translation';

const Landing = () => {
  const { language } = useLanguage();

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            {getTranslation('welcome.title', language)}
          </h1>
          <p style={styles.heroSubtitle}>
            {getTranslation('welcome.subtitle', language)}
          </p>
          <div style={styles.heroButtons}>
            <a href="/register" style={styles.primaryButton}>
              {getTranslation('signup', language)}
            </a>
            <a href="/login" style={styles.secondaryButton}>
              {getTranslation('login', language)}
            </a>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section style={styles.benefits}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Key Benefits</h2>
          <div style={styles.grid}>
            <div style={styles.card}>
              <div style={styles.cardIcon}>💰</div>
              <h3 style={styles.cardTitle}>
                {getTranslation('benefits.track', language)}
              </h3>
              <p style={styles.cardText}>
                Track all your business transactions in one place
              </p>
            </div>
            
            <div style={styles.card}>
              <div style={styles.cardIcon}>🤖</div>
              <h3 style={styles.cardTitle}>
                {getTranslation('benefits.insights', language)}
              </h3>
              <p style={styles.cardText}>
                Get AI-powered insights to grow your business
              </p>
            </div>
            
            <div style={styles.card}>
              <div style={styles.cardIcon}>🚀</div>
              <h3 style={styles.cardTitle}>
                {getTranslation('benefits.support', language)}
              </h3>
              <p style={styles.cardText}>
                Access tailored financial products and mentorship
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section style={styles.privacy}>
        <div style={styles.container}>
          <div style={styles.privacyCard}>
            <h2 style={styles.privacyTitle}>
              {getTranslation('privacy.title', language)}
            </h2>
            <p style={styles.privacyText}>
              {getTranslation('privacy.description', language)}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px'
  },
  hero: {
    background: 'var(--gradient-primary)',
    color: 'var(--white)',
    padding: '100px 0',
    textAlign: 'center'
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: '700',
    marginBottom: '24px',
    lineHeight: '1.2'
  },
  heroSubtitle: {
    fontSize: '20px',
    marginBottom: '40px',
    opacity: '0.9'
  },
  heroButtons: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  primaryButton: {
    display: 'inline-block',
    background: 'var(--white)',
    color: 'var(--primary-blue)',
    padding: '16px 32px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '16px',
    transition: 'transform 0.3s ease'
  },
  secondaryButton: {
    display: 'inline-block',
    border: '2px solid var(--white)',
    color: 'var(--white)',
    padding: '16px 32px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '16px',
    transition: 'all 0.3s ease'
  },
  benefits: {
    padding: '80px 0',
    background: 'var(--bg-light)'
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: '36px',
    fontWeight: '600',
    marginBottom: '48px',
    color: 'var(--text-dark)'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '32px'
  },
  card: {
    background: 'var(--white)',
    padding: '32px',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: 'var(--shadow)',
    transition: 'transform 0.3s ease'
  },
  cardIcon: {
    fontSize: '48px',
    marginBottom: '16px'
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '12px',
    color: 'var(--text-dark)'
  },
  cardText: {
    color: 'var(--text-light)',
    lineHeight: '1.6'
  },
  privacy: {
    padding: '80px 0',
    background: 'var(--white)'
  },
  privacyCard: {
    background: 'var(--gradient-secondary)',
    color: 'var(--white)',
    padding: '48px',
    borderRadius: '16px',
    textAlign: 'center',
    maxWidth: '800px',
    margin: '0 auto'
  },
  privacyTitle: {
    fontSize: '32px',
    fontWeight: '600',
    marginBottom: '16px'
  },
  privacyText: {
    fontSize: '18px',
    lineHeight: '1.6',
    opacity: '0.9'
  }
};

export default Landing;