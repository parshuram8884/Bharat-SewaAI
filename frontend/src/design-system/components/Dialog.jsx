import React, { createContext, useContext, useState, useCallback } from 'react';
import { Surface } from '../foundations/Surface';
import { Typography } from '../foundations/Typography';
import { IconButton } from '../components/IconButton';

// Basic Dialog Context for programmatically opening/closing dialogs
const DialogContext = createContext(null);

export const DialogProvider = ({ children }) => {
  const [dialogs, setDialogs] = useState([]);

  const openDialog = useCallback((id, content) => {
    setDialogs(prev => [...prev.filter(d => d.id !== id), { id, content }]);
  }, []);

  const closeDialog = useCallback((id) => {
    setDialogs(prev => prev.filter(d => d.id !== id));
  }, []);

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      
      {/* Dialog Overlay Stack */}
      {dialogs.length > 0 && (
        <div className="fixed inset-0 z-[var(--ds-zIndex-modal)] flex items-center justify-center bg-[var(--ds-color-overlay-backdrop)]">
          {dialogs.map(dialog => (
            <React.Fragment key={dialog.id}>
              {dialog.content}
            </React.Fragment>
          ))}
        </div>
      )}
    </DialogContext.Provider>
  );
};

export const useDialog = () => useContext(DialogContext);

export const Dialog = ({
  title,
  description,
  onClose,
  children,
  footer,
  className = ''
}) => {
  
  // Close on escape
  React.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div 
      className="relative z-[var(--ds-zIndex-modal)] animate-in fade-in zoom-in-95 duration-200 w-full max-w-lg mx-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <Surface radius="lg" elevation="dialog" className={`flex flex-col max-h-[90vh] ${className}`}>
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--ds-color-border-default)] flex items-start justify-between">
          <div>
            <Typography variant="h3" id="dialog-title">{title}</Typography>
            {description && (
              <Typography variant="bodySmall" className="text-[var(--ds-color-text-secondary)] mt-1" id="dialog-description">
                {description}
              </Typography>
            )}
          </div>
          {onClose && (
            <IconButton 
              icon="X" 
              aria-label="Close dialog" 
              onClick={onClose}
              className="ml-4 -mt-1 -mr-2"
            />
          )}
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
        
        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 bg-[var(--ds-color-surface-muted)] border-t border-[var(--ds-color-border-default)] flex items-center justify-end gap-3 rounded-b-[var(--ds-radius-lg)]">
            {footer}
          </div>
        )}
      </Surface>
    </div>
  );
};
