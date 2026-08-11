import React, { useState, useEffect } from 'react';
import { translate, Language } from '../services/i18n';
import { api } from '../services/api';
import { Grievance } from '../types';
import { 
  FileText, Clock, CheckCircle2, AlertTriangle, 
  Search, Filter, ArrowRight, ShieldCheck, User, MapPin, Building2, ChevronRight
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
    let color = "text-slate-900 bg-slate-200 border-slate-400";
    if (status === 'Submitted') color = "text-sky-950 bg-sky-100 border-sky-400 font-extrabold";
    if (status === 'AI Classified') color = "text-purple-950 bg-purple-100 border-purple-400 font-extrabold animate-pulse";
    if (status === 'Assigned') color = "text-blue-950 bg-blue-100 border-blue-400 font-extrabold";
    if (status === 'In Progress') color = "text-orange-950 bg-orange-100 border-orange-400 font-extrabold";
    if (status === 'Awaiting Citizen') color = "text-amber-950 bg-amber-100 border-amber-400 font-extrabold";
    if (status === 'Resolved') color = "text-emerald-950 bg-emerald-100 border-emerald-400 font-extrabold";
    if (status === 'Closed') color = "text-slate-900 bg-slate-200 border-slate-400 font-extrabold";
    if (status === 'Escalated') color = "text-rose-950 bg-rose-100 border-rose-400 font-black shadow-sm";
    
    return (
      <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wide border-2 ${color}`}>
        {status}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === 'Critical') return 'bg-rose-200 text-rose-950 border-rose-400 font-black';
    if (priority === 'High') return 'bg-orange-200 text-orange-950 border-orange-400 font-black';
    if (priority === 'Medium') return 'bg-amber-200 text-amber-950 border-amber-400 font-extrabold';
    return 'bg-emerald-200 text-emerald-950 border-emerald-400 font-extrabold';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-8 flex flex-col gap-8 animate-slide-up bg-slate-100/70 min-h-screen">
      
      {/* Official Citizen Welcome Banner */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-slate-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-orange-500 text-slate-950 border-2 border-orange-400 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg shrink-0">
              <User size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">Rahul Verma</h2>
                <span className="bg-emerald-500/30 text-emerald-300 border-2 border-emerald-400 text-[10px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
                  <ShieldCheck size={14} /> Verified Citizen Aadhaar
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 font-semibold flex items-center gap-2">
                <span>Aadhaar Virtual ID: •••• •••• 9812</span>
                <span className="text-slate-500">•</span>
                <span className="text-orange-400 font-bold">District: Vadodara Urban (Ward 12)</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('lodge')}
            className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-black px-6 py-3.5 rounded-2xl shadow-2xl hover-lift flex items-center gap-2 border-2 border-orange-400 shrink-0"
          >
            <span>📝 Lodge New Grievance</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Metric Counters Cards with High Contrast Accent Borders */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border-2 border-slate-300 rounded-2xl p-5 shadow-md border-t-8 border-t-slate-800">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs uppercase font-extrabold text-slate-700">Total Registered</span>
            <FileText size={20} className="text-slate-700" />
          </div>
          <p className="text-4xl font-black text-slate-950 mt-1 leading-none">{total}</p>
          <span className="text-[11px] text-slate-600 font-bold mt-2.5 block">CPGRAMS Central Synced</span>
        </div>

        <div className="bg-white border-2 border-slate-300 rounded-2xl p-5 shadow-md border-t-8 border-t-orange-500">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs uppercase font-extrabold text-orange-700">In Active Redressal</span>
            <Clock size={20} className="text-orange-600 animate-pulse" />
          </div>
          <p className="text-4xl font-black text-slate-950 mt-1 leading-none">{inProgress}</p>
          <span className="text-[11px] text-orange-700 font-extrabold mt-2.5 block">Field Nodal Officer Active</span>
        </div>

        <div className="bg-white border-2 border-slate-300 rounded-2xl p-5 shadow-md border-t-8 border-t-emerald-600">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs uppercase font-extrabold text-emerald-800">Resolved & Verified</span>
            <CheckCircle2 size={20} className="text-emerald-600" />
          </div>
          <p className="text-4xl font-black text-slate-950 mt-1 leading-none">{resolved}</p>
          <span className="text-[11px] text-emerald-800 font-extrabold mt-2.5 block">Photo Proof Uploaded</span>
        </div>

        <div className="bg-white border-2 border-slate-300 rounded-2xl p-5 shadow-md border-t-8 border-t-rose-600">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs uppercase font-extrabold text-rose-800">SLA Escalated</span>
            <AlertTriangle size={20} className="text-rose-600" />
          </div>
          <p className="text-4xl font-black text-slate-950 mt-1 leading-none">{escalated}</p>
          <span className="text-[11px] text-rose-800 font-extrabold mt-2.5 block">Division Chief Attention</span>
        </div>
      </section>

      {/* Main Complaints Section */}
      <section className="bg-white border-2 border-slate-300 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col gap-6">
        
        {/* Controls Toolbar */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b-2 border-slate-200 pb-5">
          <div>
            <h3 className="font-black text-slate-950 text-xl">My Grievances & Redressal Records</h3>
            <p className="text-xs text-slate-700 font-semibold">Track real-time status updates and department field inspection records.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Tabs */}
            <div className="flex bg-slate-200 p-1 rounded-2xl border-2 border-slate-300 text-xs">
              <button 
                onClick={() => setFilterStatus('all')}
                className={`px-3.5 py-1.5 rounded-xl font-extrabold transition-all ${filterStatus === 'all' ? 'bg-slate-950 text-white shadow-md' : 'text-slate-800 hover:text-slate-950'}`}
              >
                All ({total})
              </button>
              <button 
                onClick={() => setFilterStatus('progress')}
                className={`px-3.5 py-1.5 rounded-xl font-extrabold transition-all ${filterStatus === 'progress' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-800 hover:text-slate-950'}`}
              >
                In Progress ({inProgress})
              </button>
              <button 
                onClick={() => setFilterStatus('resolved')}
                className={`px-3.5 py-1.5 rounded-xl font-extrabold transition-all ${filterStatus === 'resolved' ? 'bg-emerald-700 text-white shadow-md' : 'text-slate-800 hover:text-slate-950'}`}
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
                className="rounded-2xl border-2 border-slate-300 pl-9 pr-3 py-2 text-xs font-bold text-slate-950 focus:border-orange-500 focus:outline-none w-52 shadow-xs bg-slate-50"
              />
              <Search className="absolute left-3 top-2.5 text-slate-500" size={15} />
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex border-2 border-slate-300 rounded-2xl p-1 bg-slate-200">
              <button 
                onClick={() => setViewMode('cards')} 
                className={`px-3 py-1 rounded-xl text-xs font-black ${viewMode === 'cards' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-700'}`}
              >
                Cards
              </button>
              <button 
                onClick={() => setViewMode('table')} 
                className={`px-3 py-1 rounded-xl text-xs font-black ${viewMode === 'table' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-700'}`}
              >
                Table
              </button>
            </div>
          </div>
        </div>

        {/* Complaints Listing */}
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-3">
            <div className="h-9 w-9 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="font-extrabold text-slate-800">Fetching live grievance records from NIC server...</span>
          </div>
        ) : filteredGrievances.length === 0 ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
            <FileText size={40} className="text-slate-400" />
            <p className="text-base font-black text-slate-900">No grievances match the selected criteria.</p>
            <p className="text-xs text-slate-600 font-semibold">Click "Lodge New Grievance" above to file a new public issue.</p>
          </div>
        ) : viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredGrievances.map(g => (
              <div 
                key={g.id}
                className="border-2 border-slate-300 rounded-3xl p-6 hover:shadow-2xl transition-all bg-white flex flex-col justify-between gap-5 hover:border-orange-500"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-xs font-black bg-slate-900 text-white px-3 py-1 rounded-lg shadow-xs">
                      {g.id}
                    </span>
                    {getStatusBadge(g.status)}
                  </div>

                  <h4 className="font-black text-slate-950 text-lg leading-snug mb-2">
                    {g.title}
                  </h4>
                  <p className="text-xs text-slate-800 font-medium line-clamp-2 leading-relaxed mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    {g.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-xs font-extrabold">
                    <span className="flex items-center gap-1.5 bg-slate-100 text-slate-900 px-2.5 py-1 rounded-xl border border-slate-300">
                      <Building2 size={14} className="text-orange-600" />
                      {g.category}
                    </span>
                    <span className="flex items-center gap-1.5 bg-slate-100 text-slate-900 px-2.5 py-1 rounded-xl border border-slate-300">
                      <MapPin size={14} className="text-slate-600" />
                      {g.location.ward || g.location.city}
                    </span>
                    <span className={`px-2.5 py-1 rounded-xl border-2 text-[11px] font-black ${getPriorityBadge(g.priority)}`}>
                      Priority: {g.priority}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-bold text-[11px]">
                    Filed on {new Date(g.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => onNavigate('track', g.id)}
                    className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-xl font-black flex items-center gap-1.5 transition-colors border-2 border-orange-400 shadow-md"
                  >
                    <span>Track Live Status</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border-2 border-slate-300 shadow-md">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-950 text-xs font-black text-white bg-slate-900">
                  <th className="py-4 px-4">Grievance Token</th>
                  <th className="py-4 px-4">Subject Title</th>
                  <th className="py-4 px-4">Department</th>
                  <th className="py-4 px-4">Filing Date</th>
                  <th className="py-4 px-4">Priority</th>
                  <th className="py-4 px-4">Current Status</th>
                  <th className="py-4 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-200">
                {filteredGrievances.map(g => (
                  <tr key={g.id} className="hover:bg-orange-50/50 transition-all odd:bg-white even:bg-slate-50 font-bold text-slate-950">
                    <td className="py-4 px-4 font-mono font-black text-slate-950 text-sm">{g.id}</td>
                    <td className="py-4 px-4 font-black text-slate-950 max-w-[220px] truncate">{g.title}</td>
                    <td className="py-4 px-4 text-slate-900 font-bold">{g.category}</td>
                    <td className="py-4 px-4 text-slate-700">{new Date(g.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black border-2 ${getPriorityBadge(g.priority)}`}>
                        {g.priority}
                      </span>
                    </td>
                    <td className="py-4 px-4">{getStatusBadge(g.status)}</td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => onNavigate('track', g.id)}
                        className="text-xs text-white bg-orange-600 hover:bg-orange-500 font-black inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border-2 border-orange-400 shadow-sm"
                      >
                        <span>Track</span>
                        <ArrowRight size={14} />
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
