import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProjectSettings {
  resolution: string;
  fps: number;
  duration: number;
  format: string;
}

interface ProjectState {
  id: string | null;
  name: string;
  path: string | null;
  created: string;
  modified: string;
  settings: ProjectSettings;
  isSaved: boolean;
  isLoading: boolean;
}

const initialState: ProjectState = {
  id: null,
  name: 'Untitled Project',
  path: null,
  created: new Date().toISOString(),
  modified: new Date().toISOString(),
  settings: {
    resolution: '1920x1080',
    fps: 30,
    duration: 0,
    format: 'mp4',
  },
  isSaved: true,
  isLoading: false,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    newProject: (state) => {
      return {
        ...initialState,
        id: `project-${Date.now()}`,
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
      };
    },
    openProject: (state, action: PayloadAction<any>) => {
      return {
        ...action.payload,
        isLoading: false,
        isSaved: true,
      };
    },
    saveProject: (state) => {
      state.isSaved = true;
      state.modified = new Date().toISOString();
    },
    updateProject: (state, action: PayloadAction<Partial<ProjectState>>) => {
      Object.assign(state, action.payload);
      state.isSaved = false;
      state.modified = new Date().toISOString();
    },
    updateSettings: (state, action: PayloadAction<Partial<ProjectSettings>>) => {
      Object.assign(state.settings, action.payload);
      state.isSaved = false;
      state.modified = new Date().toISOString();
    },
    setProjectPath: (state, action: PayloadAction<string>) => {
      state.path = action.payload;
    },
    markAsUnsaved: (state) => {
      state.isSaved = false;
    },
  },
});

export const {
  newProject,
  openProject,
  saveProject,
  updateProject,
  updateSettings,
  setProjectPath,
  markAsUnsaved,
} = projectSlice.actions;

export default projectSlice.reducer;