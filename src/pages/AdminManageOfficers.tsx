import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Officer } from '../types';
import { Language } from '../services/i18n';
import {
  Users, Plus, Trash2, ToggleLeft, ToggleRight,
  Search, Shield, Mail, Phone, MapPin, Building2, X
} from 'lucide-react';

interface AdminManageOfficersProps {
  lang: Language;
}

export const AdminManageOfficers: React.FC<AdminManageOfficersProps> = ({ lang }) => {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);

  // Add officer form state
  const [newName, setNewName] = useState('');
  const [newDept, setNewDept] = useState('');
  const [newZone, setNewZone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [offs, depts] = await Promise.all([api.getOfficers(), api.getDepartments()]);
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

  const handleToggle = async (id: string) => {
    await api.toggleOfficerActive(id);
    fetchData();
  };

  const handleRemove = async (id: string, name: string) => {
    if (confirm(`Remove officer "${name}" permanently? This cannot be undone.`)) {
      await api.removeOfficer(id);
      fetchData();
    }
  };

  const handleAddOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newDept || !newZone || !newEmail || !newPhone) return;
    await api.addOfficer({
      name: newName,
      departmentId: newDept,
      zone: newZone,
      email: newEmail,
      phone: newPhone
    });
    setShowAddModal(false);
    setNewName(''); setNewDept(''); setNewZone(''); setNewEmail(''); setNewPhone('');
    fetchData();
  };

  const getDeptName = (deptId: string) => {
    const d = departments.find((x: any) => x.id === deptId);
    return d ? d.name : deptId;
  };

  const filtered = officers.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    o.departmentId.toLowerCase().includes(search.toLowerCase()) ||
    o.zone.toLowerCase().includes(search.toLowerCase()) ||
    o.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-8 text-center text-xs text-slate-400">Loading Officer Management...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-8 flex flex-col gap-6">

      {/* Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="text-indigo-500" />
            Officer Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">View, add, activate/deactivate, and remove field officers.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search officers..."
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:border-indigo-500 focus:outline-none w-56"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
          >
            <Plus size={14} /> Add Officer
          </button>
        </div>
      </section>

      {/* Stats row */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[9px] uppercase font-bold text-slate-400">Total Officers</span>
          <p className="text-2xl font-black text-slate-900 mt-1 leading-none">{officers.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[9px] uppercase font-bold text-slate-400">Active</span>
          <p className="text-2xl font-black text-emerald-600 mt-1 leading-none">{officers.filter(o => o.active).length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[9px] uppercase font-bold text-slate-400">Inactive</span>
          <p className="text-2xl font-black text-rose-500 mt-1 leading-none">{officers.filter(o => !o.active).length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[9px] uppercase font-bold text-slate-400">Departments Covered</span>
          <p className="text-2xl font-black text-indigo-600 mt-1 leading-none">{new Set(officers.map(o => o.departmentId)).size}</p>
        </div>
      </section>

      {/* Officers Table */}
      <section className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] uppercase font-bold text-slate-400 bg-slate-50/50">
                <th className="py-3 px-4">Officer</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Zone</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">No officers found.</td>
                </tr>
              ) : (
                filtered.map(o => (
                  <tr key={o.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-all">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center">
                          <Shield size={14} className="text-indigo-500" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{o.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{o.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="flex items-center gap-1 text-slate-700">
                        <Building2 size={12} className="text-slate-400" />
                        {getDeptName(o.departmentId)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="flex items-center gap-1 text-slate-600">
                        <MapPin size={12} className="text-slate-400" />
                        {o.zone}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="flex items-center gap-1 text-slate-600">
                          <Mail size={10} className="text-slate-400" /> {o.email}
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <Phone size={10} className="text-slate-400" /> {o.phone}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {o.active ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          Active
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-50 text-rose-600 border border-rose-100">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggle(o.id)}
                          className={`p-1.5 rounded-lg border transition-all ${o.active
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100'
                            : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                            }`}
                          title={o.active ? 'Deactivate officer' : 'Activate officer'}
                        >
                          {o.active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                        </button>
                        <button
                          onClick={() => handleRemove(o.id, o.name)}
                          className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-500 hover:bg-rose-100 transition-all"
                          title="Remove officer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add Officer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Plus size={16} className="text-indigo-500" />
                Add New Officer
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddOfficer} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Full Name</label>
                <input
                  type="text" required value={newName} onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Priya Mehta"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Department</label>
                <select
                  required value={newDept} onChange={e => setNewDept(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:border-indigo-500 focus:outline-none bg-white"
                >
                  <option value="">Select Department</option>
                  {departments.map((d: any) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Zone / Ward</label>
                <input
                  type="text" required value={newZone} onChange={e => setNewZone(e.target.value)}
                  placeholder="e.g. Ward 7, Zone A"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Email</label>
                  <input
                    type="email" required value={newEmail} onChange={e => setNewEmail(e.target.value)}
                    placeholder="officer@jansetu.ai"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Phone</label>
                  <input
                    type="tel" required value={newPhone} onChange={e => setNewPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all mt-2"
              >
                Add Officer
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
