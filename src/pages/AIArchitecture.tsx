import React from 'react';
import { Cpu, Search, AlertTriangle, ShieldCheck, Clock, MessageSquare, Compass, Shuffle } from 'lucide-react';

export const AIArchitecture: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-10 flex flex-col gap-10">
      
      {/* Title Header */}
      <section className="text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">How JanSetu AI Works</h2>
        <p className="text-slate-500 text-sm mt-2 max-w-lg mx-auto">
          Inside the natural language processing (NLP) and intelligence engine that powers automated Indian civic redressal.
        </p>
      </section>

      {/* Visual Pipeline flow chart */}
      <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <h4 className="font-bold text-slate-900 text-lg mb-6 flex items-center gap-2">
          <Cpu className="text-orange-500" />
          The JanSetu AI Decision Pipeline
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4 text-center">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center justify-center">
            <span className="text-xl">✍️</span>
            <h6 className="font-bold text-slate-800 text-xs mt-2">Citizen Input</h6>
            <p className="text-[10px] text-slate-400 mt-1">Text/Voice logs</p>
          </div>
          
          <div className="flex items-center justify-center text-slate-300 font-bold">➔</div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center justify-center">
            <Search className="text-indigo-600" size={20} />
            <h6 className="font-bold text-slate-800 text-xs mt-2">NLP Classifier</h6>
            <p className="text-[10px] text-slate-400 mt-1">Analyzes intent</p>
          </div>

          <div className="flex items-center justify-center text-slate-300 font-bold">➔</div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center justify-center">
            <Shuffle className="text-orange-500" size={20} />
            <h6 className="font-bold text-slate-800 text-xs mt-2">Smart Routing</h6>
            <p className="text-[10px] text-slate-400 mt-1">18+ Departments</p>
          </div>

          <div className="flex items-center justify-center text-slate-300 font-bold">➔</div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center justify-center">
            <ShieldCheck className="text-emerald-600" size={20} />
            <h6 className="font-bold text-slate-800 text-xs mt-2">Auto Dispatch</h6>
            <p className="text-[10px] text-slate-400 mt-1">Officer Assigned</p>
          </div>
        </div>
      </section>

      {/* Grid of Key Features */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex gap-4 hover:shadow-md transition-all">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl h-fit">
            <Search size={22} />
          </div>
          <div>
            <h5 className="font-bold text-slate-900 text-sm">NLP Complaint Parsing</h5>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Understands unstructured grievances submitted via voice or typing in regional languages. Standardizes citizen descriptions into legal categories.
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex gap-4 hover:shadow-md transition-all">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl h-fit">
            <Compass size={22} />
          </div>
          <div>
            <h5 className="font-bold text-slate-900 text-sm">Smart Department Routing</h5>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Dynamically maps incoming grievances to one of the 18+ municipal and utility departments based on keyword probability matrices and semantic patterns.
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex gap-4 hover:shadow-md transition-all">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl h-fit">
            <Clock size={22} />
          </div>
          <div>
            <h5 className="font-bold text-slate-900 text-sm">Priority Prediction & SLA</h5>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Detects key severity signals (spillages, safety threats, outage scope) to set priority levels and trigger SLA resolution clocks (e.g. 24h, 48h, 4 days).
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex gap-4 hover:shadow-md transition-all">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl h-fit">
            <AlertTriangle size={22} />
          </div>
          <div>
            <h5 className="font-bold text-slate-900 text-sm">Duplicate Detection</h5>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Scans active logs in a 1 km radius. If a matching issue is found, prompts the citizen to join the existing complaint to avoid duplicate work.
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex gap-4 hover:shadow-md transition-all">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl h-fit">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h5 className="font-bold text-slate-900 text-sm">Predictive Escalation</h5>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Monitors active timelines. If an officer exceeds the department SLA duration, the grievance is auto-flagged and escalated to the Admin dashboard.
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex gap-4 hover:shadow-md transition-all">
          <div className="p-3 bg-sky-50 text-sky-600 rounded-xl h-fit">
            <MessageSquare size={22} />
          </div>
          <div>
            <h5 className="font-bold text-slate-900 text-sm">Multilingual Conversational AI</h5>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Powers the chatbot to handle queries, route complaints, and summarize timeline milestones in English, Hindi (हिन्दी), and Gujarati (ગુજરાતી).
            </p>
          </div>
        </div>

      </section>
    </div>
  );
};
