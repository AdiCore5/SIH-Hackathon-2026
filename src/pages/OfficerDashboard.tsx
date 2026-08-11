import React, { useState, useEffect } from 'react';
import { translate, Language } from '../services/i18n';
import { api } from '../services/api';
import { Grievance } from '../types';
import { 
  FileText, Clock, CheckCircle2, AlertTriangle, 
  Search, Filter, Eye, ChevronRight, User, MapPin, 
  Building2, ShieldCheck, Camera, CheckSquare, MessageSquare, AlertCircle, ArrowUpRight
} from 'lucide-react';

interface OfficerDashboardProps {
  lang: Language;
  departmentId: string;
}

export const OfficerDashboard: React.FC<OfficerDashboardProps> = ({ lang, departmentId }) => {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Detail Modal & Action states
  const [selectedGrievance, setSelectedGrievance] = useState<any | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [remarkText, setRemarkText] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchGrievances = async () => {
    setLoading(true);
    try {
      const data = await api.getGrievances({ departmentId });
      setGrievances(data);
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
  }, [departmentId]);

  // Dashboard Stats
  const total = grievances.length;
  const pending = grievances.filter(g => ['Submitted', 'AI Classified', 'Assigned'].includes(g.status)).length;
  const inProgress = grievances.filter(g => g.status === 'In Progress').length;
  const resolved = grievances.filter(g => ['Resolved', 'Closed'].includes(g.status)).length;
  const breached = grievances.filter(g => g.status === 'Escalated' || (g.status !== 'Resolved' && g.status !== 'Closed' && new Date(g.slaDeadline).getTime() < Date.now())).length;

  const filteredGrievances = grievances.filter(g => {
    const matchesPriority = filterPriority === 'all' || g.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'pending' && ['Submitted', 'AI Classified', 'Assigned'].includes(g.status)) ||
      (filterStatus === 'progress' && g.status === 'In Progress') ||
      (filterStatus === 'resolved' && ['Resolved', 'Closed'].includes(g.status)) ||
      (filterStatus === 'escalated' && g.status === 'Escalated');
      
    const matchesSearch = searchTerm === '' || 
      g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (g.citizenName && g.citizenName.toLowerCase().includes(searchTerm.toLowerCase()));
      
    return matchesPriority && matchesStatus && matchesSearch;
  });

  const handleOpenDetail = async (id: string) => {
    try {
      const detail = await api.getGrievance(id);
      setSelectedGrievance(detail);
      setShowDetailModal(true);
      setRemarkText('');
      setProofUrl('');
    } catch (e) {
      console.error(e);
    }
  };

  const handleWorkflowAction = async (newStatus: string, defaultRemark: string) => {
    if (!selectedGrievance) return;
    setActionLoading(true);
    try {
      const finalRemark = remarkText.trim() || defaultRemark;
      const finalProof = newStatus === 'Resolved' ? (proofUrl.trim() || 'camera_proof_gotri_repairs.jpg') : undefined;
      
      const success = await api.updateStatus(
        selectedGrievance.id,
        newStatus,
        finalRemark,
        'Officer Amit Sharma (Ward Nodal Chief)',
        finalProof
      );
      if (success) {
        alert(`Grievance ${selectedGrievance.id} status updated to: ${newStatus.toUpperCase()}`);
        setShowDetailModal(false);
        fetchGrievances();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

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

  const getPriorityColor = (priority: string) => {
    if (priority === 'Critical') return 'text-rose-800 bg-rose-100 border-rose-300 font-black';
    if (priority === 'High') return 'text-orange-800 bg-orange-100 border-orange-300 font-bold';
    if (priority === 'Medium') return 'text-amber-800 bg-amber-100 border-amber-300';
    return 'text-emerald-800 bg-emerald-100 border-emerald-300';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-8 flex flex-col gap-8 animate-slide-up">
      
      {/* Officer Command Header */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">
            <Building2 size={16} />
            <span>Gotri Ward 12 Municipal Nodal Office</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Officer Operational Command Desk
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Assigned Nodal Officer: <strong className="text-white">Officer Amit Sharma (Badge: IND-MUNI-884)</strong>
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-2xl border border-slate-700 text-xs shrink-0">
          <div className="h-3 w-3 bg-emerald-500 rounded-full animate-ping"></div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">AI System Status</span>
            <span className="font-extrabold text-emerald-400">Auto-Routing & SLA Tracker Active</span>
          </div>
        </div>
      </section>

      {/* Metrics Cards Grid */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="gov-card p-5 border-l-4 border-l-slate-700">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Assigned</span>
          <p className="text-3xl font-black text-slate-900 mt-1 leading-none">{total}</p>
        </div>
        <div className="gov-card p-5 border-l-4 border-l-amber-500">
          <span className="text-[10px] uppercase font-bold text-amber-600">Pending Acceptance</span>
          <p className="text-3xl font-black text-slate-900 mt-1 leading-none">{pending}</p>
        </div>
        <div className="gov-card p-5 border-l-4 border-l-orange-500">
          <span className="text-[10px] uppercase font-bold text-orange-600">Active In Field</span>
          <p className="text-3xl font-black text-slate-900 mt-1 leading-none">{inProgress}</p>
        </div>
        <div className="gov-card p-5 border-l-4 border-l-emerald-500">
          <span className="text-[10px] uppercase font-bold text-emerald-600">Resolved & Closed</span>
          <p className="text-3xl font-black text-slate-900 mt-1 leading-none">{resolved}</p>
        </div>
        <div className="gov-card p-5 border-l-4 border-l-rose-500">
          <span className="text-[10px] uppercase font-bold text-rose-600">SLA Breached / Risk</span>
          <p className="text-3xl font-black text-rose-600 mt-1 leading-none">{breached}</p>
        </div>
      </section>

      {/* Main Action Queue Table */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">Assigned Public Complaints Queue</h3>
            <p className="text-xs text-slate-500">Review AI classification, accept field tasks, and upload verification proof.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search ID, title, citizen..."
                className="rounded-xl border border-slate-200 pl-8 pr-3 py-1.5 text-xs text-slate-700 focus:border-orange-500 focus:outline-none w-48 shadow-xs"
              />
              <Search className="absolute left-2.5 top-2 text-slate-400" size={14} />
            </div>

            {/* Priority filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-700 font-bold focus:outline-none shadow-xs"
            >
              <option value="all">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-700 font-bold focus:outline-none shadow-xs"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending Action</option>
              <option value="progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="escalated">Escalated</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Syncing command queue with central database...</span>
          </div>
        ) : filteredGrievances.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 font-medium">No grievances matching current filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] uppercase font-bold text-slate-400 bg-slate-50/80">
                  <th className="py-3.5 px-4">Grievance ID</th>
                  <th className="py-3.5 px-4">Complainant</th>
                  <th className="py-3.5 px-4">Issue Description</th>
                  <th className="py-3.5 px-4">Priority Tag</th>
                  <th className="py-3.5 px-4">Filing Date</th>
                  <th className="py-3.5 px-4">SLA Target</th>
                  <th className="py-3.5 px-4">Current Status</th>
                  <th className="py-3.5 px-4 text-right">Inspect & Act</th>
                </tr>
              </thead>
              <tbody>
                {filteredGrievances.map(g => (
                  <tr key={g.id} className="border-b border-slate-100 hover:bg-slate-50 transition-all font-medium">
                    <td className="py-4 px-4 font-mono font-extrabold text-slate-900">{g.id}</td>
                    <td className="py-4 px-4 font-bold text-slate-800">{g.citizenName || 'Rahul Verma'}</td>
                    <td className="py-4 px-4 text-slate-600 max-w-[200px] truncate">{g.title}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${getPriorityColor(g.priority)}`}>
                        {g.priority}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-400">{new Date(g.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 px-4 text-slate-700 font-bold">{new Date(g.slaDeadline).toLocaleDateString()}</td>
                    <td className="py-4 px-4">{getStatusBadge(g.status)}</td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleOpenDetail(g.id)}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-3.5 py-1.5 rounded-xl inline-flex items-center gap-1 hover-lift text-xs shadow-xs"
                      >
                        <Eye size={14} />
                        <span>Action Desk</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* COMPLAINT DETAIL & WORKFLOW ACTIONS MODAL */}
      {showDetailModal && selectedGrievance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto success-pop flex flex-col gap-6">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-slate-900 text-lg">Official Review: {selectedGrievance.id}</h4>
                {getStatusBadge(selectedGrievance.status)}
              </div>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-4">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400">Citizen Info</span>
                  <p className="font-bold text-slate-800">{selectedGrievance.citizenName || 'Rahul Verma'}</p>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400">Incident Location</span>
                  <p className="text-slate-700">{selectedGrievance.location.address || `${selectedGrievance.location.city}, ${selectedGrievance.location.ward}`}</p>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400">Grievance Full Text</span>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">{selectedGrievance.description}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-indigo-50/70 border border-indigo-200 p-4 rounded-2xl flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-indigo-700 flex items-center gap-1">
                    <ShieldCheck size={14} />
                    JanSetu AI Auto-Classification Engine
                  </span>
                  <div>
                    <span className="text-[8px] uppercase font-bold text-slate-400">Extracted Summary</span>
                    <p className="text-[11px] italic text-slate-700 leading-relaxed mt-0.5">"{selectedGrievance.aiSummary}"</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-1.5 text-[10px]">
                    <div>
                      <span className="text-[8px] text-slate-400 uppercase block">Priority</span>
                      <span className="font-extrabold text-slate-800">{selectedGrievance.priority}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-400 uppercase block">AI Confidence</span>
                      <span className="font-extrabold text-slate-800">{selectedGrievance.aiConfidence}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Workflow Actions Input Block */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col gap-4">
              <h5 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Update Status & Official Notes</h5>
              
              <div>
                <span className="text-[10px] text-slate-500 font-bold block mb-1">Official Nodal Remark</span>
                <textarea
                  value={remarkText}
                  onChange={(e) => setRemarkText(e.target.value)}
                  placeholder="Enter details of field inspection, repair status..."
                  rows={2}
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                />
              </div>

              {/* Resolution proof uploader */}
              {selectedGrievance.status === 'In Progress' && (
                <div className="bg-white border border-slate-200 p-3.5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="text-xs">
                    <p className="font-bold text-slate-800 flex items-center gap-1">
                      <Camera size={14} className="text-emerald-600" />
                      Upload On-Site Photo Verification Proof
                    </p>
                    <p className="text-[10px] text-slate-400">Required by GIGW auditing guidelines before closing.</p>
                  </div>
                  <input
                    type="text"
                    value={proofUrl}
                    onChange={(e) => setProofUrl(e.target.value)}
                    placeholder="e.g. photo_proof_repaired.jpg"
                    className="border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:border-blue-600 w-full sm:w-auto"
                  />
                </div>
              )}

              {/* Action Buttons Panel */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
                {selectedGrievance.status === 'Assigned' && (
                  <button
                    onClick={() => handleWorkflowAction('In Progress', 'Nodal Officer accepted the grievance for field inspection.')}
                    disabled={actionLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    Accept & Begin Inspection
                  </button>
                )}

                {selectedGrievance.status === 'In Progress' && (
                  <>
                    <button
                      onClick={() => handleWorkflowAction('Resolved', 'Nodal Officer verified repair on-site and attached photo proof.')}
                      disabled={actionLoading}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      ✓ Mark Resolved & Upload Proof
                    </button>
                    <button
                      onClick={() => handleWorkflowAction('Awaiting Citizen', 'Nodal officer requested additional location details from complainant.')}
                      disabled={actionLoading}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5"
                    >
                      Request Info from Citizen
                    </button>
                  </>
                )}

                <button
                  onClick={() => handleWorkflowAction(selectedGrievance.status, 'Nodal remark updated.')}
                  disabled={actionLoading || !remarkText.trim()}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs disabled:opacity-50"
                >
                  Save Remark Only
                </button>
                
                {selectedGrievance.status !== 'Escalated' && (
                  <button
                    onClick={() => handleWorkflowAction('Escalated', 'Nodal officer escalated issue due to high complexity / budget approval requirement.')}
                    disabled={actionLoading}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs ml-auto shadow-sm"
                  >
                    Escalate to State Chief
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
