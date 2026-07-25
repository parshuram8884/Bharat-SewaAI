import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, History, Menu, LogOut } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useAdminData } from '../../context/AdminDataContext';

export function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAdminAuth();
  const { notifications } = useAdminData();
  const navigate = useNavigate();

  const unreadCount = notifications ? notifications.filter(n => n.status === 'Sent').length : 2;

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
        
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 bg-surface-container/70 rounded-full border border-transparent focus:border-primary focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm text-on-surface placeholder:text-on-surface-variant/70 transition-all"
            placeholder="Search citizens, application IDs, schemes..."
          />
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate('/notifications')}
            className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant relative transition-colors cursor-pointer"
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full animate-pulse" />
            )}
          </button>
          <button
            onClick={() => navigate('/audit-logs')}
            className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors cursor-pointer hidden sm:block"
            aria-label="History logs"
            title="System Audit Logs"
          >
            <History className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 pl-3 md:pl-4 border-l border-outline-variant/60">
          <div className="text-right hidden lg:block">
            <p className="text-sm font-bold text-on-surface leading-none">{user?.name || 'Citizen User'}</p>
            <p className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold mt-1">{user?.role || 'Citizen'}</p>
          </div>
          <div className="relative group">
            <div className="w-10 h-10 rounded-full bg-primary-fixed overflow-hidden border-2 border-primary-container/40 cursor-pointer flex items-center justify-center font-bold text-primary">
              {user?.avatar ? (
                <img src={user.avatar} alt="User Profile" className="w-full h-full object-cover" />
              ) : (
                <span>{user?.name?.substring(0, 2) || 'CU'}</span>
              )}
            </div>
            {/* Quick Profile Dropdown */}
            <div className="absolute right-0 top-12 w-48 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl py-2 hidden group-hover:block z-50">
              <div className="px-4 py-2 border-b border-outline-variant/30 lg:hidden">
                <p className="text-sm font-bold text-on-surface">{user?.name || 'Citizen User'}</p>
                <p className="text-xs text-on-surface-variant">{user?.role || 'Citizen'}</p>
              </div>
              <Link to="/settings" className="block px-4 py-2 text-sm text-on-surface hover:bg-surface-container transition-colors">
                Account Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error-container/20 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
