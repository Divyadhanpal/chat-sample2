import React from 'react';
import { getBezierPath } from 'reactflow';
import PropTypes from 'prop-types';

const CustomConnectionLine = ({
  fromX,
  fromY,
  toX,
  toY,
  connectionLineStyle
}) => {
  const [edgePath] = getBezierPath({
    sourceX: fromX,
    sourceY: fromY,
    targetX: toX,
    targetY: toY,
    sourcePosition: 'bottom',
    targetPosition: 'top',
  });

  return (
    <g>
      <path
        fill="none"
        stroke="#b1b1b7"
        strokeWidth={1.5}
        className="animated"
        d={edgePath}
        {...connectionLineStyle}
      />
    </g>
  );
};

CustomConnectionLine.propTypes = {
  fromX: PropTypes.number,
  fromY: PropTypes.number,
  toX: PropTypes.number,
  toY: PropTypes.number,
  connectionLineStyle: PropTypes.object
};

export default CustomConnectionLine;