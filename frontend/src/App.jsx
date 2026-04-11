import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import VerifyOTP from './pages/VerifyOTP';
import Login from './pages/Login';
import MyApplications from './pages/MyApplications';
import FinancialIdentity from './pages/FinancialIdentity';
import TrustScore from './pages/TrustScore';
import MatchedSchemes from './pages/MatchedSchemes';
import SchemeDetails from './pages/SchemeDetails';
import ApplicationSent from './pages/ApplicationSent';
import TrackApplication from './pages/TrackApplication';

// Partner pages
import PartnerLayout from './components/partner/PartnerLayout';
import PartnerLogin from './pages/partner/PartnerLogin';
import PartnerDashboard from './pages/partner/PartnerDashboard';
import PartnerWorkerManagement from './pages/partner/PartnerWorkerManagement';
import PartnerWorkerDeepView from './pages/partner/PartnerWorkerDeepView';
import PartnerApplicationManagement from './pages/partner/PartnerApplicationManagement';
import PartnerApplicationDeepView from './pages/partner/PartnerApplicationDeepView';
import PartnerSchemes from './pages/partner/PartnerSchemes';
import PartnerAnalytics from './pages/partner/PartnerAnalytics';
// Optional: Placeholder for dashboard
const Placeholder = ({ title }) => (
  <div className="p-8">
    <h2 className="text-3xl font-bold font-headline mb-4">{title}</h2>
    <p className="text-slate-500">This module is currently being finalized.</p>
  </div>
);
import HelpSupport from './pages/HelpSupport';
import About from './pages/About';
import ScrollToTop from './components/ScrollToTop';
import PageTransition from './components/PageTransition';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen overflow-x-hidden">
          <PageTransition>
            <Routes>
              {/* Partner Portal Routes */}
              <Route path="/partner-login" element={<PartnerLogin />} />
              <Route path="/partner" element={<PartnerLayout />}>
                <Route path="dashboard" element={<PartnerDashboard />} />
                <Route path="workers" element={<PartnerWorkerManagement />} />
                <Route path="workers/:id" element={<PartnerWorkerDeepView />} />
                <Route path="applications" element={<PartnerApplicationManagement />} />
                <Route path="applications/:id" element={<PartnerApplicationDeepView />} />
                <Route path="schemes" element={<PartnerSchemes />} />
                <Route path="analytics" element={<PartnerAnalytics />} />
              </Route>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              <Route path="/financial-identity" element={<FinancialIdentity />} />
              <Route path="/trust-score" element={<TrustScore />} />
              <Route path="/matched-schemes" element={<MatchedSchemes />} />
              <Route path="/scheme-details" element={<SchemeDetails />} />
              <Route path="/application-sent" element={<ApplicationSent />} />
              <Route path="/track-application/:id" element={<TrackApplication />} />
              <Route path="/help" element={<HelpSupport />} />
              <Route path="/about" element={<About />} />
              <Route path="/home" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/my-applications" element={
                <ProtectedRoute>
                  <MyApplications />
                </ProtectedRoute>
              } />
            </Routes>
          </PageTransition>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
