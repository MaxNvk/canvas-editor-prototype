import { Node as ReactFlowNode, Edge } from "@xyflow/react"
import dagre from "@dagrejs/dagre";

export const getLayoutedElements = (nodes: ReactFlowNode[], edges: Edge[], direction = 'LR') => {
  const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

  // const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: node.measured!.width, height: node.measured!.height });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node: ReactFlowNode): ReactFlowNode => {
    const nodeWithPosition = dagreGraph.node(node.id);

    return {
      ...node,
      position: {
        x: nodeWithPosition.x - node.measured!.width! / 2,
        y: nodeWithPosition.y - node.measured!.height! / 2,
      },
    }
  });

  return { nodes: newNodes, edges };
};
