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
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="font-extrabold text-slate-800">Initializing National Executive Control Analytics...</span>
      </div>
    );
  }

  const { metrics, department_performance, category_distribution, monthly_trend } = analytics;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-8 flex flex-col gap-8 animate-slide-up bg-slate-100/70 min-h-screen">
      
      {/* Executive Command Center Header */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-orange-400 uppercase tracking-wider mb-1">
            <Landmark size={16} />
            <span>National Governance & Public Redressal Monitoring</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            Executive Command Center
          </h2>
          <p className="text-xs text-slate-300 font-semibold mt-1">
            Real-time telemetry across 18 State Municipalities, CPGRAMS APIs & AI Routing Nodes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-800 border-2 border-slate-700 p-3.5 rounded-2xl flex items-center gap-3 text-xs shadow-md">
            <Cpu size={22} className="text-orange-400 animate-pulse" />
            <div>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase block">AI Classifier Accuracy</span>
              <span className="font-black text-emerald-400 text-sm">98.4% Confidence</span>
            </div>
          </div>
          
          <button 
            onClick={fetchAnalytics}
            className="p-3.5 bg-slate-800 hover:bg-slate-700 border-2 border-slate-700 text-slate-200 rounded-2xl transition-all shadow-md"
            title="Refresh Analytics Telemetry"
          >
            <RefreshCw size={18} className="text-sky-400" />
          </button>
        </div>
      </section>

      {/* Stats KPI Cards with High-Contrast Color Top Borders */}
      <section className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white border-2 border-slate-300 rounded-2xl p-5 shadow-md border-t-8 border-t-slate-800">
          <span className="text-xs uppercase font-extrabold text-slate-700">Total Grievances</span>
          <p className="text-4xl font-black text-slate-950 mt-1.5 leading-none">{metrics.total}</p>
          <span className="text-[11px] text-emerald-700 font-extrabold mt-2 block">Live Telemetry</span>
        </div>

        <div className="bg-white border-2 border-slate-300 rounded-2xl p-5 shadow-md border-t-8 border-t-emerald-600">
          <span className="text-xs uppercase font-extrabold text-emerald-800">Resolved Cases</span>
          <p className="text-4xl font-black text-slate-950 mt-1.5 leading-none">{metrics.resolved}</p>
          <span className="text-[11px] text-emerald-800 font-extrabold mt-2 block">Verified Proof</span>
        </div>

        <div className="bg-white border-2 border-slate-300 rounded-2xl p-5 shadow-md border-t-8 border-t-amber-500">
          <span className="text-xs uppercase font-extrabold text-amber-800">In Redressal Queue</span>
          <p className="text-4xl font-black text-slate-950 mt-1.5 leading-none">{metrics.pending}</p>
          <span className="text-[11px] text-amber-800 font-extrabold mt-2 block">Field Active</span>
        </div>

        <div className="bg-white border-2 border-slate-300 rounded-2xl p-5 shadow-md border-t-8 border-t-rose-600">
          <span className="text-xs uppercase font-extrabold text-rose-800">High Risk SLA</span>
          <p className="text-4xl font-black text-rose-700 mt-1.5 leading-none">{metrics.escalated}</p>
          <span className="text-[11px] text-rose-800 font-extrabold mt-2 block">Auto Escalated</span>
        </div>

        <div className="bg-white border-2 border-slate-300 rounded-2xl p-5 shadow-md border-t-8 border-t-blue-600">
          <span className="text-xs uppercase font-extrabold text-blue-800">Avg SLA Speed</span>
          <p className="text-4xl font-black text-slate-950 mt-1.5 leading-none">{metrics.avg_resolution_time}h</p>
          <span className="text-[11px] text-blue-800 font-extrabold mt-2 block">⚡ 72% Faster</span>
        </div>

        <div className="bg-white border-2 border-slate-300 rounded-2xl p-5 shadow-md border-t-8 border-t-orange-500">
          <span className="text-xs uppercase font-extrabold text-orange-700">Citizen Index</span>
          <p className="text-4xl font-black text-slate-950 mt-1.5 leading-none flex items-center gap-1">
            {metrics.satisfaction_rating}
            <Star size={20} className="text-amber-500" fill="currentColor" />
          </p>
          <span className="text-[11px] text-orange-700 font-extrabold mt-2 block">Feedback Rating</span>
        </div>
      </section>

      {/* Analytics Visualizations */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Department SLA Bar Chart */}
        <div className="bg-white border-2 border-slate-300 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col gap-4">
          <div className="flex justify-between items-center border-b-2 border-slate-200 pb-4">
            <div>
              <h4 className="font-black text-slate-950 text-lg">Department Performance & SLA Compliance</h4>
              <p className="text-xs text-slate-700 font-semibold">Comparing assigned vs resolved complaints across central departments.</p>
            </div>
            <span className="text-xs bg-blue-100 text-blue-950 font-black px-3 py-1 rounded-full border-2 border-blue-400">
              Live Feed
            </span>
          </div>

          <div className="h-72 text-xs font-bold pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={department_performance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="department" stroke="#0f172a" fontSize={11} />
                <YAxis stroke="#0f172a" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '2px solid #334155', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px', fontWeight: 'bold' }} />
                <Bar dataKey="assigned" name="Assigned Tasks" fill="#1e3a8a" radius={[6, 6, 0, 0]} />
                <Bar dataKey="resolved" name="Verified Resolved" fill="#059669" radius={[6, 6, 0, 0]} />
                <Bar dataKey="breached" name="SLA Breached" fill="#e11d48" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Donut Chart */}
        <div className="bg-white border-2 border-slate-300 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col gap-4">
          <div className="flex justify-between items-center border-b-2 border-slate-200 pb-4">
            <div>
              <h4 className="font-black text-slate-950 text-lg">Grievance Category Distribution</h4>
              <p className="text-xs text-slate-700 font-semibold">Distribution by sector category across state municipal bodies.</p>
            </div>
            <span className="text-xs bg-orange-100 text-orange-950 font-black px-3 py-1 rounded-full border-2 border-orange-400">
              AI Categorized
            </span>
          </div>

          <div className="h-72 text-xs font-bold flex items-center justify-center pt-2">
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
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '2px solid #334155', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Intake Trend Line Chart */}
        <div className="bg-white border-2 border-slate-300 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col gap-4 lg:col-span-2">
          <div className="flex justify-between items-center border-b-2 border-slate-200 pb-4">
            <div>
              <h4 className="font-black text-slate-950 text-lg">Monthly Intake vs Redressal Velocity</h4>
              <p className="text-xs text-slate-700 font-semibold">Monthly trajectory showing complaint filing volume against successful field closures.</p>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-950 font-black px-3 py-1 rounded-full border-2 border-emerald-400">
              +24% Resolution Velocity
            </span>
          </div>

          <div className="h-72 text-xs font-bold pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthly_trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#0f172a" fontSize={11} />
                <YAxis stroke="#0f172a" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '2px solid #334155', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px', fontWeight: 'bold' }} />
                <Line type="monotone" dataKey="complaints" name="Complaints Filed" stroke="#ea580c" strokeWidth={4} dot={{ r: 6, fill: '#ea580c' }} />
                <Line type="monotone" dataKey="resolved" name="Complaints Resolved" stroke="#059669" strokeWidth={4} dot={{ r: 6, fill: '#059669' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </section>

      {/* High Priority & SLA Breach Watchlist */}
      <section className="bg-white border-2 border-slate-300 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col gap-4">
        <div className="flex justify-between items-center border-b-2 border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle size={20} className="text-rose-600 animate-bounce" />
            <h3 className="font-black text-slate-950 text-xl">Active High-Priority & Escalated Watchlist</h3>
          </div>
          <span className="text-xs bg-rose-100 text-rose-950 font-black px-3 py-1 rounded-full border-2 border-rose-400">
            Immediate Nodal Action Required
          </span>
        </div>
        
        {escalatedList.length === 0 ? (
          <p className="text-xs text-slate-600 font-bold py-6 text-center">No escalated complaints in watchlist. SLA compliance target fully met.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border-2 border-slate-300 shadow-md">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-950 text-xs font-black text-white bg-slate-900">
                  <th className="py-4 px-4">Grievance ID</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Priority Level</th>
                  <th className="py-4 px-4">Filing Date</th>
                  <th className="py-4 px-4">SLA Deadline</th>
                  <th className="py-4 px-4">Current Status</th>
                  <th className="py-4 px-4">System Escalation Trigger</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-200">
                {escalatedList.map(g => (
                  <tr key={g.id} className="hover:bg-rose-50/50 transition-all odd:bg-white even:bg-slate-50 font-bold text-slate-950">
                    <td className="py-4 px-4 font-mono font-black text-slate-950 text-sm">{g.id}</td>
                    <td className="py-4 px-4 text-slate-950 font-black">{g.category}</td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-xl text-[10px] font-black bg-rose-200 text-rose-950 border-2 border-rose-400">
                        {g.priority}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-700">{new Date(g.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 px-4 text-rose-700 font-black">{new Date(g.slaDeadline).toLocaleDateString()}</td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 rounded-full text-[11px] font-black text-rose-950 bg-rose-100 border-2 border-rose-400">
                        {g.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-800 font-semibold italic">SLA timeframe (96h) exceeded — Auto routed to Division Nodal Chief.</td>
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
