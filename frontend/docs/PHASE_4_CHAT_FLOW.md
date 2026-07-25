# Phase 4: Voice & Chat User Interaction Flows

## Required Voice & Navigation Route Flow

```
[ /assistant ]  <--- Home with Suggested Actions
       │
       ▼ (Tap Microphone)
[ /assistant/listening ] <--- Pulse Visualizer & Waveform Animation
       │
       ▼ (Stop & Confirm)
[ /assistant/transcript ] <--- Transcript Confirmation Card ("Did I get that right?")
       │
       ▼ (Yes, Continue)
[ /assistant/thinking ] <--- AI Step Checklist ("Understanding intent...")
       │
       ▼ (Processing Complete)
[ /assistant/chat ] <--- Main Chat Thread with Scheme Recommendations & Suggestion Chips
```

## History Management Flow

```
[ /assistant/history ] <--- Searchable List & Category Filter Pills (All / Schemes / Complaints / Applications)
       │
       ├─► (Tap Conversation Card) ──► [ /assistant/chat ] (Restores target thread)
       ├─► (Context Menu -> Pin) ──► Updates isPinned in localStorage
       ├─► (Context Menu -> Rename) ──► Inline prompt & title update
       └─► (Context Menu -> Delete) ──► Confirmation modal -> Removes thread
```

## Error Recovery Flow

```
[ Any Simulated Failure ]
       │
       ▼
[ /assistant/error ] <--- "Taking a Quick Nap" Fallback Card
       │
       ├─► (Tap Retry) ──► [ /assistant ]
       └─► (Tap Manual Request) ──► [ /assistant/chat ]
```
