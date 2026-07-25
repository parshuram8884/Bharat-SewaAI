import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  FolderOpen,
  Layers,
  AlertCircle,
  BarChart3,
  Bell,
  Settings,
  Mic,
  HelpCircle,
  LogOut,
  X
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useToast } from '../../context/ToastContext';

export function Sidebar({ isOpen, onClose }) {
  const { logout } = useAdminAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const links = [
    
    { to: '/citizens', label: 'Citizens', icon: Users },
    { to: '/applications', label: 'Applications', icon: FileText },
    { to: '/complaints', label: 'Complaints', icon: AlertCircle },
  ];

  const handleVoiceAssistant = () => {
    showToast('AI Voice Assistant activated. Listening for Hindi/English administrative commands...', 'info');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    showToast('You have been logged out successfully.', 'info');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-primary text-on-primary p-4 shadow-xl select-none">
      {/* Brand Header */}
      <div className="mb-6 px-3 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-extrabold tracking-tight text-on-primary">Bharat Sewa AI</h1>
          <p className="text-xs text-on-primary/60 font-medium">Citizen Portal</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-on-primary/70 hover:text-on-primary hover:bg-primary-container md:hidden cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-1 flex-1 overflow-y-auto pr-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-secondary-container text-on-secondary-container font-bold shadow-sm'
                    : 'text-on-primary/75 hover:bg-primary-fixed-dim/20 hover:text-on-primary'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{link.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="mt-auto border-t border-on-primary/15 pt-4 flex flex-col gap-1.5">
        <button
          onClick={handleVoiceAssistant}
          className="flex items-center justify-center gap-2 px-3 py-2.5 mb-2 bg-tertiary-container text-on-tertiary-container hover:bg-tertiary-container/90 rounded-full font-bold text-xs shadow-lg active:scale-95 transition-all cursor-pointer"
        >
          <Mic className="w-4 h-4 animate-pulse" />
          <span>Voice Assistant</span>
        </button>

        <a
          href="#help"
          onClick={(e) => {
            e.preventDefault();
            showToast('Opening Government Help & Training manual...', 'info');
          }}
          className="flex items-center gap-3 px-3.5 py-2 text-xs font-medium text-on-primary/75 hover:bg-primary-fixed-dim/20 hover:text-on-primary rounded-lg transition-colors"
        >
          <HelpCircle className="w-4 h-4 shrink-0" />
          <span>Help Center</span>
        </a>

       
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 hidden md:block z-50">
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
