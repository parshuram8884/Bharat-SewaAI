import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, ShieldCheck, UserCog } from 'lucide-react';

export function Sidebar() {
  const links = [
    { to: '/', label: 'AI Assistant', icon: MessageSquare },
    { to: '/dashboard', label: 'Locker & Status', icon: LayoutDashboard },
    { to: '/onboarding', label: 'Setup Profile', icon: UserCog },
  ];

  return (
    <aside className="w-64 border-r border-neutral-800 bg-neutral-950 flex flex-col hidden md:flex">
      <div className="flex-1 py-6 px-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50 border border-transparent'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {link.label}
            </NavLink>
          );
        })}
      </div>
      <div className="p-4 border-t border-neutral-850">
        <div className="flex items-center gap-2 text-xs text-neutral-500 bg-neutral-900/40 p-3 rounded-lg border border-neutral-800">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Secured with government-grade encryption.</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
