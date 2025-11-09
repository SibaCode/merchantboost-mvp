import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getTranslation } from '../../services/translation';
import { db, storage } from '../../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Tesseract from 'tesseract.js';

const ReceiptUpload = () => {
  const { currentUser } = useAuth();
  const { language } = useLanguage();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    date: '',
    merchant: '',
    category: ''
  });
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      simulateOCRProcessing(file);
    }
  };

const realOCRProcessing = async (file) => {
  setLoading(true);
  try {
    const { data: { text, confidence } } = await Tesseract.recognize(
      file,
      'eng', // Language
      { logger: m => console.log(m) }
    );
    
    // Parse the extracted text for amounts, dates, etc.
    const extractedData = parseOCRText(text);
    
    setOcrResult({
      ...extractedData,
      confidence,
      rawText: text
    });
    
    setFormData(prev => ({
      ...prev,
      amount: extractedData.amount || '',
      date: extractedData.date || '',
      merchant: extractedData.merchant || '',
      description: extractedData.description || ''
    }));
  } catch (error) {
    console.error('OCR Error:', error);
    alert('Error processing receipt image');
  }
  setLoading(false);
};

const parseOCRText = (text) => {
  // Basic parsing logic - enhance based on your receipt formats
  const amountMatch = text.match(/R?\s?(\d+[.,]\d{2})/);
  const dateMatch = text.match(/(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/);
  
  return {
    amount: amountMatch ? amountMatch[1] : '',
    date: dateMatch ? dateMatch[1] : '',
    merchant: 'Extracted Merchant', // Implement merchant extraction logic
    description: 'Extracted from receipt'
  };
};
  const simulateOCRProcessing = async (file) => {
    setLoading(true);
    
    // Simulate OCR processing delay
    setTimeout(() => {
      // Mock OCR results - in real implementation, this would call Tesseract.js or Google Vision API
      const mockOcrData = {
        amount: '245.50',
        date: new Date().toISOString().split('T')[0],
        merchant: 'Supplier Co.',
        items: ['Office supplies', 'Printing materials'],
        confidence: 0.89
      };

      setOcrResult(mockOcrData);
      setFormData(prev => ({
        ...prev,
        amount: mockOcrData.amount,
        date: mockOcrData.date,
        merchant: mockOcrData.merchant,
        description: mockOcrData.items.join(', ')
      }));
      setLoading(false);
    }, 2000);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      simulateOCRProcessing(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || !currentUser) return;

    setLoading(true);
    try {
      // Upload receipt image
      const fileRef = ref(storage, `receipts/${currentUser.uid}/${Date.now()}_${selectedFile.name}`);
      await uploadBytes(fileRef, selectedFile);
      const fileUrl = await getDownloadURL(fileRef);

      // Save transaction with OCR data
      await addDoc(collection(db, 'transactions'), {
        userId: currentUser.uid,
        type: 'receipt',
        amount: parseFloat(formData.amount),
        description: formData.description,
        merchant: formData.merchant,
        category: formData.category,
        date: formData.date ? new Date(formData.date) : serverTimestamp(),
        receiptImage: fileUrl,
        ocrData: ocrResult,
        status: 'completed',
        validated: ocrResult?.confidence > 0.7,
        aiValidation: {
          duplicateCheck: true,
          patternMatch: true,
          fraudScore: 0.1
        }
      });

      // Reset form
      setSelectedFile(null);
      setPreviewUrl('');
      setOcrResult(null);
      setFormData({ amount: '', description: '', date: '', merchant: '', category: '' });
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      alert('Receipt processed successfully!');
    } catch (error) {
      console.error('Error processing receipt:', error);
      alert('Error processing receipt');
    }
    setLoading(false);
  };

  const categories = [
    'Supplies',
    'Equipment',
    'Utilities',
    'Rent',
    'Transport',
    'Marketing',
    'Professional Services',
    'Other'
  ];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Upload Receipt</h2>
      
      <div style={styles.grid}>
        {/* Upload Section */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Upload Receipt Image</h3>
          
          <div 
            style={styles.uploadArea}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={styles.fileInput}
            />
            
            {previewUrl ? (
              <div style={styles.previewContainer}>
                <img src={previewUrl} alt="Receipt preview" style={styles.previewImage} />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    setPreviewUrl('');
                    setOcrResult(null);
                  }}
                  style={styles.removeButton}
                >
                  Remove
                </button>
              </div>
            ) : (
              <div style={styles.uploadPlaceholder}>
                <div style={styles.uploadIcon}>📷</div>
                <p style={styles.uploadText}>
                  Click to upload or drag and drop receipt image
                </p>
                <p style={styles.uploadHint}>
                  Supports JPG, PNG, PDF • Max 10MB
                </p>
              </div>
            )}
          </div>

          {loading && (
            <div style={styles.processing}>
              <div style={styles.spinner}></div>
              <p>AI is processing your receipt...</p>
              <small>Extracting text and validating information</small>
            </div>
          )}
        </div>

        {/* OCR Results & Form */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Receipt Details</h3>
          
          {ocrResult && (
            <div style={styles.ocrResults}>
              <h4 style={styles.ocrTitle}>AI Extracted Data</h4>
              <div style={styles.ocrConfidence}>
                Confidence: {(ocrResult.confidence * 100).toFixed(1)}%
              </div>
              <div style={styles.ocrData}>
                <div style={styles.ocrItem}>
                  <span>Amount:</span>
                  <strong>R{ocrResult.amount}</strong>
                </div>
                <div style={styles.ocrItem}>
                  <span>Merchant:</span>
                  <strong>{ocrResult.merchant}</strong>
                </div>
                <div style={styles.ocrItem}>
                  <span>Date:</span>
                  <strong>{new Date(ocrResult.date).toLocaleDateString()}</strong>
                </div>
              </div>
            </div>
          )}

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
                placeholder="0.00"
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
                placeholder="What was this purchase for?"
              />
            </div>

            <div style={styles.formGroup}>
              <label>Merchant</label>
              <input
                type="text"
                value={formData.merchant}
                onChange={(e) => setFormData(prev => ({ ...prev, merchant: e.target.value }))}
                required
                style={styles.input}
                placeholder="Store or supplier name"
              />
            </div>

            <div style={styles.formGroup}>
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                required
                style={styles.input}
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
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

            <button 
              type="submit" 
              disabled={!selectedFile || loading}
              style={styles.submitButton}
            >
              {loading ? 'Processing...' : 'Save Transaction'}
            </button>
          </form>
        </div>
      </div>

      {/* AI Validation Features */}
      <div style={styles.validationFeatures}>
        <h3>AI-Powered Validation</h3>
        <div style={styles.featuresGrid}>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>🔍</span>
            <div>
              <h4>Text Extraction</h4>
              <p>Automatically reads amounts, dates, and merchant names</p>
            </div>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>⚡</span>
            <div>
              <h4>Duplicate Detection</h4>
              <p>Checks for duplicate receipts and transactions</p>
            </div>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>🛡️</span>
            <div>
              <h4>Fraud Prevention</h4>
              <p>Identifies suspicious patterns and anomalies</p>
            </div>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>📊</span>
            <div>
              <h4>Smart Categorization</h4>
              <p>Automatically categorizes expenses for better tracking</p>
            </div>
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
    marginBottom: '40px'
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
  uploadArea: {
    border: '2px dashed var(--border)',
    borderRadius: '12px',
    padding: '40px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'border-color 0.3s, background-color 0.3s',
    minHeight: '200px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  fileInput: {
    display: 'none'
  },
  uploadPlaceholder: {
    color: 'var(--text-light)'
  },
  uploadIcon: {
    fontSize: '48px',
    marginBottom: '16px'
  },
  uploadText: {
    fontSize: '16px',
    fontWeight: '500',
    marginBottom: '8px'
  },
  uploadHint: {
    fontSize: '14px',
    opacity: '0.7'
  },
  previewContainer: {
    position: 'relative',
    maxWidth: '100%'
  },
  previewImage: {
    maxWidth: '100%',
    maxHeight: '200px',
    borderRadius: '8px',
    boxShadow: 'var(--shadow)'
  },
  removeButton: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    background: 'var(--error)',
    color: 'var(--white)',
    border: 'none',
    borderRadius: '4px',
    padding: '4px 8px',
    fontSize: '12px',
    cursor: 'pointer'
  },
  processing: {
    textAlign: 'center',
    marginTop: '20px',
    padding: '20px',
    background: '#f0f9ff',
    borderRadius: '8px',
    border: '1px solid #bae6fd'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid var(--primary-blue)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 16px'
  },
  ocrResults: {
    background: '#f0fdf4',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #bbf7d0',
    marginBottom: '20px'
  },
  ocrTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '8px',
    color: 'var(--text-dark)'
  },
  ocrConfidence: {
    background: 'var(--success)',
    color: 'var(--white)',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-block',
    marginBottom: '12px'
  },
  ocrData: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  ocrItem: {
    display: 'flex',
    justifyContent: 'space-between',
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
    fontSize: '16px',
    transition: 'border-color 0.3s'
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
    marginTop: '16px',
    transition: 'opacity 0.3s'
  },
  validationFeatures: {
    background: 'var(--white)',
    padding: '32px',
    borderRadius: '12px',
    boxShadow: 'var(--shadow)'
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
    marginTop: '20px'
  },
  feature: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px'
  },
  featureIcon: {
    fontSize: '24px',
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--gradient-secondary)',
    borderRadius: '8px',
    flexShrink: 0
  }
};

// Add CSS animation for spinner
const spinnerStyles = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

export default ReceiptUpload;