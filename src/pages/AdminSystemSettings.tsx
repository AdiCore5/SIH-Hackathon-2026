import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { GrievanceUpdate } from '../types';
import { Language } from '../services/i18n';
import {
  Settings, Clock, Download, RefreshCw, Shield,
  Save, History, FileDown, AlertTriangle, CheckCircle
} from 'lucide-react';

interface AdminSystemSettingsProps {
  lang: Language;
  onDataReset?: () => void;
}

export const AdminSystemSettings: React.FC<AdminSystemSettingsProps> = ({ lang, onDataReset }) => {
  const [departments, setDepartments] = useState<any[]>([]);
  const [auditLog, setAuditLog] = useState<GrievanceUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editedSLAs, setEditedSLAs] = useState<Record<string, number>>({});
  const [savingDept, setSavingDept] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [activeTab, setActiveTab] = useState<'sla' | 'audit' | 'export'>('sla');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [depts, logs] = await Promise.all([api.getDepartments(), api.getAuditLog()]);
      setDepartments(depts);
      setAuditLog(logs);
      const slaMap: Record<string, number> = {};
      depts.forEach((d: any) => { slaMap[d.id] = d.slaHours; });
      setEditedSLAs(slaMap);
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

  const handleSaveSLA = async (deptId: string) => {
    setSavingDept(deptId);
    await api.updateDeptSLA(deptId, editedSLAs[deptId]);
    setTimeout(() => setSavingDept(null), 800);
    fetchData();
  };

  const handleReset = async () => {
    if (confirm('Reset ALL demo data to defaults? This will clear all grievances, updates, feedback, and notifications.')) {
      setIsResetting(true);
      await api.resetSystem();
      onDataReset();
      setIsResetting(false);
      fetchData();
    }
  };

  const handleExport = async () => {
    const jsonData = await api.exportGrievances();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jansetu_grievances_export_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-8 text-center text-xs text-slate-400">Loading System Settings...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-8 flex flex-col gap-6">

      {/* Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="text-emerald-500" />
            System Settings
          </h2>
          <p className="text-xs text-slate-500 mt-1">Configure SLA policies, view audit logs, export data, and reset system.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
          >
            <FileDown size={14} /> Export Data
          </button>
          <button
            onClick={handleReset}
            disabled={isResetting}
            className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
          >
            <RefreshCw size={14} className={isResetting ? 'animate-spin' : ''} /> Reset All Data
          </button>
        </div>
      </section>

      {/* Tab switcher */}
      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 w-fit">
        <button
          onClick={() => setActiveTab('sla')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'sla' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <span className="flex items-center gap-1.5"><Clock size={12} /> SLA Configuration</span>
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'audit' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <span className="flex items-center gap-1.5"><History size={12} /> Audit Log</span>
        </button>
        <button
          onClick={() => setActiveTab('export')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'export' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <span className="flex items-center gap-1.5"><Download size={12} /> Data & Export</span>
        </button>
      </div>

      {/* SLA Configuration Tab */}
      {activeTab === 'sla' && (
        <section className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Clock size={16} className="text-emerald-500" />
              Department SLA Resolution Timers
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Configure expected resolution time (in hours) for each department.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] uppercase font-bold text-slate-400 bg-slate-50/30">
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Current SLA (Hours)</th>
                  <th className="py-3 px-4">New SLA (Hours)</th>
                  <th className="py-3 px-4 text-right">Save</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((d: any) => (
                  <tr key={d.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-all">
                    <td className="py-3 px-4 font-bold text-slate-900">{d.name}</td>
                    <td className="py-3 px-4 text-slate-500">{d.category}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold border border-emerald-100">
                        {d.slaHours}h
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        min={1}
                        max={720}
                        value={editedSLAs[d.id] || d.slaHours}
                        onChange={e => setEditedSLAs({ ...editedSLAs, [d.id]: parseInt(e.target.value) || d.slaHours })}
                        className="w-20 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-center focus:border-emerald-500 focus:outline-none"
                      />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleSaveSLA(d.id)}
                        disabled={editedSLAs[d.id] === d.slaHours}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ml-auto ${
                          savingDept === d.id
                            ? 'bg-emerald-100 text-emerald-600 border border-emerald-200'
                            : editedSLAs[d.id] !== d.slaHours
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                              : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                        }`}
                      >
                        {savingDept === d.id ? <><CheckCircle size={10} /> Saved!</> : <><Save size={10} /> Save</>}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Audit Log Tab */}
      {activeTab === 'audit' && (
        <section className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <History size={16} className="text-indigo-500" />
              System Audit Log
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">All status changes and updates across all grievances, sorted newest first.</p>
          </div>
          <div className="max-h-[500px] overflow-y-auto">
            {auditLog.length === 0 ? (
              <p className="py-8 text-center text-slate-400 text-xs">No audit log entries.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {auditLog.slice(0, 50).map((entry, idx) => (
                  <div key={entry.id || idx} className="px-6 py-3 hover:bg-slate-50/50 transition-all flex items-start gap-3">
                    <div className="mt-0.5">
                      <div className="h-7 w-7 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center">
                        <Shield size={12} className="text-indigo-500" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-[11px] text-slate-900 font-mono">{entry.grievanceId}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          entry.status === 'Escalated' ? 'bg-rose-50 text-rose-600' :
                          entry.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' :
                          entry.status === 'Closed' ? 'bg-slate-100 text-slate-500' :
                          'bg-blue-50 text-blue-600'
                        }`}>
                          {entry.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{entry.remark}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[9px] text-slate-400 font-semibold">By: {entry.updatedBy}</span>
                        <span className="text-[9px] text-slate-400">{new Date(entry.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Data & Export Tab */}
      {activeTab === 'export' && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Export Card */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center">
                <FileDown size={20} className="text-indigo-500" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Export Grievances</h4>
                <p className="text-[10px] text-slate-500">Download all grievance data as JSON.</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Exports a complete dump of all grievance records including metadata, AI classifications,
              officer assignments, SLA deadlines, and status history. Useful for auditing, reporting, or migration.
            </p>
            <button
              onClick={handleExport}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
            >
              <Download size={14} /> Download JSON Export
            </button>
          </div>

          {/* Reset Card */}
          <div className="bg-white border border-rose-200 rounded-3xl shadow-sm p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center">
                <RefreshCw size={20} className="text-rose-500" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Reset Demo Data</h4>
                <p className="text-[10px] text-slate-500">Restore system to factory defaults.</p>
              </div>
            </div>
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 flex items-start gap-2">
              <AlertTriangle size={14} className="text-rose-500 mt-0.5 shrink-0" />
              <p className="text-[10px] text-rose-700 font-medium leading-relaxed">
                This will permanently delete all current grievances, status updates, feedback, and notifications.
                The system will be restored with the 5 seed demo complaints.
              </p>
            </div>
            <button
              onClick={handleReset}
              disabled={isResetting}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <RefreshCw size={14} className={isResetting ? 'animate-spin' : ''} />
              {isResetting ? 'Resetting...' : 'Reset All System Data'}
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
