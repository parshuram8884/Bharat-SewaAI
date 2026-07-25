import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useAdminAuth } from '../../context/AdminAuthContext';

export function AdminLayout() {
  const { isAuthenticated } = useAdminAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body-md flex">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:ml-64 transition-all duration-200 min-w-0">
        {/* Top Navbar */}
        <Navbar onToggleSidebar={() => setIsSidebarOpen(true)} />

        {/* Main Content Area */}
        <main className="flex-1 pt-20 pb-12 px-4 md:px-6 lg:px-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
