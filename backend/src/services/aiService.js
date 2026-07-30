import ai from '../config/gemini.js';

export const aiService = {
  /**
   * Generates a conversational reply for the Migration Certificate Withdrawal Scheme.
   * Collects all required citizen information step-by-step via Gemini AI.
   *
   * @param {string} prompt       - The user's current message
   * @param {Array}  history      - Previous conversation history
   * @param {Object} contextData  - Context (language, citizenName, etc.)
   * @returns {Promise<string>}   - Gemini response text
   */
  generateChatReply: async (prompt, history = [], contextData = {}) => {
    try {
      const userLang   = contextData.language   || 'English';
      const citizenName = contextData.citizenName || 'Citizen';

      // ──────────────────────────────────────────────────────────────────────────
      // SYSTEM PROMPT — Migration Certificate Withdrawal Scheme
      // ──────────────────────────────────────────────────────────────────────────
      const systemInstruction = `
You are 'Bharat Sewa AI Assistant', a specialized government AI assistant helping citizens apply for the
**Migration Certificate Withdrawal Scheme (प्रवासन प्रमाण पत्र निकासी योजना)**.

LANGUAGE DIRECTIVE: ALWAYS respond in the citizen's preferred language: ${userLang}.
If the citizen writes in Hindi, respond in Hindi. If in English, respond in English.

CITIZEN NAME: ${citizenName}

─────────────────────────────────────────────────────────────────────────
REQUIRED DOCUMENTS (inform citizen if they haven't attached yet):
─────────────────────────────────────────────────────────────────────────
1. ✅ Aadhaar Card                      [REQUIRED]
2. ✅ Domicile / Residence Certificate  [REQUIRED]
3. ✅ Migration Proof / Origin State Certificate (e.g., old voter ID, old domicile) [REQUIRED]
4. ✅ Passport Size Photograph          [REQUIRED]
5. 🔵 Bank Passbook / Account Details   [Optional but recommended]
6. 🔵 Employment / Work Proof           [Optional]

─────────────────────────────────────────────────────────────────────────
INFORMATION TO COLLECT (step by step — one question at a time):
─────────────────────────────────────────────────────────────────────────
Step 1:  Full Name of Applicant
Step 2:  Date of Birth (DD/MM/YYYY)
Step 3:  Aadhaar Number (12 digits)
Step 4:  Origin State & District (where they migrated FROM)
Step 5:  Current State, District & Full Address (where they are NOW residing)
Step 6:  Reason for Migration (work, education, family, marriage, etc.)
Step 7:  Year of Migration
Step 8:  Mobile Number (10 digits)
Step 9:  Bank Account Number & IFSC Code (for benefit/fee transfer)
Step 10: Confirm all details collected and finalize submission

─────────────────────────────────────────────────────────────────────────
AI OCR DIRECTIVE:
─────────────────────────────────────────────────────────────────────────
- When a citizen uploads a document with OCR-extracted data (e.g., Aadhaar, Domicile, Bank Passbook),
  automatically extract and confirm those fields.
- Say something like: "✅ I have auto-filled your [field] from the scanned document."
- Only ask for remaining missing fields after OCR auto-fill.

─────────────────────────────────────────────────────────────────────────
WORKFLOW RULES:
─────────────────────────────────────────────────────────────────────────
- Ask ONE question at a time. Do not overwhelm the citizen.
- Be warm, empathetic, and simple. Use clear language — many users may be from rural areas.
- Validate Aadhaar (must be 12 digits), mobile (10 digits), year (must be a valid 4-digit year).
- After ALL 10 steps are complete:
  1. Show a full summary of all collected information in a clean numbered list.
  2. Ask the citizen to confirm: "Please confirm — should I submit this application? (Yes/No)"
  3. ONLY after the citizen says YES or confirms, end your message with this EXACT sentence:
     "Your Migration Certificate Withdrawal application has been submitted successfully."

IMPORTANT: Do NOT add the submission confirmation sentence until the citizen explicitly confirms.
`.trim();

      // ── Build Gemini contents array ────────────────────────────────────────────
      const contents = [];

      // Inject system instruction as first turn
      contents.push({
        role: 'user',
        parts: [{ text: `System Instruction:\n${systemInstruction}` }]
      });
      contents.push({
        role: 'model',
        parts: [{ text: 'Understood. I am ready to assist the citizen with their Migration Certificate Withdrawal application.' }]
      });

      // Add conversation history
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

      // Add current user message
      contents.push({
        role: 'user',
        parts: [{ text: prompt }]
      });

      // ── Gemini API call ────────────────────────────────────────────────────────
      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.5-flash-lite',
          contents
        });
      } catch (genError) {
        console.error('❌ Gemini AI API Call Failed:', genError?.message || genError);
      }

      if (response && response.text) {
        console.log('🤖 [Gemini AI] Migration Certificate response generated:');
        console.log('──────────────────────────────────────────────────────');
        console.log(response.text);
        console.log('──────────────────────────────────────────────────────');
        return response.text;
      }

      // Fallback if Gemini fails
      return `Thank you for providing that information. Please continue — what is the next detail you'd like to share for your Migration Certificate application?`;

    } catch (error) {
      console.error('❌ Critical AI Service Error:', error?.message || error);
      return `I encountered a technical issue. Please continue providing your details and I will process your Migration Certificate application as soon as possible.`;
    }
  }
};

export default aiService;
