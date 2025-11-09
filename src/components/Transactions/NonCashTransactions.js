import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getTranslation } from '../../services/translation';
import { db, storage } from '../../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const NonCashTransactions = () => {
  const { currentUser } = useAuth();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('bank-api');
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    reference: '',
    bankName: '',
    transactionDate: ''
  });
  const [bankStatement, setBankStatement] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleBankAPISubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'transactions'), {
        userId: currentUser.uid,
        type: 'non-cash',
        method: 'bank-api',
        amount: parseFloat(formData.amount),
        description: formData.description,
        reference: formData.reference,
        bankName: formData.bankName,
        transactionDate: formData.transactionDate,
        date: serverTimestamp(),
        status: 'completed',
        validated: true // Bank transactions are pre-validated
      });

      setFormData({ amount: '', description: '', reference: '', bankName: '', transactionDate: '' });
      alert('Bank transaction recorded successfully!');
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Error recording transaction');
    }
    setLoading(false);
  };

  const handleBankStatementUpload = async (e) => {
    e.preventDefault();
    if (!bankStatement || !currentUser) return;

    setLoading(true);
    try {
      // Upload bank statement
      const fileRef = ref(storage, `bank-statements/${currentUser.uid}/${Date.now()}_${bankStatement.name}`);
      await uploadBytes(fileRef, bankStatement);
      const fileUrl = await getDownloadURL(fileRef);

      // Record the upload
      await addDoc(collection(db, 'bankStatements'), {
        userId: currentUser.uid,
        fileName: bankStatement.name,
        fileUrl: fileUrl,
        uploadDate: serverTimestamp(),
        status: 'processing'
      });

      setBankStatement(null);
      alert('Bank statement uploaded for AI processing!');
    } catch (error) {
      console.error('Error uploading statement:', error);
      alert('Error uploading bank statement');
    }
    setLoading(false);
  };

  const connectBankAPI = () => {
    // Simulate bank API connection
    alert('Connecting to banking API... This would integrate with ScanQR/Instant Payment systems.');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Digital Transactions</h2>
      
      <div style={styles.tabContainer}>
        <button 
          style={{...styles.tab, ...(activeTab === 'bank-api' && styles.activeTab)}}
          onClick={() => setActiveTab('bank-api')}
        >
          Bank API Integration
        </button>
        <button 
          style={{...styles.tab, ...(activeTab === 'statement' && styles.activeTab)}}
          onClick={() => setActiveTab('statement')}
        >
          Bank Statement Upload
        </button>
      </div>

      {activeTab === 'bank-api' && (
        <div style={styles.tabContent}>
          <div style={styles.grid}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Instant Bank Connection</h3>
              <p style={styles.cardDescription}>
                Connect directly to your bank for real-time transaction tracking
              </p>
              <button onClick={connectBankAPI} style={styles.connectButton}>
                Connect Bank Account
              </button>
              <div style={styles.features}>
                <h4>Supported Features:</h4>
                <ul>
                  <li>✅ Real-time transaction notifications</li>
                  <li>✅ Automatic categorization</li>
                  <li>✅ Instant payment verification</li>
                  <li>✅ Fraud detection</li>
                </ul>
              </div>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Manual Bank Entry</h3>
              <form onSubmit={handleBankAPISubmit} style={styles.form}>
                <div style={styles.formGroup}>
                  <label>Bank Name</label>
                  <select
                    value={formData.bankName}
                    onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                    required
                    style={styles.input}
                  >
                    <option value="">Select Bank</option>
                    <option value="absa">ABSA</option>
                    <option value="fnb">FNB</option>
                    <option value="standard">Standard Bank</option>
                    <option value="nedbank">Nedbank</option>
                    <option value="capitec">Capitec</option>
                  </select>
                </div>

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
                    placeholder="e.g., Customer payment, Supplier payment"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label>Reference Number</label>
                  <input
                    type="text"
                    value={formData.reference}
                    onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label>Transaction Date</label>
                  <input
                    type="date"
                    value={formData.transactionDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, transactionDate: e.target.value }))}
                    required
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
        </div>
      )}

      {activeTab === 'statement' && (
        <div style={styles.tabContent}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Upload Bank Statement</h3>
            <p style={styles.cardDescription}>
              Upload your bank statement (PDF/CSV) for AI-powered transaction processing
            </p>
            
            <form onSubmit={handleBankStatementUpload} style={styles.uploadForm}>
              <div style={styles.uploadArea}>
                <input
                  type="file"
                  accept=".pdf,.csv,.xlsx"
                  onChange={(e) => setBankStatement(e.target.files[0])}
                  style={styles.fileInput}
                  id="bankStatement"
                />
                <label htmlFor="bankStatement" style={styles.uploadLabel}>
                  {bankStatement ? bankStatement.name : 'Choose bank statement file'}
                </label>
                <p style={styles.uploadHint}>Supported formats: PDF, CSV, Excel</p>
              </div>

              <button 
                type="submit" 
                disabled={!bankStatement || loading}
                style={styles.uploadButton}
              >
                {loading ? 'Processing...' : 'Upload & Process'}
              </button>
            </form>

            <div style={styles.aiFeatures}>
              <h4>AI Processing Includes:</h4>
              <ul>
                <li>📊 Automatic transaction categorization</li>
                <li>🔍 Duplicate transaction detection</li>
                <li>⚠️ Anomaly and fraud detection</li>
                <li>📈 Revenue pattern analysis</li>
                <li>💡 Smart insights and recommendations</li>
              </ul>
            </div>
          </div>
        </div>
      )}
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
  tabContainer: {
    display: 'flex',
    marginBottom: '32px',
    borderBottom: '1px solid var(--border)'
  },
  tab: {
    padding: '12px 24px',
    background: 'none',
    border: 'none',
    borderBottom: '3px solid transparent',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    color: 'var(--text-light)'
  },
  activeTab: {
    color: 'var(--primary-blue)',
    borderBottomColor: 'var(--primary-blue)'
  },
  tabContent: {
    // Tab content styles
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '32px'
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
    marginBottom: '12px',
    color: 'var(--text-dark)'
  },
  cardDescription: {
    color: 'var(--text-light)',
    marginBottom: '20px',
    lineHeight: '1.5'
  },
  connectButton: {
    background: 'var(--gradient-primary)',
    color: 'var(--white)',
    border: 'none',
    padding: '16px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    marginBottom: '20px'
  },
  features: {
    background: '#f8fafc',
    padding: '16px',
    borderRadius: '8px'
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
  uploadForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  uploadArea: {
    border: '2px dashed var(--border)',
    borderRadius: '8px',
    padding: '40px',
    textAlign: 'center',
    transition: 'border-color 0.3s'
  },
  fileInput: {
    display: 'none'
  },
  uploadLabel: {
    display: 'inline-block',
    background: 'var(--gradient-primary)',
    color: 'var(--white)',
    padding: '12px 24px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500'
  },
  uploadHint: {
    marginTop: '12px',
    color: 'var(--text-light)',
    fontSize: '14px'
  },
  uploadButton: {
    background: 'var(--success)',
    color: 'var(--white)',
    border: 'none',
    padding: '16px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  aiFeatures: {
    marginTop: '24px',
    padding: '20px',
    background: '#f0f9ff',
    borderRadius: '8px',
    border: '1px solid #bae6fd'
  }
};

export default NonCashTransactions;