import React, { useState } from 'react';
import { FileText, ArrowRight, MoreVertical, Pin } from 'lucide-react';
import ConversationMenu from './ConversationMenu';

export default function ConversationCard({ conversation, onClick, onDelete, onPin, onRename }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      onClick={onClick}
      className="relative flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors group cursor-pointer border-b border-outline-variant last:border-none"
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="bg-primary-container text-on-primary-container w-11 h-11 rounded-full flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold text-sm text-on-surface truncate">{conversation.title}</h3>
            {conversation.isPinned && <Pin className="w-3.5 h-3.5 text-[#ff8031] shrink-0" />}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-on-surface-variant">{conversation.date}</span>
            <span className="w-1 h-1 bg-outline-variant rounded-full" />
            <span className="bg-surface-variant text-on-surface-variant px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold">
              {conversation.language || 'English'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 ml-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onClick}
          className="p-2 text-secondary hover:bg-secondary-container/20 rounded-full transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {showMenu && (
        <ConversationMenu
          isPinned={conversation.isPinned}
          onPin={() => onPin(conversation.id)}
          onRename={() => {
            const name = prompt('Enter new conversation title:', conversation.title);
            if (name) onRename(conversation.id, name);
          }}
          onDelete={() => onDelete(conversation.id)}
          onClose={() => setShowMenu(false)}
        />
      )}
    </div>
  );
}
