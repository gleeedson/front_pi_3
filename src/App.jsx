import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import AuthScreens from './components/AuthScreens';
import MainDashboard from './components/MainDashboard';
import LandingLayout from './components/landing/LandingLayout';
import HomePage from './components/landing/HomePage';
import ContatoPage from './components/landing/ContatoPage';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading-screen">Carregando...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  return children;
};

const AuthRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading-screen">Carregando...</div>;
  }
  
  if (user) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <Routes>
        <Route element={<LandingLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/contato" element={<ContatoPage />} />
        </Route>

        <Route path="/auth" element={
          <>
            <Header />
            <div className="container main-content-area">
              <AuthRoute>
                <AuthScreens />
              </AuthRoute>
            </div>
          </>
        } />

        <Route path="/dashboard" element={
          <>
            <Header />
            <div className="container main-content-area">
              <ProtectedRoute>
                <MainDashboard />
              </ProtectedRoute>
            </div>
          </>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
