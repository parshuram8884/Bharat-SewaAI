import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import DemoModeBanner from './DemoModeBanner';

import UniversalSearch from '../search/UniversalSearch';
import CommandPalette from '../command/CommandPalette';
import HelpDrawer from '../help/HelpDrawer';

const CitizenLayout = () => {
  const [userContext, setUserContext] = useState(null);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('bsai_user')) || { role: 'citizen', userId: 'cit_123' };
      setUserContext(u);
    } catch {
      setUserContext({ role: 'citizen', userId: 'cit_123' });
    }
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col font-sans">
      <DemoModeBanner />
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-y-auto">
          <Outlet />
        </main>
      </div>
      
      {/* Phase 17 Globals */}
      {userContext && (
        <>
          <UniversalSearch userContext={userContext} />
          <CommandPalette userContext={userContext} />
          <HelpDrawer userContext={userContext} />
        </>
      )}
    </div>
  );
};

export default CitizenLayout;
