import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getTranslation } from '../../services/translation';
import { db } from '../../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const CashTransactions = () => {
  const { currentUser } = useAuth();
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    qrCode: '',
    receiptNumber: ''
  });
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'transactions'), {
        userId: currentUser.uid,
        type: 'cash',
        amount: parseFloat(formData.amount),
        description: formData.description,
        qrCode: formData.qrCode,
        receiptNumber: formData.receiptNumber,
        date: serverTimestamp(),
        status: 'completed',
        validated: false // AI validation pending
      });

      setFormData({ amount: '', description: '', qrCode: '', receiptNumber: '' });
      alert('Transaction recorded successfully!');
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Error recording transaction');
    }
    setLoading(false);
  };

  const handleScanQR = () => {
    setScanning(true);
    // QR scanning implementation would go here
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        qrCode: 'MB-' + Date.now(),
        receiptNumber: 'RCP-' + Math.floor(Math.random() * 1000)
      }));
      setScanning(false);
    }, 2000);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Cash Transactions</h2>
      
      <div style={styles.grid}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Scan QR Receipt</h3>
          <button 
            onClick={handleScanQR}
            disabled={scanning}
            style={styles.scanButton}
          >
            {scanning ? 'Scanning...' : 'Scan QR Code'}
          </button>
          {formData.qrCode && (
            <p style={styles.scanResult}>QR Code: {formData.qrCode}</p>
          )}
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Manual Entry</h3>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label>Amount (R)</label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label>Description</label>
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
              <label>Receipt Number (Optional)</label>
              <input
                type="text"
                value={formData.receiptNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, receiptNumber: e.target.value }))}
                style={styles.input}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={styles.submitButton}
            >
              {loading ? 'Recording...' : 'Record Transaction'}
            </button>
          </form>
        </div>
      </div>

      {/* AI Validation Status */}
      <div style={styles.validationCard}>
        <h4>AI Validation</h4>
        <p>Transaction will be validated for:</p>
        <ul style={styles.validationList}>
          <li>✓ Sequential QR code checking</li>
          <li>✓ Amount pattern matching</li>
          <li>✓ Duplicate detection</li>
          <li>✓ Suspicious activity monitoring</li>
        </ul>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '24px',
    maxWidth: '1000px',
    margin: '0 auto'
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    marginBottom: '32px',
    color: 'var(--text-dark)'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '32px',
    marginBottom: '32px'
  },
  card: {
    background: 'var(--white)',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: 'var(--shadow)'
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '20px',
    color: 'var(--text-dark)'
  },
  scanButton: {
    background: 'var(--gradient-primary)',
    color: 'var(--white)',
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
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #bae6fd',
    fontSize: '14px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  input: {
    padding: '12px 16px',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    fontSize: '16px'
  },
  submitButton: {
    background: 'var(--success)',
    color: 'var(--white)',
    border: 'none',
    padding: '16px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '16px'
  },
  validationCard: {
    background: '#f8fafc',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid var(--border)'
  },
  validationList: {
    marginTop: '12px',
    paddingLeft: '20px',
    color: 'var(--text-light)'
  }
};

export default CashTransactions;