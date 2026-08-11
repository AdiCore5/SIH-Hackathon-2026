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

import { Key, Landmark, Lock, ShieldCheck, UserCheck } from 'lucide-react';

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
    setLoginTab('phone');
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

  // 1. SIGN IN SCREEN VIEW
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col justify-between relative text-slate-900 font-sans">
        {/* Top Government Emblem Header */}
        <div>
          <div className="h-1.5 bg-gradient-to-r from-orange-500 via-white to-emerald-600"></div>
          <div className="bg-slate-900 text-white py-2 px-4 md:px-12 flex justify-between items-center text-xs font-medium border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span>🇮🇳</span>
              <span className="font-bold tracking-wide">Government of India • भारत सरकार</span>
              <span className="hidden sm:inline text-slate-400">|</span>
              <span className="hidden sm:inline text-slate-300">CPGRAMS Portal</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">🌐 Select Language:</span>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
                className="bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="en">English (EN)</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="gu">ગુજરાતી (Gujarati)</option>
              </select>
            </div>
          </div>

          {/* Deep Navy Header Banner */}
          <div className="gov-header-bg py-8 px-4 text-white text-center shadow-md border-b-4 border-amber-500">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl border border-white/20 text-amber-400 shrink-0">
                <Landmark size={40} />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {translate('title', lang)}
                </h1>
                <p className="text-xs sm:text-sm font-semibold tracking-wider text-amber-300 uppercase mt-1">
                  Central Public Grievance Redress & Monitoring System (CPGRAMS)
                </p>
                <p className="text-[11px] text-slate-300 mt-1">
                  Ministry of Electronics & Information Technology • National Informatics Centre (NIC)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Login Card Portal */}
        <div className="my-8 px-4 sm:mx-auto sm:w-full sm:max-w-4xl">
          <div className="bg-white border border-slate-300 shadow-gov-lg rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
            
            {/* Left Column: Interactive Form */}
            <div className="p-6 md:p-10 flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-800">
              
              {/* Tab Selector — 3 tabs */}
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800/80 mb-6">
                <button
                  type="button"
                  onClick={() => { setLoginTab('phone'); setAuthError(''); }}
                  className={`flex-1 text-center py-2 rounded-lg text-xs font-bold transition-all ${loginTab === 'phone' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  📱 Mobile & OTP
                </button>
                <button
                  type="button"
                  onClick={() => { setLoginTab('email'); setAuthError(''); }}
                  className={`flex-1 text-center py-2 rounded-lg text-xs font-bold transition-all ${loginTab === 'email' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  ✉️ Email & Password
                </button>
                <button
                  type="button"
                  onClick={() => { setLoginTab('admin'); setAuthError(''); }}
                  className={`flex-1 text-center py-2 rounded-lg text-xs font-bold transition-all ${loginTab === 'admin' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  🔐 Admin Portal
                </button>
              </div>

              {loginTab === 'phone' ? (
                <div className="space-y-4">
                <h4 className="font-extrabold text-sm text-slate-200">{translate('login_title', lang)}</h4>
                
                {!otpSent ? (
                  /* Step 1: Input Mobile */
                  <form onSubmit={handleSendOtp} className="space-y-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {translate('login_mobile_label', lang)}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-xs text-slate-500 font-bold font-mono">+91</span>
                        <input
                          type="tel"
                          maxLength={10}
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                          placeholder={translate('login_mobile_placeholder', lang)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-900 font-mono font-bold focus:border-blue-600 focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    {authError && <p className="text-rose-600 text-xs font-semibold">⚠️ {authError}</p>}

                    <button
                      type="submit"
                      disabled={otpLoading}
                      className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider shadow-sm transition-all disabled:opacity-60 flex justify-center items-center gap-1.5"
                    >
                      {otpLoading ? 'Sending Code...' : translate('login_btn_send_otp', lang)}
                    </button>
                  </form>
                ) : (
                  /* Step 2: Input OTP */
                  <form onSubmit={handleVerifyOtp} className="space-y-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {translate('login_otp_label', lang)}
                      </label>
                      <input
                        type="text"
                        maxLength={4}
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder={translate('login_otp_placeholder', lang)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-center font-bold font-mono tracking-widest text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none"
                      />
                      <p className="text-[11px] text-slate-500 mt-1.5 font-medium">SMS code dispatched to +91 {phone}. Enter **1234** for verification.</p>
                    </div>

                    {authError && <p className="text-rose-600 text-xs font-semibold">⚠️ {authError}</p>}

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider shadow-sm transition-all disabled:opacity-60"
                    >
                      {authLoading ? 'Verifying...' : translate('login_btn_verify_otp', lang)}
                    </button>

                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={() => { setOtpSent(false); setOtp(''); }}
                        className="text-xs text-blue-700 hover:text-blue-900 underline font-bold"
                      >
                        {translate('login_change_phone', lang)}
                      </button>
                    </div>
                  </form>
                )}
                </div>
              ) : loginTab === 'email' ? (
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
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-60"
                  >
                    {authLoading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>
              ) : (
                /* Admin Portal Login */
                <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                      <Lock size={14} className="text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-200">Admin Command Portal</h4>
                      <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">Authorized Personnel Only</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium">Secure access for district administrators and system managers. Requires admin access code.</p>
                  
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Admin Email
                    </label>
                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="demo.admin@jansetu.ai"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      🔑 Admin Access Code
                    </label>
                    <input
                      type="text"
                      required
                      value={adminAccessCode}
                      onChange={(e) => setAdminAccessCode(e.target.value.toUpperCase())}
                      placeholder="ADMIN-XXXX"
                      className="w-full bg-slate-950 border border-emerald-800/50 rounded-xl px-4 py-3 text-xs text-emerald-300 font-mono tracking-wider focus:border-emerald-500 focus:outline-none"
                    />
                    <p className="text-[9px] text-slate-500 mt-1">Demo code: <span className="text-emerald-400 font-bold">ADMIN-2026</span></p>
                  </div>

                  {authError && <p className="text-rose-500 text-xs font-semibold">⚠️ {authError}</p>}

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-60 flex justify-center items-center gap-1.5"
                  >
                    <Lock size={12} />
                    {authLoading ? 'Authenticating...' : 'Secure Admin Sign In'}
                  </button>
                </form>
              )}
            </div>

            {/* Right Column: Government Guidelines & Help Panel */}
            <div className="p-6 md:p-8 bg-slate-50 flex flex-col justify-between gap-6">
              <div>
                <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-2">
                  <h4 className="font-extrabold text-sm text-slate-800">{translate('login_how_to_title', lang)}</h4>
                  
                  {/* Voice guide button */}
                  <button
                    onClick={playVoiceGuide}
                    className="flex items-center gap-1 bg-amber-100 border border-amber-300 hover:bg-amber-200 px-2.5 py-1 rounded-full text-[10px] font-bold text-amber-900 active:scale-95 transition-all"
                  >
                    {translate('login_btn_read_guide', lang)}
                  </button>
                </div>

                <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
                  <div className="flex gap-3">
                    <span className="h-6 w-6 rounded-full bg-blue-100 border border-blue-300 text-blue-900 flex items-center justify-center font-bold text-xs shrink-0">1</span>
                    <div>
                      <p className="font-bold text-slate-900">{translate('login_step_1_title', lang)}</p>
                      <p className="mt-0.5 text-[11px]">{translate('login_step_1_desc', lang)}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="h-6 w-6 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 flex items-center justify-center font-bold text-xs shrink-0">2</span>
                    <div>
                      <p className="font-bold text-slate-900">{translate('login_step_2_title', lang)}</p>
                      <p className="mt-0.5 text-[11px]">{translate('login_step_2_desc', lang)}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="h-6 w-6 rounded-full bg-amber-100 border border-amber-300 text-amber-900 flex items-center justify-center font-bold text-xs shrink-0">3</span>
                    <div>
                      <p className="font-bold text-slate-900">{translate('login_step_3_title', lang)}</p>
                      <p className="mt-0.5 text-[11px]">{translate('login_step_3_desc', lang)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 1-Click Fast Demo Selectors */}
              <div className="border-t border-slate-200 pt-4">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-2">
                  {translate('login_demo_title', lang)}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('citizen')}
                    className="bg-white border border-slate-300 hover:border-amber-500 hover:bg-amber-50 py-2 rounded-xl text-[10px] font-bold text-slate-700 hover:text-amber-900 flex flex-col items-center gap-1 shadow-sm transition-all"
                  >
                    <UserCheck size={14} className="text-amber-600" />
                    Citizen
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('officer')}
                    className="bg-white border border-slate-300 hover:border-blue-500 hover:bg-blue-50 py-2 rounded-xl text-[10px] font-bold text-slate-700 hover:text-blue-900 flex flex-col items-center gap-1 shadow-sm transition-all"
                  >
                    <ShieldCheck size={14} className="text-blue-700" />
                    Officer
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('admin')}
                    className="bg-white border border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 py-2 rounded-xl text-[10px] font-bold text-slate-700 hover:text-emerald-900 flex flex-col items-center gap-1 shadow-sm transition-all"
                  >
                    <Key size={14} className="text-emerald-700" />
                    Admin
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-900 text-slate-400 py-3 px-4 text-center text-xs border-t border-slate-800">
          <p>© 2026 CPGRAMS JanSetu-AI • Designed & Developed for Ministry of Electronics & Information Technology, Government of India</p>
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
        onLogout={handleLogout}
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
            {currentTab === 'manage-grievances' && (
              <AdminManageGrievances lang={lang} />
            )}
            {currentTab === 'manage-officers' && (
              <AdminManageOfficers lang={lang} />
            )}
            {currentTab === 'system-settings' && (
              <AdminSystemSettings lang={lang} onDataReset={fetchNotifications} />
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
