import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../services/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

const StakeholderDashboard = () => {
  const { merchantId } = useParams();
  const navigate = useNavigate();
  const [merchantData, setMerchantData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for demonstration
  const mockMerchantData = {
    merchantId: 'MCH-001',
    businessName: 'Siba Spaza Shop',
    ownerName: 'Siba Nkosi',
    location: 'Soweto, Johannesburg',
    businessType: 'Retail Grocery',
    registrationDate: '2023-01-15',
    businessAge: '1 year 8 months',
    category: 'spaza',
    contact: '+27 72 123 4567',
    email: 'siba@spaza.co.za'
  };

  const mockTransactions = [
    {
      id: '1',
      date: '2024-11-15',
      amount: 845.50,
      type: 'cash',
      description: 'Daily grocery sales',
      receiptNumber: 'RCP-20241115-001',
      items: ['Bread', 'Milk', 'Cooking Oil', 'Sugar']
    },
    {
      id: '2', 
      date: '2024-11-14',
      amount: 1200.75,
      type: 'cash',
      description: 'Weekend sales peak',
      receiptNumber: 'RCP-20241114-001',
      items: ['Maize Meal', 'Canned Goods', 'Beverages']
    },
    {
      id: '3',
      date: '2024-11-13',
      amount: 650.25,
      type: 'cash',
      description: 'Regular daily sales',
      receiptNumber: 'RCP-20241113-001',
      items: ['Snacks', 'AirTime', 'Basic Goods']
    }
  ];

  const mockAnalytics = {
    totalRevenue: 45678.90,
    averageTransaction: 845.50,
    transactionCount: 54,
    growthRate: 15.2,
    creditScore: 72,
    riskLevel: 'LOW',
    customerRetention: 68,
    peakHours: '16:00-18:00',
    bestSelling: ['Maize Meal', 'Bread', 'Milk']
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMerchantData(mockMerchantData);
      setTransactions(mockTransactions);
      setLoading(false);
    }, 1000);
  }, [merchantId]);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading merchant financial profile...</p>
      </div>
    );
  }

  const renderOverview = () => (
    <div style={styles.overviewGrid}>
      <div style={styles.overviewCard}>
        <h3 style={styles.cardTitle}>Business Summary</h3>
        <div style={styles.summaryGrid}>
          <div style={styles.summaryItem}>
            <div style={styles.summaryValue}>R{mockAnalytics.totalRevenue.toLocaleString()}</div>
            <div style={styles.summaryLabel}>Total Revenue</div>
          </div>
          <div style={styles.summaryItem}>
            <div style={styles.summaryValue}>{mockAnalytics.transactionCount}</div>
            <div style={styles.summaryLabel}>Transactions</div>
          </div>
          <div style={styles.summaryItem}>
            <div style={styles.summaryValue}>R{mockAnalytics.averageTransaction}</div>
            <div style={styles.summaryLabel}>Avg. Transaction</div>
          </div>
          <div style={styles.summaryItem}>
            <div style={styles.summaryValue}>{mockAnalytics.growthRate}%</div>
            <div style={styles.summaryLabel}>Growth Rate</div>
          </div>
        </div>
      </div>

      <div style={styles.overviewCard}>
        <h3 style={styles.cardTitle}>Credit Assessment</h3>
        <div style={styles.creditScore}>
          <div style={styles.scoreCircle}>
            <div style={styles.scoreValue}>{mockAnalytics.creditScore}</div>
            <div style={styles.scoreLabel}>Score</div>
          </div>
          <div style={styles.scoreDetails}>
            <div style={styles.scoreItem}>
              <span style={styles.scoreLabel}>Risk Level:</span>
              <span style={{
                ...styles.scoreValue,
                color: mockAnalytics.riskLevel === 'LOW' ? '#10b981' : '#f59e0b'
              }}>
                {mockAnalytics.riskLevel}
              </span>
            </div>
            <div style={styles.scoreItem}>
              <span style={styles.scoreLabel}>Retention:</span>
              <span style={styles.scoreValue}>{mockAnalytics.customerRetention}%</span>
            </div>
            <div style={styles.scoreItem}>
              <span style={styles.scoreLabel}>Business Age:</span>
              <span style={styles.scoreValue}>{merchantData.businessAge}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.overviewCard}>
        <h3 style={styles.cardTitle}>Business Insights</h3>
        <div style={styles.insightsList}>
          <div style={styles.insightItem}>
            <div style={styles.insightIcon}>📈</div>
            <div style={styles.insightText}>
              <strong>Consistent Growth:</strong> 15.2% monthly revenue increase
            </div>
          </div>
          <div style={styles.insightItem}>
            <div style={styles.insightIcon}>🕒</div>
            <div style={styles.insightText}>
              <strong>Peak Hours:</strong> Highest sales between 4-6 PM
            </div>
          </div>
          <div style={styles.insightItem}>
            <div style={styles.insightIcon}>🛒</div>
            <div style={styles.insightText}>
              <strong>Top Products:</strong> Maize Meal, Bread, Milk
            </div>
          </div>
          <div style={styles.insightItem}>
            <div style={styles.insightIcon}>💳</div>
            <div style={styles.insightText}>
              <strong>Credit Ready:</strong> Eligible for working capital loan
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div style={styles.transactionsSection}>
      <div style={styles.sectionHeader}>
        <h3 style={styles.cardTitle}>Recent Transactions</h3>
        <button style={styles.exportButton}>Export Report</button>
      </div>
      <div style={styles.transactionsList}>
        {transactions.map(transaction => (
          <div key={transaction.id} style={styles.transactionItem}>
            <div style={styles.transactionMain}>
              <div style={styles.transactionDate}>
                {new Date(transaction.date).toLocaleDateString()}
              </div>
              <div style={styles.transactionDescription}>
                {transaction.description}
              </div>
              <div style={styles.transactionAmount}>
                R{transaction.amount}
              </div>
            </div>
            <div style={styles.transactionDetails}>
              <div style={styles.transactionMeta}>
                <span>Receipt: {transaction.receiptNumber}</span>
                <span>Type: {transaction.type}</span>
              </div>
              <div style={styles.transactionItems}>
                Items: {transaction.items.join(', ')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div style={styles.analyticsGrid}>
      <div style={styles.analyticsCard}>
        <h3 style={styles.cardTitle}>Revenue Trend</h3>
        {/* <div style={styles.chartPlaceholder}>
          <div style={styles.chartBar} style={{height: '80%'}}></div>
          <div style={styles.chartBar} style={{height: '65%'}}></div>
          <div style={styles.chartBar} style={{height: '90%'}}></div>
          <div style={styles.chartBar} style={{height: '75%'}}></div>
          <div style={styles.chartBar} style={{height: '95%'}}></div>
        </div> */}
        <div style={styles.chartLabels}>
          <span>Aug</span>
          <span>Sep</span>
          <span>Oct</span>
          <span>Nov</span>
          <span>Dec</span>
        </div>
      </div>

      <div style={styles.analyticsCard}>
        <h3 style={styles.cardTitle}>Transaction Patterns</h3>
        <div style={styles.patternGrid}>
          <div style={styles.patternItem}>
            <div style={styles.patternValue}>68%</div>
            <div style={styles.patternLabel}>Repeat Customers</div>
          </div>
          <div style={styles.patternItem}>
            <div style={styles.patternValue}>R845</div>
            <div style={styles.patternLabel}>Avg. Basket Size</div>
          </div>
          <div style={styles.patternItem}>
            <div style={styles.patternValue}>12</div>
            <div style={styles.patternLabel}>Daily Customers</div>
          </div>
          <div style={styles.patternItem}>
            <div style={styles.patternValue}>15.2%</div>
            <div style={styles.patternLabel}>MoM Growth</div>
          </div>
        </div>
      </div>

      <div style={styles.analyticsCard}>
        <h3 style={styles.cardTitle}>Risk Assessment</h3>
        <div style={styles.riskMeter}>
          <div style={styles.meterBackground}>
            <div style={styles.meterFill}></div>
          </div>
          <div style={styles.meterLabels}>
            <span>Low Risk</span>
            <span>Medium Risk</span>
            <span>High Risk</span>
          </div>
        </div>
        <div style={styles.riskFactors}>
          <div style={styles.riskFactor}>
            <span>✅ Consistent Revenue</span>
          </div>
          <div style={styles.riskFactor}>
            <span>✅ Growing Customer Base</span>
          </div>
          <div style={styles.riskFactor}>
            <span>✅ Stable Location</span>
          </div>
          <div style={styles.riskFactor}>
            <span>⚠️ Single Location</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLendingOptions = () => (
    <div style={styles.lendingSection}>
      <h3 style={styles.cardTitle}>Recommended Financial Products</h3>
      <div style={styles.productsGrid}>
        <div style={styles.productCard}>
          <div style={styles.productIcon}>💳</div>
          <h4 style={styles.productTitle}>Working Capital Loan</h4>
          <div style={styles.productDetails}>
            <div style={styles.productAmount}>Up to R50,000</div>
            <div style={styles.productTerm}>6-12 months</div>
            <div style={styles.productRate}>Interest: 12% p.a.</div>
          </div>
          <button style={styles.productButton}>Apply Now</button>
        </div>

        <div style={styles.productCard}>
          <div style={styles.productIcon}>🛒</div>
          <h4 style={styles.productTitle}>Inventory Financing</h4>
          <div style={styles.productDetails}>
            <div style={styles.productAmount}>Up to R25,000</div>
            <div style={styles.productTerm}>3-6 months</div>
            <div style={styles.productRate}>Interest: 10% p.a.</div>
          </div>
          <button style={styles.productButton}>Learn More</button>
        </div>

        <div style={styles.productCard}>
          <div style={styles.productIcon}>📱</div>
          <h4 style={styles.productTitle}>Digital Payments</h4>
          <div style={styles.productDetails}>
            <div style={styles.productAmount}>No Limit</div>
            <div style={styles.productTerm}>Instant Setup</div>
            <div style={styles.productRate}>Fee: 2.5% per transaction</div>
          </div>
          <button style={styles.productButton}>Get Started</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerMain}>
          <h1 style={styles.title}>{merchantData.businessName}</h1>
          <p style={styles.subtitle}>Financial Profile & Credit Assessment</p>
        </div>
        <div style={styles.headerInfo}>
          <div style={styles.infoItem}>
            <strong>Merchant ID:</strong> {merchantData.merchantId}
          </div>
          <div style={styles.infoItem}>
            <strong>Location:</strong> {merchantData.location}
          </div>
          <div style={styles.infoItem}>
            <strong>Business Type:</strong> {merchantData.businessType}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={styles.tabContainer}>
        <button 
          style={activeTab === 'overview' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          style={activeTab === 'transactions' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('transactions')}
        >
          💰 Transactions
        </button>
        <button 
          style={activeTab === 'analytics' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('analytics')}
        >
          📈 Analytics
        </button>
        <button 
          style={activeTab === 'lending' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('lending')}
        >
          🏦 Lending Options
        </button>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'transactions' && renderTransactions()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'lending' && renderLendingOptions()}
      </div>

      {/* Footer Actions */}
      <div style={styles.footer}>
        <button style={styles.primaryButton}>
          📋 Generate Full Report
        </button>
        <button style={styles.secondaryButton}>
          💼 Contact Merchant
        </button>
        <button style={styles.secondaryButton}>
          🔄 Refresh Data
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
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: '#f8fafc'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f4f6',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px'
  },
  header: {
    background: 'white',
    borderRadius: '12px',
    padding: '32px',
    marginBottom: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e2e8f0'
  },
  headerMain: {
    marginBottom: '20px'
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 8px 0'
  },
  subtitle: {
    fontSize: '16px',
    color: '#64748b',
    margin: 0
  },
  headerInfo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px'
  },
  infoItem: {
    fontSize: '14px',
    color: '#374151'
  },
  tabContainer: {
    display: 'flex',
    background: 'white',
    borderRadius: '12px',
    padding: '8px',
    marginBottom: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e2e8f0'
  },
  tab: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  activeTab: {
    flex: 1,
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  content: {
    background: 'white',
    borderRadius: '12px',
    padding: '32px',
    marginBottom: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e2e8f0'
  },
  // Overview Styles
  overviewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px'
  },
  overviewCard: {
    background: '#f8fafc',
    padding: '24px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '20px'
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  summaryItem: {
    textAlign: 'center',
    padding: '16px',
    background: 'white',
    borderRadius: '6px',
    border: '1px solid #e2e8f0'
  },
  summaryValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '4px'
  },
  summaryLabel: {
    fontSize: '12px',
    color: '#64748b'
  },
  creditScore: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px'
  },
  scoreCircle: {
    width: '100px',
    height: '100px',
    border: '4px solid #10b981',
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  scoreValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b'
  },
  scoreLabel: {
    fontSize: '12px',
    color: '#64748b'
  },
  scoreDetails: {
    flex: 1
  },
  scoreItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #e2e8f0'
  },
  insightsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  insightItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px',
    background: 'white',
    borderRadius: '6px',
    border: '1px solid #e2e8f0'
  },
  insightIcon: {
    fontSize: '18px'
  },
  insightText: {
    fontSize: '14px',
    color: '#374151',
    lineHeight: '1.4'
  },
  // Transactions Styles
  transactionsSection: {
    
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  exportButton: {
    background: '#10b981',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  transactionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  transactionItem: {
    padding: '16px',
    background: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0'
  },
  transactionMain: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  transactionDate: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '500'
  },
  transactionDescription: {
    fontSize: '16px',
    color: '#374151',
    fontWeight: '500'
  },
  transactionAmount: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#059669'
  },
  transactionDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#64748b'
  },
  transactionMeta: {
    display: 'flex',
    gap: '16px'
  },
  transactionItems: {
    fontStyle: 'italic'
  },
  // Analytics Styles
  analyticsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px'
  },
  analyticsCard: {
    background: '#f8fafc',
    padding: '24px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0'
  },
  chartPlaceholder: {
    display: 'flex',
    alignItems: 'end',
    gap: '12px',
    height: '200px',
    marginBottom: '12px'
  },
  chartBar: {
    flex: 1,
    background: '#3b82f6',
    borderRadius: '4px 4px 0 0'
  },
  chartLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#64748b'
  },
  patternGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  patternItem: {
    textAlign: 'center',
    padding: '16px',
    background: 'white',
    borderRadius: '6px',
    border: '1px solid #e2e8f0'
  },
  patternValue: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '4px'
  },
  patternLabel: {
    fontSize: '12px',
    color: '#64748b'
  },
  riskMeter: {
    marginBottom: '20px'
  },
  meterBackground: {
    height: '8px',
    background: '#e2e8f0',
    borderRadius: '4px',
    marginBottom: '8px',
    position: 'relative'
  },
  meterFill: {
    position: 'absolute',
    height: '100%',
    width: '30%',
    background: '#10b981',
    borderRadius: '4px'
  },
  meterLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#64748b'
  },
  riskFactors: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  riskFactor: {
    fontSize: '14px',
    color: '#374151'
  },
  // Lending Styles
  lendingSection: {
    
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px'
  },
  productCard: {
    background: '#f8fafc',
    padding: '24px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    textAlign: 'center'
  },
  productIcon: {
    fontSize: '32px',
    marginBottom: '16px'
  },
  productTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '16px'
  },
  productDetails: {
    marginBottom: '20px'
  },
  productAmount: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '4px'
  },
  productTerm: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '4px'
  },
  productRate: {
    fontSize: '14px',
    color: '#64748b'
  },
  productButton: {
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    width: '100%'
  },
  // Footer Styles
  footer: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center'
  },
  primaryButton: {
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  secondaryButton: {
    background: 'white',
    color: '#374151',
    border: '1px solid #d1d5db',
    padding: '12px 24px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  }
};

export default StakeholderDashboard;