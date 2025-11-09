import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getTranslation } from '../../services/translation';
import { db } from '../../services/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const EnhancedMerchantDashboard = () => {
  const { userProfile, currentUser } = useAuth();
  const { language } = useLanguage();
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    cashTransactions: 0,
    nonCashTransactions: 0,
    receiptUploads: 0
  });
  const [showHelp, setShowHelp] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const transactionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTransactions(transactionsData.slice(-5).reverse());

      const cashTransactions = transactionsData.filter(t => t.type === 'cash').length;
      const nonCashTransactions = transactionsData.filter(t => t.type === 'non-cash').length;
      const receiptUploads = transactionsData.filter(t => t.type === 'receipt').length;
      const totalRevenue = transactionsData.reduce((sum, t) => sum + t.amount, 0);

      setStats({
        totalRevenue,
        cashTransactions,
        nonCashTransactions,
        receiptUploads
      });
    });

    return unsubscribe;
  }, [currentUser]);

  const getWelcomeMessage = () => {
    if (userProfile?.registrationType === 'cipc') {
      return "Welcome registered business! Your CIPC details are verified and stored.";
    } else if (userProfile?.registrationType === 'tax') {
      return "Welcome! Your tax-registered business can access enhanced financial services.";
    } else {
      return "Welcome! Start tracking your transactions to build your business profile.";
    }
  };

  const getNextSteps = () => {
    const steps = [
      {
        title: "📱 Use QR Receipt Templates",
        description: "Download and use our QR-coded receipt books to prevent fraud",
        action: "Download Templates",
        link: "/templates"
      },
      {
        title: "💵 Record Cash Transactions",
        description: "Scan QR codes from your receipts or manually enter cash sales",
        action: "Add Cash Transaction",
        link: "/transactions/cash"
      },
      {
        title: "💳 Connect Bank Accounts",
        description: "Link your bank for automatic digital transaction tracking",
        action: "Connect Bank",
        link: "/transactions/non-cash"
      },
      {
        title: "📄 Upload Receipts",
        description: "Upload receipt images for AI-powered validation and digitization",
        action: "Upload Receipt",
        link: "/transactions/receipt-upload"
      },
      {
        title: "🤖 Chat with Business AI",
        description: "Get personalized business advice and health reports",
        action: "Start Chat",
        link: "/ai-chatbot"
      },
      {
        title: "📊 View Business Insights",
        description: "See your business performance and get recommendations",
        action: "View Reports",
        link: "/reports"
      }
    ];

    return steps;
  };

  return (
    <div style={styles.container}>
      {/* Welcome Section */}
      <div style={styles.welcomeSection}>
        <div style={styles.welcomeContent}>
          <h1 style={styles.welcomeTitle}>
            Welcome to MerchantBoost, {userProfile?.businessName}!
          </h1>
          <p style={styles.welcomeMessage}>{getWelcomeMessage()}</p>
          <div style={styles.tierSection}>
            <span style={styles.tierBadge}>
              {userProfile?.tier?.toUpperCase() || 'STARTER'} TIER
            </span>
            <span style={styles.tierDescription}>
              {userProfile?.tier === 'basic' && 'Track transactions and get basic insights'}
              {userProfile?.tier === 'intermediate' && 'Access loans and insurance offers'}
              {userProfile?.tier === 'pro' && 'Premium financial services and mentorship'}
            </span>
          </div>
        </div>
        <button 
          onClick={() => setShowHelp(!showHelp)}
          style={styles.helpToggle}
        >
          {showHelp ? 'Hide Help' : 'Show Help'}
        </button>
      </div>

      {/* Help Section */}
      {showHelp && (
        <div style={styles.helpSection}>
          <h3 style={styles.helpTitle}>🚀 Getting Started Guide</h3>
          <div style={styles.helpGrid}>
            <div style={styles.helpCard}>
              <h4>📋 Step 1: Use QR Receipts</h4>
              <p>Download our special receipt books with QR codes. Every receipt has a unique code that prevents fraud and ensures transaction authenticity.</p>
              <ul>
                <li>Unique QR codes for each receipt</li>
                <li>Prevents duplicate entries</li>
                <li>Builds trust with customers</li>
              </ul>
            </div>
            <div style={styles.helpCard}>
              <h4>💵 Step 2: Record Transactions</h4>
              <p>Track all your business income and expenses:</p>
              <ul>
                <li><strong>Cash:</strong> Scan QR codes or manual entry</li>
                <li><strong>Digital:</strong> Connect bank accounts automatically</li>
                <li><strong>Receipts:</strong> Upload images for AI processing</li>
              </ul>
            </div>
            <div style={styles.helpCard}>
              <h4>🤖 Step 3: Get AI Insights</h4>
              <p>Our AI analyzes your business data to provide:</p>
              <ul>
                <li>Business health reports</li>
                <li>Loan and grant eligibility</li>
                <li>Fraud detection and alerts</li>
                <li>Personalized recommendations</li>
              </ul>
            </div>
            <div style={styles.helpCard}>
              <h4>🎯 Step 4: Access Services</h4>
              <p>Based on your business profile, access:</p>
              <ul>
                <li>Business loans and funding</li>
                <li>Insurance packages</li>
                <li>Training and mentorship</li>
                <li>Government support programs</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div style={styles.statsSection}>
        <h3 style={styles.sectionTitle}>Your Business at a Glance</h3>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>💰</div>
            <div style={styles.statContent}>
              <h3 style={styles.statValue}>R{stats.totalRevenue.toLocaleString()}</h3>
              <p style={styles.statLabel}>Total Revenue</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>💵</div>
            <div style={styles.statContent}>
              <h3 style={styles.statValue}>{stats.cashTransactions}</h3>
              <p style={styles.statLabel}>Cash Transactions</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>💳</div>
            <div style={styles.statContent}>
              <h3 style={styles.statValue}>{stats.nonCashTransactions}</h3>
              <p style={styles.statLabel}>Digital Transactions</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📄</div>
            <div style={styles.statContent}>
              <h3 style={styles.statValue}>{stats.receiptUploads}</h3>
              <p style={styles.statLabel}>Receipts Processed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Grid */}
      <div style={styles.actionsSection}>
        <h3 style={styles.sectionTitle}>What Would You Like to Do?</h3>
        <div style={styles.actionsGrid}>
          {getNextSteps().map((step, index) => (
            <div key={index} style={styles.actionCard}>
              <div style={styles.actionHeader}>
                <div style={styles.actionIcon}>{step.title.split(' ')[0]}</div>
                <h4 style={styles.actionTitle}>{step.title.split(' ').slice(1).join(' ')}</h4>
              </div>
              <p style={styles.actionDescription}>{step.description}</p>
              <a href={step.link} style={styles.actionButton}>
                {step.action}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div style={styles.activitySection}>
        <h3 style={styles.sectionTitle}>Recent Activity</h3>
        <div style={styles.transactions}>
          {transactions.length === 0 ? (
            <div style={styles.noData}>
              <p>No transactions yet. Start by adding your first transaction!</p>
              <small>Your transactions will appear here as you record them.</small>
            </div>
          ) : (
            transactions.map(transaction => (
              <div key={transaction.id} style={styles.transaction}>
                <div style={styles.transactionInfo}>
                  <span style={styles.transactionDesc}>
                    {transaction.description}
                  </span>
                  <span style={styles.transactionDate}>
                    {new Date(transaction.date?.toDate()).toLocaleDateString()}
                  </span>
                </div>
                <div style={styles.transactionAmount}>
                  R{transaction.amount}
                  <span style={styles.transactionType}>
                    {transaction.type}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Support Services Preview */}
      <div style={styles.servicesSection}>
        <h3 style={styles.sectionTitle}>Available Support Services</h3>
        <div style={styles.servicesGrid}>
          <div style={styles.serviceCard}>
            <h4>💰 Business Loans</h4>
            <p>Access working capital based on your transaction history</p>
            <div style={styles.serviceStatus}>
              {stats.totalRevenue > 5000 ? '✅ Eligible' : '📈 Build profile'}
            </div>
          </div>
          <div style={styles.serviceCard}>
            <h4>🛡️ Insurance</h4>
            <p>Protect your business with tailored insurance packages</p>
            <div style={styles.serviceStatus}>
              {stats.transactionCount > 10 ? '✅ Available' : '📈 Build history'}
            </div>
          </div>
          <div style={styles.serviceCard}>
            <h4>🎓 Training</h4>
            <p>Business skills and financial literacy workshops</p>
            <div style={styles.serviceStatus}>✅ Available</div>
          </div>
          <div style={styles.serviceCard}>
            <h4>🏢 Mentorship</h4>
            <p>Connect with experienced business mentors</p>
            <div style={styles.serviceStatus}>
              {userProfile?.tier === 'pro' ? '✅ Available' : '⭐ Upgrade tier'}
            </div>
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
  welcomeSection: {
    background: 'var(--gradient-primary)',
    color: 'var(--white)',
    padding: '32px',
    borderRadius: '16px',
    marginBottom: '32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  welcomeContent: {
    flex: 1
  },
  welcomeTitle: {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '12px'
  },
  welcomeMessage: {
    fontSize: '18px',
    opacity: '0.9',
    marginBottom: '20px',
    maxWidth: '600px'
  },
  tierSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  tierBadge: {
    background: 'rgba(255, 255, 255, 0.2)',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
    border: '1px solid rgba(255, 255, 255, 0.3)'
  },
  tierDescription: {
    fontSize: '14px',
    opacity: '0.8'
  },
  helpToggle: {
    background: 'rgba(255, 255, 255, 0.2)',
    color: 'var(--white)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500'
  },
  helpSection: {
    background: 'var(--white)',
    padding: '32px',
    borderRadius: '12px',
    boxShadow: 'var(--shadow)',
    marginBottom: '32px'
  },
  helpTitle: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '24px',
    color: 'var(--text-dark)'
  },
  helpGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px'
  },
  helpCard: {
    padding: '20px',
    background: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid var(--border)'
  },
  statsSection: {
    marginBottom: '32px'
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '24px',
    color: 'var(--text-dark)'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '24px'
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
  actionsSection: {
    marginBottom: '32px'
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px'
  },
  actionCard: {
    background: 'var(--white)',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: 'var(--shadow)',
    border: '2px solid transparent',
    transition: 'transform 0.3s ease'
  },
  actionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '16px'
  },
  actionIcon: {
    fontSize: '24px',
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-light)',
    borderRadius: '8px'
  },
  actionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--text-dark)',
    margin: 0
  },
  actionDescription: {
    color: 'var(--text-light)',
    marginBottom: '20px',
    lineHeight: '1.5'
  },
  actionButton: {
    display: 'inline-block',
    background: 'var(--gradient-primary)',
    color: 'var(--white)',
    padding: '12px 20px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  },
  activitySection: {
    marginBottom: '32px'
  },
  transactions: {
    background: 'var(--white)',
    borderRadius: '12px',
    boxShadow: 'var(--shadow)',
    overflow: 'hidden'
  },
  transaction: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    borderBottom: '1px solid var(--border)'
  },
  transactionInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  transactionDesc: {
    fontWeight: '500',
    color: 'var(--text-dark)'
  },
  transactionDate: {
    fontSize: '12px',
    color: 'var(--text-light)'
  },
  transactionAmount: {
    fontWeight: '600',
    color: 'var(--success)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px'
  },
  transactionType: {
    fontSize: '12px',
    color: 'var(--text-light)',
    background: '#f1f5f9',
    padding: '2px 8px',
    borderRadius: '12px'
  },
  noData: {
    padding: '60px 40px',
    textAlign: 'center',
    color: 'var(--text-light)'
  },
  servicesSection: {
    marginBottom: '40px'
  },
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px'
  },
  serviceCard: {
    background: 'var(--white)',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: 'var(--shadow)',
    border: '1px solid var(--border)'
  },
  serviceStatus: {
    marginTop: '12px',
    padding: '8px 12px',
    background: '#f0f9ff',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    textAlign: 'center'
  }
};

export default EnhancedMerchantDashboard;