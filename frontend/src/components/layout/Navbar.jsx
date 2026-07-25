import React from 'react';
import { Link } from 'react-router-dom';
import { UserButton, Show } from '@clerk/react';
import Button from '../common/Button';

export function Navbar() {
  return (
    <nav className="h-16 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent tracking-wide">
          भारत Sewa
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Show when="signed-in">
          <Link to="/dashboard" className="text-sm text-neutral-300 hover:text-emerald-400 transition-colors">
            Digital Locker
          </Link>
          <UserButton afterSignOutUrl="/login" />
        </Show>
        <Show when="signed-out">
          <Link to="/login">
            <Button variant="primary" size="sm">Sign In</Button>
          </Link>
        </Show>
      </div>
    </nav>
  );
}

export default Navbar;
