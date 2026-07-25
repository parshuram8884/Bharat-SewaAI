import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bookmark } from 'lucide-react';
import SchemeSearchBar from '../../components/schemes/SchemeSearchBar';
import SchemeCard from '../../components/schemes/SchemeCard';
import { SavedSchemeEmptyState, SchemeListSkeleton } from '../../components/schemes/EligibilityResultComponents';
import { useSavedSchemes } from '../../hooks/useSchemeQuery';

export default function SavedSchemesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading } = useSavedSchemes();

  const savedList = data?.data || [];
  const filteredList = savedList.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-background text-on-background min-h-screen pb-24 font-sans">
      <header className="bg-surface border-b border-outline-variant p-4 md:p-6 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/schemes')}
                type="button"
                aria-label="Back to schemes"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-surface-container-low text-primary"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-primary flex items-center gap-2">
                  <span>Saved Schemes</span>
                  <Bookmark className="w-5 h-5 text-amber-600 fill-current" />
                </h1>
                <p className="text-xs md:text-sm text-on-surface-variant">Review schemes you have bookmarked.</p>
              </div>
            </div>
          </div>

          {savedList.length > 0 && (
            <SchemeSearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
              placeholder="Search in saved schemes..."
            />
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-6">
        {isLoading ? (
          <SchemeListSkeleton />
        ) : savedList.length === 0 ? (
          <SavedSchemeEmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredList.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
