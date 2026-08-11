import React, { useState, useEffect } from 'react';
import { translate, Language } from '../services/i18n';
import { api } from '../services/api';
import { Grievance } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  ShieldCheck, AlertTriangle, Clock, Star, 
  Landmark, Database, RefreshCw, Layers 
} from 'lucide-react';

interface AdminDashboardProps {
  lang: Language;
}

const COLORS = ['#1e3a8a', '#f97316', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#64748b'];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ lang }) => {
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [escalatedList, setEscalatedList] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminAnalytics();
      setAnalytics(data);
      
      // Fetch escalated cases
      const grievances = await api.getGrievances();
      const escalated = grievances.filter(g => g.status === 'Escalated');
      setEscalatedList(escalated);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    // Setup listener for real-time reactivity
    const handleUpdate = () => fetchAnalytics();
    window.addEventListener('jansetu-data-updated', handleUpdate);
    return () => window.removeEventListener('jansetu-data-updated', handleUpdate);
  }, []);

  if (loading || !analytics) {
    return <div className="max-w-7xl mx-auto px-4 py-8 text-center text-xs text-slate-400">Loading Command Center...</div>;
  }

  const { metrics, department_performance, category_distribution, monthly_trend } = analytics;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-8 flex flex-col gap-8">
      
      {/* Title Header */}
      <section className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Landmark className="text-orange-500" />
            JanSetu AI Command Center
          </h2>
          <p className="text-xs text-slate-500 mt-1">National performance analytics monitoring dashboard.</p>
        </div>
      </section>

      {/* Stats KPI Dashboard Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[9px] uppercase font-bold text-slate-400">Total Grievances</span>
          <p className="text-2xl font-black text-slate-900 mt-1 leading-none">{metrics.total}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[9px] uppercase font-bold text-slate-400">Resolved Cases</span>
          <p className="text-2xl font-black text-emerald-600 mt-1 leading-none">{metrics.resolved}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[9px] uppercase font-bold text-slate-400">Pending Actions</span>
          <p className="text-2xl font-black text-amber-500 mt-1 leading-none">{metrics.pending}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[9px] uppercase font-bold text-slate-400">SLA Escalations</span>
          <p className="text-2xl font-black text-rose-600 mt-1 leading-none">{metrics.escalated}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[9px] uppercase font-bold text-slate-400">Avg Resolution</span>
          <p className="text-2xl font-black text-indigo-600 mt-1 leading-none">{metrics.avg_resolution_time} Days</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[9px] uppercase font-bold text-slate-400">Satisfaction</span>
          <p className="text-2xl font-black text-orange-500 mt-1 leading-none flex items-center gap-1">
            {metrics.satisfaction_rating}
            <Star size={16} className="text-yellow-400" fill="currentColor" />
          </p>
        </div>
      </section>

      {/* Recharts Analytics graphs */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Department Performance Bar Chart */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
          <h4 className="font-bold text-slate-900 text-sm">Department Performance (SLA Compliance)</h4>
          <div className="h-64 text-xs font-semibold">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={department_performance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="department" stroke="#94a3b8" fontSize={9} />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Legend />
                <Bar dataKey="assigned" name="Assigned" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" name="Resolved" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="breached" name="Breached" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category breakdown pie/donut chart */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
          <h4 className="font-bold text-slate-900 text-sm">Grievance Categories Distribution</h4>
          <div className="h-64 text-xs font-semibold flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={category_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {category_distribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trend line chart */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4 lg:col-span-2">
          <h4 className="font-bold text-slate-900 text-sm">Monthly Grievance Intake & Resolution Trend</h4>
          <div className="h-64 text-xs font-semibold">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthly_trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="complaints" name="Complaints Filed" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="resolved" name="Complaints Resolved" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </section>

      {/* Escalated list queue */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center gap-1.5">
          <AlertTriangle className="text-rose-500 animate-pulse" />
          Active SLA Breaches & Escalated Queue
        </h3>
        
        {escalatedList.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No escalated complaints in queue. Standard SLA parameters compliant.</p>
        ) : (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] uppercase font-bold text-slate-400 bg-slate-50/50">
                  <th className="py-2.5 px-3">Grievance ID</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Date Filed</th>
                  <th className="py-2.5 px-3">Deadline</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Reason</th>
                </tr>
              </thead>
              <tbody>
                {escalatedList.map(g => (
                  <tr key={g.id} className="border-b border-slate-100 hover:bg-slate-50 font-medium">
                    <td className="py-3 px-3 font-extrabold text-slate-900">{g.id}</td>
                    <td className="py-3 px-3 text-slate-700">{g.category}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-50 text-rose-700">
                        {g.priority}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">{new Date(g.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-3 text-rose-600 font-semibold">{new Date(g.slaDeadline).toLocaleDateString()}</td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold text-rose-600 bg-rose-50 border border-rose-100">
                        {g.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 italic">Resolution deadline exceeded.</td>
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
