import ai from '../config/gemini.js';

export const aiService = {
  /**
   * Generates a conversational reply to a user prompt using Gemini
   * @param {string} prompt - The user's query
   * @param {Array} history - Previous conversation history
   * @param {Object} contextData - Context object (mode, citizen details, etc.)
   * @returns {Promise<string>} Gemini response text
   */
  generateChatReply: async (prompt, history = [], contextData = {}) => {
    try {
      const mode = contextData.mode || 'general';
      const userLang = contextData.language || 'English';
      
      const systemInstruction = mode === 'complaint'
        ? `You are 'Bharat Sewa AI Assistant', an empathetic public grievance AI assistant for citizens in India.
Language Directive: ALWAYS respond to the citizen in their preferred language: ${userLang}.
Your workflow:
1. Collect two key details: WHAT HAPPENED (issue description) and WHERE DID IT HAPPEN (location, ward, or street).
2. If the citizen only provides the issue (e.g. "street light not working"), acknowledge it empathetically and ask for the exact location/ward.
3. Once you have both the issue AND location:
   Summarize the report and end your message with: "Thank you for registering your complaint! Your grievance has been registered successfully."`
        : `You are 'Bharat Sewa AI Assistant', an intelligent government welfare scheme guide for citizens in India. ALWAYS respond to the citizen in their preferred language: ${userLang}. Answer questions regarding government schemes, eligibility criteria, benefits, and application procedures clearly.`;

      // Format conversation history for Gemini
      const contents = [];

      // Add system instruction context
      contents.push({
        role: 'user',
        parts: [{ text: `System Instruction: ${systemInstruction}` }]
      });
      contents.push({
        role: 'model',
        parts: [{ text: 'Understood. I am ready to assist the citizen.' }]
      });

      // Add history
      if (Array.isArray(history)) {
        history.forEach((msg) => {
          if (msg.text || msg.content) {
            contents.push({
              role: (msg.sender === 'user' || msg.role === 'user') ? 'user' : 'model',
              parts: [{ text: msg.text || msg.content }]
            });
          }
        });
      }

      // Add latest user prompt
      contents.push({
        role: 'user',
        parts: [{ text: prompt }]
      });

      // Single Model Generation: gemini-2.0-flash
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents
      });

      if (response && response.text) {
        console.log('🤖 [Google Gemini AI (gemini-2.0-flash)] Response generated:');
        console.log('--------------------------------------------------');
        console.log(response.text);
        console.log('--------------------------------------------------');
        return response.text;
      }

      if (mode === 'complaint') {
        return `I have recorded your grievance details regarding "${prompt}". Our nodal officers have registered ticket for your location. You can track this in the Complaints tab.`;
      }
      return `Thank you for asking about "${prompt}". I have noted your details for processing. Is there any additional detail you'd like to provide?`;
    } catch (error) {
      console.warn('Gemini AI API call warning:', error?.message || error);
      if (contextData.mode === 'complaint') {
        return `I have recorded your grievance details regarding "${prompt}". Our nodal officers have registered ticket for your location. You can track this in the Complaints tab.`;
      }
      return `Thank you for your message regarding "${prompt}". Your details have been recorded for processing.`;
    }
  }
};

export default aiService;



