import ai from '../config/gemini.js';

export const visionService = {
  /**
   * Processes a document file buffer and uses Gemini Multimodal to extract key values
   * @param {Buffer} fileBuffer - File data
   * @param {string} mimeType - File mimetype (e.g. image/jpeg, application/pdf)
   * @returns {Promise<Object>} Formatted JSON containing extracted values
   */
  extractDocumentData: async (fileBuffer, mimeType) => {
    try {
      const filePart = {
        inlineData: {
          data: fileBuffer.toString('base64'),
          mimeType
        },
      };

      const prompt = `Analyze this document. Extract key values in JSON format. For Aadhaar, retrieve name, date of birth, gender, and Aadhaar number. For Ration cards, extract ration card number, state, and head of family. Respond with ONLY valid JSON code block.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [prompt, filePart],
      });

      const text = response.text;

      // Clean up markdown block wraps if present
      const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error('Vision OCR Service Error:', error);
      // Fallback structured mock data if processing fails
      return {
        extractedText: "Document processed with errors",
        error: error.message,
        documentType: "Unknown",
        fields: {}
      };
    }
  }
};

export default visionService;

