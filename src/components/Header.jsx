import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, UserCircle, LogOut } from 'lucide-react';

const Header = ({ title }) => {
  const { user, logout } = useAuth();
  
  if (!user) {
    return (
      <header className="app-header relative">
        <div className="container">
          <div className="text-2xl font-bold text-[#00475e] dark:text-[#1a5f7a] font-headline cursor-pointer">
            Teacher Gisele
          </div>
          {title && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-headline text-2xl font-bold text-[#00475e] dark:text-[#1a5f7a] hidden sm:block">
              {title}
            </div>
          )}
        </div>
      </header>
    );
  }

  return (
    <header className="app-header relative">
      <div className="container">
        <div className="text-2xl font-bold text-[#00475e] dark:text-[#1a5f7a] font-headline cursor-pointer">
          Teacher Gisele
        </div>
        
        {title && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-headline text-2xl font-bold text-[#00475e] dark:text-[#1a5f7a] hidden sm:block">
            {title}
          </div>
        )}
        
        <div className="user-controls">
          <div className="user-greeting" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCircle size={20} color="var(--text-muted)" />
            <span>Olá, <strong>{user.email}</strong></span>
            {user.is_admin && <span className="badge">Admin</span>}
          </div>
          
          <button 
            onClick={logout} 
            className="btn btn-outline" 
            style={{ padding: '0.4rem 0.8rem', gap: '6px' }}
            aria-label="Sair do sistema"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
