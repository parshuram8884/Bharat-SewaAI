import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { RuralVoiceFab } from '../common/RuralVoiceFab';
import { useAdminAuth } from '../../context/AdminAuthContext';

export function AdminLayout() {
  const { isAuthenticated } = useAdminAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return true;
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body-md flex relative">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Container */}
      <div className={`flex-1 flex flex-col transition-all duration-300 min-w-0 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-0'}`}>
        {/* Top Navbar */}
        <Navbar isSidebarOpen={isSidebarOpen} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Main Content Area */}
        <main className="flex-1 pt-20 pb-12 px-4 md:px-6 lg:px-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Giant Floating Rural Voice & Audio Button */}
      <RuralVoiceFab />
    </div>
  );
}

export default AdminLayout;
