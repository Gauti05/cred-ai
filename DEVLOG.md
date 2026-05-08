## Day 1 — 2026-05-07
**Hours worked:** 1.5
**What I did:** Initialized the MERN stack monorepo using pure JavaScript. Scaffolded the Vite React frontend and the Express/Node backend. Set up the exact file structure required by the prompt to ensure the automated reviewer can parse my submission. Drafted the language justification in ARCHITECTURE.md.
**What I learned:** Reviewing the assignment constraints made me realize how critical Git hygiene, exact file naming, and explicitly documenting engineering trade-offs (like JS over TS) are for this specific review process.
**Blockers / what I'm stuck on:** None yet, just getting the foundation laid out.
**Plan for tomorrow:** Build the React form to capture the user's current AI tool stack and ensure the state persists across page reloads using localStorage.



## Day 2 — 2026-05-08
**Hours worked:** 2.5
**What I did:** Compiled PRICING_DATA.md with verified dates and official URLs as requested. Built the MVP frontend form in React (App.jsx) to capture total team size, primary use case, and individual tool line-items. Added Tailwind CSS for quick styling and implemented `localStorage` sync so the form state persists across page reloads.
**What I learned:** Handling array state inside `localStorage` requires careful JSON parsing during the initial React state setup to avoid hydration mismatches.
**Blockers / what I'm stuck on:** None. The UI is clean and functional.
**Plan for tomorrow:** Build the core logic of the Audit Engine. This needs to be a pure function that evaluates the user's stack against the PRICING_DATA to find inefficiencies. Will also write the automated tests for this engine.