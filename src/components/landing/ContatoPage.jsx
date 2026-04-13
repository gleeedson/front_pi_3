import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

const ContatoPage = () => {
  const formRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }
      )
      .then(() => {
        setStatus('success');
        formRef.current.reset();
      })
      .catch(() => {
        setStatus('error');
      });
  };

  return (
    <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <header className="mb-20 max-w-3xl">
        <div className="inline-block bg-surface-container-highest px-4 py-1.5 rounded-lg text-primary text-sm font-bold tracking-wider mb-6">
          CONTATO
        </div>
        <h1 className="font-headline text-5xl md:text-6xl text-on-surface font-bold leading-tight mb-8">
          Agende seu <br />{" "}
          <span className="italic text-primary">Teste de Nível.</span>
        </h1>
        <p className="text-lg text-on-surface-variant leading-relaxed font-light">
          Aulas online e personalizadas para todos os níveis. Preencha os
          dados abaixo para marcarmos sua avaliação gratuita e definirmos
          o melhor caminho para sua fluência.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-7 bg-surface-container-lowest p-8 md:p-12 rounded-xl shadow-[0px_20px_40px_rgba(25,28,29,0.06)]">
          <form ref={formRef} className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="font-label text-sm font-bold text-on-surface ml-1">
                  Nome
                </label>
                <input
                  name="nome"
                  className="w-full bg-surface-container-low border-outline-variant/10 rounded-lg px-4 py-4 focus:ring-0 focus:border-primary/40 focus:bg-surface-container-lowest transition-all placeholder:text-outline"
                  placeholder="Seu nome completo"
                  type="text"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="font-label text-sm font-bold text-on-surface ml-1">
                  E-mail
                </label>
                <input
                  name="email"
                  className="w-full bg-surface-container-low border-outline-variant/10 rounded-lg px-4 py-4 focus:ring-0 focus:border-primary/40 focus:bg-surface-container-lowest transition-all placeholder:text-outline"
                  placeholder="exemplo@email.com"
                  type="email"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="font-label text-sm font-bold text-on-surface ml-1">
                Nível de Inglês Atual
              </label>
              <select
                name="nivel"
                className="w-full bg-surface-container-low border-outline-variant/10 rounded-lg px-4 py-4 focus:ring-0 focus:border-primary/40 focus:bg-surface-container-lowest transition-all appearance-none"
              >
                <option>Iniciante (A1/A2)</option>
                <option>Intermediário (B1/B2)</option>
                <option>Avançado (C1/C2)</option>
                <option>Não tenho certeza / Começar do zero</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="font-label text-sm font-bold text-on-surface ml-1">
                Mensagem
              </label>
              <textarea
                name="mensagem"
                className="w-full bg-surface-container-low border-outline-variant/10 rounded-lg px-4 py-4 focus:ring-0 focus:border-primary/40 focus:bg-surface-container-lowest transition-all placeholder:text-outline"
                placeholder="Conte-me um pouco sobre sua disponibilidade e objetivos..."
                rows="5"
              ></textarea>
            </div>

            {/* Mensagens de feedback */}
            {status === 'success' && (
              <p className="text-sm font-medium text-green-600 bg-green-50 px-4 py-3 rounded-lg">
                Mensagem enviada com sucesso! Entrarei em contato em breve.
              </p>
            )}
            {status === 'error' && (
              <p className="text-sm font-medium text-red-600 bg-red-50 px-4 py-3 rounded-lg">
                Ocorreu um erro ao enviar. Tente novamente ou entre em contato pelo WhatsApp.
              </p>
            )}

            <button
              className="w-full md:w-auto bg-secondary-container text-on-secondary-container font-bold px-10 py-4 rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={status === 'sending'}
            >
              {status === 'sending' ? (
                <>
                  Enviando...
                  <span className="material-symbols-outlined text-lg animate-spin">
                    autorenew
                  </span>
                </>
              ) : (
                <>
                  Agendar Teste de Nível
                  <span className="material-symbols-outlined text-lg">
                    calendar_today
                  </span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="lg:col-span-5 space-y-12 lg:pl-8">
          <div className="space-y-8">
            <h3 className="font-headline text-2xl font-bold text-primary">
              Fale Comigo
            </h3>
            <div className="space-y-6">
              <a
                className="flex items-center gap-6 group"
                href="https://wa.me/5511954842521"
              >
                <div className="w-14 h-14 bg-surface-container-high rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <span className="material-symbols-outlined">chat</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-outline uppercase tracking-widest mb-0.5">
                    WhatsApp
                  </p>
                  <p className="text-lg font-medium text-on-surface">
                    +55 (11) 95484-2521
                  </p>
                </div>
              </a>
              <a
                className="flex items-center gap-6 group"
                href="mailto:teacher.gisele.al@gmail.com"
              >
                <div className="w-14 h-14 bg-surface-container-high rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-outline uppercase tracking-widest mb-0.5">
                    E-mail
                  </p>
                  <p className="text-lg font-medium text-on-surface">
                    teacher.gisele.al@gmail.com
                  </p>
                </div>
              </a>
            </div>
          </div>

          <div className="bg-primary p-8 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/30 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
              <h4 className="text-white font-headline text-xl mb-3 italic">
                "Aprender um novo idioma é ganhar uma nova alma."
              </h4>
              <p className="text-primary-fixed text-sm opacity-80">
                — Teacher Gisele
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ContatoPage;
