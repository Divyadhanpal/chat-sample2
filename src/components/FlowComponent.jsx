import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Controls,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  addNode,
  deleteNode,
  updateNode,
  addFlowEdge,
  deleteEdge,
  updateEdge,
  resetFlow,
} from '../redux/slices/flowSlice';
import CustomNode from './CustomNode';
import FloatingEdge from './FloatingEdge';
import CustomConnectionLine from './CustomConnectionLine';

const nodeTypes = {
  customNode: CustomNode,
};

const edgeTypes = {
  floating: FloatingEdge,
};

const defaultEdgeOptions = {
  type: 'floating',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#b1b1b7',
  },
};

const FlowComponent = () => {
  const dispatch = useDispatch();
  const nodes = useSelector((state) => state.flow.nodes);
  const edges = useSelector((state) => state.flow.edges);
  const [reactFlowNodes, setNodes, onNodesChange] = useNodesState(nodes);
  const [reactFlowEdges, setEdges, onEdgesChange] = useEdgesState(edges);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [edgeClickTimeout, setEdgeClickTimeout] = useState(null);

  // Sync local state with Redux state when nodes or edges change
  useEffect(() => {
    console.log('Current nodes:', nodes,edges);
    setNodes(nodes);
    setEdges(edges);
    setSelectedNodeId(null); // Clear selection when nodes reset
  }, [nodes, edges, setNodes, setEdges]);

  const onAddNode = useCallback(() => {
    const newNode = {
      id: `${Date.now()}`,
      type: 'customNode',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: `Node ${reactFlowNodes.length + 1}` },
      connectable: true,
      draggable: true,
    };
    dispatch(addNode(newNode));
  }, [reactFlowNodes, dispatch]);

  const onDeleteNode = useCallback(() => {
    if (selectedNodeId) {
      dispatch(deleteNode(selectedNodeId));
      setSelectedNodeId(null); // Clear selection after deletion
    }
  }, [dispatch, selectedNodeId]);

  const onUpdateNode = useCallback(() => {
    if (selectedNodeId) {
      const newLabel = prompt('Enter new label for the node:');
      if (newLabel) {
        dispatch(updateNode({ id: selectedNodeId, label: newLabel }));
      }
    }
  }, [dispatch, selectedNodeId]);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNodeId(node.id);
  }, []);

  const onConnect = useCallback((params) => {
    console.log('onConnect called with:', params);
    if (!params || !params.source || !params.target) {
      console.log('Invalid connection params');
      return;
    }

    // Create a new edge object
    const newEdge = {
      ...params,
      id: `edge-${Date.now()}`,
      type: 'floating',
      markerEnd: defaultEdgeOptions.markerEnd
    };

    // Dispatch to Redux
    dispatch(addFlowEdge(newEdge));
    
    // Update local state
    setEdges((eds) => addEdge(params, eds));
  }, [dispatch, setEdges]);

  const onDeleteEdge = useCallback((edgeId) => {
    dispatch(deleteEdge(edgeId));
  }, [dispatch]);

  const onUpdateEdge = useCallback((edgeId) => {
    const newLabel = prompt('Enter new label for the edge:');
    if (newLabel) {
      dispatch(updateEdge({ id: edgeId, label: newLabel }));
      setEdges((eds) =>
        eds.map((edge) => (edge.id === edgeId ? { ...edge, label: newLabel } : edge))
      );
    }
  }, [dispatch, setEdges]);

  const onEdgeClick = useCallback((event, edge) => {
    clearTimeout(edgeClickTimeout);
    const timeout = setTimeout(() => {
      onUpdateEdge(edge.id);
    }, 300);
    setEdgeClickTimeout(timeout);
  }, [edgeClickTimeout, onUpdateEdge]);

  const onEdgeDoubleClick = useCallback((event, edge) => {
    clearTimeout(edgeClickTimeout);
    onDeleteEdge(edge.id);
  }, [edgeClickTimeout, onDeleteEdge]);

  const onResetFlow = useCallback(() => {
    dispatch(resetFlow());
    setSelectedNodeId(null);
  }, [dispatch]);

  const addTestEdge = () => {
    const newEdge = {
      id: `edge-${reactFlowEdges.length + 1}`,
      source: '675003d14df99f2e539375bf', // Change as needed
      target: '675003d14df99f2e539375c0', // Change as needed
      type: 'floating',
    };
    
    // Manually add the edge
    setEdges((eds) => addEdge(newEdge, eds));
    console.log('Added edge:', newEdge);
  };

  return (
    <div className="h-screen w-full p-4">
      <div className="mb-4 flex items-center space-x-2">
        <button onClick={onAddNode} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300">
          Add Node
        </button>
        <button onClick={onUpdateNode} className={`px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors duration-300 ${!selectedNodeId ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!selectedNodeId}>
          Update
        </button>
        <button onClick={onDeleteNode} className={`px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-300 ${!selectedNodeId ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!selectedNodeId}>
          Delete
        </button>
        <button onClick={onResetFlow} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors duration-300">
          Reset
        </button>
      </div>
      <div style={{ height: '80vh' }}>
        <ReactFlow
          nodes={reactFlowNodes}
          edges={reactFlowEdges}
          fitView
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          connectionMode="loose"
          snapToGrid={true}
          snapGrid={[15, 15]}
          connectionLineStyle={{
            stroke: '#b1b1b7',
            strokeWidth: 2,
          }}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onEdgeDoubleClick={onEdgeDoubleClick}
          deleteKeyCode="Delete"
          selectionKeyCode="Shift"
          multiSelectionKeyCode="Control"
        >
          <Background color="#ccc" variant="dots" />
          <MiniMap pannable zoomable />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}

export default FlowComponent;