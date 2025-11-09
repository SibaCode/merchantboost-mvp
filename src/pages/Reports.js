import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ReportsPage = () => {
  const navigate = useNavigate();
  const [activeReport, setActiveReport] = useState('overview');
  const [generating, setGenerating] = useState(true);

  // Mock data for reports
  const mockReports = {
    overview: {
      title: "Business Overview",
      data: {
        totalRevenue: 2847.50,
        totalTransactions: 1,
        averageTransaction: 2847.50,
        growthRate: 0,
        topCategories: ["Retail Sales", "Premium Products"],
        recentActivity: ["New transaction: R2,847.50"]
      }
    },
    financial: {
      title: "Financial Summary",
      data: {
        monthlyRevenue: 2847.50,
        expenses: 0,
        profit: 2847.50,
        taxLiability: 284.75,
        cashFlow: "Positive",
        projections: "Strong growth potential"
      }
    },
    insights: {
      title: "AI Business Insights",
      data: {
        healthScore: 85,
        recommendations: [
          "Consider business insurance with R2,847.50 revenue",
          "Explore loan options for expansion",
          "Implement receipt tracking for all transactions"
        ],
        opportunities: [
          "Eligible for small business grants",
          "Qualify for merchant cash advances",
          "Access to business mentorship programs"
        ]
      }
    }
  };

  useEffect(() => {
    // Simulate report generation
    const timer = setTimeout(() => {
      setGenerating(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const generatePDFReport = () => {
    alert("📊 Generating PDF Report... This would download a comprehensive business report in a real application.");
  };

  const generateCSVExport = () => {
    alert("📈 Exporting CSV Data... This would download transaction data in CSV format.");
  };

  // if (generating) {
  //   return (
  //     <div style={reportStyles.generatingContainer}>
  //       <div style={reportStyles.generatingContent}>
  //         <div style={reportStyles.generatingIcon}>
  //           <div style={reportStyles.rotatingChart}>
  //             <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
  //               <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
  //               <path d="M3.27 6.96L12 12.01l8.73-5.05"/>
  //               <path d="M12 22.08V12"/>
  //             </svg>
  //           </div>
  //         </div>
  //         <h2 style={reportStyles.generatingTitle}>Generating Business Intelligence</h2>
  //         <p style={reportStyles.generatingDescription}>
  //           Analyzing your transaction data and preparing comprehensive insights...
  //         </p>
  //         <div style={reportStyles.progressContainer}>
  //           <div style={reportStyles.progressBar}>
  //             <div style={reportStyles.progressFill}></div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div style={reportStyles.container}>
      {/* Header */}
      <div style={reportStyles.header}>
        <div style={reportStyles.headerContent}>
          <h1 style={reportStyles.title}>Business Intelligence Dashboard</h1>
          <p style={reportStyles.subtitle}>
            Comprehensive analytics and insights from your transaction data
          </p>
        </div>
        <div style={reportStyles.headerActions}>
          <button onClick={generatePDFReport} style={reportStyles.exportButton}>
            📊 Generate PDF Report
          </button>
          <button onClick={generateCSVExport} style={reportStyles.exportButton}>
            📈 Export CSV Data
          </button>
        </div>
      </div>

      {/* Report Navigation */}
      <div style={reportStyles.navigation}>
        {['overview', 'financial', 'insights'].map((report) => (
          <button
            key={report}
            onClick={() => setActiveReport(report)}
            style={{
              ...reportStyles.navButton,
              ...(activeReport === report ? reportStyles.navButtonActive : {})
            }}
          >
            {mockReports[report].title}
          </button>
        ))}
      </div>

      {/* Main Report Content */}
      <div style={reportStyles.content}>
        
        {/* Overview Report */}
        {activeReport === 'overview' && (
          <div style={reportStyles.reportSection}>
            <div style={reportStyles.statsGrid}>
              <div style={reportStyles.statCard}>
                <div style={reportStyles.statIcon}>💰</div>
                <div style={reportStyles.statContent}>
                  <div style={reportStyles.statValue}>R{mockReports.overview.data.totalRevenue.toLocaleString()}</div>
                <div style={reportStyles.statLabel}>Total Revenue</div>
                </div>
              </div>
              <div style={reportStyles.statCard}>
                <div style={reportStyles.statIcon}>🔄</div>
                <div style={reportStyles.statContent}>
                  <div style={reportStyles.statValue}>{mockReports.overview.data.totalTransactions}</div>
                  <div style={reportStyles.statLabel}>Transactions</div>
                </div>
              </div>
              <div style={reportStyles.statCard}>
                <div style={reportStyles.statIcon}>📊</div>
                <div style={reportStyles.statContent}>
                  <div style={reportStyles.statValue}>R{mockReports.overview.data.averageTransaction.toLocaleString()}</div>
                  <div style={reportStyles.statLabel}>Average Transaction</div>
                </div>
              </div>
              <div style={reportStyles.statCard}>
                <div style={reportStyles.statIcon}>📈</div>
                <div style={reportStyles.statContent}>
                  <div style={reportStyles.statValue}>{mockReports.overview.data.growthRate}%</div>
                  <div style={reportStyles.statLabel}>Growth Rate</div>
                </div>
              </div>
            </div>

            <div style={reportStyles.chartsGrid}>
              <div style={reportStyles.chartCard}>
                <h3 style={reportStyles.chartTitle}>Revenue Trend</h3>
                <div style={reportStyles.chartPlaceholder}>
                  <div style={reportStyles.barChart}>
                    <div style={reportStyles.bar} data-value="2847"></div>
                  </div>
                  <p style={reportStyles.chartNote}>Single transaction recorded: R2,847.50</p>
                </div>
              </div>
              <div style={reportStyles.chartCard}>
                <h3 style={reportStyles.chartTitle}>Top Categories</h3>
                <div style={reportStyles.chartPlaceholder}>
                  <div style={reportStyles.pieChart}></div>
                  <div style={reportStyles.categoryList}>
                    {mockReports.overview.data.topCategories.map((category, index) => (
                      <div key={index} style={reportStyles.categoryItem}>
                        <div style={reportStyles.categoryDot}></div>
                        {category}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={reportStyles.activityCard}>
              <h3 style={reportStyles.activityTitle}>Recent Activity</h3>
              <div style={reportStyles.activityList}>
                {mockReports.overview.data.recentActivity.map((activity, index) => (
                  <div key={index} style={reportStyles.activityItem}>
                    <div style={reportStyles.activityDot}></div>
                    {activity}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Financial Report */}
        {activeReport === 'financial' && (
          <div style={reportStyles.reportSection}>
            <div style={reportStyles.financialGrid}>
              <div style={reportStyles.financialCard}>
                <h3 style={reportStyles.financialTitle}>Income Statement</h3>
                <div style={reportStyles.financialData}>
                  <div style={reportStyles.financialRow}>
                    <span>Revenue</span>
                    <span style={reportStyles.positive}>R{mockReports.financial.data.monthlyRevenue.toLocaleString()}</span>
                  </div>
                  <div style={reportStyles.financialRow}>
                    <span>Expenses</span>
                    <span style={reportStyles.negative}>R{mockReports.financial.data.expenses.toLocaleString()}</span>
                  </div>
                  <div style={reportStyles.financialDivider}></div>
                  <div style={reportStyles.financialRow}>
                    <strong>Net Profit</strong>
                    <strong style={reportStyles.positive}>R{mockReports.financial.data.profit.toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              <div style={reportStyles.financialCard}>
                <h3 style={reportStyles.financialTitle}>Tax Summary</h3>
                <div style={reportStyles.financialData}>
                  <div style={reportStyles.financialRow}>
                    <span>Estimated Tax</span>
                    <span>R{mockReports.financial.data.taxLiability}</span>
                  </div>
                  <div style={reportStyles.financialRow}>
                    <span>Cash Flow</span>
                    <span style={reportStyles.positive}>{mockReports.financial.data.cashFlow}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={reportStyles.projectionsCard}>
              <h3 style={reportStyles.projectionsTitle}>Business Projections</h3>
              <p style={reportStyles.projectionsText}>{mockReports.financial.data.projections}</p>
              <div style={reportStyles.projectionChart}>
                <div style={reportStyles.projectionBars}>
                  <div style={reportStyles.projectionBar} data-month="Current"></div>
                  <div style={reportStyles.projectionBar} data-month="+1 Month"></div>
                  <div style={reportStyles.projectionBar} data-month="+3 Months"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Insights Report */}
        {activeReport === 'insights' && (
          <div style={reportStyles.reportSection}>
            <div style={reportStyles.insightsHeader}>
              <div style={reportStyles.healthScore}>
                <div style={reportStyles.scoreCircle}>
                  <span style={reportStyles.scoreValue}>{mockReports.insights.data.healthScore}</span>
                  <span style={reportStyles.scoreLabel}>Business Health</span>
                </div>
              </div>
              <div style={reportStyles.insightsSummary}>
                <h3 style={reportStyles.insightsTitle}>AI Business Analysis</h3>
                <p style={reportStyles.insightsText}>
                  Based on your transaction patterns, your business shows strong potential for growth.
                </p>
              </div>
            </div>

            <div style={reportStyles.recommendationsGrid}>
              <div style={reportStyles.recommendationsCard}>
                <h4 style={reportStyles.recommendationsTitle}>💡 Recommendations</h4>
                <ul style={reportStyles.recommendationsList}>
                  {mockReports.insights.data.recommendations.map((rec, index) => (
                    <li key={index} style={reportStyles.recommendationItem}>{rec}</li>
                  ))}
                </ul>
              </div>

              <div style={reportStyles.opportunitiesCard}>
                <h4 style={reportStyles.opportunitiesTitle}>🚀 Growth Opportunities</h4>
                <ul style={reportStyles.opportunitiesList}>
                  {mockReports.insights.data.opportunities.map((opp, index) => (
                    <li key={index} style={reportStyles.opportunityItem}>{opp}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={reportStyles.actionCard}>
              <h4 style={reportStyles.actionTitle}>Next Steps</h4>
              <div style={reportStyles.actionButtons}>
                <button style={reportStyles.primaryAction}>Apply for Business Loan</button>
                <button style={reportStyles.secondaryAction}>Explore Insurance Options</button>
                <button style={reportStyles.secondaryAction}>Schedule Mentor Session</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions Footer */}
      <div style={reportStyles.footer}>
        <button onClick={() => navigate('/transactions/cash')} style={reportStyles.footerButton}>
          ➕ Add Another Transaction
        </button>
        <button onClick={() => navigate('/dashboard')} style={reportStyles.footerButton}>
          📋 Back to Dashboard
        </button>
      </div>
    </div>
  );
};

const reportStyles = {
  container: {
    minHeight: '100vh',
    background: '#f8fafc',
    padding: '24px'
  },
  generatingContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white'
  },
  generatingContent: {
    textAlign: 'center',
    maxWidth: '500px',
    padding: '40px'
  },
  generatingIcon: {
    marginBottom: '30px'
  },
  rotatingChart: {
    animation: 'rotate 2s linear infinite',
    color: 'white'
  },
  generatingTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '1rem',
    textShadow: '0 4px 8px rgba(0,0,0,0.3)'
  },
  generatingDescription: {
    fontSize: '1.2rem',
    opacity: 0.9,
    marginBottom: '2rem',
    lineHeight: '1.6'
  },
  progressContainer: {
    width: '300px',
    margin: '0 auto'
  },
  progressBar: {
    width: '100%',
    height: '6px',
    background: 'rgba(255,255,255,0.3)',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    background: 'white',
    borderRadius: '3px',
    animation: 'progress 2s ease-in-out infinite'
  },
  header: {
    background: 'white',
    borderRadius: '12px',
    padding: '32px',
    marginBottom: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  headerContent: {
    flex: 1
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#64748b',
    margin: 0
  },
  headerActions: {
    display: 'flex',
    gap: '12px'
  },
  exportButton: {
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  },
  navigation: {
    display: 'flex',
    gap: '8px',
    background: 'white',
    padding: '8px',
    borderRadius: '12px',
    marginBottom: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
  },
  navButton: {
    flex: 1,
    padding: '16px 24px',
    border: 'none',
    background: 'transparent',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    color: '#64748b',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  navButtonActive: {
    background: '#3b82f6',
    color: 'white',
    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
  },
  content: {
    background: 'white',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    marginBottom: '24px'
  },
  reportSection: {
    minHeight: '600px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
    marginBottom: '32px'
  },
  statCard: {
    background: '#f8fafc',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  statIcon: {
    fontSize: '2rem'
  },
  statContent: {
    flex: 1
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '4px'
  },
  statLabel: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '500'
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginBottom: '32px'
  },
  chartCard: {
    background: '#f8fafc',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0'
  },
  chartTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '16px'
  },
  chartPlaceholder: {
    height: '200px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  barChart: {
    display: 'flex',
    alignItems: 'end',
    gap: '20px',
    height: '120px',
    marginBottom: '16px'
  },
  bar: {
    width: '40px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '4px 4px 0 0',
    height: '120px',
    position: 'relative',
    '::after': {
      content: '"R2,847"',
      position: 'absolute',
      bottom: '-25px',
      left: '50%',
      transform: 'translateX(-50%)',
      fontSize: '12px',
      color: '#64748b'
    }
  },
  chartNote: {
    fontSize: '14px',
    color: '#64748b',
    textAlign: 'center',
    margin: 0
  },
  pieChart: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: 'conic-gradient(#667eea 0% 60%, #764ba2 60% 100%)',
    marginBottom: '16px'
  },
  categoryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  categoryItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#374151'
  },
  categoryDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#667eea'
  },
  activityCard: {
    background: '#f0f9ff',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #bae6fd'
  },
  activityTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '16px'
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  activityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 0'
  },
  activityDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#3b82f6'
  },
  financialGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginBottom: '32px'
  },
  financialCard: {
    background: '#f8fafc',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0'
  },
  financialTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '16px'
  },
  financialData: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  financialRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #e2e8f0'
  },
  positive: {
    color: '#10b981',
    fontWeight: '600'
  },
  negative: {
    color: '#ef4444',
    fontWeight: '600'
  },
  financialDivider: {
    height: '2px',
    background: '#e2e8f0',
    margin: '8px 0'
  },
  projectionsCard: {
    background: '#f0f9ff',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #bae6fd'
  },
  projectionsTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '16px'
  },
  projectionsText: {
    fontSize: '16px',
    color: '#64748b',
    marginBottom: '24px',
    lineHeight: '1.6'
  },
  projectionChart: {
    height: '120px'
  },
  projectionBars: {
    display: 'flex',
    alignItems: 'end',
    gap: '40px',
    height: '100%'
  },
  projectionBar: {
    flex: 1,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '4px 4px 0 0',
    position: 'relative',
    '::after': {
      content: 'attr(data-month)',
      position: 'absolute',
      bottom: '-25px',
      left: '50%',
      transform: 'translateX(-50%)',
      fontSize: '12px',
      color: '#64748b',
      whiteSpace: 'nowrap'
    }
  },
  insightsHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
    marginBottom: '32px'
  },
  healthScore: {
    flexShrink: 0
  },
  scoreCircle: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    textAlign: 'center'
  },
  scoreValue: {
    fontSize: '2rem',
    fontWeight: '700',
    display: 'block'
  },
  scoreLabel: {
    fontSize: '12px',
    fontWeight: '500',
    opacity: 0.9
  },
  insightsSummary: {
    flex: 1
  },
  insightsTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '8px'
  },
  insightsText: {
    fontSize: '16px',
    color: '#64748b',
    lineHeight: '1.6',
    margin: 0
  },
  recommendationsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginBottom: '32px'
  },
  recommendationsCard: {
    background: '#f0f9ff',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #bae6fd'
  },
  opportunitiesCard: {
    background: '#f0fdf4',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #bbf7d0'
  },
  recommendationsTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '16px'
  },
  opportunitiesTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '16px'
  },
  recommendationsList: {
    margin: 0,
    paddingLeft: '20px'
  },
  opportunitiesList: {
    margin: 0,
    paddingLeft: '20px'
  },
  recommendationItem: {
    marginBottom: '8px',
    color: '#374151',
    lineHeight: '1.5'
  },
  opportunityItem: {
    marginBottom: '8px',
    color: '#374151',
    lineHeight: '1.5'
  },
  actionCard: {
    background: '#f8fafc',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0'
  },
  actionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '16px'
  },
  actionButtons: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  primaryAction: {
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  secondaryAction: {
    background: 'white',
    color: '#374151',
    border: '1px solid #d1d5db',
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  footer: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center'
  },
  footerButton: {
    background: 'white',
    color: '#374151',
    border: '1px solid #d1d5db',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }
};

// Add to your existing stylesheet
const additionalStyles = `
  .projectionBar:nth-child(1) { height: 100%; }
  .projectionBar:nth-child(2) { height: 130%; }
  .projectionBar:nth-child(3) { height: 160%; }
`;

// Add to document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = additionalStyles;
  document.head.appendChild(style);
}

export default ReportsPage;