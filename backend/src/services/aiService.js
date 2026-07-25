import genAI from '../config/gemini.js';

export const aiService = {
  /**
   * Generates a conversational reply to a user prompt using Gemini 1.5/2.0
   * @param {string} prompt - The user's query
   * @param {Array} history - Previous conversation history
   * @returns {Promise<string>} Gemini response text
   */
  generateChatReply: async (prompt, history = []) => {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const chat = model.startChat({
        history: history.map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        })),
        systemInstruction: "You are 'भारत Sewa AI', a helpful government scheme guide. Answer questions about eligibility, documents required, and process paths in a clear, brief, and locally-supportive voice.",
      });

      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini AI Service Error:', error);
      throw new Error('AI processing failed');
    }
  }
};

export default aiService;
