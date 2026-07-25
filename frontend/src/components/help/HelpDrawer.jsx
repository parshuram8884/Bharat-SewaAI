import React from 'react';
import { X, BookOpen, ExternalLink } from 'lucide-react';
import { useHelpUiStore } from '../../stores/personalisationUiStore';
import { helpCenterService } from '../../services/helpCenterService';

export default function HelpDrawer({ userContext }) {
  const { isHelpDrawerOpen, setHelpDrawerOpen } = useHelpUiStore();

  if (!isHelpDrawerOpen) return null;

  const articles = helpCenterService.getArticles(userContext);

  return (
    <div className="fixed inset-0 z-[120] flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={() => setHelpDrawerOpen(false)}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col transform transition-transform animate-slide-left">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-900">Help Centre</h2>
          </div>
          <button 
            onClick={() => setHelpDrawerOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Suggested Articles</h3>
            <div className="space-y-3">
              {articles.map(article => (
                <a 
                  key={article.id}
                  href={`/help/articles/${article.id}`}
                  className="block p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-slate-900 group-hover:text-blue-700">{article.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 capitalize">{article.category}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-slate-200 bg-slate-50">
          <a href="/help" className="w-full inline-flex justify-center items-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm">
            View full documentation
          </a>
        </div>
      </div>
    </div>
  );
}
