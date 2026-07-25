import React, { useState, useEffect } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { useSearchUiStore } from '../../stores/personalisationUiStore';
import { universalSearchService } from '../../services/universalSearchService';
import { useNavigate } from 'react-router-dom';
import { searchHistoryService } from '../../services/searchHistoryService';

export default function UniversalSearch({ userContext }) {
  const { isSearchOpen, setSearchOpen, searchQuery, setSearchQuery } = useSearchUiStore();
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults([]);
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      setIsSearching(true);
      universalSearchService.search(searchQuery, userContext).then(res => {
        setResults(res);
        setIsSearching(false);
      });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, userContext]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/50 flex justify-center pt-24 pb-4 px-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl h-fit max-h-[80vh] flex flex-col overflow-hidden">
        {/* Search Input Header */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input 
            type="text"
            className="flex-1 bg-transparent border-none focus:outline-none text-lg placeholder-slate-400"
            placeholder="Search schemes, applications, modules..."
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={() => setSearchOpen(false)} className="p-1 hover:bg-slate-100 rounded-md">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Search Results Body */}
        <div className="flex-1 overflow-y-auto p-2 bg-slate-50">
          {isSearching && (
            <div className="p-8 text-center text-slate-500">Searching...</div>
          )}
          
          {!isSearching && results.length === 0 && searchQuery.length >= 2 && (
            <div className="p-8 text-center text-slate-500">No results found for "{searchQuery}"</div>
          )}

          {!isSearching && results.length === 0 && searchQuery.length < 2 && (
            <div className="p-4 text-sm text-slate-500">
              <h4 className="font-semibold mb-2">Recent Searches</h4>
              {searchHistoryService.getHistory(userContext.userId).map(h => (
                <button 
                  key={h.id} 
                  className="block w-full text-left px-3 py-2 hover:bg-slate-200 rounded-md mb-1"
                  onClick={() => setSearchQuery(h.query)}
                >
                  {h.query}
                </button>
              ))}
            </div>
          )}

          {!isSearching && results.length > 0 && (
            <div className="space-y-1">
              {results.map(item => (
                <button
                  key={item.id}
                  className="w-full text-left px-4 py-3 bg-white hover:bg-blue-50 rounded-lg border border-slate-200 transition-colors flex items-center justify-between group"
                  onClick={() => {
                    setSearchOpen(false);
                    navigate(item.route);
                  }}
                >
                  <div>
                    <h4 className="font-medium text-slate-900 group-hover:text-blue-700">{item.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 capitalize">{item.resourceType}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
