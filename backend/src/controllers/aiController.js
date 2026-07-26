import aiService from '../services/aiService.js';

export const aiController = {
  handleMessage: async (req, res, next) => {
    try {
      const { message, history, contextData } = req.body;
      console.log('📥 [BACKEND RECEIVED REQUEST FROM FRONTEND]:', {
        message,
        contextData,
        timestamp: new Date().toISOString()
      });

      if (!message) {
        return res.status(400).json({ error: 'Message content is required' });
      }

      const reply = await aiService.generateChatReply(message, history || [], contextData || {});
      
      console.log('📤 [BACKEND SENDING RESPONSE TO FRONTEND]:', {
        replyLength: reply?.length,
        replyPreview: reply?.substring(0, 100) + '...',
        timestamp: new Date().toISOString()
      });

      return res.json({ reply });
    } catch (err) {
      console.error('❌ [BACKEND ERROR]:', err?.message);
      next(err);
    }
  }
};

export default aiController;
