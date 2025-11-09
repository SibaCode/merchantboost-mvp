import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getTranslation } from '../../services/translation';
import { db } from '../../services/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const UserFriendlyDashboard = () => {
  const { userProfile, currentUser } = useAuth();
  const { language } = useLanguage();
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    cashTransactions: 0,
    nonCashTransactions: 0,
    receiptUploads: 0
  });
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const transactionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTransactions(transactionsData.slice(-5).reverse());

      const cashTransactions = transactionsData.filter(t => t.type === 'cash').length;
      const nonCashTransactions = transactionsData.filter(t => t.type === 'non-cash').length;
      const receiptUploads = transactionsData.filter(t => t.type === 'receipt').length;
      const totalRevenue = transactionsData.reduce((sum, t) => sum + t.amount, 0);

      setStats({
        totalRevenue,
        cashTransactions,
        nonCashTransactions,
        receiptUploads
      });
    });

    return unsubscribe;
  }, [currentUser]);

  // Multi-language content
  const dashboardText = {
    en: {
      welcome: "Welcome to Your Business Hub",
      subtitle: "Everything you need to grow your business in one place",
      overview: "Overview",
      transactions: "Transactions", 
      services: "Services",
      help: "Help",
      totalRevenue: "Total Revenue",
      cashTransactions: "Cash Transactions",
      digitalTransactions: "Digital Transactions",
      receiptsProcessed: "Receipts Processed",
      quickActions: "Quick Actions",
      recentActivity: "Recent Activity",
      noTransactions: "No transactions yet",
      startRecording: "Start recording your business transactions",
      downloadTemplates: "Download QR Receipt Templates",
      downloadDesc: "Get our special receipt books with unique QR codes to prevent fraud",
      recordCash: "Record Cash Transaction",
      recordCashDesc: "Scan QR codes or manually enter cash sales",
      connectBank: "Connect Bank Account", 
      connectBankDesc: "Link your bank for automatic transaction tracking",
      uploadReceipt: "Upload Receipt",
      uploadReceiptDesc: "Upload receipt images for AI processing",
      chatAI: "Chat with Business AI",
      chatAIDesc: "Get personalized business advice and health reports",
      viewReports: "View Business Reports",
      viewReportsDesc: "See insights and recommendations for growth",
      supportServices: "Support Services Available",
      businessLoans: "Business Loans",
      loansDesc: "Access working capital based on your transaction history",
      insurance: "Business Insurance",
      insuranceDesc: "Protect your business with tailored packages",
      training: "Training Programs",
      trainingDesc: "Business skills and financial literacy workshops",
      mentorship: "Mentorship",
      mentorshipDesc: "Connect with experienced business mentors",
      eligible: "Eligible",
      buildProfile: "Build your profile",
      available: "Available",
      upgradeTier: "Upgrade tier"
    },
    zu: {
      welcome: "Wamukelekile E-Hub Yakho Yebhizinisi",
      subtitle: "Konke okudingayo ukukhulisa ibhizinisi lakho ndawonye",
      overview: "Isishwankathelo",
      transactions: "Ukutshintshiselana",
      services: "Izinsiza",
      help: "Usizo",
      totalRevenue: "Isamba Semali Eningiziwe",
      cashTransactions: "Ukutshintshiselana Ngemali",
      digitalTransactions: "Ukutshintshiselana Ngedijithali", 
      receiptsProcessed: "Amalisiti Acutshunguliwe",
      quickActions: "Izenzo Ezesheshayo",
      recentActivity: "Umsebenzi Wakamuva",
      noTransactions: "Awekho ukutshintshiselana okwamanje",
      startRecording: "Qala ukurekhoda ukutshintshiselana kwebhizinisi lakho",
      downloadTemplates: "Landa Amatheemplathi Erisidi Ye-QR",
      downloadDesc: "Thola izincwadi zethu ezikhethekile zamalisiti anamakhodi e-QR ahlukile ukuvimbela ukukhwabanisa",
      recordCash: "Rekhoda Ukutshintshiselana Ngemali",
      recordCashDesc: "Skena amakhodi e-QR noma ufake ngokwesandla ukuthengiswa kwemali",
      connectBank: "Xhuma I-akhawunti Yasebhange",
      connectBankDesc: "Xhuma ibhange lakho ukuze ulandelele ukutshintshiselana okuzenzakalelayo",
      uploadReceipt: "Layisha Irisidi",
      uploadReceiptDesc: "Layisha izithombe zezirisidi ukuze zicutshungulwe yi-AI",
      chatAI: "Xoxa Ne-AI Yebhizinisi", 
      chatAIDesc: "Thola izeluleko ezilungele ibhizinisi lakho namariphoti empilo",
      viewReports: "Buka Amariphoti Ebhizinisi",
      viewReportsDesc: "Buka imininingwane nezincomo zokukhula",
      supportServices: "Izinsiza Zokusekela Ezitholakalayo",
      businessLoans: "Amalani Ebhizinisi",
      loansDesc: "Thola imali yokusebenza ngokusekelwe emlandweni wakho wokutshintshiselana",
      insurance: "Inshorensi Yebhizinisi",
      insuranceDesc: "Vikela ibhizinisi lakho ngamaphakheji alungiselelwe wena",
      training: "Izinhlelo Zokuqeqesha",
      trainingDesc: "Amakhilasi amakhono ebhizinisi nokwazi ngezezimali",
      mentorship: "Ukeluleko",
      mentorshipDesc: "Xhumana noseluleki abanolwazi bebhizinisi",
      eligible: "Uyafaneleka",
      buildProfile: "Yakha iphrofayili yakho", 
      available: "Iyatholakala",
      upgradeTier: "Thuthukisa isigaba"
    },
    xh: {
      welcome: "Wamkelekile Kwi-Hub Yakho YeShishini",
      subtitle: "Yonke into oyifunayo ukukhulisa ishishini lakho ndawonye",
      overview: "Isishwankathelo",
      transactions: "Iintengiselwano",
      services: "Inkonzo",
      help: "Uncedo",
      totalRevenue: "Isamba SeMali Efunyenweyo",
      cashTransactions: "Iintengiselwano ZeMali",
      digitalTransactions: "Iintengiselwano Zedijithali",
      receiptsProcessed: "Iirisiti Ezicetyiweyo",
      quickActions: "Izenzo Ezikhawulezileyo",
      recentActivity: "Umsebenzi Wakutsha",
      noTransactions: "Akukho ntengiselwano okwangoku",
      startRecording: "Qala ukurekhoda iintengiselwano zakho zeShishini",
      downloadTemplates: "Khuphela Iitheyiphu ZeRisidi Ye-QR",
      downloadDesc: "Fumana iincwadi zethu ezikhethekile zeerisiti ezinamakhodi e-QR ahlukileyo ukuyivimba utshintshishelwano",
      recordCash: "Rekhoda Intengiselwano YeMali",
      recordCashDesc: "Skena iikhodi ze-QR okanye ufake ngesandla ukuthengiswa kwemali",
      connectBank: "Qhagamshela Iakhawunti YaseBhange",
      connectBankDesc: "Qhagamshela ibhange lakho ukuze ulandele iintengiselwano ezenzekelayo",
      uploadReceipt: "Layisha Irisidi",
      uploadReceiptDesc: "Layisha iirisiti zomfanekiso ukuze zicutyungulwe yi-AI",
      chatAI: "Thetha Ne-AI YeShishini",
      chatAIDesc: "Fumana iingcebiso ezilungele ishishini lakho kunye neengxelo zempilo",
      viewReports: "Jonga Iingxelo ZeShishini",
      viewReportsDesc: "Jonga iingcebiso kunye neengcebiso zokukhula",
      supportServices: "Iinkonzo Zonxibo Ezifumanekayo",
      businessLoans: "Iimali Eshishini",
      loansDesc: "Fumana imali yokusebenza ngokusekelwe kwimbali yakho yentengiselwano",
      insurance: "Inshorensi YeShishini",
      insuranceDesc: "Khusela ishishini lakho ngamapakethi alungiselelwe wena",
      training: "Iinkqubo Zokuqeqesha",
      trainingDesc: "Iworkshop yobuchule beshishini nolwazi lwezemali",
      mentorship: "Ukeluleko",
      mentorshipDesc: "Qhagamshelana noseluleki abanamava beshishini",
      eligible: "Uyafaneleka",
      buildProfile: "Yakha iphrofayile yakho",
      available: "Iyafumaneka",
      upgradeTier: "Phakamisa isigaba"
    },
    af: {
      welcome: "Welkom by Jou Besigheid Sentrum",
      subtitle: "Alles wat jy nodig het om jou besigheid te laat groei op een plek",
      overview: "Oorsig",
      transactions: "Transaksies",
      services: "Dienste", 
      help: "Hulp",
      totalRevenue: "Totale Inkomste",
      cashTransactions: "Kontant Transaksies",
      digitalTransactions: "Digitale Transaksies",
      receiptsProcessed: "Kwitansies Verwerk",
      quickActions: "Vinnige Aksies",
      recentActivity: "Onlangse Aktiwiteit",
      noTransactions: "Nog geen transaksies nie",
      startRecording: "Begin om jou besigheidstransaksies aan te teken",
      downloadTemplates: "Laai QR Kwitansie Templates Af",
      downloadDesc: "Kry ons spesiale kwitansieboeke met unieke QR-kodes om bedrog te voorkom",
      recordCash: "Teken Kontant Transaksie Aan",
      recordCashDesc: "Skandeer QR-kodes of voer kontantverkope handmatig in",
      connectBank: "Koppel Bankrekening",
      connectBankDesc: "Koppel jou bank vir outomatiese transaksie-opsporing",
      uploadReceipt: "Laai Kwitansie Op",
      uploadReceiptDesc: "Laai kwitansiebeelde op vir AI-verwerking",
      chatAI: "Gesels met Besigheid AI",
      chatAIDesc: "Kry persoonlike besigheidsadvies en gesondheidsverslae",
      viewReports: "Besiensig Besigheidsverslae",
      viewReportsDesc: "Sien insigte en aanbevelings vir groei",
      supportServices: "Ondersteuningsdienste Beskikbaar",
      businessLoans: "Besigheidslenings",
      loansDesc: "Kry werkkapitaal gebaseer op jou transaksiegeskiedenis",
      insurance: "Besigheidsversekering",
      insuranceDesc: "Beskerm jou besigheid met toegesneem pakkette",
      training: "Opleidingsprogramme",
      trainingDesc: "Besigheidsvaardighede en finansiële geletterdheid werkswinkels",
      mentorship: "Mentorskap",
      mentorshipDesc: "Kontak met ervare besigheidsmentors",
      eligible: "Kwalifiseer",
      buildProfile: "Bou jou profiel",
      available: "Beskikbaar",
      upgradeTier: "Gradeer vlak op"
    }
  };

  const t = dashboardText[language] || dashboardText.en;

  const getServiceStatus = (service) => {
    if (service === 'loans') {
      return stats.totalRevenue > 5000 ? t.eligible : t.buildProfile;
    } else if (service === 'insurance') {
      return stats.cashTransactions + stats.nonCashTransactions > 10 ? t.available : t.buildProfile;
    } else if (service === 'mentorship') {
      return userProfile?.tier === 'pro' ? t.available : t.upgradeTier;
    }
    return t.available;
  };

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.welcomeTitle}>{t.welcome}</h1>
          <p style={styles.welcomeSubtitle}>{t.subtitle}</p>
          <div style={styles.businessInfo}>
            <span style={styles.businessName}>{userProfile?.businessName}</span>
            <span style={styles.tierBadge}>
              {userProfile?.tier?.toUpperCase() || 'STARTER'}
            </span>
          </div>
        </div>
        <div style={styles.headerIllustration}>
          <div style={styles.illustration}>🚀</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={styles.navigation}>
        <button 
          style={{...styles.navButton, ...(activeSection === 'overview' && styles.activeNavButton)}}
          onClick={() => setActiveSection('overview')}
        >
          📊 {t.overview}
        </button>
        {/* <button 
          style={{...styles.navButton, ...(activeSection === 'transactions' && styles.activeNavButton)}}
          onClick={() => setActiveSection('transactions')}
        >
          💰 {t.transactions}
        </button> */}
        <button 
          style={{...styles.navButton, ...(activeSection === 'services' && styles.activeNavButton)}}
          onClick={() => setActiveSection('services')}
        >
          🛠️ {t.services}
        </button>
        <button 
          style={{...styles.navButton, ...(activeSection === 'help' && styles.activeNavButton)}}
          onClick={() => setActiveSection('help')}
        >
          ❓ {t.help}
        </button>
      </div>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <div style={styles.section}>
          {/* Stats Cards */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>💰</div>
              <div style={styles.statContent}>
                <h3 style={styles.statValue}>R{stats.totalRevenue.toLocaleString()}</h3>
                <p style={styles.statLabel}>{t.totalRevenue}</p>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>💵</div>
              <div style={styles.statContent}>
                <h3 style={styles.statValue}>{stats.cashTransactions}</h3>
                <p style={styles.statLabel}>{t.cashTransactions}</p>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>💳</div>
              <div style={styles.statContent}>
                <h3 style={styles.statValue}>{stats.nonCashTransactions}</h3>
                <p style={styles.statLabel}>{t.digitalTransactions}</p>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>📄</div>
              <div style={styles.statContent}>
                <h3 style={styles.statValue}>5</h3>
                <p style={styles.statLabel}>{t.receiptsProcessed}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={styles.quickActions}>
            <h2 style={styles.sectionTitle}>🚀 {t.quickActions}</h2>
            <div style={styles.actionsGrid}>
              {/* <a href="/templates" style={styles.actionCard}>
                <div style={styles.actionIcon}>📱</div>
                <div style={styles.actionContent}>
                  <h4 style={styles.actionTitle}>{t.downloadTemplates}</h4>
                  <p style={styles.actionDescription}>{t.downloadDesc}</p>
                </div>
                <div style={styles.actionArrow}>→</div>
              </a> */}


<a href="/transactions/cash" style={styles.actionCard}>
  <div style={styles.actionIcon}>💵</div>
  <div style={styles.actionContent}>
    <h4 style={styles.actionTitle}>{t.recordCash}</h4>
    <p style={styles.actionDescription}>{t.recordCashDesc}</p>
  </div>
  <div style={styles.actionArrow}>→</div>
</a>

<a href="/transactions/non-cash" style={styles.actionCard}>
  <div style={styles.actionIcon}>🏦</div>
  <div style={styles.actionContent}>
    <h4 style={styles.actionTitle}>{t.connectBank}</h4>
    <p style={styles.actionDescription}>{t.connectBankDesc}</p>
  </div>
  <div style={styles.actionArrow}>→</div>
</a>

{/* <a href="/transactions/receipt-upload" style={styles.actionCard}>
  <div style={styles.actionIcon}>📄</div>
  <div style={styles.actionContent}>
    <h4 style={styles.actionTitle}>{t.uploadReceipt}</h4>
    <p style={styles.actionDescription}>{t.uploadReceiptDesc}</p>
  </div>
  <div style={styles.actionArrow}>→</div>
</a> */}

<a href="/ai-chatbot" style={styles.actionCard}>
  <div style={styles.actionIcon}>🤖</div>
  <div style={styles.actionContent}>
    <h4 style={styles.actionTitle}>{t.chatAI}</h4>
    <p style={styles.actionDescription}>{t.chatAIDesc}</p>
  </div>
  <div style={styles.actionArrow}>→</div>
</a>

<a href="/reports" style={styles.actionCard}>
  <div style={styles.actionIcon}>📊</div>
  <div style={styles.actionContent}>
    <h4 style={styles.actionTitle}>{t.viewReports}</h4>
    <p style={styles.actionDescription}>{t.viewReportsDesc}</p>
  </div>
  <div style={styles.actionArrow}>→</div>
</a>

            </div>
          </div>

          {/* Recent Activity */}
          <div style={styles.recentActivity}>
            <h2 style={styles.sectionTitle}>📈 {t.recentActivity}</h2>
            <div style={styles.transactionsList}>
              {transactions.length === 0 ? (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>💼</div>
                  <h3 style={styles.emptyTitle}>{t.noTransactions}</h3>
                  <p style={styles.emptyDescription}>{t.startRecording}</p>
                  <a href="/transactions/cash" style={styles.primaryButton}>
                    Record Your First Transaction
                  </a>
                </div>
              ) : (
                transactions.map(transaction => (
                  <div key={transaction.id} style={styles.transactionItem}>
                    <div style={styles.transactionIcon}>
                      {transaction.type === 'cash' && '💵'}
                      {transaction.type === 'non-cash' && '💳'}
                      {transaction.type === 'receipt' && '📄'}
                    </div>
                    <div style={styles.transactionDetails}>
                      <h4 style={styles.transactionTitle}>{transaction.description}</h4>
                      <p style={styles.transactionDate}>{new Date(transaction.date?.toDate()).toLocaleDateString()}</p>
                    </div>
                    <div style={styles.transactionAmount}>
                      R{transaction.amount}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Services Section */}
      {activeSection === 'services' && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🛠️ {t.supportServices}</h2>
          <div style={styles.servicesGrid}>
            <div style={styles.serviceCard}>
              <div style={styles.serviceHeader}>
                <div style={styles.serviceIcon}>💰</div>
                <h3 style={styles.serviceName}>{t.businessLoans}</h3>
              </div>
              <p style={styles.serviceDescription}>{t.loansDesc}</p>
              <div style={styles.serviceStatus}>
                <span style={styles.statusBadge}>{getServiceStatus('loans')}</span>
              </div>
              <button style={styles.serviceButton}>
                Explore Options
              </button>
            </div>

            <div style={styles.serviceCard}>
              <div style={styles.serviceHeader}>
                <div style={styles.serviceIcon}>🛡️</div>
                <h3 style={styles.serviceName}>{t.insurance}</h3>
              </div>
              <p style={styles.serviceDescription}>{t.insuranceDesc}</p>
              <div style={styles.serviceStatus}>
                <span style={styles.statusBadge}>{getServiceStatus('insurance')}</span>
              </div>
              <button style={styles.serviceButton}>
                Get Quotes
              </button>
            </div>

            <div style={styles.serviceCard}>
              <div style={styles.serviceHeader}>
                <div style={styles.serviceIcon}>🎓</div>
                <h3 style={styles.serviceName}>{t.training}</h3>
              </div>
              <p style={styles.serviceDescription}>{t.trainingDesc}</p>
              <div style={styles.serviceStatus}>
                <span style={styles.statusBadge}>{getServiceStatus('training')}</span>
              </div>
              <button style={styles.serviceButton}>
                Browse Courses
              </button>
            </div>

            <div style={styles.serviceCard}>
              <div style={styles.serviceHeader}>
                <div style={styles.serviceIcon}>👥</div>
                <h3 style={styles.serviceName}>{t.mentorship}</h3>
              </div>
              <p style={styles.serviceDescription}>{t.mentorshipDesc}</p>
              <div style={styles.serviceStatus}>
                <span style={styles.statusBadge}>{getServiceStatus('mentorship')}</span>
              </div>
              <button style={styles.serviceButton}>
                Find Mentors
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Section */}
      {activeSection === 'help' && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>❓ Need Help?</h2>
          <div style={styles.helpGrid}>
            <div style={styles.helpCard}>
              <h3 style={styles.helpTitle}>📞 Contact Support</h3>
              <p style={styles.helpDescription}>Get help from our support team</p>
              <button style={styles.helpButton}>Call Support</button>
            </div>
            <div style={styles.helpCard}>
              <h3 style={styles.helpTitle}>📚 Tutorials</h3>
              <p style={styles.helpDescription}>Watch video tutorials and guides</p>
              <button style={styles.helpButton}>View Tutorials</button>
            </div>
            <div style={styles.helpCard}>
              <h3 style={styles.helpTitle}>💬 Live Chat</h3>
              <p style={styles.helpDescription}>Chat with our support agents</p>
              <button style={styles.helpButton}>Start Chat</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Fixed CSS Styles - No nested properties
const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    background: '#f8fafc',
    minHeight: '100vh'
  },
  header: {
    background: 'linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)',
    color: 'white',
    padding: '40px 32px',
    borderRadius: '20px',
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerContent: {
    flex: 1
  },
  welcomeTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '8px',
    margin: 0
  },
  welcomeSubtitle: {
    fontSize: '1.2rem',
    opacity: '0.9',
    marginBottom: '20px',
    margin: 0
  },
  businessInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  businessName: {
    fontSize: '1.3rem',
    fontWeight: '600'
  },
  tierBadge: {
    background: 'rgba(255, 255, 255, 0.2)',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '600',
    border: '1px solid rgba(255, 255, 255, 0.3)'
  },
  headerIllustration: {
    marginLeft: '32px'
  },
  illustration: {
    fontSize: '4rem'
  },
  navigation: {
    display: 'flex',
    gap: '8px',
    marginBottom: '32px',
    background: 'white',
    padding: '8px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  navButton: {
    flex: 1,
    padding: '16px 20px',
    border: 'none',
    background: 'transparent',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  activeNavButton: {
    background: 'linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)',
    color: 'white',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
  },
  section: {
    // Section container
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    marginBottom: '32px'
  },
  statCard: {
    background: 'white',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    transition: 'transform 0.2s ease'
  },
  statIcon: {
    fontSize: '2rem',
    width: '60px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    borderRadius: '12px'
  },
  statContent: {
    flex: 1
  },
  statValue: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '4px',
    margin: 0
  },
  statLabel: {
    color: '#6b7280',
    fontSize: '0.9rem',
    fontWeight: '500',
    margin: 0
  },
  quickActions: {
    marginBottom: '32px'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '20px',
    margin: 0
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '16px'
  },
  actionCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'all 0.3s ease',
    border: '1px solid #f1f5f9'
  },
  actionIcon: {
    fontSize: '1.5rem',
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f8fafc',
    borderRadius: '10px',
    flexShrink: 0
  },
  actionContent: {
    flex: 1
  },
  actionTitle: {
    margin: '0 0 8px 0',
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1f2937'
  },
  actionDescription: {
    margin: 0,
    fontSize: '0.9rem',
    color: '#6b7280',
    lineHeight: '1.4'
  },
  actionArrow: {
    fontSize: '1.2rem',
    color: '#2563eb',
    fontWeight: '600'
  },
  recentActivity: {
    marginBottom: '32px'
  },
  transactionsList: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    overflow: 'hidden'
  },
  emptyState: {
    padding: '60px 40px',
    textAlign: 'center'
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '16px'
  },
  emptyTitle: {
    margin: '0 0 8px 0',
    color: '#1f2937',
    fontSize: '1.3rem'
  },
  emptyDescription: {
    margin: '0 0 20px 0',
    color: '#6b7280'
  },
  primaryButton: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.9rem'
  },
  transactionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 20px',
    borderBottom: '1px solid #f1f5f9'
  },
  transactionIcon: {
    fontSize: '1.2rem',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f8fafc',
    borderRadius: '8px',
    flexShrink: 0
  },
  transactionDetails: {
    flex: 1
  },
  transactionTitle: {
    margin: '0 0 4px 0',
    fontSize: '1rem',
    fontWeight: '500',
    color: '#1f2937'
  },
  transactionDate: {
    margin: 0,
    fontSize: '0.8rem',
    color: '#6b7280'
  },
  transactionAmount: {
    fontWeight: '600',
    color: '#10b981',
    fontSize: '1.1rem'
  },
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px'
  },
  serviceCard: {
    background: 'white',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    border: '1px solid #f1f5f9'
  },
  serviceHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px'
  },
  serviceIcon: {
    fontSize: '1.5rem',
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    borderRadius: '10px'
  },
  serviceName: {
    margin: 0,
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#1f2937'
  },
  serviceDescription: {
    margin: '0 0 20px 0',
    color: '#6b7280',
    lineHeight: '1.5'
  },
  serviceStatus: {
    marginBottom: '20px'
  },
  statusBadge: {
    display: 'inline-block',
    padding: '6px 12px',
    background: '#f0f9ff',
    color: '#2563eb',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600'
  },
  serviceButton: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  helpGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px'
  },
  helpCard: {
    background: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    textAlign: 'center'
  },
  helpTitle: {
    margin: '0 0 12px 0',
    fontSize: '1.2rem',
    fontWeight: '600'
  },
  helpDescription: {
    margin: '0 0 20px 0',
    color: '#6b7280'
  },
  helpButton: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer'
  }
};

// Add hover effect for action cards
const actionCardHover = {
  transform: 'translateY(-2px)',
  boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
  borderColor: '#2563eb'
};

// Apply hover effect
styles.actionCard = {
  ...styles.actionCard,
  ':hover': actionCardHover
};

export default UserFriendlyDashboard;