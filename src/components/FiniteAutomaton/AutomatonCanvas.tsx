import React from 'react';
import { Circle, Arrow, Text } from 'react-konva';
import { Node, Edge, Position } from './types';

interface AutomatonCanvasProps {
  nodes: Node[];
  edges: Edge[];
  selectedNode: string | null;
  drawingEdge: { from: string; to: Position | null } | null;
  currentPath: string[];
  onNodeAdd: (position: Position) => void;
  onNodeSelect: (nodeId: string) => void;
  onEdgeStart: (nodeId: string) => void;
  onEdgeEnd: (nodeId: string) => void;
  onMouseMove: (position: Position) => void;
}

const NODE_RADIUS = 30;

function AutomatonCanvas({
  nodes,
  edges,
  selectedNode,
  drawingEdge,
  currentPath,
  onNodeAdd,
  onNodeSelect,
  onEdgeStart,
  onEdgeEnd,
  onMouseMove
}: AutomatonCanvasProps) {
  const handleStageClick = (e: any) => {
    if (e.target === e.target.getStage()) {
      const pos = e.target.getStage().getPointerPosition();
      onNodeAdd({ x: pos.x, y: pos.y });
    }
  };

  const handleNodeDragMove = (e: any, nodeId: string) => {
    const pos = e.target.position();
    onMouseMove({ x: pos.x, y: pos.y });
  };

  return (
    <>
      {/* Edges */}
      {edges.map((edge) => {
        const fromNode = nodes.find(n => n.id === edge.from);
        const toNode = nodes.find(n => n.id === edge.to);
        if (!fromNode || !toNode) return null;

        const isActive = currentPath.includes(edge.from) && 
                        currentPath[currentPath.indexOf(edge.from) + 1] === edge.to;

        return (
          <React.Fragment key={edge.id}>
            <Arrow
              points={[
                fromNode.position.x,
                fromNode.position.y,
                toNode.position.x,
                toNode.position.y
              ]}
              stroke={isActive ? "#4F46E5" : "#666"}
              strokeWidth={isActive ? 3 : 2}
              fill={isActive ? "#4F46E5" : "#666"}
            />
            <Text
              x={(fromNode.position.x + toNode.position.x) / 2}
              y={(fromNode.position.y + toNode.position.y) / 2 - 10}
              text={edge.symbol}
              fontSize={16}
              fill={isActive ? "#4F46E5" : "#666"}
            />
          </React.Fragment>
        );
      })}

      {/* Drawing Edge */}
      {drawingEdge && drawingEdge.to && (
        <Arrow
          points={[
            nodes.find(n => n.id === drawingEdge.from)?.position.x || 0,
            nodes.find(n => n.id === drawingEdge.from)?.position.y || 0,
            drawingEdge.to.x,
            drawingEdge.to.y
          ]}
          stroke="#666"
          strokeWidth={2}
          dash={[5, 5]}
        />
      )}

      {/* Nodes */}
      {nodes.map((node) => {
        const isActive = currentPath.includes(node.id);
        
        return (
          <React.Fragment key={node.id}>
            {/* Start State Indicator */}
            {node.isStart && (
              <Arrow
                points={[
                  node.position.x - NODE_RADIUS * 2,
                  node.position.y,
                  node.position.x - NODE_RADIUS,
                  node.position.y
                ]}
                stroke="#666"
                fill="#666"
              />
            )}

            {/* Accept State (Double Circle) */}
            {node.isAccept && (
              <Circle
                x={node.position.x}
                y={node.position.y}
                radius={NODE_RADIUS + 5}
                stroke={isActive ? "#4F46E5" : "#666"}
                strokeWidth={2}
              />
            )}

            {/* Main Node Circle */}
            <Circle
              x={node.position.x}
              y={node.position.y}
              radius={NODE_RADIUS}
              fill={isActive ? "#EEF2FF" : "white"}
              stroke={selectedNode === node.id ? "#4F46E5" : "#666"}
              strokeWidth={2}
              draggable
              onClick={() => onNodeSelect(node.id)}
              onDragStart={() => onEdgeStart(node.id)}
              onDragEnd={(e) => {
                const pos = e.target.position();
                handleNodeDragMove(e, node.id);
                onEdgeEnd(node.id);
              }}
              onDragMove={(e) => handleNodeDragMove(e, node.id)}
            />

            {/* Node Label */}
            <Text
              x={node.position.x - 15}
              y={node.position.y - 10}
              text={node.id}
              fontSize={16}
              fill={isActive ? "#4F46E5" : "#666"}
            />
          </React.Fragment>
        );
      })}
    </>
  );
}

export default AutomatonCanvas;