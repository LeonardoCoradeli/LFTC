import React, { useState, useCallback } from 'react';
import { Stage, Layer } from 'react-konva';
import AutomatonControls from './AutomatonControls';
import AutomatonCanvas from './AutomatonCanvas';
import { Node, Edge, Position } from './types';
import { processString } from './automaton-utils';

function FiniteAutomaton() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [drawingEdge, setDrawingEdge] = useState<{ from: string; to: Position | null } | null>(null);
  const [testString, setTestString] = useState('');
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [isAccepted, setIsAccepted] = useState<boolean | null>(null);

  const handleAddNode = useCallback((position: Position) => {
    const newNode: Node = {
      id: `q${nodes.length}`,
      position,
      isStart: nodes.length === 0,
      isAccept: false
    };
    setNodes([...nodes, newNode]);
  }, [nodes]);

  const handleNodeSelect = useCallback((nodeId: string) => {
    setSelectedNode(nodeId);
  }, []);

  const handleEdgeStart = useCallback((nodeId: string) => {
    setDrawingEdge({ from: nodeId, to: null });
  }, []);

  const handleEdgeEnd = useCallback((nodeId: string) => {
    if (drawingEdge && drawingEdge.from !== nodeId) {
      const symbol = prompt('Enter transition symbol:');
      if (symbol) {
        console.log('Creating edge:', drawingEdge.from, nodeId, symbol);
        const newEdge: Edge = {
          id: `${drawingEdge.from}-${nodeId}-${symbol}`,
          from: drawingEdge.from,
          to: nodeId,
          symbol
        };
        setEdges([...edges, newEdge]);
      }
    }
    setDrawingEdge(null);
  }, [drawingEdge, edges]);

  const handleMouseMove = useCallback((position: Position) => {
    if (drawingEdge) {
      setDrawingEdge({ ...drawingEdge, to: position });
    }
  }, [drawingEdge]);

  const handleNodeDragMove = useCallback((nodeId: string, position: Position) => {
    setNodes(prevNodes =>
      prevNodes.map(node =>
        node.id === nodeId ? { ...node, position } : node
      )
    );
  }, []);

  const handleTestString = useCallback(() => {
    const result = processString(testString, nodes, edges);
    console.log('Test result:', result);  // Para depuração
    setCurrentPath(result.path);
    setIsAccepted(result.accepted);
  }, [testString, nodes, edges]);

  const toggleNodeProperty = useCallback((nodeId: string, property: 'isStart' | 'isAccept') => {
    setNodes(nodes.map(node => {
      if (node.id === nodeId) {
        return { ...node, [property]: !node[property] };
      }
      if (property === 'isStart' && node.isStart) {
        return { ...node, isStart: false };
      }
      return node;
    }));
  }, [nodes]);

  return (
    <div className="space-y-6">
      <AutomatonControls
        testString={testString}
        setTestString={setTestString}
        onTest={handleTestString}
        isAccepted={isAccepted}
        selectedNode={selectedNode}
        nodes={nodes}
        onToggleProperty={toggleNodeProperty}
      />
      
      <div className="border rounded-lg overflow-hidden" style={{ height: '600px' }}>
        <Stage width={800} height={600} onDblClick={()=>handleAddNode}>
          <Layer>
            <AutomatonCanvas
              nodes={nodes}
              edges={edges}
              selectedNode={selectedNode}
              drawingEdge={drawingEdge}
              currentPath={currentPath}
              onNodeAdd={handleAddNode}
              onNodeSelect={handleNodeSelect}
              onEdgeStart={handleEdgeStart}
              onEdgeEnd={handleEdgeEnd}
              onMouseMove={handleMouseMove}
              onNodeDragMove={handleNodeDragMove} // Nova prop
            />
          </Layer>
        </Stage>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">How to Use:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Double-click on the canvas to create a new state</li>
          <li>• Drag from one state to another to create a transition</li>
          <li>• Click a state to select it and modify its properties</li>
          <li>• Enter a test string and click "Test" to simulate the automaton</li>
          <li>• The first state created is automatically set as the start state</li>
        </ul>
      </div>
    </div>
  );
}

export default FiniteAutomaton;
