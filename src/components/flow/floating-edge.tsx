import { getBezierPath, useInternalNode, EdgeProps } from '@xyflow/react';
import {getEdgeParams, MeasuredNode} from "@/shared/utils/initial-elements-actions.utils";

interface IProps extends EdgeProps {
  id: string;
  source: string;
  target: string;
}

function FloatingEdge({ id, source, target, markerEnd, style }: IProps) {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    sourceNode as MeasuredNode,
    targetNode as MeasuredNode,
  );

  const [edgePath] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  });

  return (
    <path
      id={id}
      className="react-flow__edge-path"
      d={edgePath}
      markerEnd={markerEnd}
      style={style}
    />
  );
}

export default FloatingEdge;
