import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { CreditCard, UploadCloud, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

const StudentPayments = () => {
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await api.get('/pagamento/status');
      setPaymentInfo(res.data);
    } catch (err) {
      console.error("Erro ao buscar status de pagamento", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('arquivo', file);
      
      await api.post('/pagamento/comprovante', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Comprovante enviado com sucesso!');
      setFile(null);
      fetchStatus();
    } catch (err) {
      alert(err.response?.data?.detail || 'Erro ao enviar comprovante');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="p-4 bg-white rounded-lg shadow animate-pulse">Carregando plano...</div>;
  }

  if (!paymentInfo) {
    return null;
  }

  const { status, data_proximo_vencimento } = paymentInfo;

  let statusConfig = {
    color: 'text-slate-600',
    bg: 'bg-slate-100',
    icon: <Clock size={20} />
  };

  if (status === 'Em dia') {
    statusConfig = { color: 'text-emerald-700', bg: 'bg-emerald-100', icon: <CheckCircle2 size={20} /> };
  } else if (status === 'Atrasado') {
    statusConfig = { color: 'text-red-700', bg: 'bg-red-100', icon: <AlertCircle size={20} /> };
  } else if (status === 'Aguardando confirmação') {
    statusConfig = { color: 'text-amber-700', bg: 'bg-amber-100', icon: <Clock size={20} /> };
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="text-[#00475e]" size={24} />
        <h3 className="text-xl font-headline font-bold text-slate-800">Mensalidade</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-sm font-bold text-slate-500 mb-1">Status Atual</p>
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold ${statusConfig.bg} ${statusConfig.color}`}>
            {statusConfig.icon}
            {status}
          </div>
        </div>
        
        <div>
          <p className="text-sm font-bold text-slate-500 mb-1">Próximo Vencimento</p>
          <p className="text-lg font-bold text-slate-800">
            {data_proximo_vencimento ? new Date(data_proximo_vencimento + 'T00:00:00').toLocaleDateString('pt-BR') : '-'}
          </p>
        </div>
      </div>

      {status === 'Atrasado' && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-sm text-slate-600 mb-3 font-medium">Por favor, envie o comprovante de pagamento para regularizar sua situação.</p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input 
              type="file" 
              accept="image/*,.pdf" 
              onChange={handleFileChange}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#e1e3e4] file:text-[#00475e] hover:file:bg-[#d9dadb] transition-all cursor-pointer"
            />
            <button 
              onClick={handleUpload} 
              disabled={!file || uploading}
              className="w-full sm:w-auto px-6 py-2 bg-[#00475e] text-white font-bold rounded-full disabled:opacity-50 hover:bg-[#1a5f7a] transition-all flex items-center justify-center gap-2"
            >
              {uploading ? 'Enviando...' : (
                <>
                  <UploadCloud size={18} />
                  Enviar Comprovante
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {status === 'Aguardando confirmação' && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-sm font-medium text-amber-700 bg-amber-50 p-4 rounded-xl flex items-center gap-3">
            <Clock size={20} className="shrink-0" />
            Seu comprovante foi enviado e está em análise. Logo seu status será atualizado!
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentPayments;
