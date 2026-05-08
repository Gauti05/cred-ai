import { describe, it, expect } from 'vitest';
import { runAudit } from './engine';

describe('Audit Engine Logic', () => {
  it('1. Recommends downgrading Claude Team if seats are under 5', () => {
    const tools = [{ id: 1, name: 'Claude', plan: 'Team', spend: 150, seats: 2 }];
    const result = runAudit(tools, 2, 'coding');
    expect(result.recommendations[0].action).toBe('Downgrade to Claude Pro');
    expect(result.totalMonthlySavings).toBe(110); // $150 - (2 * $20)
  });

  it('2. Recommends downgrading ChatGPT Team for single users', () => {
    const tools = [{ id: 2, name: 'ChatGPT', plan: 'Team', spend: 30, seats: 1 }];
    const result = runAudit(tools, 1, 'writing');
    expect(result.recommendations[0].action).toBe('Downgrade to ChatGPT Plus');
    expect(result.totalMonthlySavings).toBe(10); // $30 - $20
  });

  it('3. Suggests canceling coding tools if primary use case is writing', () => {
    const tools = [{ id: 3, name: 'Cursor', plan: 'Pro', spend: 20, seats: 1 }];
    const result = runAudit(tools, 1, 'writing');
    expect(result.recommendations[0].action).toBe('Cancel Cursor');
    expect(result.totalMonthlySavings).toBe(20);
  });

  it('4. Suggests Windsurf Free as alternative to Copilot Individual', () => {
    const tools = [{ id: 4, name: 'GitHub Copilot', plan: 'Individual', spend: 10, seats: 1 }];
    const result = runAudit(tools, 1, 'coding');
    expect(result.recommendations[0].action).toBe('Switch to Windsurf Free');
    expect(result.totalMonthlySavings).toBe(10);
  });

  it('5. Applies Credex 20% discount logic for optimal high-spend tools', () => {
    const tools = [{ id: 5, name: 'Cursor', plan: 'Business', spend: 400, seats: 10 }];
    const result = runAudit(tools, 10, 'coding');
    expect(result.recommendations[0].action).toBe('Switch to Credex Corporate Credits');
    expect(result.totalMonthlySavings).toBe(80); // 20% of 400
  });
});