import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  AlertCircle,
  User,
  HelpCircle,
  X
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from '../../hooks/useTranslation';

export function Sidebar({ isOpen, onClose }) {
  const { logout } = useAdminAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, iconTag: '🏠' },
    { to: '/citizens', label: 'Schemes & Services', icon: Users, iconTag: '🌾' },
    { to: '/applications', label: 'Applications', icon: FileText, iconTag: '📝' },
    { to: '/complaints', label: 'Complaints', icon: AlertCircle, iconTag: '📢' },
    { to: '/profile', label: 'Profile', icon: User, iconTag: '👤' },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-primary text-on-primary p-4 shadow-xl select-none">
      {/* Brand Header */}
      <div className="mb-6 p-3 rounded-2xl bg-black/20 border border-white/10 flex items-center justify-between gap-2 shadow-inner">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Custom SVG Indian Tricolor Badge */}
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 via-white to-green-700 p-0.5 shadow-md shrink-0 flex items-center justify-center border border-white/30">
            <div className="w-full h-full rounded-lg bg-slate-900/90 flex items-center justify-center">
              <span className="text-xs font-black text-amber-400">BS</span>
            </div>
          </div>
          <div className="truncate">
            <h1 className="text-lg font-heading font-extrabold tracking-tight text-white truncate leading-tight">
              Bharat Sewa AI
            </h1>
            <p className="text-[11px] text-emerald-300 font-extrabold truncate">
              {t('Citizen Portal')} • Jan Sewa
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer border border-white/20 shrink-0 active:scale-95 shadow-xs"
            aria-label="Close menu"
            title="Close Sidebar Menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-2 flex-1 overflow-y-auto pr-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-150 rural-touch-target ${
                  isActive
                    ? 'bg-secondary text-white font-extrabold shadow-md border-l-4 border-emerald-300'
                    : 'text-on-primary/80 hover:bg-primary-container hover:text-white'
                }`
              }
            >
              <span className="text-lg">{link.iconTag}</span>
              <span className="truncate">{t(link.label)}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Bottom Emergency Helpline Widget */}
      <div className="mt-4 p-3.5 rounded-2xl bg-primary-container/80 border border-primary-fixed-dim/30 text-on-primary space-y-2">
        <div className="flex items-center gap-2 text-xs font-extrabold text-amber-300">
          <HelpCircle className="w-4 h-4 shrink-0" />
          <span>{t('Toll-Free Helpline')}</span>
        </div>
        <p className="text-[11px] text-on-primary/80 leading-snug">
          Call <a href="tel:1915" className="font-extrabold underline text-amber-300">1915</a> for scheme assistance or speak to an officer.
        </p>
        <a
          href="https://wa.me/?text=Namaste!%20I%20need%20help%20with%20Bharat%20Sewa%20AI"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full mt-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
        >
          <span>💬 {t('WhatsApp Help')}</span>
        </a>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-64 hidden md:block z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-64 h-full shadow-2xl animate-in slide-in-from-left">
            {sidebarContent}
          </div>
          <div className="flex-1" onClick={onClose} />
        </div>
      )}
    </>
  );
}

export default Sidebar;
