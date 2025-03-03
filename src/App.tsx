import '@xyflow/react/dist/style.css';
import {
  Background,
  ReactFlow,
  type Edge,
  type OnInit,
  useReactFlow,
  getNodesBounds,
  getViewportForBounds
} from '@xyflow/react';
import { DataSchemaNodeMemo } from "@/components/flow/data-schema-node.tsx";
import {useCallback, useEffect, useRef, useState} from "react";
import { useFlowHistory } from "@/hooks/use-flow-history.ts";
import { CanvasSidebar } from "@/components/CanvasSidebar.tsx";
import { initialNodes } from "@/shared/config/initial-elements.config.ts";
import { Button } from "@/components/ui/button.tsx";
import { toPng } from "html-to-image";
import { downloadImage } from "@/shared/utils/download-image.util.ts";

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

  // Define throttled key handler for better performance
  const lastKeyTime = useRef(0);
  const onKeyDown = useCallback((event) => {
    const now = Date.now();
    if (now - lastKeyTime.current < 100) return;
    lastKeyTime.current = now;

    if ((event.metaKey || event.ctrlKey) && event.key === 'z') {
      if (!event.shiftKey) {
        event.preventDefault();
        undo();
      } else {
        event.preventDefault();
        redo();
      }
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

  const [rfInstance, setRfInstance] = useState<OnInit<Node, Edge> | undefined>(null);
  const onSave = useCallback(() => {
    if (!rfInstance) return

    const flow = rfInstance.toObject();
    localStorage.setItem(flowKey, JSON.stringify(flow));
    resetHistory();
  }, [rfInstance]);

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
  }, [setNodes, setViewport]);


  const onDownloadClick = () => {
    const nodesBounds = getNodesBounds(getNodes());
    const viewport = getViewportForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5,
      2,
    );

    toPng(document.querySelector('.react-flow__viewport') as HTMLElement, {
      backgroundColor: '#ccceee',
      width: imageWidth,
      height: imageHeight,
      style: {
        width: imageWidth,
        height: imageHeight,
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
      },
    }).then((response) => downloadImage(response, "reactflow"));
  };

  return (
    <div className="h-[75dvh] w-[75dvw] m-auto border-2 border-black rounded">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onInit={setRfInstance}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        nodesDraggable
        elementsSelectable
      >
        <CanvasSidebar
          canRedo={canRedo}
          canUndo={canUndo}
          onRedoClick={redo}
          onUndoClick={undo}
        />
        <Background size={3} />
      </ReactFlow>

      <div className="flex gap-2 justify-end pt-4">
        <Button onClick={onRestore} disabled={!canUndo}>Restore</Button>
        <Button onClick={onSave} disabled={!canUndo}>Save</Button>

        <Button onClick={onDownloadClick}>Export</Button>
      </div>
    </div>
  );
}

export default App;
