import { getBezierPath, Position, Node } from '@xyflow/react';

import { getEdgeParams, type MeasuredNode } from "@/shared/utils/initial-elements-actions.utils";

interface IProps {
  toX: number;
  toY: number;
  fromPosition: Position;
  toPosition: Position;
  fromNode?: Node;
}


function FloatingConnectionLine({toX, toY, fromPosition, toPosition, fromNode }: IProps) {
  if (!fromNode) {
    return null;
  }

  const targetNode: Node = {
    id: 'connection-target',
    width: 1,
    height: 1,
    // @ts-ignore
    positionAbsolute: { x: toX, y: toY },
  };

  const { sx, sy } = getEdgeParams(fromNode as MeasuredNode, targetNode as MeasuredNode);
  const [edgePath] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: fromPosition,
    targetPosition: toPosition,
    targetX: toX,
    targetY: toY,
  });

  return (
    <g>
      <path
        fill="none"
        stroke="#222"
        strokeWidth={1.5}
        className="animated"
        d={edgePath}
      />
      <circle
        cx={toX}
        cy={toY}
        fill="#fff"
        r={3}
        stroke="#222"
        strokeWidth={1.5}
      />
    </g>
  );
}

export default FloatingConnectionLine;
