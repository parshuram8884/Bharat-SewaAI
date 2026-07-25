import React from 'react';
import { Link } from 'react-router-dom';
import { useClerk, UserButton, SignedIn, SignedOut } from '@clerk/clerk-react';
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
        <SignedIn>
          <Link to="/dashboard" className="text-sm text-neutral-300 hover:text-emerald-400 transition-colors">
            Digital Locker
          </Link>
          <UserButton afterSignOutUrl="/login" />
        </SignedIn>
        <SignedOut>
          <Link to="/login">
            <Button variant="primary" size="sm">Sign In</Button>
          </Link>
        </SignedOut>
      </div>
    </nav>
  );
}

export default Navbar;
