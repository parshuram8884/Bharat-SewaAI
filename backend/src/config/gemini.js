import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('GEMINI_API_KEY is missing. AI features will fail.');
}

export const ai = new GoogleGenAI({ apiKey: apiKey || 'placeholder_key' });

export default ai;

