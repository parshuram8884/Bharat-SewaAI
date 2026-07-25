import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import { LogOut } from 'lucide-react';

export function Navbar() {
  const { isSignedIn, user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav className="h-16 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent tracking-wide">
          भारत Sewa
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {isSignedIn ? (
          <>
            <Link to="/dashboard" className="text-sm text-neutral-300 hover:text-emerald-400 transition-colors">
              Digital Locker
            </Link>
            <span className="text-xs text-neutral-500 hidden sm:inline">
              {user?.email}
            </span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-neutral-800/50"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </>
        ) : (
          <Link to="/login">
            <Button variant="primary" size="sm">Sign In</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
