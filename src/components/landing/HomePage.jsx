import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <main className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative px-8 py-24 md:py-32 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 overflow-hidden">
        <div className="flex-1 space-y-8 z-10">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-surface-container-highest text-primary text-xs font-bold tracking-widest uppercase">
            Aulas 100% Online
          </div>
          <h1 className="font-headline text-5xl md:text-6xl text-on-surface font-bold leading-tight mb-8">
            Domine o inglês <br />{" "}
            <span className="italic text-primary">
              com aulas personalizadas para você!
            </span>
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-xl leading-relaxed">
            Aprenda um novo idioma com aulas individuais feitas
            especificamente para seu ritmo, objetivos e estilo de vida, no
            conforto da sua casa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={() => navigate("/contato")}
              className="px-8 py-4 bg-secondary-container text-on-secondary-container font-bold rounded-xl text-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Agendar Teste de Nível</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-surface-container-low py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 max-w-2xl">
            <h2 className="text-4xl font-bold text-on-background mb-4 font-headline">
              Por que estudar com a Teacher Gisele?
            </h2>
            <p className="text-on-surface-variant text-lg leading-relaxed">
              Um ensino focado que respeita sua individualidade e seus
              objetivos.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface-container-lowest p-10 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-14 h-14 bg-secondary-container/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-secondary text-3xl">
                  devices
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-4 font-headline">
                Totalmente Remoto
              </h3>
              <p className="text-on-surface-variant leading-relaxed">
                Aulas 100% online que se adaptam à sua rotina, permitindo
                que você aprenda de qualquer lugar.
              </p>
            </div>
            <div className="bg-surface-container-lowest p-10 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary text-3xl">
                  person
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-4 font-headline">
                Ensino Personalizado
              </h3>
              <p className="text-on-surface-variant leading-relaxed">
                Metodologia desenhada para seu perfil específico, do
                iniciante ao avançado, em qualquer idade.
              </p>
            </div>
            <div className="bg-surface-container-lowest p-10 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-14 h-14 bg-tertiary-container/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-tertiary text-3xl">
                  verified
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-4 font-headline">
                Confiança Real
              </h3>
              <p className="text-on-surface-variant leading-relaxed">
                Foco no desenvolvimento da fluência para situações reais,
                seja para viagens, trabalho ou estudos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-primary-container px-8 py-24 mx-8 rounded-[3rem] mt-16 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-container opacity-90"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 font-headline">
            Comece sua jornada rumo à fluência hoje mesmo
          </h2>
          <p className="text-primary-fixed text-lg mb-12 opacity-80">
            Identifique seu nível atual e trace seu plano de estudos
            ideal.
          </p>
          <button
            onClick={() => navigate("/contato")}
            className="px-12 py-5 bg-secondary-container text-on-secondary-container font-extrabold rounded-2xl text-xl shadow-2xl hover:scale-105 transition-transform"
          >
            Quero meu Teste de Nível
          </button>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
