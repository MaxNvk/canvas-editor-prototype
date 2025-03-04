import { useCallback, useRef } from "react";
import useUndoable from "use-undoable";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Edge,
  type Node as ReactFlowNode,
  NodeChange,
  EdgeChange, NodePositionChange,
} from "@xyflow/react";

export const useFlowHistory = (initialNodes: ReactFlowNode[], initialEdges: Edge[]) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const [
    elements,
    setElements,
    { undo, redo, reset, canUndo, canRedo }
  ] = useUndoable(
    { nodes: initialNodes, edges: initialEdges },
    { behavior: "destroyFuture" }
  );

  const triggerUpdate = useCallback(
    (type: "nodes" | "edges", updatedValue: any, ignoreHistory = false) => {
      setElements(
        (prev) => ({
          ...prev,
          [type]: updatedValue,
        }),
        "destroyFuture",
        ignoreHistory
      );
    },
    [setElements]
  );

  const onNodesChange = useCallback(
    (changes: NodeChange<ReactFlowNode>[]) => {
      const ignore = ["select", "dimensions", "position"].includes(changes[0].type);
      triggerUpdate("nodes", applyNodeChanges(changes, elements.nodes), ignore);
    },
    [triggerUpdate, elements.nodes]
  );

  const onNodeDragStop = useCallback((position: NodePositionChange) => {
    triggerUpdate("nodes", applyNodeChanges([position], elements.nodes));
  }, [triggerUpdate, elements.nodes])

  const onEdgesChange = useCallback(
    (changes: EdgeChange<Edge>[]) => {
      const ignore = ["select"].includes(changes[0].type);
      triggerUpdate("edges", applyEdgeChanges(changes, elements.edges), ignore);
    },
    [triggerUpdate, elements.edges]
  );

  const onConnect = useCallback(
    (connection: any) => {
      setElements((prev) => ({
        ...prev,
        edges: addEdge(connection, prev.edges),
      }));
    },
    [setElements]
  );

  return {
    nodes: elements.nodes,
    edges: elements.edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    undo,
    redo,
    resetHistory: reset,
    canUndo,
    canRedo,
    onNodeDragStop,
    setNodes: (nodes: ReactFlowNode[]) => triggerUpdate("nodes", nodes),
    setEdges: (edges: Edge[]) => triggerUpdate("edges", edges),
    reactFlowWrapper, // Expose ref for positioning
  };
};
