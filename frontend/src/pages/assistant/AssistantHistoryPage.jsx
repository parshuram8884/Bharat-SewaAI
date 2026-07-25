import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe, Search, MessageSquare, Plus, Mic } from 'lucide-react';
import ConversationCard from '../../components/assistant/ConversationCard';
import {
  useConversationHistory,
  useDeleteConversation,
  usePinConversation,
  useRenameConversation
} from '../../hooks/useAssistantQuery';
import { useAssistantUiStore } from '../../stores/assistantUiStore';

export default function AssistantHistoryPage() {
  const navigate = useNavigate();
  const { data: history = [], isLoading } = useConversationHistory();
  const deleteMutation = useDeleteConversation();
  const pinMutation = usePinConversation();
  const renameMutation = useRenameConversation();

  const { activeCategoryFilter, setActiveCategoryFilter, searchQuery, setSearchQuery } =
    useAssistantUiStore();

  const categories = ['All', 'Applications', 'Complaints', 'Schemes'];

  const filteredHistory = history.filter((item) => {
    const matchesCategory =
      activeCategoryFilter === 'All' || item.category === activeCategoryFilter;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.language?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-sans pb-24">
      {/* Top Bar */}
      <header className="w-full sticky top-0 bg-surface shadow-sm border-b border-outline-variant z-40">
        <div className="flex items-center justify-between px-4 h-[64px]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/assistant')}
              className="text-primary hover:bg-surface-container-low transition-colors p-2 rounded-full active:opacity-70"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-lg text-primary">Chat History</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/assistant/chat')}
              className="flex items-center gap-1 bg-primary text-on-primary px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-primary-container"
            >
              <Plus className="w-4 h-4" />
              <span>New Chat</span>
            </button>
            <button className="text-primary hover:bg-surface-container-low transition-colors p-2 rounded-full">
              <Globe className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 pt-6">
        {/* Search */}
        <section className="mb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full h-12 pl-12 pr-4 py-3 rounded-xl bg-surface-container border-none ring-1 ring-outline-variant focus:ring-2 focus:ring-primary transition-all text-sm font-normal placeholder:text-on-surface-variant focus:outline-none"
            />
          </div>
        </section>

        {/* Filter Pills */}
        <section className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategoryFilter === cat
                  ? 'bg-secondary-container text-on-secondary-container'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'
              }`}
            >
              {cat}
            </button>
          ))}
        </section>

        {/* List */}
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="mt-12 text-center opacity-40">
            <MessageSquare className="w-16 h-16 text-outline mx-auto mb-3" />
            <p className="text-sm font-medium">No conversations found.</p>
          </div>
        ) : (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
            {filteredHistory.map((item) => (
              <ConversationCard
                key={item.id}
                conversation={item}
                onClick={() => navigate('/assistant/chat')}
                onDelete={(id) => deleteMutation.mutate(id)}
                onPin={(id) => pinMutation.mutate(id)}
                onRename={(id, newTitle) => renameMutation.mutate({ id, newTitle })}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Mic FAB */}
      <button
        onClick={() => navigate('/assistant/listening')}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#ff8031] text-white rounded-full shadow-lg flex items-center justify-center z-40 active:scale-95 transition-transform"
        title="Voice Assistant"
      >
        <Mic className="w-7 h-7" />
      </button>
    </div>
  );
}
