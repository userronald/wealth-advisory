import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import OnboardingPage from '@/components/OnboardingPage';
import DashboardPage from '@/components/DashboardPage';
import AdminPage from '@/components/AdminPage';
import ComparisonPage from '@/components/ComparisonPage';
import LearningHubPage from '@/components/LearningHubPage';
import AIChatWidget from '@/components/AIChatWidget';
import { useUserStore } from '@/store/useUserStore';


function App() {
  const loadUser = useUserStore(state => state.loadUser);
  const currentUser = useUserStore(state => state.currentUser);
  const location = useLocation();
  const hideHeaderRoutes = ['/admin', '/profile'];
  const showHeader = currentUser && !hideHeaderRoutes.includes(location.pathname);

  // Sync current user state from local storage on launch
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <Router>
      {showHeader && <Header />}
      <Routes>
        {/* Onboarding Page */}
        <Route 
          path="/onboarding" 
          element={<OnboardingPage />} 
        />

        {/* Personalized Wealth Dashboard */}
        <Route 
          path="/dashboard" 
          element={
            currentUser ? (
              <DashboardPage />
            ) : (
              <Navigate to="/onboarding" replace />
            )
          } 
        />

        {/* Scheme Comparison Page */}
        <Route 
          path="/compare" 
          element={
            currentUser ? (
              <ComparisonPage />
            ) : (
              <Navigate to="/onboarding" replace />
            )
          } 
        />

        {/* Learning Hub Page */}
        <Route 
          path="/learning" 
          element={
            currentUser ? (
              <LearningHubPage />
            ) : (
              <Navigate to="/onboarding" replace />
            )
          } 
        />

        {/* Developer Analytics & Admin Portal */}
        <Route 
          path="/admin" 
          element={<AdminPage />} 
        />

        {/* Root Redirect Guard */}
        <Route 
          path="/" 
          element={
            currentUser ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/onboarding" replace />
            )
          } 
        />

        {/* Fallback Catch-All Redirect */}
        <Route 
          path="*" 
          element={<Navigate to="/" replace />} 
        />
      </Routes>
      <AIChatWidget />
    </Router>
  );
}

export default App;
