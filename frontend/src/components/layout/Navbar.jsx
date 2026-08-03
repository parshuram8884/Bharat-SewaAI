import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, LogOut, Languages, ChevronDown } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useAdminData } from '../../context/AdminDataContext';
import { useTranslation } from '../../hooks/useTranslation';

export function Navbar({ isSidebarOpen, onToggleSidebar }) {
  const { user, logout } = useAdminAuth();
  const { notifications } = useAdminData();
  const navigate = useNavigate();
  const { t, currentLang, setLanguage } = useTranslation();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const langRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languagesList = [
    { code: 'English', label: 'English', flag: '🇬🇧' },
    { code: 'Hindi', label: 'हिन्दी (Hindi)', flag: '🇮🇳' },
    { code: 'Marathi', label: 'मराठी (Marathi)', flag: '🇮🇳' },
    { code: 'Bengali', label: 'বাংলা (Bengali)', flag: '🇮🇳' },
    { code: 'Gujarati', label: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
    { code: 'Tamil', label: 'தமிழ் (Tamil)', flag: '🇮🇳' },
    { code: 'Telugu', label: 'తెలుగు (Telugu)', flag: '🇮🇳' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={`fixed top-0 right-0 left-0 ${isSidebarOpen ? 'md:left-64' : 'md:left-0'} h-16 flex justify-between items-center px-4 md:px-6 z-40 bg-surface border-b border-outline-variant/60 shadow-2xs transition-all duration-300`}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Open / Close Sidebar Button */}
        <button
          onClick={onToggleSidebar}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 font-extrabold text-xs transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0 rural-touch-target"
          title={isSidebarOpen ? 'Close Menu' : 'Open Menu'}
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
          <span className="hidden sm:inline">{isSidebarOpen ? 'Close Menu' : 'Open Menu'}</span>
        </button>

        {/* Prominent Rural Voice Search Button */}
        <Link
          to="/citizens"
          className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs md:text-sm shadow-md transition-all active:scale-95 border border-emerald-500 rural-voice-active truncate"
          title="Click to speak your query in your language"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-ping shrink-0" />
          <span className="truncate">🎙️ {t('Bol Kar Sewa Paayein')}</span>
        </Link>
      </div>

      <div className="flex items-center gap-3 pl-3 md:pl-4 border-l border-outline-variant/60">
        {/* Language Switcher Dropdown */}
        <div className="relative" ref={langRef}>
          <button
            type="button"
            onClick={() => {
              setIsLangOpen(!isLangOpen);
              if (isProfileOpen) setIsProfileOpen(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary/30 bg-primary/10 hover:bg-primary/20 text-xs font-extrabold text-primary transition-all cursor-pointer shadow-2xs"
            title="Select Language"
          >
            <Languages className="w-4 h-4 text-primary" />
            <span>{currentLang}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-primary transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
          </button>
          {isLangOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-52 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl py-1.5 z-50 max-h-64 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1 text-[10px] font-extrabold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/40 mb-1">
                🌐 Select Regional Language
              </div>
              {languagesList.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => {
                    setLanguage(l.code);
                    setIsLangOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-bold flex items-center justify-between hover:bg-surface-container transition-colors cursor-pointer ${
                    currentLang === l.code ? 'text-primary bg-primary-fixed/40 font-extrabold border-l-4 border-primary' : 'text-on-surface'
                  }`}
                >
                  <span>{l.label}</span>
                  <span>{l.flag}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="text-right hidden lg:block">
          <p className="text-sm font-extrabold text-on-surface leading-none">{user?.name || 'Citizen User'}</p>
          <p className="text-[11px] text-emerald-700 font-bold uppercase tracking-wider mt-1 flex items-center justify-end gap-1">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 via-white to-green-600 border border-slate-300 inline-block" />
            <span>{t(user?.role || 'Citizen')}</span>
          </p>
        </div>
        <div className="relative" ref={profileRef}>
          <div
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              if (isLangOpen) setIsLangOpen(false);
            }}
            className="w-10 h-10 rounded-full bg-primary text-white overflow-hidden border-2 border-primary/40 cursor-pointer flex items-center justify-center font-bold text-sm hover:scale-105 transition-transform shadow-sm"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="User Profile" className="w-full h-full object-cover" />
            ) : (
              <span>{user?.name?.substring(0, 2) || 'CU'}</span>
            )}
          </div>
          {/* Quick Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-48 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-outline-variant/30 lg:hidden">
                <p className="text-sm font-bold text-on-surface">{user?.name || 'Citizen User'}</p>
                <p className="text-xs text-on-surface-variant">{t(user?.role || 'Citizen')}</p>
              </div>
              <Link
                to="/profile"
                onClick={() => setIsProfileOpen(false)}
                className="block px-4 py-2 text-sm text-on-surface font-semibold hover:bg-surface-container transition-colors"
              >
                👤 {t('Profile')}
              </Link>
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-4 py-2 text-sm text-error font-bold hover:bg-error-container/20 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('Logout')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
