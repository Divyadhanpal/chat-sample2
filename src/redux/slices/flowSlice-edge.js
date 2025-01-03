import { createSlice } from '@reduxjs/toolkit';
import CustomNode from '../../components/CustomNode';
import { getRandomPosition } from '../../helpers/getRandomPosition';
import initialState from '../../helpers/initialState.json';

const flowSlice = createSlice({
    name: 'flow',
    initialState,
    reducers: {
        addNode: (state, action) => {
            console.log(action,"add")
            const newNode = {
                ...action.payload,
                position: getRandomPosition(state.nodes, state.edges),
            };
            console.log(action,"add2")
            state.nodes.push(newNode);
            // Maintain connections if the new node connects to existing nodes
            if (action.payload.connectTo) {
                action.payload.connectTo.forEach(targetId => {
                    const edgeId = `${newNode.id}-${targetId}`;
                    const existingEdge = state.edges.find(edge => edge.id === edgeId);
                    if (!existingEdge) {
                        state.edges.push({
                            id: edgeId,
                            source: newNode.id,
                            target: targetId,
                        });
                    }
                });
            }
        },
        deleteNode: (state, action) => {
            const nodeId = action.payload;
            state.nodes = state.nodes.filter(node => node.id !== nodeId);
            state.edges = state.edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId);
        },
        updateNode: (state, action) => {
            const { id, label } = action.payload;
            const node = state.nodes.find(node => node.id === id);
            if (node) {
                node.data.label = label;
            }
        },
        addEdge: (state, action) => {
            const newEdge = {
                ...action.payload,
                id: `${action.payload.source}-${action.payload.target}`, // Create a unique ID
            };
            const existingEdge = state.edges.find(edge => edge.id === newEdge.id);
            if (!existingEdge) {
                state.edges.push(newEdge);
            }
       },
        deleteEdge: (state, action) => {
            const edgeId = action.payload;
            state.edges = state.edges.filter(edge => edge.id !== edgeId);
        },
        updateEdge: (state, action) => {
            const { id, label } = action.payload;
            const edge = state.edges.find(edge => edge.id === id);
            if (edge) {
                edge.label = label;
            }
        },
        resetFlow: (state) => {
            return initialState; // Reset to initial state
        },
    },
});

export const { addNode, deleteNode, updateNode, addEdge, deleteEdge, updateEdge, resetFlow } = flowSlice.actions;

export default flowSlice.reducer;