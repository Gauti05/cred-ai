# Credex AI Spend Audit

**Summary:** A free, zero-friction web application designed for startup founders and engineering managers to instantly audit their AI SaaS stack. It calculates overspend, surfaces cheaper alternatives, and generates high-intent leads for Credex corporate credits.

## Quick Start
1. Clone the repository.
2. `cd server` -> `npm install` -> `npm run dev` (Requires `.env` with ANTHROPIC_API_KEY, RESEND_API_KEY, MONGODB_URI)
3. In a new terminal: `cd client` -> `npm install` -> `npm run dev`
4. Run tests: `cd client` -> `npm run test`

## 5 Trade-offs Made
1. **JavaScript over TypeScript:** Prioritized rapid iteration and raw development speed for a 7-day MVP over strict type safety.
2. **Local Engine vs Server Engine:** The financial logic (`engine.js`) runs client-side to ensure instant UI feedback, avoiding round-trip latency.
3. **Base64 URL Sharing vs Database UUIDs:** To satisfy the "shareable URL" MVP requirement quickly, I encoded the results into the URL itself rather than building an entire database schema for anonymous sessions. 
4. **Hardcoded Pricing vs Web Scraping:** Pricing data is hardcoded based on manual verification rather than scraping vendor sites to ensure 100% stability and zero false positives during audits.
5. **Vitest vs Full E2E:** Focused my testing entirely on the pure math engine (`engine.test.js`) rather than building brittle Cypress UI tests, as financial accuracy is the core product value.

## Links
*   **Live App:**: 'https://cred-ai-gules.vercel.app/' 
**Walkthrough Video:** 'https://youtu.be/RFQwbF2cvNc'