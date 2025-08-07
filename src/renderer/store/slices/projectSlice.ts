import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Project {
  id: string;
  name: string;
  created: Date;
  modified: Date;
  settings: {
    resolution: { width: number; height: number };
    fps: number;
    duration: number;
  };
  filePath?: string;
  saved: boolean;
}

interface ProjectState {
  currentProject: Project | null;
  recentProjects: Project[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  currentProject: null,
  recentProjects: [],
  isLoading: false,
  error: null,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    createProject: (state, action: PayloadAction<Partial<Project>>) => {
      const newProject: Project = {
        id: Date.now().toString(),
        name: action.payload.name || 'Untitled Project',
        created: new Date(),
        modified: new Date(),
        settings: {
          resolution: { width: 1920, height: 1080 },
          fps: 24,
          duration: 600, // 10 minutes in seconds
          ...action.payload.settings,
        },
        saved: false,
        ...action.payload,
      };
      state.currentProject = newProject;
    },
    loadProject: (state, action: PayloadAction<Project>) => {
      state.currentProject = action.payload;
      state.error = null;
    },
    saveProject: (state, action: PayloadAction<{ filePath?: string }>) => {
      if (state.currentProject) {
        state.currentProject.modified = new Date();
        state.currentProject.saved = true;
        if (action.payload.filePath) {
          state.currentProject.filePath = action.payload.filePath;
        }
      }
    },
    updateProjectSettings: (state, action: PayloadAction<Partial<Project['settings']>>) => {
      if (state.currentProject) {
        state.currentProject.settings = {
          ...state.currentProject.settings,
          ...action.payload,
        };
        state.currentProject.modified = new Date();
        state.currentProject.saved = false;
      }
    },
    addRecentProject: (state, action: PayloadAction<Project>) => {
      const existingIndex = state.recentProjects.findIndex(p => p.id === action.payload.id);
      if (existingIndex >= 0) {
        state.recentProjects.splice(existingIndex, 1);
      }
      state.recentProjects.unshift(action.payload);
      state.recentProjects = state.recentProjects.slice(0, 10); // Keep only last 10
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  createProject,
  loadProject,
  saveProject,
  updateProjectSettings,
  addRecentProject,
  setLoading,
  setError,
} = projectSlice.actions;

export default projectSlice.reducer;