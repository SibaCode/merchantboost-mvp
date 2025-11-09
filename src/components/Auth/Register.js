import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getTranslation } from '../../services/translation';

const Register = () => {
  const { register } = useAuth();
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    businessType: '',
    phoneNumber: '',
    language: language
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(formData.email, formData.password, {
        businessName: formData.businessName,
        businessType: formData.businessType,
        phoneNumber: formData.phoneNumber,
        language: formData.language,
        userType: 'merchant'
      });
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{getTranslation('signup', language)}</h2>
        
        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Business Name</label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Business Type</label>
            <select
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              required
              style={styles.input}
            >
              <option value="">Select Business Type</option>
              <option value="retail">Retail</option>
              <option value="services">Services</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="agriculture">Agriculture</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={styles.button}
          >
            {loading ? 'Creating Account...' : getTranslation('signup', language)}
          </button>
        </form>

        <p style={styles.loginLink}>
          Already have an account? <a href="/login">Login</a>
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
    maxWidth: '480px'
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    marginBottom: '32px',
    textAlign: 'center',
    color: 'var(--text-dark)'
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

export default Register;