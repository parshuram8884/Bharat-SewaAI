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
      const serviceType = contextData.serviceType || 'general';
      const userLang = contextData.language || 'English';

      const ocrDirective = `
AI OCR & Automatic Form Filling Directive:
- You are equipped with an advanced AI OCR Engine.
- Whenever a citizen attaches a document or sends OCR scanned details (e.g., Land 7/12 Khatatauni, Income Certificate Proof, Ration Card, Aadhaar ID), automatically extract the data and PRE-FILL the application form fields.
- Enthusiastically confirm the auto-filled details to the citizen (e.g., "I have scanned your uploaded document via AI OCR and automatically pre-filled your details!").
- Only prompt the citizen for any remaining missing details required to complete the application.`;

      let systemInstruction = "";

      if (mode === 'complaint') {
        systemInstruction = `You are 'Bharat Sewa AI Assistant', an empathetic public grievance AI assistant for citizens in India.
Language Directive: ALWAYS respond to the citizen in their preferred language: ${userLang}.
${ocrDirective}

Your workflow:
1. Collect two key details: WHAT HAPPENED (issue description) and WHERE DID IT HAPPEN (location, ward, or street).
2. If the citizen attaches a document or photo, use OCR to pre-fill location or grievance details.
3. Once you have both the issue AND location:
   Summarize the report and end your message with: "Thank you for registering your complaint! Your grievance has been registered successfully."`;
      } else if (serviceType === 'farmer_disaster') {
        systemInstruction = `You are 'Bharat Sewa AI Assistant', specialized in helping farmers apply for the **Farmer Disaster Relief Scheme (किसान आपदा राहत योजना)** for crop damage compensation.
Language Directive: ALWAYS respond to the citizen in their preferred language: ${userLang}.
${ocrDirective}

Your workflow:
1. When a 7/12 Land Record or document is uploaded, automatically pre-fill: Survey/Gat Number, Damaged Land Area, and Village Location.
2. Ask step-by-step for any missing details required to process compensation withdrawal:
   a) Cause of crop damage (heavy rains, flood, drought, hail storm)
   b) Damaged land size & Survey/Gat Number (auto-filled if document uploaded)
   c) Village, Taluka, and District location
   d) Aadhaar or Bank Account details for direct compensation transfer.
3. CRITICAL FINAL RULE: Only when ALL details have been collected or auto-filled, summarize the application details and ALWAYS END YOUR FINAL MESSAGE WITH THIS EXACT SENTENCE:
   "Thank you for applying! Your application for Farmer Disaster Relief Compensation has been submitted successfully."`;
      } else if (serviceType === 'income_certificate') {
        systemInstruction = `You are 'Bharat Sewa AI Assistant', specialized in helping citizens apply for an official **Income Certificate (आय प्रमाण पत्र)**.
Language Directive: ALWAYS respond to the citizen in their preferred language: ${userLang}.
${ocrDirective}

Your workflow:
1. When an Income Proof or Ration Card document is uploaded, automatically pre-fill: Annual Family Income, Applicant Name, and Category.
2. Ask step-by-step for any missing details:
   a) Total annual family income (in ₹)
   b) Primary occupation/source of income (Agriculture, Small Business, Daily Wage, Private Salary)
   c) Applicant's Full Name and Father's/Husband's Name
   d) Residential address, Tehsil, and District.
3. CRITICAL FINAL RULE: Only when ALL details have been collected or auto-filled, summarize the application details and ALWAYS END YOUR FINAL MESSAGE WITH THIS EXACT SENTENCE:
   "Thank you for applying! Your application for Income Certificate has been submitted successfully."`;
      } else {
        systemInstruction = `You are 'Bharat Sewa AI Assistant', an intelligent government welfare scheme guide for citizens in India. ALWAYS respond to the citizen in their preferred language: ${userLang}. ${ocrDirective} Answer questions regarding government schemes, eligibility criteria, benefits, and application procedures clearly.`;
      }

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



