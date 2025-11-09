import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getTranslation } from '../../services/translation';
import { db } from '../../services/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const MerchantDashboard = () => {
  const { userProfile, currentUser } = useAuth();
  const { language } = useLanguage();
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    cashTransactions: 0,
    nonCashTransactions: 0,
    pendingInsights: 3
  });

  useEffect(() => {
    if (!currentUser) return;

    // Listen to transactions
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const transactionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTransactions(transactionsData.slice(-5).reverse()); // Last 5 transactions

      // Calculate stats
      const totalRevenue = transactionsData.reduce((sum, t) => sum + t.amount, 0);
      const cashTransactions = transactionsData.filter(t => t.type === 'cash').length;
      const nonCashTransactions = transactionsData.filter(t => t.type === 'non-cash').length;

      setStats({
        totalRevenue,
        cashTransactions,
        nonCashTransactions,
        pendingInsights: 3 // Mock data
      });
    });

    return unsubscribe;
  }, [currentUser]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          {getTranslation('dashboard.title', language)}
        </h1>
        <div style={styles.tier}>
          <span style={styles.tierBadge}>
            {userProfile?.tier?.toUpperCase() || 'BASIC'}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={styles.grid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>💰</div>
          <div style={styles.statContent}>
            <h3 style={styles.statValue}>
              R{stats.totalRevenue.toLocaleString()}
            </h3>
            <p style={styles.statLabel}>
              {getTranslation('dashboard.revenue', language)}
            </p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>💵</div>
          <div style={styles.statContent}>
            <h3 style={styles.statValue}>{stats.cashTransactions}</h3>
            <p style={styles.statLabel}>
              {getTranslation('dashboard.cash', language)}
            </p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>💳</div>
          <div style={styles.statContent}>
            <h3 style={styles.statValue}>{stats.nonCashTransactions}</h3>
            <p style={styles.statLabel}>
              {getTranslation('dashboard.noncash', language)}
            </p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>🤖</div>
          <div style={styles.statContent}>
            <h3 style={styles.statValue}>{stats.pendingInsights}</h3>
            <p style={styles.statLabel}>
              {getTranslation('dashboard.insights', language)}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.actionGrid}>
          <a href="/transactions/cash" style={styles.actionCard}>
            <div style={styles.actionIcon}>📱</div>
            <span>Scan Cash Receipt</span>
          </a>
          <a href="/transactions/non-cash" style={styles.actionCard}>
            <div style={styles.actionIcon}>🏦</div>
            <span>Add Bank Transaction</span>
          </a>
          <a href="/ai-chatbot" style={styles.actionCard}>
            <div style={styles.actionIcon}>💬</div>
            <span>AI Business Assistant</span>
          </a>
          <a href="/reports" style={styles.actionCard}>
            <div style={styles.actionIcon}>📊</div>
            <span>View Insights</span>
          </a>
            <a href="/settings/consent" style={styles.actionCard}>
            <div style={styles.actionIcon}>⚙️</div>
            <span>Consent Settings</span>
        </a>
        <a href="/transactions/receipt-upload" style={styles.actionCard}>
  <div style={styles.actionIcon}>📄</div>
  <span>Upload Receipt</span>
</a>
        </div>
      </div>

      {/* Recent Transactions */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>
          {getTranslation('dashboard.transactions', language)}
        </h2>
        <div style={styles.transactions}>
          {transactions.length === 0 ? (
            <p style={styles.noData}>No transactions yet</p>
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px'
  },
  title: {
    fontSize: '32px',
    fontWeight: '600',
    color: 'var(--text-dark)'
  },
  tierBadge: {
    background: 'var(--gradient-primary)',
    color: 'var(--white)',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
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
  section: {
    marginBottom: '40px'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '16px',
    color: 'var(--text-dark)'
  },
  actionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px'
  },
  actionCard: {
    background: 'var(--white)',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: 'var(--shadow)',
    textDecoration: 'none',
    color: 'var(--text-dark)',
    textAlign: 'center',
    transition: 'transform 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
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
    color: 'var(--success)'
  },
  noData: {
    padding: '40px',
    textAlign: 'center',
    color: 'var(--text-light)'
  }
};

export default MerchantDashboard;