import React from 'react';
import { translate, Language } from '../services/i18n';
import { Landmark, ArrowRight, Activity, ShieldCheck, CheckCircle2, Languages } from 'lucide-react';

interface HomeProps {
  lang: Language;
  onNavigate: (tab: string) => void;
}

export const Home: React.FC<HomeProps> = ({ lang, onNavigate }) => {
  return (
    <div className="flex flex-col gap-12 max-w-7xl mx-auto px-4 md:px-12 py-10">
      
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-xl py-16 md:py-24 px-6 md:px-16 border border-slate-800">
        {/* Subtle orange/navy background gradient blur */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs px-3.5 py-1 rounded-full font-bold uppercase tracking-wider mb-6">
            <Activity size={12} className="animate-pulse" />
            Empowering Citizens Through AI
          </div>
          
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight font-sans text-white leading-tight">
            {translate('title', lang)}
          </h2>
          <p className="text-xl md:text-2xl text-orange-400 font-bold tracking-wide mt-3 mb-6">
            “{translate('tagline', lang)}”
          </p>
          
          <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-10">
            {translate('subheading', lang)}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate('lodge')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3.5 rounded-xl shadow-premium hover-lift flex items-center gap-2"
            >
              {translate('cta_lodge', lang)}
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => onNavigate('track')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 font-bold px-6 py-3.5 rounded-xl shadow-premium hover-lift flex items-center gap-2"
            >
              {translate('cta_track', lang)}
            </button>
            <button
              onClick={() => {
                // Open chatbot floating widget
                const botButton = document.getElementById('jansetu-bot-toggle');
                if (botButton) botButton.click();
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3.5 rounded-xl shadow-premium hover-lift flex items-center gap-2"
            >
              {translate('cta_chatbot', lang)}
            </button>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-slate-900 leading-none">12,450+</h4>
            <p className="text-xs text-slate-500 font-semibold mt-1.5 uppercase tracking-wide">Grievances Resolved</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-slate-900 leading-none">94%</h4>
            <p className="text-xs text-slate-500 font-semibold mt-1.5 uppercase tracking-wide">Resolution Rate</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
          <div className="p-3 bg-sky-100 text-sky-600 rounded-xl">
            <Landmark size={24} />
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-slate-900 leading-none">18</h4>
            <p className="text-xs text-slate-500 font-semibold mt-1.5 uppercase tracking-wide">Departments connected</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
            <Languages size={24} />
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-slate-900 leading-none">72%</h4>
            <p className="text-xs text-slate-500 font-semibold mt-1.5 uppercase tracking-wide">Faster Redressal</p>
          </div>
        </div>
      </section>

      {/* Visual Journey Pipeline */}
      <section className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm text-center">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">The JanSetu-AI Grievance Journey</h3>
        <p className="text-slate-500 text-sm max-w-lg mx-auto mb-10">
          How our intelligent platform simplifies and fast-tracks the entire resolution cycle for citizens.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          <div className="flex flex-col items-center gap-3 relative z-10">
            <div className="h-12 w-12 rounded-full bg-orange-100 text-orange-600 font-bold text-lg flex items-center justify-center border-2 border-orange-500 shadow-sm">1</div>
            <h5 className="font-bold text-slate-800 text-sm">{translate('journey_step1', lang)}</h5>
            <p className="text-xs text-slate-400 max-w-[150px]">Lodge complaint via voice or text.</p>
          </div>

          <div className="flex flex-col items-center gap-3 relative z-10">
            <div className="h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 font-bold text-lg flex items-center justify-center border-2 border-indigo-600 shadow-sm animate-pulse">2</div>
            <h5 className="font-bold text-slate-800 text-sm">{translate('journey_step2', lang)}</h5>
            <p className="text-xs text-slate-400 max-w-[150px]">AI categorizes and estimates SLA.</p>
          </div>

          <div className="flex flex-col items-center gap-3 relative z-10">
            <div className="h-12 w-12 rounded-full bg-sky-100 text-sky-600 font-bold text-lg flex items-center justify-center border-2 border-sky-500 shadow-sm">3</div>
            <h5 className="font-bold text-slate-800 text-sm">{translate('journey_step3', lang)}</h5>
            <p className="text-xs text-slate-400 max-w-[150px]">Instant routing to correct department.</p>
          </div>

          <div className="flex flex-col items-center gap-3 relative z-10">
            <div className="h-12 w-12 rounded-full bg-amber-100 text-amber-600 font-bold text-lg flex items-center justify-center border-2 border-amber-500 shadow-sm">4</div>
            <h5 className="font-bold text-slate-800 text-sm">{translate('journey_step4', lang)}</h5>
            <p className="text-xs text-slate-400 max-w-[150px]">Ward officer investigates on-site.</p>
          </div>

          <div className="flex flex-col items-center gap-3 relative z-10">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 font-bold text-lg flex items-center justify-center border-2 border-emerald-500 shadow-sm animate-bounce">5</div>
            <h5 className="font-bold text-slate-800 text-sm">{translate('journey_step5', lang)}</h5>
            <p className="text-xs text-slate-400 max-w-[150px]">Issue resolved with photo proof.</p>
          </div>

          {/* Dotted connector line on desktops */}
          <div className="hidden md:block absolute top-6 left-16 right-16 h-0.5 border-t-2 border-dashed border-slate-200 z-0"></div>
        </div>
      </section>
      
    </div>
  );
};
