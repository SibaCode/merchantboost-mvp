import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const CashTransactions = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    receiptNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
        receiptNumber: formData.receiptNumber || `RCP-${Date.now()}`,
        date: serverTimestamp(),
        status: 'completed',
        validated: true,
        createdAt: serverTimestamp()
      });

      setFormData({ amount: '', description: '', receiptNumber: '' });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Error recording transaction');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Record Cash Transaction</h2>
      
      {success && (
        <div style={styles.successMessage}>
          ✅ Transaction saved to database!
        </div>
      )}
      
      <div style={styles.card}>
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
              placeholder="Optional"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={styles.submitButton}
          >
            {loading ? 'Saving...' : '💾 Save to Database'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '24px',
    maxWidth: '600px',
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
  card: {
    background: 'white',
    padding: '32px',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    border: '1px solid #e5e7eb'
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
  }
};

export default CashTransactions;