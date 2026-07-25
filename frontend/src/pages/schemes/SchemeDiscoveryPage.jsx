import React, { useTransition } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Bookmark, Sparkles, SlidersHorizontal, RefreshCw } from 'lucide-react';
import SchemeSearchBar from '../../components/schemes/SchemeSearchBar';
import SchemeCategoryChips from '../../components/schemes/SchemeCategoryChips';
import SchemeCard from '../../components/schemes/SchemeCard';
import { SchemeListSkeleton } from '../../components/schemes/EligibilityResultComponents';
import { useSchemes, useSchemeSearch } from '../../hooks/useSchemeQuery';

export default function SchemeDiscoveryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [, startTransition] = useTransition();

  const searchQuery = searchParams.get('q') || '';
  const categoryFilter = searchParams.get('category') || 'All';
  const sortBy = searchParams.get('sort') || 'Recommended';

  const { data: searchData, isLoading: isSearchLoading, isError, refetch } = useSchemeSearch(searchQuery);
  const { data: filteredData, isLoading: isFilterLoading } = useSchemes({
    category: categoryFilter,
    sort: sortBy
  });

  const isLoading = isSearchLoading || isFilterLoading;

  const updateParam = (key, value) => {
    startTransition(() => {
      const newParams = new URLSearchParams(searchParams);
      if (value && value !== 'All' && value !== 'Recommended') {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
      setSearchParams(newParams, { replace: true });
    });
  };

  const handleSearchChange = (q) => updateParam('q', q);
  const handleClearSearch = () => updateParam('q', '');
  const handleCategorySelect = (cat) => updateParam('category', cat);
  const handleSortChange = (e) => updateParam('sort', e.target.value);

  // Combine search and filter
  let displayedSchemes = searchQuery ? searchData?.data || [] : filteredData?.data || [];
  if (searchQuery && categoryFilter !== 'All') {
    displayedSchemes = displayedSchemes.filter(
      (s) => s.category.toLowerCase() === categoryFilter.toLowerCase()
    );
  }

  return (
    <div className="bg-background text-on-background min-h-screen pb-24 font-sans">
      {/* Header Banner */}
      <header className="bg-surface border-b border-outline-variant p-4 md:p-6 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-primary">Government Schemes</h1>
              <p className="text-xs md:text-sm text-on-surface-variant">Find schemes and services suitable for you.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/schemes/recommended')}
                type="button"
                className="min-h-[44px] px-3 py-1.5 bg-primary-container/10 text-primary-container hover:bg-primary-container/20 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Sparkles className="w-4 h-4 text-secondary" />
                <span className="hidden sm:inline">Recommended</span>
              </button>
              <button
                onClick={() => navigate('/schemes/saved')}
                type="button"
                className="min-h-[44px] px-3 py-1.5 bg-amber-100 text-amber-900 hover:bg-amber-200 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Bookmark className="w-4 h-4" />
                <span className="hidden sm:inline">Saved</span>
              </button>
            </div>
          </div>

          <SchemeSearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            onClear={handleClearSearch}
          />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <SchemeCategoryChips
              selectedCategory={categoryFilter}
              onSelectCategory={handleCategorySelect}
            />

            <div className="flex items-center justify-between md:justify-end gap-2 text-xs font-semibold">
              <div className="flex items-center gap-1 text-on-surface-variant">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Sort by:</span>
              </div>
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="min-h-[38px] px-3 py-1 bg-surface-container rounded-lg border border-outline-variant text-xs font-semibold text-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Recommended">Recommended</option>
                <option value="Highest Match">Highest Match</option>
                <option value="Recently Added">Recently Added</option>
                <option value="Scheme Name">Scheme Name</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid Canvas */}
      <main className="max-w-6xl mx-auto px-4 pt-6">
        {isLoading ? (
          <SchemeListSkeleton />
        ) : isError ? (
          <div className="p-8 text-center bg-surface-container-lowest border border-outline-variant rounded-2xl my-6">
            <p className="text-sm text-error font-semibold mb-4">Failed to load schemes.</p>
            <button
              onClick={() => refetch()}
              className="min-h-[44px] px-4 py-2 bg-primary text-on-primary font-bold text-xs rounded-xl inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry</span>
            </button>
          </div>
        ) : displayedSchemes.length === 0 ? (
          <div className="p-8 text-center bg-surface-container-lowest border border-outline-variant rounded-2xl my-6">
            <h2 className="text-lg font-bold text-primary mb-1">No schemes found</h2>
            <p className="text-xs text-on-surface-variant mb-4">Try a different keyword or select another category filter.</p>
            <button
              onClick={() => setSearchParams({})}
              className="min-h-[44px] px-4 py-2 border border-outline text-primary font-bold text-xs rounded-xl hover:bg-surface-container-low"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {displayedSchemes.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
