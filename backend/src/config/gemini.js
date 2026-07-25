import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('GEMINI_API_KEY is missing. AI features will fail.');
}

export const genAI = new GoogleGenerativeAI(apiKey || 'placeholder_key');

export default genAI;
