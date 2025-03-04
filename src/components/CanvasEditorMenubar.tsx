import {
  NavigationMenu, NavigationMenuDivider,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu.tsx";
import { ZoomIn, MousePointer2Icon, Move, Copy, Expand, Shrink, Undo2, Redo2, ZoomOut, Wand2, ChevronDown, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu.tsx";
import { ZoomSlider } from "@/components/flow/zoom-slider.tsx";
import { useReactFlow, useViewport, useOnSelectionChange, type Node } from "@xyflow/react";
import { useState } from "react";
import { cn } from "@/shared/utils/cn.utils";

interface IProps {
  canUndo: boolean;
  canRedo: boolean;
  nodesDraggable: boolean;
  elementsSelectable: boolean;
  toggleNodesDraggable(): unknown;
  toggleElementsSelectable(): unknown;
  onUndoClick(): unknown;
  onRedoClick(): unknown;
}

const CanvasEditorMenubar = ({
                         canRedo,
                         canUndo,
                         onUndoClick,
                         onRedoClick,
                         nodesDraggable,
                         toggleNodesDraggable,
                         toggleElementsSelectable,
                         elementsSelectable
}: IProps) => {
  const { zoom } = useViewport();
  const { zoomIn, zoomOut, updateNodeData, getNodes, addNodes } = useReactFlow()
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)

  useOnSelectionChange({
    onChange(data) {
      setSelectedNode(data.nodes[0] || null)
    }
  })

  const onExpandClick = () => {
    const nodes = getNodes()
    nodes.map((node) => {
      updateNodeData(node.id, { isExpanded: true })
    })
  }

  const onShrinkClick = () => {
    const nodes = getNodes()
    nodes.map((node) => {
      updateNodeData(node.id, { isExpanded: false })
    })
  }

  const onDuplicateClick = () => {
    addNodes({
      ...(selectedNode as Node),
      id: `${selectedNode!.id}-copy`,
      position: {
        x: selectedNode!.position.x + 75,
        y: selectedNode!.position.y + 75,
      }})

    setSelectedNode(null)
  }

  const placeholderAction = () => {
    alert("This feature is not implemented yet")
  }

  return (
    <NavigationMenu className="z-10 w-full pl-4 pr-8 py-1 bg-white border-b">
      <h2 className="text-xl font-semibold mr-auto">Industrial Pathway</h2>

      <NavigationMenuList>
        <NavigationMenuItem>
          <Button variant="ghost" size="sm" title="Select" onClick={toggleElementsSelectable}>
            <MousePointer2Icon className={cn({'stroke-main-green-1': elementsSelectable})} />
          </Button>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Button variant="ghost" size="sm" title="Move" onClick={toggleNodesDraggable}>
            <Move className={cn({'stroke-main-green-1': nodesDraggable})} />
          </Button>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Button variant="ghost" size="sm" title="Reverse" onClick={placeholderAction}>
            <ArrowLeftRight />
          </Button>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Button
            variant="ghost"
            size="sm"
            title="Duplicate"
            disabled={!selectedNode}
            onClick={onDuplicateClick}
          >
            <Copy />
          </Button>
        </NavigationMenuItem>

        <NavigationMenuDivider />

        <NavigationMenuItem onClick={placeholderAction}>
          <Button variant="ghost" size="sm" title="Auto Layout">
            <Wand2 />
          </Button>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Button variant="ghost" size="sm" title="Expand" onClick={onExpandClick}>
            <Expand />
          </Button>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Button variant="ghost" size="sm" title="Collapse" onClick={onShrinkClick}>
            <Shrink />
          </Button>
        </NavigationMenuItem>

        <NavigationMenuDivider />

        <NavigationMenuItem>
          <Button
            variant="ghost"
            size="sm"
            title="Undo action"
            disabled={!canUndo}
            onClick={onUndoClick}
          >
            <Undo2 />
          </Button>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Button
            variant="ghost"
            size="sm"
            title="Redo action"
            disabled={!canRedo}
            onClick={onRedoClick}
          >
            <Redo2 />
          </Button>
        </NavigationMenuItem>

        <NavigationMenuDivider />

        <NavigationMenuItem>
          <Button
            variant="ghost"
            size="sm"
            title="Zoom In"
            onClick={() => zoomIn({ duration: 300 })}
          >
            <ZoomIn />
          </Button>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Button
            variant="ghost"
            size="sm"
            title="Zoom Out"
            onClick={() => zoomOut({ duration: 300 })}
          >
            <ZoomOut />
          </Button>
        </NavigationMenuItem>

       <NavigationMenuItem>
         <DropdownMenu>
           <DropdownMenuTrigger className="h-8 px-2 bg-gray-100 min-w-20">
             {(100 * zoom).toFixed(0)}%

             <ChevronDown className="ml-auto size-4" />
           </DropdownMenuTrigger>

           <DropdownMenuContent align="end">
             <ZoomSlider className="relative m-0" />
           </DropdownMenuContent>
         </DropdownMenu>
       </NavigationMenuItem>
      </NavigationMenuList>

    </NavigationMenu>
  );
};

export default CanvasEditorMenubar;
