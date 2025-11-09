import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/Layout/Header';
import Landing from './pages/Landing';
import EnhancedRegister from './components/Auth/EnhancedRegister';
import Login from './components/Auth/Login';
import UserFriendlyDashboard from './components/Dashboard/UserFriendlyDashboard';
import CashTransactions from './components/Transactions/CashTransactions';
import NonCashTransactions from './components/Transactions/NonCashTransactions';
import ReceiptUpload from './components/Transactions/ReceiptUpload';
import Chatbot from './components/AI/Chatbot';
import ConsentManager from './components/Settings/ConsentManager';
import StakeholderDashboard from './components/Dashboard/StakeholderDashboard';
import QRReceiptTemplates from './components/Templates/QRReceiptTemplates';
import BusinessReports from './components/Reports/BusinessReports';
import './styles/globals.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect to dashboard if logged in)
const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return !currentUser ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Header />
            <main>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={
                  <PublicRoute>
                    <Landing />
                  </PublicRoute>
                } />
                <Route path="/login" element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } />
                <Route path="/register" element={
                  <PublicRoute>
                    <EnhancedRegister />
                  </PublicRoute>
                } />

                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <UserFriendlyDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/transactions/cash" element={
                  <ProtectedRoute>
                    <CashTransactions />
                  </ProtectedRoute>
                } />
                <Route path="/transactions/non-cash" element={
                  <ProtectedRoute>
                    <NonCashTransactions />
                  </ProtectedRoute>
                } />
                <Route path="/transactions/receipt-upload" element={
                  <ProtectedRoute>
                    <ReceiptUpload />
                  </ProtectedRoute>
                } />
                <Route path="/ai-chatbot" element={
                  <ProtectedRoute>
                    <Chatbot />
                  </ProtectedRoute>
                } />
                <Route path="/settings/consent" element={
                  <ProtectedRoute>
                    <ConsentManager />
                  </ProtectedRoute>
                } />
                <Route path="/stakeholder/:type" element={
                  <ProtectedRoute>
                    <StakeholderDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/templates" element={
                  <ProtectedRoute>
                    <QRReceiptTemplates />
                  </ProtectedRoute>
                } />
                <Route path="/reports" element={
                  <ProtectedRoute>
                    <BusinessReports />
                  </ProtectedRoute>
                } />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;