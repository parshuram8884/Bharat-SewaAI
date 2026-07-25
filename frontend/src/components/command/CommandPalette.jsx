import React, { useEffect, useState } from 'react';
import { Command, X } from 'lucide-react';
import { useCommandPaletteUiStore, useSearchUiStore } from '../../stores/personalisationUiStore';
import { commandPaletteService } from '../../services/commandPaletteService';
import { useNavigate } from 'react-router-dom';

export default function CommandPalette({ userContext }) {
  const { isOpen, setIsOpen } = useCommandPaletteUiStore();
  const { setSearchOpen } = useSearchUiStore();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const commands = commandPaletteService.getCommands(userContext);
  
  const filteredCommands = query ? commands.filter(c => 
    c.labelKey.toLowerCase().includes(query.toLowerCase())
  ) : commands;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  const executeCommand = (cmd) => {
    setIsOpen(false);
    if (cmd.route) {
      navigate(cmd.route);
    } else if (cmd.actionKey === 'OPEN_SEARCH') {
      setSearchOpen(true);
    } else if (cmd.actionKey === 'TOGGLE_HIGH_CONTRAST') {
      // Dispatch mock contrast toggle
      alert('High contrast preference toggled via command palette');
    } else if (cmd.actionKey === 'OPEN_DEMO_RESET') {
      alert('Demo Reset Dialog would open here');
    }
  };

  return (
    <div className="fixed inset-0 z-[110] bg-slate-900/60 flex justify-center pt-32 pb-4 px-4 overflow-y-auto backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl h-fit max-h-[70vh] flex flex-col overflow-hidden ring-1 ring-slate-200">
        <div className="p-3 border-b border-slate-200 flex items-center gap-3">
          <Command className="w-5 h-5 text-blue-600" />
          <input 
            type="text"
            className="flex-1 bg-transparent border-none focus:outline-none text-base placeholder-slate-400"
            placeholder="Type a command or search..."
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="hidden sm:inline-block px-2 py-1 bg-slate-100 text-xs font-semibold text-slate-500 rounded border border-slate-200">ESC</kbd>
        </div>
        <div className="flex-1 overflow-y-auto p-2 bg-slate-50">
          {filteredCommands.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-500">No commands found.</div>
          ) : (
            <div className="space-y-1">
              {filteredCommands.map(cmd => (
                <button
                  key={cmd.id}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-between group ${cmd.destructive ? 'hover:bg-red-50 hover:text-red-700' : 'hover:bg-blue-50 hover:text-blue-700 text-slate-700'}`}
                  onClick={() => executeCommand(cmd)}
                >
                  <span className="font-medium">{cmd.labelKey}</span>
                  <span className="text-xs text-slate-400 group-hover:text-blue-400">{cmd.group}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
