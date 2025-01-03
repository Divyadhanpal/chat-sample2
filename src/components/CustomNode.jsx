import React from 'react';
import { Handle, Position } from '@reactflow/core';

const CustomNode = ({ data }) => {
  return (
    <div
      className={`flex items-center justify-center w-12 h-12 rounded-full shadow-md border-2 ${data.color || 'bg-blue-500'}`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-2 h-2 !bg-teal-500"
      />
      <div className="text-white text-xs-custom text-center">{data.label}</div> {/* Font size reduced */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-2 !bg-teal-500"
      />
    </div>
  );
};

export default CustomNode;