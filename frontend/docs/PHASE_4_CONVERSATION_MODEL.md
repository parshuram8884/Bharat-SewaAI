# Phase 4: Conversation & Scheme Data Model

## Conversation Schema

```typescript
interface Conversation {
  id: string; // e.g. "conv-1"
  title: string; // Title of the thread
  category: 'Schemes' | 'Complaints' | 'Applications' | 'General';
  language: 'English' | 'Hindi' | 'Marathi';
  date: string; // Human readable timestamp (e.g. "Oct 12", "Just now")
  isPinned: boolean;
  messages: Message[];
}

interface Message {
  id: string; // e.g. "msg-1"
  role: 'user' | 'assistant';
  content: string;
  timestamp: string; // e.g. "10:24 AM"
  status?: 'delivered' | 'read'; // Controls single vs double checkmarks
  schemes?: SchemeRecommendation[];
  suggestionChips?: string[];
}

interface SchemeRecommendation {
  id: string;
  title: string;
  category: string;
  categoryColor: string;
  matchPercentage: number; // e.g. 92
  description: string;
  disclaimer: string; // "Note: Final eligibility decision rests with the concerned department."
  eligibilityUrl: string;
}
```

## Persistence Schema (`localStorage`)
- `bharat_sewa_conversations_v1`: JSON array of `Conversation` objects.
- `bharat_sewa_active_conv_id`: Active conversation ID string.
- `bharat_sewa_draft_text`: Current unsaved chat composer input text.
