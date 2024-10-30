import React, { useState, useEffect } from 'react';

function RegexAnalyzer() {
  const [regex, setRegex] = useState('');
  const [string1, setString1] = useState('');
  const [string2, setString2] = useState('');
  const [isValid1, setIsValid1] = useState<boolean | null>(null);
  const [isValid2, setIsValid2] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!regex) {
      setIsValid1(null);
      setIsValid2(null);
      setError('');
      return;
    }

    try {
      const regexObj = new RegExp(regex);
      setError('');
      setIsValid1(regexObj.test(string1));
      setIsValid2(regexObj.test(string2));
    } catch (e) {
      setError('Invalid regular expression');
      setIsValid1(null);
      setIsValid2(null);
    }
  }, [regex, string1, string2]);

  const getInputClassName = (isValid: boolean | null) => {
    const base = 'w-full p-3 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2';
    if (isValid === null) return `${base} border-gray-300 focus:ring-indigo-200`;
    return isValid
      ? `${base} border-green-500 bg-green-50 focus:ring-green-200`
      : `${base} border-red-500 bg-red-50 focus:ring-red-200`;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Regular Expression
        </label>
        <input
          type="text"
          value={regex}
          onChange={(e) => setRegex(e.target.value)}
          placeholder="Enter your regex (e.g., ^[a-z]+$)"
          className={`w-full p-3 border rounded-lg transition-colors duration-200 
            focus:outline-none focus:ring-2 focus:ring-indigo-200 
            ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
        />
        {error && (
          <p className="text-sm text-red-600 mt-1">{error}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Test String 1
        </label>
        <input
          type="text"
          value={string1}
          onChange={(e) => setString1(e.target.value)}
          placeholder="Enter test string"
          className={getInputClassName(isValid1)}
        />
        {isValid1 !== null && (
          <p className={`text-sm ${isValid1 ? 'text-green-600' : 'text-red-600'} mt-1`}>
            {isValid1 ? 'Matches' : 'Does not match'}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Test String 2
        </label>
        <input
          type="text"
          value={string2}
          onChange={(e) => setString2(e.target.value)}
          placeholder="Enter test string"
          className={getInputClassName(isValid2)}
        />
        {isValid2 !== null && (
          <p className={`text-sm ${isValid2 ? 'text-green-600' : 'text-red-600'} mt-1`}>
            {isValid2 ? 'Matches' : 'Does not match'}
          </p>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Tips:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Use ^ to match the start of a string</li>
          <li>• Use $ to match the end of a string</li>
          <li>• Use [a-z] to match any lowercase letter</li>
          <li>• Use \d to match any digit</li>
          <li>• Use + to match one or more occurrences</li>
        </ul>
      </div>
    </div>
  );
}

export default RegexAnalyzer;