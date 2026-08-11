import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-10 mt-16 relative overflow-hidden">
      {/* GIGW Tri-Color Accents */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-white to-emerald-600"></div>

      <div className="mx-auto px-4 md:px-12 max-w-7xl">
        {/* Government Footer Policies Strip */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-xs border-b border-slate-800 pb-6 mb-6 font-semibold">
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Website Policies</a>
          <span className="text-slate-700">|</span>
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Help</a>
          <span className="text-slate-700">|</span>
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Contact Us</a>
          <span className="text-slate-700">|</span>
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Feedback</a>
          <span className="text-slate-700">|</span>
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Terms of Use</a>
          <span className="text-slate-700">|</span>
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Accessibility Statement</a>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 text-center lg:text-left">
          <div className="max-w-2xl">
            <div className="flex items-center justify-center lg:justify-start gap-2.5 text-white font-bold text-lg mb-2">
              <span className="text-xl">🏛️</span>
              <span>JanSetu-AI Digital Portal</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              This portal is designed, developed, and simulated as a prototype for the Smart India Hackathon (SIH) under the Digital India Initiative. Managed by the National Informatics Centre (NIC) and hosted by MeitY, Government of India.
            </p>
            <p className="text-[10px] text-slate-600 mt-2">
              Website GIGW Version: 1.0.0 (Guidelines for Indian Government Websites Compliant)
            </p>
          </div>

          <div className="flex flex-col lg:items-end gap-1.5 text-xs shrink-0">
            <div className="flex items-center gap-2 mb-2 justify-center lg:justify-end">
              <span className="px-2.5 py-1 bg-slate-800 text-[10px] text-orange-400 font-extrabold rounded border border-slate-750 uppercase tracking-wide">Digital India</span>
              <span className="px-2.5 py-1 bg-slate-800 text-[10px] text-emerald-400 font-extrabold rounded border border-slate-750 uppercase tracking-wide">NIC Mock</span>
            </div>
            <p className="font-bold text-slate-300">National Informatics Centre (NIC) Portal Service</p>
            <p className="text-[10px] text-slate-500">
              &copy; {new Date().getFullYear()} JanSetu-AI. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
