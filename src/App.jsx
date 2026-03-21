import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import AuthScreens from './components/AuthScreens';
import MainDashboard from './components/MainDashboard';

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
    return <Navigate to="/" />;
  }
  
  return children;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
      <Header />
      <div className="container main-content-area">
        <Routes>
          <Route path="/auth" element={
            <AuthRoute>
              <AuthScreens />
            </AuthRoute>
          } />
          <Route path="/" element={
            <ProtectedRoute>
              <MainDashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
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
