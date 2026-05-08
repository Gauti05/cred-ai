import { useState, useEffect } from 'react';

const AVAILABLE_TOOLS = ['Cursor', 'GitHub Copilot', 'Claude', 'ChatGPT', 'Gemini', 'Windsurf'];
const USE_CASES = ['coding', 'writing', 'data', 'research', 'mixed'];

function App() {
  // Initialize state from localStorage or use defaults
  const [teamSize, setTeamSize] = useState(() => localStorage.getItem('teamSize') || 1);
  const [useCase, setUseCase] = useState(() => localStorage.getItem('useCase') || 'coding');
  const [tools, setTools] = useState(() => {
    const savedTools = localStorage.getItem('aiTools');
    return savedTools ? JSON.parse(savedTools) : [];
  });

  // Current tool being added
  const [currentTool, setCurrentTool] = useState('Cursor');
  const [currentPlan, setCurrentPlan] = useState('');
  const [currentSpend, setCurrentSpend] = useState(0);
  const [currentSeats, setCurrentSeats] = useState(1);

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('teamSize', teamSize);
    localStorage.setItem('useCase', useCase);
    localStorage.setItem('aiTools', JSON.stringify(tools));
  }, [teamSize, useCase, tools]);

  const handleAddTool = (e) => {
    e.preventDefault();
    if (!currentPlan || currentSpend < 0) return;
    
    setTools([...tools, { 
      id: Date.now(), 
      name: currentTool, 
      plan: currentPlan, 
      spend: Number(currentSpend), 
      seats: Number(currentSeats) 
    }]);
    
    // Reset form fields
    setCurrentPlan('');
    setCurrentSpend(0);
    setCurrentSeats(1);
  };

  const removeTool = (id) => {
    setTools(tools.filter(tool => tool.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
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
            Add Tool
          </button>
        </form>

        {/* Tools List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Stack</h2>
          {tools.length === 0 ? (
            <p className="text-gray-400 italic">No tools added yet. Add your first tool above.</p>
          ) : (
            <ul className="space-y-3">
              {tools.map(tool => (
                <li key={tool.id} className="flex justify-between items-center p-4 border rounded bg-gray-50">
                  <div>
                    <span className="font-semibold">{tool.name}</span> <span className="text-gray-500">({tool.plan})</span>
                  </div>
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
            <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition text-lg">
              Generate Audit Report →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;