import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DialogState {
  isOpen: boolean;
  data?: any;
}

interface UIState {
  workspaceMode: 'timeline' | 'node' | 'hybrid';
  sidebarCollapsed: boolean;
  propertiesPanelCollapsed: boolean;
  dialogs: {
    newProject: DialogState;
    openProject: DialogState;
    saveProject: DialogState;
    exportVideo: DialogState;
    importMedia: DialogState;
    generateT2V: DialogState;
    generateI2V: DialogState;
    generateMusic: DialogState;
    generateVoice: DialogState;
    generateSFX: DialogState;
    settings: DialogState;
  };
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
  }>;
  isLoading: boolean;
  loadingMessage: string;
}

const initialState: UIState = {
  workspaceMode: 'node',
  sidebarCollapsed: false,
  propertiesPanelCollapsed: false,
  dialogs: {
    newProject: { isOpen: false },
    openProject: { isOpen: false },
    saveProject: { isOpen: false },
    exportVideo: { isOpen: false },
    importMedia: { isOpen: false },
    generateT2V: { isOpen: false },
    generateI2V: { isOpen: false },
    generateMusic: { isOpen: false },
    generateVoice: { isOpen: false },
    generateSFX: { isOpen: false },
    settings: { isOpen: false },
  },
  notifications: [],
  isLoading: false,
  loadingMessage: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setWorkspaceMode: (state, action: PayloadAction<'timeline' | 'node' | 'hybrid'>) => {
      state.workspaceMode = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    togglePropertiesPanel: (state) => {
      state.propertiesPanelCollapsed = !state.propertiesPanelCollapsed;
    },
    openDialog: (state, action: PayloadAction<{ name: keyof UIState['dialogs']; data?: any }>) => {
      state.dialogs[action.payload.name] = {
        isOpen: true,
        data: action.payload.data,
      };
    },
    closeDialog: (state, action: PayloadAction<keyof UIState['dialogs']>) => {
      state.dialogs[action.payload] = { isOpen: false };
    },
    addNotification: (state, action: PayloadAction<{
      type: 'success' | 'error' | 'warning' | 'info';
      message: string;
      duration?: number;
    }>) => {
      state.notifications.push({
        id: `notification-${Date.now()}`,
        ...action.payload,
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<{ isLoading: boolean; message?: string }>) => {
      state.isLoading = action.payload.isLoading;
      state.loadingMessage = action.payload.message || '';
    },
  },
});

export const {
  setWorkspaceMode,
  toggleSidebar,
  togglePropertiesPanel,
  openDialog,
  closeDialog,
  addNotification,
  removeNotification,
  setLoading,
} = uiSlice.actions;

export default uiSlice.reducer;