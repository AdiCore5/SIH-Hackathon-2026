import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Grievance, Officer, PriorityLevel } from '../types';
import { Language } from '../services/i18n';
import {
  FileText, Search, Filter, AlertTriangle, ArrowRightLeft,
  XCircle, ChevronUp, ChevronDown, Shield, Clock, MapPin, X
} from 'lucide-react';

interface AdminManageGrievancesProps {
  lang: Language;
}

export const AdminManageGrievances: React.FC<AdminManageGrievancesProps> = ({ lang }) => {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [departments, setDepartments] = useState<any[]>([]);

  // Modal states
  const [reassignTarget, setReassignTarget] = useState<string | null>(null);
  const [selectedOfficer, setSelectedOfficer] = useState('');
  const [closeTarget, setCloseTarget] = useState<string | null>(null);
  const [closeRemark, setCloseRemark] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [gs, offs, depts] = await Promise.all([
        api.getGrievances(),
        api.getOfficers(),
        api.getDepartments()
      ]);
      setGrievances(gs);
      setOfficers(offs);
      setDepartments(depts);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const handleUpdate = () => fetchData();
    window.addEventListener('jansetu-data-updated', handleUpdate);
    return () => window.removeEventListener('jansetu-data-updated', handleUpdate);
  }, []);

  const handleReassign = async () => {
    if (reassignTarget && selectedOfficer) {
      await api.reassignGrievance(reassignTarget, selectedOfficer);
      setReassignTarget(null);
      setSelectedOfficer('');
      fetchData();
    }
  };

  const handleForceEscalate = async (id: string) => {
    if (confirm(`Force escalate grievance ${id}?`)) {
      await api.forceEscalate(id);
      fetchData();
    }
  };

  const handleForceClose = async () => {
    if (closeTarget) {
      await api.forceClose(closeTarget, closeRemark);
      setCloseTarget(null);
      setCloseRemark('');
      fetchData();
    }
  };

  const handleChangePriority = async (id: string, newPriority: PriorityLevel) => {
    await api.updateGrievancePriority(id, newPriority);
    fetchData();
  };

  const getDeptName = (deptId: string) => {
    const d = departments.find((x: any) => x.id === deptId);
    return d ? d.name : deptId;
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'Critical': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'High': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Medium': return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Low': return 'bg-slate-50 text-slate-600 border-slate-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'Submitted': return 'bg-slate-100 text-slate-700';
      case 'AI Classified': return 'bg-violet-50 text-violet-700';
      case 'Assigned': return 'bg-blue-50 text-blue-700';
      case 'In Progress': return 'bg-amber-50 text-amber-700';
      case 'Resolved': return 'bg-emerald-50 text-emerald-700';
      case 'Closed': return 'bg-slate-100 text-slate-500';
      case 'Escalated': return 'bg-rose-50 text-rose-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  let filtered = grievances;
  if (filterDept) filtered = filtered.filter(g => g.departmentId === filterDept);
  if (filterStatus) filtered = filtered.filter(g => g.status === filterStatus);
  if (filterPriority) filtered = filtered.filter(g => g.priority === filterPriority);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(g =>
      g.id.toLowerCase().includes(q) ||
      g.title.toLowerCase().includes(q) ||
      g.description.toLowerCase().includes(q) ||
      (g.citizenName || '').toLowerCase().includes(q)
    );
  }

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-8 text-center text-xs text-slate-400">Loading Grievance Management...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-8 flex flex-col gap-6">

      {/* Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="text-orange-500" />
            Grievance Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">Reassign, escalate, close, or change priority of any grievance system-wide.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search ID, title, citizen..."
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:border-orange-500 focus:outline-none w-52"
            />
          </div>
          <select value={filterDept} onChange={e => setFilterDept(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none">
            <option value="">All Departments</option>
            {departments.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none">
            <option value="">All Statuses</option>
            {['Submitted', 'AI Classified', 'Assigned', 'In Progress', 'Resolved', 'Closed', 'Escalated'].map(s =>
              <option key={s} value={s}>{s}</option>
            )}
          </select>
          <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none">
            <option value="">All Priorities</option>
            {['Critical', 'High', 'Medium', 'Low'].map(p =>
              <option key={p} value={p}>{p}</option>
            )}
          </select>
        </div>
      </section>

      {/* Summary stats */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm text-center">
          <span className="text-[9px] uppercase font-bold text-slate-400">Total</span>
          <p className="text-xl font-black text-slate-900 mt-0.5">{grievances.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm text-center">
          <span className="text-[9px] uppercase font-bold text-slate-400">Active</span>
          <p className="text-xl font-black text-amber-500 mt-0.5">{grievances.filter(g => !['Resolved', 'Closed'].includes(g.status)).length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm text-center">
          <span className="text-[9px] uppercase font-bold text-slate-400">Resolved</span>
          <p className="text-xl font-black text-emerald-600 mt-0.5">{grievances.filter(g => g.status === 'Resolved' || g.status === 'Closed').length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm text-center">
          <span className="text-[9px] uppercase font-bold text-slate-400">Escalated</span>
          <p className="text-xl font-black text-rose-600 mt-0.5">{grievances.filter(g => g.status === 'Escalated').length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm text-center">
          <span className="text-[9px] uppercase font-bold text-slate-400">Filtered</span>
          <p className="text-xl font-black text-indigo-600 mt-0.5">{filtered.length}</p>
        </div>
      </section>

      {/* Grievances Table */}
      <section className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] uppercase font-bold text-slate-400 bg-slate-50/50">
                <th className="py-3 px-3">ID</th>
                <th className="py-3 px-3">Title</th>
                <th className="py-3 px-3">Citizen</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Officer</th>
                <th className="py-3 px-3">SLA</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400 text-xs">No grievances match filters.</td>
                </tr>
              ) : (
                filtered.map(g => {
                  const isOverdue = new Date(g.slaDeadline) < new Date() && !['Resolved', 'Closed'].includes(g.status);
                  return (
                    <tr key={g.id} className={`border-b border-slate-100 hover:bg-slate-50/50 transition-all ${isOverdue ? 'bg-rose-50/30' : ''}`}>
                      <td className="py-3 px-3 font-extrabold text-slate-900 font-mono text-[11px]">{g.id}</td>
                      <td className="py-3 px-3 text-slate-700 max-w-[180px] truncate" title={g.title}>{g.title}</td>
                      <td className="py-3 px-3 text-slate-600">{g.citizenName || g.citizenId}</td>
                      <td className="py-3 px-3 text-slate-600">{getDeptName(g.departmentId)}</td>
                      <td className="py-3 px-3">
                        <div className="relative group">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold border cursor-pointer ${getPriorityColor(g.priority)}`}>
                            {g.priority}
                          </span>
                          {/* Priority dropdown on hover */}
                          <div className="absolute left-0 top-5 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-20 hidden group-hover:block min-w-[90px]">
                            {(['Critical', 'High', 'Medium', 'Low'] as PriorityLevel[]).map(p => (
                              <button
                                key={p}
                                onClick={() => handleChangePriority(g.id, p)}
                                className={`w-full text-left px-3 py-1 text-[10px] font-bold hover:bg-slate-50 ${g.priority === p ? 'text-indigo-600' : 'text-slate-700'}`}
                              >
                                {p} {g.priority === p && '✓'}
                              </button>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${getStatusColor(g.status)}`}>
                          {g.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600">{g.assignedOfficerName || 'Unassigned'}</td>
                      <td className="py-3 px-3">
                        <span className={`flex items-center gap-1 text-[10px] font-semibold ${isOverdue ? 'text-rose-600' : 'text-slate-500'}`}>
                          <Clock size={10} />
                          {new Date(g.slaDeadline).toLocaleDateString()}
                          {isOverdue && <AlertTriangle size={10} className="text-rose-500" />}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Reassign */}
                          <button
                            onClick={() => { setReassignTarget(g.id); setSelectedOfficer(''); }}
                            className="p-1.5 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-500 hover:bg-indigo-100 transition-all"
                            title="Reassign officer"
                          >
                            <ArrowRightLeft size={12} />
                          </button>
                          {/* Escalate */}
                          {!['Escalated', 'Closed', 'Resolved'].includes(g.status) && (
                            <button
                              onClick={() => handleForceEscalate(g.id)}
                              className="p-1.5 rounded-lg border border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100 transition-all"
                              title="Force escalate"
                            >
                              <ChevronUp size={12} />
                            </button>
                          )}
                          {/* Force Close */}
                          {!['Closed'].includes(g.status) && (
                            <button
                              onClick={() => { setCloseTarget(g.id); setCloseRemark(''); }}
                              className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-500 hover:bg-rose-100 transition-all"
                              title="Force close"
                            >
                              <XCircle size={12} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Reassign Modal */}
      {reassignTarget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <ArrowRightLeft size={16} className="text-indigo-500" />
                Reassign Grievance {reassignTarget}
              </h3>
              <button onClick={() => setReassignTarget(null)} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Select New Officer</label>
                <select
                  value={selectedOfficer} onChange={e => setSelectedOfficer(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:border-indigo-500 focus:outline-none bg-white"
                >
                  <option value="">Choose an officer...</option>
                  {officers.filter(o => o.active).map(o => (
                    <option key={o.id} value={o.id}>{o.name} — {getDeptName(o.departmentId)} ({o.zone})</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleReassign}
                disabled={!selectedOfficer}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-50"
              >
                Confirm Reassignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Force Close Modal */}
      {closeTarget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <XCircle size={16} className="text-rose-500" />
                Force Close {closeTarget}
              </h3>
              <button onClick={() => setCloseTarget(null)} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Admin Remark</label>
                <textarea
                  value={closeRemark} onChange={e => setCloseRemark(e.target.value)}
                  placeholder="Reason for force-closing this grievance..."
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:border-rose-500 focus:outline-none resize-none"
                />
              </div>
              <button
                onClick={handleForceClose}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all"
              >
                Force Close Grievance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
