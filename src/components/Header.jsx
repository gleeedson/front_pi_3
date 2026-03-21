import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, UserCircle, LogOut } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  
  if (!user) {
    return (
      <header className="app-header">
        <div className="container" style={{ justifyContent: 'center' }}>
          <div className="app-logo">
            <Calendar size={28} />
            Sistema de Agendamentos
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="app-header">
      <div className="container">
        <div className="app-logo">
          <Calendar size={28} />
          Agendamentos
        </div>
        
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
