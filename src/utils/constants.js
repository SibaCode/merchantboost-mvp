export const LANGUAGES = {
  en: { code: 'en', name: 'English', nativeName: 'English' },
  zu: { code: 'zu', name: 'Zulu', nativeName: 'isiZulu' },
  xh: { code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa' },
  af: { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans' }
};

export const USER_TYPES = {
  MERCHANT: 'merchant',
  ASSISTED_MERCHANT: 'assisted_merchant',
  INCUBATOR: 'incubator',
  MUNICIPALITY: 'municipality',
  LENDER: 'lender',
  INSURER: 'insurer',
  ADMIN: 'admin'
};

export const TIERS = {
  BASIC: { name: 'Basic', color: '#6b7280', level: 1 },
  INTERMEDIATE: { name: 'Intermediate', color: '#10b981', level: 2 },
  PRO: { name: 'Pro', color: '#2563eb', level: 3 }
};

export const CONSENT_TYPES = {
  INCUBATORS: 'incubators',
  MUNICIPALITIES: 'municipalities',
  LENDERS: 'lenders',
  INSURERS: 'insurers'
};