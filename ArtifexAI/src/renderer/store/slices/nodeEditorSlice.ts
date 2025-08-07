import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Node, Edge, Connection, NodeChange, EdgeChange } from 'reactflow';

interface NodeEditorState {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  isProcessing: boolean;
  executionOrder: string[];
  nodeOutputs: Record<string, any>;
}

const initialState: NodeEditorState = {
  nodes: [],
  edges: [],
  selectedNodeId: null,
  isProcessing: false,
  executionOrder: [],
  nodeOutputs: {},
};

const nodeEditorSlice = createSlice({
  name: 'nodeEditor',
  initialState,
  reducers: {
    setNodes: (state, action: PayloadAction<Node[]>) => {
      state.nodes = action.payload;
    },
    setEdges: (state, action: PayloadAction<Edge[]>) => {
      state.edges = action.payload;
    },
    addNode: (state, action: PayloadAction<Node>) => {
      state.nodes.push(action.payload);
    },
    updateNode: (state, action: PayloadAction<{ id: string; data: any }>) => {
      const node = state.nodes.find(n => n.id === action.payload.id);
      if (node) {
        node.data = { ...node.data, ...action.payload.data };
      }
    },
    deleteNode: (state, action: PayloadAction<string>) => {
      state.nodes = state.nodes.filter(n => n.id !== action.payload);
      state.edges = state.edges.filter(
        e => e.source !== action.payload && e.target !== action.payload
      );
    },
    addEdge: (state, action: PayloadAction<Edge>) => {
      state.edges.push(action.payload);
    },
    deleteEdge: (state, action: PayloadAction<string>) => {
      state.edges = state.edges.filter(e => e.id !== action.payload);
    },
    selectNode: (state, action: PayloadAction<string | null>) => {
      state.selectedNodeId = action.payload;
    },
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },
    updateNodeOutput: (state, action: PayloadAction<{ nodeId: string; output: any }>) => {
      state.nodeOutputs[action.payload.nodeId] = action.payload.output;
    },
    clearNodeOutputs: (state) => {
      state.nodeOutputs = {};
    },
    updateExecutionOrder: (state, action: PayloadAction<string[]>) => {
      state.executionOrder = action.payload;
    },
  },
});

export const {
  setNodes,
  setEdges,
  addNode,
  updateNode,
  deleteNode,
  addEdge,
  deleteEdge,
  selectNode,
  setProcessing,
  updateNodeOutput,
  clearNodeOutputs,
  updateExecutionOrder,
} = nodeEditorSlice.actions;

export default nodeEditorSlice.reducer;