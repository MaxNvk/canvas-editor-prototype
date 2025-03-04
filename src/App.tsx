import '@xyflow/react/dist/style.css';
import {
  Background,
  ReactFlow,
  type Node,
  type Edge,
  type ReactFlowInstance,
  useReactFlow,
  getNodesBounds,
  getViewportForBounds
} from '@xyflow/react';
import { DataSchemaNodeMemo } from "@/components/flow/data-schema-node.tsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFlowHistory } from "@/hooks/use-flow-history.ts";
import { initialNodes } from "@/shared/config/initial-elements.config.ts";
import { Button } from "@/components/ui/button.tsx";
import { toPng } from "html-to-image";
import { downloadImage } from "@/shared/utils/download-image.util.ts";
import { Upload, Download } from "lucide-react"
import CanvasMenubar from "@/components/canvas-menubar.tsx";

const nodeTypes = {
  dataSchema: DataSchemaNodeMemo,
};

const flowKey = "flow-key-1";

const imageWidth = 1300;
const imageHeight = 740;

function App() {
  const { setViewport, getNodes } = useReactFlow();

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
  } = useFlowHistory(initialNodes, [], 80);

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
  const onSave = useCallback(() => {
    if (!rfInstance) return

    // @ts-ignore
    const flow = rfInstance.toObject();
    localStorage.setItem(flowKey, JSON.stringify(flow));
    resetHistory();
  }, [resetHistory, rfInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem(flowKey) as string);

      if (!flow) return

      const { x = 0, y = 0, zoom = 1 } = flow.viewport;
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);

      await setViewport({x, y, zoom});
    };

    restoreFlow();
  }, [setEdges, setNodes, setViewport]);

  const onDownloadClick = () => {
    const nodesBounds = getNodesBounds(getNodes());
    const viewport = getViewportForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5, 2, 0
    );

    toPng(document.querySelector('.react-flow__viewport') as HTMLElement, {
      backgroundColor: '#fff',
      width: imageWidth,
      height: imageHeight,
      style: {
        width: `${imageWidth}`,
        height: `${imageHeight}`,
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
      },
    }).then((response) => downloadImage(response, "reactflow"));
  };

  const [nodesDraggable, setNodesDraggable] = useState(true)
  const [elementsSelectable, setElementsSelectable] = useState(true)

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
        <CanvasMenubar
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

      <div className="flex justify-between pt-4">
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload /> Import
          </Button>

          <Button variant="outline" onClick={onDownloadClick}>
            <Download /> Export
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onRestore} disabled={!canUndo}>Reset</Button>
          <Button variant="outline">Save as New</Button>
          <Button variant="secondary" onClick={onSave} disabled={!canUndo}>Save</Button>
        </div>
      </div>
    </div>
  );
}

export default App;
