import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Icon } from '../foundations/Icon';
import { Typography } from '../foundations/Typography';
import { Surface } from '../foundations/Surface';

export const DesignSystemLayout = () => {
  const location = useLocation();
  
  const navGroups = [
    {
      title: 'Design System',
      links: [
        { to: '/design-system', label: 'Overview', icon: 'Book' },
        { to: '/design-system/tokens', label: 'Design Tokens', icon: 'Palette' },
        { to: '/design-system/foundations', label: 'Foundations', icon: 'LayoutTemplate' },
      ]
    },
    {
      title: 'Components',
      links: [
        { to: '/design-system/components', label: 'Component Catalogue', icon: 'Component' },
        { to: '/design-system/patterns', label: 'Patterns & States', icon: 'Layers' },
      ]
    },
    {
      title: 'Governance',
      links: [
        { to: '/design-system/diagnostics', label: 'UI Diagnostics', icon: 'Stethoscope' },
        { to: '/design-system/migration-status', label: 'Migration Tracker', icon: 'ArrowRightLeft' },
        { to: '/design-system/visual-review', label: 'Visual Review', icon: 'Eye' },
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-[var(--ds-color-surface-muted)] text-[var(--ds-color-text-primary)] font-sans flex-col overflow-hidden">
      
      {/* Top Header */}
      <header className="h-14 bg-[var(--ds-color-surface-default)] border-b border-[var(--ds-color-border-default)] flex items-center justify-between px-6 shrink-0 z-[var(--ds-zIndex-sticky)]">
        <div className="flex items-center gap-3">
          <div className="bg-[var(--ds-color-primary-default)] text-white p-1.5 rounded">
            <Icon name="Figma" size={18} />
          </div>
          <Typography variant="label">BSAI Design System</Typography>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/officer/dashboard" className="text-sm text-[var(--ds-color-text-secondary)] hover:text-[var(--ds-color-primary-default)] flex items-center gap-1">
            <Icon name="ArrowLeft" size={16} /> Back to Portal
          </Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Surface as="aside" className="w-64 border-r border-[var(--ds-color-border-default)] bg-[var(--ds-color-surface-default)] flex flex-col overflow-y-auto hidden md:flex">
          <nav className="p-4 space-y-6">
            {navGroups.map((group, i) => (
              <div key={i}>
                <Typography variant="caption" className="uppercase tracking-wider font-semibold ml-3 mb-2">
                  {group.title}
                </Typography>
                <div className="space-y-1">
                  {group.links.map(link => {
                    const isActive = location.pathname === link.to || (link.to !== '/design-system' && location.pathname.startsWith(link.to));
                    return (
                      <Link 
                        key={link.to} 
                        to={link.to}
                        className={`flex items-center gap-3 px-3 py-2 rounded-[var(--ds-radius-md)] text-sm transition-colors ${
                          isActive 
                          ? 'bg-[var(--ds-color-primary-subtle)] text-[var(--ds-color-primary-default)] font-medium' 
                          : 'text-[var(--ds-color-text-secondary)] hover:bg-[var(--ds-color-surface-muted)] hover:text-[var(--ds-color-text-primary)]'
                        }`}
                      >
                        <Icon name={link.icon} size={18} />
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </Surface>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6 md:p-8 relative">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
