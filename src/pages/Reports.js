import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../services/translation';
import { db } from '../services/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const Reports = () => {
  const { currentUser } = useAuth();
  const { language } = useLanguage();
  const [insights, setInsights] = useState({});
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    // Fetch transactions for analysis
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const transactionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setTransactions(transactionsData);
      generateInsights(transactionsData);
    });

    return unsubscribe;
  }, [currentUser]);

  const generateInsights = (transactionsData) => {
    const cashTransactions = transactionsData.filter(t => t.type === 'cash');
    const nonCashTransactions = transactionsData.filter(t => t.type === 'non-cash');
    
    const totalRevenue = transactionsData.reduce((sum, t) => sum + t.amount, 0);
    const cashRevenue = cashTransactions.reduce((sum, t) => sum + t.amount, 0);
    const nonCashRevenue = nonCashTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    const cashRatio = totalRevenue > 0 ? (cashRevenue / totalRevenue) * 100 : 0;
    const nonCashRatio = totalRevenue > 0 ? (nonCashRevenue / totalRevenue) * 100 : 0;

    // Simulate AI-generated insights
    setInsights({
      cashRatio: Math.round(cashRatio),
      nonCashRatio: Math.round(nonCashRatio),
      totalRevenue,
      transactionCount: transactionsData.length,
      growthTrend: 'positive',
      fraudAlerts: transactionsData.length > 10 ? 0 : 1,
      recommendations: [
        'Consider increasing digital payment options to reduce cash handling',
        'Explore small business loan options for expansion',
        'Basic insurance coverage recommended',
        'Attend financial literacy workshop for better cash flow management'
      ],
      tierProgression: '25% to Intermediate'
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>AI Business Insights</h1>
        <p style={styles.subtitle}>
          Smart analysis of your business performance and growth opportunities
        </p>
      </div>

      {/* Key Metrics */}
      <div style={styles.metricsGrid}>
        <div style={styles.metricCard}>
          <div style={styles.metricHeader}>
            <h3>Cash vs Digital Ratio</h3>
            <span style={styles.metricTrend}>📊</span>
          </div>
          <div style={styles.ratioContainer}>
            <div style={styles.ratioBar}>
              <div 
                style={{
                  ...styles.cashBar,
                  width: `${insights.cashRatio || 0}%`
                }}
              >
                <span style={styles.ratioText}>Cash: {insights.cashRatio || 0}%</span>
              </div>
              <div 
                style={{
                  ...styles.digitalBar,
                  width: `${insights.nonCashRatio || 0}%`
                }}
              >
                <span style={styles.ratioText}>Digital: {insights.nonCashRatio || 0}%</span>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricHeader}>
            <h3>Revenue Overview</h3>
            <span style={styles.metricTrend}>📈</span>
          </div>
          <div style={styles.revenueSection}>
            <div style={styles.revenueItem}>
              <span style={styles.revenueLabel}>Total Revenue:</span>
              <span style={styles.revenueValue}>R{insights.totalRevenue?.toLocaleString() || 0}</span>
            </div>
            <div style={styles.revenueItem}>
              <span style={styles.revenueLabel}>Transactions:</span>
              <span style={styles.revenueValue}>{insights.transactionCount || 0}</span>
            </div>
            <div style={styles.revenueItem}>
              <span style={styles.revenueLabel}>Growth Trend:</span>
              <span style={{...styles.revenueValue, color: 'var(--success)'}}>
                {insights.growthTrend === 'positive' ? '📈 Growing' : '📉 Declining'}
              </span>
            </div>
          </div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricHeader}>
            <h3>Security Status</h3>
            <span style={styles.metricTrend}>🛡️</span>
          </div>
          <div style={styles.securitySection}>
            <div style={styles.securityItem}>
              <span style={styles.securityLabel}>Fraud Alerts:</span>
              <span style={{
                ...styles.securityValue,
                color: insights.fraudAlerts > 0 ? 'var(--error)' : 'var(--success)'
              }}>
                {insights.fraudAlerts || 0} detected
              </span>
            </div>
            <div style={styles.securityItem}>
              <span style={styles.securityLabel}>Data Privacy:</span>
              <span style={{...styles.securityValue, color: 'var(--success)'}}>🔒 Protected</span>
            </div>
          </div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricHeader}>
            <h3>Tier Progression</h3>
            <span style={styles.metricTrend}>⭐</span>
          </div>
          <div style={styles.tierSection}>
            <div style={styles.progressBar}>
              <div 
                style={{
                  ...styles.progressFill,
                  width: insights.tierProgression ? '25%' : '0%'
                }}
              ></div>
            </div>
            <div style={styles.tierInfo}>
              <span style={styles.currentTier}>Basic → Intermediate</span>
              <span style={styles.progressText}>{insights.tierProgression || '0%'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div style={styles.recommendationsSection}>
        <h2 style={styles.sectionTitle}>AI Recommendations</h2>
        <div style={styles.recommendationsGrid}>
          {(insights.recommendations || []).map((recommendation, index) => (
            <div key={index} style={styles.recommendationCard}>
              <div style={styles.recommendationIcon}>
                {index === 0 && '💳'}
                {index === 1 && '💰'}
                {index === 2 && '🛡️'}
                {index === 3 && '🎓'}
              </div>
              <p style={styles.recommendationText}>{recommendation}</p>
              <button style={styles.actionButton}>
                Learn More
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Service Offers */}
      <div style={styles.servicesSection}>
        <h2 style={styles.sectionTitle}>Recommended Services</h2>
        <div style={styles.servicesGrid}>
          <div style={styles.serviceCard}>
            <div style={styles.serviceIcon}>💰</div>
            <h3 style={styles.serviceTitle}>Business Loans</h3>
            <p style={styles.serviceDescription}>
              Access working capital and expansion funding with competitive rates
            </p>
            <div style={styles.serviceFeatures}>
              <span>✓ Up to R500,000</span>
              <span>✓ 6-24 month terms</span>
              <span>✓ AI-verified approval</span>
            </div>
            <button style={styles.serviceButton}>View Offers</button>
          </div>

          <div style={styles.serviceCard}>
            <div style={styles.serviceIcon}>🛡️</div>
            <h3 style={styles.serviceTitle}>Insurance</h3>
            <p style={styles.serviceDescription}>
              Protect your business with tailored insurance packages
            </p>
            <div style={styles.serviceFeatures}>
              <span>✓ Asset protection</span>
              <span>✓ Business interruption</span>
              <span>✓ Liability coverage</span>
            </div>
            <button style={styles.serviceButton}>Get Quotes</button>
          </div>

          <div style={styles.serviceCard}>
            <div style={styles.serviceIcon}>🎓</div>
            <h3 style={styles.serviceTitle}>Training</h3>
            <p style={styles.serviceDescription}>
              Enhance your business skills with expert-led workshops
            </p>
            <div style={styles.serviceFeatures}>
              <span>✓ Financial literacy</span>
              <span>✓ Digital skills</span>
              <span>✓ Business management</span>
            </div>
            <button style={styles.serviceButton}>Browse Courses</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  title: {
    fontSize: '36px',
    fontWeight: '700',
    marginBottom: '12px',
    color: 'var(--text-dark)'
  },
  subtitle: {
    fontSize: '18px',
    color: 'var(--text-light)',
    maxWidth: '600px',
    margin: '0 auto'
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginBottom: '40px'
  },
  metricCard: {
    background: 'var(--white)',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: 'var(--shadow)'
  },
  metricHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  metricTrend: {
    fontSize: '24px'
  },
  ratioContainer: {
    marginTop: '16px'
  },
  ratioBar: {
    display: 'flex',
    height: '40px',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  cashBar: {
    background: 'var(--success)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'width 0.5s ease'
  },
  digitalBar: {
    background: 'var(--primary-blue)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'width 0.5s ease'
  },
  ratioText: {
    color: 'var(--white)',
    fontWeight: '600',
    fontSize: '12px'
  },
  revenueSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  revenueItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  revenueLabel: {
    color: 'var(--text-light)',
    fontWeight: '500'
  },
  revenueValue: {
    fontWeight: '600',
    color: 'var(--text-dark)'
  },
  securitySection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  securityItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  securityLabel: {
    color: 'var(--text-light)',
    fontWeight: '500'
  },
  securityValue: {
    fontWeight: '600'
  },
  tierSection: {
    marginTop: '16px'
  },
  progressBar: {
    height: '8px',
    background: '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '12px'
  },
  progressFill: {
    height: '100%',
    background: 'var(--gradient-primary)',
    borderRadius: '4px',
    transition: 'width 0.5s ease'
  },
  tierInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  currentTier: {
    fontWeight: '500',
    color: 'var(--text-dark)'
  },
  progressText: {
    fontWeight: '600',
    color: 'var(--primary-blue)'
  },
  recommendationsSection: {
    marginBottom: '40px'
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '24px',
    color: 'var(--text-dark)'
  },
  recommendationsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px'
  },
  recommendationCard: {
    background: 'var(--white)',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: 'var(--shadow)',
    border: '1px solid var(--border)'
  },
  recommendationIcon: {
    fontSize: '32px',
    marginBottom: '12px'
  },
  recommendationText: {
    color: 'var(--text-dark)',
    lineHeight: '1.5',
    marginBottom: '16px'
  },
  actionButton: {
    background: 'var(--gradient-primary)',
    color: 'var(--white)',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  servicesSection: {
    marginBottom: '40px'
  },
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px'
  },
  serviceCard: {
    background: 'var(--white)',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: 'var(--shadow)',
    textAlign: 'center',
    border: '2px solid transparent',
    transition: 'border-color 0.3s'
  },
  serviceIcon: {
    fontSize: '48px',
    marginBottom: '16px'
  },
  serviceTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '12px',
    color: 'var(--text-dark)'
  },
  serviceDescription: {
    color: 'var(--text-light)',
    marginBottom: '20px',
    lineHeight: '1.5'
  },
  serviceFeatures: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    color: 'var(--text-light)'
  },
  serviceButton: {
    background: 'var(--gradient-primary)',
    color: 'var(--white)',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%'
  }
};

export default Reports;