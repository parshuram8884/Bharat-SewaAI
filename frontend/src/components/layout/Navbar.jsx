import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, LogOut, Languages, ChevronDown } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useAdminData } from '../../context/AdminDataContext';
import { useTranslation } from '../../hooks/useTranslation';

export function Navbar({ onToggleSidebar }) {
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
    <header className="fixed top-0 right-0 left-0 md:left-64 h-16 flex justify-between items-center px-4 md:px-6 z-40 bg-surface border-b border-outline-variant/60 shadow-2xs">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 rounded-lg text-on-surface-variant hover:bg-surface-container md:hidden cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-6 h-6" />
        </button>
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-outline-variant/60 bg-surface-container-low hover:bg-surface-container text-xs font-bold text-on-surface transition-all cursor-pointer shadow-2xs"
            title="Select Language"
          >
            <Languages className="w-4 h-4 text-primary" />
            <span>{currentLang}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-on-surface-variant transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
          </button>
          {isLangOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-48 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl py-1.5 z-50 max-h-64 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1 text-[10px] font-extrabold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/40 mb-1">
                {t('Language')}
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
                    currentLang === l.code ? 'text-primary bg-primary-fixed/30 font-extrabold' : 'text-on-surface'
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
          <p className="text-sm font-bold text-on-surface leading-none">{user?.name || 'Citizen User'}</p>
          <p className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold mt-1">{t(user?.role || 'Citizen')}</p>
        </div>
        <div className="relative" ref={profileRef}>
          <div
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              if (isLangOpen) setIsLangOpen(false);
            }}
            className="w-10 h-10 rounded-full bg-primary-fixed overflow-hidden border-2 border-primary-container/40 cursor-pointer flex items-center justify-center font-bold text-primary hover:scale-105 transition-transform"
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
                to="/settings"
                onClick={() => setIsProfileOpen(false)}
                className="block px-4 py-2 text-sm text-on-surface hover:bg-surface-container transition-colors"
              >
                {t('Account Settings')}
              </Link>
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error-container/20 transition-colors flex items-center gap-2 cursor-pointer"
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
