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

  const getPriorityColor = (priority: string) => {
    if (priority === 'Critical') return 'bg-rose-200 text-rose-950 border-rose-400 font-black';
    if (priority === 'High') return 'bg-orange-200 text-orange-950 border-orange-400 font-black';
    if (priority === 'Medium') return 'bg-amber-200 text-amber-950 border-amber-400 font-extrabold';
    return 'bg-emerald-200 text-emerald-950 border-emerald-400 font-extrabold';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-8 flex flex-col gap-8 animate-slide-up bg-slate-100/70 min-h-screen">
      
      {/* Officer Command Header */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-orange-400 uppercase tracking-wider mb-1">
            <Building2 size={16} />
            <span>Gotri Ward 12 Municipal Nodal Office</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Officer Operational Command Desk
          </h2>
          <p className="text-xs text-slate-300 mt-1 font-semibold">
            Assigned Nodal Officer: <strong className="text-orange-400 font-black">Officer Amit Sharma (Badge: IND-MUNI-884)</strong>
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-800 p-3.5 rounded-2xl border-2 border-slate-700 text-xs shrink-0 shadow-md">
          <div className="h-3.5 w-3.5 bg-emerald-400 rounded-full animate-ping"></div>
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase block">AI Telemetry Status</span>
            <span className="font-black text-emerald-400">Auto-Routing & SLA Engine Active</span>
          </div>
        </div>
      </section>

      {/* Metrics Cards Grid */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white border-2 border-slate-300 rounded-2xl p-5 shadow-md border-t-8 border-t-slate-800">
          <span className="text-xs uppercase font-extrabold text-slate-700">Total Assigned</span>
          <p className="text-4xl font-black text-slate-950 mt-1.5 leading-none">{total}</p>
        </div>
        <div className="bg-white border-2 border-slate-300 rounded-2xl p-5 shadow-md border-t-8 border-t-amber-500">
          <span className="text-xs uppercase font-extrabold text-amber-800">Pending Acceptance</span>
          <p className="text-4xl font-black text-slate-950 mt-1.5 leading-none">{pending}</p>
        </div>
        <div className="bg-white border-2 border-slate-300 rounded-2xl p-5 shadow-md border-t-8 border-t-orange-500">
          <span className="text-xs uppercase font-extrabold text-orange-700">Active In Field</span>
          <p className="text-4xl font-black text-slate-950 mt-1.5 leading-none">{inProgress}</p>
        </div>
        <div className="bg-white border-2 border-slate-300 rounded-2xl p-5 shadow-md border-t-8 border-t-emerald-600">
          <span className="text-xs uppercase font-extrabold text-emerald-800">Resolved & Closed</span>
          <p className="text-4xl font-black text-slate-950 mt-1.5 leading-none">{resolved}</p>
        </div>
        <div className="bg-white border-2 border-slate-300 rounded-2xl p-5 shadow-md border-t-8 border-t-rose-600">
          <span className="text-xs uppercase font-extrabold text-rose-800">SLA Breached / Risk</span>
          <p className="text-4xl font-black text-rose-700 mt-1.5 leading-none">{breached}</p>
        </div>
      </section>

      {/* Main Action Queue Table */}
      <section className="bg-white border-2 border-slate-300 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b-2 border-slate-200 pb-5">
          <div>
            <h3 className="font-black text-slate-950 text-xl">Assigned Public Complaints Queue</h3>
            <p className="text-xs text-slate-700 font-semibold">Review AI classification, accept field tasks, and upload verification proof.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search ID, title, citizen..."
                className="rounded-2xl border-2 border-slate-300 pl-9 pr-3 py-2 text-xs font-bold text-slate-950 focus:border-orange-500 focus:outline-none w-52 shadow-xs bg-slate-50"
              />
              <Search className="absolute left-3 top-2.5 text-slate-500" size={15} />
            </div>

            {/* Priority filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="rounded-2xl border-2 border-slate-300 px-3.5 py-2 text-xs text-slate-950 font-extrabold focus:outline-none shadow-xs bg-slate-50"
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
              className="rounded-2xl border-2 border-slate-300 px-3.5 py-2 text-xs text-slate-950 font-extrabold focus:outline-none shadow-xs bg-slate-50"
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
          <div className="p-12 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-3">
            <div className="h-9 w-9 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="font-extrabold text-slate-800">Syncing command queue with central database...</span>
          </div>
        ) : filteredGrievances.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-600 font-bold">No grievances matching current filters.</div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border-2 border-slate-300 shadow-md">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-950 text-xs font-black text-white bg-slate-900">
                  <th className="py-4 px-4">Grievance ID</th>
                  <th className="py-4 px-4">Complainant</th>
                  <th className="py-4 px-4">Issue Description</th>
                  <th className="py-4 px-4">Priority Tag</th>
                  <th className="py-4 px-4">Filing Date</th>
                  <th className="py-4 px-4">SLA Target</th>
                  <th className="py-4 px-4">Current Status</th>
                  <th className="py-4 px-4 text-right">Inspect & Act</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-200">
                {filteredGrievances.map(g => (
                  <tr key={g.id} className="hover:bg-blue-50/50 transition-all odd:bg-white even:bg-slate-50 font-bold text-slate-950">
                    <td className="py-4 px-4 font-mono font-black text-slate-950 text-sm">{g.id}</td>
                    <td className="py-4 px-4 font-black text-slate-950">{g.citizenName || 'Rahul Verma'}</td>
                    <td className="py-4 px-4 text-slate-900 font-bold max-w-[200px] truncate">{g.title}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black border-2 ${getPriorityColor(g.priority)}`}>
                        {g.priority}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-700 font-bold">{new Date(g.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 px-4 text-slate-950 font-black">{new Date(g.slaDeadline).toLocaleDateString()}</td>
                    <td className="py-4 px-4">{getStatusBadge(g.status)}</td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleOpenDetail(g.id)}
                        className="bg-slate-950 hover:bg-slate-800 text-white font-black px-4 py-2 rounded-xl inline-flex items-center gap-1.5 text-xs shadow-md border border-slate-700"
                      >
                        <Eye size={15} />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border-2 border-slate-300 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto success-pop flex flex-col gap-6">
            
            <div className="flex justify-between items-center border-b-2 border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <h4 className="font-black text-slate-950 text-xl">Official Review: {selectedGrievance.id}</h4>
                {getStatusBadge(selectedGrievance.status)}
              </div>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="text-slate-500 hover:text-slate-950 font-black text-base"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-black text-slate-500">Citizen Info</span>
                  <p className="font-black text-slate-950 text-sm mt-0.5">{selectedGrievance.citizenName || 'Rahul Verma'}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black text-slate-500">Incident Location</span>
                  <p className="text-slate-900 font-bold mt-0.5">{selectedGrievance.location.address || `${selectedGrievance.location.city}, ${selectedGrievance.location.ward}`}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black text-slate-500">Grievance Full Text</span>
                  <p className="text-slate-900 font-semibold leading-relaxed bg-slate-100 p-3.5 rounded-2xl border-2 border-slate-300 mt-1">{selectedGrievance.description}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-indigo-100/70 border-2 border-indigo-300 p-4 rounded-2xl flex flex-col gap-2">
                  <span className="text-[11px] font-black text-indigo-950 flex items-center gap-1">
                    <ShieldCheck size={16} />
                    JanSetu AI Auto-Classification Engine
                  </span>
                  <div>
                    <span className="text-[9px] uppercase font-black text-slate-600">Extracted Summary</span>
                    <p className="text-xs font-extrabold italic text-slate-900 leading-relaxed mt-0.5">"{selectedGrievance.aiSummary}"</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                    <div>
                      <span className="text-[9px] text-slate-600 uppercase font-black block">Priority</span>
                      <span className="font-black text-slate-950 text-sm">{selectedGrievance.priority}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-600 uppercase font-black block">AI Confidence</span>
                      <span className="font-black text-slate-950 text-sm">{selectedGrievance.aiConfidence}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Workflow Actions Input Block */}
            <div className="bg-slate-100 p-5 rounded-2xl border-2 border-slate-300 flex flex-col gap-4">
              <h5 className="font-black text-slate-950 text-xs uppercase tracking-wider">Update Status & Official Notes</h5>
              
              <div>
                <span className="text-xs text-slate-800 font-extrabold block mb-1">Official Nodal Remark</span>
                <textarea
                  value={remarkText}
                  onChange={(e) => setRemarkText(e.target.value)}
                  placeholder="Enter details of field inspection, repair status..."
                  rows={2}
                  className="w-full bg-white border-2 border-slate-300 rounded-2xl p-3 text-xs text-slate-950 font-bold focus:border-blue-600 focus:outline-none"
                />
              </div>

              {/* Resolution proof uploader */}
              {selectedGrievance.status === 'In Progress' && (
                <div className="bg-white border-2 border-slate-300 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="text-xs">
                    <p className="font-black text-slate-950 flex items-center gap-1.5">
                      <Camera size={16} className="text-emerald-600" />
                      Upload On-Site Photo Verification Proof
                    </p>
                    <p className="text-[11px] text-slate-600 font-semibold">Required by GIGW auditing guidelines before closing.</p>
                  </div>
                  <input
                    type="text"
                    value={proofUrl}
                    onChange={(e) => setProofUrl(e.target.value)}
                    placeholder="e.g. photo_proof_repaired.jpg"
                    className="border-2 border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-950 font-bold focus:border-blue-600 w-full sm:w-auto"
                  />
                </div>
              )}

              {/* Action Buttons Panel */}
              <div className="flex flex-wrap gap-2 pt-2 border-t-2 border-slate-300">
                {selectedGrievance.status === 'Assigned' && (
                  <button
                    onClick={() => handleWorkflowAction('In Progress', 'Nodal Officer accepted the grievance for field inspection.')}
                    disabled={actionLoading}
                    className="bg-blue-700 hover:bg-blue-600 text-white font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md border border-blue-500"
                  >
                    Accept & Begin Inspection
                  </button>
                )}

                {selectedGrievance.status === 'In Progress' && (
                  <>
                    <button
                      onClick={() => handleWorkflowAction('Resolved', 'Nodal Officer verified repair on-site and attached photo proof.')}
                      disabled={actionLoading}
                      className="bg-emerald-700 hover:bg-emerald-600 text-white font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md border border-emerald-500"
                    >
                      ✓ Mark Resolved & Upload Proof
                    </button>
                    <button
                      onClick={() => handleWorkflowAction('Awaiting Citizen', 'Nodal officer requested additional location details from complainant.')}
                      disabled={actionLoading}
                      className="bg-amber-600 hover:bg-amber-500 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5"
                    >
                      Request Info from Citizen
                    </button>
                  </>
                )}

                <button
                  onClick={() => handleWorkflowAction(selectedGrievance.status, 'Nodal remark updated.')}
                  disabled={actionLoading || !remarkText.trim()}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-black px-4 py-2.5 rounded-xl text-xs disabled:opacity-50"
                >
                  Save Remark Only
                </button>
                
                {selectedGrievance.status !== 'Escalated' && (
                  <button
                    onClick={() => handleWorkflowAction('Escalated', 'Nodal officer escalated issue due to high complexity / budget approval requirement.')}
                    disabled={actionLoading}
                    className="bg-rose-700 hover:bg-rose-600 text-white font-black px-4 py-2.5 rounded-xl text-xs ml-auto shadow-md border border-rose-500"
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
