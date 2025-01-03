import React from 'react';

const FloatingEdge = ({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd
}) => {
  // Add curvature for the bezier curve
  const curvature = 0.5;
  const midX = (sourceX + targetX) / 2;
  const controlX1 = midX - (midX - sourceX) * curvature;
  const controlX2 = midX + (targetX - midX) * curvature;

  // Construct the path using the actual source and target coordinates
  const path = `M ${sourceX},${sourceY} C ${controlX1},${sourceY} ${controlX2},${targetY} ${targetX},${targetY}`;

  return (
    <svg
      style={{
        width: '100%',
        height: '100%',
        overflow: 'visible'
      }}
    >
      <path
        id={id}
        d={path}
        fill="none"
        stroke="#b1b1b7"
        strokeWidth={1.5}
        className="react-flow__edge-path"
        vectorEffect="non-scaling-stroke"
        markerEnd={markerEnd}
      />
    </svg>
  );
};

export default FloatingEdge;