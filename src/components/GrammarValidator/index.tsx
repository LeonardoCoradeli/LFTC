import React, { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import ProductionRule from './ProductionRule';
import ValidationResult from './ValidationResult';
import { inGrammatic } from './utils';

interface Rule {
  nonTerminal: string;
  productions: string[];
}

const MAX_STRING_LENGTH = 50;

function GrammarValidator() {
  const [rules, setRules] = useState<Rule[]>([{ nonTerminal: '', productions: [''] }]);
  const [testString, setTestString] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [generatedStrings, setGeneratedStrings] = useState<string[]>([]);

  const addRule = () => {
    setRules([...rules, { nonTerminal: '', productions: [''] }]);
  };

  const handleRuleChange = (
    index: number, 
    field: 'nonTerminal' | 'productions', 
    value: string,
    productionIndex?: number
  ) => {
    const newRules = [...rules];
    if (field === 'productions' && productionIndex !== undefined) {
      newRules[index][field][productionIndex] = value;
    } else if (field === 'nonTerminal') {
      newRules[index][field] = value.toUpperCase();
    }
    setRules(newRules);
  };

  const deleteRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const addProduction = (ruleIndex: number) => {
    const newRules = [...rules];
    newRules[ruleIndex].productions.push('');
    setRules(newRules);
  };

  const deleteProduction = (ruleIndex: number, productionIndex: number) => {
    const newRules = [...rules];
    if (newRules[ruleIndex].productions.length > 1) {
      newRules[ruleIndex].productions = newRules[ruleIndex].productions.filter(
        (_, i) => i !== productionIndex
      );
      setRules(newRules);
    }
  };

  const validateString = useCallback(() => {
    const startRule = rules[0];
    if (!startRule || !startRule.nonTerminal || !startRule.productions[0]) {
      setIsValid(false);
      setGeneratedStrings([]);
      return;
    }

    const validStrings = inGrammatic(
      rules,
      startRule.productions,
      Math.max(MAX_STRING_LENGTH, testString.length)
    );

    setGeneratedStrings(validStrings);
    setIsValid(validStrings.includes(testString));
  }, [rules, testString]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Production Rules</h2>
          <button
            onClick={addRule}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Rule
          </button>
        </div>

        <div className="space-y-3">
          {rules.map((rule, index) => (
            <ProductionRule
              key={index}
              index={index}
              rule={rule}
              onChange={handleRuleChange}
              onDelete={deleteRule}
              onAddProduction={addProduction}
              onDeleteProduction={deleteProduction}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Test String
        </label>
        <input
          type="text"
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="Enter a string to test"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
        <button
          onClick={validateString}
          className="w-full py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Validate String
        </button>
      </div>

      <ValidationResult 
        isValid={isValid} 
        testString={testString}
        generatedStrings={generatedStrings}
      />

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">How to Use:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Enter a non-terminal symbol (e.g., S, A, B) in uppercase</li>
          <li>• Add productions using lowercase letters and non-terminals</li>
          <li>• Add multiple rules using the "Add Rule" button</li>
          <li>• Enter a test string and click "Validate"</li>
          <li>• The first rule is considered the starting rule</li>
        </ul>
      </div>
    </div>
  );
}

export default GrammarValidator;