import React from 'react';
import { CheckCircle2, Bookmark, BookmarkCheck, Share2 } from 'lucide-react';

export function SchemeMatchBadge({ score }) {
  if (!score) return null;
  return (
    <span className="bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
      <CheckCircle2 className="w-3.5 h-3.5" />
      {score}% Match
    </span>
  );
}

export function SchemeStatusBadge({ status = 'Open' }) {
  const isOpen = status.toLowerCase() === 'open';
  return (
    <span
      className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
        isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-700'
      }`}
    >
      {status}
    </span>
  );
}

export function SchemeSaveButton({ isSaved, onToggle, schemeName = 'scheme' }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      type="button"
      aria-label={isSaved ? `Remove ${schemeName} from saved` : `Save ${schemeName} for later`}
      className={`min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center transition-all ${
        isSaved
          ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
          : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
      }`}
    >
      {isSaved ? <BookmarkCheck className="w-5 h-5 fill-current" /> : <Bookmark className="w-5 h-5" />}
    </button>
  );
}

export function SchemeShareButton({ title, text, url }) {
  const handleShare = async (e) => {
    e.stopPropagation();
    const shareUrl = url || window.location.href;
    const shareData = {
      title: title || 'Bharat Sewa AI Scheme',
      text: `${text || 'Check out this government scheme on Bharat Sewa AI'} (Note: Final eligibility is decided by the concerned department.)`,
      url: shareUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {}
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
      } catch (err) {
        alert(`Share this link: ${shareUrl}`);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      type="button"
      aria-label={`Share ${title || 'scheme'}`}
      className="min-w-[44px] min-h-[44px] rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center transition-all"
    >
      <Share2 className="w-5 h-5" />
    </button>
  );
}
