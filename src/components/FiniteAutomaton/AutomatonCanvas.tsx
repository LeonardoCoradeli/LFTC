import React from 'react';
import { Circle, Arrow, Text, Group, Line } from 'react-konva';
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
  isConnectionMode?: boolean;
  connectionStart?: string | null;
  isSettingStart?: boolean;
  isSettingAccept?: boolean;
  onNodeDragMove: (nodeId: string, position: Position) => void;
  onEdgeSelect: (edge: Edge) => void
}

const NODE_RADIUS = 30;
const SELF_LOOP_RADIUS = 40;
const CURVE_OFFSET = 50;

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
  onMouseMove,
  onNodeDragMove,
  onEdgeSelect,
  isConnectionMode = false,
  connectionStart = null,
  isSettingStart = false,
  isSettingAccept = false
}: AutomatonCanvasProps) {
  const handleStageDoubleClick = (e: any) => {
    if (e.target === e.target.getStage()) {
      const pos = e.target.getStage().getPointerPosition();
      onNodeAdd({ x: pos.x, y: pos.y });
    }
  };

  const handleNodeDragMove = (e: any, nodeId: string) => {
    const newPos = { x: e.target.x(), y: e.target.y() };
    onNodeDragMove(nodeId, newPos); // Call the external function passed as a prop
  };

  const calculateArrowPoints = (fromNode: Node, toNode: Node, existingEdges: Edge[]): number[] => {
    // Self-loop
    if (fromNode.id === toNode.id) {
      const { x, y } = fromNode.position;
      return [
        x, y - NODE_RADIUS,
        x, y - SELF_LOOP_RADIUS,
        x + SELF_LOOP_RADIUS, y - SELF_LOOP_RADIUS,
        x + SELF_LOOP_RADIUS, y,
        x + NODE_RADIUS, y
      ];
    }

    // Count existing edges between these nodes
    const edgeCount = existingEdges.filter(e => 
      (e.from === fromNode.id && e.to === toNode.id) ||
      (e.from === toNode.id && e.to === fromNode.id)
    ).length;

    const dx = toNode.position.x - fromNode.position.x;
    const dy = toNode.position.y - fromNode.position.y;
    const angle = Math.atan2(dy, dx);

    // Calculate curve offset based on number of existing edges
    const curveOffset = CURVE_OFFSET * (edgeCount % 2 === 0 ? 1 : -1) * ((edgeCount + 1) / 2);

    // Calculate control point
    const midX = (fromNode.position.x + toNode.position.x) / 2;
    const midY = (fromNode.position.y + toNode.position.y) / 2;
    const controlX = midX - curveOffset * Math.sin(angle);
    const controlY = midY + curveOffset * Math.cos(angle);

    // Calculate start and end points considering node radius
    const startX = fromNode.position.x + NODE_RADIUS * Math.cos(angle);
    const startY = fromNode.position.y + NODE_RADIUS * Math.sin(angle);
    const endX = toNode.position.x - NODE_RADIUS * Math.cos(angle);
    const endY = toNode.position.y - NODE_RADIUS * Math.sin(angle);

    return [startX, startY, controlX, controlY, endX, endY];
  };

  const calculateLabelPosition = (points: number[]): { x: number; y: number } => {
    if (points.length === 10) { // Self-loop
      return {
        x: points[4] + 10,
        y: points[5] - 20
      };
    }
    
    const midIndex = Math.floor(points.length / 2) - 1;
    return {
      x: points[midIndex],
      y: points[midIndex + 1] - 20
    };
  };

  return (
    <Group onDblClick={handleStageDoubleClick}>
      {/* Edges */}
      {edges.map((edge) => {
        const fromNode = nodes.find(n => n.id === edge.from);
        const toNode = nodes.find(n => n.id === edge.to);
        if (!fromNode || !toNode) return null;

        const isActive = currentPath.includes(edge.from) && 
                        currentPath[currentPath.indexOf(edge.from) + 1] === edge.to;

        const points = calculateArrowPoints(fromNode, toNode, edges);
        const labelPos = calculateLabelPosition(points);

        return (
          <Group key={edge.id} onClick={() => onEdgeSelect(edge)}>
            <Arrow
              points={points}
              stroke={isActive ? "#4F46E5" : "#666"}
              strokeWidth={isActive ? 3 : 2}
              fill={isActive ? "#4F46E5" : "#666"}
              tension={0.5}
              pointerLength={10}
              pointerWidth={10}
            />
            <Text
              x={labelPos.x}
              y={labelPos.y}
              text={edge.symbol}
              fontSize={16}
              fill={isActive ? "#4F46E5" : "#666"}
              align="center"
            />
          </Group>
        );
      })}


      {/* Drawing Edge */}
      {drawingEdge && drawingEdge.to && (
        <Line
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
        const isSelected = selectedNode === node.id;
        const isConnectionSource = connectionStart === node.id;
        const isInteractive = isConnectionMode || isSettingStart || isSettingAccept;
        
        return (
          <Group key={node.id}>
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
              fill={
                isConnectionSource ? "#E0E7FF" :
                isSettingStart && isSelected ? "#DCF5E6" :
                isSettingAccept && isSelected ? "#FEF3C7" :
                isActive ? "#EEF2FF" :
                "white"
              }
              stroke={
                isConnectionSource ? "#4F46E5" :
                isSettingStart && isSelected ? "#059669" :
                isSettingAccept && isSelected ? "#D97706" :
                isSelected ? "#4F46E5" :
                "#666"
              }
              strokeWidth={isSelected || isConnectionSource ? 3 : 2}
              draggable={!isInteractive}
              onClick={() => onNodeSelect(node.id)}
              onDragStart={() => onEdgeStart(node.id)}
              onDragEnd={() => onEdgeEnd(node.id)}
              onDragMove={(e) => handleNodeDragMove(e, node.id)}
            />

            {/* Node Label */}
            <Text
              x={node.position.x - 15}
              y={node.position.y - 10}
              text={node.id}
              fontSize={16}
              fill={
                isConnectionSource ? "#4F46E5" :
                isSettingStart && isSelected ? "#059669" :
                isSettingAccept && isSelected ? "#D97706" :
                isActive || isSelected ? "#4F46E5" :
                "#666"
              }
            />
          </Group>
        );
      })}
    </Group>
  );
}

export default AutomatonCanvas;