// Mock Assistant Service for Bharat Sewa AI Phase 4 with localStorage persistence

const STORAGE_KEY = 'bharat_sewa_conversations_v1';
const ACTIVE_CONV_KEY = 'bharat_sewa_active_conv_id';

const INITIAL_SCHEMES = [
  {
    id: 'pm-fasal-bima',
    title: 'PM Fasal Bima Yojana',
    category: 'Insurance',
    categoryColor: 'bg-primary-container text-on-primary-container',
    matchPercentage: 92,
    description: 'Comprehensive risk coverage for crops from pre-sowing to post-harvest.',
    disclaimer: 'Note: Final eligibility is decided by the concerned department.',
    eligibilityUrl: '/schemes/pm-fasal-bima'
  },
  {
    id: 'pm-kisan',
    title: 'PM-KISAN',
    category: 'Financial Support',
    categoryColor: 'bg-tertiary-fixed text-on-tertiary-fixed',
    matchPercentage: 86,
    description: 'Direct benefit transfer of ₹6,000 per year to small and marginal farmers.',
    disclaimer: 'Note: Final eligibility is decided by the concerned department.',
    eligibilityUrl: '/schemes/pm-kisan'
  }
];

const DEFAULT_CONVERSATIONS = [
  {
    id: 'conv-1',
    title: 'Crop Insurance Application',
    category: 'Schemes',
    language: 'Marathi',
    date: 'Oct 12',
    isPinned: true,
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: 'मला पीक विम्यासाठी अर्ज करायचा आहे',
        timestamp: '10:24 AM',
        status: 'delivered'
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: 'I found two suitable schemes for you based on your farmer profile.',
        timestamp: '10:24 AM',
        schemes: INITIAL_SCHEMES,
        suggestionChips: ['How to apply?', 'Required Docs', 'Check Eligibility']
      }
    ]
  },
  {
    id: 'conv-2',
    title: 'Scholarship Search',
    category: 'Schemes',
    language: 'English',
    date: 'Oct 10',
    isPinned: false,
    messages: [
      {
        id: 'msg-3',
        role: 'user',
        content: 'Check scholarship eligibility for higher education',
        timestamp: '02:15 PM',
        status: 'delivered'
      },
      {
        id: 'msg-4',
        role: 'assistant',
        content: 'Here are top scholarships matched for post-secondary students in Maharashtra.',
        timestamp: '02:15 PM',
        suggestionChips: ['Post-Matric Scholarship', 'Minority Scholarship']
      }
    ]
  },
  {
    id: 'conv-3',
    title: 'Water Supply Complaint',
    category: 'Complaints',
    language: 'Hindi',
    date: 'Oct 05',
    isPinned: false,
    messages: [
      {
        id: 'msg-5',
        role: 'user',
        content: 'पानी की सप्लाई की शिकायत दर्ज करनी है',
        timestamp: '11:05 AM',
        status: 'delivered'
      },
      {
        id: 'msg-6',
        role: 'assistant',
        content: 'आपकी शिकायत दर्ज कर ली गई है। शिकायत आईडी: #WTR-88492',
        timestamp: '11:06 AM',
        suggestionChips: ['Track Complaint Status', 'Contact Helpline']
      }
    ]
  }
];

function loadConversations() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : DEFAULT_CONVERSATIONS;
  } catch (e) {
    return DEFAULT_CONVERSATIONS;
  }
}

function saveConversations(conversations) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

function getActiveConvId() {
  try {
    return localStorage.getItem(ACTIVE_CONV_KEY) || 'conv-1';
  } catch (e) {
    return 'conv-1';
  }
}

function setActiveConvId(id) {
  try {
    localStorage.setItem(ACTIVE_CONV_KEY, id);
  } catch (e) {
    console.error('Failed to set active conv id', e);
  }
}

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockAssistantService = {
  async startConversation(initialPrompt = 'Namaste! How can I help you today?') {
    await delay();
    const conversations = loadConversations();
    const newConv = {
      id: `conv-${Date.now()}`,
      title: initialPrompt.slice(0, 30) || 'New Conversation',
      category: 'General',
      language: 'English',
      date: 'Just now',
      isPinned: false,
      messages: [
        {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: initialPrompt,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestionChips: ['Find schemes for farmers', 'Check scholarship eligibility', 'File a water complaint', 'Track my application']
        }
      ]
    };
    conversations.unshift(newConv);
    saveConversations(conversations);
    setActiveConvId(newConv.id);
    return newConv;
  },

  async getConversation(id) {
    await delay();
    const conversations = loadConversations();
    const targetId = id || getActiveConvId();
    const conv = conversations.find((c) => c.id === targetId) || conversations[0] || DEFAULT_CONVERSATIONS[0];
    setActiveConvId(conv.id);
    return conv;
  },

  async sendMessage({ conversationId, text }) {
    await delay(500);
    const conversations = loadConversations();
    let conv = conversations.find((c) => c.id === (conversationId || getActiveConvId()));
    
    if (!conv) {
      conv = {
        id: `conv-${Date.now()}`,
        title: text.slice(0, 25) || 'New Conversation',
        category: 'General',
        language: 'English',
        date: 'Just now',
        isPinned: false,
        messages: []
      };
      conversations.unshift(conv);
    }

    const userMsg = {
      id: `msg-${Date.now()}-u`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered'
    };

    const isFarmerQuery = text.toLowerCase().includes('crop') || text.includes('विम') || text.includes('farmer') || text.includes('पीक') || text.includes('scheme');

    const assistantMsg = {
      id: `msg-${Date.now()}-a`,
      role: 'assistant',
      content: isFarmerQuery
        ? 'I found two suitable schemes for you based on your farmer profile.'
        : `I have processed your request for "${text}". Here are the matching details.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      schemes: isFarmerQuery ? INITIAL_SCHEMES : undefined,
      suggestionChips: isFarmerQuery
        ? ['How to apply?', 'Required Docs', 'Check Eligibility']
        : ['View Details', 'Contact Helpline', 'Track Status']
    };

    conv.messages.push(userMsg, assistantMsg);
    conv.date = 'Just now';
    saveConversations(conversations);
    setActiveConvId(conv.id);
    return { userMsg, assistantMsg, conversation: conv };
  },

  async getConversationHistory() {
    await delay(200);
    return loadConversations();
  },

  async renameConversation(id, newTitle) {
    await delay(150);
    const conversations = loadConversations();
    const conv = conversations.find((c) => c.id === id);
    if (conv) {
      conv.title = newTitle;
      saveConversations(conversations);
    }
    return conv;
  },

  async deleteConversation(id) {
    await delay(150);
    let conversations = loadConversations();
    conversations = conversations.filter((c) => c.id !== id);
    saveConversations(conversations);
    if (getActiveConvId() === id) {
      setActiveConvId(conversations[0]?.id || 'conv-1');
    }
    return { success: true, deletedId: id };
  },

  async pinConversation(id) {
    await delay(150);
    const conversations = loadConversations();
    const conv = conversations.find((c) => c.id === id);
    if (conv) {
      conv.isPinned = !conv.isPinned;
      saveConversations(conversations);
    }
    return conv;
  }
};
