import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import Header from './Header';

const AuthScreens = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ nome: '', email: '', senha: '' });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (isLogin) {
      const res = await login(formData.email, formData.senha);
      if (!res.success) {
        setError(res.message);
      }
    } else {
      const res = await register(formData.nome, formData.email, formData.senha);
      if (res.success) {
        alert("Conta criada com sucesso! Faça login.");
        setIsLogin(true);
        setFormData({ nome: '', email: '', senha: '' });
      } else {
        setError(res.message);
      }
    }
    
    setIsLoading(false);
  };

  return (
    <>
      <Header title={isLogin ? 'Login' : 'Cadastro'} />
      <div className="container main-content-area flex items-center justify-center">
        <div className="auth-wrapper" style={{ width: '100%' }}>
      <div className="auth-card">
        <h2>{isLogin ? 'Bem-vindo de volta' : 'Criar uma conta'}</h2>
        
        {error && <div className="form-error">{error}</div>}
        
        <form onSubmit={handleSubmit} aria-label="Formulário de Autenticação">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="nome">Nome Completo</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', top: '14px', left: '12px', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  id="nome" 
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required 
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="Seu nome"
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', top: '14px', left: '12px', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                id="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required 
                style={{ paddingLeft: '2.5rem' }}
                placeholder="seuemail@exemplo.com"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', top: '14px', left: '12px', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                id="senha" 
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                required 
                style={{ paddingLeft: '2.5rem' }}
                placeholder="••••••••"
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Processando...' : isLogin ? 'Entrar' : 'Criar Conta'}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="auth-link">
          {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}
          <button onClick={() => { setIsLogin(!isLogin); setError(null); }}>
            {isLogin ? "Cadastre-se" : "Fazer login"}
          </button>
        </p>
      </div>
        </div>
      </div>
    </>
  );
};

export default AuthScreens;
