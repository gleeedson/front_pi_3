import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNavBar from './TopNavBar';
import Footer from './Footer';

const LandingLayout = () => {
  return (
    <div className="min-h-screen bg-surface font-body text-on-surface">
      <TopNavBar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default LandingLayout;
