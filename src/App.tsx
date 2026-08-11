import React, { useState, useEffect } from 'react';
import { UserRole, Language, Notification } from './types';
import { translate } from './services/i18n';
import { api } from './services/api';
import { DemoBar } from './components/DemoBar';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { JanSetuBot } from './components/JanSetuBot';

// Pages
import { Home } from './pages/Home';
import { AIArchitecture } from './pages/AIArchitecture';
import { LodgeGrievance } from './pages/LodgeGrievance';
import { TrackGrievance } from './pages/TrackGrievance';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { OfficerDashboard } from './pages/OfficerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

import { Key, Landmark, ShieldCheck, UserCheck } from 'lucide-react';

const App: React.FC = () => {
  // Auth state (Default logged in for immediate demo bypass, login option available)
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [email, setEmail] = useState('demo.citizen@jansetu.ai');
  const [password, setPassword] = useState('Demo@123');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Core app state
  const [role, setRole] = useState<UserRole>('citizen');
  const [currentTab, setCurrentTab] = useState('home');
  const [lang, setLang] = useState<Language>('en');
  const [selectedGrievanceId, setSelectedGrievanceId] = useState<string>('');
  
  // Notification center
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userName, setUserName] = useState('Rahul Verma');

  const fetchNotifications = async () => {
    // Read from localStorage (api syncs updates to localStorage)
    const stored = localStorage.getItem('js_notifications');
    if (stored) {
      setNotifications(JSON.parse(stored));
    }
  };

  useEffect(() => {
    fetchNotifications();
    const handleUpdate = () => fetchNotifications();
    window.addEventListener('jansetu-data-updated', handleUpdate);
    return () => window.removeEventListener('jansetu-data-updated', handleUpdate);
  }, []);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'citizen') {
      setUserName('Rahul Verma');
      setCurrentTab('home');
    } else if (newRole === 'officer') {
      setUserName('Amit Sharma');
      setCurrentTab('dashboard');
    } else {
      setUserName('Rajesh Kumar');
      setCurrentTab('dashboard');
    }
    setSelectedGrievanceId('');
  };

  const handleNavigate = (tab: string, arg?: string) => {
    setCurrentTab(tab);
    if (tab === 'track' && arg) {
      setSelectedGrievanceId(arg);
    } else {
      setSelectedGrievanceId('');
    }
  };

  const handleMarkNotifRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
    setNotifications(updated);
    localStorage.setItem('js_notifications', JSON.stringify(updated));
  };

  const handleDemoLogin = async (demoRole: UserRole) => {
    setAuthLoading(true);
    setAuthError('');
    let demoEmail = 'demo.citizen@jansetu.ai';
    if (demoRole === 'officer') demoEmail = 'demo.officer@jansetu.ai';
    if (demoRole === 'admin') demoEmail = 'demo.admin@jansetu.ai';

    try {
      const response = await api.login(demoEmail, 'Demo@123');
      setIsLoggedIn(true);
      handleRoleChange(response.user.role as UserRole);
    } catch (e: any) {
      setAuthError(e.message || "Authentication error.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      const response = await api.login(email, password);
      setIsLoggedIn(true);
      handleRoleChange(response.user.role as UserRole);
    } catch (e: any) {
      setAuthError(e.message || "Failed to log in.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAuthError('');
  };

  // 1. SIGN IN SCREEN VIEW
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10 flex flex-col items-center">
          <div className="p-3 bg-white/10 rounded-2xl border border-white/20 mb-4 text-orange-400">
            <Landmark size={32} />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">JanSetu-AI</h2>
          <p className="text-sm font-semibold tracking-wider text-orange-400 uppercase mt-1">
            Grievance Redressal Portal
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <div className="bg-slate-900 border border-slate-800 py-8 px-4 shadow-premium rounded-3xl sm:px-10 flex flex-col gap-6">
            
            {/* Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. demo.citizen@jansetu.ai"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-orange-500"
                />
              </div>

              {authError && (
                <p className="text-rose-500 text-xs font-semibold leading-relaxed">
                  ⚠️ {authError}
                </p>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl shadow-premium hover-lift text-sm transition-all"
              >
                {authLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="relative flex items-center justify-center my-2">
              <span className="absolute w-full h-[1px] bg-slate-800"></span>
              <span className="relative bg-slate-900 px-3 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                1-Click Quick Demo Login
              </span>
            </div>

            {/* Quick Demo select buttons */}
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleDemoLogin('citizen')}
                className="bg-slate-950 border border-slate-800 hover:border-orange-500 py-2.5 rounded-xl font-bold text-[10px] text-slate-300 hover:text-white flex flex-col items-center gap-1.5 transition-all"
              >
                <UserCheck size={14} className="text-orange-400" />
                Citizen
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('officer')}
                className="bg-slate-950 border border-slate-800 hover:border-indigo-500 py-2.5 rounded-xl font-bold text-[10px] text-slate-300 hover:text-white flex flex-col items-center gap-1.5 transition-all"
              >
                <ShieldCheck size={14} className="text-indigo-400" />
                Officer
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="bg-slate-950 border border-slate-800 hover:border-emerald-500 py-2.5 rounded-xl font-bold text-[10px] text-slate-300 hover:text-white flex flex-col items-center gap-1.5 transition-all"
              >
                <Key size={14} className="text-emerald-400" />
                Admin
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // 2. MAIN APPLICATION WORKSPACE
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans">
      
      {/* Persistent Demo mode switcher */}
      <DemoBar 
        currentRole={role} 
        onRoleChange={handleRoleChange} 
        onGrievanceAdded={fetchNotifications}
      />

      {/* Main Government styled Navbar */}
      <Navbar 
        currentTab={currentTab}
        onTabChange={handleNavigate}
        lang={lang}
        onLangChange={setLang}
        role={role}
        notifications={notifications}
        onMarkNotifRead={handleMarkNotifRead}
        userName={userName}
      />

      {/* Primary Page views router */}
      <main className="flex-1 bg-slate-50">
        
        {/* Citizen Page Views */}
        {role === 'citizen' && (
          <>
            {currentTab === 'home' && (
              <Home lang={lang} onNavigate={handleNavigate} />
            )}
            {currentTab === 'lodge' && (
              <LodgeGrievance lang={lang} onNavigate={handleNavigate} />
            )}
            {currentTab === 'track' && (
              <TrackGrievance 
                lang={lang} 
                preselectedGrievanceId={selectedGrievanceId} 
                onNavigate={handleNavigate}
              />
            )}
            {currentTab === 'dashboard' && (
              <CitizenDashboard lang={lang} onNavigate={handleNavigate} userId="usr_citizen" />
            )}
            {currentTab === 'ai-architecture' && (
              <AIArchitecture />
            )}
          </>
        )}

        {/* Officer View */}
        {role === 'officer' && (
          <>
            {currentTab === 'dashboard' && (
              <OfficerDashboard lang={lang} departmentId="municipal" />
            )}
            {currentTab === 'ai-architecture' && (
              <AIArchitecture />
            )}
          </>
        )}

        {/* Admin View */}
        {role === 'admin' && (
          <>
            {currentTab === 'dashboard' && (
              <AdminDashboard lang={lang} />
            )}
            {currentTab === 'ai-architecture' && (
              <AIArchitecture />
            )}
          </>
        )}

      </main>

      {/* Floating AI Chatbot widget */}
      <JanSetuBot lang={lang} onNavigate={handleNavigate} />

      {/* Standard Footer */}
      <Footer />
      
    </div>
  );
};

export default App;
