import React, { useState } from 'react';
import { useMockData } from '../../context/MockDataContext';
import { useLanguage } from '../../context/LanguageContext';

const MockDashboard = () => {
  const { transactions, userProfile, resetData } = useMockData();
  const { language } = useLanguage();
  const [activeSection, setActiveSection] = useState('overview');

  // Calculate stats from transactions
  const stats = {
    totalRevenue: transactions.reduce((sum, t) => sum + t.amount, 0),
    cashTransactions: transactions.filter(t => t.type === 'cash').length,
    nonCashTransactions: transactions.filter(t => t.type === 'non-cash').length,
    receiptUploads: transactions.filter(t => t.type === 'receipt').length
  };

  const content = {
    en: {
      welcome: "Welcome to MerchantBoost!",
      subtitle: "Demo Mode - All data is simulated for presentation",
      overview: "Overview",
      transactions: "Transactions", 
      services: "Services",
      help: "Help",
      totalRevenue: "Total Revenue",
      cashTransactions: "Cash Transactions",
      digitalTransactions: "Digital Transactions",
      receiptsProcessed: "Receipts Processed",
      quickActions: "Quick Actions",
      recentActivity: "Recent Activity",
      noTransactions: "No transactions yet",
      supportServices: "Support Services",
      resetData: "Reset Demo Data"
    },
    zu: {
      welcome: "Wamukelekile ku-MerchantBoost!",
      subtitle: "Imodi yedemo - Yonke idatha iyalingiswa ukwenzela isethulo",
      overview: "Isishwankathelo",
      transactions: "Ukutshintshiselana",
      services: "Izinsiza",
      help: "Usizo",
      totalRevenue: "Isamba Semali",
      cashTransactions: "Ukutshintshiselana Ngemali",
      digitalTransactions: "Ukutshintshiselana Ngedijithali",
      receiptsProcessed: "Amalisiti Acutshunguliwe",
      quickActions: "Izenzo Ezesheshayo",
      recentActivity: "Umsebenzi Wakamuva",
      noTransactions: "Awekho ukutshintshiselana",
      supportServices: "Izinsiza Zokusekela",
      resetData: "Setha Kabusha Idatha Yedemo"
    }
  };

  const t = content[language] || content.en;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.welcomeTitle}>{t.welcome}</h1>
          <p style={styles.welcomeSubtitle}>{t.subtitle}</p>
          <div style={styles.businessInfo}>
            <span style={styles.businessName}>{userProfile?.businessName}</span>
            <span style={styles.tierBadge}>{userProfile?.tier?.toUpperCase()}</span>
          </div>
        </div>
        <button onClick={resetData} style={styles.resetButton}>
          🔄 {t.resetData}
        </button>
      </div>

      {/* Navigation */}
      <div style={styles.navigation}>
        <button 
          style={{...styles.navButton, ...(activeSection === 'overview' && styles.activeNavButton)}}
          onClick={() => setActiveSection('overview')}
        >
          📊 {t.overview}
        </button>
        <button 
          style={{...styles.navButton, ...(activeSection === 'transactions' && styles.activeNavButton)}}
          onClick={() => setActiveSection('transactions')}
        >
          💰 {t.transactions}
        </button>
        <button 
          style={{...styles.navButton, ...(activeSection === 'services' && styles.activeNavButton)}}
          onClick={() => setActiveSection('services')}
        >
          🛠️ {t.services}
        </button>
      </div>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <div style={styles.section}>
          {/* Stats */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>💰</div>
              <div style={styles.statContent}>
                <h3 style={styles.statValue}>R{stats.totalRevenue.toLocaleString()}</h3>
                <p style={styles.statLabel}>{t.totalRevenue}</p>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>💵</div>
              <div style={styles.statContent}>
                <h3 style={styles.statValue}>{stats.cashTransactions}</h3>
                <p style={styles.statLabel}>{t.cashTransactions}</p>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>💳</div>
              <div style={styles.statContent}>
                <h3 style={styles.statValue}>{stats.nonCashTransactions}</h3>
                <p style={styles.statLabel}>{t.digitalTransactions}</p>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>📄</div>
              <div style={styles.statContent}>
                <h3 style={styles.statValue}>{stats.receiptUploads}</h3>
                <p style={styles.statLabel}>{t.receiptsProcessed}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={styles.quickActions}>
            <h2 style={styles.sectionTitle}>🚀 {t.quickActions}</h2>
            <div style={styles.actionsGrid}>
              <a href="/transactions/cash" style={styles.actionCard}>
                <div style={styles.actionIcon}>💵</div>
                <div style={styles.actionContent}>
                  <h4 style={styles.actionTitle}>Record Cash Transaction</h4>
                  <p style={styles.actionDescription}>Scan QR codes or manually enter cash sales</p>
                </div>
                <div style={styles.actionArrow}>→</div>
              </a>

              <a href="/transactions/receipt-upload" style={styles.actionCard}>
                <div style={styles.actionIcon}>📄</div>
                <div style={styles.actionContent}>
                  <h4 style={styles.actionTitle}>Upload Receipt</h4>
                  <p style={styles.actionDescription}>Upload receipt images for AI processing</p>
                </div>
                <div style={styles.actionArrow}>→</div>
              </a>

              <a href="/ai-chatbot" style={styles.actionCard}>
                <div style={styles.actionIcon}>🤖</div>
                <div style={styles.actionContent}>
                  <h4 style={styles.actionTitle}>Chat with Business AI</h4>
                  <p style={styles.actionDescription}>Get personalized business advice</p>
                </div>
                <div style={styles.actionArrow}>→</div>
              </a>

              <a href="/reports" style={styles.actionCard}>
                <div style={styles.actionIcon}>📊</div>
                <div style={styles.actionContent}>
                  <h4 style={styles.actionTitle}>View Business Reports</h4>
                  <p style={styles.actionDescription}>See insights and recommendations</p>
                </div>
                <div style={styles.actionArrow}>→</div>
              </a>
            </div>
          </div>

          {/* Recent Activity */}
          <div style={styles.recentActivity}>
            <h2 style={styles.sectionTitle}>📈 {t.recentActivity}</h2>
            <div style={styles.transactionsList}>
              {transactions.slice(0, 5).map(transaction => (
                <div key={transaction.id} style={styles.transactionItem}>
                  <div style={styles.transactionIcon}>
                    {transaction.type === 'cash' && '💵'}
                    {transaction.type === 'non-cash' && '💳'}
                    {transaction.type === 'receipt' && '📄'}
                  </div>
                  <div style={styles.transactionDetails}>
                    <h4 style={styles.transactionTitle}>{transaction.description}</h4>
                    <p style={styles.transactionDate}>
                      {transaction.date.toLocaleDateString()}
                    </p>
                  </div>
                  <div style={styles.transactionAmount}>
                    R{transaction.amount}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Transactions Section */}
      {activeSection === 'transactions' && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>All Transactions</h2>
          <div style={styles.transactionsTable}>
            {transactions.map(transaction => (
              <div key={transaction.id} style={styles.tableRow}>
                <div style={styles.tableCell}>
                  <span style={styles.typeBadge}>{transaction.type}</span>
                </div>
                <div style={styles.tableCell}>{transaction.description}</div>
                <div style={styles.tableCell}>R{transaction.amount}</div>
                <div style={styles.tableCell}>
                  {transaction.date.toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Services Section */}
      {activeSection === 'services' && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🛠️ {t.supportServices}</h2>
          <div style={styles.servicesGrid}>
            <div style={styles.serviceCard}>
              <h3>💰 Business Loans</h3>
              <p>Access working capital based on your transaction history</p>
              <div style={styles.serviceStatus}>
                {stats.totalRevenue > 5000 ? '✅ Eligible' : '📈 Build profile'}
              </div>
            </div>
            <div style={styles.serviceCard}>
              <h3>🛡️ Insurance</h3>
              <p>Protect your business with tailored packages</p>
              <div style={styles.serviceStatus}>
                {stats.cashTransactions > 3 ? '✅ Available' : '📈 Build history'}
              </div>
            </div>
            <div style={styles.serviceCard}>
              <h3>🎓 Training</h3>
              <p>Business skills and financial literacy workshops</p>
              <div style={styles.serviceStatus}>✅ Available</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    background: '#f8fafc',
    minHeight: '100vh'
  },
  header: {
    background: 'linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)',
    color: 'white',
    padding: '32px',
    borderRadius: '16px',
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  headerContent: {
    flex: 1
  },
  welcomeTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '8px',
    margin: 0
  },
  welcomeSubtitle: {
    fontSize: '1.2rem',
    opacity: '0.9',
    marginBottom: '20px',
    margin: 0
  },
  businessInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  businessName: {
    fontSize: '1.3rem',
    fontWeight: '600'
  },
  tierBadge: {
    background: 'rgba(255, 255, 255, 0.2)',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '600',
    border: '1px solid rgba(255, 255, 255, 0.3)'
  },
  resetButton: {
    background: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    padding: '12px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  navigation: {
    display: 'flex',
    gap: '8px',
    marginBottom: '32px',
    background: 'white',
    padding: '8px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  navButton: {
    flex: 1,
    padding: '16px 20px',
    border: 'none',
    background: 'transparent',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  activeNavButton: {
    background: 'linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)',
    color: 'white',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
  },
  section: {
    // Section container
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '32px'
  },
  statCard: {
    background: 'white',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  statIcon: {
    fontSize: '2rem',
    width: '60px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    borderRadius: '12px'
  },
  statContent: {
    flex: 1
  },
  statValue: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '4px',
    margin: 0
  },
  statLabel: {
    color: '#6b7280',
    fontSize: '0.9rem',
    fontWeight: '500',
    margin: 0
  },
  quickActions: {
    marginBottom: '32px'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '20px',
    margin: 0
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '16px'
  },
  actionCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'all 0.3s ease',
    border: '1px solid #f1f5f9'
  },
  actionIcon: {
    fontSize: '1.5rem',
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f8fafc',
    borderRadius: '10px',
    flexShrink: 0
  },
  actionContent: {
    flex: 1
  },
  actionTitle: {
    margin: '0 0 8px 0',
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1f2937'
  },
  actionDescription: {
    margin: 0,
    fontSize: '0.9rem',
    color: '#6b7280',
    lineHeight: '1.4'
  },
  actionArrow: {
    fontSize: '1.2rem',
    color: '#2563eb',
    fontWeight: '600'
  },
  recentActivity: {
    marginBottom: '32px'
  },
  transactionsList: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    overflow: 'hidden'
  },
  transactionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 20px',
    borderBottom: '1px solid #f1f5f9'
  },
  transactionIcon: {
    fontSize: '1.2rem',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f8fafc',
    borderRadius: '8px',
    flexShrink: 0
  },
  transactionDetails: {
    flex: 1
  },
  transactionTitle: {
    margin: '0 0 4px 0',
    fontSize: '1rem',
    fontWeight: '500',
    color: '#1f2937'
  },
  transactionDate: {
    margin: 0,
    fontSize: '0.8rem',
    color: '#6b7280'
  },
  transactionAmount: {
    fontWeight: '600',
    color: '#10b981',
    fontSize: '1.1rem'
  },
  transactionsTable: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    overflow: 'hidden'
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '100px 1fr 100px 120px',
    gap: '16px',
    padding: '16px 20px',
    borderBottom: '1px solid #f1f5f9',
    alignItems: 'center'
  },
  tableCell: {
    display: 'flex',
    alignItems: 'center'
  },
  typeBadge: {
    background: '#f0f9ff',
    color: '#2563eb',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '600'
  },
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px'
  },
  serviceCard: {
    background: 'white',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    border: '1px solid #f1f5f9'
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

export default MockDashboard;