## Stack Decisions & Trade-offs
**Language: JavaScript vs. TypeScript**
While TypeScript provides excellent type safety and developer ergonomics, I explicitly chose plain JavaScript for this 7-day MVP. 
*   **Reasoning:** In a highly constrained, time-sensitive "entrepreneurial" sprint (shipping a product in 7 days), speed of iteration is the highest priority. JavaScript removes the overhead of type gymnastics and compilation steps, allowing for rapid prototyping of the core business logic—specifically the complex, evolving rules of the AI Audit Engine. The risk of runtime type errors is mitigated by the comprehensive test suite (`TESTS.md`) covering the core engine logic.

## System Architecture

```mermaid
graph TD
    A[User / Frontend] -->|Inputs Stack| B(React App State)
    B -->|JSON| C{Audit Engine}
    C -->|Math/Rules| D[Results Data]
    D -->|Metrics| E(Express API: /api/summary)
    E --> F[Anthropic LLM]
    D -->|Email/Lead| G(Express API: /api/leads)
    G --> H[(MongoDB)]
    G --> I[Resend Email Service]