import ai from '../config/gemini.js';

export const aiService = {
  /**
   * Generates a conversational reply to a user prompt using Gemini
   * @param {string} prompt - The user's query
   * @param {Array} history - Previous conversation history
   * @returns {Promise<string>} Gemini response text
   */
  generateChatReply: async (prompt, history = []) => {
    try {
      const formattedHistory = history.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        history: formattedHistory,
        config: {
          systemInstruction: "You are 'भारत Sewa AI', a helpful government scheme guide. Answer questions about eligibility, documents required, and process paths in a clear, brief, and locally-supportive voice."
        }
      });

      const response = await chat.sendMessage({ message: prompt });
      return response.text;
    } catch (error) {
      console.error('Gemini AI Service Error:', error);
      throw new Error('AI processing failed');
    }
  }
};

export default aiService;

