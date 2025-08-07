import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: any;
  selected?: boolean;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

interface NodeGraphState {
  nodes: Node[];
  edges: Edge[];
  selectedNodes: string[];
  selectedEdges: string[];
  viewport: { x: number; y: number; zoom: number };
}

const initialState: NodeGraphState = {
  nodes: [],
  edges: [],
  selectedNodes: [],
  selectedEdges: [],
  viewport: { x: 0, y: 0, zoom: 1 },
};

const nodeGraphSlice = createSlice({
  name: 'nodeGraph',
  initialState,
  reducers: {
    addNode: (state, action: PayloadAction<Node>) => {
      state.nodes.push(action.payload);
    },
    removeNode: (state, action: PayloadAction<string>) => {
      state.nodes = state.nodes.filter(node => node.id !== action.payload);
      state.edges = state.edges.filter(edge => 
        edge.source !== action.payload && edge.target !== action.payload
      );
    },
    updateNode: (state, action: PayloadAction<{ id: string; data: Partial<Node> }>) => {
      const nodeIndex = state.nodes.findIndex(node => node.id === action.payload.id);
      if (nodeIndex >= 0) {
        state.nodes[nodeIndex] = { ...state.nodes[nodeIndex], ...action.payload.data };
      }
    },
    addEdge: (state, action: PayloadAction<Edge>) => {
      state.edges.push(action.payload);
    },
    removeEdge: (state, action: PayloadAction<string>) => {
      state.edges = state.edges.filter(edge => edge.id !== action.payload);
    },
    setSelectedNodes: (state, action: PayloadAction<string[]>) => {
      state.selectedNodes = action.payload;
    },
    setViewport: (state, action: PayloadAction<{ x: number; y: number; zoom: number }>) => {
      state.viewport = action.payload;
    },
  },
});

export const {
  addNode,
  removeNode,
  updateNode,
  addEdge,
  removeEdge,
  setSelectedNodes,
  setViewport,
} = nodeGraphSlice.actions;

export default nodeGraphSlice.reducer;