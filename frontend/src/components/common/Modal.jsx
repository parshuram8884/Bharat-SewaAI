import React from 'react';
import Button from './Button';

export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl transform scale-100 transition-transform duration-300">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-100">{title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>
        
        {/* Content */}
        <div className="px-6 py-4 text-neutral-300">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
