import React, { useEffect, useState, useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'react-flow-renderer';
import { useDispatch, useSelector } from 'react-redux';
import {
  addNode,
  deleteNode,
  updateNode,
  addEdge as addFlowEdge,
  deleteEdge,
  updateEdge,
  resetFlow,
} from '../redux/slices/flowSlice';
import 'react-flow-renderer/dist/style.css';
import CustomNode from './CustomNode';
import CustomConnectionLine from './CustomConnectionLine';
import FloatingEdge from './FloatingEdge';

// Define nodeTypes and edgeTypes outside the component
const nodeTypes = {
  customNode: CustomNode,
};

const edgeTypes = {
  floating: FloatingEdge,
};

const FlowComponent = () => {
  const dispatch = useDispatch();
  const initialNodes = useSelector((state) => state.flow.nodes);
  const initialEdges = useSelector((state) => state.flow.edges);
  
  const [reactFlowNodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [reactFlowEdges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  const [edgeClickTimeout,setEdgeClickTimeout] = useState(null);

  useEffect(() => {
    // Set the initial state from Redux store
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const onAddNode = useCallback(() => {
    const newNode = {
      id: `${reactFlowNodes.length + 1}`,
      type: 'customNode',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: `Node ${reactFlowNodes.length + 1}` },
    };
    dispatch(addNode(newNode));
  }, [reactFlowNodes, dispatch]);

  const onDeleteNode = useCallback(() => {
    if (selectedNodeId) {
      dispatch(deleteNode(selectedNodeId));
      setSelectedNodeId(null);
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

  const onConnect = useCallback((connection) => {
    dispatch(addFlowEdge(connection));
    setEdges((eds) => addFlowEdge(connection, eds));
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
    // Clear any existing timeout
    clearTimeout(edgeClickTimeout);
    
    // Set a timeout for single click action
    const timeout = setTimeout(() => {
      onUpdateEdge(edge.id); // Call update function for single click
    }, 300); // 300ms delay for distinguishing single click
    setSelectedEdgeId(edge.id);
    setEdgeClickTimeout(timeout);
  }, [edgeClickTimeout, onUpdateEdge]);

  const onEdgeDoubleClick = useCallback((event, edge) => {
    // Clear the timeout to prevent single click action
    clearTimeout(edgeClickTimeout);
    onDeleteEdge(edge.id); // Call delete function for double click
  }, [edgeClickTimeout, onDeleteEdge]);

  const onResetFlow = useCallback(() => {
    dispatch(resetFlow());
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  }, [dispatch]);

  return (
    <div className="h-screen w-full p-4">
      <div className="mb-4 flex items-center space-x-2">
        <button onClick={onAddNode} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Add Node
        </button>
        <button onClick={onDeleteNode} className={`px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ${!selectedNodeId ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!selectedNodeId}>
          Delete Node
        </button>
        <button
          onClick={onUpdateNode}
          className={`px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 ${!selectedNodeId ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!selectedNodeId}
        >
          Update
        </button>
        <button onClick={onResetFlow} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          Reset
        </button>
      </div>
      <ReactFlow
        nodes={reactFlowNodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            color: node.id === selectedNodeId ? 'bg-red-500' : 'bg-blue-500' // Apply color dynamically based on selection
          }
        }))}
        edges={reactFlowEdges}
        fitView
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onEdgeDoubleClick={onEdgeDoubleClick}
        connectionLineComponent={CustomConnectionLine}
        connectionLineStyle={{ stroke: '#b1b1b7' }}
        defaultEdgeOptions={{
          type: 'floating',
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#b1b1b7',
          },
        }}
      >
        <Background color="#ccc" variant={BackgroundVariant.Dots} />
        <MiniMap pannable zoomable />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default FlowComponent;