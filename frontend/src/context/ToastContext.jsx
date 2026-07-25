import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => {
          let icon = <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />;
          let bg = 'bg-emerald-50 border-emerald-200 text-emerald-900';
          if (t.type === 'error') {
            icon = <XCircle className="w-5 h-5 text-rose-600 shrink-0" />;
            bg = 'bg-rose-50 border-rose-200 text-rose-900';
          } else if (t.type === 'warning') {
            icon = <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />;
            bg = 'bg-amber-50 border-amber-200 text-amber-900';
          } else if (t.type === 'info') {
            icon = <Info className="w-5 h-5 text-blue-600 shrink-0" />;
            bg = 'bg-blue-50 border-blue-200 text-blue-900';
          }

          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-center justify-between p-4 rounded-lg border shadow-lg transition-all animate-in fade-in slide-in-from-top-2 ${bg}`}
            >
              <div className="flex items-center gap-3 text-sm font-medium">
                {icon}
                <span>{t.message}</span>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="p-1 hover:bg-black/5 rounded-full transition-colors"
                aria-label="Close toast"
              >
                <X className="w-4 h-4 opacity-60" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
