import React, { useCallback } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
} from 'react-flow-renderer';
import 'react-flow-renderer/dist/style.css';

const initialNodes = [
    { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
    { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
  ];
  const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

const FlowComponent = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onAddNode = useCallback(() => {
    const newNode = {
      id: `${nodes.length + 1}`,
      type: 'default',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: `Node ${nodes.length + 1}` },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [nodes, setNodes]);

  const onDeleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  }, [setNodes, setEdges]);

  const onUpdateNode = useCallback((nodeId) => {
    const newLabel = prompt('Enter new label for the node:');
    if (newLabel) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId ? { ...node, data: { ...node.data, label: newLabel } } : node
        )
      );
    }
  }, [setNodes]);

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  const onDeleteEdge = useCallback((edgeId) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
  }, [setEdges]);

  const onUpdateEdge = useCallback((edgeId) => {
    const newLabel = prompt('Enter new label for the edge:');
    if (newLabel) {
      setEdges((eds) =>
        eds.map((edge) =>
          edge.id === edgeId ? { ...edge, label: newLabel } : edge
        )
      );
    }
  }, [setEdges]);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <button onClick={onAddNode}>Add Node</button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeDoubleClick={(event, edge) => onDeleteEdge(edge.id)}
        onEdgeClick={(event, edge) => onUpdateEdge(edge.id)} // Click to update edge label
      >
        {/* <MiniMap />
        <Controls /> */}
       <Background color="#ccc" variant={BackgroundVariant.Dots} />
      </ReactFlow>
      <div style={{ marginTop: '10px' }}>
        {nodes.map((node) => (
          <div key={node.id} style={{ marginBottom: '5px' }}>
            <span>{node.data.label}</span>
            <button onClick={() => onUpdateNode(node.id)} style={{ marginLeft: '5px' }}>Update</button>
            <button onClick={() => onDeleteNode(node.id)} style={{ marginLeft: '5px' }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlowComponent;