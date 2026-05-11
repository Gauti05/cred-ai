import { useState, useEffect } from 'react';
import { runAudit } from './lib/engine';

const AVAILABLE_TOOLS = ['Cursor', 'GitHub Copilot', 'Claude', 'ChatGPT', 'Gemini', 'Windsurf'];
const USE_CASES = ['coding', 'writing', 'data', 'research', 'mixed'];

function App() {
  const [teamSize, setTeamSize] = useState(() => localStorage.getItem('teamSize') || 1);
  const [useCase, setUseCase] = useState(() => localStorage.getItem('useCase') || 'coding');
  const [tools, setTools] = useState(() => {
    const saved = localStorage.getItem('aiTools');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentTool, setCurrentTool] = useState('Cursor');
  const [currentPlan, setCurrentPlan] = useState('');
  const [currentSpend, setCurrentSpend] = useState(0);
  const [currentSeats, setCurrentSeats] = useState(1);

  // Results State
  const [auditResult, setAuditResult] = useState(null);
  const [aiSummary, setAiSummary] = useState('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  
  // Lead Capture State
  const [email, setEmail] = useState('');
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  // Persist form state
  useEffect(() => {
    localStorage.setItem('teamSize', teamSize);
    localStorage.setItem('useCase', useCase);
    localStorage.setItem('aiTools', JSON.stringify(tools));
  }, [teamSize, useCase, tools]);

  // Check for shared URL data on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedData = params.get('data');
    if (sharedData) {
      try {
        const decoded = JSON.parse(atob(sharedData));
        setAuditResult(decoded.auditResult);
        setAiSummary(decoded.aiSummary || "This is a shared read-only view of a recent audit.");
      } catch (e) {
        console.error("Failed to parse shared data");
      }
    }
  }, []);

  const handleAddTool = (e) => {
    e.preventDefault();
    if (!currentPlan || currentSpend < 0) return;
    setTools([...tools, { id: Date.now(), name: currentTool, plan: currentPlan, spend: Number(currentSpend), seats: Number(currentSeats) }]);
    setCurrentPlan(''); setCurrentSpend(0); setCurrentSeats(1);
  };

  const removeTool = (id) => setTools(tools.filter(t => t.id !== id));

  const generateReport = async () => {
    // 1. Run local math engine
    const result = runAudit(tools, teamSize, useCase);
    setAuditResult(result);

    // 2. Fetch AI Summary from Backend
    setIsLoadingSummary(true);
    try {
      const res = await fetch('http://localhost:3000/api/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tools, totalSavings: result.totalAnnualSavings, useCase })
      });
      const data = await res.json();
      setAiSummary(data.summary);
    } catch (error) {
      setAiSummary(`Based on your stack profile, we identified $${result.totalAnnualSavings} in optimization opportunities. Consolidate your tools to extend runway.`);
    }
    setIsLoadingSummary(false);

    // 3. Generate Shareable URL (stripping PII by encoding just the results)
    const publicData = btoa(JSON.stringify({ auditResult: result, aiSummary: "A startup recently found savings on their AI stack." }));
    setShareUrl(`${window.location.origin}?data=${publicData}`);
  };

  const submitLead = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch('http://localhost:3000/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, teamSize, totalSavings: auditResult.totalAnnualSavings })
      });
      setLeadCaptured(true);
    } catch (err) {
      console.error(err);
      alert('Failed to save. Please try again.');
    }
  };

  // --- RESULTS UI ---
  if (auditResult) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Hero Section */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Audit Complete</h1>
            <p className="text-gray-500 mb-6">Here is your optimization blueprint.</p>
            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="text-sm text-green-700 font-bold mb-1">Monthly Savings</div>
                <div className="text-3xl font-black text-green-600">${auditResult.totalMonthlySavings}</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="text-sm text-blue-700 font-bold mb-1">Annual Savings</div>
                <div className="text-3xl font-black text-blue-600">${auditResult.totalAnnualSavings}</div>
              </div>
            </div>
          </div>

          {/* AI Summary */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Executive Summary</h2>
            {isLoadingSummary ? (
              <p className="text-gray-400 animate-pulse">Generating AI analysis...</p>
            ) : (
              <p className="text-gray-700 leading-relaxed">{aiSummary}</p>
            )}
          </div>

          {/* Breakdown */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Line-Item Breakdown</h2>
            <div className="space-y-4">
              {auditResult.recommendations.map((rec, i) => (
                <div key={i} className="p-4 border rounded-lg bg-gray-50 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div>
                    <div className="font-bold text-lg">{rec.name}</div>
                    <div className="text-sm text-gray-600 mt-1">{rec.reason}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-bold text-red-600 bg-red-50 px-3 py-1 rounded inline-block mb-1">{rec.action}</div>
                    <div className="text-sm text-gray-500 block">Saves ${rec.savings}/mo</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lead Capture / Viral Loop */}
          {!leadCaptured ? (
            <div className="bg-gray-900 text-white p-8 rounded-xl shadow-xl">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-2xl font-bold mb-2">Save this report & track savings</h2>
                <p className="text-gray-400 mb-6">Enter your email to get a PDF copy of this audit.</p>
                <form onSubmit={submitLead} className="flex gap-2 justify-center max-w-md mx-auto mb-6">
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="founder@startup.com" className="flex-1 p-3 rounded text-gray-900 border-none" required />
                  <button type="submit" className="bg-blue-600 px-6 py-3 rounded font-bold hover:bg-blue-500">Send Report</button>
                </form>
                
                {/* CONDITIONAL CREDEX CTA */}
                {auditResult.totalMonthlySavings > 500 && (
                  <div className="mt-8 p-4 bg-green-900/30 border border-green-500 rounded-lg">
                    <h3 className="font-bold text-green-400 mb-2">High Savings Detected!</h3>
                    <p className="text-sm text-gray-300 mb-3">You qualify for discounted Credex Corporate Credits. Stop paying retail.</p>
                    <button className="bg-green-500 text-white px-4 py-2 rounded text-sm font-bold hover:bg-green-400">Book Credex Consultation →</button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 p-8 rounded-xl text-center">
              <h2 className="text-2xl font-bold text-green-800 mb-2">Check your inbox!</h2>
              <p className="text-green-600 mb-4">We've sent your detailed audit report.</p>
              <div className="bg-white p-3 rounded border mx-auto max-w-md break-all text-sm text-gray-500 font-mono">
                {shareUrl}
              </div>
              <p className="text-xs text-gray-400 mt-2">Share this anonymous link with your team.</p>
            </div>
          )}

          <div className="text-center">
             <button onClick={() => setAuditResult(null)} className="text-gray-500 underline hover:text-gray-800">← Run another audit</button>
          </div>
        </div>
      </div>
    );
  }

  // --- ORIGINAL FORM UI GOES HERE (Keep your existing return statement from Day 2 here for the form) ---
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* ... (Paste the form JSX from Day 2 here, but change the 'Generate Audit Report' button onClick to {generateReport}) ... */}
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Spend Audit</h1>
        <p className="text-gray-500 mb-8">Discover if you are overpaying for your AI infrastructure.</p>

        {/* Global Settings */}
        <div className="grid grid-cols-2 gap-6 mb-8 p-6 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Team Size</label>
            <input type="number" min="1" value={teamSize} onChange={(e) => setTeamSize(e.target.value)} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Use Case</label>
            <select value={useCase} onChange={(e) => setUseCase(e.target.value)} className="w-full p-2 border rounded">
              {USE_CASES.map(uc => <option key={uc} value={uc}>{uc}</option>)}
            </select>
          </div>
        </div>

        {/* Add Tool Form */}
        <form onSubmit={handleAddTool} className="flex gap-4 items-end mb-8 border-b pb-8">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tool</label>
            <select value={currentTool} onChange={(e) => setCurrentTool(e.target.value)} className="w-full p-2 border rounded">
              {AVAILABLE_TOOLS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
            <input type="text" placeholder="e.g. Pro, Team" value={currentPlan} onChange={(e) => setCurrentPlan(e.target.value)} className="w-full p-2 border rounded" required />
          </div>
          <div className="w-24">
            <label className="block text-sm font-medium text-gray-700 mb-1">Spend ($)</label>
            <input type="number" min="0" value={currentSpend} onChange={(e) => setCurrentSpend(e.target.value)} className="w-full p-2 border rounded" required />
          </div>
          <div className="w-24">
            <label className="block text-sm font-medium text-gray-700 mb-1">Seats</label>
            <input type="number" min="1" value={currentSeats} onChange={(e) => setCurrentSeats(e.target.value)} className="w-full p-2 border rounded" required />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition">
            Add
          </button>
        </form>

        {/* Tools List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Stack</h2>
          {tools.length === 0 ? (
            <p className="text-gray-400 italic">No tools added yet.</p>
          ) : (
            <ul className="space-y-3">
              {tools.map(tool => (
                <li key={tool.id} className="flex justify-between items-center p-4 border rounded bg-gray-50">
                  <div><span className="font-semibold">{tool.name}</span> <span className="text-gray-500">({tool.plan})</span></div>
                  <div className="flex items-center gap-6">
                    <span className="text-sm text-gray-600">{tool.seats} seats</span>
                    <span className="font-mono font-medium">${tool.spend}/mo</span>
                    <button onClick={() => removeTool(tool.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {tools.length > 0 && (
          <div className="mt-8 pt-6 border-t text-right">
            <button onClick={generateReport} className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition text-lg">
              Generate Audit Report →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;