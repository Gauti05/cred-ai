## Automated Test Suite

**Testing Framework:** Vitest (chosen for seamless Vite integration and execution speed).
**How to run:** Navigate to the `/client` directory and execute `npm run test`.

### Test Coverage (Audit Engine)
Filename: `client/src/lib/engine.test.js`

1. **Claude Team Seat Optimization:** Verifies that the engine detects Anthropic's 5-seat minimum billing and recommends individual Pro accounts if the user inputs fewer than 5 seats.
2. **ChatGPT Team Solo Optimization:** Verifies that a solo user on ChatGPT Team ($30) is downgraded to ChatGPT Plus ($20) for identical capabilities.
3. **Use-Case Mismatch:** Ensures the engine identifies when specialized coding IDEs (like Cursor/Copilot) are being paid for by teams whose primary function is 'writing' or 'research'.
4. **Free Alternative Substitution:** Verifies the suggestion to swap GitHub Copilot Individual for the highly capable Windsurf Free tier.
5. **Credex Arbitrage Application:** Tests the catch-all logic where optimized, high-spend tools (> $50) are targeted for Credex's core offering: sourcing the exact same credits at a ~20% discount.