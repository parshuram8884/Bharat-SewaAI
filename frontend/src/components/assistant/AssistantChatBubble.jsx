import React from 'react';
import { Bot, Check, CheckCheck } from 'lucide-react';
import SuggestedSchemeCard from './SuggestedSchemeCard';
import SuggestionChip from './SuggestionChip';

export default function AssistantChatBubble({ message, onChipClick }) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="bg-primary text-on-primary p-4 rounded-2xl rounded-br-none max-w-[85%] shadow-md">
          <p className="text-sm font-normal leading-relaxed">{message.content}</p>
          <div className="flex justify-end items-center gap-1 mt-1">
            <span className="text-[10px] opacity-70">{message.timestamp || 'Just now'}</span>
            {message.status === 'read' ? (
              <CheckCheck className="w-3.5 h-3.5 opacity-80" aria-label="Read" />
            ) : (
              <Check className="w-3.5 h-3.5 opacity-80" aria-label="Sent" />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start items-start gap-3 mb-6" aria-live="polite">
      <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shadow-sm flex-shrink-0">
        <Bot className="w-5 h-5 text-white" />
      </div>
      <div className="flex flex-col gap-3 max-w-[85%]">
        <div className="bg-surface-container-high text-on-surface p-4 rounded-2xl rounded-bl-none shadow-sm">
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>

        {message.schemes && message.schemes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
            {message.schemes.map((scheme) => (
              <SuggestedSchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        )}

        {message.suggestionChips && message.suggestionChips.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {message.suggestionChips.map((chip, idx) => (
              <SuggestionChip key={idx} label={chip} onClick={onChipClick} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
