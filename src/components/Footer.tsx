import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-10 mt-16 border-t-4 border-orange-500">
      <div className="mx-auto px-4 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <div className="flex items-center gap-2 text-white font-bold text-lg mb-2">
            <span>🏛️</span>
            <span>JanSetu-AI Digital Portal</span>
          </div>
          <p className="text-xs text-slate-500 max-w-md">
            An AI-powered citizen grievance lodging, automatic classification, and real-time tracking interface. Designed for transparency and faster civic redressal in India.
          </p>
        </div>
        
        <div className="flex flex-col md:text-right gap-1.5 text-xs">
          <p className="font-semibold text-white">National Informatics Center (NIC) Mock Demo</p>
          <p>National Portal of India | Digital India Initiative</p>
          <p className="text-[10px] text-slate-500 mt-2">
            &copy; {new Date().getFullYear()} JanSetu-AI. Crafted for SIH Hackathon Demo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
