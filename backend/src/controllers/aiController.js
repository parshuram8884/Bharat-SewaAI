import aiService from '../services/aiService.js';

export const aiController = {
  handleMessage: async (req, res, next) => {
    try {
      const { message, history, contextData } = req.body;
      if (!message) {
        return res.status(400).json({ error: 'Message content is required' });
      }

      const reply = await aiService.generateChatReply(message, history || [], contextData || {});
      return res.json({ reply });
    } catch (err) {
      next(err);
    }
  }
};

export default aiController;
