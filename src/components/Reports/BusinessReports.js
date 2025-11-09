import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

const BusinessReports = () => {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', currentUser.uid),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const transactionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTransactions(transactionsData);
      generateReport(transactionsData);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  const generateReport = (transactionsData) => {
    if (transactionsData.length === 0) {
      setReportData(null);
      return;
    }

    // Calculate basic stats
    const cashTransactions = transactionsData.filter(t => t.type === 'cash');
    const nonCashTransactions = transactionsData.filter(t => t.type === 'non-cash');
    const receiptTransactions = transactionsData.filter(t => t.type === 'receipt');
    
    const totalRevenue = transactionsData.reduce((sum, t) => sum + t.amount, 0);
    const cashRevenue = cashTransactions.reduce((sum, t) => sum + t.amount, 0);
    const nonCashRevenue = nonCashTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    const cashRatio = totalRevenue > 0 ? (cashRevenue / totalRevenue) * 100 : 0;
    const nonCashRatio = totalRevenue > 0 ? (nonCashRevenue / totalRevenue) * 100 : 0;

    // Calculate monthly trends
    const monthlyData = calculateMonthlyTrends(transactionsData);
    
    // Category breakdown
    const categoryData = calculateCategoryBreakdown(transactionsData);
    
    // Growth analysis
    const growthData = calculateGrowth(transactionsData);

    setReportData({
      summary: {
        totalRevenue,
        transactionCount: transactionsData.length,
        cashTransactions: cashTransactions.length,
        nonCashTransactions: nonCashTransactions.length,
        receiptCount: receiptTransactions.length,
        cashRatio: Math.round(cashRatio),
        nonCashRatio: Math.round(nonCashRatio),
        averageTransaction: totalRevenue / transactionsData.length
      },
      monthlyTrends: monthlyData,
      categories: categoryData,
      growth: growthData,
      recommendations: generateRecommendations(transactionsData)
    });
  };

  const calculateMonthlyTrends = (transactions) => {
    const monthly = {};
    
    transactions.forEach(transaction => {
      const date = transaction.date?.toDate ? transaction.date.toDate() : new Date(transaction.date);
      const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      if (!monthly[monthYear]) {
        monthly[monthYear] = { revenue: 0, transactions: 0 };
      }
      
      monthly[monthYear].revenue += transaction.amount;
      monthly[monthYear].transactions += 1;
    });
    
    return Object.entries(monthly)
      .map(([month, data]) => ({
        month,
        revenue: data.revenue,
        transactions: data.transactions
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  };

  const calculateCategoryBreakdown = (transactions) => {
    const categories = {};
    
    transactions.forEach(transaction => {
      const category = transaction.category || 'Uncategorized';
      
      if (!categories[category]) {
        categories[category] = { amount: 0, count: 0 };
      }
      
      categories[category].amount += transaction.amount;
      categories[category].count += 1;
    });
    
    return Object.entries(categories)
      .map(([name, data]) => ({
        name,
        amount: data.amount,
        count: data.count,
        percentage: (data.amount / transactions.reduce((sum, t) => sum + t.amount, 0)) * 100
      }))
      .sort((a, b) => b.amount - a.amount);
  };

  const calculateGrowth = (transactions) => {
    if (transactions.length < 2) return { percentage: 0, trend: 'stable' };
    
    const sorted = [...transactions].sort((a, b) => {
      const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
      const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
      return dateA - dateB;
    });
    
    const firstMonth = sorted.slice(0, Math.floor(sorted.length / 2));
    const lastMonth = sorted.slice(Math.floor(sorted.length / 2));
    
    const firstRevenue = firstMonth.reduce((sum, t) => sum + t.amount, 0);
    const lastRevenue = lastMonth.reduce((sum, t) => sum + t.amount, 0);
    
    const growth = firstRevenue > 0 ? ((lastRevenue - firstRevenue) / firstRevenue) * 100 : 100;
    
    return {
      percentage: Math.round(growth),
      trend: growth > 0 ? 'up' : growth < 0 ? 'down' : 'stable'
    };
  };

  const generateRecommendations = (transactions) => {
    const recommendations = [];
    const cashRatio = reportData?.summary.cashRatio || 0;
    const totalRevenue = reportData?.summary.totalRevenue || 0;
    
    if (cashRatio > 70) {
      recommendations.push('Consider increasing digital payment options to reduce cash handling risks');
    }
    
    if (totalRevenue < 10000) {
      recommendations.push('Explore small business loan options to boost your working capital');
    }
    
    if (transactions.length < 10) {
      recommendations.push('Record more transactions to get better insights into your business patterns');
    }
    
    if (reportData?.growth.percentage > 20) {
      recommendations.push('Your business is growing well! Consider expansion opportunities');
    }
    
    return recommendations.length > 0 ? recommendations : ['Your business shows healthy patterns. Keep up the good work!'];
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading your business report...</div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <h2>No Data Yet</h2>
          <p>Start recording transactions to generate business reports</p>
          <a href="/transactions/cash" style={styles.primaryButton}>
            Record Your First Transaction
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Business Intelligence Report</h1>
      
      {/* Summary Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>💰</div>
          <div style={styles.statContent}>
            <h3 style={styles.statValue}>R{reportData.summary.totalRevenue.toLocaleString()}</h3>
            <p style={styles.statLabel}>Total Revenue</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>📊</div>
          <div style={styles.statContent}>
            <h3 style={styles.statValue}>{reportData.summary.transactionCount}</h3>
            <p style={styles.statLabel}>Total Transactions</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>💵</div>
          <div style={styles.statContent}>
            <h3 style={styles.statValue}>{reportData.summary.cashRatio}%</h3>
            <p style={styles.statLabel}>Cash Payments</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>💳</div>
          <div style={styles.statContent}>
            <h3 style={styles.statValue}>{reportData.summary.nonCashRatio}%</h3>
            <p style={styles.statLabel}>Digital Payments</p>
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>📈 Monthly Trends</h2>
        <div style={styles.trendsGrid}>
          {reportData.monthlyTrends.slice(-6).map((month, index) => (
            <div key={index} style={styles.trendCard}>
              <h4 style={styles.trendMonth}>{month.month}</h4>
              <p style={styles.trendAmount}>R{month.revenue.toLocaleString()}</p>
              <p style={styles.trendCount}>{month.transactions} transactions</p>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>🏷️ Spending by Category</h2>
        <div style={styles.categoriesGrid}>
          {reportData.categories.map((category, index) => (
            <div key={index} style={styles.categoryCard}>
              <h4 style={styles.categoryName}>{category.name}</h4>
              <p style={styles.categoryAmount}>R{category.amount.toLocaleString()}</p>
              <p style={styles.categoryPercentage}>{Math.round(category.percentage)}% of total</p>
              <div style={styles.progressBar}>
                <div 
                  style={{
                    ...styles.progressFill,
                    width: `${category.percentage}%`
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Growth Analysis */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>🚀 Growth Analysis</h2>
        <div style={styles.growthCard}>
          <div style={styles.growthContent}>
            <h3 style={{
              ...styles.growthValue,
              color: reportData.growth.trend === 'up' ? '#10b981' : 
                     reportData.growth.trend === 'down' ? '#ef4444' : '#6b7280'
            }}>
              {reportData.growth.trend === 'up' ? '↗' : 
               reportData.growth.trend === 'down' ? '↘' : '→'} 
              {Math.abs(reportData.growth.percentage)}%
            </h3>
            <p style={styles.growthLabel}>
              {reportData.growth.trend === 'up' ? 'Revenue Growth' :
               reportData.growth.trend === 'down' ? 'Revenue Decline' : 'Stable Revenue'}
            </p>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>💡 AI Recommendations</h2>
        <div style={styles.recommendationsCard}>
          {reportData.recommendations.map((rec, index) => (
            <div key={index} style={styles.recommendationItem}>
              <span style={styles.bullet}>•</span>
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Export Options */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>📤 Export Report</h2>
        <div style={styles.exportButtons}>
          <button style={styles.exportButton}>📄 Export as PDF</button>
          <button style={styles.exportButton}>📊 Export as Excel</button>
          <button style={styles.exportButton}>📧 Email Report</button>
        </div>
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
  loading: {
    textAlign: 'center',
    padding: '60px 20px',
    fontSize: '18px',
    color: '#6b7280'
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
  },
  primaryButton: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    marginTop: '16px'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '32px',
    color: '#1f2937',
    textAlign: 'center'
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
  section: {
    marginBottom: '32px'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '20px',
    margin: 0
  },
  trendsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px'
  },
  trendCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    textAlign: 'center',
    border: '1px solid #f1f5f9'
  },
  trendMonth: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#374151',
    margin: '0 0 8px 0'
  },
  trendAmount: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#10b981',
    margin: '0 0 4px 0'
  },
  trendCount: {
    fontSize: '0.8rem',
    color: '#6b7280',
    margin: 0
  },
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px'
  },
  categoryCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #f1f5f9'
  },
  categoryName: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#374151',
    margin: '0 0 8px 0'
  },
  categoryAmount: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 4px 0'
  },
  categoryPercentage: {
    fontSize: '0.9rem',
    color: '#6b7280',
    margin: '0 0 12px 0'
  },
  progressBar: {
    height: '6px',
    background: '#f3f4f6',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)',
    borderRadius: '3px',
    transition: 'width 0.3s ease'
  },
  growthCard: {
    background: 'white',
    padding: '32px',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    textAlign: 'center',
    maxWidth: '300px',
    margin: '0 auto'
  },
  growthValue: {
    fontSize: '2.5rem',
    fontWeight: '700',
    margin: '0 0 8px 0'
  },
  growthLabel: {
    fontSize: '1rem',
    color: '#6b7280',
    margin: 0
  },
  recommendationsCard: {
    background: 'white',
    padding: '32px',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
  },
  recommendationItem: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    marginBottom: '12px',
    fontSize: '1rem',
    color: '#374151'
  },
  bullet: {
    color: '#2563eb',
    fontWeight: '600'
  },
  exportButtons: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center'
  },
  exportButton: {
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