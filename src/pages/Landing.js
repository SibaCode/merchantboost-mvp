import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../services/translation';

const Landing = () => {
  const { language } = useLanguage();

  const pricingPlans = {
    merchant: {
      name: 'Merchant',
      price: 'R299',
      period: '/month',
      description: 'Complete AI-powered business management for individual merchants',
      features: [
        'QR Receipt Books & Digital Invoicing',
        'Cash & Digital Transaction Tracking',
        'AI-Powered Business Insights & Analytics',
        'Dynamic Tier Scoring (Basic → Pro)',
        'Advanced Fraud Detection & Alerts',
        'Bank API Integration & Reconciliation',
        'Financial Reports & Tax Ready Statements',
        'Email, Chat & Phone Support',
        'Consent-First Data Sharing',
        'Mobile App & Web Dashboard'
      ],
      cta: 'Start 14-Day Free Trial',
      popular: true
    },
    enterprise: {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For financial institutions, municipalities & business support organizations',
      features: [
        'Merchant Portfolio Management Dashboard',
        'AI-Verified Merchant Insights & Scoring',
        'White-label Solution & Branding',
        'Full API Access & Custom Integrations',
        'Advanced Analytics & Custom Reporting',
        'Dedicated Account Manager & Onboarding',
        'SLA Guarantee (99.9% Uptime)',
        'Custom AI Model Training & Fine-tuning',
        'On-premise Deployment Options',
        '24/7 Priority Support & Training'
      ],
      cta: 'Schedule Enterprise Demo'
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navContent}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>🚀</div>
            <span style={styles.logoText}>MerchantBoost</span>
          </div>
          <div style={styles.navLinks}>
            <a href="#features" style={styles.navLink}>Features</a>
            <a href="#ai" style={styles.navLink}>AI Power</a>
            <a href="#pricing" style={styles.navLink}>Pricing</a>
                        <a href="/register" style={styles.navLink}>Register</a>

            <a href="/login" style={styles.navLink}>Login</a>
            
            <a href="/register" style={styles.navButton}>
              Get Started Free
            </a>
          </div>
        </div>
      </nav>

      {/* Full Screen Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroBackground} />
        <div style={styles.heroContent}>
          <div style={styles.heroText}>
            <div style={styles.badge}>
              AI-Driven Merchant Empowerment Platform
            </div>
            <h1 style={styles.heroTitle}>
              Empowering South African Merchants with <span style={styles.highlight}>AI, Insight & Finance</span>
            </h1>
            <p style={styles.heroSubtitle}>
              Transform your business with AI-powered insights, secure transaction tracking, 
              and direct access to financial products. From informal trader to bankable enterprise - 
              we guide your growth journey.
            </p>
            <div style={styles.heroButtons}>
              <a href="/register" style={styles.primaryButton}>
                Start Free Trial - 14 Days
              </a>
              <a href="#demo" style={styles.secondaryButton}>
                <span style={styles.playIcon}>▶</span>
                Watch Demo
              </a>
            </div>
            <div style={styles.trustBadges}>
              <div style={styles.trustItem}>🔒 POPIA & GDPR Compliant</div>
              <div style={styles.trustItem}>🏦 Major Bank Integration</div>
              <div style={styles.trustItem}>🤖 Advanced AI Analytics</div>
              <div style={styles.trustItem}>💳 Financial Product Access</div>
            </div>
          </div>
          <div style={styles.heroVisual}>
            <div style={styles.dashboardContainer}>
              <div style={styles.dashboard}>
                <div style={styles.dashboardHeader}>
                  <div style={styles.dashboardStats}>
                    <div style={styles.statCard}>
                      <div style={styles.statValue}>R45,280</div>
                      <div style={styles.statLabel}>Monthly Revenue</div>
                    </div>
                    <div style={styles.statCard}>
                      <div style={styles.statValue}>+23%</div>
                      <div style={styles.statLabel}>Growth</div>
                    </div>
                    <div style={styles.statCard}>
                      <div style={styles.statValue}>Pro</div>
                      <div style={styles.statLabel}>Tier Level</div>
                    </div>
                  </div>
                </div>
                <div style={styles.chartArea}>
                  <div style={styles.chart}></div>
                </div>
                <div style={styles.recentActivity}>
                  <div style={styles.activityItem}>
                    <div style={styles.activityIcon}>🧾</div>
                    <div style={styles.activityText}>QR Receipt #2847 verified</div>
                    <div style={styles.activityAmount}>R250</div>
                  </div>
                  <div style={styles.activityItem}>
                    <div style={styles.activityIcon}>🏦</div>
                    <div style={styles.activityText}>Bank transfer received</div>
                    <div style={styles.activityAmount}>R1,200</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={styles.scrollIndicator}>
          <div style={styles.scrollText}>Scroll to explore</div>
          <div style={styles.scrollArrow}>↓</div>
        </div>
      </section>

      {/* Full Screen Features Section */}
      <section style={styles.features} id="features">
        <div style={styles.featuresBackground} />
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Complete Business Growth Platform</h2>
          <p style={styles.sectionSubtitle}>Everything you need to manage, track, and grow your business</p>
          
          <div style={styles.featuresGrid}>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🧾</div>
              <h3 style={styles.featureTitle}>Smart Digital Receipts</h3>
              <p style={styles.featureText}>
                QR-coded digital receipts for all cash transactions with built-in fraud prevention and verification
              </p>
            </div>
            
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🤖</div>
              <h3 style={styles.featureTitle}>AI Business Insights</h3>
              <p style={styles.featureText}>
                Machine learning analyzes your data to provide actionable insights and growth recommendations
              </p>
            </div>
            
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>📈</div>
              <h3 style={styles.featureTitle}>Tier Progression System</h3>
              <p style={styles.featureText}>
                Progress from Basic to Pro tier with improved access to financial products and services
              </p>
            </div>
            
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🏦</div>
              <h3 style={styles.featureTitle}>Bank Integration</h3>
              <p style={styles.featureText}>
                Connect your bank accounts for automatic transaction tracking and financial reconciliation
              </p>
            </div>
            
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🔒</div>
              <h3 style={styles.featureTitle}>Enterprise Security</h3>
              <p style={styles.featureText}>
                Bank-grade security with POPIA/GDPR compliance, encryption, and role-based access control
              </p>
            </div>
            
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>💳</div>
              <h3 style={styles.featureTitle}>Financial Access</h3>
              <p style={styles.featureText}>
                Get pre-approved for loans, insurance, and other financial products based on your business data
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Full Screen AI Section */}
      <section style={styles.aiSection} id="ai">
        <div style={styles.aiBackground} />
        <div style={styles.container}>
          <div style={styles.aiContent}>
            <div style={styles.aiText}>
              <h2 style={styles.sectionTitle}>Powered by Advanced Artificial Intelligence</h2>
              <div style={styles.aiFeatures}>
                <div style={styles.aiFeature}>
                  <div style={styles.aiFeatureIcon}>💬</div>
                  <div style={styles.aiFeatureText}>
                    <h4>Conversational AI Onboarding</h4>
                    <p>Natural language chatbot collects business information through intelligent conversation</p>
                  </div>
                </div>
                <div style={styles.aiFeature}>
                  <div style={styles.aiFeatureIcon}>🎯</div>
                  <div style={styles.aiFeatureText}>
                    <h4>Smart Recommendations Engine</h4>
                    <p>AI suggests tailored loans, insurance, and business training programs based on your growth pattern</p>
                  </div>
                </div>
                <div style={styles.aiFeature}>
                  <div style={styles.aiFeatureIcon}>🛡️</div>
                  <div style={styles.aiFeatureText}>
                    <h4>Advanced Fraud Detection</h4>
                    <p>Machine learning identifies transaction anomalies and prevents fraudulent activities in real-time</p>
                  </div>
                </div>
                <div style={styles.aiFeature}>
                  <div style={styles.aiFeatureIcon}>📊</div>
                  <div style={styles.aiFeatureText}>
                    <h4>Predictive Analytics</h4>
                    <p>Forecast revenue trends, cash flow patterns, and growth opportunities with 95% accuracy</p>
                  </div>
                </div>
              </div>
            </div>
            <div style={styles.aiVisual}>
              <div style={styles.chatbotDemo}>
                <div style={styles.chatHeader}>
                  <div style={styles.chatAvatar}>🤖</div>
                  <div style={styles.chatInfo}>
                    <div style={styles.chatName}>MerchantBoost AI</div>
                    <div style={styles.chatStatus}>Online</div>
                  </div>
                </div>
                <div style={styles.chatMessages}>
                  <div style={styles.messageAI}>
                    Hi! I'm here to help understand your business. What type of products do you sell?
                  </div>
                  <div style={styles.messageUser}>
                    We sell groceries and basic household items in Soweto
                  </div>
                  <div style={styles.messageAI}>
                    Great! How many customers do you serve daily on average?
                  </div>
                  <div style={styles.messageUser}>
                    About 50-70 customers per day, mostly cash transactions
                  </div>
                  <div style={styles.messageAI}>
                    Perfect! Let me help you set up QR receipts to track those cash sales efficiently.
                  </div>
                </div>
                <div style={styles.chatInput}>
                  <div style={styles.inputPlaceholder}>Type your response...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Screen Pricing Section */}
      <section style={styles.pricing} id="pricing">
        <div style={styles.pricingBackground} />
        <div style={styles.container}>
          <div style={styles.pricingHeader}>
            <h2 style={styles.sectionTitle}>Simple, Transparent Pricing</h2>
            <p style={styles.sectionSubtitle}>Choose the plan that grows with your business</p>
          </div>
          
          <div style={styles.pricingGrid}>
            {/* Merchant Plan */}
            <div style={styles.pricingCard}>
              <div style={styles.pricingCardHeader}>
                <h3 style={styles.planName}>{pricingPlans.merchant.name}</h3>
                <div style={styles.planPrice}>
                  <span style={styles.price}>{pricingPlans.merchant.price}</span>
                  <span style={styles.period}>{pricingPlans.merchant.period}</span>
                </div>
                <p style={styles.planDescription}>{pricingPlans.merchant.description}</p>
              </div>
              
              <div style={styles.featureList}>
                {pricingPlans.merchant.features.map((feature, index) => (
                  <div key={index} style={styles.featureListItem}>
                    <span style={styles.checkIcon}>✓</span>
                    {feature}
                  </div>
                ))}
              </div>
              
              <a href="/register" style={styles.primaryButton}>
                {pricingPlans.merchant.cta}
              </a>
            </div>

            {/* Enterprise Plan */}
            <div style={{...styles.pricingCard, ...styles.enterpriseCard}}>
              <div style={styles.enterpriseBadge}>For Financial Institutions & Government</div>
              <div style={styles.pricingCardHeader}>
                <h3 style={styles.planName}>{pricingPlans.enterprise.name}</h3>
                <div style={styles.planPrice}>
                  <span style={styles.price}>{pricingPlans.enterprise.price}</span>
                  <span style={styles.period}>{pricingPlans.enterprise.period}</span>
                </div>
                <p style={styles.planDescription}>{pricingPlans.enterprise.description}</p>
              </div>
              
              <div style={styles.featureList}>
                {pricingPlans.enterprise.features.map((feature, index) => (
                  <div key={index} style={styles.featureListItem}>
                    <span style={styles.checkIcon}>✓</span>
                    {feature}
                  </div>
                ))}
              </div>
              
              <a href="/contact" style={styles.secondaryButton}>
                {pricingPlans.enterprise.cta}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Full Screen CTA Section */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaBackground} />
        <div style={styles.container}>
          <div style={styles.ctaContent}>
            <h2 style={styles.ctaTitle}>Ready to Transform Your Business?</h2>
            <p style={styles.ctaText}>
              Join thousands of South African merchants who have unlocked growth with AI-powered insights, 
              secured funding, and streamlined their operations with MerchantBoost.
            </p>
            <div style={styles.ctaButtons}>
              <a href="/register" style={styles.primaryButton}>
                Start Your Free Trial Today
              </a>
              <a href="/demo" style={styles.secondaryButton}>
                Schedule Personalized Demo
              </a>
            </div>
            <div style={styles.ctaStats}>
              <div style={styles.stat}>
                <div style={styles.statNumber}>2,500+</div>
                <div style={styles.statLabel}>Active Merchants</div>
              </div>
              <div style={styles.stat}>
                <div style={styles.statNumber}>R45M+</div>
                <div style={styles.statLabel}>Funding Secured</div>
              </div>
              <div style={styles.stat}>
                <div style={styles.statNumber}>98%</div>
                <div style={styles.statLabel}>Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.container}>
          <div style={styles.footerContent}>
            <div style={styles.footerMain}>
              <div style={styles.footerBrand}>
                <div style={styles.logo}>
                  <div style={styles.logoIcon}>🚀</div>
                  <span style={styles.logoText}>MerchantBoost</span>
                </div>
                <p style={styles.footerDescription}>
                  AI-driven merchant empowerment platform transforming South African businesses through technology, 
                  insights, and financial access.
                </p>
              </div>
              
              <div style={styles.footerLinks}>
                <div style={styles.footerColumn}>
                  <h4 style={styles.footerHeading}>Product</h4>
                  <a href="#features" style={styles.footerLink}>Features</a>
                  <a href="#pricing" style={styles.footerLink}>Pricing</a>
                  <a href="/api" style={styles.footerLink}>API Documentation</a>
                  <a href="/status" style={styles.footerLink}>System Status</a>
                </div>
                
                <div style={styles.footerColumn}>
                  <h4 style={styles.footerHeading}>Company</h4>
                  <a href="/about" style={styles.footerLink}>About Us</a>
                  <a href="/careers" style={styles.footerLink}>Careers</a>
                  <a href="/contact" style={styles.footerLink}>Contact</a>
                  <a href="/partners" style={styles.footerLink}>Partners</a>
                </div>
                
                <div style={styles.footerColumn}>
                  <h4 style={styles.footerHeading}>Resources</h4>
                  <a href="/blog" style={styles.footerLink}>Blog</a>
                  <a href="/help" style={styles.footerLink}>Help Center</a>
                  <a href="/webinars" style={styles.footerLink}>Webinars</a>
                  <a href="/community" style={styles.footerLink}>Community</a>
                </div>
                
                <div style={styles.footerColumn}>
                  <h4 style={styles.footerHeading}>Legal</h4>
                  <a href="/privacy" style={styles.footerLink}>Privacy Policy</a>
                  <a href="/terms" style={styles.footerLink}>Terms of Service</a>
                  <a href="/security" style={styles.footerLink}>Security</a>
                  <a href="/compliance" style={styles.footerLink}>Compliance</a>
                </div>
              </div>
            </div>
            
            <div style={styles.footerBottom}>
              <p style={styles.copyright}>
                © 2024 MerchantBoost. All rights reserved. Built for South African businesses.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  wrapper: {
    width: '100%',
    overflowX: 'hidden',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    background: 'rgba(10, 25, 47, 0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    zIndex: 1000,
    padding: '0',
  },
  navContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'white',
  },
  logoIcon: {
    fontSize: '2rem',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '2.5rem',
  },
  navLink: {
    color: 'rgba(255, 255, 255, 0.8)',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '1rem',
    transition: 'color 0.3s ease',
  },
  navButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'transform 0.3s ease',
  },
  hero: {
    minHeight: '100vh',
    position: 'relative',
    background: 'linear-gradient(135deg, #0a192f 0%, #1e3a5f 50%, #0a192f 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    padding: '0 2rem',
  },
  heroBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)
    `,
  },
  heroContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '4rem',
    alignItems: 'center',
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%',
    position: 'relative',
    zIndex: 2,
  },
  badge: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '10px 20px',
    borderRadius: '25px',
    fontSize: '0.9rem',
    fontWeight: '600',
    marginBottom: '2rem',
    display: 'inline-block',
    backdropFilter: 'blur(10px)',
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: '800',
    lineHeight: '1.1',
    marginBottom: '1.5rem',
    background: 'linear-gradient(135deg, #ffffff 0%, #a8b2d1 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  highlight: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSubtitle: {
    fontSize: '1.3rem',
    lineHeight: '1.6',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: '2.5rem',
    maxWidth: '90%',
  },
  heroButtons: {
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '3rem',
    alignItems: 'center',
  },
  primaryButton: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '1.2rem 2.5rem',
    borderRadius: '10px',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '1.1rem',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
  },
  secondaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    color: 'white',
    padding: '1.2rem 2rem',
    borderRadius: '10px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1.1rem',
    transition: 'all 0.3s ease',
  },
  playIcon: {
    fontSize: '0.8rem',
  },
  trustBadges: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  trustItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  heroVisual: {
    position: 'relative',
  },
  dashboardContainer: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '2rem',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
  },
  dashboard: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '15px',
    overflow: 'hidden',
  },
  dashboardHeader: {
    padding: '1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  dashboardStats: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'space-between',
  },
  statCard: {
    textAlign: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'white',
    marginBottom: '0.5rem',
  },
  statLabel: {
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  chartArea: {
    padding: '2rem',
    height: '200px',
  },
  chart: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(180deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.1) 100%)',
    borderRadius: '10px',
  },
  recentActivity: {
    padding: '1.5rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
  activityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.75rem 0',
  },
  activityIcon: {
    fontSize: '1.2rem',
  },
  activityText: {
    flex: 1,
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '0.9rem',
  },
  activityAmount: {
    color: 'white',
    fontWeight: '600',
  },
  scrollIndicator: {
    position: 'absolute',
    bottom: '2rem',
    left: '50%',
    transform: 'translateX(-50%)',
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.6)',
    animation: 'bounce 2s infinite',
  },
  scrollText: {
    fontSize: '0.9rem',
    marginBottom: '0.5rem',
  },
  scrollArrow: {
    fontSize: '1.5rem',
  },
  features: {
    minHeight: '100vh',
    position: 'relative',
    background: 'linear-gradient(135deg, #0a192f 0%, #1a2f4f 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    padding: '6rem 2rem',
  },
  featuresBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 10% 20%, rgba(102, 126, 234, 0.1) 0%, transparent 40%),
      radial-gradient(circle at 90% 80%, rgba(118, 75, 162, 0.1) 0%, transparent 40%)
    `,
  },
  sectionTitle: {
    fontSize: '3.5rem',
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: '1rem',
    background: 'linear-gradient(135deg, #ffffff 0%, #a8b2d1 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  sectionSubtitle: {
    fontSize: '1.3rem',
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: '4rem',
    maxWidth: '600px',
    margin: '0 auto 4rem',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '2rem',
  },
  featureCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '2.5rem',
    borderRadius: '15px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
    textAlign: 'center',
  },
  featureIcon: {
    fontSize: '3.5rem',
    marginBottom: '1.5rem',
  },
  featureTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'white',
    marginBottom: '1rem',
  },
  featureText: {
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: '1.6',
    fontSize: '1rem',
  },
  aiSection: {
    minHeight: '100vh',
    position: 'relative',
    background: 'linear-gradient(135deg, #0a192f 0%, #1e3a5f 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    padding: '6rem 2rem',
  },
  aiBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 70% 30%, rgba(102, 126, 234, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 30% 70%, rgba(118, 75, 162, 0.1) 0%, transparent 50%)
    `,
  },
  aiContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '4rem',
    alignItems: 'center',
  },
  aiFeatures: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',
  },
  aiFeature: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'flex-start',
  },
  aiFeatureIcon: {
    fontSize: '2.5rem',
    flexShrink: 0,
  },
  aiFeatureText: {
    flex: 1,
  },
  aiVisual: {
    position: 'relative',
  },
  chatbotDemo: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
  },
  chatHeader: {
    padding: '1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    background: 'rgba(255, 255, 255, 0.05)',
  },
  chatAvatar: {
    fontSize: '2rem',
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontWeight: '600',
    color: 'white',
  },
  chatStatus: {
    fontSize: '0.8rem',
    color: '#10b981',
  },
  chatMessages: {
    padding: '1.5rem',
    height: '300px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  messageAI: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '1rem 1.5rem',
    borderRadius: '18px 18px 18px 5px',
    maxWidth: '80%',
    alignSelf: 'flex-start',
  },
  messageUser: {
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    padding: '1rem 1.5rem',
    borderRadius: '18px 18px 5px 18px',
    maxWidth: '80%',
    alignSelf: 'flex-end',
  },
  chatInput: {
    padding: '1.5rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
  inputPlaceholder: {
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '1rem',
    borderRadius: '10px',
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
  },
  pricing: {
    minHeight: '100vh',
    position: 'relative',
    background: 'linear-gradient(135deg, #0a192f 0%, #1a2f4f 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    padding: '6rem 2rem',
  },
  pricingBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.1) 0%, transparent 40%),
      radial-gradient(circle at 80% 50%, rgba(118, 75, 162, 0.1) 0%, transparent 40%)
    `,
  },
  pricingHeader: {
    textAlign: 'center',
    marginBottom: '4rem',
  },
  pricingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
    gap: '3rem',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  pricingCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '3rem',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    position: 'relative',
    transition: 'all 0.3s ease',
  },
  enterpriseCard: {
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
    border: '1px solid rgba(102, 126, 234, 0.3)',
  },
  enterpriseBadge: {
    position: 'absolute',
    top: '-15px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '10px 25px',
    borderRadius: '25px',
    fontSize: '0.9rem',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  },
  pricingCardHeader: {
    textAlign: 'center',
    marginBottom: '2.5rem',
  },
  planName: {
    fontSize: '2.2rem',
    fontWeight: '700',
    color: 'white',
    marginBottom: '1rem',
  },
  planPrice: {
    marginBottom: '1rem',
  },
  price: {
    fontSize: '4rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  period: {
    fontSize: '1.3rem',
    color: 'rgba(255, 255, 255, 0.7)',
    marginLeft: '0.5rem',
  },
  planDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: '1.6',
    fontSize: '1.1rem',
  },
  featureList: {
    marginBottom: '3rem',
  },
  featureListItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 0',
    color: 'rgba(255, 255, 255, 0.8)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    fontSize: '1rem',
  },
  checkIcon: {
    color: '#10b981',
    fontWeight: '700',
    fontSize: '1.1rem',
  },
  ctaSection: {
    minHeight: '100vh',
    position: 'relative',
    background: 'linear-gradient(135deg, #0a192f 0%, #1e3a5f 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    padding: '6rem 2rem',
  },
  ctaBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 50% 50%, rgba(102, 126, 234, 0.2) 0%, transparent 60%),
      radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.15) 0%, transparent 50%)
    `,
  },
  ctaContent: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '800px',
    margin: '0 auto',
    width: '100%',
  },
  ctaTitle: {
    fontSize: '3.5rem',
    fontWeight: '800',
    marginBottom: '1.5rem',
    background: 'linear-gradient(135deg, #ffffff 0%, #a8b2d1 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  ctaText: {
    fontSize: '1.3rem',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: '3rem',
    lineHeight: '1.6',
  },
  ctaButtons: {
    display: 'flex',
    gap: '1.5rem',
    justifyContent: 'center',
    marginBottom: '4rem',
  },
  ctaStats: {
    display: 'flex',
    justifyContent: 'center',
    gap: '4rem',
  },
  stat: {
    textAlign: 'center',
  },
  statNumber: {
    fontSize: '2.5rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '0.5rem',
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '1rem',
  },
  footer: {
    background: '#0a192f',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '4rem 2rem 2rem',
  },
  footerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
  },
  footerMain: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '4rem',
    marginBottom: '3rem',
  },
  footerBrand: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  footerDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: '1.6',
    fontSize: '1rem',
  },
  footerLinks: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '2rem',
  },
  footerColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  footerHeading: {
    color: 'white',
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
  },
  footerLink: {
    color: 'rgba(255, 255, 255, 0.7)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'color 0.3s ease',
  },
  footerBottom: {
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    paddingTop: '2rem',
    textAlign: 'center',
  },
  copyright: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '0.9rem',
  },
};

export default Landing;