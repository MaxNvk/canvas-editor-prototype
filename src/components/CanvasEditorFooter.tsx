import { Button } from "@/components/ui/button.tsx";
import { Download, Upload } from "lucide-react";

interface IProps {
  onDownloadClick(): unknown
  onRestore(): unknown
  onSave(): unknown
  canUndo: boolean
}

function CanvasEditorFooter({ onDownloadClick, onSave, onRestore, canUndo }: IProps) {
  return (
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
  );
}

export default CanvasEditorFooter;
