import { Button } from "@/components/ui/button.tsx";
import { Download, Upload } from "lucide-react";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";

interface IProps {
  onDownloadClick(): unknown
  onImport(event: React.ChangeEvent<HTMLInputElement>): unknown
  onRestore(): unknown
  onSave(): unknown
  canUndo: boolean
}

function CanvasEditorFooter({ onImport, onDownloadClick, onSave, onRestore, canUndo }: IProps) {
  const placeholderAction = () => {
    alert("This feature is not implemented yet")
  }

  return (
    <div className="flex justify-between pt-4">
      <div className="flex gap-2">
        <Button variant="outline" className="p-0!">
          <Label htmlFor="fileImport" className="flex w-full h-full items-center justify-center"><Upload /> Import</Label>
        </Button>

        <Input type="file" id="fileImport" className="sr-only" onInput={onImport} />

        <Button variant="outline" onClick={onDownloadClick}>
          <Download /> Export
        </Button>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onRestore} disabled={!canUndo}>Reset</Button>
        <Button variant="outline" onClick={placeholderAction}>Save as New</Button>
        <Button variant="secondary" onClick={onSave} disabled={!canUndo}>Save</Button>
      </div>
    </div>
  );
}

export default CanvasEditorFooter;
