import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { Loader2, Trash2, CalendarDays, Users, DollarSign } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import PaymentHistoryModal from './PaymentHistoryModal';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserForPayments, setSelectedUserForPayments] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, bookingsRes] = await Promise.all([
        api.get('/admin/usuarios'),
        api.get('/admin/agendamentos')
      ]);
      setUsers(usersRes.data.users || []);
      setBookings(bookingsRes.data || []);
    } catch (error) {
      console.error("Erro ao carregar dados do admin:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    window.addEventListener('refreshAdmin', fetchData);
    return () => window.removeEventListener('refreshAdmin', fetchData);
  }, [fetchData]);

  const handleRemoveUser = async (userId) => {
    if (!window.confirm("Deseja realmente remover este usuário?")) return;
    try {
      await api.delete(`/admin/usuarios/${userId}`);
      alert("Usuário removido");
      fetchData();
    } catch (error) {
      alert(error.response?.data?.detail || "Erro ao remover usuário");
    }
  };

  const handleRemoveBooking = async (bookingId) => {
    if (!window.confirm("Deseja realmente remover este agendamento global?")) return;
    try {
      await api.delete(`/admin/agendamentos/${bookingId}`);
      alert("Agendamento removido");
      fetchData();
      window.dispatchEvent(new Event('refreshAdmin'));
    } catch (error) {
      alert(error.response?.data?.detail || "Erro ao remover agendamento");
    }
  };

  if (loading) {
     return <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
       <Loader2 className="animate-spin" size={24} color="var(--primary)" />
     </div>;
  }

  return (
    <div className="admin-grid">
      <div className="admin-card">
        <h3>
          <Users size={20} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }}/> 
          Gerenciar Usuários
        </h3>
        <div className="list-container">
          {users.map(u => (
            <div key={u.id} className="list-item" style={{ alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div>
                  <strong>{u.nome}</strong> <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>({u.email})</span>
                  {u.is_admin && <span className="badge">Admin</span>}
                </div>
                {!u.is_admin && (
                  <div style={{ fontSize: '0.875rem', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${u.status_pagamento === 'Em dia' ? 'bg-emerald-100 text-emerald-800' : u.status_pagamento === 'Atrasado' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                      {u.status_pagamento || 'Sem status'}
                    </span>
                    <span className="text-slate-500">
                      Vencimento: {u.data_proximo_vencimento ? new Date(u.data_proximo_vencimento + 'T00:00:00').toLocaleDateString('pt-BR') : '-'}
                    </span>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {!u.is_admin && (
                  <button 
                    onClick={() => setSelectedUserForPayments(u)}
                    className="btn btn-outline"
                    style={{ padding: '0.4rem 0.6rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    title="Ver Histórico de Pagamentos"
                  >
                    <DollarSign size={16} />
                    <span className="hidden sm:inline" style={{ fontSize: '0.875rem' }}>Pagamentos</span>
                  </button>
                )}
                {!u.is_admin && (
                  <button 
                    onClick={() => handleRemoveUser(u.id)}
                    className="btn btn-danger"
                    style={{ padding: '0.4rem', borderRadius: '4px' }}
                    title="Remover usuário"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
          {users.length === 0 && <p style={{ color: 'var(--text-muted)' }}>Nenhum usuário encontrado.</p>}
        </div>
      </div>

      <div className="admin-card">
        <h3>
          <CalendarDays size={20} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }}/>
          Todos os Agendamentos
        </h3>
        <div className="list-container">
          {bookings.map(b => (
            <div key={b.id} className="list-item">
              <div>
                <strong>{b.nome_usuario}</strong>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  {format(parseISO(b.data), "dd/MM/yyyy")} às {b.hora.substring(0,5)}
                </div>
              </div>
              <button 
                onClick={() => handleRemoveBooking(b.id)}
                className="btn btn-danger"
                style={{ padding: '0.4rem', borderRadius: '4px' }}
                title="Remover agendamento"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {bookings.length === 0 && <p style={{ color: 'var(--text-muted)' }}>Nenhum agendamento encontrado.</p>}
        </div>
      </div>

      {selectedUserForPayments && (
        <PaymentHistoryModal 
          user={selectedUserForPayments} 
          onClose={() => { setSelectedUserForPayments(null); fetchData(); }} 
        />
      )}
    </div>
  );
};

export default AdminPanel;
