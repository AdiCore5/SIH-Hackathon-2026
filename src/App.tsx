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
import { AdminManageOfficers } from './pages/AdminManageOfficers';
import { AdminManageGrievances } from './pages/AdminManageGrievances';
import { AdminSystemSettings } from './pages/AdminSystemSettings';

import { Key, Landmark, Lock, ShieldCheck, UserCheck, Volume2, Sparkles, CheckCircle2, Globe, Shield, ArrowRight, Activity, Building2 } from 'lucide-react';

const App: React.FC = () => {
  // Auth state
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

  // Auth tabs & form state
  const [loginTab, setLoginTab] = useState<'phone' | 'email' | 'admin'>('phone');
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [adminAccessCode, setAdminAccessCode] = useState('ADMIN-2026');
  const [adminEmail, setAdminEmail] = useState('demo.admin@jansetu.ai');
  const [adminPassword, setAdminPassword] = useState('Demo@123');

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
      alert('Demo Verification Code Sent! Enter 1234 to verify.');
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
      setAuthError(err.message || "Invalid OTP code. Please enter 1234.");
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

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      const response = await api.adminLogin(adminEmail, adminPassword, adminAccessCode);
      setIsLoggedIn(true);
      handleRoleChange(response.user.role as UserRole);
    } catch (e: any) {
      setAuthError(e.message || 'Admin authentication failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleDemoLogin = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (selectedRole === 'admin') {
      setUserName('Dr. Rajesh Nambiar (Nodal Admin)');
    } else if (selectedRole === 'officer') {
      setUserName('Officer Amit Sharma (Ward Nodal Chief)');
    } else {
      setUserName('Rahul Verma');
    }
    setIsLoggedIn(true);
    setCurrentTab('home');
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
    if (newRole === 'admin') {
      setUserName('Dr. Rajesh Nambiar (Nodal Admin)');
      setCurrentTab('dashboard');
    } else if (newRole === 'officer') {
      setUserName('Officer Amit Sharma (Ward Nodal Chief)');
      setCurrentTab('dashboard');
    } else {
      setUserName('Rahul Verma');
      setCurrentTab('home');
    }
  };

  const handleNavigate = (tab: string, arg?: string) => {
    setCurrentTab(tab);
    if (arg) {
      setSelectedGrievanceId(arg);
    }
  };

  const handleMarkNotifRead = (id: string) => {
    api.markNotificationAsRead(id);
    fetchNotifications();
  };

  // 1. OFFICIAL GOVERNMENT SIGN IN VIEW WITH DIGITAL INDIA BG
  if (!isLoggedIn) {
    return (
      <div 
        className="min-h-screen relative flex flex-col justify-between text-white font-sans overflow-x-hidden bg-slate-950 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.88), rgba(2, 6, 23, 0.96)), url('/gov_bg.png')` }}
      >
        {/* Top Official Tri-Color Border Bar */}
        <div className="h-1.5 bg-gradient-to-r from-orange-500 via-white to-emerald-600 shadow-md"></div>

        {/* Top Bar Header Strip */}
        <div className="bg-slate-900/90 backdrop-blur-md px-4 md:px-12 py-2 flex flex-wrap justify-between items-center text-[11px] border-b border-slate-800 gap-2">
          <div className="flex items-center gap-2 font-semibold text-slate-300">
            <span>🇮🇳</span>
            <span>भारत सरकार | Government of India</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="hidden sm:inline text-orange-400 font-bold">Smart India Hackathon (SIH 2026) Flagship</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Shield size={12} /> GIGW 3.0 & CPGRAMS Aligned
            </span>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Language)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-0.5 text-xs text-white focus:border-orange-500 focus:outline-none font-bold"
            >
              <option value="en">English (EN)</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="gu">ગુજરાતી (Gujarati)</option>
            </select>
          </div>
        </div>

        {/* Main Portal Container */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-8 relative z-10">
          <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Hero & Platform Pitch Column */}
            <div className="lg:col-span-6 space-y-6 text-left animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider">
                <Sparkles size={14} className="text-orange-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Next-Gen Smart Public Grievances</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight font-sans">
                  JanSetu <span className="text-orange-500 bg-orange-950/60 border border-orange-800/60 px-2 py-0.5 rounded-xl">AI</span>
                </h1>
                <p className="text-lg md:text-xl text-orange-400 font-extrabold tracking-wide">
                  “{translate('tagline', lang)}”
                </p>
              </div>

              <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-xl">
                National AI-powered civic portal enabling 1.4B citizens to log public issues via voice in Indian regional languages, with automated department routing and time-bound SLA enforcement.
              </p>

              {/* Digital India Vision Badges */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl flex items-center gap-2.5 backdrop-blur-sm">
                  <div className="p-2 bg-orange-500/20 text-orange-400 rounded-xl">
                    <Activity size={18} />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-white text-xs">72% Faster Redressal</h5>
                    <p className="text-[10px] text-slate-400">Automated SLA Routing</p>
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl flex items-center gap-2.5 backdrop-blur-sm">
                  <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-white text-xs">18+ Municipalities</h5>
                    <p className="text-[10px] text-slate-400">Central & State Sync</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form Card Column */}
            <div className="lg:col-span-6 animate-slide-up">
              <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
                
                {/* Header */}
                <div className="flex justify-between items-center border-b border-slate-800/80 pb-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                      <Landmark className="text-orange-500" size={20} />
                      <span>{translate('login_title', lang)}</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">Secure Passwordless Mobile OTP & Admin Portal</p>
                  </div>

                  <button
                    onClick={playVoiceGuide}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-orange-400 px-3 py-1.5 rounded-full text-[10px] font-extrabold transition-all active:scale-95"
                    title="Audio Assistance"
                  >
                    <Volume2 size={13} className="animate-pulse" />
                    <span>{translate('login_btn_read_guide', lang)}</span>
                  </button>
                </div>

                {/* Tab Selector */}
                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => { setLoginTab('phone'); setAuthError(''); }}
                    className={`flex-1 text-center py-2 rounded-lg text-xs font-bold transition-all ${loginTab === 'phone' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    📱 Mobile OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLoginTab('email'); setAuthError(''); }}
                    className={`flex-1 text-center py-2 rounded-lg text-xs font-bold transition-all ${loginTab === 'email' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    ✉️ Password
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLoginTab('admin'); setAuthError(''); }}
                    className={`flex-1 text-center py-2 rounded-lg text-xs font-bold transition-all ${loginTab === 'admin' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    🔐 Admin Portal
                  </button>
                </div>

                {/* Tab 1: Phone OTP */}
                {loginTab === 'phone' && (
                  !otpSent ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                          {translate('login_mobile_label', lang)}
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-3.5 text-xs text-orange-400 font-extrabold font-mono">+91</span>
                          <input
                            type="tel"
                            maxLength={10}
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                            placeholder={translate('login_mobile_placeholder', lang)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-14 pr-4 py-3.5 text-sm text-white font-mono font-bold focus:border-orange-500 focus:outline-none shadow-inner"
                          />
                        </div>
                      </div>

                      {authError && <p className="text-rose-400 text-xs font-bold bg-rose-950/60 p-2.5 rounded-xl border border-rose-800">⚠️ {authError}</p>}

                      <button
                        type="submit"
                        disabled={otpLoading}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all disabled:opacity-60 shadow-lg flex items-center justify-center gap-2"
                      >
                        <span>{otpLoading ? 'Sending OTP...' : translate('login_btn_send_otp', lang)}</span>
                        <ArrowRight size={16} />
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                          {translate('login_otp_label', lang)}
                        </label>
                        <input
                          type="text"
                          maxLength={4}
                          required
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                          placeholder={translate('login_otp_placeholder', lang)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-center text-lg font-black font-mono tracking-widest text-orange-400 focus:border-orange-500 focus:outline-none shadow-inner"
                        />
                        <p className="text-[11px] text-slate-400 text-center mt-1.5">Enter verification code <strong className="text-orange-400 font-mono">1234</strong> to enter.</p>
                      </div>

                      {authError && <p className="text-rose-400 text-xs font-bold bg-rose-950/60 p-2.5 rounded-xl border border-rose-800">⚠️ {authError}</p>}

                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full bg-orange-600 hover:bg-orange-500 text-white font-extrabold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all disabled:opacity-60 shadow-lg"
                      >
                        {authLoading ? 'Verifying...' : translate('login_btn_verify_otp', lang)}
                      </button>

                      <div className="text-center pt-1">
                        <button
                          type="button"
                          onClick={() => { setOtpSent(false); setOtp(''); }}
                          className="text-[11px] text-slate-400 hover:text-white underline font-bold"
                        >
                          {translate('login_change_phone', lang)}
                        </button>
                      </div>
                    </form>
                  )
                )}

                {/* Tab 2: Email & Password */}
                {loginTab === 'email' && (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="demo.citizen@jansetu.ai"
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-white font-bold focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                        Password
                      </label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-white font-bold focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    {authError && <p className="text-rose-400 text-xs font-bold bg-rose-950/60 p-2.5 rounded-xl border border-rose-800">⚠️ {authError}</p>}

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all disabled:opacity-60 shadow-lg"
                    >
                      {authLoading ? 'Signing In...' : 'Sign In with Password'}
                    </button>
                  </form>
                )}

                {/* Tab 3: Admin Portal */}
                {loginTab === 'admin' && (
                  <form onSubmit={handleAdminLoginSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                        Admin Email
                      </label>
                      <input
                        type="email"
                        required
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        placeholder="demo.admin@jansetu.ai"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white font-bold focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                        Admin Password
                      </label>
                      <input
                        type="password"
                        required
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white font-bold focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 mb-1">
                        Security Access Code
                      </label>
                      <input
                        type="text"
                        required
                        value={adminAccessCode}
                        onChange={(e) => setAdminAccessCode(e.target.value)}
                        placeholder="ADMIN-2026"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono font-black text-emerald-400 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    {authError && <p className="text-rose-400 text-xs font-bold bg-rose-950/60 p-2 rounded-lg border border-rose-800">⚠️ {authError}</p>}

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-60 shadow-lg"
                    >
                      {authLoading ? 'Verifying Credentials...' : 'Authenticate Admin Access'}
                    </button>
                  </form>
                )}

                {/* Direct 1-Click Evaluation Bypass */}
                <div className="border-t border-slate-800/80 pt-4 space-y-2">
                  <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider block text-center">
                    ⚡ Hackathon Demo — 1-Click Role Direct Preview:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleDemoLogin('citizen')}
                      className="bg-slate-950 border border-slate-800 hover:border-orange-500 py-2.5 rounded-xl text-[10px] font-extrabold text-slate-300 hover:text-white flex flex-col items-center gap-1 transition-all shadow-sm"
                    >
                      <UserCheck size={14} className="text-orange-400" />
                      <span>Citizen</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDemoLogin('officer')}
                      className="bg-slate-950 border border-slate-800 hover:border-indigo-500 py-2.5 rounded-xl text-[10px] font-extrabold text-slate-300 hover:text-white flex flex-col items-center gap-1 transition-all shadow-sm"
                    >
                      <ShieldCheck size={14} className="text-indigo-400" />
                      <span>Officer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDemoLogin('admin')}
                      className="bg-slate-950 border border-slate-800 hover:border-emerald-500 py-2.5 rounded-xl text-[10px] font-extrabold text-slate-300 hover:text-white flex flex-col items-center gap-1 transition-all shadow-sm"
                    >
                      <Key size={14} className="text-emerald-400" />
                      <span>Admin</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Footer info strip */}
        <div className="bg-slate-950/90 text-slate-500 py-3 px-4 text-center text-[10px] border-t border-slate-900 flex justify-between items-center px-4 md:px-12">
          <span>Managed by National Informatics Centre (NIC) & MeitY, Government of India</span>
          <span>SIH Hackathon 2026 Prototype • GIGW Version 3.0</span>
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
            {currentTab === 'manage-officers' && (
              <AdminManageOfficers lang={lang} />
            )}
            {currentTab === 'manage-grievances' && (
              <AdminManageGrievances lang={lang} />
            )}
            {currentTab === 'system-settings' && (
              <AdminSystemSettings lang={lang} />
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
