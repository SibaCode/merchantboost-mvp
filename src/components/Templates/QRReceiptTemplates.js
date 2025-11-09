import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const QRReceiptTemplates = () => {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "QR Receipt Templates",
      subtitle: "Download our special receipt books with unique QR codes to prevent fraud",
      features: [
        "Unique QR codes for each receipt",
        "Prevents duplicate entries and fraud",
        "Builds trust with customers",
        "Easy to scan and track"
      ],
      download: "Download Template Pack",
      instructions: "Print these templates and use them for all your business transactions"
    },
    zu: {
      title: "Amathempulethi Erisidi Ye-QR",
      subtitle: "Landa izincwadi zethu ezikhethekile zamalisiti anamakhodi e-QR ahlukile ukuvimbela ukukhwabanisa",
      features: [
        "Amakhodi e-QR ahlukile kulisidi ngalinye",
        "Avimbela ukufakwa okuphindaphindiwe nokukhwabanisa",
        "Yakha ukwethembana amakhasimende",
        "Kulula ukuskena nokulandelela"
      ],
      download: "Landa Iphakethe Yethempulethi",
      instructions: "Printa la mathempulethi bese uwasebenzisa kukho konke ukutshintshiselana kwebhizinisi lakho"
    },
    xh: {
      title: "Iitheyiphu ZeRisidi Ye-QR",
      subtitle: "Khuphela iincwadi zethu ezikhethekile zeerisiti ezinamakhodi e-QR ahlukileyo ukuyivimba utshintshishelwano",
      features: [
        "Iikhodi ze-QR ezizodwa kwirisiti nganye",
        "Iyayivimba into ephindaphindiweyo notshintshishelwano",
        "Yakha uthemba kunabathengi",
        "Kulula ukuyiskena nokuyilandela"
      ],
      download: "Khuphela Ipakathi YeTheypu",
      instructions: "Printa ezi theypu kwaye uzisebenzise kuzo zonke iintengiselwano zakho zeShishini"
    },
    af: {
      title: "QR Kwitansie Templates",
      subtitle: "Laai ons spesiale kwitansieboeke af met unieke QR-kodes om bedrog te voorkom",
      features: [
        "Unieke QR-kodes vir elke kwitansie",
        "Voorkom duplikaatinskrywings en bedrog",
        "Bou vertroue met kliënte",
        "Maklik om te skandeer en op te spoor"
      ],
      download: "Laai Template Pakket Af",
      instructions: "Druk hierdie templates en gebruik dit vir al jou besigheidstransaksies"
    }
  };

  const t = content[language] || content.en;

  const handleDownload = () => {
    // Simulate download
    alert('Downloading QR Receipt Template Pack...');
    // In real implementation, this would download actual PDF templates
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>{t.title}</h1>
        <p style={styles.subtitle}>{t.subtitle}</p>
      </div>

      <div style={styles.content}>
        <div style={styles.features}>
          <h2 style={styles.sectionTitle}>Key Features</h2>
          <div style={styles.featuresGrid}>
            {t.features.map((feature, index) => (
              <div key={index} style={styles.featureCard}>
                <div style={styles.featureIcon}>✅</div>
                <p style={styles.featureText}>{feature}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.templatePreview}>
          <h2 style={styles.sectionTitle}>Template Preview</h2>
          <div style={styles.previewCard}>
            <div style={styles.receiptMockup}>
              <div style={styles.receiptHeader}>
                <h3 style={styles.receiptTitle}>MERCHANTBOOST RECEIPT</h3>
                <div style={styles.qrCode}>📱 QR CODE</div>
              </div>
              <div style={styles.receiptBody}>
                <p style={styles.receiptLine}><strong>Receipt No:</strong> MB-2024-001</p>
                <p style={styles.receiptLine}><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                <p style={styles.receiptLine}><strong>Amount:</strong> R150.00</p>
                <p style={styles.receiptLine}><strong>Description:</strong> Product Sale</p>
              </div>
              <div style={styles.receiptFooter}>
                <p style={styles.footerText}>Scan QR code to verify authenticity</p>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.downloadSection}>
          <button onClick={handleDownload} style={styles.downloadButton}>
            📥 {t.download}
          </button>
          <p style={styles.instructions}>{t.instructions}</p>
        </div>
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
  header: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '16px',
    margin: 0
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#6b7280',
    maxWidth: '600px',
    margin: '0 auto'
  },
  content: {
    display: 'grid',
    gap: '40px'
  },
  features: {
    background: 'white',
    padding: '32px',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '24px',
    textAlign: 'center',
    margin: 0
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px'
  },
  featureCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    background: '#f8fafc',
    borderRadius: '8px'
  },
  featureIcon: {
    fontSize: '1.2rem'
  },
  featureText: {
    margin: 0,
    fontWeight: '500',
    color: '#374151'
  },
  templatePreview: {
    background: 'white',
    padding: '32px',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
  },
  previewCard: {
    display: 'flex',
    justifyContent: 'center'
  },
  receiptMockup: {
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    padding: '24px',
    background: 'white',
    maxWidth: '300px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  receiptHeader: {
    textAlign: 'center',
    borderBottom: '2px solid #e5e7eb',
    paddingBottom: '12px',
    marginBottom: '16px'
  },
  receiptTitle: {
    margin: '0 0 12px 0',
    color: '#1f2937',
    fontSize: '1.1rem',
    fontWeight: '600'
  },
  qrCode: {
    background: '#f3f4f6',
    padding: '12px',
    borderRadius: '8px',
    fontWeight: '600',
    color: '#374151'
  },
  receiptBody: {
    marginBottom: '16px'
  },
  receiptLine: {
    margin: '8px 0',
    color: '#374151',
    fontSize: '0.9rem'
  },
  receiptFooter: {
    textAlign: 'center',
    borderTop: '1px solid #e5e7eb',
    paddingTop: '12px'
  },
  footerText: {
    fontSize: '0.9rem',
    color: '#6b7280',
    margin: 0
  },
  downloadSection: {
    textAlign: 'center',
    background: 'white',
    padding: '32px',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
  },
  downloadButton: {
    background: 'linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)',
    color: 'white',
    border: 'none',
    padding: '16px 32px',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '16px'
  },
  instructions: {
    color: '#6b7280',
    fontSize: '1rem',
    margin: 0
  }
};

export default QRReceiptTemplates;