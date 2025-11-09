import React, { useState } from 'react';
import { useMockData } from '../../context/MockDataContext';

const MockCashTransactions = () => {
  const { addTransaction } = useMockData();
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    qrCode: '',
    receiptNumber: ''
  });
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setLoading(true);
    
    try {
      const transactionData = {
        type: 'cash',
        amount: parseFloat(formData.amount),
        description: formData.description || 'Cash transaction',
        qrCode: formData.qrCode || `MB-${Date.now()}`,
        receiptNumber: formData.receiptNumber || `RCP-${Math.floor(1000 + Math.random() * 9000)}`,
        merchant: 'Retail Store',
        validated: true,
        aiValidation: {
          duplicateCheck: true,
          patternMatch: true,
          fraudScore: 0.1
        }
      };

      await addTransaction(transactionData);

      // Reset form
      setFormData({ amount: '', description: '', qrCode: '', receiptNumber: '' });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Error recording transaction');
    }
    
    setLoading(false);
  };

  const handleScanQR = () => {
    setScanning(true);
    
    // Simulate QR scanning
    setTimeout(() => {
      const randomAmount = (50 + Math.random() * 200).toFixed(2);
      setFormData(prev => ({
        ...prev,
        qrCode: `MB-QR-${Date.now()}`,
        receiptNumber: `RCP-${Math.floor(1000 + Math.random() * 9000)}`,
        amount: randomAmount,
        description: 'QR scanned transaction - Customer payment'
      }));
      setScanning(false);
    }, 1500);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Cash Transactions</h2>
      
      {success && (
        <div style={styles.successMessage}>
          ✅ Transaction recorded successfully! (Mock Data)
        </div>
      )}
      
      <div style={styles.grid}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Scan QR Receipt</h3>
          <p style={styles.cardDescription}>
            Use our QR-coded receipt books to automatically capture transaction details
          </p>
          
          <button 
            onClick={handleScanQR}
            disabled={scanning}
            style={styles.scanButton}
          >
            {scanning ? 'Scanning...' : '📱 Scan QR Code'}
          </button>
          
          {formData.qrCode && (
            <div style={styles.scanResult}>
              <h4>Scanned Details:</h4>
              <p><strong>QR Code:</strong> {formData.qrCode}</p>
              <p><strong>Receipt No:</strong> {formData.receiptNumber}</p>
              <p><strong>Amount:</strong> R{formData.amount}</p>
              <button 
                onClick={() => setFormData(prev => ({ ...prev, qrCode: '', receiptNumber: '' }))}
                style={styles.clearButton}
              >
                Clear Scan
              </button>
            </div>
          )}
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Manual Entry</h3>
          <p style={styles.cardDescription}>
            Enter transaction details manually
          </p>
          
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label>Amount (R) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                required
                style={styles.input}
                placeholder="0.00"
              />
            </div>

            <div style={styles.formGroup}>
              <label>Description *</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
                style={styles.input}
                placeholder="e.g., Daily sales, Customer payment"
              />
            </div>

            <div style={styles.formGroup}>
              <label>Receipt Number</label>
              <input
                type="text"
                value={formData.receiptNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, receiptNumber: e.target.value }))}
                style={styles.input}
                placeholder="e.g., RCP-001 (Optional)"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={styles.submitButton}
            >
              {loading ? 'Saving...' : '💾 Save Transaction'}
            </button>
          </form>
        </div>
      </div>

      <div style={styles.demoInfo}>
        <h4>🎯 Demo Features:</h4>
        <ul style={styles.demoList}>
          <li>✅ QR Code scanning simulation</li>
          <li>✅ Real-time data updates</li>
          <li>✅ AI validation simulation</li>
          <li>✅ No database required</li>
          <li>✅ Perfect for presentations</li>
        </ul>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '24px',
    maxWidth: '1000px',
    margin: '0 auto',
    minHeight: '100vh',
    background: '#f8fafc'
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '32px',
    color: '#1f2937',
    textAlign: 'center'
  },
  successMessage: {
    background: '#d1fae5',
    color: '#065f46',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #a7f3d0',
    textAlign: 'center'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '32px',
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
  scanButton: {
    background: 'linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)',
    color: 'white',
    border: 'none',
    padding: '16px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    marginBottom: '16px'
  },
  scanResult: {
    background: '#f0f9ff',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #bae6fd',
    marginTop: '16px'
  },
  clearButton: {
    background: '#6b7280',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    marginTop: '12px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  input: {
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px'
  },
  submitButton: {
    background: '#10b981',
    color: 'white',
    border: 'none',
    padding: '16px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '16px'
  },
  demoInfo: {
    background: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #e5e7eb',
    textAlign: 'center'
  },
  demoList: {
    margin: '12px 0 0 0',
    paddingLeft: '20px',
    color: '#6b7280',
    textAlign: 'left'
  }
};

export default MockCashTransactions;