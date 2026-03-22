import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full py-12 bg-[#f3f4f5] dark:bg-slate-800">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto">
        <div className="font-headline font-bold text-[#00475e] text-xl">
          Teacher Gisele
        </div>
        <div className="flex gap-8 font-body text-sm tracking-wide my-6 md:my-0">
          <Link
            className="text-slate-500 dark:text-slate-400 hover:text-[#fcb812] transition-colors"
            to="/"
          >
            Home
          </Link>
          <Link
            className="text-slate-500 dark:text-slate-400 hover:text-[#fcb812] transition-colors"
            to="/contato"
          >
            Contato
          </Link>
        </div>
        <div className="text-slate-500 dark:text-slate-400 text-sm font-body">
          © 2026 Teacher Gisele.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
