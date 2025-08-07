import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface GenerationTask {
  id: string;
  type: 'text2video' | 'image2video' | 'music' | 'voice' | 'sfx';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  input: any;
  output?: any;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

interface AIGenerationState {
  tasks: GenerationTask[];
  currentTaskId: string | null;
  isGenerating: boolean;
  modelStatus: {
    wan22_t2v: 'loading' | 'ready' | 'error' | 'not_loaded';
    wan22_i2v: 'loading' | 'ready' | 'error' | 'not_loaded';
  };
  serverConnected: boolean;
}

const initialState: AIGenerationState = {
  tasks: [],
  currentTaskId: null,
  isGenerating: false,
  modelStatus: {
    wan22_t2v: 'not_loaded',
    wan22_i2v: 'not_loaded',
  },
  serverConnected: false,
};

const aiGenerationSlice = createSlice({
  name: 'aiGeneration',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<GenerationTask>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<{ id: string; updates: Partial<GenerationTask> }>) => {
      const task = state.tasks.find(t => t.id === action.payload.id);
      if (task) {
        Object.assign(task, action.payload.updates);
      }
    },
    removeTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
    },
    setCurrentTask: (state, action: PayloadAction<string | null>) => {
      state.currentTaskId = action.payload;
    },
    setGenerating: (state, action: PayloadAction<boolean>) => {
      state.isGenerating = action.payload;
    },
    updateModelStatus: (state, action: PayloadAction<{
      model: 'wan22_t2v' | 'wan22_i2v';
      status: 'loading' | 'ready' | 'error' | 'not_loaded';
    }>) => {
      state.modelStatus[action.payload.model] = action.payload.status;
    },
    setServerConnected: (state, action: PayloadAction<boolean>) => {
      state.serverConnected = action.payload;
    },
    clearTasks: (state) => {
      state.tasks = [];
      state.currentTaskId = null;
      state.isGenerating = false;
    },
  },
});

export const {
  addTask,
  updateTask,
  removeTask,
  setCurrentTask,
  setGenerating,
  updateModelStatus,
  setServerConnected,
  clearTasks,
} = aiGenerationSlice.actions;

export default aiGenerationSlice.reducer;