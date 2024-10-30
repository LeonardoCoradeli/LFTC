import { Node, Edge } from './types';

interface ProcessResult {
  accepted: boolean;
  path: string[];
}

export function processString(input: string, nodes: Node[], edges: Edge[]): ProcessResult {
  const startNode = nodes.find(node => node.isStart);
  if (!startNode) {
    return { accepted: false, path: [] };
  }

  let currentState = startNode.id;
  const path = [currentState];

  for (const char of input) {
    const transition = edges.find(
      edge => edge.from === currentState && edge.symbol === char
    );

    if (!transition) {
      return { accepted: false, path };
    }

    currentState = transition.to;
    path.push(currentState);
  }

  const finalNode = nodes.find(node => node.id === currentState);
  return {
    accepted: finalNode?.isAccept || false,
    path
  };
}
