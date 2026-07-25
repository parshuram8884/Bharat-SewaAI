import React from 'react';
import { Pin, Edit2, Trash2 } from 'lucide-react';

export default function ConversationMenu({ onPin, onRename, onDelete, isPinned, onClose }) {
  return (
    <div className="absolute right-0 top-10 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg z-20 py-1 min-w-[140px] text-xs font-semibold text-on-surface">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPin();
          onClose();
        }}
        className="w-full px-3 py-2 hover:bg-surface-container flex items-center gap-2 text-left"
      >
        <Pin className="w-3.5 h-3.5" />
        <span>{isPinned ? 'Unpin' : 'Pin'}</span>
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onRename();
          onClose();
        }}
        className="w-full px-3 py-2 hover:bg-surface-container flex items-center gap-2 text-left"
      >
        <Edit2 className="w-3.5 h-3.5" />
        <span>Rename</span>
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
          onClose();
        }}
        className="w-full px-3 py-2 hover:bg-error-container text-error flex items-center gap-2 text-left"
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span>Delete</span>
      </button>
    </div>
  );
}
