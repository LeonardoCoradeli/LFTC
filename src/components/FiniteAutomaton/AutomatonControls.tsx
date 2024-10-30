import React from 'react';
import { Node } from './types';

interface AutomatonControlsProps {
  testString: string;
  setTestString: (value: string) => void;
  onTest: () => void;
  isAccepted: boolean | null;
  selectedNode: string | null;
  nodes: Node[];
  onToggleProperty: (nodeId: string, property: 'isStart' | 'isAccept') => void;
}

function AutomatonControls({
  testString,
  setTestString,
  onTest,
  isAccepted,
  selectedNode,
  nodes,
  onToggleProperty
}: AutomatonControlsProps) {
  const selectedNodeData = nodes.find(node => node.id === selectedNode);

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Test String
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="Enter string to test"
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
            <button
              onClick={onTest}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Test
            </button>
          </div>
        </div>

        {selectedNode && (
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Selected State: {selectedNode}
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => onToggleProperty(selectedNode, 'isStart')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedNodeData?.isStart
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Start State
              </button>
              <button
                onClick={() => onToggleProperty(selectedNode, 'isAccept')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedNodeData?.isAccept
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Accept State
              </button>
            </div>
          </div>
        )}
      </div>

      {isAccepted !== null && (
        <div
          className={`p-4 rounded-lg ${
            isAccepted
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {isAccepted
            ? 'String is accepted by the automaton'
            : 'String is rejected by the automaton'}
        </div>
      )}
    </div>
  );
}

export default AutomatonControls;