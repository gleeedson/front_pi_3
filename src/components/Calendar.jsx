import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Loader2, Calendar as CalendarIcon, X } from 'lucide-react';
import { addDays, format, startOfWeek, addWeeks, subWeeks, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const CalendarComponent = ({ selectedAdminUser, setSelectedAdminUser }) => {
  const { user } = useAuth();
  
  // Date state
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    if (day === 6) return addDays(today, 2);
    if (day === 0) return addDays(today, 1);
    return today;
  });
  
  // Data states
  const [slots, setSlots] = useState({});
  const [myBookings, setMyBookings] = useState([]);
  const [users, setUsers] = useState([]);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Get start of Monday for the current view
  const getStartOfWeek = (date) => {
    return startOfWeek(date, { weekStartsOn: 1 });
  };

  const weekStart = getStartOfWeek(currentDate);
  const weekDays = Array.from({ length: 5 }).map((_, i) => addDays(weekStart, i));

  const fetchWeekData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch all my bookings
      const bookingsRes = await api.get('/meus-agendamentos');
      setMyBookings(bookingsRes.data || []);

      // Fetch available slots for each day
      const slotsData = {};
      await Promise.all(
        weekDays.map(async (day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          try {
            const res = await api.get(`/horarios-disponiveis/${dateStr}`);
            slotsData[dateStr] = res.data.horarios_disponiveis || [];
          } catch (e) {
            slotsData[dateStr] = [];
          }
        })
      );
      setSlots(slotsData);
      
      // If admin, fetch users for the dropdown
      if (user?.is_admin) {
        const usersRes = await api.get('/admin/usuarios');
        setUsers(usersRes.data.users || []);
      }
    } catch (error) {
      console.error("Failed to fetch calendar data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentDate, user]);

  useEffect(() => {
    fetchWeekData();
  }, [fetchWeekData]);

  const handleNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  const handlePrevWeek = () => setCurrentDate(subWeeks(currentDate, 1));

  const handleBookSlot = async (dateStr, timeStr) => {
    const isBookingForOther = !!selectedAdminUser;
    
    let confirmMsg = `Confirmar agendamento para ${format(parseISO(dateStr), "dd/MM")} às ${timeStr.substring(0,5)}?`;
    if (isBookingForOther) {
      const u = users.find(x => x.id.toString() === selectedAdminUser);
      confirmMsg = `Confirmar para o aluno ${u?.nome} em ${format(parseISO(dateStr), "dd/MM")} às ${timeStr.substring(0,5)}?`;
    }

    if (!window.confirm(confirmMsg)) return;

    setActionLoading(true);
    try {
      const endpoint = isBookingForOther ? '/admin/agendar' : '/agendar';
      const payload = { data: dateStr, hora: timeStr + ':00' };
      if (isBookingForOther) {
        payload.id_usuario = parseInt(selectedAdminUser);
      }

      await api.post(endpoint, payload);
      alert('Agendamento realizado com sucesso!');
      await fetchWeekData();
    } catch (error) {
      alert(error.response?.data?.detail || "Erro ao agendar");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Deseja realmente cancelar este agendamento?")) return;
    
    setActionLoading(true);
    try {
      await api.delete(`/cancelar-agendamento/${bookingId}`);
      alert('Agendamento cancelado com sucesso!');
      await fetchWeekData();
    } catch (error) {
      alert(error.response?.data?.detail || "Erro ao cancelar");
    } finally {
      setActionLoading(false);
    }
  };

  // Helper to get time range
  const hours = Array.from({ length: 10 }, (_, i) => i + 8); // 8 to 17

  return (
    <div className="calendar-container">
      {/* Search & Navigation Toolbar */}
      <div className="calendar-toolbar">
        <button onClick={handlePrevWeek} className="btn btn-outline">
          <ChevronLeft size={20} /> Semana Anterior
        </button>

        <div className="week-selector">
          <h2>
            {format(weekDays[0], "dd 'de' MMMM", { locale: ptBR })} a {format(weekDays[4], "dd 'de' MMMM", { locale: ptBR })}
          </h2>
          
          {user?.is_admin && (
            <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <label htmlFor="user-select" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Agendar para:
              </label>
              <select 
                id="user-select" 
                className="user-dropdown"
                value={selectedAdminUser}
                onChange={(e) => setSelectedAdminUser(e.target.value)}
              >
                <option value="">(Meu Próprio Agendamento)</option>
                {users.filter(u => !u.is_admin).map(u => (
                  <option key={u.id} value={u.id}>{u.nome}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <button onClick={handleNextWeek} className="btn btn-outline">
          Próxima Semana <ChevronRight size={20} />
        </button>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <Loader2 className="animate-spin" size={32} color="var(--primary)" />
        </div>
      ) : (
        <div className="week-grid">
          {weekDays.map(day => {
            const dateStr = format(day, "yyyy-MM-dd");
            const daySlots = slots[dateStr] || [];
            
            return (
              <div key={dateStr} className="day-column">
                <div className="day-header">
                  <span className="day-name">{format(day, "EEEE", { locale: ptBR })}</span>
                  <span className="day-date">{format(day, "dd/MM")}</span>
                </div>
                
                <div className="time-slots">
                  {hours.map(h => {
                    const timeStr = `${h.toString().padStart(2, '0')}:00`;
                    const fullTimeStr = `${timeStr}:00`;
                    
                    // Check if I have a booking here
                    const myBooking = myBookings.find(b => b.data === dateStr && (b.hora === fullTimeStr || b.hora === timeStr));
                    
                    if (myBooking) {
                      return (
                        <div key={timeStr} className="time-slot slot-booked">
                          <span>{timeStr}</span>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleCancelBooking(myBooking.id); }}
                            className="btn btn-danger"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', gap: '0.25rem' }}
                            disabled={actionLoading}
                            title="Cancelar Agendamento"
                          >
                            <X size={14} /> Cancelar
                          </button>
                        </div>
                      );
                    }
                    
                    const isAvailable = daySlots.includes(timeStr);
                    
                    if (isAvailable) {
                      return (
                        <div 
                          key={timeStr} 
                          className="time-slot slot-available"
                          onClick={() => !actionLoading && handleBookSlot(dateStr, timeStr)}
                        >
                          {timeStr}
                        </div>
                      );
                    }
                    
                    return (
                      <div key={timeStr} className="time-slot slot-unavailable">
                        {timeStr}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;
