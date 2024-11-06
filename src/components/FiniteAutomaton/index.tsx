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
  const [isConnectionMode, setIsConnectionMode] = useState(false);
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  const [isSettingStart, setIsSettingStart] = useState(false);
  const [isSettingAccept, setIsSettingAccept] = useState(false);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);


  const handleAddNode = useCallback((position: Position) => {
    if (!isConnectionMode && !isSettingStart && !isSettingAccept) {
      const newNode: Node = {
        id: `q${nodes.length}`,
        position,
        isStart: nodes.length === 0,
        isAccept: false
      };
      setNodes([...nodes, newNode]);
    }
  }, [nodes, isConnectionMode, isSettingStart, isSettingAccept]);

  const handleNodeSelect = useCallback((nodeId: string) => {
    if (isConnectionMode) {
      if (!connectionStart) {
        setConnectionStart(nodeId);
      } else {
        const symbol = prompt('Enter transition symbol:');
        if (symbol) {
          const newEdge: Edge = {
            id: `${connectionStart}-${nodeId}-${symbol}`,
            from: connectionStart,
            to: nodeId,
            symbol
          };
          setEdges([...edges, newEdge]);
        }
        setConnectionStart(null);
        setIsConnectionMode(false);
      }
    } else if (isSettingStart) {
      setNodes(nodes.map(node => ({
        ...node,
        isStart: node.id === nodeId
      })));
      setIsSettingStart(false);
    } else if (isSettingAccept) {
      setNodes(nodes.map(node => ({
        ...node,
        isAccept: node.id === nodeId ? !node.isAccept : node.isAccept
      })));
    } else {
      setSelectedNode(nodeId);
    }
  }, [isConnectionMode, connectionStart, edges, nodes, isSettingStart, isSettingAccept, isDeleteMode]);

  const handleEdgeStart = useCallback((nodeId: string) => {
    if (!isConnectionMode && !isSettingStart && !isSettingAccept) {
      setDrawingEdge({ from: nodeId, to: null });
    }
  }, [isConnectionMode, isSettingStart, isSettingAccept]);

  const handleEdgeEnd = useCallback((nodeId: string) => {
    if (drawingEdge && drawingEdge.from !== nodeId) {
      const symbol = prompt('Enter transition symbol:');
      if (symbol) {
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

  const handleEdgeSelect = useCallback((edge: Edge) => {
    setSelectedEdge(edge);
  }, [isDeleteMode]);
  

  const handleNodeDragMove = (nodeId: string, newPos: Position) => {
    setNodes(prevNodes =>
      prevNodes.map(node =>
        node.id === nodeId ? { ...node, position: newPos } : node
      )
    );
  };

  const handleDelete = useCallback(() => {
    if (selectedNode) {
      // Delete node and its associated edges
      setNodes(prevNodes => prevNodes.filter(node => node.id !== selectedNode));
      setEdges(prevEdges => prevEdges.filter(edge => edge.from !== selectedNode && edge.to !== selectedNode));
      setSelectedNode(null);
    } else if (selectedEdge) {
      // Delete selected edge
      setEdges(prevEdges => prevEdges.filter(edge => edge.id !== selectedEdge.id));
      setSelectedEdge(null);
    }
  }, [selectedNode, selectedEdge]);
  
  

  const handleTestString = useCallback(() => {
    const result = processString(testString, nodes, edges);
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

  const toggleConnectionMode = () => {
    setIsConnectionMode(!isConnectionMode);
    setConnectionStart(null);
    setSelectedNode(null);
    setIsSettingStart(false);
    setIsSettingAccept(false);
  };

  const toggleStartMode = () => {
    setIsSettingStart(!isSettingStart);
    setIsConnectionMode(false);
    setConnectionStart(null);
    setSelectedNode(null);
    setIsSettingAccept(false);
  };

  const toggleAcceptMode = () => {
    setIsSettingAccept(!isSettingAccept);
    setIsConnectionMode(false);
    setConnectionStart(null);
    setSelectedNode(null);
    setIsSettingStart(false);
  };

  const toggleDeleteMode = () => {
    if (isDeleteMode && (selectedNode || selectedEdge)) {
      handleDelete();
    }
    setIsDeleteMode(!isDeleteMode);
    setSelectedNode(null);
    setSelectedEdge(null);
  };

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
        isConnectionMode={isConnectionMode}
        onToggleConnectionMode={toggleConnectionMode}
        isSettingStart={isSettingStart}
        onToggleStartMode={toggleStartMode}
        isSettingAccept={isSettingAccept}
        onToggleAcceptMode={toggleAcceptMode}
        onDelete={handleDelete} // Existing prop
        selectedEdge={selectedEdge}
        isDeleteMode={isDeleteMode} // New prop
        toggleDeleteMode={toggleDeleteMode} // New prop
      />
      
      <div className="border rounded-lg overflow-hidden" style={{ height: '600px' }}>
        <Stage
          width={800}
          height={600}
          onDblClick={(e) => {
            const stage = e.target.getStage();
            const position = stage?.getPointerPosition();
            if (position) {
              handleAddNode(position);
            }
          }}
          onMouseMove={(e) => {
            const stage = e.target.getStage();
            const position = stage?.getPointerPosition();
            if (position && drawingEdge) {
              handleMouseMove(position);
            }
          }}
        >
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
              isConnectionMode={isConnectionMode}
              connectionStart={connectionStart}
              isSettingStart={isSettingStart}
              isSettingAccept={isSettingAccept}
              onNodeDragMove={handleNodeDragMove}
              onEdgeSelect={handleEdgeSelect}
            />
          </Layer>
        </Stage>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">How to Use:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Double-click on the canvas to create a new state</li>
          <li>• Use the "Create Connection" button to connect states</li>
          <li>• Use "Set Start" to designate the initial state</li>
          <li>• Use "Set Accept" to mark accepting states</li>
          <li>• Enter a test string and click "Test" to simulate the automaton</li>
        </ul>
      </div>
    </div>
  );
}

export default FiniteAutomaton;