/**
 *
 * @param {Array} tools 
 * @param {Number} teamSize 
 * @param {String} useCase 
 */
export function runAudit(tools, teamSize, useCase) {
  let totalMonthlySavings = 0;
  const recommendations = [];

  tools.forEach(tool => {
    let recommendation = null;
    let savings = 0;
    let action = 'Keep current plan';
    let reason = 'Your spend is optimal for this tool.';
    
    const plan = tool.plan.toLowerCase();

    
    if (tool.name === 'Claude' && plan.includes('team') && tool.seats < 5) {
      const actualSpend = Math.max(tool.spend, 150); // Minimum $150/mo
      const optimalSpend = tool.seats * 20; // Switch to Pro plan
      savings = actualSpend - optimalSpend;
      action = 'Downgrade to Claude Pro';
      reason = `Claude Team requires a 5-seat minimum ($150). With ${tool.seats} users, individual Pro accounts save money while maintaining limits.`;
    }
    
   
    else if (tool.name === 'ChatGPT' && plan.includes('team') && tool.seats === 1) {
      savings = tool.spend - 20; // Plus is $20
      action = 'Downgrade to ChatGPT Plus';
      reason = 'ChatGPT Team has a 2-seat minimum. A single Plus account is cheaper with nearly identical capabilities for solo users.';
    }

    
    else if ((tool.name === 'Cursor' || tool.name === 'GitHub Copilot' || tool.name === 'Windsurf') && (useCase === 'writing' || useCase === 'research')) {
      savings = tool.spend; 
      action = `Cancel ${tool.name}`;
      reason = `You are paying for a specialized coding assistant, but your primary team use case is '${useCase}'. Standard LLM chat interfaces are more efficient here.`;
    }

    
    else if (tool.name === 'GitHub Copilot' && plan.includes('individual')) {
      savings = tool.spend;
      action = 'Switch to Windsurf Free';
      reason = 'For individual developers, Windsurf offers a highly capable free tier that can replace GitHub Copilot entirely, reducing costs to zero.';
    }

   
    else if (tool.spend > 50) {
      savings = tool.spend * 0.20; // Credex offers roughly 20% off retail
      action = 'Switch to Credex Corporate Credits';
      reason = 'You are on the right plan, but paying retail. Credex can source these exact credits at a ~20% discount from over-provisioned startups.';
    }

    if (savings > 0) {
      totalMonthlySavings += savings;
    }

    recommendations.push({
      id: tool.id,
      name: tool.name,
      currentSpend: tool.spend,
      action,
      savings,
      reason
    });
  });

  return {
    recommendations,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12
  };
}