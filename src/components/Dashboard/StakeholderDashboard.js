import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getTranslation } from '../../services/translation';
import { db } from '../../services/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

  // ... rest of the component code remains the same
const StakeholderDashboard = ({ stakeholderType }) => {
  const { userProfile } = useAuth();
  const { language } = useLanguage();
  const [merchants, setMerchants] = useState([]);
  const [stats, setStats] = useState({
    totalMerchants: 0,
    activeMerchants: 0,
    totalRevenue: 0,
    averageTier: 'Basic'
  });

  useEffect(() => {
    if (!userProfile) return;

    // Query merchants who have consented to share data with this stakeholder type
    const q = query(
      collection(db, 'users'),
      where('userType', '==', 'merchant'),
      where(`consent.${stakeholderType}`, '==', true)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const merchantsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setMerchants(merchantsData);
      
      // Calculate stats
      const totalRevenue = merchantsData.reduce((sum, merchant) => sum + (merchant.monthlyRevenue || 0), 0);
      const activeMerchants = merchantsData.filter(m => m.status === 'active').length;
      
      setStats({
        totalMerchants: merchantsData.length,
        activeMerchants,
        totalRevenue,
        averageTier: 'Intermediate' // Simplified calculation
      });
    });

    return unsubscribe;
  }, [userProfile, stakeholderType]);

  const getStakeholderConfig = () => {
    const configs = {
      incubators: {
        title: 'Business Incubator Dashboard',
        icon: '🏢',
        color: '#10b981',
        features: ['Mentorship Programs', 'Training Sessions', 'Grant Opportunities']
      },
      municipalities: {
        title: 'Municipality Dashboard',
        icon: '🏛️',
        color: '#3b82f6',
        features: ['Economic Reporting', 'Area Development', 'Formalization Programs']
      },
      lenders: {
        title: 'Lender Dashboard',
        icon: '💰',
        color: '#f59e0b',
        features: ['Loan Offers', 'Risk Assessment', 'Financial Products']
      },
      insurers: {
        title: 'Insurer Dashboard',
        icon: '🛡️',
        color: '#ef4444',
        features: ['Insurance Packages', 'Risk Mitigation', 'Coverage Options']
      }
    };
    return configs[stakeholderType] || configs.incubators;
  };

  const config = getStakeholderConfig();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.titleSection}>
            <span style={styles.icon}>{config.icon}</span>
            <div>
              <h1 style={styles.title}>{config.title}</h1>
              <p style={styles.subtitle}>
                Monitoring merchant growth and providing targeted support
              </p>
            </div>
          </div>
          <div style={styles.consentNote}>
            🔒 Data access based on merchant consent
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>👥</div>
          <div style={styles.statContent}>
            <h3 style={styles.statValue}>{stats.totalMerchants}</h3>
            <p style={styles.statLabel}>Total Merchants</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>📈</div>
          <div style={styles.statContent}>
            <h3 style={styles.statValue}>R{stats.totalRevenue.toLocaleString()}</h3>
            <p style={styles.statLabel}>Combined Revenue</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>🎯</div>
          <div style={styles.statContent}>
            <h3 style={styles.statValue}>{stats.activeMerchants}</h3>
            <p style={styles.statLabel}>Active Merchants</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>⭐</div>
          <div style={styles.statContent}>
            <h3 style={styles.statValue}>{stats.averageTier}</h3>
            <p style={styles.statLabel}>Average Tier</p>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div style={styles.actionSection}>
        <h2 style={styles.sectionTitle}>Available Actions</h2>
        <div style={styles.actionGrid}>
          {config.features.map((feature, index) => (
            <div key={index} style={styles.actionCard}>
              <h3 style={styles.actionTitle}>{feature}</h3>
              <p style={styles.actionDescription}>
                Provide support and services to qualified merchants
              </p>
              <button style={styles.actionButton}>
                Explore Options
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Merchants List */}
      <div style={styles.merchantsSection}>
        <h2 style={styles.sectionTitle}>Consenting Merchants</h2>
        <div style={styles.merchantsGrid}>
          {merchants.length === 0 ? (
            <div style={styles.noData}>
              <p>No merchants have consented to share data yet.</p>
              <small>Merchants must explicitly enable data sharing in their settings.</small>
            </div>
          ) : (
            merchants.map(merchant => (
              <div key={merchant.id} style={styles.merchantCard}>
                <div style={styles.merchantHeader}>
                  <h3 style={styles.merchantName}>{merchant.businessName}</h3>
                  <span style={{
                    ...styles.tierBadge,
                    background: config.color
                  }}>
                    {merchant.tier?.toUpperCase() || 'BASIC'}
                  </span>
                </div>
                
                <div style={styles.merchantInfo}>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Revenue Trend:</span>
                    <span style={styles.infoValue}>📈 Growing</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Cash/Digital Ratio:</span>
                    <span style={styles.infoValue}>60/40</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Support Needs:</span>
                    <span style={styles.infoValue}>Funding, Training</span>
                  </div>
                </div>

                <div style={styles.merchantActions}>
                  <button style={styles.viewButton}>
                    View Insights
                  </button>
                  <button style={styles.contactButton}>
                    Offer Support
                  </button>
                </div>

                <div style={styles.dataAccessNote}>
                  <small>
                    🔐 Limited to aggregated insights only - no raw transaction data
                  </small>
                </div>
              </div>
            ))
          )}
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
    background: 'var(--white)',
    padding: '32px',
    borderRadius: '12px',
    boxShadow: 'var(--shadow)',
    marginBottom: '32px'
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  titleSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  icon: {
    fontSize: '48px'
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    margin: 0,
    color: 'var(--text-dark)'
  },
  subtitle: {
    color: 'var(--text-light)',
    margin: 0,
    fontSize: '16px'
  },
  consentNote: {
    background: '#fef3c7',
    color: '#92400e',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '24px',
    marginBottom: '40px'
  },
  statCard: {
    background: 'var(--white)',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: 'var(--shadow)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  statIcon: {
    fontSize: '32px',
    width: '60px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--gradient-secondary)',
    borderRadius: '12px'
  },
  statContent: {
    flex: 1
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '600',
    color: 'var(--text-dark)',
    marginBottom: '4px'
  },
  statLabel: {
    color: 'var(--text-light)',
    fontSize: '14px'
  },
  actionSection: {
    marginBottom: '40px'
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '24px',
    color: 'var(--text-dark)'
  },
  actionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px'
  },
  actionCard: {
    background: 'var(--white)',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: 'var(--shadow)',
    border: '2px solid var(--border)'
  },
  actionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '12px',
    color: 'var(--text-dark)'
  },
  actionDescription: {
    color: 'var(--text-light)',
    marginBottom: '20px',
    lineHeight: '1.5'
  },
  actionButton: {
    background: 'var(--gradient-primary)',
    color: 'var(--white)',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  merchantsSection: {
    marginBottom: '40px'
  },
  merchantsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '24px'
  },
  merchantCard: {
    background: 'var(--white)',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: 'var(--shadow)',
    border: '1px solid var(--border)'
  },
  merchantHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  merchantName: {
    fontSize: '18px',
    fontWeight: '600',
    margin: 0,
    color: 'var(--text-dark)'
  },
  tierBadge: {
    color: 'var(--white)',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600'
  },
  merchantInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '20px'
  },
  infoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px'
  },
  infoLabel: {
    color: 'var(--text-light)',
    fontWeight: '500'
  },
  infoValue: {
    color: 'var(--text-dark)',
    fontWeight: '500'
  },
  merchantActions: {
    display: 'flex',
    gap: '12px',
    marginBottom: '12px'
  },
  viewButton: {
    flex: 1,
    background: 'var(--gradient-primary)',
    color: 'var(--white)',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  contactButton: {
    flex: 1,
    background: 'var(--white)',
    color: 'var(--primary-blue)',
    border: '1px solid var(--primary-blue)',
    padding: '10px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  dataAccessNote: {
    textAlign: 'center',
    color: 'var(--text-light)',
    fontSize: '12px'
  },
  noData: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '60px 20px',
    background: 'var(--white)',
    borderRadius: '12px',
    boxShadow: 'var(--shadow)'
  }
};

export default StakeholderDashboard;