import React, { useState } from 'react';
import { FileText, Code, Settings, Share2 } from 'lucide-react';
import RegexAnalyzer from './components/RegexAnalyzer';
import GrammarValidator from './components/GrammarValidator';
import FiniteAutomaton from './components/FiniteAutomaton';

function App() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { name: 'Regex Analyzer', icon: <Code className="w-5 h-5" /> },
    { name: 'Grammar Validator', icon: <FileText className="w-5 h-5" /> },
    { name: 'Finite Automaton', icon: <Share2 className="w-5 h-5" /> },
    { name: 'Tab 4', icon: <Settings className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Developer Tools Suite
        </h1>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors duration-200
                    ${activeTab === index 
                      ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  {tab.icon}
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 0 && <RegexAnalyzer />}
            {activeTab === 1 && <GrammarValidator />}
            {activeTab === 2 && <FiniteAutomaton />}
            {activeTab === 3 && <div className="text-center text-gray-500">Coming Soon</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;