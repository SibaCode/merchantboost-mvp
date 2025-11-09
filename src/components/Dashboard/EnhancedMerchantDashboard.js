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
  const [activeSection, setActiveSection] = useState('overview');

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

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'actions', label: 'Quick Actions', icon: '⚡' },
    { id: 'transactions', label: 'Recent Activity', icon: '🔄' },
    { id: 'services', label: 'Services', icon: '🛡️' },
  ];

  const quickActions = [
    {
      title: "Add Cash Transaction",
      description: "Record a cash sale",
      icon: "💵",
      link: "/transactions/cash",
      color: "#10B981"
    },
    {
      title: "Upload Receipt",
      description: "Process receipt with AI",
      icon: "📄",
      link: "/transactions/receipt-upload",
      color: "#3B82F6"
    },
    {
      title: "Connect Bank",
      description: "Link your bank account",
      icon: "🏦",
      link: "/transactions/non-cash",
      color: "#8B5CF6"
    },
    {
      title: "Get Insights",
      description: "Chat with Business AI",
      icon: "🤖",
      link: "/ai-chatbot",
      color: "#F59E0B"
    }
  ];

  const renderOverview = () => (
    <div style={styles.section}>
      {/* Welcome Card */}
      <div style={styles.welcomeCard}>
        <div style={styles.welcomeHeader}>
          <h1 style={styles.welcomeTitle}>
            Welcome back, {userProfile?.businessName || 'Business'}!
          </h1>
          <div style={styles.tierBadge}>
            {userProfile?.tier?.toUpperCase() || 'STARTER'} TIER
          </div>
        </div>
        <p style={styles.welcomeText}>
          {userProfile?.registrationType === 'cipc' 
            ? "Your CIPC details are verified and ready for enhanced services."
            : "Start tracking transactions to unlock business growth opportunities."}
        </p>
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={{...styles.statIcon, background: '#ECFDF5'}}>💰</div>
          <div style={styles.statInfo}>
            <div style={styles.statValue}>R{stats.totalRevenue.toLocaleString()}</div>
            <div style={styles.statLabel}>Total Revenue</div>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={{...styles.statIcon, background: '#F0F9FF'}}>💵</div>
          <div style={styles.statInfo}>
            <div style={styles.statValue}>{stats.cashTransactions}</div>
            <div style={styles.statLabel}>Cash Transactions</div>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={{...styles.statIcon, background: '#F5F3FF'}}>💳</div>
          <div style={styles.statInfo}>
            <div style={styles.statValue}>{stats.nonCashTransactions}</div>
            <div style={styles.statLabel}>Digital Transactions</div>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={{...styles.statIcon, background: '#FFFBEB'}}>📄</div>
          <div style={styles.statInfo}>
            <div style={styles.statValue}>{stats.receiptUploads}</div>
            <div style={styles.statLabel}>Receipts Processed</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <h3 style={styles.sectionTitle}>Quick Actions</h3>
      <div style={styles.actionsGrid}>
        {quickActions.map((action, index) => (
          <a key={index} href={action.link} style={styles.actionCard}>
            <div style={{...styles.actionIcon, background: action.color}}>
              {action.icon}
            </div>
            <div style={styles.actionContent}>
              <div style={styles.actionTitle}>{action.title}</div>
              <div style={styles.actionDescription}>{action.description}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );

  const renderQuickActions = () => (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Everything You Can Do</h2>
      <div style={styles.fullActionsGrid}>
        {[
          {
            title: "QR Receipt Templates",
            description: "Download fraud-prevention receipt books",
            icon: "📱",
            link: "/templates"
          },
          {
            title: "Record Transactions",
            description: "Add cash, digital, or receipt-based transactions",
            icon: "💵",
            link: "/transactions"
          },
          {
            title: "Connect Bank Accounts",
            description: "Automatically track digital payments",
            icon: "💳",
            link: "/transactions/non-cash"
          },
          {
            title: "Business AI Chat",
            description: "Get personalized advice and insights",
            icon: "🤖",
            link: "/ai-chatbot"
          },
          {
            title: "View Reports",
            description: "See business performance analytics",
            icon: "📊",
            link: "/reports"
          },
          {
            title: "Download Templates",
            description: "Get business documents and receipts",
            icon: "📑",
            link: "/templates"
          }
        ].map((action, index) => (
          <a key={index} href={action.link} style={styles.fullActionCard}>
            <div style={styles.fullActionIcon}>{action.icon}</div>
            <div style={styles.fullActionContent}>
              <h4 style={styles.fullActionTitle}>{action.title}</h4>
              <p style={styles.fullActionDescription}>{action.description}</p>
            </div>
            <div style={styles.actionArrow}>→</div>
          </a>
        ))}
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div style={styles.section}>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>Recent Activity</h2>
        <a href="/transactions" style={styles.viewAllLink}>View All →</a>
      </div>
      
      <div style={styles.transactionsList}>
        {transactions.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📊</div>
            <h3 style={styles.emptyTitle}>No transactions yet</h3>
            <p style={styles.emptyText}>Start by recording your first transaction</p>
            <a href="/transactions/cash" style={styles.primaryButton}>
              Add First Transaction
            </a>
          </div>
        ) : (
          transactions.map(transaction => (
            <div key={transaction.id} style={styles.transactionItem}>
              <div style={styles.transactionMain}>
                <div style={styles.transactionIcon}>
                  {transaction.type === 'cash' ? '💵' : 
                   transaction.type === 'non-cash' ? '💳' : '📄'}
                </div>
                <div style={styles.transactionDetails}>
                  <div style={styles.transactionDesc}>
                    {transaction.description || 'Transaction'}
                  </div>
                  <div style={styles.transactionDate}>
                    {new Date(transaction.date?.toDate()).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div style={styles.transactionAmount}>
                R{transaction.amount}
                <div style={styles.transactionType}>
                  {transaction.type}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderServices = () => (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Available Support Services</h2>
      <div style={styles.servicesGrid}>
        {[
          {
            title: "Business Loans",
            description: "Working capital based on your transaction history",
            icon: "💰",
            status: stats.totalRevenue > 5000 ? 'eligible' : 'build',
            statusText: stats.totalRevenue > 5000 ? 'Eligible' : 'Build profile'
          },
          {
            title: "Insurance",
            description: "Tailored business insurance packages",
            icon: "🛡️",
            status: transactions.length > 10 ? 'eligible' : 'build',
            statusText: transactions.length > 10 ? 'Available' : 'Build history'
          },
          {
            title: "Training",
            description: "Business skills and financial literacy",
            icon: "🎓",
            status: 'available',
            statusText: 'Available'
          },
          {
            title: "Mentorship",
            description: "Connect with experienced business mentors",
            icon: "🏢",
            status: userProfile?.tier === 'pro' ? 'eligible' : 'upgrade',
            statusText: userProfile?.tier === 'pro' ? 'Available' : 'Upgrade tier'
          }
        ].map((service, index) => (
          <div key={index} style={styles.serviceCard}>
            <div style={styles.serviceHeader}>
              <div style={styles.serviceIcon}>{service.icon}</div>
              <div style={styles.serviceTitle}>{service.title}</div>
            </div>
            <p style={styles.serviceDescription}>{service.description}</p>
            <div style={{
              ...styles.serviceStatus,
              background: service.status === 'eligible' ? '#DCFCE7' : 
                         service.status === 'available' ? '#DBEAFE' : '#FEF3C7',
              color: service.status === 'eligible' ? '#166534' :
                     service.status === 'available' ? '#1E40AF' : '#92400E'
            }}>
              {service.statusText}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      {/* Navigation */}
      <nav style={styles.navigation}>
        {navigationItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            style={{
              ...styles.navItem,
              ...(activeSection === item.id ? styles.navItemActive : {})
            }}
          >
            <span style={styles.navIcon}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main style={styles.mainContent}>
        {activeSection === 'overview' && renderOverview()}
        {activeSection === 'actions' && renderQuickActions()}
        {activeSection === 'transactions' && renderTransactions()}
        {activeSection === 'services' && renderServices()}
      </main>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#F8FAFC',
    padding: '20px'
  },
  navigation: {
    display: 'flex',
    gap: '8px',
    background: 'white',
    padding: '8px',
    borderRadius: '12px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    border: 'none',
    background: 'transparent',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#64748B',
    transition: 'all 0.2s ease'
  },
  navItemActive: {
    background: '#3B82F6',
    color: 'white'
  },
  navIcon: {
    fontSize: '16px'
  },
  mainContent: {
    maxWidth: '1000px',
    margin: '0 auto'
  },
  section: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '24px'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1E293B',
    margin: '0 0 20px 0'
  },
  viewAllLink: {
    color: '#3B82F6',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '14px'
  },
  welcomeCard: {
    background: 'linear(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '24px',
    borderRadius: '12px',
    marginBottom: '24px'
  },
  welcomeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8px'
  },
  welcomeTitle: {
    fontSize: '24px',
    fontWeight: '700',
    margin: '0'
  },
  tierBadge: {
    background: 'rgba(255,255,255,0.2)',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600'
  },
  welcomeText: {
    margin: '0',
    opacity: '0.9',
    fontSize: '16px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '32px'
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px',
    background: '#F8FAFC',
    borderRadius: '8px',
    border: '1px solid #E2E8F0'
  },
  statIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px'
  },
  statInfo: {
    flex: 1
  },
  statValue: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: '4px'
  },
  statLabel: {
    fontSize: '14px',
    color: '#64748B'
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px'
  },
  actionCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px',
    background: 'white',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'all 0.2s ease'
  },
  actionIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    color: 'white'
  },
  actionContent: {
    flex: 1
  },
  actionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: '4px'
  },
  actionDescription: {
    fontSize: '14px',
    color: '#64748B'
  },
  fullActionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '16px'
  },
  fullActionCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px',
    background: 'white',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'all 0.2s ease'
  },
  fullActionIcon: {
    fontSize: '24px',
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#F1F5F9',
    borderRadius: '8px'
  },
  fullActionContent: {
    flex: 1
  },
  fullActionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1E293B',
    margin: '0 0 4px 0'
  },
  fullActionDescription: {
    fontSize: '14px',
    color: '#64748B',
    margin: '0'
  },
  actionArrow: {
    color: '#64748B',
    fontSize: '18px'
  },
  transactionsList: {
    spaceY: '8px'
  },
  transactionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderBottom: '1px solid #E2E8F0',
    '&:last-child': {
      borderBottom: 'none'
    }
  },
  transactionMain: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  transactionIcon: {
    fontSize: '20px'
  },
  transactionDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  transactionDesc: {
    fontWeight: '500',
    color: '#1E293B'
  },
  transactionDate: {
    fontSize: '12px',
    color: '#64748B'
  },
  transactionAmount: {
    textAlign: 'right'
  },
  transactionType: {
    fontSize: '12px',
    color: '#64748B',
    background: '#F1F5F9',
    padding: '2px 8px',
    borderRadius: '12px',
    marginTop: '4px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px'
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px'
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: '8px'
  },
  emptyText: {
    color: '#64748B',
    marginBottom: '20px'
  },
  primaryButton: {
    display: 'inline-block',
    background: '#3B82F6',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '14px'
  },
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px'
  },
  serviceCard: {
    padding: '20px',
    background: '#F8FAFC',
    borderRadius: '8px',
    border: '1px solid #E2E8F0'
  },
  serviceHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px'
  },
  serviceIcon: {
    fontSize: '20px'
  },
  serviceTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1E293B'
  },
  serviceDescription: {
    fontSize: '14px',
    color: '#64748B',
    marginBottom: '16px'
  },
  serviceStatus: {
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    textAlign: 'center'
  }
};

export default EnhancedMerchantDashboard;