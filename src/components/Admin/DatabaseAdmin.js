import React, { useState } from 'react';
import { setupDemoDatabase, clearDemoData, addSampleTransaction } from '../../services/databaseSetup';
import { useMockData } from '../../context/MockDataContext';

const DatabaseAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { resetData } = useMockData();

  const handleSetupDatabase = async () => {
    setLoading(true);
    setMessage('Setting up database...');
    
    const success = await setupDemoDatabase();
    
    if (success) {
      setMessage('✅ Database setup completed! Check Firebase Console.');
    } else {
      setMessage('❌ Database setup failed. Check console for errors.');
    }
    
    setLoading(false);
  };

  const handleClearDatabase = async () => {
    if (!window.confirm('Are you sure you want to clear all demo data?')) return;
    
    setLoading(true);
    setMessage('Clearing demo data...');
    
    const success = await clearDemoData();
    
    if (success) {
      setMessage('✅ Demo data cleared!');
    } else {
      setMessage('❌ Failed to clear demo data.');
    }
    
    setLoading(false);
  };

  const handleAddSampleTransaction = async () => {
    setLoading(true);
    const transactionId = await addSampleTransaction('demo-user');
    
    if (transactionId) {
      setMessage('✅ Sample transaction added!');
    } else {
      setMessage('❌ Failed to add sample transaction.');
    }
    
    setLoading(false);
  };

  const handleResetMockData = () => {
    resetData();
    setMessage('✅ Mock data reset!');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Database Admin Panel</h1>
      <p style={styles.subtitle}>Manage your demo data for presentations</p>
      
      {message && (
        <div style={{
          ...styles.message,
          ...(message.includes('✅') ? styles.successMessage : styles.errorMessage)
        }}>
          {message}
        </div>
      )}
      
      <div style={styles.grid}>
        {/* Firebase Database Section */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>🔥 Firebase Database</h3>
          <p style={styles.cardDescription}>
            Set up real data in your Firebase Firestore database
          </p>
          
          <div style={styles.buttonGroup}>
            <button 
              onClick={handleSetupDatabase}
              disabled={loading}
              style={styles.primaryButton}
            >
              {loading ? 'Setting Up...' : '🚀 Setup Demo Database'}
            </button>
            
            <button 
              onClick={handleClearDatabase}
              disabled={loading}
              style={styles.secondaryButton}
            >
              🧹 Clear Demo Data
            </button>
            
            <button 
              onClick={handleAddSampleTransaction}
              disabled={loading}
              style={styles.secondaryButton}
            >
              ➕ Add Sample Transaction
            </button>
          </div>
          
          <div style={styles.infoBox}>
            <h4>📊 What gets created:</h4>
            <ul style={styles.infoList}>
              <li>3 sample businesses (Retail, Restaurant, Services)</li>
              <li>30 days of transaction history</li>
              <li>Sample receipts and expenses</li>
              <li>Realistic revenue patterns</li>
              <li>AI validation data</li>
            </ul>
          </div>
        </div>

        {/* Mock Data Section */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>🔄 Mock Data</h3>
          <p style={styles.cardDescription}>
            Manage the in-memory mock data (no database required)
          </p>
          
          <div style={styles.buttonGroup}>
            <button 
              onClick={handleResetMockData}
              style={styles.primaryButton}
            >
              🔄 Reset Mock Data
            </button>
          </div>
          
          <div style={styles.infoBox}>
            <h4>🎯 Perfect for:</h4>
            <ul style={styles.infoList}>
              <li>Quick demos without setup</li>
              <li>Offline presentations</li>
              <li>Testing features instantly</li>
              <li>No database configuration needed</li>
            </ul>
          </div>
        </div>

        {/* Instructions Section */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>📖 Setup Instructions</h3>
          <div style={styles.instructions}>
            <h4>For Firebase Setup:</h4>
            <ol style={styles.instructionsList}>
              <li>Create a Firebase project at console.firebase.google.com</li>
              <li>Enable Firestore Database</li>
              <li>Update firebase config in <code>src/services/firebase.js</code></li>
              <li>Click "Setup Demo Database" above</li>
              <li>Check your Firebase Console to see the data</li>
            </ol>
            
            <h4>For Mock Data (Recommended):</h4>
            <ol style={styles.instructionsList}>
              <li>Just click "Enter Demo" on login page</li>
              <li>Everything works instantly</li>
              <li>No configuration needed</li>
              <li>Perfect for live presentations</li>
            </ol>
          </div>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div style={styles.statsCard}>
        <h3>📈 Sample Business Data</h3>
        <div style={styles.statsGrid}>
          <div style={styles.stat}>
            <div style={styles.statValue}>Khaya's Spaza Shop</div>
            <div style={styles.statLabel}>Retail • R25k/month • Intermediate</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statValue}>Mama Zanele's Restaurant</div>
            <div style={styles.statLabel}>Restaurant • R45k/month • Basic</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statValue}>Tech Solutions Pty Ltd</div>
            <div style={styles.statLabel}>Services • R120k/month • Pro</div>
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
    margin: '0 auto',
    minHeight: '100vh',
    background: '#f8fafc'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '8px',
    color: '#1f2937',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: '40px'
  },
  message: {
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '24px',
    textAlign: 'center',
    fontWeight: '500'
  },
  successMessage: {
    background: '#d1fae5',
    color: '#065f46',
    border: '1px solid #a7f3d0'
  },
  errorMessage: {
    background: '#fee2e2',
    color: '#dc2626',
    border: '1px solid #fca5a5'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
  },
  card: {
    background: 'white',
    padding: '32px',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    border: '1px solid #e5e7eb'
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#1f2937',
    margin: 0
  },
  cardDescription: {
    color: '#6b7280',
    marginBottom: '24px',
    lineHeight: '1.5',
    margin: 0
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '24px'
  },
  primaryButton: {
    background: 'linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)',
    color: 'white',
    border: 'none',
    padding: '16px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  secondaryButton: {
    background: '#f3f4f6',
    color: '#374151',
    border: '1px solid #d1d5db',
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  infoBox: {
    background: '#f0f9ff',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #bae6fd'
  },
  infoList: {
    margin: '12px 0 0 0',
    paddingLeft: '20px',
    color: '#374151'
  },
  instructions: {
    color: '#374151'
  },
  instructionsList: {
    margin: '12px 0',
    paddingLeft: '20px'
  },
  statsCard: {
    background: 'white',
    padding: '32px',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    border: '1px solid #e5e7eb'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginTop: '16px'
  },
  stat: {
    padding: '16px',
    background: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e5e7eb'
  },
  statValue: {
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '4px'
  },
  statLabel: {
    fontSize: '0.9rem',
    color: '#6b7280'
  }
};

export default DatabaseAdmin;