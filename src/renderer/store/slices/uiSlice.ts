import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  propertiesPanelOpen: boolean;
  timelinePanelOpen: boolean;
  selectedPanel: string | null;
  viewMode: 'node' | 'timeline' | '3d' | 'layers';
  theme: 'dark' | 'light';
  zoom: number;
  panelSizes: { [key: string]: number };
}

const initialState: UIState = {
  sidebarOpen: true,
  propertiesPanelOpen: true,
  timelinePanelOpen: true,
  selectedPanel: null,
  viewMode: 'node',
  theme: 'dark',
  zoom: 1,
  panelSizes: {
    sidebar: 300,
    properties: 320,
    timeline: 200,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    togglePropertiesPanel: (state) => {
      state.propertiesPanelOpen = !state.propertiesPanelOpen;
    },
    toggleTimelinePanel: (state) => {
      state.timelinePanelOpen = !state.timelinePanelOpen;
    },
    setSelectedPanel: (state, action: PayloadAction<string | null>) => {
      state.selectedPanel = action.payload;
    },
    setViewMode: (state, action: PayloadAction<'node' | 'timeline' | '3d' | 'layers'>) => {
      state.viewMode = action.payload;
    },
    setTheme: (state, action: PayloadAction<'dark' | 'light'>) => {
      state.theme = action.payload;
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = action.payload;
    },
    setPanelSize: (state, action: PayloadAction<{ panel: string; size: number }>) => {
      state.panelSizes[action.payload.panel] = action.payload.size;
    },
  },
});

export const {
  toggleSidebar,
  togglePropertiesPanel,
  toggleTimelinePanel,
  setSelectedPanel,
  setViewMode,
  setTheme,
  setZoom,
  setPanelSize,
} = uiSlice.actions;

export default uiSlice.reducer;