import React, { useState, useEffect } from 'react';
import { translate, Language } from '../services/i18n';
import { api } from '../services/api';
import { Grievance } from '../types';
import { 
  FileText, Clock, CheckCircle2, AlertTriangle, 
  Search, Filter, ArrowRight, ShieldCheck, User, Star, MapPin, Building2, ChevronRight
} from 'lucide-react';

interface CitizenDashboardProps {
  lang: Language;
  onNavigate: (tab: string, arg?: string) => void;
  userId: string;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({ lang, onNavigate, userId }) => {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const fetchGrievances = async () => {
    setLoading(true);
    try {
      const data = await api.getGrievances();
      const userG = data.filter(g => g.citizenId === userId);
      setGrievances(userG);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievances();
    const handleUpdate = () => fetchGrievances();
    window.addEventListener('jansetu-data-updated', handleUpdate);
    return () => window.removeEventListener('jansetu-data-updated', handleUpdate);
  }, [userId]);

  // Status metrics
  const total = grievances.length;
  const inProgress = grievances.filter(g => ['Assigned', 'In Progress', 'Awaiting Citizen'].includes(g.status)).length;
  const resolved = grievances.filter(g => ['Resolved', 'Closed'].includes(g.status)).length;
  const escalated = grievances.filter(g => g.status === 'Escalated').length;

  const filteredGrievances = grievances.filter(g => {
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'pending' && ['Submitted', 'AI Classified', 'Assigned'].includes(g.status)) ||
      (filterStatus === 'progress' && g.status === 'In Progress') ||
      (filterStatus === 'resolved' && ['Resolved', 'Closed'].includes(g.status)) ||
      (filterStatus === 'escalated' && g.status === 'Escalated');
      
    const matchesSearch = searchTerm === '' || 
      g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.category.toLowerCase().includes(searchTerm.toLowerCase());
      
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    let color = "text-slate-700 bg-slate-100 border-slate-300";
    if (status === 'Submitted') color = "text-sky-700 bg-sky-50 border-sky-200";
    if (status === 'AI Classified') color = "text-purple-700 bg-purple-50 border-purple-200 animate-pulse";
    if (status === 'Assigned') color = "text-blue-700 bg-blue-50 border-blue-200 font-bold";
    if (status === 'In Progress') color = "text-orange-700 bg-orange-50 border-orange-200 font-bold";
    if (status === 'Awaiting Citizen') color = "text-amber-700 bg-amber-50 border-amber-200";
    if (status === 'Resolved') color = "text-emerald-700 bg-emerald-50 border-emerald-200 font-bold";
    if (status === 'Closed') color = "text-slate-700 bg-slate-100 border-slate-300";
    if (status === 'Escalated') color = "text-rose-700 bg-rose-50 border-rose-200 font-black shadow-xs";
    
    return (
      <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wide border ${color}`}>
        {status}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === 'Critical') return 'bg-rose-100 text-rose-800 border-rose-300 font-black';
    if (priority === 'High') return 'bg-orange-100 text-orange-800 border-orange-300 font-bold';
    if (priority === 'Medium') return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-emerald-100 text-emerald-800 border-emerald-300';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-8 flex flex-col gap-8 animate-slide-up">
      
      {/* Official Citizen Welcome Banner */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-orange-600/20 border-2 border-orange-500 rounded-2xl flex items-center justify-center text-orange-400 font-black text-2xl shadow-lg shrink-0">
              <User size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Rahul Verma</h2>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck size={12} /> Verified Aadhaar
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <span>Aadhaar Virtual ID: •••• •••• 9812</span>
                <span className="text-slate-600">•</span>
                <span>District: Vadodara Urban</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('lodge')}
            className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-extrabold px-6 py-3.5 rounded-2xl shadow-xl hover-lift flex items-center gap-2 border border-orange-400/30 shrink-0"
          >
            <span>📝 Lodge New Grievance</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Metric Counters Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="gov-card p-5 border-l-4 border-l-slate-700">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Registered</span>
            <FileText size={18} className="text-slate-400" />
          </div>
          <p className="text-3xl font-black text-slate-900 leading-none">{total}</p>
          <span className="text-[10px] text-slate-400 mt-2 block">CPGRAMS Synced</span>
        </div>

        <div className="gov-card p-5 border-l-4 border-l-orange-500">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] uppercase font-bold text-orange-600">In Active Redressal</span>
            <Clock size={18} className="text-orange-500 animate-pulse" />
          </div>
          <p className="text-3xl font-black text-slate-900 leading-none">{inProgress}</p>
          <span className="text-[10px] text-orange-600 font-semibold mt-2 block">Assigned to Ward Nodal Officer</span>
        </div>

        <div className="gov-card p-5 border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] uppercase font-bold text-emerald-600">Resolved & Verified</span>
            <CheckCircle2 size={18} className="text-emerald-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 leading-none">{resolved}</p>
          <span className="text-[10px] text-emerald-600 font-semibold mt-2 block">Photo Proof Uploaded</span>
        </div>

        <div className="gov-card p-5 border-l-4 border-l-rose-500">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] uppercase font-bold text-rose-600">SLA Escalated</span>
            <AlertTriangle size={18} className="text-rose-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 leading-none">{escalated}</p>
          <span className="text-[10px] text-rose-600 font-semibold mt-2 block">High-Level Nodal Attention</span>
        </div>
      </section>

      {/* Main Complaints Section */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md flex flex-col gap-6">
        
        {/* Controls Toolbar */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-100 pb-5">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">My Grievances & Redressal Records</h3>
            <p className="text-xs text-slate-500">Track real-time status updates and department field inspection records.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button 
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${filterStatus === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                All ({total})
              </button>
              <button 
                onClick={() => setFilterStatus('progress')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${filterStatus === 'progress' ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                In Progress ({inProgress})
              </button>
              <button 
                onClick={() => setFilterStatus('resolved')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${filterStatus === 'resolved' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Resolved ({resolved})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search complaint ID..."
                className="rounded-xl border border-slate-200 pl-8 pr-3 py-1.5 text-xs text-slate-700 focus:border-orange-500 focus:outline-none w-48 shadow-xs"
              />
              <Search className="absolute left-2.5 top-2 text-slate-400" size={14} />
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex border border-slate-200 rounded-xl p-0.5 bg-slate-50">
              <button 
                onClick={() => setViewMode('cards')} 
                className={`px-2.5 py-1 rounded-lg text-xs font-bold ${viewMode === 'cards' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
              >
                Cards
              </button>
              <button 
                onClick={() => setViewMode('table')} 
                className={`px-2.5 py-1 rounded-lg text-xs font-bold ${viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
              >
                Table
              </button>
            </div>
          </div>
        </div>

        {/* Complaints Listing */}
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Fetching live grievance records from NIC server...</span>
          </div>
        ) : filteredGrievances.length === 0 ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
            <FileText size={36} className="text-slate-300" />
            <p className="text-sm font-bold text-slate-600">No grievances match the selected criteria.</p>
            <p className="text-xs text-slate-400">Click "Lodge New Grievance" above to file a new public issue.</p>
          </div>
        ) : viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredGrievances.map(g => (
              <div 
                key={g.id}
                className="border border-slate-200 rounded-2xl p-5 hover:shadow-lg transition-all bg-white flex flex-col justify-between gap-4 hover:border-orange-300"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-black bg-slate-100 text-slate-900 px-2.5 py-1 rounded-md border border-slate-200">
                      {g.id}
                    </span>
                    {getStatusBadge(g.status)}
                  </div>

                  <h4 className="font-extrabold text-slate-900 text-base leading-snug mb-1">
                    {g.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                    {g.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                      <Building2 size={12} className="text-orange-500" />
                      {g.category}
                    </span>
                    <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                      <MapPin size={12} className="text-slate-400" />
                      {g.location.ward || g.location.city}
                    </span>
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getPriorityBadge(g.priority)}`}>
                      Priority: {g.priority}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">
                    Filed on {new Date(g.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => onNavigate('track', g.id)}
                    className="bg-orange-50 hover:bg-orange-100 text-orange-600 px-3.5 py-1.5 rounded-xl font-extrabold flex items-center gap-1.5 transition-colors border border-orange-200"
                  >
                    <span>Track Live Status</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] uppercase font-bold text-slate-400 bg-slate-50/80">
                  <th className="py-3 px-4">Grievance Token</th>
                  <th className="py-3 px-4">Subject Title</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Filing Date</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredGrievances.map(g => (
                  <tr key={g.id} className="border-b border-slate-100 hover:bg-slate-50 transition-all">
                    <td className="py-3.5 px-4 font-mono font-extrabold text-slate-900">{g.id}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800 max-w-[220px] truncate">{g.title}</td>
                    <td className="py-3.5 px-4 text-slate-600">{g.category}</td>
                    <td className="py-3.5 px-4 text-slate-400">{new Date(g.createdAt).toLocaleDateString()}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getPriorityBadge(g.priority)}`}>
                        {g.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(g.status)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onNavigate('track', g.id)}
                        className="text-xs text-orange-600 hover:text-orange-700 font-extrabold inline-flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-lg border border-orange-200"
                      >
                        <span>Track</span>
                        <ArrowRight size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </div>
  );
};
