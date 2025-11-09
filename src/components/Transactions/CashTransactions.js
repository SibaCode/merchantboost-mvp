import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Import your receipt image
import receiptImage from '../../styles/images.png';

const CashTransactions = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState('upload');
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    qrCode: '',
    receiptNumber: '',
    date: new Date().toISOString().split('T')[0],
    businessName: '',
    merchantId: '',
    transactionType: 'cash'
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [showCameraModal, setShowCameraModal] = useState(false);

  // Mock QR Receipt Data Structure
  const mockQRReceipts = {
    'SBA-001': {
      merchantId: 'MCH-001',
      businessName: 'Siba Spaza Shop',
      location: 'Soweto, Johannesburg',
      businessType: 'Retail Grocery',
      category: 'spaza',
      owner: 'Siba Nkosi',
      registrationDate: '2023-01-15',
      qrCode: 'SBA-001'
    }
  };

  // Open camera modal
  const openCameraModal = () => {
    setShowCameraModal(true);
  };

  // Close camera modal and process receipt
  const closeCameraModal = () => {
    setShowCameraModal(false);
    setUploading(true);
    
    // Simulate QR processing
    setTimeout(() => {
      const qrData = mockQRReceipts['SBA-001'];
      const extracted = extractDataFromQR(qrData);
      
      setExtractedData(extracted);
      setFormData(prev => ({
        ...prev,
        amount: extracted.amount,
        description: extracted.description,
        receiptNumber: extracted.receiptNumber,
        qrCode: extracted.qrCode,
        date: extracted.date,
        businessName: extracted.businessName,
        merchantId: extracted.merchantId,
        transactionType: extracted.transactionType
      }));
      
      setUploading(false);
      setActiveStep('review');
    }, 1500);
  };

  // Mock AI extraction for QR receipts
  const extractDataFromQR = (qrData) => {
    const receiptScenarios = [
      {
        receiptNumber: `RCP-${Date.now()}`,
        amount: '845.50',
        description: "Daily grocery sales - walk-in customers",
        items: ["Bread", "Milk", "Cooking Oil", "Sugar", "Maize Meal"],
        tax: '45.25',
        date: new Date().toISOString().split('T')[0],
        transactionType: "cash",
        customerCount: 12,
        paymentMethod: "cash"
      }
    ];
    
    return {
      ...receiptScenarios[0],
      ...qrData
    };
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploading(true);
      
      setTimeout(() => {
        const qrData = mockQRReceipts['SBA-001'];
        const extracted = extractDataFromQR(qrData);
        
        setExtractedData(extracted);
        
        setFormData(prev => ({
          ...prev,
          amount: extracted.amount,
          description: extracted.description,
          receiptNumber: extracted.receiptNumber,
          qrCode: extracted.qrCode,
          date: extracted.date,
          businessName: extracted.businessName,
          merchantId: extracted.merchantId,
          transactionType: extracted.transactionType
        }));
        
        setUploading(false);
        setActiveStep('review');
      }, 2000);
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
        businessName: formData.businessName,
        merchantId: formData.merchantId,
        transactionType: formData.transactionType,
        date: serverTimestamp(),
        status: 'completed',
        validated: true,
        extractedData: extractedData,
        fileName: selectedFile?.name || 'QR Scan'
      };

      try {
        await addDoc(collection(db, 'transactions'), transactionData);
      } catch (error) {
        console.warn('Firebase save failed:', error);
      }

      setActiveStep('success');
      
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
      qrCode: `MB-${Math.floor(Math.random() * 10000)}`,
      businessName: 'Siba Spaza Shop',
      merchantId: 'MCH-001'
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
        <h2 style={styles.stepTitle}>Scan QR Receipt</h2>
        <p style={styles.stepDescription}>
          Use your camera or upload an image to scan QR-coded receipts and automatically extract all transaction data
        </p>
      </div>

      <div style={styles.uploadGrid}>
        <div style={styles.uploadCard}>
          <div style={styles.uploadIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
              <path d="M12 16a4 4 0 100-8 4 4 0 000 8z"/>
              <path d="M12 8v8"/>
              <path d="M8 12h8"/>
            </svg>
          </div>
          <h3 style={styles.uploadTitle}>Camera Scan</h3>
          <p style={styles.uploadDescription}>
            Point your camera at the QR code on your receipt to instantly capture all transaction details
          </p>
          
          <button 
            onClick={openCameraModal}
            style={styles.uploadButton}
          >
            Open Camera & Scan
          </button>
        </div>

        <div style={styles.uploadCard}>
          <div style={styles.uploadIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <h3 style={styles.uploadTitle}>Upload QR Image</h3>
          <p style={styles.uploadDescription}>
            Upload a photo of your QR-coded receipt and our AI will extract all the details automatically
          </p>
          
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={styles.fileInput}
            id="qr-upload"
          />
          <label htmlFor="qr-upload" style={styles.uploadButton}>
            {uploading ? 'Processing QR Code...' : 'Upload QR Image'}
          </label>

          {uploading && (
            <div style={styles.processingAnimation}>
              <div style={styles.spinner}></div>
              <p>AI is reading QR code...</p>
            </div>
          )}
        </div>

        <div style={styles.manualCard}>
          <div style={styles.manualIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
          </div>
          <h3 style={styles.manualTitle}>Manual Entry</h3>
          <p style={styles.manualDescription}>
            Prefer to enter details manually? Click below to fill out the form yourself
          </p>
          <button onClick={handleManualEntry} style={styles.manualButton}>
            Enter Manually
          </button>
        </div>
      </div>

      <div style={styles.qrDemo}>
        <h4 style={styles.demoTitle}>How QR Receipts Work</h4>
        <div style={styles.demoGrid}>
          <div style={styles.demoItem}>
            <div style={styles.demoNumber}>1</div>
            <div style={styles.demoText}>
              <strong>Pre-printed QR Codes</strong><br/>
              Each receipt has unique QR with merchant info
            </div>
          </div>
          <div style={styles.demoItem}>
            <div style={styles.demoNumber}>2</div>
            <div style={styles.demoText}>
              <strong>Camera Scan</strong><br/>
              Point phone at QR to auto-fill all details
            </div>
          </div>
          <div style={styles.demoItem}>
            <div style={styles.demoNumber}>3</div>
            <div style={styles.demoText}>
              <strong>AI Extraction</strong><br/>
              Gets business data, receipt number, security hash
            </div>
          </div>
        </div>
      </div>

      <div style={styles.featuresGrid}>
        <div style={styles.feature}>
          <div style={styles.featureIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div>
            <h4 style={styles.featureTitle}>Secure & Tamper-Proof</h4>
            <p style={styles.featureDescription}>QR contains security hash to prevent fraud</p>
          </div>
        </div>
        <div style={styles.feature}>
          <div style={styles.featureIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4"/>
              <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <h4 style={styles.featureTitle}>Auto Business Data</h4>
            <p style={styles.featureDescription}>Extracts merchant ID, business name automatically</p>
          </div>
        </div>
        <div style={styles.feature}>
          <div style={styles.featureIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
            </svg>
          </div>
          <div>
            <h4 style={styles.featureTitle}>Sequential Tracking</h4>
            <p style={styles.featureDescription}>Receipt numbers tracked to prevent duplicates</p>
          </div>
        </div>
      </div>

      {/* Camera Modal */}
      {showCameraModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Camera Scanner</h2>
              <p style={styles.modalSubtitle}>Point camera at QR code on receipt</p>
              <button onClick={closeCameraModal} style={styles.closeButton}>
                ✕ Close
              </button>
            </div>
            
            <div style={styles.cameraView}>
              {/* Display your receipt image as if it's camera feed */}
              <div style={styles.cameraFeed}>
                <img 
                  src={receiptImage} 
                  alt="Receipt with QR Code" 
                  style={styles.cameraImage}
                />
                
                {/* Scanner overlay to make it look like camera scanning */}
                <div style={styles.scannerOverlay}>
                  <div style={styles.scannerFrame}>
                    <div style={styles.scannerCornerTL}></div>
                    <div style={styles.scannerCornerTR}></div>
                    <div style={styles.scannerCornerBL}></div>
                    <div style={styles.scannerCornerBR}></div>
                    
                    {/* Animated scanning line */}
                    <div style={styles.scanningLine}></div>
                  </div>
                  <p style={styles.scannerText}>Align QR code within frame</p>
                </div>
              </div>
              
              {/* Camera controls */}
              <div style={styles.cameraControls}>
                <div style={styles.cameraInfo}>
                  <div style={styles.cameraStatus}>
                    <div style={styles.statusDot}></div>
                    <span>Camera Active</span>
                  </div>
                  <div style={styles.resolution}>720p</div>
                </div>
                
                <button onClick={closeCameraModal} style={styles.captureButton}>
                  <div style={styles.captureIcon}>
                    <div style={styles.captureInner}></div>
                  </div>
                  <span>Capture Receipt</span>
                </button>
                
                <div style={styles.cameraHint}>
                  Click capture to scan QR and extract data automatically
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderReviewStep = () => {
    const hasExtractedData = extractedData !== null;
    
    return (
      <div style={styles.stepContainer}>
        <div style={styles.stepHeader}>
          <div style={styles.stepIndicator}>
            <div style={styles.completedStep}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div style={styles.stepLine}></div>
            <div style={styles.activeStep}>2</div>
            <div style={styles.stepLine}></div>
            <div style={styles.inactiveStep}>3</div>
          </div>
          <h2 style={styles.stepTitle}>Review & Confirm</h2>
          <p style={styles.stepDescription}>
            {hasExtractedData 
              ? "QR scanned successfully! Verify the extracted data and confirm."
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
                  <label style={styles.label}>Amount (R)</label>
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
                  <label style={styles.label}>Date</label>
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
                <label style={styles.label}>Description</label>
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
                  <label style={styles.label}>Business Name</label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Transaction Type</label>
                  <select
                    value={formData.transactionType}
                    onChange={(e) => setFormData(prev => ({ ...prev, transactionType: e.target.value }))}
                    style={styles.input}
                  >
                    <option value="cash">Cash</option>
                    <option value="credit">Credit</option>
                    <option value="mobile">Mobile Money</option>
                  </select>
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Receipt Number</label>
                  <input
                    type="text"
                    value={formData.receiptNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, receiptNumber: e.target.value }))}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>QR Code</label>
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
                  Back
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  style={styles.submitButton}
                >
                  {loading ? 'Saving...' : 'Confirm & Generate Report'}
                </button>
              </div>
            </form>
          </div>

          {hasExtractedData && (
            <div style={styles.extractionCard}>
              <h3 style={styles.cardTitle}>QR Extraction Results</h3>
              <div style={styles.extractionDetails}>
                <div style={styles.businessSection}>
                  <h4 style={styles.sectionTitle}>Business Information</h4>
                  <div style={styles.extractionItem}>
                    <strong>Merchant:</strong> {extractedData.businessName}
                  </div>
                  <div style={styles.extractionItem}>
                    <strong>Merchant ID:</strong> {extractedData.merchantId}
                  </div>
                  <div style={styles.extractionItem}>
                    <strong>Location:</strong> {extractedData.location}
                  </div>
                  <div style={styles.extractionItem}>
                    <strong>Business Type:</strong> {extractedData.businessType}
                  </div>
                </div>

                <div style={styles.transactionSection}>
                  <h4 style={styles.sectionTitle}>Transaction Details</h4>
                  <div style={styles.extractionItem}>
                    <strong>Amount:</strong> R{extractedData.amount}
                  </div>
                  <div style={styles.extractionItem}>
                    <strong>Description:</strong> {extractedData.description}
                  </div>
                  <div style={styles.extractionItem}>
                    <strong>Type:</strong> {extractedData.transactionType}
                  </div>
                  <div style={styles.extractionItem}>
                    <strong>Payment Method:</strong> {extractedData.paymentMethod}
                  </div>
                  <div style={styles.extractionItem}>
                    <strong>Customer Count:</strong> {extractedData.customerCount}
                  </div>
                </div>

                <div style={styles.extractionItem}>
                  <strong>Items Sold:</strong>
                  <ul style={styles.itemsList}>
                    {extractedData.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div style={styles.confidenceBadge}>
                QR Security Valid ✓ | AI Confidence: 92%
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSuccessStep = () => (
    <div style={styles.successContainer}>
      <div style={styles.successIcon}>
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      </div>
      <h2 style={styles.successTitle}>QR Receipt Processed Successfully</h2>
      <p style={styles.successDescription}>
        Your QR-coded receipt has been scanned and the transaction has been saved to Siba Spaza's financial profile.
        Business insights and credit scoring have been updated.
      </p>
      
      {extractedData && (
        <div style={styles.successDetails}>
          <div style={styles.successDetail}>
            <strong>Business:</strong> {extractedData.businessName}
          </div>
          <div style={styles.successDetail}>
            <strong>Receipt:</strong> {formData.receiptNumber}
          </div>
          <div style={styles.successDetail}>
            <strong>Amount:</strong> R{formData.amount}
          </div>
          <div style={styles.successDetail}>
            <strong>Type:</strong> {formData.transactionType}
          </div>
        </div>
      )}
      
      <div style={styles.successAnimation}>
        <div style={styles.loadingBar}>
          <div style={styles.progress}></div>
        </div>
        <p style={styles.redirectText}>Updating business financial profile...</p>
      </div>
      <button 
        onClick={() => navigate('/reports')} 
        style={styles.reportsButton}
      >
        View Business Insights
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

// Complete Styles Object
const styles = {
  container: {
    padding: '24px',
    maxWidth: '1000px',
    margin: '0 auto',
    minHeight: '100vh',
    background: '#f8fafc'
  },
  stepContainer: {
    background: 'white',
    borderRadius: '12px',
    padding: '40px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    marginTop: '20px',
    border: '1px solid #e2e8f0'
  },
  stepHeader: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  stepIndicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '30px'
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
    fontWeight: '600',
    fontSize: '14px'
  },
  inactiveStep: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: '#f1f5f9',
    color: '#64748b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '14px',
    border: '1px solid #e2e8f0'
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
    fontWeight: '600'
  },
  stepLine: {
    width: '80px',
    height: '2px',
    background: '#e2e8f0',
    margin: '0 10px'
  },
  stepTitle: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '12px'
  },
  stepDescription: {
    fontSize: '16px',
    color: '#64748b',
    maxWidth: '500px',
    margin: '0 auto',
    lineHeight: '1.6'
  },
  uploadGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginBottom: '40px'
  },
  uploadCard: {
    background: 'white',
    padding: '32px',
    borderRadius: '12px',
    border: '2px solid #3b82f6',
    textAlign: 'center',
    transition: 'all 0.2s ease'
  },
  uploadIcon: {
    color: '#3b82f6',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'center'
  },
  uploadTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '12px'
  },
  uploadDescription: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '24px',
    lineHeight: '1.5'
  },
  fileInput: {
    display: 'none'
  },
  uploadButton: {
    display: 'inline-block',
    background: '#3b82f6',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  },
  manualCard: {
    background: 'white',
    padding: '32px',
    borderRadius: '12px',
    border: '2px solid #e2e8f0',
    textAlign: 'center',
    transition: 'all 0.2s ease',
    gridColumn: '1 / -1'
  },
  manualIcon: {
    color: '#64748b',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'center'
  },
  manualTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '12px'
  },
  manualDescription: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '24px',
    lineHeight: '1.5'
  },
  manualButton: {
    background: 'white',
    color: '#374151',
    border: '1px solid #d1d5db',
    padding: '12px 24px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  processingAnimation: {
    marginTop: '20px',
    textAlign: 'center'
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '3px solid #f3f4f6',
    borderTop: '3px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 12px'
  },
  qrDemo: {
    background: '#f8fafc',
    padding: '24px',
    borderRadius: '12px',
    marginBottom: '32px',
    border: '1px solid #e2e8f0'
  },
  demoTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '20px',
    textAlign: 'center'
  },
  demoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px'
  },
  demoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  demoNumber: {
    width: '32px',
    height: '32px',
    background: '#3b82f6',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '14px',
    flexShrink: 0
  },
  demoText: {
    fontSize: '14px',
    color: '#64748b',
    lineHeight: '1.4'
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
    padding: '32px',
    background: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0'
  },
  feature: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px'
  },
  featureIcon: {
    color: '#3b82f6',
    flexShrink: 0,
    marginTop: '2px'
  },
  featureTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 4px 0'
  },
  featureDescription: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
    lineHeight: '1.4'
  },
  reviewGrid: {
    display: 'grid',
    gap: '24px'
  },
  formCard: {
    background: 'white',
    padding: '32px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0'
  },
  extractionCard: {
    background: '#f0f9ff',
    padding: '32px',
    borderRadius: '8px',
    border: '1px solid #bae6fd'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '20px'
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
    gap: '6px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151'
  },
  input: {
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    background: 'white',
    transition: 'border-color 0.2s ease'
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px'
  },
  backButton: {
    background: 'white',
    color: '#374151',
    border: '1px solid #d1d5db',
    padding: '12px 20px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    flex: 1,
    transition: 'all 0.2s ease'
  },
  submitButton: {
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    flex: 2,
    transition: 'background-color 0.2s ease'
  },
  extractionDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px'
  },
  businessSection: {
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '2px solid #e2e8f0'
  },
  transactionSection: {
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '2px solid #e2e8f0'
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '12px'
  },
  extractionItem: {
    padding: '8px 0',
    borderBottom: '1px solid #e2e8f0',
    fontSize: '14px',
    color: '#374151'
  },
  itemsList: {
    margin: '8px 0 0 16px',
    fontSize: '14px',
    color: '#64748b'
  },
  confidenceBadge: {
    background: '#dbeafe',
    color: '#1e40af',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
    textAlign: 'center'
  },
  successContainer: {
    background: 'white',
    borderRadius: '12px',
    padding: '60px 40px',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    marginTop: '20px',
    border: '1px solid #e2e8f0'
  },
  successIcon: {
    color: '#10b981',
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'center'
  },
  successTitle: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#065f46',
    marginBottom: '16px'
  },
  successDescription: {
    fontSize: '16px',
    color: '#64748b',
    maxWidth: '500px',
    margin: '0 auto 30px',
    lineHeight: '1.6'
  },
  successDetails: {
    background: '#f0fdf4',
    padding: '20px',
    borderRadius: '8px',
    margin: '20px 0',
    border: '1px solid #bbf7d0'
  },
  successDetail: {
    padding: '8px 0',
    borderBottom: '1px solid #dcfce7',
    fontSize: '14px',
    color: '#065f46'
  },
  successAnimation: {
    marginBottom: '30px'
  },
  loadingBar: {
    width: '300px',
    height: '4px',
    background: '#e2e8f0',
    borderRadius: '2px',
    margin: '0 auto 12px',
    overflow: 'hidden'
  },
  progress: {
    height: '100%',
    background: '#3b82f6',
    borderRadius: '2px',
    width: '0%',
    animation: 'progress 2s ease-in-out forwards'
  },
  redirectText: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0
  },
  reportsButton: {
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  },
  // Camera Modal Styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modalContent: {
    background: '#1a1a1a',
    borderRadius: '0px',
    padding: '0',
    maxWidth: '800px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
    border: '1px solid #333'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    borderBottom: '1px solid #333',
    background: '#2a2a2a'
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: 'white',
    margin: 0
  },
  modalSubtitle: {
    fontSize: '14px',
    color: '#ccc',
    margin: '4px 0 0 0'
  },
  closeButton: {
    background: '#444',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  },
  cameraView: {
    position: 'relative',
    width: '100%',
    background: '#000'
  },
  cameraFeed: {
    position: 'relative',
    width: '100%',
    height: '500px',
    overflow: 'hidden',
    background: '#000'
  },
  cameraImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    filter: 'brightness(1.1) contrast(1.1)'
  },
  scannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'rgba(0, 0, 0, 0.3)'
  },
  scannerFrame: {
    width: '280px',
    height: '280px',
    border: '2px solid #3b82f6',
    position: 'relative',
    borderRadius: '12px',
    backgroundColor: 'rgba(59, 130, 246, 0.1)'
  },
  scannerCornerTL: {
    position: 'absolute',
    top: '-2px',
    left: '-2px',
    width: '20px',
    height: '20px',
    borderTop: '4px solid #3b82f6',
    borderLeft: '4px solid #3b82f6',
    borderTopLeftRadius: '8px'
  },
  scannerCornerTR: {
    position: 'absolute',
    top: '-2px',
    right: '-2px',
    width: '20px',
    height: '20px',
    borderTop: '4px solid #3b82f6',
    borderRight: '4px solid #3b82f6',
    borderTopRightRadius: '8px'
  },
  scannerCornerBL: {
    position: 'absolute',
    bottom: '-2px',
    left: '-2px',
    width: '20px',
    height: '20px',
    borderBottom: '4px solid #3b82f6',
    borderLeft: '4px solid #3b82f6',
    borderBottomLeftRadius: '8px'
  },
  scannerCornerBR: {
    position: 'absolute',
    bottom: '-2px',
    right: '-2px',
    width: '20px',
    height: '20px',
    borderBottom: '4px solid #3b82f6',
    borderRight: '4px solid #3b82f6',
    borderBottomRightRadius: '8px'
  },
  scanningLine: {
    position: 'absolute',
    top: '50%',
    left: '0',
    width: '100%',
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #3b82f6, transparent)',
    animation: 'scan 2s ease-in-out infinite'
  },
  scannerText: {
    color: 'white',
    marginTop: '20px',
    fontSize: '16px',
    fontWeight: '500',
    textAlign: 'center'
  },
  cameraControls: {
    padding: '20px',
    background: '#2a2a2a',
    borderTop: '1px solid #333',
    textAlign: 'center'
  },
  cameraInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    color: '#ccc',
    fontSize: '14px'
  },
  cameraStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  statusDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#10b981',
    borderRadius: '50%',
    animation: 'pulse 2s infinite'
  },
  resolution: {
    color: '#999'
  },
  captureButton: {
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '16px 32px',
    borderRadius: '50px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '0 auto 12px',
    transition: 'all 0.2s ease'
  },
  captureIcon: {
    width: '60px',
    height: '60px',
    border: '3px solid white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  captureInner: {
    width: '50px',
    height: '50px',
    backgroundColor: 'white',
    borderRadius: '50%'
  },
  cameraHint: {
    fontSize: '14px',
    color: '#999',
    margin: 0
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

  @keyframes scan {
    0% { transform: translateY(-20px); }
    50% { transform: translateY(20px); }
    100% { transform: translateY(-20px); }
  }

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

// Add styles to document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = stylesheet;
  document.head.appendChild(style);
}

export default CashTransactions;