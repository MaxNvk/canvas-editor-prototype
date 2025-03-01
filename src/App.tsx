import '@xyflow/react/dist/style.css';
import { Background, Node, Position, ReactFlow, useNodesState, useReactFlow } from '@xyflow/react';
import {TooltipContent, TooltipNode, TooltipTrigger,} from '@/components/tooltip-node';
import {Sidebar, SidebarProvider, SidebarTrigger} from '@/components/ui/sidebar';

function Tooltip() {
  return (
    <TooltipNode>
      <TooltipContent position={Position.Top}>Hidden Content</TooltipContent>
      <TooltipTrigger>Hover</TooltipTrigger>
    </TooltipNode>
  );
}

const nodeTypes = {
  tooltip: Tooltip,
};

const initialNodes: Node[] = [
  {
    id: '1',
    position: { x: 0, y: 0 },
    data: {},
    type: 'tooltip',
  },
];

function App() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);

  const { zoomTo, getZoom } = useReactFlow()

  return (
    <div className="h-[75dvh] w-[75dvw] m-auto border-2 border-black rounded">
        <ReactFlow
          nodes={nodes}
          onNodesChange={onNodesChange}
          nodeTypes={nodeTypes}
          fitView
          className="p-2"
        >
            <SidebarProvider>
              <Sidebar variant="floating">
              </Sidebar>
            </SidebarProvider>

            <Background size={2} />
        </ReactFlow>
    </div>
  );
}

export default App;
