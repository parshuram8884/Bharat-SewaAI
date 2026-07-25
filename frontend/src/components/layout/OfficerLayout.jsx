import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useOfficerReviewUiStore } from '../../stores/officerReviewUiStore';
import { officerAuthService } from '../../services/officerAuthService';

const OfficerLayout = () => {
  const { isSidebarOpen, setSidebarOpen } = useOfficerReviewUiStore();
  const navigate = useNavigate();
  const location = useLocation();
  const user = officerAuthService.getCurrentUser();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    if (!user) {
      navigate('/officer/login', { replace: true });
    }
    
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [user, navigate]);

  if (!user) return null;

  const handleLogout = () => {
    officerAuthService.logout().then(() => {
      navigate('/officer/login', { replace: true });
    });
  };

  const navLinks = [
    { to: '/officer/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { to: '/officer/queue', label: 'Global Queue', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
    { to: '/officer/queue/assigned', label: 'My Applications', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  ];

  if (user.role.includes('admin')) {
    navLinks.push({ to: '/admin/analytics', label: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' });
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-100 transform transition-transform duration-200 lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center h-16 px-6 border-b border-slate-800 bg-slate-950">
          <span className="font-bold text-lg tracking-tight">Officer Portal</span>
        </div>
        <div className="p-4 border-b border-slate-800">
          <p className="font-medium truncate">{user.name}</p>
          <p className="text-xs text-slate-400 capitalize">{user.role.replace('-', ' ')}</p>
          <p className="text-xs text-slate-500 truncate mt-1">{user.departmentName}</p>
        </div>
        <nav className="p-4 space-y-1">
          {navLinks.map(link => (
            <Link 
              key={link.to} 
              to={link.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                location.pathname.startsWith(link.to) && (link.to !== '/officer/queue' || location.pathname === link.to) 
                ? 'bg-blue-600 text-white' 
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
              </svg>
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-md"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="hidden md:flex gap-2 text-sm text-slate-500">
              <span>Bharat Sewa AI</span>
              <span>/</span>
              <span className="font-medium text-slate-900 capitalize">{location.pathname.split('/')[2] || 'Portal'}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {isOffline && (
              <span className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full border border-red-200">
                <div className="w-2 h-2 rounded-full bg-red-600"></div> Offline
              </span>
            )}
            <button 
              onClick={handleLogout}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Sign out
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-slate-50 relative p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OfficerLayout;
