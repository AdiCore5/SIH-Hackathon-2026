import React from 'react';
import { translate, Language } from '../services/i18n';
import { 
  Landmark, ArrowRight, Activity, ShieldCheck, CheckCircle2, Languages, 
  PhoneCall, Zap, Building2, Truck, Droplets, Lightbulb, Stethoscope, 
  FileText, Sparkles, MessageSquare, AlertCircle, Clock, ChevronRight, Award
} from 'lucide-react';

interface HomeProps {
  lang: Language;
  onNavigate: (tab: string) => void;
}

export const Home: React.FC<HomeProps> = ({ lang, onNavigate }) => {
  return (
    <div className="flex flex-col gap-12 max-w-7xl mx-auto px-4 md:px-12 py-8 animate-slide-up">
      
      {/* Live Government Announcement Ticker */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2.5 overflow-hidden shadow-lg flex items-center gap-3">
        <div className="bg-orange-600 text-white font-extrabold text-[10px] px-3 py-1 rounded-xl uppercase tracking-wider shrink-0 flex items-center gap-1.5 shadow-sm">
          <span className="h-2 w-2 bg-white rounded-full animate-ping"></span>
          <span>Official Ticker</span>
        </div>
        <div className="overflow-hidden w-full text-slate-300 text-xs font-medium">
          <div className="animate-ticker flex items-center gap-8">
            <span className="flex items-center gap-1.5 text-slate-200">
              <PhoneCall size={13} className="text-orange-400" />
              <strong>National Public Grievances Helpline:</strong> 1915 (Toll-Free)
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Zap size={13} />
              <strong>AI SLA Engine Status:</strong> Active — Average resolution speed improved by 72%
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5 text-sky-400">
              <Building2 size={13} />
              <strong>Integrated Portals:</strong> CPGRAMS, Swachh Bharat Urban & State Municipal Corporations
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <Award size={13} />
              <strong>SIH 2026 Innovation Flagship:</strong> Smart Multi-lingual Redressal Platform
            </span>
          </div>
        </div>
      </div>

      {/* Official Government Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl gov-hero-gradient text-white shadow-2xl py-14 md:py-20 px-6 md:px-16 border border-slate-800">
        {/* Subtle decorative background glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none"></div>
        
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-slate-800/90 border border-slate-700 text-orange-400 text-xs px-4 py-1.5 rounded-full font-bold uppercase tracking-wider mb-6 shadow-sm">
            <Sparkles size={14} className="text-orange-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>AI-Driven Public Grievance Redressal Mechanism</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-sans text-white leading-tight">
            {translate('title', lang)}
          </h2>
          <p className="text-lg md:text-2xl text-orange-400 font-bold tracking-wide mt-3 mb-6 flex items-center gap-2">
            <span>“{translate('tagline', lang)}”</span>
          </p>
          
          <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-10 font-normal max-w-2xl">
            {translate('subheading', lang)} Empowering Indian citizens with voice-guided grievance filing, automated department routing, and transparent SLA tracking.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate('lodge')}
              className="bg-orange-600 hover:bg-orange-500 text-white font-extrabold px-7 py-4 rounded-2xl shadow-xl hover-lift flex items-center gap-2.5 text-sm transition-all border border-orange-400/30"
            >
              <span>📝 {translate('cta_lodge', lang)}</span>
              <ArrowRight size={18} />
            </button>
            
            <button
              onClick={() => onNavigate('track')}
              className="bg-slate-800/90 hover:bg-slate-800 text-white border border-slate-700 font-extrabold px-7 py-4 rounded-2xl shadow-xl hover-lift flex items-center gap-2.5 text-sm transition-all"
            >
              <span>🔍 {translate('cta_track', lang)}</span>
            </button>

            <button
              onClick={() => {
                const botButton = document.getElementById('jansetu-bot-toggle');
                if (botButton) botButton.click();
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold px-7 py-4 rounded-2xl shadow-xl hover-lift flex items-center gap-2.5 text-sm transition-all border border-indigo-400/30"
            >
              <MessageSquare size={18} className="text-orange-400" />
              <span>🤖 {translate('cta_chatbot', lang)}</span>
            </button>
          </div>

          {/* Quick Stats Badges inside Hero */}
          <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>100% Automated AI Routing</span>
            </div>
            <div className="flex items-center gap-2">
              <Languages size={16} className="text-orange-400 shrink-0" />
              <span>Voice Guidance in Indic Languages</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-sky-400 shrink-0" />
              <span>CPGRAMS & NIC Aligned</span>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time National Grievance Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="gov-card p-6 flex items-center gap-4 border-l-4 border-l-orange-500">
          <div className="p-3.5 bg-orange-100 text-orange-600 rounded-2xl shrink-0 shadow-xs">
            <CheckCircle2 size={26} />
          </div>
          <div>
            <h4 className="text-2xl font-black text-slate-900 leading-none">14,890+</h4>
            <p className="text-xs text-slate-500 font-bold mt-1.5 uppercase tracking-wide">Grievances Resolved</p>
            <span className="text-[10px] text-emerald-600 font-bold mt-0.5 block">+1,240 this month</span>
          </div>
        </div>

        <div className="gov-card p-6 flex items-center gap-4 border-l-4 border-l-emerald-500">
          <div className="p-3.5 bg-emerald-100 text-emerald-600 rounded-2xl shrink-0 shadow-xs">
            <ShieldCheck size={26} />
          </div>
          <div>
            <h4 className="text-2xl font-black text-slate-900 leading-none">96.4%</h4>
            <p className="text-xs text-slate-500 font-bold mt-1.5 uppercase tracking-wide">Resolution Accuracy</p>
            <span className="text-[10px] text-emerald-600 font-bold mt-0.5 block">Verified by Nodal Audit</span>
          </div>
        </div>

        <div className="gov-card p-6 flex items-center gap-4 border-l-4 border-l-blue-600">
          <div className="p-3.5 bg-blue-100 text-blue-600 rounded-2xl shrink-0 shadow-xs">
            <Clock size={26} />
          </div>
          <div>
            <h4 className="text-2xl font-black text-slate-900 leading-none">34 Hours</h4>
            <p className="text-xs text-slate-500 font-bold mt-1.5 uppercase tracking-wide">Avg SLA Resolution</p>
            <span className="text-[10px] text-orange-600 font-bold mt-0.5 block">⚡ 72% Faster than standard</span>
          </div>
        </div>

        <div className="gov-card p-6 flex items-center gap-4 border-l-4 border-l-indigo-600">
          <div className="p-3.5 bg-indigo-100 text-indigo-600 rounded-2xl shrink-0 shadow-xs">
            <Landmark size={26} />
          </div>
          <div>
            <h4 className="text-2xl font-black text-slate-900 leading-none">18+ Wards</h4>
            <p className="text-xs text-slate-500 font-bold mt-1.5 uppercase tracking-wide">Connected Municipalities</p>
            <span className="text-[10px] text-slate-500 font-bold mt-0.5 block">Statewide Coverage</span>
          </div>
        </div>
      </section>

      {/* Citizen Public Services Quick Portal */}
      <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-orange-600 font-extrabold text-xs uppercase tracking-wider">
              <Building2 size={16} />
              <span>Public Service Directory</span>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">Select Department to Lodge Complaint</h3>
          </div>
          <button 
            onClick={() => onNavigate('lodge')}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 bg-orange-50 px-4 py-2 rounded-xl border border-orange-200"
          >
            <span>View All Departments</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Roads & Infrastructure */}
          <div 
            onClick={() => onNavigate('lodge')}
            className="p-5 border border-slate-200 rounded-2xl hover:border-orange-500 hover:shadow-lg transition-all cursor-pointer group bg-slate-50/50 hover:bg-white"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="p-3 bg-amber-100 text-amber-700 rounded-xl group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <Truck size={22} />
              </div>
              <span className="text-[10px] font-extrabold uppercase bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200">
                Avg SLA: 48h
              </span>
            </div>
            <h4 className="font-extrabold text-slate-900 text-base mb-1 group-hover:text-orange-600 transition-colors">
              Roads & Transport (NHAI / PWD)
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Potholes, broken streetlights, traffic signals, highway damage & road blockages.
            </p>
            <span className="text-xs font-bold text-orange-600 flex items-center gap-1">
              Lodge Road Complaint <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </div>

          {/* Water Supply */}
          <div 
            onClick={() => onNavigate('lodge')}
            className="p-5 border border-slate-200 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group bg-slate-50/50 hover:bg-white"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="p-3 bg-blue-100 text-blue-700 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Droplets size={22} />
              </div>
              <span className="text-[10px] font-extrabold uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                Avg SLA: 24h
              </span>
            </div>
            <h4 className="font-extrabold text-slate-900 text-base mb-1 group-hover:text-blue-600 transition-colors">
              Water Supply & Drainage
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Pipeline leaks, contaminated water supply, sewage overflow & low water pressure.
            </p>
            <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
              Lodge Water Complaint <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </div>

          {/* Electricity */}
          <div 
            onClick={() => onNavigate('lodge')}
            className="p-5 border border-slate-200 rounded-2xl hover:border-amber-500 hover:shadow-lg transition-all cursor-pointer group bg-slate-50/50 hover:bg-white"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="p-3 bg-yellow-100 text-yellow-700 rounded-xl group-hover:bg-yellow-600 group-hover:text-white transition-colors">
                <Lightbulb size={22} />
              </div>
              <span className="text-[10px] font-extrabold uppercase bg-yellow-50 text-yellow-800 px-2 py-0.5 rounded border border-yellow-200">
                Avg SLA: 12h
              </span>
            </div>
            <h4 className="font-extrabold text-slate-900 text-base mb-1 group-hover:text-amber-600 transition-colors">
              Electricity & Power Board
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Transformer faults, power outages, loose wires & incorrect billing issues.
            </p>
            <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
              Lodge Electricity Issue <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </div>

          {/* Municipal Sanitation */}
          <div 
            onClick={() => onNavigate('lodge')}
            className="p-5 border border-slate-200 rounded-2xl hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer group bg-slate-50/50 hover:bg-white"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Building2 size={22} />
              </div>
              <span className="text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                Avg SLA: 24h
              </span>
            </div>
            <h4 className="font-extrabold text-slate-900 text-base mb-1 group-hover:text-emerald-600 transition-colors">
              Municipal Waste & Sanitation
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Garbage dumps, uncleaned public bins, dead animals & public toilet hygiene.
            </p>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              Lodge Sanitation Issue <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </div>

          {/* Public Health */}
          <div 
            onClick={() => onNavigate('lodge')}
            className="p-5 border border-slate-200 rounded-2xl hover:border-rose-500 hover:shadow-lg transition-all cursor-pointer group bg-slate-50/50 hover:bg-white"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="p-3 bg-rose-100 text-rose-700 rounded-xl group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <Stethoscope size={22} />
              </div>
              <span className="text-[10px] font-extrabold uppercase bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200">
                Avg SLA: 18h
              </span>
            </div>
            <h4 className="font-extrabold text-slate-900 text-base mb-1 group-hover:text-rose-600 transition-colors">
              Healthcare & Civil Hospitals
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Hospital availability, medicine supply, doctor negligence & Ayushman card.
            </p>
            <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
              Lodge Health Complaint <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </div>

          {/* Consumer & Civil Supplies */}
          <div 
            onClick={() => onNavigate('lodge')}
            className="p-5 border border-slate-200 rounded-2xl hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer group bg-slate-50/50 hover:bg-white"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="p-3 bg-indigo-100 text-indigo-700 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <FileText size={22} />
              </div>
              <span className="text-[10px] font-extrabold uppercase bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                Avg SLA: 72h
              </span>
            </div>
            <h4 className="font-extrabold text-slate-900 text-base mb-1 group-hover:text-indigo-600 transition-colors">
              PDS Ration & Consumer Protection
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Fair price ration shop irregularities, overcharging & defective consumer goods.
            </p>
            <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
              Lodge Consumer Issue <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </section>

      {/* Visual 5-Step Resolution Journey */}
      <section className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-md text-center">
        <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 px-3.5 py-1 rounded-full text-xs font-extrabold mb-3">
          <Activity size={14} className="animate-pulse" />
          <span>Transparent 5-Stage Resolution Cycle</span>
        </div>
        <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">How JanSetu AI Accelerates Redressal</h3>
        <p className="text-slate-500 text-xs md:text-sm max-w-xl mx-auto mb-12">
          From voice recording to automated AI classification, field officer verification, and instant citizen satisfaction rating.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          <div className="flex flex-col items-center gap-3 relative z-10 group">
            <div className="h-14 w-14 rounded-2xl bg-orange-500 text-white font-black text-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform border-2 border-orange-400">1</div>
            <h5 className="font-extrabold text-slate-900 text-sm">{translate('journey_step1', lang)}</h5>
            <p className="text-xs text-slate-500 max-w-[160px]">Voice note or text input in English, Hindi or Gujarati.</p>
          </div>

          <div className="flex flex-col items-center gap-3 relative z-10 group">
            <div className="h-14 w-14 rounded-2xl bg-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform border-2 border-indigo-400 animate-pulse-glow">2</div>
            <h5 className="font-extrabold text-slate-900 text-sm">{translate('journey_step2', lang)}</h5>
            <p className="text-xs text-slate-500 max-w-[160px]">AI auto-extracts priority, ward location & SLA limit.</p>
          </div>

          <div className="flex flex-col items-center gap-3 relative z-10 group">
            <div className="h-14 w-14 rounded-2xl bg-sky-600 text-white font-black text-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform border-2 border-sky-400">3</div>
            <h5 className="font-extrabold text-slate-900 text-sm">{translate('journey_step3', lang)}</h5>
            <p className="text-xs text-slate-500 max-w-[160px]">Instant auto-allocation to the specific Ward Nodal Officer.</p>
          </div>

          <div className="flex flex-col items-center gap-3 relative z-10 group">
            <div className="h-14 w-14 rounded-2xl bg-amber-600 text-white font-black text-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform border-2 border-amber-400">4</div>
            <h5 className="font-extrabold text-slate-900 text-sm">{translate('journey_step4', lang)}</h5>
            <p className="text-xs text-slate-500 max-w-[160px]">Field officer inspects site and uploads photo proof.</p>
          </div>

          <div className="flex flex-col items-center gap-3 relative z-10 group">
            <div className="h-14 w-14 rounded-2xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform border-2 border-emerald-400">5</div>
            <h5 className="font-extrabold text-slate-900 text-sm">{translate('journey_step5', lang)}</h5>
            <p className="text-xs text-slate-500 max-w-[160px]">Citizen receives SMS alert & rate resolution experience.</p>
          </div>

          {/* Dotted connector line on desktops */}
          <div className="hidden md:block absolute top-7 left-16 right-16 h-1 border-t-2 border-dashed border-slate-300 z-0"></div>
        </div>
      </section>
      
    </div>
  );
};
