# Product Overview - Bharat Sewa AI

Bharat Sewa AI is a voice-first, multilingual digital citizen assistant built specifically for rural and semi-urban communities in India. Instead of navigating complex government portals and filing cabinets, citizens interact with a natural conversational assistant in their native language to discover schemes, auto-fill forms via OCR, and track civic grievances.

---

## 🎙️ The Elevator Pitch

### The Problem
Government welfare portals are historically built like filing cabinets, not assistants. A farmer seeking crop insurance or a student seeking a scholarship must navigate complex, text-heavy menus, answer 50-field forms, and manually type details from physical document scans. This creates massive digital literacy and language barriers, preventing critical aid from reaching vulnerable populations.

### Our Solution
**"One AI Assistant for Every Government Service"**
Bharat Sewa AI replaces complex navigation trees and forms with a friendly voice assistant. The platform allows citizens to simply speak their request (e.g., *"I need help for my farm crops"*), performs eligibility screening through 4-5 natural questions, extracts and auto-fills data using Gemini Multimodal OCR on document photos (like Aadhaar), and provides real-time tracking with offline-first support.

---

## 🚀 Core Features & Live Journeys

### 1. Conversational AI Interface
* **Voice-First Input:** Users tap a microphone to speak naturally. Integrates web speech recognition to transcribe speech instantly.
* **Text-to-Speech Read-Back:** The assistant reads questions, suggestions, and results aloud using browser synthesis, ensuring accessibility for non-literate users.
* **Smart Intent Recognition:** Powered by backend Gemini LLM prompts that categorize requests into scheme discovery or grievance reporting.

### 2. AI Eligibility Engine
* **Contextual Dialogues:** Rather than showing endless form fields, the AI conducts a short 4-5 question conversation (Age, Income, Occupation, Land Size).
* **Scheme Recommendation:** Matches profile data against active government welfare schemes (like PM-KISAN, PM Fasal Bima Yojana).
* **Trust Layer / Checklists:** Shows a transparent breakdown of matched rules and unmet rules, proving exactly why a user qualifies.

### 3. Gemini Multimodal OCR & Auto-Fill
* **Instant Scan:** Citizens upload a snapshot of Aadhaar Cards, Ration Cards, or Domicile Certificates.
* **Intelligent Extraction:** Passes image buffers to the Gemini 2.5 Flash API to extract names, DOB, address, and IDs as structured JSON.
* **One-Click Auto-Fill:** Form fields are populated automatically, reducing typing error rates to near-zero.

### 4. Smart Digital Locker & Offline Mode
* **Digital Locker Vault:** Keeps securely processed documents ready for future scheme discovery, avoiding repeat uploads.
* **Offline-Sync:** Allows complaints, coordinates, and photo uploads to be saved locally when connectivity drops, automatically syncing with Supabase once the internet returns.
