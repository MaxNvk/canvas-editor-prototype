import '@xyflow/react/dist/style.css';
import {
  Background,
  ReactFlow,
  type Node,
  type Edge,
  type ReactFlowInstance,
  useReactFlow,
  useOnSelectionChange,
  useViewport,
} from '@xyflow/react';
import { DataSchemaNodeMemo } from "@/components/flow/data-schema-node.tsx";
import { type ChangeEvent, useCallback, useEffect, useRef, useState} from "react";
import { useFlowHistory } from "@/hooks/use-flow-history.ts";
import { initialNodes } from "@/shared/config/initial-elements.config.ts";
import { downloadFile } from "@/shared/utils/download-file.util.ts";
import CanvasEditorMenubar from "@/components/CanvasEditorMenubar.tsx";
import CanvasEditorFooter from "@/components/CanvasEditorFooter.tsx";
import { toast } from "sonner"
import { getLayoutedElements } from "@/shared/utils/get-layouted-elements.util.ts";


const nodeTypes = {
  dataSchema: DataSchemaNodeMemo,
};

const flowKey = "flow-key-1";

function App() {
  const { fitView, addNodes, updateNodeData, zoomIn, zoomOut } = useReactFlow();
  const { zoom } = useViewport()

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    undo,
    redo,
    canUndo,
    canRedo,
    setNodes,
    setEdges,
    onNodeDragStop
  } = useFlowHistory([], []);

  const [selectedNode, setSelectedNode] = useState<Node | null>(null)

  const onDuplicateClick = () => {
    addNodes({
      ...(selectedNode as Node),
      id: `${selectedNode!.id}-copy`,
      position: {
        x: selectedNode!.position.x + 75,
        y: selectedNode!.position.y + 75,
      }})

    setSelectedNode(null)

    toast.success("Node duplicated", {position: "top-center"})
  }

  useOnSelectionChange({
    onChange(data) {
      setSelectedNode(data.nodes[0] || null)
    }
  })

  const onExpandClick = () => {
    nodes.map((node) => {
      updateNodeData(node.id, { isExpanded: true })
    })
  }

  const onShrinkClick = () => {
    nodes.map((node) => {
      updateNodeData(node.id, { isExpanded: false })
    })
  }

  const lastKeyTime = useRef(0);

  const onKeyDown = useCallback((event: KeyboardEvent) => {
    const now = Date.now();
    if (now - lastKeyTime.current < 100) return;

    lastKeyTime.current = now;

    event.preventDefault();
    if ((event.metaKey || event.ctrlKey) && event.key === 'z') {
      if (!event.shiftKey) undo();
      else redo();
    } else if ((event.metaKey || event.ctrlKey) && event.key === 'y') {
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

    toast.success("Flow saved successfully to the Local Storage", { position: "top-center" })
  }, [rfInstance]);

  const onRestore = useCallback(async (): Promise<any> => {
    const flow = JSON.parse(localStorage.getItem(flowKey) as string);

    if (!flow) return

    setNodes(flow.nodes || []);
    setEdges(flow.edges || []);

    setTimeout(() => fitView({ duration: 300 }))

    return flow
  }, [setEdges, setNodes, fitView]);

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
      if(!!flow) return

      setNodes(initialNodes)
    }

    getInitialState()
  }, []);

  const onImport = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonText = e.target?.result as string;
        const flowData = JSON.parse(jsonText);

        if (flowData && flowData.nodes && flowData.edges) {
          setNodes(flowData.nodes);
          setEdges(flowData.edges);
        } else {
          alert("Invalid JSON file format.");
        }
      } catch (error) {
        alert("Error parsing JSON file.");
        console.error("Import error:", error);
      }
    };
    reader.readAsText(file);
  };

  const onAutoLayout = useCallback(() => {
    const { nodes: newNodes, edges: newEdges } = getLayoutedElements(nodes, edges)

    setNodes(newNodes)
    setEdges(newEdges)

    setTimeout(() => fitView({ duration: 300 }))
  }, [nodes, edges, fitView])

  return (
    <div className="h-[75dvh] w-[75dvw] m-auto border-2 border-black rounded">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onInit={setRfInstance}
        onNodesChange={onNodesChange}
        onNodeDragStop={(_event, node) => onNodeDragStop({ id: node.id, type: "position", position: node.position })}
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
          zoom={zoom}
          canRedo={canRedo}
          canUndo={canUndo}
          onRedoClick={redo}
          onUndoClick={undo}
          onAutoLayout={onAutoLayout}
          nodesDraggable={nodesDraggable}
          elementsSelectable={elementsSelectable}
          toggleNodesDraggable={() => setNodesDraggable(!nodesDraggable)}
          toggleElementsSelectable={() => setElementsSelectable(!elementsSelectable)}
          onDuplicateClick={onDuplicateClick}
          onShrinkClick={onShrinkClick}
          onExpandClick={onExpandClick}
          onZoomInClick={() => zoomIn({ duration: 300 })}
          onZoomOutClick={() => zoomOut({ duration: 300 })}
          isDuplicateDisabled={!selectedNode}
        />
        <Background size={3} />
      </ReactFlow>

      <CanvasEditorFooter
        onDownloadClick={onDownloadClick}
        onImport={onImport}
        onRestore={onRestore}
        onSave={onSave}
        canUndo={canUndo}
      />
    </div>
  );
}

export default App;
