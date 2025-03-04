// Custom hook for managing history
import { useCallback, useRef, useState } from "react";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Edge,
  type Node as ReactFlowNode,
  useEdgesState,
  useNodesState, NodeChange, EdgeChange
} from "@xyflow/react";

export const useFlowHistory = (initialNodes: ReactFlowNode[], initialEdges: Edge[], maxHistorySize = 50) => {
  // Store only operations instead of full state
  const [operations, setOperations] = useState<any>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);
  const skipNextHistoryUpdate = useRef(false);

  // Clear history when it gets too large
  const manageHistorySize = useCallback(() => {
    if (operations.length > maxHistorySize) {
      // Keep most recent entries and important older ones
      const toKeep = Math.floor(maxHistorySize * 0.8);
      const newOps = operations.slice(operations.length - toKeep);
      setOperations(newOps);
      setCurrentIndex(newOps.length - 1);
    }
  }, [operations, maxHistorySize]);

  // Record operation types rather than full state copies
  const recordOperation = useCallback(<T>(type: string, payload: T) => {
    if (skipNextHistoryUpdate.current) {
      skipNextHistoryUpdate.current = false;
      return;
    }

    // When recording a new operation, truncate future history
    const newOperations = operations.slice(0, currentIndex + 1);
    newOperations.push({ type, payload, timestamp: Date.now() });

    setOperations(newOperations);
    setCurrentIndex(newOperations.length - 1);

    manageHistorySize();
  }, [operations, currentIndex, manageHistorySize]);

  // Apply node changes with history
  const onNodesChange = useCallback((changes: NodeChange<ReactFlowNode>[]) => {
    // Only record completed drag operations
    const significantChanges = changes.filter(
      change => change.type !== 'position' ||
        (change.type === 'position' && change.dragging === false)
    );

    // Record the operation for undo/redo
    if (significantChanges.length > 0) {
      if (significantChanges.some(change => change.type === 'position' && change.dragging === false)) {
        recordOperation('nodes-change', structuredClone(changes));
      } else if (significantChanges[0].type !== 'position') {
        recordOperation('nodes-change', structuredClone(changes));
      }
    }

    // Apply the changes
    setNodes(nodes => applyNodeChanges(changes, nodes));
  }, [recordOperation]);

  // Apply edge changes with history
  const onEdgesChange = useCallback((changes: EdgeChange<Edge>[]) => {
    if (changes.some(change => change.type === 'remove')) {
      recordOperation('edges-change', structuredClone(changes));
    }

    setEdges(edges => applyEdgeChanges(changes, edges));
  }, [recordOperation]);

  // Connect nodes with history
  const onConnect = useCallback((connection: any) => {
    const newEdge = { ...connection, id: `e${connection.source}-${connection.sourceHandle.replaceAll(" ", "-")}-${connection.target}-${connection.targetHandle.replaceAll(" ", "-")}` };
    recordOperation('connect', newEdge);
    setEdges(edges => addEdge(newEdge, edges));
  }, [recordOperation]);

  // Recreate the flow state from operations
  const recreateFlowState = useCallback((targetIndex: number) => {
    // Start from initial state
    let currentNodes = structuredClone(initialNodes);
    let currentEdges = structuredClone(initialEdges);

    // Apply all operations up to the target index
    for (let i = 0; i <= targetIndex; i++) {
      const op = operations[i];

      switch (op.type) {
        case 'nodes-change':
          currentNodes = applyNodeChanges(op.payload, currentNodes);
          break;
        case 'edges-change':
          currentEdges = applyEdgeChanges(op.payload, currentEdges);
          break;
        case 'connect':
          currentEdges = addEdge(op.payload, currentEdges);
          break;
        default:
          console.warn('Unknown operation type:', op.type);
      }
    }

    return { nodes: currentNodes, edges: currentEdges };
  }, [initialNodes, initialEdges, operations]);

  // Undo operation
  const undo = useCallback(() => {
    if (currentIndex >= 0) {
      skipNextHistoryUpdate.current = true;

      const targetIndex = currentIndex - 1;
      const { nodes: newNodes, edges: newEdges } =
        targetIndex >= 0 ? recreateFlowState(targetIndex) : { nodes: initialNodes, edges: initialEdges };

      setNodes(newNodes);
      setEdges(newEdges);
      setCurrentIndex(targetIndex);
    }
  }, [currentIndex, initialNodes, initialEdges, recreateFlowState]);

  // Redo operation
  const redo = useCallback(() => {
    if (currentIndex < operations.length - 1) {
      skipNextHistoryUpdate.current = true;

      const targetIndex = currentIndex + 1;
      const { nodes: newNodes, edges: newEdges } = recreateFlowState(targetIndex);

      setNodes(newNodes);
      setEdges(newEdges);
      setCurrentIndex(targetIndex);
    }
  }, [currentIndex, operations, recreateFlowState]);

  const resetHistory = () => {
    setCurrentIndex(-1)
    setOperations([])
  }

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    undo,
    redo,
    setNodes,
    setEdges,
    resetHistory,
    canUndo: currentIndex >= 0,
    canRedo: currentIndex < operations.length - 1,
    historySize: operations.length,
    currentHistoryIndex: currentIndex
  };
};
