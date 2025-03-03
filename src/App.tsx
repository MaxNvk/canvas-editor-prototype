import '@xyflow/react/dist/style.css';
import { Background, Node, ReactFlow, MiniMap } from '@xyflow/react';
import { DataSchemaNodeMemo } from "@/components/flow/data-schema-node.tsx";
import { useCallback, useEffect, useRef } from "react";
import { useFlowHistory } from "@/hooks/use-flow-history.ts";
import { CanvasSidebar } from "@/components/CanvasSidebar.tsx";

const nodeTypes = {
  dataSchema: DataSchemaNodeMemo,
};

const initialNodes: Node[] = [
  {
    id: '2',
    position: { x: 0, y: 0 },
    type: "dataSchema",
    data: {
      label: "Ammonia from H2 from Coal Gasification w/ CC S",
      details: "Life Cycle Assessment of Corn based Butanol as a transportation fuel",
      bgColor: "#bfdbff",
      isExpanded: true,
      schema: {
        input: [
          {
            title: "Nitrogen Gas",
            description: "Mix: Nitrogen products from cryogenic",
            value: "75%",
          },
          {
            title: "Gaseous Hydrogen",
            description: "Pathway: Central PlantsL. Compressed G.H2",
            value: "10%",
          },
          {
            title: "Electricity",
            description: "Pathway: Distributed - U.S. Mix",
            value: "15%",
          },
        ],
        output: [
          {
            title: "Lime",
            value: "18%",
          },
          {
            title: "Ammonia for Fuel",
            value: "80%",
          }
        ]
      }
    }
  },
  {
    id: '3',
    position: { x: 0, y: 0 },
    type: "dataSchema",
    data: {
      label: "Ammonia Transportation and Distribution",
      details: "Analysis of Petroleum Refining",
      bgColor: "#ffe54e",
      isExpanded: true,
      schema: {
        input: [
          {
            title: "Ammonia for Fuel",
            value: "100%",
          },
          {
            title: "Gaseous Hydrogen",
            description: "Pathway: Central PlantsL. Compressed G.H2",
            value: "10%",
          },
          {
            title: "Electricity",
            description: "Pathway: Distributed - U.S. Mix",
            value: "15%",
          },
          {
            title: "Residual Oil",
            description: "Pathway: Residual Oil (Petroleum) from Crude Oil",
            value: "0.00%",
          },
        ],
        output: [
          {
            title: "Lime",
            value: "18%",
          },
          {
            title: "Ammonia for Fuel",
            value: "80%",
          }
        ]
      }
    }
  },
];

function App() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    undo,
    redo,
    canRedo,
    canUndo
  } = useFlowHistory(initialNodes, [], 80);

  // Define throttled key handler for better performance
  const lastKeyTime = useRef(0);
  const onKeyDown = useCallback((event) => {
    // Throttle keyboard input to prevent rapid-fire undo/redo
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

  // Set up keyboard event listener with cleanup
  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);

  return (
    <div className="h-[75dvh] w-[75dvw] m-auto border-2 border-black rounded">
      <ReactFlow
        nodes={nodes}
        edges={edges}
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
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

export default App;
