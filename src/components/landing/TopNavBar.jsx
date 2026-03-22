import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const TopNavBar = () => {
  const location = useLocation();
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl shadow-sm dark:shadow-none">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-8 py-4">
        <Link
          to="/"
          className="text-2xl font-bold text-[#00475e] dark:text-[#1a5f7a] font-headline"
        >
          Teacher Gisele
        </Link>
        <div className="hidden md:flex items-center space-x-8 font-headline font-medium text-lg tracking-tight">
          <Link
            to="/"
            className={`transition-colors duration-300 ${location.pathname === "/" ? "text-[#00475e] relative after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-[#fcb812] after:rounded-full" : "text-slate-600 dark:text-slate-400 hover:text-[#00475e]"}`}
          >
            Home
          </Link>
          <Link
            to="/contato"
            className={`transition-colors duration-300 ${location.pathname === "/contato" ? "text-[#00475e] relative after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-[#fcb812] after:rounded-full" : "text-slate-600 dark:text-slate-400 hover:text-[#00475e]"}`}
          >
            Contato
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/auth" className="text-slate-600 dark:text-slate-400 font-bold px-4 py-2 hover:bg-slate-50/50 rounded-lg transition-all active:opacity-80 active:scale-95">
            Entrar
          </Link>
          <Link to="/auth" className="bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold px-6 py-2.5 rounded-lg shadow-sm hover:opacity-90 transition-all active:opacity-80 active:scale-95">
            Cadastrar
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default TopNavBar;
