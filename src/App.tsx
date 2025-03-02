import '@xyflow/react/dist/style.css';
import { Background, Node, ReactFlow, useNodesState } from '@xyflow/react';
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
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {ZoomSlider} from "@/components/zoom-slider.tsx";

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
  // tooltip: Tooltip,
};

const initialNodes: Node[] = [
  {
    id: '1',
    position: { x: 0, y: 0 },
    data: {
      label: 'Node 1',
    },
  },
];

function App() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);

  return (
    <div className="h-[75dvh] w-[75dvw] m-auto border-2 border-black rounded">
        <ReactFlow
          nodes={nodes}
          onNodesChange={onNodesChange}
          nodeTypes={nodeTypes}
          fitView
          className="p-2"
        >
            <CanvasSidebar />
            <Background size={2} />
        </ReactFlow>
    </div>
  );
}

export default App;
