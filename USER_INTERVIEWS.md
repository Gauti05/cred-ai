# User Interviews

## Interview 1: Skeptical Early-Stage Founder
**Profile:** A.K., Solo Founder, Pre-seed B2B SaaS
**Quotes:**
- "I know I’m probably paying for overlapping AI tools, but my monthly AWS bill is $2,000. My $40 AI spend doesn't even register as a problem right now."
- "If someone told me I could save $15 a month but I had to migrate my billing to a third-party vendor, I'd ignore the email. The admin work costs more than the savings."
- "The only way I care about this is if it automatically scans my corporate card statement. I hate filling out forms."

**Most surprising thing:**
The absolute refusal to switch billing for minor savings. A.K. viewed the administrative friction of updating a credit card as more expensive than losing $100/month in tool bloat. 

**What it changed about my design:**
I realized the "Credex Consultation" CTA cannot be shown to everyone. For low-spend users, pitching a vendor switch is a turn-off. I updated the conditional rendering to only show the Credex pitch if the savings exceed $500/month, keeping the tool strictly educational for smaller startups.

---

## Interview 2: The Pragmatic Engineering Manager
**Profile:** David R., VP of Engineering, Series A Startup (45 employees)
**Quotes:**
- "We have 30 GitHub Copilot seats, but only 22 full-time devs. I deliberately over-provision because going through procurement for a $19 seat every time we hire a contractor is a nightmare."
- "I actually tried to downgrade our Anthropic API tier last month, but their dashboard made it so confusing I just gave up and left it on the higher tier."
- "If an audit tool could prove to my CFO that we are wasting $10k a year on unused seats, she would force the switch tomorrow."

**Most surprising thing:**
David was *intentionally* wasting money on empty Copilot seats to bypass his own company's slow internal procurement processes. The inefficiency was a feature, not a bug.

**What it changed about my design:**
It validated the need for the "Line-Item Breakdown" UI. Engineering managers need specific, printable bullet points to justify tooling changes to finance teams. I made sure the "Action" and "Reason" text was explicit and non-technical so a CFO could understand the waste.

---

## Interview 3: The Cost-Obsessed Indie Dev
**Profile:** S.M., Freelance Developer / Indie Hacker
**Quotes:**
- "I refuse to pay for ChatGPT Plus. I just bounce between the Windsurf free tier for coding and Claude's web interface for debugging until I hit the rate limits."
- "If Credex can actually give me Cursor Pro for $15 instead of $20, I will absolutely route my billing through them. Five bucks is five bucks."
- "Most of these 'audit' tools just want to steal my email to spam me with newsletter courses."

**Most surprising thing:**
The extreme fragmentation of their workflow just to avoid a $20 subscription. They were spending hours context-switching between free tools rather than paying a single vendor.

**What it changed about my design:**
S.M.'s deep suspicion of lead-capture forms heavily influenced step 4 of the MVP logic. I explicitly ensured the email capture is pushed to the *end* of the flow, only asking for it after the financial value (Total Savings) has already been revealed on screen.