import React from 'react';
import { X, Plus, Minus } from 'lucide-react';

interface ProductionRuleProps {
  index: number;
  rule: {
    nonTerminal: string;
    productions: string[];
  };
  onChange: (index: number, field: 'nonTerminal' | 'productions', value: string, productionIndex?: number) => void;
  onDelete: (index: number) => void;
  onAddProduction: (index: number) => void;
  onDeleteProduction: (ruleIndex: number, productionIndex: number) => void;
}

function ProductionRule({ 
  index, 
  rule, 
  onChange, 
  onDelete,
  onAddProduction,
  onDeleteProduction 
}: ProductionRuleProps) {
  return (
    <div className="space-y-3 p-4 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center gap-4">
        <input
          type="text"
          value={rule.nonTerminal}
          onChange={(e) => onChange(index, 'nonTerminal', e.target.value)}
          placeholder="Non-terminal (e.g., S)"
          className="w-32 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-200"
          maxLength={1}
        />
        <span className="text-gray-500">→</span>
        <button
          onClick={() => onDelete(index)}
          className="ml-auto p-2 text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Delete rule"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-2 pl-[calc(2rem+32px)]">
        {rule.productions.map((production, prodIndex) => (
          <div key={prodIndex} className="flex items-center gap-2">
            <input
              type="text"
              value={production}
              onChange={(e) => onChange(index, 'productions', e.target.value, prodIndex)}
              placeholder="Production (e.g., aS)"
              className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
            <button
              onClick={() => onDeleteProduction(index, prodIndex)}
              className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Delete production"
              disabled={rule.productions.length === 1}
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          onClick={() => onAddProduction(index)}
          className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Production
        </button>
      </div>
    </div>
  );
}

export default ProductionRule;