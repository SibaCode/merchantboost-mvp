import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getTranslation } from '../../services/translation';

const ConsentManager = () => {
  const { userProfile, updateProfile } = useAuth();
  const { language } = useLanguage();
  const [consent, setConsent] = useState({
    incubators: false,
    municipalities: false,
    lenders: false,
    insurers: false
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userProfile?.consent) {
      setConsent(userProfile.consent);
    }
  }, [userProfile]);

  const handleConsentChange = async (stakeholder, value) => {
    const newConsent = { ...consent, [stakeholder]: value };
    setConsent(newConsent);
    
    setSaving(true);
    await updateProfile({ consent: newConsent });
    setSaving(false);
  };

  const stakeholders = [
    {
      key: 'incubators',
      name: 'Business Incubators & Support Desks',
      description: 'Allow business support organizations to view your insights and offer mentorship, training, and grants.',
      icon: '🏢'
    },
    {
      key: 'municipalities',
      name: 'Municipalities & Government',
      description: 'Share aggregated data with local government to help improve economic development programs.',
      icon: '🏛️'
    },
    {
      key: 'lenders',
      name: 'Lenders & Financial Institutions',
      description: 'Enable lenders to see verified business insights for better loan offers and financing options.',
      icon: '💰'
    },
    {
      key: 'insurers',
      name: 'Insurance Providers',
      description: 'Allow insurers to view business health for tailored insurance package offers.',
      icon: '🛡️'
    }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Data Sharing Consent</h2>
        <p style={styles.subtitle}>
          Control who can access your business insights and data
        </p>
      </div>

      <div style={styles.consentNote}>
        <strong>Important:</strong> Your raw transaction data is never shared. 
        Stakeholders only see AI-verified insights and aggregated trends when you give consent.
      </div>

      <div style={styles.consentGrid}>
        {stakeholders.map(stakeholder => (
          <div key={stakeholder.key} style={styles.consentCard}>
            <div style={styles.cardHeader}>
              <span style={styles.icon}>{stakeholder.icon}</span>
              <h3 style={styles.stakeholderName}>{stakeholder.name}</h3>
            </div>
            
            <p style={styles.description}>{stakeholder.description}</p>
            
            <div style={styles.toggleSection}>
              <label style={styles.toggleLabel}>
                <input
                  type="checkbox"
                  checked={consent[stakeholder.key]}
                  onChange={(e) => handleConsentChange(stakeholder.key, e.target.checked)}
                  style={styles.toggle}
                />
                <span style={styles.slider}></span>
                <span style={styles.toggleText}>
                  {consent[stakeholder.key] ? 'Allowed' : 'Denied'}
                </span>
              </label>
            </div>

            {consent[stakeholder.key] && (
              <div style={styles.accessInfo}>
                <small>
                  ✅ Can view: Business tier, revenue trends, cash/digital ratios<br/>
                  ❌ Cannot view: Individual transactions, personal contact info
                </small>
              </div>
            )}
          </div>
        ))}
      </div>

      {saving && (
        <div style={styles.savingIndicator}>
          Saving your preferences...
        </div>
      )}

      <div style={styles.auditNote}>
        <small>
          All consent changes are logged for compliance. Last updated: {' '}
          {userProfile?.updatedAt ? new Date(userProfile.updatedAt.seconds * 1000).toLocaleDateString() : 'Never'}
        </small>
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
  header: {
    marginBottom: '32px',
    textAlign: 'center'
  },
  subtitle: {
    color: 'var(--text-light)',
    fontSize: '16px',
    marginTop: '8px'
  },
  consentNote: {
    background: '#fef3c7',
    border: '1px solid #f59e0b',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '32px',
    fontSize: '14px'
  },
  consentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
  },
  consentCard: {
    background: 'var(--white)',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: 'var(--shadow)',
    border: '2px solid var(--border)'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px'
  },
  icon: {
    fontSize: '24px'
  },
  stakeholderName: {
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--text-dark)',
    margin: 0
  },
  description: {
    color: 'var(--text-light)',
    lineHeight: '1.5',
    marginBottom: '20px',
    fontSize: '14px'
  },
  toggleSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  toggleLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer'
  },
  toggle: {
    display: 'none'
  },
  slider: {
    width: '50px',
    height: '24px',
    background: '#ccc',
    borderRadius: '24px',
    position: 'relative',
    transition: 'background 0.3s'
  },
  toggleText: {
    fontWeight: '500',
    fontSize: '14px'
  },
  accessInfo: {
    background: '#f0f9ff',
    padding: '12px',
    borderRadius: '6px',
    marginTop: '16px',
    border: '1px solid #bae6fd'
  },
  savingIndicator: {
    textAlign: 'center',
    color: 'var(--success)',
    fontStyle: 'italic',
    marginBottom: '16px'
  },
  auditNote: {
    textAlign: 'center',
    color: 'var(--text-light)',
    fontStyle: 'italic'
  }
};

// Add CSS for toggle slider
const toggleStyles = `
  input[type="checkbox"]:checked + span {
    background: var(--success);
  }
  
  input[type="checkbox"]:checked + span:before {
    transform: translateX(26px);
  }
  
  span:before {
    content: '';
    position: absolute;
    width: '20px';
    height: '20px';
    border-radius: '50%';
    background: white;
    top: '2px';
    left: '2px';
    transition: transform 0.3s;
  }
`;

export default ConsentManager;