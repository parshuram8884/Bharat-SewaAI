import React, { useState } from 'react';
import { Settings, Save, X, GripVertical, CheckCircle2 } from 'lucide-react';
import { usePersonalisationUiStore } from '../../stores/personalisationUiStore';

export default function DashboardCustomizer({ initialWidgets, onSave }) {
  const { isCustomizerOpen, setCustomizerOpen } = usePersonalisationUiStore();
  const [widgets, setWidgets] = useState(initialWidgets || []);

  if (!isCustomizerOpen) return null;

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const newWidgets = [...widgets];
    [newWidgets[index - 1], newWidgets[index]] = [newWidgets[index], newWidgets[index - 1]];
    setWidgets(newWidgets);
  };

  const handleMoveDown = (index) => {
    if (index === widgets.length - 1) return;
    const newWidgets = [...widgets];
    [newWidgets[index + 1], newWidgets[index]] = [newWidgets[index], newWidgets[index + 1]];
    setWidgets(newWidgets);
  };

  const toggleVisibility = (id) => {
    setWidgets(widgets.map(w => w.id === id ? { ...w, hidden: !w.hidden } : w));
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/50 flex justify-end">
      <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col animate-slide-left">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-600" />
            <h2 className="font-semibold text-slate-900">Customise Dashboard</h2>
          </div>
          <button onClick={() => setCustomizerOpen(false)} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-sm text-slate-600 mb-4">Reorder or hide widgets to personalise your view. Use the arrows to move items.</p>
          
          <div className="space-y-2">
            {widgets.map((widget, index) => (
              <div key={widget.id} className={`flex items-center gap-3 p-3 border rounded-lg ${widget.hidden ? 'bg-slate-50 border-slate-200 text-slate-400' : 'bg-white border-slate-300'}`}>
                <div className="flex flex-col gap-1">
                  <button 
                    onClick={() => handleMoveUp(index)} 
                    disabled={index === 0}
                    className="p-1 hover:bg-slate-100 rounded text-slate-400 disabled:opacity-30"
                    aria-label={`Move ${widget.label} up`}
                  >
                    ▲
                  </button>
                  <button 
                    onClick={() => handleMoveDown(index)} 
                    disabled={index === widgets.length - 1}
                    className="p-1 hover:bg-slate-100 rounded text-slate-400 disabled:opacity-30"
                    aria-label={`Move ${widget.label} down`}
                  >
                    ▼
                  </button>
                </div>
                <div className="flex-1 font-medium text-sm">{widget.label}</div>
                <button 
                  onClick={() => toggleVisibility(widget.id)}
                  className={`text-xs px-2 py-1 rounded font-medium ${widget.hidden ? 'bg-slate-200 text-slate-600' : 'bg-blue-100 text-blue-700'}`}
                >
                  {widget.hidden ? 'Hidden' : 'Visible'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-3">
          <button 
            onClick={() => setCustomizerOpen(false)}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onSave(widgets);
              setCustomizerOpen(false);
            }}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </div>
    </div>
  );
}
