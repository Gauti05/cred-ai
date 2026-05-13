# Reflection

**1. The hardest bug you hit this week, and how you debugged it**
The hardest bug was a React hydration mismatch combined with `localStorage`. Because I initialized the `tools` state directly from `localStorage`, the initial server render (or Vite's fast refresh) didn't match the client's cached state, causing the UI to flicker or drop inputs entirely. 
*Hypothesis:* The component was mounting before the browser could synchronously read the storage, or parsing an empty string was throwing a hidden JSON error. 
*Fix:* I changed the state initialization to use a lazy initializer function `useState(() => {...})`. I also added a fallback `return saved ? JSON.parse(saved) : [];` to ensure an array was always returned. This fixed the race condition.

**2. A decision you reversed mid-week, and what made you reverse it**
I originally planned to send the user's tool stack to the Anthropic API and prompt the LLM to calculate the math and output the exact savings. I reversed this on Day 3. While testing prompts, the LLM hallucinated the seat minimums for Claude Team about 20% of the time, resulting in incorrect financial math. I realized deterministic math should strictly belong to a hardcoded pure function (`engine.js`), and the LLM should only be used for qualitative text summarization.

**3. What you would build in week 2 if you had it**
1. **OAuth/Login Integration:** Allow users to save historical audits to track their AI spend over time as they add/remove employees.
2. **PDF Export:** Use a library like `jspdf` to generate a formatted PDF report that an engineering manager can literally print and hand to their CFO.
3. **Plaid/Stripe Integration:** Instead of manual input, authenticate with their corporate card to automatically flag AI vendor charges.

**4. How you used AI tools**
I used Claude 3.5 Sonnet primarily for boilerplate scaffolding (e.g., "Generate a Tailwind CSS grid layout for a pricing card"). I strictly *did not* trust it with the core logic in `engine.js` or the unit economics math, as I needed to ensure every calculation mapped accurately to the `PRICING_DATA.md` limits. I caught Claude hallucinating the GitHub Copilot Enterprise price (it stated $39 instead of checking current docs), which reinforced my decision to manually verify every data point.

**5. Self-rating on a 1–10 scale**
*   **Discipline: 9** - Maintained the daily commit cadence and strict devlog updates despite a tight schedule.
*   **Code quality: 8** - Clean separation of the logic engine from UI, though I sacrificed TypeScript types for raw velocity.
*   **Design sense: 7** - Clean, functional Tailwind UI, but relies on standard layout paradigms rather than highly custom visual flair.
*   **Problem-solving: 9** - Found creative workarounds, like using Base64 URL encoding for the shareable link to avoid unnecessary database queries.
*   **Entrepreneurial thinking: 9** - Focused heavily on the actual business model (partnering with fractional CFOs) rather than just building a cool technical toy.