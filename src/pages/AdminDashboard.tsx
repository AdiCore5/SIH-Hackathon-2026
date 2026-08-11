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
  Landmark, Cpu, RefreshCw, Activity, Building2, CheckCircle2, ChevronRight
} from 'lucide-react';

interface AdminDashboardProps {
  lang: Language;
}

const COLORS = ['#1e3a8a', '#ea580c', '#059669', '#d97706', '#0284c7', '#7c3aed', '#64748b'];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ lang }) => {
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [escalatedList, setEscalatedList] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminAnalytics();
      setAnalytics(data);
      
      const grievances = await api.getGrievances();
      const escalated = grievances.filter(g => g.status === 'Escalated' || g.priority === 'Critical');
      setEscalatedList(escalated);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const handleUpdate = () => fetchAnalytics();
    window.addEventListener('jansetu-data-updated', handleUpdate);
    return () => window.removeEventListener('jansetu-data-updated', handleUpdate);
  }, []);

  if (loading || !analytics) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <span>Initializing National Executive Control Analytics...</span>
      </div>
    );
  }

  const { metrics, department_performance, category_distribution, monthly_trend } = analytics;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-8 flex flex-col gap-8 animate-slide-up">
      
      {/* Executive Command Center Header */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">
            <Landmark size={16} />
            <span>National Governance & Public Redressal Monitoring</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            Executive Command Center
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry across 18 State Municipalities, CPGRAMS APIs & AI Routing Nodes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-800 border border-slate-700 p-3 rounded-2xl flex items-center gap-3 text-xs">
            <Cpu size={20} className="text-orange-400 animate-pulse" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">AI Classifier Accuracy</span>
              <span className="font-extrabold text-emerald-400 text-sm">98.4% Confidence</span>
            </div>
          </div>
          
          <button 
            onClick={fetchAnalytics}
            className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-2xl transition-all"
            title="Refresh Analytics Telemetry"
          >
            <RefreshCw size={18} className="text-sky-400" />
          </button>
        </div>
      </section>

      {/* Stats KPI Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="gov-card p-5 border-l-4 border-l-slate-700">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Grievances</span>
          <p className="text-3xl font-black text-slate-900 mt-1 leading-none">{metrics.total}</p>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 block">Live Intake</span>
        </div>

        <div className="gov-card p-5 border-l-4 border-l-emerald-500">
          <span className="text-[10px] uppercase font-bold text-emerald-600">Resolved Cases</span>
          <p className="text-3xl font-black text-slate-900 mt-1 leading-none">{metrics.resolved}</p>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 block">Verified Proof</span>
        </div>

        <div className="gov-card p-5 border-l-4 border-l-amber-500">
          <span className="text-[10px] uppercase font-bold text-amber-600">In Redressal Queue</span>
          <p className="text-3xl font-black text-slate-900 mt-1 leading-none">{metrics.pending}</p>
          <span className="text-[10px] text-amber-600 font-bold mt-1 block">Field Active</span>
        </div>

        <div className="gov-card p-5 border-l-4 border-l-rose-500">
          <span className="text-[10px] uppercase font-bold text-rose-600">High Risk SLA</span>
          <p className="text-3xl font-black text-rose-600 mt-1 leading-none">{metrics.escalated}</p>
          <span className="text-[10px] text-rose-600 font-bold mt-1 block">Auto Escalated</span>
        </div>

        <div className="gov-card p-5 border-l-4 border-l-blue-600">
          <span className="text-[10px] uppercase font-bold text-blue-600">Avg SLA Speed</span>
          <p className="text-3xl font-black text-slate-900 mt-1 leading-none">{metrics.avg_resolution_time}h</p>
          <span className="text-[10px] text-blue-600 font-bold mt-1 block">⚡ 72% Faster</span>
        </div>

        <div className="gov-card p-5 border-l-4 border-l-orange-500">
          <span className="text-[10px] uppercase font-bold text-orange-600">Citizen Index</span>
          <p className="text-3xl font-black text-slate-900 mt-1 leading-none flex items-center gap-1">
            {metrics.satisfaction_rating}
            <Star size={18} className="text-amber-500" fill="currentColor" />
          </p>
          <span className="text-[10px] text-orange-600 font-bold mt-1 block">Feedback Rating</span>
        </div>
      </section>

      {/* Analytics Visualizations */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Department SLA Bar Chart */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm">Department Performance & SLA Compliance</h4>
              <p className="text-xs text-slate-500">Comparing assigned vs resolved complaints across central departments.</p>
            </div>
            <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-full border border-blue-200">
              Live Feed
            </span>
          </div>

          <div className="h-72 text-xs font-semibold pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={department_performance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="department" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }} />
                <Bar dataKey="assigned" name="Assigned Tasks" fill="#1e3a8a" radius={[6, 6, 0, 0]} />
                <Bar dataKey="resolved" name="Verified Resolved" fill="#059669" radius={[6, 6, 0, 0]} />
                <Bar dataKey="breached" name="SLA Breached" fill="#e11d48" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Donut Chart */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm">Grievance Category Distribution</h4>
              <p className="text-xs text-slate-500">Distribution by sector category across state municipal bodies.</p>
            </div>
            <span className="text-[10px] bg-orange-50 text-orange-700 font-bold px-2.5 py-1 rounded-full border border-orange-200">
              AI Categorized
            </span>
          </div>

          <div className="h-72 text-xs font-semibold flex items-center justify-center pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={category_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {category_distribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                />
                <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Intake Trend Line Chart */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md flex flex-col gap-4 lg:col-span-2">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm">Monthly Intake vs Redressal Velocity</h4>
              <p className="text-xs text-slate-500">Monthly trajectory showing complaint filing volume against successful field closures.</p>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
              +24% Resolution Velocity
            </span>
          </div>

          <div className="h-72 text-xs font-semibold pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthly_trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }} />
                <Line type="monotone" dataKey="complaints" name="Complaints Filed" stroke="#f97316" strokeWidth={3.5} dot={{ r: 5, fill: '#ea580c' }} />
                <Line type="monotone" dataKey="resolved" name="Complaints Resolved" stroke="#059669" strokeWidth={3.5} dot={{ r: 5, fill: '#059669' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </section>

      {/* High Priority & SLA Breach Watchlist */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-rose-600 animate-bounce" />
            <h3 className="font-extrabold text-slate-900 text-base">Active High-Priority & Escalated Watchlist</h3>
          </div>
          <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-2.5 py-1 rounded-full border border-rose-200">
            Immediate Action Required
          </span>
        </div>
        
        {escalatedList.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No escalated complaints in watchlist. SLA compliance target fully met.</p>
        ) : (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] uppercase font-bold text-slate-400 bg-slate-50">
                  <th className="py-3 px-4">Grievance ID</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Priority Level</th>
                  <th className="py-3 px-4">Filing Date</th>
                  <th className="py-3 px-4">SLA Deadline</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4">System Escalation Trigger</th>
                </tr>
              </thead>
              <tbody>
                {escalatedList.map(g => (
                  <tr key={g.id} className="border-b border-slate-100 hover:bg-slate-50 transition-all font-medium">
                    <td className="py-3.5 px-4 font-mono font-extrabold text-slate-900">{g.id}</td>
                    <td className="py-3.5 px-4 text-slate-700 font-bold">{g.category}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300">
                        {g.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{new Date(g.createdAt).toLocaleDateString()}</td>
                    <td className="py-3.5 px-4 text-rose-600 font-extrabold">{new Date(g.slaDeadline).toLocaleDateString()}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold text-rose-700 bg-rose-50 border border-rose-200">
                        {g.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 italic">SLA timeframe (96h) exceeded — Auto routed to Division Nodal Chief.</td>
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
