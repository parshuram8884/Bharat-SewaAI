import React from 'react';
import Button from './Button';
import { X } from 'lucide-react';

export function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-200">
      <div className={`bg-surface-container-lowest border border-outline-variant/60 rounded-2xl ${maxWidth} w-full overflow-hidden shadow-2xl transform scale-100 transition-transform duration-200`}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-outline-variant/40 flex items-center justify-between bg-surface-container-low">
          <h3 className="text-lg font-heading font-bold text-on-surface">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 text-on-surface max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
