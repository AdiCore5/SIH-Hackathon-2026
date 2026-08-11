import React, { useState, useEffect } from 'react';
import { translate, Language } from '../services/i18n';
import { api } from '../services/api';
import { Grievance } from '../types';
import { 
  FileText, Clock, CheckCircle, AlertTriangle, 
  Calendar, Search, Filter, ArrowRight 
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

  const fetchGrievances = async () => {
    setLoading(true);
    try {
      const data = await api.getGrievances();
      // Filter only grievances for this citizen
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
    // Setup local event listener for real-time reactivity
    const handleUpdate = () => fetchGrievances();
    window.addEventListener('jansetu-data-updated', handleUpdate);
    return () => window.removeEventListener('jansetu-data-updated', handleUpdate);
  }, [userId]);

  // Status counters
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
      g.id.toLowerCase().includes(searchTerm.toLowerCase());
      
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    let color = "text-slate-600 bg-slate-100 border-slate-200";
    if (status === 'Submitted') color = "text-sky-600 bg-sky-50 border-sky-100";
    if (status === 'AI Classified') color = "text-purple-600 bg-purple-50 border-purple-100 animate-pulse";
    if (status === 'Assigned') color = "text-blue-600 bg-blue-50 border-blue-100";
    if (status === 'In Progress') color = "text-orange-600 bg-orange-50 border-orange-100";
    if (status === 'Awaiting Citizen') color = "text-amber-600 bg-amber-50 border-amber-100";
    if (status === 'Resolved') color = "text-emerald-600 bg-emerald-50 border-emerald-100";
    if (status === 'Closed') color = "text-slate-700 bg-slate-100 border-slate-200";
    if (status === 'Escalated') color = "text-rose-600 bg-rose-50 border-rose-100 font-bold border";
    
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${color}`}>
        {status}
      </span>
    );
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'Critical') return 'text-rose-700 bg-rose-50';
    if (priority === 'High') return 'text-rose-600 bg-rose-50/50';
    if (priority === 'Medium') return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-8 flex flex-col gap-8">
      
      {/* Header Greeting */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
            Good morning, Rahul 👋
          </h2>
          <p className="text-xs text-slate-500 mt-1">Here is a summary of your active civic grievances and trackings.</p>
        </div>
        <button
          onClick={() => onNavigate('lodge')}
          className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-premium hover-lift w-fit"
        >
          + Lodge a Grievance
        </button>
      </section>

      {/* Grid Status Metrics Cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Filed</span>
            <FileText size={16} className="text-slate-400" />
          </div>
          <p className="text-2xl font-black text-slate-900 leading-none">{total}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] uppercase font-bold text-slate-400">In Progress</span>
            <Clock size={16} className="text-orange-400" />
          </div>
          <p className="text-2xl font-black text-slate-900 leading-none">{inProgress}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] uppercase font-bold text-slate-400">Resolved</span>
            <CheckCircle size={16} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 leading-none">{resolved}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] uppercase font-bold text-slate-400">Escalated</span>
            <AlertTriangle size={16} className="text-rose-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 leading-none">{escalated}</p>
        </div>

      </section>

      {/* Recent Grievances filter section */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-4">
          <h3 className="font-bold text-slate-900 text-base">Recent Grievances</h3>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by ID or title..."
                className="rounded-lg border border-slate-200 pl-8 pr-3 py-1.5 text-xs text-slate-700 focus:border-orange-500 focus:outline-none"
              />
              <Search className="absolute left-2.5 top-2 text-slate-400" size={14} />
            </div>

            {/* Filter Selector */}
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-slate-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-600 focus:border-orange-500 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="escalated">Escalated</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="animate-spin text-slate-400" size={16} />
            <span>Fetching grievances...</span>
          </div>
        ) : filteredGrievances.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 font-medium">
            No grievances found matching the filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 text-[10px] uppercase font-bold text-slate-400 bg-slate-50/50">
                  <th className="py-3 px-4">{translate('tbl_id', lang)}</th>
                  <th className="py-3 px-4">{translate('tbl_subject', lang)}</th>
                  <th className="py-3 px-4">{translate('tbl_dept', lang)}</th>
                  <th className="py-3 px-4">{translate('tbl_date', lang)}</th>
                  <th className="py-3 px-4">{translate('tbl_priority', lang)}</th>
                  <th className="py-3 px-4">{translate('tbl_status', lang)}</th>
                  <th className="py-3 px-4 text-right">{translate('tbl_action', lang)}</th>
                </tr>
              </thead>
              <tbody>
                {filteredGrievances.map(g => (
                  <tr key={g.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-all font-medium">
                    <td className="py-3.5 px-4 font-extrabold text-slate-900">{g.id}</td>
                    <td className="py-3.5 px-4 text-slate-700 max-w-[200px] truncate">{g.title}</td>
                    <td className="py-3.5 px-4 text-slate-500">{g.category}</td>
                    <td className="py-3.5 px-4 text-slate-400">{new Date(g.createdAt).toLocaleDateString()}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getPriorityColor(g.priority)}`}>
                        {g.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(g.status)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onNavigate('track', g.id)}
                        className="text-xs text-orange-500 hover:text-orange-600 font-bold inline-flex items-center gap-1.5"
                      >
                        Track Status
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

// Loader helper inside dashboard
const Loader2: React.FC<any> = ({ className, size }) => (
  <svg className={`animate-spin ${className}`} style={{ width: size, height: size }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);
