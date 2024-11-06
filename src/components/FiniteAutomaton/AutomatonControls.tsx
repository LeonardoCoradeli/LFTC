import React from 'react';
import { Link2, Play, CheckCircle2 } from 'lucide-react';
import { Edge } from './types';

interface AutomatonControlsProps {
  testString: string;
  setTestString: (value: string) => void;
  onTest: () => void;
  isAccepted: boolean | null;
  selectedNode: string | null;
  nodes: Node[];
  onToggleProperty: (nodeId: string, property: 'isStart' | 'isAccept') => void;
  isConnectionMode: boolean;
  onToggleConnectionMode: () => void;
  isSettingStart: boolean;
  onToggleStartMode: () => void;
  isSettingAccept: boolean;
  onToggleAcceptMode: () => void;
  onDelete: () => void; // Add the onDelete prop
  selectedEdge: Edge | null; // Assuming you added this state to track selected edges
  isDeleteMode: boolean; // New prop
  toggleDeleteMode: () => void; // New prop
}

function AutomatonControls({
  testString,
  setTestString,
  onTest,
  isAccepted,
  selectedNode,
  nodes,
  onToggleProperty,
  isConnectionMode,
  onToggleConnectionMode,
  isSettingStart,
  onToggleStartMode,
  isSettingAccept,
  onToggleAcceptMode,
  onDelete,
  selectedEdge,
  isDeleteMode, // New prop
  toggleDeleteMode // New prop
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

        <div className="flex-1 flex items-end gap-2">
          <button
            onClick={onToggleConnectionMode}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isConnectionMode
                ? 'bg-indigo-600 text-white hover:bg-indigFo-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            disabled={isSettingStart || isSettingAccept}
          >
            <Link2 className="w-4 h-4" />
            {isConnectionMode ? 'Cancel Connection' : 'Create Connection'}
          </button>

          <button
            onClick={onToggleStartMode}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isSettingStart
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            disabled={isConnectionMode || isSettingAccept}
          >
            <Play className="w-4 h-4" />
            {isSettingStart ? 'Cancel Start' : 'Set Start'}
          </button>

          <button
            onClick={onToggleAcceptMode}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isSettingAccept
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            disabled={isConnectionMode || isSettingStart}
          >
            <CheckCircle2 className="w-4 h-4" />
            {isSettingAccept ? 'Cancel Accept' : 'Set Accept'}
          </button>

          {/* Add the delete button here */}
          <button
            onClick={toggleDeleteMode}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isDeleteMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isDeleteMode ? 'Cancel Delete' : 'Delete Mode'}
        </button>
        </div>
      </div>

      {(isConnectionMode || isSettingStart || isSettingAccept) && (
        <div className="p-4 bg-indigo-50 text-indigo-700 rounded-lg">
          {isConnectionMode && 'Click on a state to start the connection, then click on another state to create a transition'}
          {isSettingStart && 'Click on a state to set it as the start state'}
          {isSettingAccept && 'Click on a state to toggle it as an accept state'}
        </div>
      )}

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
