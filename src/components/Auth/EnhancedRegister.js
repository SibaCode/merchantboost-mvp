import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getTranslation } from '../../services/translation';
import { initializeDemoData } from '../../services/initDatabase';

const EnhancedRegister = () => {
  const { register } = useAuth();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('cipc');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states for each tab
  const [cipcData, setCipcData] = useState({
    registrationNumber: '',
    companyName: '',
    businessType: '',
    registrationDate: ''
  });

  const [taxData, setTaxData] = useState({
    taxNumber: '',
    businessName: '',
    businessType: '',
    taxStatus: ''
  });

  const [manualData, setManualData] = useState({
    businessName: '',
    businessType: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    businessAge: '',
    monthlyRevenue: ''
  });

  const simulateCipcAPI = async (registrationNumber) => {
    // Simulate API call to CIPC
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          companyName: 'Demo Business Pty Ltd',
          businessType: 'Private Company',
          registrationDate: '2022-01-15',
          status: 'Active'
        });
      }, 1500);
    });
  };

  const simulateTaxAPI = async (taxNumber) => {
    // Simulate API call to TaxDo
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          businessName: 'Demo Trading Enterprise',
          businessType: 'Sole Proprietor',
          taxStatus: 'Compliant',
          lastFiling: '2023-12-31'
        });
      }, 1500);
    });
  };

  const handleCipcLookup = async () => {
    if (!cipcData.registrationNumber) return;
    
    setLoading(true);
    try {
      const businessData = await simulateCipcAPI(cipcData.registrationNumber);
      setCipcData(prev => ({
        ...prev,
        companyName: businessData.companyName,
        businessType: businessData.businessType,
        registrationDate: businessData.registrationDate
      }));
    } catch (error) {
      setError('CIPC lookup failed. Please check registration number.');
    }
    setLoading(false);
  };

  const handleTaxLookup = async () => {
    if (!taxData.taxNumber) return;
    
    setLoading(true);
    try {
      const businessData = await simulateTaxAPI(taxData.taxNumber);
      setTaxData(prev => ({
        ...prev,
        businessName: businessData.businessName,
        businessType: businessData.businessType,
        taxStatus: businessData.taxStatus
      }));
    } catch (error) {
      setError('Tax number verification failed.');
    }
    setLoading(false);
  };

  const handleSubmit = async (e, formData, registrationType) => {
    e.preventDefault();
    setError('');

    if (registrationType === 'manual') {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    }

    setLoading(true);
    try {
      const userData = {
        registrationType,
        businessType: formData.businessType,
        phoneNumber: formData.phoneNumber,
        language: language,
        userType: 'merchant',
        ...formData
      };

      await register(
        registrationType === 'manual' ? formData.email : `${formData.businessName?.replace(/\s+/g, '').toLowerCase()}@merchantboost.com`,
        registrationType === 'manual' ? formData.password : 'temp123!',
        userData
      );
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const businessTypes = [
    'Retail Shop',
    'Restaurant/Cafe',
    'Service Provider',
    'Manufacturing',
    'Agriculture',
    'Construction',
    'Transport',
    'Beauty/Salon',
    'Clothing/Fashion',
    'Electronics',
    'Other'
  ];

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Business Registration</h2>
        <p style={styles.subtitle}>Choose your business registration type</p>
        
        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {/* Registration Type Tabs */}
        <div style={styles.tabContainer}>
          <button 
            style={{...styles.tab, ...(activeTab === 'cipc' && styles.activeTab)}}
            onClick={() => setActiveTab('cipc')}
          >
            🏢 Registered Business (CIPC)
          </button>
          <button 
            style={{...styles.tab, ...(activeTab === 'tax' && styles.activeTab)}}
            onClick={() => setActiveTab('tax')}
          >
            📊 Informal Business (Tax Number)
          </button>
          <button 
            style={{...styles.tab, ...(activeTab === 'manual' && styles.activeTab)}}
            onClick={() => setActiveTab('manual')}
          >
            🛒 Unregistered Business
          </button>
        </div>

        {/* CIPC Registered Business */}
        {activeTab === 'cipc' && (
          <div style={styles.tabContent}>
            <div style={styles.helpBox}>
              <h4>🏢 Registered Business Registration</h4>
              <p>For businesses registered with CIPC (Companies and Intellectual Property Commission). 
                 We'll verify your details automatically and you won't need to register again.</p>
            </div>

            <form onSubmit={(e) => handleSubmit(e, cipcData, 'cipc')} style={styles.form}>
              <div style={styles.formGroup}>
                <label>CIPC Registration Number *</label>
                <div style={styles.inputWithButton}>
                  <input
                    type="text"
                    value={cipcData.registrationNumber}
                    onChange={(e) => setCipcData(prev => ({ ...prev, registrationNumber: e.target.value }))}
                    required
                    style={styles.input}
                    placeholder="e.g., 2022/123456/07"
                  />
                  <button 
                    type="button"
                    onClick={handleCipcLookup}
                    disabled={loading || !cipcData.registrationNumber}
                    style={styles.lookupButton}
                  >
                    {loading ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
              </div>

              {cipcData.companyName && (
                <div style={styles.verifiedData}>
                  <h4>✅ Verified Business Details</h4>
                  <div style={styles.verifiedInfo}>
                    <div><strong>Company Name:</strong> {cipcData.companyName}</div>
                    <div><strong>Business Type:</strong> {cipcData.businessType}</div>
                    <div><strong>Registration Date:</strong> {cipcData.registrationDate}</div>
                  </div>
                </div>
              )}

              <div style={styles.formGroup}>
                <label>Phone Number *</label>
                <input
                  type="tel"
                  value={cipcData.phoneNumber || ''}
                  onChange={(e) => setCipcData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  required
                  style={styles.input}
                  placeholder="+27 XXX XXX XXXX"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading || !cipcData.companyName}
                style={styles.button}
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </button>
            </form>
          </div>
        )}

        {/* Tax Registered Business */}
        {activeTab === 'tax' && (
          <div style={styles.tabContent}>
            <div style={styles.helpBox}>
              <h4>📊 Tax Registered Business</h4>
              <p>For informal businesses with a tax number. We'll verify your tax status and help you 
                 access financial services.</p>
            </div>

            <form onSubmit={(e) => handleSubmit(e, taxData, 'tax')} style={styles.form}>
              <div style={styles.formGroup}>
                <label>Tax Number *</label>
                <div style={styles.inputWithButton}>
                  <input
                    type="text"
                    value={taxData.taxNumber}
                    onChange={(e) => setTaxData(prev => ({ ...prev, taxNumber: e.target.value }))}
                    required
                    style={styles.input}
                    placeholder="e.g., 1234567890"
                  />
                  <button 
                    type="button"
                    onClick={handleTaxLookup}
                    disabled={loading || !taxData.taxNumber}
                    style={styles.lookupButton}
                  >
                    {loading ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
              </div>

              {taxData.businessName && (
                <div style={styles.verifiedData}>
                  <h4>✅ Verified Business Details</h4>
                  <div style={styles.verifiedInfo}>
                    <div><strong>Business Name:</strong> {taxData.businessName}</div>
                    <div><strong>Business Type:</strong> {taxData.businessType}</div>
                    <div><strong>Tax Status:</strong> {taxData.taxStatus}</div>
                  </div>
                </div>
              )}

              <div style={styles.formGroup}>
                <label>Phone Number *</label>
                <input
                  type="tel"
                  value={taxData.phoneNumber || ''}
                  onChange={(e) => setTaxData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  required
                  style={styles.input}
                  placeholder="+27 XXX XXX XXXX"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading || !taxData.businessName}
                style={styles.button}
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </button>
            </form>
          </div>
        )}

        {/* Manual Registration */}
        {activeTab === 'manual' && (
          <div style={styles.tabContent}>
            <div style={styles.helpBox}>
              <h4>🛒 Unregistered Business</h4>
              <p>For small businesses and informal traders. Start tracking your transactions and 
                 we'll help you grow and formalize your business.</p>
            </div>

            <form onSubmit={(e) => handleSubmit(e, manualData, 'manual')} style={styles.form}>
              <div style={styles.formGroup}>
                <label>Business Name *</label>
                <input
                  type="text"
                  value={manualData.businessName}
                  onChange={(e) => setManualData(prev => ({ ...prev, businessName: e.target.value }))}
                  required
                  style={styles.input}
                  placeholder="Your business name"
                />
              </div>

              <div style={styles.formGroup}>
                <label>Business Type *</label>
                <select
                  value={manualData.businessType}
                  onChange={(e) => setManualData(prev => ({ ...prev, businessType: e.target.value }))}
                  required
                  style={styles.input}
                >
                  <option value="">Select business type</option>
                  {businessTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label>Business Location *</label>
                <input
                  type="text"
                  value={manualData.location}
                  onChange={(e) => setManualData(prev => ({ ...prev, location: e.target.value }))}
                  required
                  style={styles.input}
                  placeholder="City/Town and area"
                />
              </div>

              <div style={styles.formGroup}>
                <label>How long have you been in business? *</label>
                <select
                  value={manualData.businessAge}
                  onChange={(e) => setManualData(prev => ({ ...prev, businessAge: e.target.value }))}
                  required
                  style={styles.input}
                >
                  <option value="">Select duration</option>
                  <option value="0-6 months">0-6 months</option>
                  <option value="6-12 months">6-12 months</option>
                  <option value="1-2 years">1-2 years</option>
                  <option value="2-5 years">2-5 years</option>
                  <option value="5+ years">5+ years</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label>Estimated Monthly Revenue (R) *</label>
                <select
                  value={manualData.monthlyRevenue}
                  onChange={(e) => setManualData(prev => ({ ...prev, monthlyRevenue: e.target.value }))}
                  required
                  style={styles.input}
                >
                  <option value="">Select revenue range</option>
                  <option value="0-5000">0 - R5,000</option>
                  <option value="5000-10000">R5,000 - R10,000</option>
                  <option value="10000-25000">R10,000 - R25,000</option>
                  <option value="25000-50000">R25,000 - R50,000</option>
                  <option value="50000+">R50,000+</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label>Phone Number *</label>
                <input
                  type="tel"
                  value={manualData.phoneNumber}
                  onChange={(e) => setManualData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  required
                  style={styles.input}
                  placeholder="+27 XXX XXX XXXX"
                />
              </div>

              <div style={styles.formGroup}>
                <label>Email Address *</label>
                <input
                  type="email"
                  value={manualData.email}
                  onChange={(e) => setManualData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  style={styles.input}
                  placeholder="your.email@example.com"
                />
              </div>

              <div style={styles.formGroup}>
                <label>Password *</label>
                <input
                  type="password"
                  value={manualData.password}
                  onChange={(e) => setManualData(prev => ({ ...prev, password: e.target.value }))}
                  required
                  style={styles.input}
                  placeholder="Minimum 6 characters"
                />
              </div>

              <div style={styles.formGroup}>
                <label>Confirm Password *</label>
                <input
                  type="password"
                  value={manualData.confirmPassword}
                  onChange={(e) => setManualData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                  style={styles.input}
                  placeholder="Re-enter your password"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                style={styles.button}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          </div>
        )}

        <p style={styles.loginLink}>
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-light)',
    padding: '20px'
  },
  card: {
    background: 'var(--white)',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: 'var(--shadow-lg)',
    width: '100%',
    maxWidth: '600px'
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    marginBottom: '8px',
    textAlign: 'center',
    color: 'var(--text-dark)'
  },
  subtitle: {
    textAlign: 'center',
    color: 'var(--text-light)',
    marginBottom: '32px'
  },
  tabContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '8px',
    marginBottom: '32px',
    borderBottom: '1px solid var(--border)'
  },
  tab: {
    padding: '16px 12px',
    background: 'none',
    border: 'none',
    borderBottom: '3px solid transparent',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    color: 'var(--text-light)',
    textAlign: 'center',
    transition: 'all 0.3s ease'
  },
  activeTab: {
    color: 'var(--primary-blue)',
    borderBottomColor: 'var(--primary-blue)',
    background: 'rgba(37, 99, 235, 0.05)'
  },
  tabContent: {
    // Tab content styles
  },
  helpBox: {
    background: '#f0f9ff',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #bae6fd',
    marginBottom: '24px'
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
  label: {
    fontWeight: '500',
    color: 'var(--text-dark)',
    fontSize: '14px'
  },
  input: {
    padding: '12px 16px',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'border-color 0.3s ease'
  },
  inputWithButton: {
    display: 'flex',
    gap: '12px'
  },
  lookupButton: {
    background: 'var(--gradient-primary)',
    color: 'var(--white)',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0
  },
  verifiedData: {
    background: '#f0fdf4',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #bbf7d0'
  },
  verifiedInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    fontSize: '14px'
  },
  button: {
    background: 'var(--gradient-primary)',
    color: 'var(--white)',
    border: 'none',
    padding: '16px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '16px'
  },
  error: {
    background: '#fee2e2',
    color: '#dc2626',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px'
  },
  loginLink: {
    textAlign: 'center',
    marginTop: '24px',
    color: 'var(--text-light)'
  }
};

export default EnhancedRegister;