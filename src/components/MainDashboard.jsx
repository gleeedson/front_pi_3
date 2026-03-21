import React, { useState } from 'react';
import CalendarComponent from './Calendar';
import AdminPanel from './AdminPanel';
import { useAuth } from '../context/AuthContext';

const MainDashboard = () => {
  const { user } = useAuth();
  
  // Lifted state to handle admin user selection
  const [selectedAdminUser, setSelectedAdminUser] = useState("");

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <CalendarComponent 
        selectedAdminUser={selectedAdminUser} 
        setSelectedAdminUser={setSelectedAdminUser} 
      />
      {user?.is_admin && <AdminPanel />}
    </div>
  );
};

export default MainDashboard;
