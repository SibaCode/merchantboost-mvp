import { LANGUAGES } from '../utils/constants';

const translations = {
  en: {
    // Landing Page
    'welcome.title': 'Welcome to MerchantBoost',
    'welcome.subtitle': 'AI-powered platform for merchant growth and financial inclusion',
    'benefits.track': 'Track cash and digital transactions',
    'benefits.insights': 'Access AI-verified insights',
    'benefits.support': 'Tier-based support: loans, insurance, mentorship',
    'privacy.title': 'Your Data, Your Control',
    'privacy.description': 'You control which data is shared. AI uses your data securely to provide insights; stakeholders can only see your info if you consent.',
    
    // Common
    'login': 'Login',
    'signup': 'Sign Up',
    'continue': 'Continue',
    'back': 'Back',
    'save': 'Save',
    'cancel': 'Cancel',
    'logout': 'Logout',
    
    // Dashboard
    'dashboard.title': 'Merchant Dashboard',
    'dashboard.revenue': 'Total Revenue',
    'dashboard.cash': 'Cash Transactions',
    'dashboard.noncash': 'Digital Transactions',
    'dashboard.insights': 'AI Insights',
    'dashboard.transactions': 'Recent Transactions',
    
    // Transactions
    'transactions.cash': 'Cash Transactions',
    'transactions.noncash': 'Digital Transactions',
    'transactions.receipt': 'Upload Receipt',
    'transactions.scanQR': 'Scan QR Code',
    'transactions.manual': 'Manual Entry',
    
    // Settings
    'settings.consent': 'Data Sharing Consent',
    'settings.consent.description': 'Control who can access your business insights',
    'settings.language': 'Language Preferences'
  },
  zu: {
    'welcome.title': 'Uyemukelwa ku-MerchantBoost',
    'welcome.subtitle': 'I-platform enamandla e-AI yokukhula komthengisi nokufakwa kwezezimali',
    'benefits.track': 'Landela ukutshintshiselana ngemali ngedijithali',
    'benefits.insights': 'Finyelela imininingwane eqinisekisiwe ye-AI',
    'benefits.support': 'Ukusekelwa okususelwa kuma-tier: amalani, inshorensi, iseluleko',
    'privacy.title': 'Idatha Yakho, Ilawulo Yakho',
    'privacy.description': 'Ulawula ukuthi yidatha iphi eyabiwe. I-AI isebenzisa idatha yakho ngokuphepha ukuhlinzeka ngezinto ezingokomqondo; ababambiqhaza bangakubona kuphela ukwazi kwakho uma uvumile.',
    'login': 'Ngena ngemvume',
    'signup': 'Bhalisa',
    'continue': 'Qhubeka',
    'logout': 'Phuma'
  },
  xh: {
    'welcome.title': 'Wamkelekile kwi-MerchantBoost',
    'welcome.subtitle': 'I-platform enamandla e-AI yokukhula komthengisi nokufakwa kwezezimali',
    'benefits.track': 'Landela uthengiselwano lwemali kunye nedijithali',
    'benefits.insights': 'Fumana izinto eziqinisekisiweyo ze-AI',
    'benefits.support': 'Inkxaso esekwe kwi-tier: iimaleni, i-inshorensi, imiyalelo',
    'privacy.title': 'Idatha Yakho, Ulawulo Lwakho',
    'privacy.description': 'Ulawula ukuba yeyiphi idatha eyabelwane. I-AI isebenzisa idatha yakho ngokhuselekileyo ukunika izinto ezingokomqondo; abanxaxheba banokukubona kuphela ulwazi lwakho ukuba uyavuma.',
    'login': 'Ngena',
    'signup': 'Bhalisa',
    'continue': 'Qhubeka',
    'logout': 'Phuma'
  },
  af: {
    'welcome.title': 'Welkom by MerchantBoost',
    'welcome.subtitle': 'AI-aangedrewe platform vir handelaarsgroei en finansiële insluiting',
    'benefits.track': 'Spoor kontant en digitale transaksies',
    'benefits.insights': 'Kry AI-geverifieerde insigte',
    'benefits.support': 'Vlak-gebaseerde ondersteuning: lenings, versekering, mentorskap',
    'privacy.title': 'Jou Data, Jou Beheer',
    'privacy.description': 'Jy beheer watter data gedeel word. AI gebruik jou data veilig om insigte te verskaf; belanghebbendes kan slegs jou inligting sien as jy toestemming verleen.',
    'login': 'Teken In',
    'signup': 'Registreer',
    'continue': 'Gaan voort',
    'logout': 'Teken Uit'
  }
};

export const getTranslation = (key, language = 'en') => {
  const langTranslations = translations[language] || translations.en;
  return langTranslations[key] || key;
};

export const getAvailableLanguages = () => {
  return Object.values(LANGUAGES);
};