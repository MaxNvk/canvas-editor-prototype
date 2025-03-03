import {
  Sidebar,
  SidebarContent,
  SidebarMenu, SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { ZoomIn, Redo2, Undo2, Expand, Shrink } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import { ZoomSlider } from "@/components/flow/zoom-slider.tsx";
import { useReactFlow } from "@xyflow/react";

interface IProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndoClick(): unknown;
  onRedoClick(): unknown;
}

export function CanvasSidebar({ canRedo, canUndo, onUndoClick, onRedoClick }: IProps) {
  const reactFlow = useReactFlow();

  const onExpandClick = () => {
    const nodes = reactFlow.getNodes()
    nodes.map((node) => {
      reactFlow.updateNodeData(node.id, { isExpanded: true})
    })
  }
  //
  const onShrinkClick = () => {
    const nodes = reactFlow.getNodes()
    nodes.map((node) => {
      reactFlow.updateNodeData(node.id, { isExpanded: false })
    })
  }

  return (
    <SidebarProvider>
      <Sidebar variant="floating">
        <SidebarContent className="pt-10 pb-1.5">
          <SidebarMenu className="px-2">
            <SidebarMenuItem title="Zoom">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <ZoomIn className="block mx-auto" />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start" alignOffset={40} className="-translate-y-10 translate-x-3">
                  <ZoomSlider className="relative m-0" />
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>

            <SidebarMenuItem title="Undo action">
              <SidebarMenuButton onClick={onUndoClick} disabled={!canUndo}>
                <Undo2 />
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem title="Redo action">
              <SidebarMenuButton onClick={onRedoClick} disabled={!canRedo}>
                <Redo2 />
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem title="Expand all" onClick={onExpandClick}>
              <SidebarMenuButton>
                <Expand />
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem title="Shrink all">
              <SidebarMenuButton onClick={onShrinkClick}>
                <Shrink />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>

      <SidebarTrigger className="absolute z-10 top-4 left-[1.125rem]" variant="outline" />
    </SidebarProvider>
  )
}
