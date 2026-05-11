## AI Summary Generation Prompt

**The Prompt:**
> "You are a financial auditor specializing in AI SaaS tools. The user has a primary use case of '{useCase}'. They are currently using: {tools}. We audited their stack and found ${totalSavings} in potential annual savings. Write a 100-word, highly personalized summary paragraph explaining their core inefficiency and why they should optimize. Tone should be professional but punchy."

**Model Used:** `claude-3-haiku-20240307` (Chosen for extremely low latency and cost-effectiveness for simple text summarization).

**Why I wrote it this way:**
Injecting the dynamic `{useCase}` and `{tools}` array forces the LLM to ground its response in the user's actual reality rather than outputting a generic SaaS platitude. Telling it to act as a "financial auditor" constrains the tone to be analytical rather than sales-heavy. 

**What I tried that didn't work:**
Initially, I asked the LLM to calculate the savings itself by passing it the pricing data. It hallucinated the math roughly 20% of the time. I quickly realized that deterministic math should be handled by hardcoded rules (my `engine.js`), and the LLM should purely be used for qualitative summarization. Knowing when *not* to use AI is crucial.

**Graceful Fallback:**
If the Anthropic API times out, rate-limits, or fails, the backend catches the error and returns a templated string injecting the calculated `${totalSavings}`. This ensures the user's frontend experience never breaks due to a third-party outage.