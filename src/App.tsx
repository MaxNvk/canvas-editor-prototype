import '@xyflow/react/dist/style.css';
import {Background, Node, OnConnect, ReactFlow, useEdgesState, useNodesState, addEdge, MiniMap} from '@xyflow/react';
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { ZoomIn } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import { ZoomSlider } from "@/components/flow/zoom-slider.tsx";
import { DataSchemaNodeMemo } from "@/components/flow/data-schema-node.tsx";
import { useCallback } from "react";

function CanvasSidebar() {
  return (
    <SidebarProvider>
      <Sidebar variant="floating">
        <SidebarContent className="pt-10 pb-1.5">
          <SidebarMenu className="px-2">
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <ZoomIn className="block mx-auto w-5" />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start" alignOffset={40} className="-translate-y-10 translate-x-3">
                    <ZoomSlider className="relative m-0" />
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>

      <SidebarTrigger className="absolute z-10 top-4 left-[1.125rem]" variant="outline" />
    </SidebarProvider>
  )
}

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
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  return (
    <div className="h-[75dvh] w-[75dvw] m-auto border-2 border-black rounded">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onConnect={onConnect}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          className="p-2"
        >
          <CanvasSidebar />
          <Background size={3} />
          <MiniMap />
        </ReactFlow>
    </div>
  );
}

export default App;
