import '@xyflow/react/dist/style.css';
import {
  Background,
  ReactFlow,
  type Node,
  type Edge,
  type ReactFlowInstance,
  useReactFlow,
} from '@xyflow/react';
import { DataSchemaNodeMemo } from "@/components/flow/data-schema-node.tsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFlowHistory } from "@/hooks/use-flow-history.ts";
import { initialNodes } from "@/shared/config/initial-elements.config.ts";
import { downloadFile } from "@/shared/utils/download-file.util.ts";
import CanvasEditorMenubar from "@/components/CanvasEditorMenubar.tsx";
import CanvasEditorFooter from "@/components/CanvasEditorFooter.tsx";

const nodeTypes = {
  dataSchema: DataSchemaNodeMemo,
};

const flowKey = "flow-key-1";

function App() {
  const { setViewport } = useReactFlow();

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    undo,
    redo,
    canRedo,
    canUndo,
    setNodes,
    setEdges,
    resetHistory
  } = useFlowHistory([], [], 80);

  const lastKeyTime = useRef(0);

  const onKeyDown = useCallback((event: KeyboardEvent) => {
    const now = Date.now();
    if (now - lastKeyTime.current < 100) return;
    lastKeyTime.current = now;

    if ((event.metaKey || event.ctrlKey) && event.key === 'z') {
      if (!event.shiftKey) {
        event.preventDefault();
        undo();
        return;
      }

      event.preventDefault();
      redo();
    } else if ((event.metaKey || event.ctrlKey) && event.key === 'y') {
      event.preventDefault();
      redo();
    }
  }, [undo, redo]);

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);

  const [rfInstance, setRfInstance] = useState<ReactFlowInstance<Node, Edge> | null>(null);

  // @ts-ignore
  const getFlowObject = () => rfInstance.toObject();

  const onSave = useCallback(() => {
    if (!rfInstance) return

    localStorage.setItem(flowKey, JSON.stringify(getFlowObject()));
    resetHistory();
  }, [resetHistory, rfInstance]);

  const onRestore = useCallback(async (): Promise<any> => {
    const flow = JSON.parse(localStorage.getItem(flowKey) as string);

    if (!flow) return

    const { x = 0, y = 0, zoom = 1 } = flow.viewport;
    setNodes(flow.nodes || []);
    setEdges(flow.edges || []);

    await setViewport({x, y, zoom});

    return flow
  }, [setEdges, setNodes, setViewport]);

  const onDownloadClick = () => {
    if (!rfInstance) return;

    const flowData = getFlowObject()
    const jsonString = JSON.stringify(flowData, null, 2); // Pretty print JSON
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    downloadFile(url, "reactflow.json")
  };

  const [nodesDraggable, setNodesDraggable] = useState(true)
  const [elementsSelectable, setElementsSelectable] = useState(true)

  useEffect(() => {
    const getInitialState = async () => {
      const flow = await onRestore()

      if(!flow) {
        setNodes(initialNodes)
        resetHistory()
      }
    }

    getInitialState()
  }, []);

  return (
    <div className="h-[75dvh] w-[75dvw] m-auto border-2 border-black rounded">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onInit={setRfInstance}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={(params) => {
          if(!elementsSelectable) return

          onConnect(params)
        }}
        nodeTypes={nodeTypes}
        fitView
        nodesDraggable={nodesDraggable}
        elementsSelectable={elementsSelectable}
        edgesFocusable={elementsSelectable}
        edgesReconnectable={elementsSelectable}
        nodesConnectable={elementsSelectable}
        multiSelectionKeyCode="Shift"
      >
        <CanvasEditorMenubar
          canRedo={canRedo}
          canUndo={canUndo}
          onRedoClick={redo}
          onUndoClick={undo}
          nodesDraggable={nodesDraggable}
          elementsSelectable={elementsSelectable}
          toggleNodesDraggable={() => setNodesDraggable(!nodesDraggable)}
          toggleElementsSelectable={() => setElementsSelectable(!elementsSelectable)}
        />
        <Background size={3} />
      </ReactFlow>

      <CanvasEditorFooter
        onDownloadClick={onDownloadClick}
        onRestore={onRestore}
        onSave={onSave}
        canUndo={canUndo}
      />
    </div>
  );
}

export default App;
