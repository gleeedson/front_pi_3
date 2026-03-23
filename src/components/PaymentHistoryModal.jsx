import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { X, Check, XCircle, Eye, FileText } from 'lucide-react';

const PaymentHistoryModal = ({ user, onClose }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [receiptUrl, setReceiptUrl] = useState(null);
  const [viewingReceiptId, setViewingReceiptId] = useState(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/usuarios/${user.id}/pagamentos`);
      setPayments(res.data || []);
    } catch (err) {
      console.error(err);
      alert('Erro ao carregar histórico de pagamentos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [user.id]);

  const handleApprove = async (id) => {
    if(!window.confirm("Deseja realmente aprovar este pagamento?")) return;
    try {
      await api.patch(`/admin/pagamentos/${id}/aprovar`);
      alert("Pagamento aprovado com sucesso!");
      fetchPayments();
      setReceiptUrl(null);
      setViewingReceiptId(null);
    } catch (err) {
      alert(err.response?.data?.detail || "Erro ao aprovar o pagamento");
    }
  };

  const handleReject = async (id) => {
    if(!window.confirm("Deseja realmente recusar este pagamento?")) return;
    try {
      await api.patch(`/admin/pagamentos/${id}/recusar`);
      alert("Pagamento recusado!");
      fetchPayments();
      setReceiptUrl(null);
      setViewingReceiptId(null);
    } catch (err) {
      alert(err.response?.data?.detail || "Erro ao recusar o pagamento");
    }
  };

  const loadReceipt = async (id) => {
    try {
      setViewingReceiptId(id);
      const res = await api.get(`/admin/pagamentos/${id}/comprovante`, { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      setReceiptUrl(url);
    } catch (err) {
      alert("Erro ao carregar comprovante. Pode estar indisponível ou corrompido.");
      setViewingReceiptId(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-2xl font-bold font-headline text-[#00475e]">Histórico de Pagamentos</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Aluno: {user.nome}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-gray-200 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 flex flex-col md:flex-row gap-6 bg-slate-50/50">
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-32 text-slate-500 font-medium animate-pulse">
                Carregando pagamentos...
              </div>
            ) : payments.length === 0 ? (
              <div className="bg-white p-6 rounded-xl border border-gray-200 text-center text-slate-500">
                Nenhum pagamento registrado para {user.nome}.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {payments.map(p => (
                  <div key={p.id} className={`p-5 rounded-xl border ${viewingReceiptId === p.id ? 'border-[#00475e] bg-slate-50 shadow-sm' : 'border-gray-200 bg-white'} transition-all`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-slate-700">
                        Vencimento: {p.data_vencimento ? new Date(p.data_vencimento + 'T00:00:00').toLocaleDateString('pt-BR') : '-'}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${p.status === 'Pago' || p.status === 'Em dia' ? 'bg-emerald-100 text-emerald-800' : p.status === 'Atrasado' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                        {p.status}
                      </span>
                    </div>
                    
                    {p.status === 'Aguardando confirmação' && (
                      <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-3">
                        <button 
                          onClick={() => loadReceipt(p.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${viewingReceiptId === p.id ? 'bg-[#00475e] text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                        >
                          <Eye size={16} /> {viewingReceiptId === p.id ? 'Visualizando...' : 'Ver Comprovante'}
                        </button>
                        <button 
                          onClick={() => handleApprove(p.id)}
                          className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-emerald-100 transition-colors"
                        >
                          <Check size={16} /> Aprovar
                        </button>
                        <button 
                          onClick={() => handleReject(p.id)}
                          className="px-4 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-red-100 transition-colors"
                        >
                          <XCircle size={16} /> Recusar
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Receipt View Area */}
          {receiptUrl && (
            <div className="flex-1 border border-gray-200 rounded-xl bg-white p-3 flex flex-col shadow-sm">
              <div className="flex justify-between items-center px-2 pb-3 mb-2 border-b border-gray-100">
                <span className="font-bold text-slate-700 flex items-center gap-2"><FileText size={18} className="text-[#00475e]"/> Visualização do Arquivo</span>
                <button onClick={() => {setReceiptUrl(null); setViewingReceiptId(null);}} className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-lg">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 min-h-[400px] relative overflow-hidden bg-slate-50 flex items-center justify-center rounded-lg border border-slate-100">
                <iframe src={receiptUrl} className="absolute inset-0 w-full h-full border-0 rounded-lg" title="Comprovante de pagamento" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentHistoryModal;
