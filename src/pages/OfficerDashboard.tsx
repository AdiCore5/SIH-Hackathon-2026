import React, { useState, useEffect } from 'react';
import { translate, Language } from '../services/i18n';
import { api } from '../services/api';
import { Grievance, GrievanceUpdate } from '../types';
import { 
  FileText, Clock, CheckCircle, AlertTriangle, 
  Search, Filter, Eye, ChevronRight, User, MapPin, 
  Calendar, Upload, ArrowRight, ShieldCheck, HelpCircle
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
    // Register real-time sync event
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
      g.id.toLowerCase().includes(searchTerm.toLowerCase());
      
    return matchesPriority && matchesStatus && matchesSearch;
  });

  // Open detailed popup
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

  // Perform workflow actions
  const handleWorkflowAction = async (newStatus: string, defaultRemark: string) => {
    if (!selectedGrievance) return;
    setActionLoading(true);
    try {
      const finalRemark = remarkText.trim() || defaultRemark;
      const finalProof = newStatus === 'Resolved' ? (proofUrl.trim() || 'camera_proof_gotri_ streetlight.jpg') : undefined;
      
      const success = await api.updateStatus(
        selectedGrievance.id,
        newStatus,
        finalRemark,
        'Officer Amit Sharma',
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
      
      {/* Header Info */}
      <section className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Municipal Officer Workspace</h2>
          <p className="text-xs text-slate-500 mt-1">Assigned Department: <span className="font-bold text-slate-800">Municipal Corporation (Gotri Ward 12)</span></p>
        </div>
      </section>

      {/* Stats Counters Grid */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Assigned</span>
          <p className="text-2xl font-black text-slate-900 mt-2 leading-none">{total}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Pending</span>
          <p className="text-2xl font-black text-amber-500 mt-2 leading-none">{pending}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">In Progress</span>
          <p className="text-2xl font-black text-orange-500 mt-2 leading-none">{inProgress}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Resolved</span>
          <p className="text-2xl font-black text-emerald-500 mt-2 leading-none">{resolved}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">SLA Breached</span>
          <p className="text-2xl font-black text-rose-500 mt-2 leading-none">{breached}</p>
        </div>
      </section>

      {/* Main Grid table */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-4">
          <h3 className="font-bold text-slate-900 text-base">Assigned Civic Grievances</h3>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search ID, keyword..."
                className="rounded-lg border border-slate-200 pl-8 pr-3 py-1.5 text-xs text-slate-700 focus:border-orange-500 focus:outline-none"
              />
              <Search className="absolute left-2.5 top-2 text-slate-400" size={14} />
            </div>

            {/* Priority filter */}
            <div className="flex items-center gap-1">
              <Filter size={12} className="text-slate-400" />
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-600 focus:outline-none"
              >
                <option value="all">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-600 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="escalated">Escalated</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400 font-medium">Fetching assigned complaints...</div>
        ) : filteredGrievances.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 font-medium">No grievances matching current filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 text-[10px] uppercase font-bold text-slate-400 bg-slate-50/50">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Citizen</th>
                  <th className="py-3 px-4">Complaint Title</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Date Filed</th>
                  <th className="py-3 px-4">SLA Deadline</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredGrievances.map(g => (
                  <tr key={g.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-all font-medium">
                    <td className="py-3.5 px-4 font-extrabold text-slate-900">{g.id}</td>
                    <td className="py-3.5 px-4 text-slate-700">{g.citizenName || 'Rahul Verma'}</td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-[180px] truncate">{g.title}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getPriorityColor(g.priority)}`}>
                        {g.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{new Date(g.createdAt).toLocaleDateString()}</td>
                    <td className="py-3.5 px-4 text-slate-500 font-semibold">{new Date(g.slaDeadline).toLocaleDateString()}</td>
                    <td className="py-3.5 px-4">{getStatusBadge(g.status)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenDetail(g.id)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 hover-lift"
                      >
                        <Eye size={12} />
                        Details
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-lg max-h-[90vh] overflow-y-auto success-pop flex flex-col gap-6">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-slate-900 text-lg">Grievance {selectedGrievance.id}</h4>
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
                  <span className="text-[9px] uppercase font-bold text-slate-400">Citizen name</span>
                  <p className="font-bold text-slate-800">{selectedGrievance.citizenName || 'Rahul Verma'}</p>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400">Location Address</span>
                  <p className="text-slate-700">{selectedGrievance.location.address || `${selectedGrievance.location.city}, ${selectedGrievance.location.ward}`}</p>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400">Description</span>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">{selectedGrievance.description}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-orange-50/50 border border-orange-200/50 p-4 rounded-2xl flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-orange-600 flex items-center gap-1">
                    <ShieldCheck size={14} />
                    JanSetu AI Analysis
                  </span>
                  <div>
                    <span className="text-[8px] uppercase font-bold text-slate-400">AI Summary</span>
                    <p className="text-[11px] italic text-slate-700 leading-relaxed mt-0.5">"{selectedGrievance.aiSummary}"</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-1.5 text-[10px]">
                    <div>
                      <span className="text-[8px] text-slate-400 uppercase block">Priority</span>
                      <span className="font-bold text-slate-800">{selectedGrievance.priority}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-400 uppercase block">Confidence</span>
                      <span className="font-bold text-slate-800">{selectedGrievance.aiConfidence}%</span>
                    </div>
                  </div>
                </div>

                {selectedGrievance.evidenceUrls && selectedGrievance.evidenceUrls.length > 0 && (
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Attachments</span>
                    <div className="flex gap-2 mt-1.5">
                      {selectedGrievance.evidenceUrls.map((file: string, idx: number) => (
                        <div key={idx} className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg font-bold text-[10px] text-slate-600 flex items-center gap-1">
                          📎 {file}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Workflow Actions Input Block */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col gap-4">
              <h5 className="font-bold text-slate-900 text-xs">Update Status / Add Remark</h5>
              
              <div>
                <span className="text-[9px] text-slate-400 font-bold block mb-1">Add Remark / Log updates</span>
                <textarea
                  value={remarkText}
                  onChange={(e) => setRemarkText(e.target.value)}
                  placeholder="Describe details of work done, investigation progress..."
                  rows={2}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:border-indigo-600"
                />
              </div>

              {/* Resolution proof uploader placeholder (only visible if updating to Resolved) */}
              {selectedGrievance.status === 'In Progress' && (
                <div className="bg-white border border-slate-200 p-3.5 rounded-xl flex justify-between items-center gap-4">
                  <div className="text-xs">
                    <p className="font-bold text-slate-800">Resolution Proof Upload</p>
                    <p className="text-[10px] text-slate-400">Required to mark complaint resolved.</p>
                  </div>
                  <input
                    type="text"
                    value={proofUrl}
                    onChange={(e) => setProofUrl(e.target.value)}
                    placeholder="e.g. proof_streetlight_replaced.jpg"
                    className="border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:border-indigo-600"
                  />
                </div>
              )}

              {/* Action Buttons Panel */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200/60">
                {selectedGrievance.status === 'Assigned' && (
                  <button
                    onClick={() => handleWorkflowAction('In Progress', 'Officer accepted the grievance and marked In Progress')}
                    disabled={actionLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
                  >
                    Accept & Mark In Progress
                  </button>
                )}

                {selectedGrievance.status === 'In Progress' && (
                  <>
                    <button
                      onClick={() => handleWorkflowAction('Resolved', 'Officer completed the maintenance repair.')}
                      disabled={actionLoading}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
                    >
                      Mark Resolved
                    </button>
                    <button
                      onClick={() => handleWorkflowAction('Awaiting Citizen', 'Requesting additional information from citizen regarding location')}
                      disabled={actionLoading}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
                    >
                      Request Info
                    </button>
                  </>
                )}

                <button
                  onClick={() => handleWorkflowAction(selectedGrievance.status, 'Remark update logged')}
                  disabled={actionLoading || !remarkText.trim()}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-xl text-xs disabled:opacity-50"
                >
                  Add Remark Only
                </button>
                
                {selectedGrievance.status !== 'Escalated' && (
                  <button
                    onClick={() => handleWorkflowAction('Escalated', 'Manual officer escalation to division chief.')}
                    disabled={actionLoading}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs ml-auto"
                  >
                    Escalate
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
