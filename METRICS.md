# Product Metrics

## The North Star Metric
**Total Validated Savings Discovered ($)**
- **Why:** This is the exact value the product provides to the world, and it perfectly correlates with Credex's revenue potential. If this number is high, leads will convert. If it's low, the tool is a failure.

## 3 Input Metrics
1. **Audit Completion Rate:** (Audits Completed / Page Views). Measures if the form is too complex or asking for too much data upfront.
2. **Lead Capture Conversion:** (Emails Submitted / Audits Completed). Measures if the "shock value" of the results page is strong enough to trade an email for.
3. **High-Intent Ratio:** (Audits >$500 Savings / Total Audits). Measures if our top-of-funnel marketing is attracting the right Series A/B startups, or just students checking their $20 ChatGPT bill.

## What to Instrument First
- Mixpanel/PostHog events on the "Add Tool" button to see which tools are most commonly entered.
- A drop-off funnel on the input form to see exactly which field causes users to abandon the process.

## Pivot Trigger
**Trigger:** If the *Lead Capture Conversion* stays below 5% for two consecutive weeks after 1,000 unique visitors. 
- **Reasoning:** This indicates that users either don't trust the math, or the savings aren't painful enough to care about. We would pivot from a "self-serve web tool" to a "concierge service" where we run the audit for them via a cold email teardown.