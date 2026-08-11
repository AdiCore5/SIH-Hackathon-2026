import React, { useState, useEffect } from 'react';
import { UserRole, Notification } from './types';
import { translate, Language } from './services/i18n';
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('demo.citizen@jansetu.ai');
  const [password, setPassword] = useState('Demo@123');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Core app state
  const [role, setRole] = useState<UserRole>('citizen');
  const [currentTab, setCurrentTab] = useState('home');
  const [lang, setLang] = useState<Language>('en');
  const [selectedGrievanceId, setSelectedGrievanceId] = useState<string>('');
  const [fontSize, setFontSize] = useState<number>(1.0);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  
  // Notification center
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userName, setUserName] = useState('Rahul Verma');

  const [loginTab, setLoginTab] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const playVoiceGuide = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      let text = "To log in easily, first type your ten-digit mobile phone number in the box. Then, click the green button to receive a secret four-digit code via text message. Once you receive the code, type it in the OTP box, and click log in. You do not need any password.";
      if (lang === 'hi') {
        text = "आसान लॉगिन के लिए, सबसे पहले बॉक्स में अपना दस अंकों का मोबाइल नंबर डालें। फिर, एसएमएस द्वारा एक गुप्त चार अंकों का कोड प्राप्त करने के लिए हरे बटन पर क्लिक करें। कोड प्राप्त होने पर, इसे ओटीपी बॉक्स में लिखें और लॉगिन पर क्लिक करें। आपको किसी पासवर्ड की आवश्यकता नहीं है।";
      } else if (lang === 'gu') {
        text = "સરળ લોગીન માટે, સૌ પ્રથમ બોક્સમાં તમારો દસ અંકનો મોબાઈલ નંબર દાખલ કરો. ત્યાર પછી, એસએમએસ દ્વારા ગુપ્ત ચાર અંકનો કોડ મેળવવા માટે લીલા બટન પર ક્લિક કરો. કોડ મળ્યા પછી, તેને ઓટીપી બોક્સમાં લખો અને લોગીન પર ક્લિક કરો. કોઈ પાસવર્ડની જરૂર નથી.";
      }
      const utterance = new SpeechSynthesisUtterance(text);
      if (lang === 'hi') utterance.lang = 'hi-IN';
      else if (lang === 'gu') utterance.lang = 'gu-IN';
      else utterance.lang = 'en-IN';
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Voice guide is not supported in this browser.");
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setAuthError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setOtpLoading(true);
    setAuthError('');
    try {
      await api.sendOTP(phone);
      setOtpSent(true);
      alert('Demo Code Sent! Enter 1234 to verify.');
    } catch (err: any) {
      setAuthError(err.message || "Failed to send OTP.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      const response = await api.verifyOTP(phone, otp);
      setIsLoggedIn(true);
      handleRoleChange(response.user.role as UserRole);
    } catch (err: any) {
      setAuthError(err.message || "Invalid OTP code.");
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    document.body.style.fontSize = fontSize === 1.0 ? '' : `${fontSize}em`;
  }, [fontSize]);

  useEffect(() => {
    const styleId = 'jansetu-hc-style';
    let styleEl = document.getElementById(styleId);
    if (highContrast) {
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = styleId;
        styleEl.innerHTML = `
          .high-contrast, .high-contrast body, .high-contrast main, .high-contrast header, .high-contrast footer, .high-contrast div, .high-contrast section, .high-contrast table, .high-contrast tr, .high-contrast td, .high-contrast th, .high-contrast h1, .high-contrast h2, .high-contrast h3, .high-contrast h4, .high-contrast h5, .high-contrast h6, .high-contrast p, .high-contrast span, .high-contrast label, .high-contrast button, .high-contrast select, .high-contrast textarea, .high-contrast input {
            background-color: #000000 !important;
            color: #ffffff !important;
            border-color: #ffffff !important;
            text-shadow: none !important;
            box-shadow: none !important;
          }
          .high-contrast button, .high-contrast a, .high-contrast input[type="submit"] {
            border: 2px solid #ffffff !important;
            background-color: #000000 !important;
            color: #ffff00 !important;
          }
          .high-contrast input, .high-contrast select, .high-contrast textarea {
            border: 1.5px solid #ffffff !important;
            background-color: #000000 !important;
            color: #ffffff !important;
          }
        `;
        document.head.appendChild(styleEl);
      }
    } else {
      if (styleEl) {
        styleEl.remove();
      }
    }
  }, [highContrast]);

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
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>

        {/* Brand Header */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10 flex flex-col items-center mb-8">
          <div className="p-3 bg-white/10 rounded-2xl border border-white/20 mb-3 text-orange-400">
            <Landmark size={32} />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">JanSetu-AI Civic Portal</h2>
          <p className="text-xs font-semibold tracking-wider text-orange-400 uppercase mt-1">
            Ministry of Electronics & Information Technology • GOI
          </p>
        </div>

        {/* Side-by-Side Dual Column Portal */}
        <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-4xl relative z-10">
          <div className="bg-slate-900 border border-slate-800 shadow-premium rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
            
            {/* Left Column: Interactive Form */}
            <div className="p-6 md:p-10 flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-800">
              
              {/* Tab Selector */}
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800/80 mb-6">
                <button
                  type="button"
                  onClick={() => { setLoginTab('phone'); setAuthError(''); }}
                  className={`flex-1 text-center py-2 rounded-lg text-xs font-bold transition-all ${loginTab === 'phone' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  📱 Mobile & OTP (Easy)
                </button>
                <button
                  type="button"
                  onClick={() => { setLoginTab('email'); setAuthError(''); }}
                  className={`flex-1 text-center py-2 rounded-lg text-xs font-bold transition-all ${loginTab === 'email' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  ✉️ Email & Password
                </button>
              </div>

              {loginTab === 'phone' ? (
                /* Mobile + OTP Flow */
                <div className="space-y-4">
                  <h4 className="font-extrabold text-sm text-slate-200">Easy Sign In</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">No password needed. Enter your phone number to receive a secret verification code.</p>
                  
                  {!otpSent ? (
                    /* Step 1: Input Mobile */
                    <form onSubmit={handleSendOtp} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Mobile Phone Number
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-xs text-slate-500 font-bold font-mono">+91</span>
                          <input
                            type="tel"
                            maxLength={10}
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                            placeholder="Enter 10-digit mobile number"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white font-mono focus:border-orange-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      {authError && <p className="text-rose-500 text-xs font-semibold">⚠️ {authError}</p>}

                      <button
                        type="submit"
                        disabled={otpLoading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-60 flex justify-center items-center gap-1.5"
                      >
                        {otpLoading ? 'Sending...' : 'Send Secret Code (OTP)'}
                      </button>
                    </form>
                  ) : (
                    /* Step 2: Input OTP */
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Enter Secret Code (OTP)
                        </label>
                        <input
                          type="text"
                          maxLength={4}
                          required
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                          placeholder="Type 4-digit code"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-center font-bold font-mono tracking-widest text-white focus:border-orange-500 focus:outline-none"
                        />
                        <p className="text-[10px] text-slate-500 mt-1">SMS sent to +91 {phone}. Enter **1234** for verification.</p>
                      </div>

                      {authError && <p className="text-rose-500 text-xs font-semibold">⚠️ {authError}</p>}

                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-60"
                      >
                        {authLoading ? 'Verifying...' : 'Verify & Log In'}
                      </button>

                      <div className="text-center pt-2">
                        <button
                          type="button"
                          onClick={() => { setOtpSent(false); setOtp(''); }}
                          className="text-[10px] text-slate-400 hover:text-white underline font-bold"
                        >
                          Change Phone Number
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ) : (
                /* Email + Password Flow */
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <h4 className="font-extrabold text-sm text-slate-200">Officer / Admin Sign In</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium">Authentication portal for municipal officers and command center managers.</p>
                  
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. demo.officer@jansetu.ai"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  {authError && <p className="text-rose-500 text-xs font-semibold">⚠️ {authError}</p>}

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-750 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-60"
                  >
                    {authLoading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>
              )}
            </div>

            {/* Right Column: Step-by-Step Instructions & Helpers */}
            <div className="p-6 md:p-10 bg-slate-950 flex flex-col justify-between gap-6">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-extrabold text-sm text-slate-200">How to Sign In</h4>
                  
                  {/* Voice help speaker */}
                  <button
                    onClick={playVoiceGuide}
                    className="flex items-center gap-1 bg-slate-900 border border-slate-800 hover:bg-slate-800 px-2.5 py-1 rounded-full text-[9px] font-black text-orange-400 active:scale-95 transition-all"
                    title="Play voice guide instructions"
                  >
                    🔊 Read Out Guide
                  </button>
                </div>

                <div className="space-y-4 text-[11px] leading-relaxed text-slate-400">
                  <div className="flex gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                    <div>
                      <p className="font-bold text-slate-200">Enter phone number</p>
                      <p className="mt-0.5">Type your 10-digit mobile number in the box. Do not prefix with +91 or 0.</p>
                    </div>
                  </div>
                  <div className="flex gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                    <div>
                      <p className="font-bold text-slate-200">Receive SMS Code</p>
                      <p className="mt-0.5">You will receive an SMS containing a secret 4-digit code (OTP) on your phone.</p>
                    </div>
                  </div>
                  <div className="flex gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                    <div>
                      <p className="font-bold text-slate-200">Verify and Log In</p>
                      <p className="mt-0.5">Type that code in the box and click Log In. Safe, secure, and no password required!</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 1-Click bypass testing */}
              <div className="border-t border-slate-900 pt-5">
                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block mb-2 text-center lg:text-left">
                  Demo Fast Bypass Login
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('citizen')}
                    className="bg-slate-900 border border-slate-800 hover:border-orange-500 py-2 rounded-xl text-[9px] font-bold text-slate-300 hover:text-white flex flex-col items-center gap-1 transition-all"
                  >
                    <UserCheck size={12} className="text-orange-400" />
                    Citizen
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('officer')}
                    className="bg-slate-900 border border-slate-800 hover:border-indigo-500 py-2 rounded-xl text-[9px] font-bold text-slate-300 hover:text-white flex flex-col items-center gap-1 transition-all"
                  >
                    <ShieldCheck size={12} className="text-indigo-400" />
                    Officer
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('admin')}
                    className="bg-slate-900 border border-slate-800 hover:border-emerald-500 py-2 rounded-xl text-[9px] font-bold text-slate-300 hover:text-white flex flex-col items-center gap-1 transition-all"
                  >
                    <Key size={12} className="text-emerald-400" />
                    Admin
                  </button>
                </div>
              </div>

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
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        highContrast={highContrast}
        onHighContrastChange={setHighContrast}
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
