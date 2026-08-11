import React, { useState } from 'react';
import { translate, Language } from '../services/i18n';
import { UserRole, Notification } from '../types';
import { Bell, Globe, Menu, X, Landmark, User as UserIcon, LogOut } from 'lucide-react';

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
    if (role === 'admin') return 'bg-emerald-500 text-white';
    if (role === 'officer') return 'bg-indigo-600 text-white';
    return 'bg-orange-500 text-white';
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Tri-Color Border Bar Accent */}
      <div className="h-1 bg-gradient-to-r from-orange-500 via-white to-emerald-600"></div>

      {/* Emblem Strip */}
      <div className="bg-slate-100 py-1 text-[10px] text-slate-500 px-4 md:px-12 flex justify-between items-center border-b border-slate-200">
        <div className="flex items-center gap-1.5 font-semibold">
          <span>🇮🇳</span>
          <span>Government of India</span>
          <span className="text-slate-300">|</span>
          <span className="hidden sm:inline">Ministry of Electronics & Information Technology (MeitY)</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Accessibility controls */}
          <div className="flex items-center gap-1 border-r border-slate-300 pr-3">
            <button onClick={() => onFontSizeChange(0.9)} className="px-1.5 py-0.5 hover:bg-slate-200 rounded font-bold text-[9px] border border-slate-300 bg-white text-slate-700">A-</button>
            <button onClick={() => onFontSizeChange(1.0)} className="px-1.5 py-0.5 hover:bg-slate-200 rounded font-bold text-[9px] border border-slate-300 bg-white text-slate-750">A</button>
            <button onClick={() => onFontSizeChange(1.15)} className="px-1.5 py-0.5 hover:bg-slate-200 rounded font-bold text-[9px] border border-slate-300 bg-white text-slate-700">A+</button>
          </div>
          <button 
            onClick={() => onHighContrastChange(!highContrast)} 
            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-[9px] font-bold border border-slate-700 flex items-center gap-1"
          >
            🌓 Contrast
          </button>
          <span className="text-slate-300">|</span>
          <span className="font-semibold tracking-wider text-orange-600">JanSetu-AI Civic Portal</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="mx-auto px-4 md:px-12 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('home')}>
          <div className="p-2.5 bg-slate-950 text-white rounded-lg flex items-center justify-center">
            <Landmark size={24} className="text-orange-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">
              {translate('title', lang)}
            </h1>
            <p className="text-[10px] text-slate-500 mt-1 font-semibold tracking-wide uppercase">
              {translate('tagline', lang)}
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {role === 'citizen' && (
            <>
              <button
                onClick={() => handleNavClick('home')}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${currentTab === 'home' ? 'bg-slate-100 text-slate-950 font-bold' : 'text-slate-600 hover:text-slate-950'}`}
              >
                {translate('nav_home', lang)}
              </button>
              <button
                onClick={() => handleNavClick('lodge')}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${currentTab === 'lodge' ? 'bg-slate-100 text-slate-950 font-bold' : 'text-slate-600 hover:text-slate-950'}`}
              >
                {translate('nav_lodge', lang)}
              </button>
              <button
                onClick={() => handleNavClick('track')}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${currentTab === 'track' ? 'bg-slate-100 text-slate-950 font-bold' : 'text-slate-600 hover:text-slate-950'}`}
              >
                {translate('nav_track', lang)}
              </button>
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${currentTab === 'dashboard' ? 'bg-slate-100 text-slate-950 font-bold' : 'text-slate-600 hover:text-slate-950'}`}
              >
                {translate('nav_my_grievances', lang)}
              </button>
              <button
                onClick={() => handleNavClick('ai-architecture')}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${currentTab === 'ai-architecture' ? 'bg-slate-100 text-slate-950 font-bold' : 'text-slate-600 hover:text-slate-950'}`}
              >
                How AI Works
              </button>
            </>
          )}

          {role === 'officer' && (
            <>
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${currentTab === 'dashboard' ? 'bg-slate-100 text-slate-950 font-bold' : 'text-slate-600 hover:text-slate-950'}`}
              >
                Officer Dashboard
              </button>
              <button
                onClick={() => handleNavClick('ai-architecture')}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${currentTab === 'ai-architecture' ? 'bg-slate-100 text-slate-950 font-bold' : 'text-slate-600 hover:text-slate-950'}`}
              >
                AI Architecture
              </button>
            </>
          )}

          {role === 'admin' && (
            <>
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${currentTab === 'dashboard' ? 'bg-slate-100 text-slate-950 font-bold' : 'text-slate-600 hover:text-slate-950'}`}
              >
                Command Center
              </button>
              <button
                onClick={() => handleNavClick('ai-architecture')}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${currentTab === 'ai-architecture' ? 'bg-slate-100 text-slate-950 font-bold' : 'text-slate-600 hover:text-slate-950'}`}
              >
                AI Pipeline
              </button>
            </>
          )}
        </nav>

        {/* User controls */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="p-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 flex items-center gap-1 text-sm font-medium"
            >
              <Globe size={18} />
              <span className="hidden md:inline">
                {lang === 'en' ? 'English' : lang === 'hi' ? 'हिन्दी' : 'ગુજરાતી'}
              </span>
            </button>
            
            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-32 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50">
                <button
                  onClick={() => { onLangChange('en'); setIsLangDropdownOpen(false); }}
                  className={`w-full text-left px-3.5 py-1.5 text-xs hover:bg-slate-50 font-semibold ${lang === 'en' ? 'text-orange-500' : 'text-slate-700'}`}
                >
                  English
                </button>
                <button
                  onClick={() => { onLangChange('hi'); setIsLangDropdownOpen(false); }}
                  className={`w-full text-left px-3.5 py-1.5 text-xs hover:bg-slate-50 font-semibold ${lang === 'hi' ? 'text-orange-500' : 'text-slate-700'}`}
                >
                  हिन्दी (Hindi)
                </button>
                <button
                  onClick={() => { onLangChange('gu'); setIsLangDropdownOpen(false); }}
                  className={`w-full text-left px-3.5 py-1.5 text-xs hover:bg-slate-50 font-semibold ${lang === 'gu' ? 'text-orange-500' : 'text-slate-700'}`}
                >
                  ગુજરાતી (Guj)
                </button>
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 relative"
            >
              <Bell size={18} />
              {unreadNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full text-[9px] font-bold h-4 w-4 flex items-center justify-center animate-pulse">
                  {unreadNotifications.length}
                </span>
              )}
            </button>
            
            {isNotifOpen && (
              <div className="absolute right-0 mt-1.5 w-72 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50 max-h-80 overflow-y-auto">
                <div className="px-4 py-1.5 border-b border-slate-100 flex justify-between items-center">
                  <span className="font-bold text-xs text-slate-900">Notifications</span>
                  <span className="text-[10px] text-slate-400 font-semibold">{notifications.length} Total</span>
                </div>
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400 font-medium">No new notifications.</div>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id}
                      onClick={() => { onMarkNotifRead(n.id); handleNavClick('dashboard'); setIsNotifOpen(false); }}
                      className={`px-4 py-2.5 border-b border-slate-100 hover:bg-slate-50 cursor-pointer text-xs transition-all ${n.isRead ? 'opacity-60' : 'bg-orange-50/40 font-semibold'}`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">{n.title}</span>
                        {!n.isRead && <span className="h-1.5 w-1.5 bg-orange-500 rounded-full"></span>}
                      </div>
                      <p className="text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                      <span className="text-[9px] text-slate-400 mt-1 block">{n.grievanceId}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* User profile identifier */}
          <div className="hidden sm:flex items-center gap-2 border-l border-slate-200 pl-3">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${getRoleColor()}`}>
              {role}
            </span>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-900 leading-none">{userName}</p>
              <p className="text-[10px] text-slate-400 leading-none mt-1">ID: {role === 'citizen' ? 'usr_citizen' : 'usr_officer'}</p>
            </div>
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 flex flex-col gap-2">
          {role === 'citizen' && (
            <>
              <button
                onClick={() => handleNavClick('home')}
                className={`w-full text-left px-4 py-2 text-sm font-semibold rounded-lg ${currentTab === 'home' ? 'bg-slate-100 text-slate-950' : 'text-slate-600'}`}
              >
                {translate('nav_home', lang)}
              </button>
              <button
                onClick={() => handleNavClick('lodge')}
                className={`w-full text-left px-4 py-2 text-sm font-semibold rounded-lg ${currentTab === 'lodge' ? 'bg-slate-100 text-slate-950' : 'text-slate-600'}`}
              >
                {translate('nav_lodge', lang)}
              </button>
              <button
                onClick={() => handleNavClick('track')}
                className={`w-full text-left px-4 py-2 text-sm font-semibold rounded-lg ${currentTab === 'track' ? 'bg-slate-100 text-slate-950' : 'text-slate-600'}`}
              >
                {translate('nav_track', lang)}
              </button>
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`w-full text-left px-4 py-2 text-sm font-semibold rounded-lg ${currentTab === 'dashboard' ? 'bg-slate-100 text-slate-950' : 'text-slate-600'}`}
              >
                {translate('nav_my_grievances', lang)}
              </button>
              <button
                onClick={() => handleNavClick('ai-architecture')}
                className={`w-full text-left px-4 py-2 text-sm font-semibold rounded-lg ${currentTab === 'ai-architecture' ? 'bg-slate-100 text-slate-950' : 'text-slate-600'}`}
              >
                How AI Works
              </button>
            </>
          )}

          {role === 'officer' && (
            <>
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`w-full text-left px-4 py-2 text-sm font-semibold rounded-lg ${currentTab === 'dashboard' ? 'bg-slate-100 text-slate-950' : 'text-slate-600'}`}
              >
                Officer Dashboard
              </button>
              <button
                onClick={() => handleNavClick('ai-architecture')}
                className={`w-full text-left px-4 py-2 text-sm font-semibold rounded-lg ${currentTab === 'ai-architecture' ? 'bg-slate-100 text-slate-950' : 'text-slate-600'}`}
              >
                AI Architecture
              </button>
            </>
          )}

          {role === 'admin' && (
            <>
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`w-full text-left px-4 py-2 text-sm font-semibold rounded-lg ${currentTab === 'dashboard' ? 'bg-slate-100 text-slate-950' : 'text-slate-600'}`}
              >
                Command Center
              </button>
              <button
                onClick={() => handleNavClick('ai-architecture')}
                className={`w-full text-left px-4 py-2 text-sm font-semibold rounded-lg ${currentTab === 'ai-architecture' ? 'bg-slate-100 text-slate-950' : 'text-slate-600'}`}
              >
                AI Pipeline
              </button>
            </>
          )}
          
          <div className="border-t border-slate-100 pt-2.5 mt-1 flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${getRoleColor()}`}>
                {role}
              </span>
              <span className="text-xs font-bold text-slate-900">{userName}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
