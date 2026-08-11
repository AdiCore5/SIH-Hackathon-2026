import React, { useState } from 'react';
import { translate, Language } from '../services/i18n';
import { UserRole, Notification } from '../types';
import { Bell, Globe, Menu, X, Landmark, Shield, User as UserIcon, Volume2, Sparkles, CheckCircle2, ChevronDown, Award } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  lang: Language;
  onLangChange: (lang: Language) => void;
  role: UserRole;
  notifications: Notification[];
  onMarkNotifRead: (id: string) => void;
  userName: string;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  highContrast: boolean;
  onHighContrastChange: (hc: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  lang,
  onLangChange,
  role,
  notifications,
  onMarkNotifRead,
  userName,
  fontSize,
  onFontSizeChange,
  highContrast,
  onHighContrastChange
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.isRead);

  const handleNavClick = (tab: string) => {
    onTabChange(tab);
    setIsMenuOpen(false);
  };

  const getRoleColor = () => {
    if (role === 'admin') return 'bg-emerald-600 text-white shadow-sm';
    if (role === 'officer') return 'bg-blue-700 text-white shadow-sm';
    return 'bg-amber-600 text-white shadow-sm';
  };

  const playVoiceHeaderHelp = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = lang === 'hi' 
        ? "जनसेतु एआई राष्ट्रीय शिकायत पोर्टल में आपका स्वागत है। शिकायत दर्ज करने के लिए लॉज बटन या अपनी स्थिति जांचने के लिए ट्रैक बटन दबाएं।"
        : "Welcome to JanSetu AI National Public Grievance Portal. Click Lodge Grievance to file a complaint or Track Grievance to check your status.";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-md">
      {/* Official Tri-Color Border Bar Accent */}
      <div className="h-1.5 bg-gradient-to-r from-orange-500 via-white to-emerald-600 shadow-sm"></div>

      {/* Top Official Government Strip */}
      <div className="bg-slate-900 text-slate-300 py-1.5 px-4 md:px-12 text-[11px] font-medium flex flex-wrap justify-between items-center border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700 text-slate-200 font-semibold">
            <span className="text-xs">🇮🇳</span>
            <span>भारत सरकार | Government of India</span>
          </div>
          <span className="text-slate-600 hidden md:inline">•</span>
          <span className="hidden md:inline text-slate-400 font-normal">Ministry of Electronics & Information Technology (MeitY)</span>
          <span className="hidden lg:inline text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded text-[10px]">
            ✓ GIGW 3.0 Compliant
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Audio Reader Helper */}
          <button
            onClick={playVoiceHeaderHelp}
            className="hidden sm:flex items-center gap-1 hover:text-white text-slate-400 transition-colors text-[10px] font-bold"
            title="Listen to Screen Assistance"
          >
            <Volume2 size={12} className="text-orange-400 animate-pulse" />
            <span>Audio Guide</span>
          </button>

          {/* Accessibility controls */}
          <div className="flex items-center gap-1 border-x border-slate-750 px-2">
            <span className="text-[10px] text-slate-400 mr-1 hidden sm:inline">Text Size:</span>
            <button 
              onClick={() => onFontSizeChange(0.9)} 
              className={`px-1.5 py-0.5 rounded font-bold text-[9px] border transition-colors ${fontSize === 0.9 ? 'bg-orange-500 text-white border-orange-500' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'}`}
              title="Decrease Font Size"
            >
              A-
            </button>
            <button 
              onClick={() => onFontSizeChange(1.0)} 
              className={`px-1.5 py-0.5 rounded font-bold text-[9px] border transition-colors ${fontSize === 1.0 ? 'bg-orange-500 text-white border-orange-500' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'}`}
              title="Reset Font Size"
            >
              A
            </button>
            <button 
              onClick={() => onFontSizeChange(1.15)} 
              className={`px-1.5 py-0.5 rounded font-bold text-[9px] border transition-colors ${fontSize === 1.15 ? 'bg-orange-500 text-white border-orange-500' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'}`}
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          {/* High Contrast */}
          <button 
            onClick={() => onHighContrastChange(!highContrast)} 
            className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors flex items-center gap-1 ${highContrast ? 'bg-yellow-400 text-black border-yellow-300 font-extrabold' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'}`}
          >
            <span>🌓 Contrast</span>
          </button>
        </div>
      </div>

      {/* Main Navbar Branding & Links */}
      <div className="mx-auto px-4 md:px-12 py-3 flex items-center justify-between">
        {/* Brand Header Logo */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleNavClick('home')}>
          <div className="p-2.5 bg-slate-900 text-orange-400 rounded-xl shadow-md group-hover:scale-105 transition-transform border border-slate-800 flex items-center justify-center relative">
            <Landmark size={26} className="text-orange-400" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 font-sans leading-none flex items-center gap-1.5">
                <span>JanSetu</span>
                <span className="text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-md border border-orange-200 text-lg">AI</span>
              </h1>
              <span className="hidden sm:inline-block bg-blue-900 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider shadow-xs">
                SIH 2026 Edition
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-bold tracking-wide uppercase mt-1 flex items-center gap-1">
              <span>National Smart Public Grievance Portal</span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700 font-semibold">Instant Redressal</span>
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
          {role === 'citizen' && (
            <>
              <button
                onClick={() => handleNavClick('home')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${currentTab === 'home' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-700 hover:bg-white hover:text-slate-950'}`}
              >
                {translate('nav_home', lang)}
              </button>
              <button
                onClick={() => handleNavClick('lodge')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${currentTab === 'lodge' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-700 hover:bg-white hover:text-slate-950'}`}
              >
                📝 {translate('nav_lodge', lang)}
              </button>
              <button
                onClick={() => handleNavClick('track')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${currentTab === 'track' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-700 hover:bg-white hover:text-slate-950'}`}
              >
                🔍 {translate('nav_track', lang)}
              </button>
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${currentTab === 'dashboard' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-700 hover:bg-white hover:text-slate-950'}`}
              >
                📊 My Complaints
              </button>
              <button
                onClick={() => handleNavClick('ai-architecture')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${currentTab === 'ai-architecture' ? 'bg-indigo-900 text-white shadow-md' : 'text-slate-700 hover:bg-white hover:text-slate-950'}`}
              >
                ⚡ AI Pipeline
              </button>
            </>
          )}

          {role === 'officer' && (
            <>
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${currentTab === 'dashboard' ? 'bg-blue-900 text-white shadow-md' : 'text-slate-700 hover:bg-white hover:text-slate-950'}`}
              >
                📋 Officer Command Queue
              </button>
              <button
                onClick={() => handleNavClick('ai-architecture')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${currentTab === 'ai-architecture' ? 'bg-blue-900 text-white shadow-md' : 'text-slate-700 hover:bg-white hover:text-slate-950'}`}
              >
                ⚡ AI Routing Intelligence
              </button>
            </>
          )}

          {role === 'admin' && (
            <>
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${currentTab === 'dashboard' ? 'bg-emerald-900 text-white shadow-md' : 'text-slate-700 hover:bg-white hover:text-slate-950'}`}
              >
                🏛️ National Control Center
              </button>
              <button
                onClick={() => handleNavClick('ai-architecture')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${currentTab === 'ai-architecture' ? 'bg-emerald-900 text-white shadow-md' : 'text-slate-700 hover:bg-white hover:text-slate-950'}`}
              >
                ⚡ System Diagnostics
              </button>
            </>
          )}
        </nav>

        {/* User Controls & Language */}
        <div className="flex items-center gap-3">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl text-slate-800 flex items-center gap-1.5 text-xs font-bold transition-all shadow-xs"
            >
              <Globe size={16} className="text-orange-600" />
              <span>
                {lang === 'en' ? 'English' : lang === 'hi' ? 'हिन्दी' : 'ગુજરાતી'}
              </span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>
            
            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 animate-slide-up">
                <button
                  onClick={() => { onLangChange('en'); setIsLangDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-50 font-bold flex items-center justify-between ${lang === 'en' ? 'text-orange-600 bg-orange-50/50' : 'text-slate-700'}`}
                >
                  <span>English</span>
                  {lang === 'en' && <CheckCircle2 size={14} className="text-orange-600" />}
                </button>
                <button
                  onClick={() => { onLangChange('hi'); setIsLangDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-50 font-bold flex items-center justify-between ${lang === 'hi' ? 'text-orange-600 bg-orange-50/50' : 'text-slate-700'}`}
                >
                  <span>हिन्दी (Hindi)</span>
                  {lang === 'hi' && <CheckCircle2 size={14} className="text-orange-600" />}
                </button>
                <button
                  onClick={() => { onLangChange('gu'); setIsLangDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-50 font-bold flex items-center justify-between ${lang === 'gu' ? 'text-orange-600 bg-orange-50/50' : 'text-slate-700'}`}
                >
                  <span>ગુજરાતી (Gujarati)</span>
                  {lang === 'gu' && <CheckCircle2 size={14} className="text-orange-600" />}
                </button>
              </div>
            )}
          </div>

          {/* Notifications Center */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl text-slate-700 relative shadow-xs transition-all"
              title="View Alerts & System Updates"
            >
              <Bell size={18} />
              {unreadNotifications.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white rounded-full text-[9px] font-extrabold h-4 w-4 flex items-center justify-center animate-bounce shadow-md">
                  {unreadNotifications.length}
                </span>
              )}
            </button>
            
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl py-3 z-50 max-h-96 overflow-y-auto animate-slide-up">
                <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <Bell size={14} className="text-orange-500" />
                    <span>Official Notifications</span>
                  </div>
                  <span className="text-[10px] bg-orange-100 text-orange-700 font-extrabold px-2 py-0.5 rounded-full">
                    {unreadNotifications.length} Unread
                  </span>
                </div>
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 font-medium">No active alerts at this moment.</div>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id}
                      onClick={() => { onMarkNotifRead(n.id); handleNavClick('dashboard'); setIsNotifOpen(false); }}
                      className={`px-4 py-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer text-xs transition-all ${n.isRead ? 'opacity-70' : 'bg-orange-50/30 font-semibold'}`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">{n.title}</span>
                        {!n.isRead && <span className="h-2 w-2 bg-orange-500 rounded-full animate-ping"></span>}
                      </div>
                      <p className="text-slate-600 mt-1 leading-snug line-clamp-2">{n.message}</p>
                      <div className="flex justify-between items-center mt-2 text-[9px] text-slate-400">
                        <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-bold">{n.grievanceId}</span>
                        <span>Just now</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* User Role Indicator Card */}
          <div className="hidden sm:flex items-center gap-2 border-l border-slate-200 pl-3">
            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold tracking-wider uppercase ${getRoleColor()}`}>
              {role}
            </span>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-900 leading-none">{userName}</p>
              <p className="text-[9px] text-emerald-600 font-semibold leading-none mt-1">Verified Citizen</p>
            </div>
          </div>

          {/* Mobile Drawer Trigger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 flex flex-col gap-2.5 animate-slide-up shadow-xl">
          {role === 'citizen' && (
            <>
              <button
                onClick={() => handleNavClick('home')}
                className={`w-full text-left px-4 py-2.5 text-xs font-bold rounded-xl ${currentTab === 'home' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                {translate('nav_home', lang)}
              </button>
              <button
                onClick={() => handleNavClick('lodge')}
                className={`w-full text-left px-4 py-2.5 text-xs font-bold rounded-xl ${currentTab === 'lodge' ? 'bg-orange-600 text-white' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                📝 {translate('nav_lodge', lang)}
              </button>
              <button
                onClick={() => handleNavClick('track')}
                className={`w-full text-left px-4 py-2.5 text-xs font-bold rounded-xl ${currentTab === 'track' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                🔍 {translate('nav_track', lang)}
              </button>
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`w-full text-left px-4 py-2.5 text-xs font-bold rounded-xl ${currentTab === 'dashboard' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                📊 My Complaints
              </button>
              <button
                onClick={() => handleNavClick('ai-architecture')}
                className={`w-full text-left px-4 py-2.5 text-xs font-bold rounded-xl ${currentTab === 'ai-architecture' ? 'bg-indigo-900 text-white' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                ⚡ How AI Works
              </button>
            </>
          )}

          {role === 'officer' && (
            <>
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`w-full text-left px-4 py-2.5 text-xs font-bold rounded-xl ${currentTab === 'dashboard' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                Officer Command Dashboard
              </button>
              <button
                onClick={() => handleNavClick('ai-architecture')}
                className={`w-full text-left px-4 py-2.5 text-xs font-bold rounded-xl ${currentTab === 'ai-architecture' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                AI Routing Architecture
              </button>
            </>
          )}

          {role === 'admin' && (
            <>
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`w-full text-left px-4 py-2.5 text-xs font-bold rounded-xl ${currentTab === 'dashboard' ? 'bg-emerald-900 text-white' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                National Control Center
              </button>
              <button
                onClick={() => handleNavClick('ai-architecture')}
                className={`w-full text-left px-4 py-2.5 text-xs font-bold rounded-xl ${currentTab === 'ai-architecture' ? 'bg-emerald-900 text-white' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                AI Pipeline & Diagnostics
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};
