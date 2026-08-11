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
    <div className="flex flex-col gap-12 max-w-7xl mx-auto px-4 md:px-12 py-8 animate-slide-up bg-slate-100/70 min-h-screen">
      
      {/* Live Government Announcement Ticker */}
      <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-3 overflow-hidden shadow-xl flex items-center gap-3">
        <div className="bg-orange-600 text-white font-black text-xs px-3.5 py-1.5 rounded-xl uppercase tracking-wider shrink-0 flex items-center gap-2 shadow-md">
          <span className="h-2.5 w-2.5 bg-white rounded-full animate-ping"></span>
          <span>Official Ticker</span>
        </div>
        <div className="overflow-hidden w-full text-slate-200 text-xs font-bold">
          <div className="animate-ticker flex items-center gap-8">
            <span className="flex items-center gap-1.5 text-white">
              <PhoneCall size={14} className="text-orange-400" />
              <strong>National Public Grievances Helpline:</strong> 1915 (Toll-Free)
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Zap size={14} />
              <strong>AI SLA Engine Status:</strong> Active — Average resolution speed improved by 72%
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5 text-sky-400">
              <Building2 size={14} />
              <strong>Integrated Portals:</strong> CPGRAMS, Swachh Bharat Urban & State Municipal Corporations
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <Award size={14} />
              <strong>SIH 2026 Innovation Flagship:</strong> Smart Multi-lingual Redressal Platform
            </span>
          </div>
        </div>
      </div>

      {/* Official Government Hero Banner (Deep Navy Background + High Contrast White & Saffron Title) */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 gov-hero-gradient text-white shadow-2xl py-14 md:py-20 px-6 md:px-16 border-2 border-slate-800">
        {/* Decorative background glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>
        
        <div className="max-w-3xl relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-slate-900/90 border-2 border-slate-700 text-orange-400 text-xs px-4 py-1.5 rounded-full font-black uppercase tracking-wider shadow-md">
            <Sparkles size={15} className="text-orange-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>AI-Driven Public Grievance Redressal Mechanism</span>
          </div>
          
          {/* Prominent High-Contrast JanSetu AI Title */}
          <div className="space-y-2">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight font-sans text-white leading-tight flex flex-wrap items-center gap-3">
              <span className="text-white drop-shadow-lg">JanSetu</span>
              <span className="text-orange-400 bg-orange-950/90 border-2 border-orange-500/90 px-3.5 py-0.5 rounded-2xl shadow-xl">AI</span>
            </h2>
            <p className="text-xl md:text-2xl text-orange-400 font-black tracking-wide flex items-center gap-2 pt-1">
              <span>“{translate('tagline', lang)}”</span>
            </p>
          </div>
          
          <p className="text-slate-200 text-sm md:text-base leading-relaxed font-semibold max-w-2xl">
            {translate('subheading', lang)} Empowering Indian citizens with voice-guided grievance filing, automated department routing, and transparent SLA tracking.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => onNavigate('lodge')}
              className="bg-orange-600 hover:bg-orange-500 text-white font-black px-7 py-4 rounded-2xl shadow-2xl hover-lift flex items-center gap-2.5 text-sm transition-all border-2 border-orange-400"
            >
              <span>📝 {translate('cta_lodge', lang)}</span>
              <ArrowRight size={18} />
            </button>
            
            <button
              onClick={() => onNavigate('track')}
              className="bg-slate-900 hover:bg-slate-800 text-white border-2 border-slate-700 font-black px-7 py-4 rounded-2xl shadow-2xl hover-lift flex items-center gap-2.5 text-sm transition-all"
            >
              <span>🔍 {translate('cta_track', lang)}</span>
            </button>

            <button
              onClick={() => {
                const botButton = document.getElementById('jansetu-bot-toggle');
                if (botButton) botButton.click();
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-7 py-4 rounded-2xl shadow-2xl hover-lift flex items-center gap-2.5 text-sm transition-all border-2 border-indigo-400"
            >
              <MessageSquare size={18} className="text-orange-400" />
              <span>🤖 {translate('cta_chatbot', lang)}</span>
            </button>
          </div>

          {/* Quick Stats Badges inside Hero */}
          <div className="mt-12 pt-8 border-t-2 border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-bold text-slate-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
              <span>100% Automated AI Routing</span>
            </div>
            <div className="flex items-center gap-2">
              <Languages size={18} className="text-orange-400 shrink-0" />
              <span>Voice Guidance in Indic Languages</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-sky-400 shrink-0" />
              <span>CPGRAMS & NIC Aligned</span>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time National Grievance Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 shadow-md border-l-8 border-l-orange-500">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-orange-100 text-orange-600 rounded-2xl shrink-0 shadow-xs border border-orange-200">
              <CheckCircle2 size={26} />
            </div>
            <div>
              <h4 className="text-3xl font-black text-slate-950 leading-none">14,890+</h4>
              <p className="text-xs text-slate-700 font-extrabold mt-1.5 uppercase tracking-wide">Grievances Resolved</p>
              <span className="text-[11px] text-emerald-700 font-extrabold mt-1 block">+1,240 this month</span>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 shadow-md border-l-8 border-l-emerald-600">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-emerald-100 text-emerald-600 rounded-2xl shrink-0 shadow-xs border border-emerald-200">
              <ShieldCheck size={26} />
            </div>
            <div>
              <h4 className="text-3xl font-black text-slate-950 leading-none">96.4%</h4>
              <p className="text-xs text-slate-700 font-extrabold mt-1.5 uppercase tracking-wide">Resolution Accuracy</p>
              <span className="text-[11px] text-emerald-700 font-extrabold mt-1 block">Verified by Nodal Audit</span>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 shadow-md border-l-8 border-l-blue-600">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-blue-100 text-blue-600 rounded-2xl shrink-0 shadow-xs border border-blue-200">
              <Clock size={26} />
            </div>
            <div>
              <h4 className="text-3xl font-black text-slate-950 leading-none">34 Hours</h4>
              <p className="text-xs text-slate-700 font-extrabold mt-1.5 uppercase tracking-wide">Avg SLA Resolution</p>
              <span className="text-[11px] text-orange-700 font-extrabold mt-1 block">⚡ 72% Faster than standard</span>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 shadow-md border-l-8 border-l-indigo-600">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-indigo-100 text-indigo-600 rounded-2xl shrink-0 shadow-xs border border-indigo-200">
              <Landmark size={26} />
            </div>
            <div>
              <h4 className="text-3xl font-black text-slate-950 leading-none">18+ Wards</h4>
              <p className="text-xs text-slate-700 font-extrabold mt-1.5 uppercase tracking-wide">Connected Municipalities</p>
              <span className="text-[11px] text-slate-600 font-bold mt-1 block">Statewide Coverage</span>
            </div>
          </div>
        </div>
      </section>

      {/* Citizen Public Services Quick Portal */}
      <section className="bg-white border-2 border-slate-300 rounded-3xl p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-orange-600 font-black text-xs uppercase tracking-wider">
              <Building2 size={16} />
              <span>Public Service Directory</span>
            </div>
            <h3 className="text-2xl font-black text-slate-950 mt-1">Select Department to Lodge Complaint</h3>
          </div>
          <button 
            onClick={() => onNavigate('lodge')}
            className="text-xs font-black text-orange-600 hover:text-orange-700 flex items-center gap-1 bg-orange-50 px-4 py-2.5 rounded-xl border-2 border-orange-200 shadow-sm"
          >
            <span>View All Departments</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Roads & Infrastructure */}
          <div 
            onClick={() => onNavigate('lodge')}
            className="p-6 border-2 border-slate-300 rounded-2xl hover:border-orange-500 hover:shadow-2xl transition-all cursor-pointer group bg-slate-50 hover:bg-white"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="p-3.5 bg-amber-100 text-amber-800 rounded-xl group-hover:bg-orange-600 group-hover:text-white transition-colors border border-amber-200">
                <Truck size={24} />
              </div>
              <span className="text-[10px] font-black uppercase bg-amber-100 text-amber-950 px-2.5 py-1 rounded-md border border-amber-300">
                Avg SLA: 48h
              </span>
            </div>
            <h4 className="font-black text-slate-950 text-base mb-1 group-hover:text-orange-600 transition-colors">
              Roads & Transport (NHAI / PWD)
            </h4>
            <p className="text-xs text-slate-700 font-medium leading-relaxed mb-4">
              Potholes, broken streetlights, traffic signals, highway damage & road blockages.
            </p>
            <span className="text-xs font-black text-orange-600 flex items-center gap-1">
              Lodge Road Complaint <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </div>

          {/* Water Supply */}
          <div 
            onClick={() => onNavigate('lodge')}
            className="p-6 border-2 border-slate-300 rounded-2xl hover:border-blue-500 hover:shadow-2xl transition-all cursor-pointer group bg-slate-50 hover:bg-white"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="p-3.5 bg-blue-100 text-blue-800 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors border border-blue-200">
                <Droplets size={24} />
              </div>
              <span className="text-[10px] font-black uppercase bg-blue-100 text-blue-950 px-2.5 py-1 rounded-md border border-blue-300">
                Avg SLA: 24h
              </span>
            </div>
            <h4 className="font-black text-slate-950 text-base mb-1 group-hover:text-blue-600 transition-colors">
              Water Supply & Drainage
            </h4>
            <p className="text-xs text-slate-700 font-medium leading-relaxed mb-4">
              Pipeline leaks, contaminated water supply, sewage overflow & low water pressure.
            </p>
            <span className="text-xs font-black text-blue-600 flex items-center gap-1">
              Lodge Water Complaint <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </div>

          {/* Electricity */}
          <div 
            onClick={() => onNavigate('lodge')}
            className="p-6 border-2 border-slate-300 rounded-2xl hover:border-amber-500 hover:shadow-2xl transition-all cursor-pointer group bg-slate-50 hover:bg-white"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="p-3.5 bg-yellow-100 text-yellow-800 rounded-xl group-hover:bg-yellow-600 group-hover:text-white transition-colors border border-yellow-200">
                <Lightbulb size={24} />
              </div>
              <span className="text-[10px] font-black uppercase bg-yellow-100 text-yellow-950 px-2.5 py-1 rounded-md border border-yellow-300">
                Avg SLA: 12h
              </span>
            </div>
            <h4 className="font-black text-slate-950 text-base mb-1 group-hover:text-amber-600 transition-colors">
              Electricity & Power Board
            </h4>
            <p className="text-xs text-slate-700 font-medium leading-relaxed mb-4">
              Transformer faults, power outages, loose wires & incorrect billing issues.
            </p>
            <span className="text-xs font-black text-amber-600 flex items-center gap-1">
              Lodge Electricity Issue <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </div>

          {/* Municipal Sanitation */}
          <div 
            onClick={() => onNavigate('lodge')}
            className="p-6 border-2 border-slate-300 rounded-2xl hover:border-emerald-500 hover:shadow-2xl transition-all cursor-pointer group bg-slate-50 hover:bg-white"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="p-3.5 bg-emerald-100 text-emerald-800 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors border border-emerald-200">
                <Building2 size={24} />
              </div>
              <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-950 px-2.5 py-1 rounded-md border border-emerald-300">
                Avg SLA: 24h
              </span>
            </div>
            <h4 className="font-black text-slate-950 text-base mb-1 group-hover:text-emerald-600 transition-colors">
              Municipal Waste & Sanitation
            </h4>
            <p className="text-xs text-slate-700 font-medium leading-relaxed mb-4">
              Garbage dumps, uncleaned public bins, dead animals & public toilet hygiene.
            </p>
            <span className="text-xs font-black text-emerald-600 flex items-center gap-1">
              Lodge Sanitation Issue <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </div>

          {/* Public Health */}
          <div 
            onClick={() => onNavigate('lodge')}
            className="p-6 border-2 border-slate-300 rounded-2xl hover:border-rose-500 hover:shadow-2xl transition-all cursor-pointer group bg-slate-50 hover:bg-white"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="p-3.5 bg-rose-100 text-rose-800 rounded-xl group-hover:bg-rose-600 group-hover:text-white transition-colors border border-rose-200">
                <Stethoscope size={24} />
              </div>
              <span className="text-[10px] font-black uppercase bg-rose-100 text-rose-950 px-2.5 py-1 rounded-md border border-rose-300">
                Avg SLA: 18h
              </span>
            </div>
            <h4 className="font-black text-slate-950 text-base mb-1 group-hover:text-rose-600 transition-colors">
              Healthcare & Civil Hospitals
            </h4>
            <p className="text-xs text-slate-700 font-medium leading-relaxed mb-4">
              Hospital availability, medicine supply, doctor negligence & Ayushman card.
            </p>
            <span className="text-xs font-black text-rose-600 flex items-center gap-1">
              Lodge Health Complaint <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </div>

          {/* Consumer & Civil Supplies */}
          <div 
            onClick={() => onNavigate('lodge')}
            className="p-6 border-2 border-slate-300 rounded-2xl hover:border-indigo-500 hover:shadow-2xl transition-all cursor-pointer group bg-slate-50 hover:bg-white"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="p-3.5 bg-indigo-100 text-indigo-800 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors border border-indigo-200">
                <FileText size={24} />
              </div>
              <span className="text-[10px] font-black uppercase bg-indigo-100 text-indigo-950 px-2.5 py-1 rounded-md border border-indigo-300">
                Avg SLA: 72h
              </span>
            </div>
            <h4 className="font-black text-slate-950 text-base mb-1 group-hover:text-indigo-600 transition-colors">
              PDS Ration & Consumer Protection
            </h4>
            <p className="text-xs text-slate-700 font-medium leading-relaxed mb-4">
              Fair price ration shop irregularities, overcharging & defective consumer goods.
            </p>
            <span className="text-xs font-black text-indigo-600 flex items-center gap-1">
              Lodge Consumer Issue <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </section>

      {/* Visual 5-Step Resolution Journey */}
      <section className="bg-white border-2 border-slate-300 rounded-3xl p-8 md:p-12 shadow-xl text-center">
        <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-950 border border-orange-300 px-4 py-1.5 rounded-full text-xs font-black mb-3">
          <Activity size={15} className="animate-pulse text-orange-600" />
          <span>Transparent 5-Stage Resolution Cycle</span>
        </div>
        <h3 className="text-2xl md:text-3xl font-black text-slate-950 mb-2">How JanSetu AI Accelerates Redressal</h3>
        <p className="text-slate-700 text-xs md:text-sm font-semibold max-w-xl mx-auto mb-12">
          From voice recording to automated AI classification, field officer verification, and instant citizen satisfaction rating.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          <div className="flex flex-col items-center gap-3 relative z-10 group">
            <div className="h-14 w-14 rounded-2xl bg-orange-600 text-white font-black text-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform border-2 border-orange-400">1</div>
            <h5 className="font-black text-slate-950 text-sm">{translate('journey_step1', lang)}</h5>
            <p className="text-xs text-slate-700 font-semibold max-w-[160px]">Voice note or text input in English, Hindi or Gujarati.</p>
          </div>

          <div className="flex flex-col items-center gap-3 relative z-10 group">
            <div className="h-14 w-14 rounded-2xl bg-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform border-2 border-indigo-400">2</div>
            <h5 className="font-black text-slate-950 text-sm">{translate('journey_step2', lang)}</h5>
            <p className="text-xs text-slate-700 font-semibold max-w-[160px]">AI auto-extracts priority, ward location & SLA limit.</p>
          </div>

          <div className="flex flex-col items-center gap-3 relative z-10 group">
            <div className="h-14 w-14 rounded-2xl bg-sky-600 text-white font-black text-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform border-2 border-sky-400">3</div>
            <h5 className="font-black text-slate-950 text-sm">{translate('journey_step3', lang)}</h5>
            <p className="text-xs text-slate-700 font-semibold max-w-[160px]">Instant auto-allocation to the specific Ward Nodal Officer.</p>
          </div>

          <div className="flex flex-col items-center gap-3 relative z-10 group">
            <div className="h-14 w-14 rounded-2xl bg-amber-600 text-white font-black text-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform border-2 border-amber-400">4</div>
            <h5 className="font-black text-slate-950 text-sm">{translate('journey_step4', lang)}</h5>
            <p className="text-xs text-slate-700 font-semibold max-w-[160px]">Field officer inspects site and uploads photo proof.</p>
          </div>

          <div className="flex flex-col items-center gap-3 relative z-10 group">
            <div className="h-14 w-14 rounded-2xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform border-2 border-emerald-400">5</div>
            <h5 className="font-black text-slate-950 text-sm">{translate('journey_step5', lang)}</h5>
            <p className="text-xs text-slate-700 font-semibold max-w-[160px]">Citizen receives SMS alert & rate resolution experience.</p>
          </div>

          {/* Dotted connector line on desktops */}
          <div className="hidden md:block absolute top-7 left-16 right-16 h-1 border-t-2 border-dashed border-slate-400 z-0"></div>
        </div>
      </section>
      
    </div>
  );
};
