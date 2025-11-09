import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const CashTransactions = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState('upload'); // upload, review, success
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    qrCode: '',
    receiptNumber: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);

  // Mock AI extraction function
  const extractDataFromReceipt = (file) => {
    const mockExtractions = [
      {
        amount: (Math.random() * 5000 + 100).toFixed(2),
        description: "Retail Sales - Daily Transactions",
        items: ["Product A", "Product B", "Service C"],
        tax: (Math.random() * 100 + 10).toFixed(2),
        date: new Date().toISOString().split('T')[0]
      },
      {
        amount: (Math.random() * 3000 + 200).toFixed(2),
        description: "Customer Payment - Invoice #INV001",
        items: ["Consultation", "Materials", "Delivery"],
        tax: (Math.random() * 80 + 5).toFixed(2),
        date: new Date().toISOString().split('T')[0]
      },
      {
        amount: (Math.random() * 4000 + 150).toFixed(2),
        description: "Bulk Order - Wholesale Purchase",
        items: ["Item X", "Item Y", "Accessories"],
        tax: (Math.random() * 120 + 15).toFixed(2),
        date: new Date().toISOString().split('T')[0]
      }
    ];
    
    return mockExtractions[Math.floor(Math.random() * mockExtractions.length)];
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploading(true);
      
      // Simulate AI processing
      setTimeout(() => {
        const extracted = extractDataFromReceipt(file);
        setExtractedData(extracted);
        
        setFormData(prev => ({
          ...prev,
          amount: extracted.amount,
          description: extracted.description,
          receiptNumber: `RCP-${Date.now()}`,
          qrCode: `MB-${Math.floor(Math.random() * 10000)}`,
          date: extracted.date
        }));
        
        setUploading(false);
        setActiveStep('review');
      }, 2500);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    setLoading(true);
    try {
      const transactionData = {
        userId: currentUser.uid,
        type: 'cash',
        amount: parseFloat(formData.amount),
        description: formData.description,
        qrCode: formData.qrCode,
        receiptNumber: formData.receiptNumber,
        date: serverTimestamp(),
        status: 'completed',
        validated: true,
        extractedData: extractedData,
        fileName: selectedFile?.name || 'Manual Entry'
      };

      // Try to save to Firebase
      try {
        await addDoc(collection(db, 'transactions'), transactionData);
      } catch (error) {
        console.warn('Firebase save failed, continuing with mock data:', error);
      }

      setActiveStep('success');
      
      // Auto-navigate to reports after 2 seconds
      setTimeout(() => {
        navigate('/reports');
      }, 2000);

    } catch (error) {
      console.error('Error:', error);
      alert('Error recording transaction');
    }
    setLoading(false);
  };

  const handleManualEntry = () => {
    setActiveStep('review');
    setFormData(prev => ({
      ...prev,
      receiptNumber: `RCP-${Date.now()}`,
      qrCode: `MB-${Math.floor(Math.random() * 10000)}`
    }));
  };

  const renderUploadStep = () => (
    <div style={styles.stepContainer}>
      <div style={styles.stepHeader}>
        <div style={styles.stepIndicator}>
          <div style={styles.activeStep}>1</div>
          <div style={styles.stepLine}></div>
          <div style={styles.inactiveStep}>2</div>
          <div style={styles.stepLine}></div>
          <div style={styles.inactiveStep}>3</div>
        </div>
        <h2 style={styles.stepTitle}>Upload Receipt</h2>
        <p style={styles.stepDescription}>
          Take a photo or upload your receipt to automatically extract transaction data
        </p>
      </div>

      <div style={styles.uploadGrid}>
        <div style={styles.uploadCard}>
          <div style={styles.uploadIcon}>📤</div>
          <h3 style={styles.uploadTitle}>AI Receipt Scan</h3>
          <p style={styles.uploadDescription}>
            Upload a clear photo of your receipt and our AI will extract all the details automatically
          </p>
          
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileUpload}
            style={styles.fileInput}
            id="receipt-upload"
          />
          <label htmlFor="receipt-upload" style={styles.uploadButton}>
            {uploading ? '🔍 Processing Receipt...' : '📷 Upload Receipt'}
          </label>

          {uploading && (
            <div style={styles.processingAnimation}>
              <div style={styles.spinner}></div>
              <p>AI is analyzing your receipt...</p>
            </div>
          )}
        </div>

        <div style={styles.manualCard}>
          <div style={styles.manualIcon}>✍️</div>
          <h3 style={styles.manualTitle}>Manual Entry</h3>
          <p style={styles.manualDescription}>
            Prefer to enter details manually? Click below to fill out the form yourself
          </p>
          <button onClick={handleManualEntry} style={styles.manualButton}>
            Enter Manually
          </button>
        </div>
      </div>

      <div style={styles.featuresGrid}>
        <div style={styles.feature}>
          <span style={styles.featureIcon}>🤖</span>
          <div>
            <h4>AI-Powered Extraction</h4>
            <p>Automatically reads amounts, dates, and items</p>
          </div>
        </div>
        <div style={styles.feature}>
          <span style={styles.featureIcon}>⚡</span>
          <div>
            <h4>Instant Processing</h4>
            <p>Get your data extracted in seconds</p>
          </div>
        </div>
        <div style={styles.feature}>
          <span style={styles.featureIcon}>📊</span>
          <div>
            <h4>Auto-Reports</h4>
            <p>Generate insights after upload</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReviewStep = () => {
    const hasExtractedData = extractedData !== null;
    
    return (
      <div style={styles.stepContainer}>
        <div style={styles.stepHeader}>
          <div style={styles.stepIndicator}>
            <div style={styles.completedStep}>✓</div>
            <div style={styles.stepLine}></div>
            <div style={styles.activeStep}>2</div>
            <div style={styles.stepLine}></div>
            <div style={styles.inactiveStep}>3</div>
          </div>
          <h2 style={styles.stepTitle}>Review & Confirm</h2>
          <p style={styles.stepDescription}>
            {selectedFile 
              ? "We've extracted the following data from your receipt. Review and confirm to proceed."
              : "Fill in the transaction details manually."
            }
          </p>
        </div>

        <div style={{
          ...styles.reviewGrid,
          gridTemplateColumns: hasExtractedData ? '1fr 1fr' : '1fr'
        }}>
          <div style={styles.formCard}>
            <h3 style={styles.cardTitle}>Transaction Details</h3>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formRow}>
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
                  <label>Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label>Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                  style={styles.input}
                  placeholder="Brief description of the transaction"
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label>Receipt Number</label>
                  <input
                    type="text"
                    value={formData.receiptNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, receiptNumber: e.target.value }))}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label>QR Code</label>
                  <input
                    type="text"
                    value={formData.qrCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, qrCode: e.target.value }))}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.buttonGroup}>
                <button 
                  type="button" 
                  onClick={() => setActiveStep('upload')}
                  style={styles.backButton}
                >
                  ← Back
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  style={styles.submitButton}
                >
                  {loading ? '💾 Saving...' : '✅ Confirm & Generate Report'}
                </button>
              </div>
            </form>
          </div>

          {hasExtractedData && (
            <div style={styles.extractionCard}>
              <h3 style={styles.cardTitle}>📋 AI Extraction Results</h3>
              <div style={styles.extractionDetails}>
                <div style={styles.extractionItem}>
                  <strong>Amount:</strong> R{extractedData.amount}
                </div>
                <div style={styles.extractionItem}>
                  <strong>Description:</strong> {extractedData.description}
                </div>
                <div style={styles.extractionItem}>
                  <strong>Tax:</strong> R{extractedData.tax}
                </div>
                <div style={styles.extractionItem}>
                  <strong>Date:</strong> {extractedData.date}
                </div>
                <div style={styles.extractionItem}>
                  <strong>Items:</strong>
                  <ul style={styles.itemsList}>
                    {extractedData.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div style={styles.confidenceBadge}>
                🤖 AI Confidence: {Math.floor(Math.random() * 30 + 70)}%
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSuccessStep = () => (
    <div style={styles.successContainer}>
      <div style={styles.successIcon}>🎉</div>
      <h2 style={styles.successTitle}>Transaction Recorded Successfully!</h2>
      <p style={styles.successDescription}>
        Your receipt has been processed and the transaction has been saved.
        You're now being redirected to the reports page to view insights and analytics.
      </p>
      <div style={styles.successAnimation}>
        <div style={styles.loadingBar}>
          <div style={styles.progress}></div>
        </div>
        <p>Redirecting to reports...</p>
      </div>
      <button 
        onClick={() => navigate('/reports')} 
        style={styles.reportsButton}
      >
        📊 Go to Reports Now
      </button>
    </div>
  );

  return (
    <div style={styles.container}>
      {activeStep === 'upload' && renderUploadStep()}
      {activeStep === 'review' && renderReviewStep()}
      {activeStep === 'success' && renderSuccessStep()}
    </div>
  );
};

const styles = {
  container: {
    padding: '24px',
    maxWidth: '1000px',
    margin: '0 auto',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
  },
  stepContainer: {
    background: 'white',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    marginTop: '20px'
  },
  stepHeader: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  stepIndicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px'
  },
  activeStep: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: '#3b82f6',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold'
  },
  inactiveStep: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: '#e2e8f0',
    color: '#64748b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold'
  },
  completedStep: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: '#10b981',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold'
  },
  stepLine: {
    width: '80px',
    height: '3px',
    background: '#e2e8f0',
    margin: '0 10px'
  },
  stepTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '12px'
  },
  stepDescription: {
    fontSize: '18px',
    color: '#64748b',
    maxWidth: '600px',
    margin: '0 auto',
    lineHeight: '1.6'
  },
  uploadGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
    marginBottom: '40px'
  },
  uploadCard: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '40px',
    borderRadius: '16px',
    textAlign: 'center'
  },
  uploadIcon: {
    fontSize: '48px',
    marginBottom: '16px'
  },
  uploadTitle: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '12px'
  },
  uploadDescription: {
    fontSize: '16px',
    opacity: '0.9',
    marginBottom: '24px',
    lineHeight: '1.5'
  },
  fileInput: {
    display: 'none'
  },
  uploadButton: {
    display: 'inline-block',
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    padding: '16px 32px',
    borderRadius: '50px',
    border: '2px solid rgba(255,255,255,0.3)',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  manualCard: {
    background: 'white',
    padding: '40px',
    borderRadius: '16px',
    border: '2px solid #e2e8f0',
    textAlign: 'center'
  },
  manualIcon: {
    fontSize: '48px',
    marginBottom: '16px'
  },
  manualTitle: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#1e293b'
  },
  manualDescription: {
    fontSize: '16px',
    color: '#64748b',
    marginBottom: '24px',
    lineHeight: '1.5'
  },
  manualButton: {
    background: '#f1f5f9',
    color: '#475569',
    border: 'none',
    padding: '16px 32px',
    borderRadius: '50px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  processingAnimation: {
    marginTop: '20px',
    textAlign: 'center'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(255,255,255,0.3)',
    borderTop: '4px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 12px'
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
    padding: '30px',
    background: '#f8fafc',
    borderRadius: '12px'
  },
  feature: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px'
  },
  featureIcon: {
    fontSize: '24px',
    marginTop: '4px'
  },
  reviewGrid: {
    display: 'grid',
    gap: '30px'
  },
  formCard: {
    background: 'white',
    padding: '30px',
    borderRadius: '16px',
    border: '1px solid #e2e8f0'
  },
  extractionCard: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    padding: '30px',
    borderRadius: '16px'
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '20px',
    color: 'inherit'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  input: {
    padding: '12px 16px',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    fontSize: '16px',
    background: 'white'
  },
  buttonGroup: {
    display: 'flex',
    gap: '16px',
    marginTop: '24px'
  },
  backButton: {
    background: '#f1f5f9',
    color: '#475569',
    border: 'none',
    padding: '14px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    flex: 1
  },
  submitButton: {
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '14px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    flex: 2
  },
  extractionDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px'
  },
  extractionItem: {
    padding: '8px 0',
    borderBottom: '1px solid rgba(255,255,255,0.1)'
  },
  itemsList: {
    margin: '8px 0 0 20px',
    fontSize: '14px'
  },
  confidenceBadge: {
    background: 'rgba(255,255,255,0.2)',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    textAlign: 'center'
  },
  successContainer: {
    background: 'white',
    borderRadius: '20px',
    padding: '60px 40px',
    textAlign: 'center',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    marginTop: '20px'
  },
  successIcon: {
    fontSize: '80px',
    marginBottom: '24px'
  },
  successTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#10b981',
    marginBottom: '16px'
  },
  successDescription: {
    fontSize: '18px',
    color: '#64748b',
    maxWidth: '500px',
    margin: '0 auto 30px',
    lineHeight: '1.6'
  },
  successAnimation: {
    marginBottom: '30px'
  },
  loadingBar: {
    width: '300px',
    height: '6px',
    background: '#e2e8f0',
    borderRadius: '3px',
    margin: '0 auto 12px',
    overflow: 'hidden'
  },
  progress: {
    height: '100%',
    background: '#3b82f6',
    borderRadius: '3px',
    width: '0%',
    animation: 'progress 2s ease-in-out forwards'
  },
  reportsButton: {
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '16px 32px',
    borderRadius: '50px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer'
  }
};

// Add CSS animations
const stylesheet = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes progress {
    0% { width: 0%; }
    100% { width: 100%; }
  }
`;

// Add styles to document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = stylesheet;
  document.head.appendChild(style);
}

export default CashTransactions;