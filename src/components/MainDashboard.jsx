import React, { useState } from 'react';
import CalendarComponent from './Calendar';
import AdminPanel from './AdminPanel';
import StudentPayments from './StudentPayments';
import { useAuth } from '../context/AuthContext';
import Header from './Header';

const MainDashboard = () => {
  const { user } = useAuth();
  
  // Lifted state to handle admin user selection
  const [selectedAdminUser, setSelectedAdminUser] = useState("");

  return (
    <>
      <Header title="Agendamento" />
      <div className="container main-content-area">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {user && !user.is_admin && <StudentPayments />}

          <CalendarComponent 
            selectedAdminUser={selectedAdminUser} 
            setSelectedAdminUser={setSelectedAdminUser} 
          />
          {user?.is_admin && <AdminPanel />}
        </div>
      </div>
    </>
  );
};

export default MainDashboard;
