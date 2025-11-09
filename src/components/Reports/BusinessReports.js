import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { db } from '../../services/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const BusinessReports = () => {
  const { currentUser } = useAuth();
  const { language } = useLanguage();
  const [transactions, setTransactions] = useState([]);
  const [insights, setInsights] = useState({});

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
      setTransactions(transactionsData);
      generateInsights(transactionsData);
    });

    return unsubscribe;
  }, [currentUser]);

  const generateInsights = (transactionsData) => {
    const cashTransactions = transactionsData.filter(t => t.type === 'cash');
    const nonCashTransactions = transactionsData.filter(t => t.type === 'non-cash');
    const receiptTransactions = transactionsData.filter(t => t.type === 'receipt');
    
    const totalRevenue = transactionsData.reduce((sum, t) => sum + t.amount, 0);
    const cashRevenue = cashTransactions.reduce((sum, t) => sum + t.amount, 0);
    const nonCashRevenue = nonCashTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    const cashRatio = totalRevenue > 0 ? (cashRevenue / totalRevenue) * 100 : 0;
    const nonCashRatio = totalRevenue > 0 ? (nonCashRevenue / totalRevenue) * 100 : 0;

    // Calculate trends (simplified)
    const lastWeekRevenue = transactionsData
      .filter(t => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return t.date?.toDate() > weekAgo;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const previousWeekRevenue = totalRevenue - lastWeekRevenue;
    const growth = previousWeekRevenue > 0 ? ((lastWeekRevenue - previousWeekRevenue) / previousWeekRevenue) * 100 : 100;

    setInsights({
      totalRevenue,
      transactionCount: transactionsData.length,
      cashRatio: Math.round(cashRatio),
      nonCashRatio: Math.round(nonCashRatio),
      growthTrend: growth > 0 ? 'positive' : 'negative',
      growthPercentage: Math.abs(Math.round(growth)),
      recommendations: [
        'Consider increasing digital payment options to 40% of transactions',
        'Your business shows healthy growth - explore expansion loans',
        'Maintain good receipt documentation for tax purposes',
        'Average transaction value: R' + (transactionsData.length > 0 ? Math.round(totalRevenue / transactionsData.length) : 0)
      ],
      alerts: transactionsData.length > 10 ? [] : ['Add more transactions to get better insights']
    });
  };

  const content = {
    en: {
      title: "Business Insights & Reports",
      subtitle: "AI-powered analysis of your business performance",
      totalRevenue: "Total Revenue",
      transactions: "Total Transactions",
      cashRatio: "Cash Transactions",
      digitalRatio: "Digital Transactions",
      growth: "Weekly Growth",
      recommendations: "AI Recommendations",
      alerts: "Important Alerts",
      positive: "up",
      negative: "down",
      noData: "Start recording transactions to see insights"
    },
    zu: {
      title: "Imininingwane Yamabhizinisi Namariphoti",
      subtitle: "Ukuhlaziywa okunamandla e-AI kokusebenza kwebhizinisi lakho",
      totalRevenue: "Isamba Semali Eningiziwe",
      transactions: "Isamba Sokutshintshiselana",
      cashRatio: "Ukutshintshiselana Ngemali",
      digitalRatio: "Ukutshintshiselana Ngedijithali",
      growth: "Ukukhula Kweviki",
      recommendations: "Izincomo Ze-AI",
      alerts: "Izexwayiso Ezibalulekile",
      positive: "phezulu",
      negative: "phansi",
      noData: "Qala ukurekhoda ukutshintshiselana ukuze ubone imininingwane"
    },
    xh: {
      title: "Iingcebiso ZeShishini Neengxelo",
      subtitle: "Uhlalutyo olunamandla lwe-AI lwenkqubo yeshishini lakho",
      totalRevenue: "Isamba SeMali Efunyenweyo",
      transactions: "Isamba Seentengiselwano",
      cashRatio: "Iintengiselwano ZeMali",
      digitalRatio: "Iintengiselwano Zedijithali",
      growth: "Ukukhula Kweveki",
      recommendations: "Iingcebiso ze-AI",
      alerts: "Iilumkiso Ezibalulekileyo",
      positive: "phezulu",
      negative: "ezantsi",
      noData: "Qala ukurekhoda iintengiselwano ukuze ubone iingcebiso"
    },
    af: {
      title: "Besigheid Insigte & Verslae",
      subtitle: "AI-aangedrewe ontleding van jou besigheidsprestasie",
      totalRevenue: "Totale Inkomste",
      transactions: "Totale Transaksies",
      cashRatio: "Kontant Transaksies",
      digitalRatio: "Digitale Transaksies",
      growth: "Weeklikse Groei",
      recommendations: "AI Aanbevelings",
      alerts: "Belangrike Waarskuwings",
      positive: "op",
      negative: "af",
      noData: "Begin om transaksies aan te teken om insigte te sien"
    }
  };

  const t = content[language] || content.en;

  if (transactions.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>{t.title}</h1>
          <p style={styles.subtitle}>{t.subtitle}</p>
        </div>
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📊</div>
          <h3 style={styles.emptyTitle}>No Data Yet</h3>
          <p style={styles.emptyDescription}>{t.noData}</p>
          <a href="/transactions/cash" style={styles.primaryButton}>
            Record Your First Transaction
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>{t.title}</h1>
        <p style={styles.subtitle}>{t.subtitle}</p>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>💰</div>
          <div style={styles.statContent}>
            <h3 style={styles.statValue}>R{insights.totalRevenue?.toLocaleString() || 0}</h3>
            <p style={styles.statLabel}>{t.totalRevenue}</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>📈</div>
          <div style={styles.statContent}>
            <h3 style={styles.statValue}>{insights.transactionCount || 0}</h3>
            <p style={styles.statLabel}>{t.transactions}</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>💵</div>
          <div style={styles.statContent}>
            <h3 style={styles.statValue}>{insights.cashRatio || 0}%</h3>
            <p style={styles.statLabel}>{t.cashRatio}</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>💳</div>
          <div style={styles.statContent}>
            <h3 style={styles.statValue}>{insights.nonCashRatio || 0}%</h3>
            <p style={styles.statLabel}>{t.digitalRatio}</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>🚀</div>
          <div style={styles.statContent}>
            <h3 style={{
              ...styles.statValue,
              color: insights.growthTrend === 'positive' ? '#10b981' : '#ef4444'
            }}>
              {insights.growthTrend === 'positive' ? '↗' : '↘'} {insights.growthPercentage || 0}%
            </h3>
            <p style={styles.statLabel}>{t.growth}</p>
          </div>
        </div>
      </div>

      <div style={styles.insightsGrid}>
        <div style={styles.recommendationsCard}>
          <h3 style={styles.cardTitle}>💡 {t.recommendations}</h3>
          <div style={styles.recommendationsList}>
            {(insights.recommendations || []).map((rec, index) => (
              <div key={index} style={styles.recommendationItem}>
                <span style={styles.bullet}>•</span>
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.alertsCard}>
          <h3 style={styles.cardTitle}>⚠️ {t.alerts}</h3>
          <div style={styles.alertsList}>
            {(insights.alerts && insights.alerts.length > 0) ? (
              insights.alerts.map((alert, index) => (
                <div key={index} style={styles.alertItem}>
                  <span style={styles.bullet}>•</span>
                  <span>{alert}</span>
                </div>
              ))
            ) : (
              <p style={styles.noAlerts}>No critical alerts at this time</p>
            )}
          </div>
        </div>
      </div>

      <div style={styles.actions}>
        <button style={styles.actionButton}>
          📧 Export Report
        </button>
        <button style={styles.actionButton}>
          🖨️ Print Summary
        </button>
        <button style={styles.actionButton}>
          💬 Share with Advisor
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
    minHeight: '100vh',
    background: '#f8fafc'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '16px'
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#6b7280',
    maxWidth: '600px',
    margin: '0 auto'
  },
  emptyState: {
    background: 'white',
    padding: '80px 40px',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    textAlign: 'center'
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '24px'
  },
  emptyTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '12px'
  },
  emptyDescription: {
    fontSize: '1.1rem',
    color: '#6b7280',
    marginBottom: '24px'
  },
  primaryButton: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1rem'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '40px'
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
  insightsGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '24px',
    marginBottom: '32px'
  },
  recommendationsCard: {
    background: 'white',
    padding: '32px',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
  },
  alertsCard: {
    background: 'white',
    padding: '32px',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
  },
  cardTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '20px',
    margin: 0
  },
  recommendationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  recommendationItem: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start'
  },
  bullet: {
    color: '#2563eb',
    fontWeight: '600'
  },
  alertsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  alertItem: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    color: '#dc2626'
  },
  noAlerts: {
    color: '#6b7280',
    fontStyle: 'italic',
    margin: 0
  },
  actions: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center'
  },
  actionButton: {
    background: 'linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer'
  }
};

export default BusinessReports;