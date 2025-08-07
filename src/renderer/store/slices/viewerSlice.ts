import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ViewerState {
  currentFrame: number;
  zoom: number;
  pan: { x: number; y: number };
  showGrid: boolean;
  showSafeArea: boolean;
  colorSpace: string;
  exposure: number;
  gamma: number;
  channels: 'rgb' | 'red' | 'green' | 'blue' | 'alpha';
  overlays: string[];
}

const initialState: ViewerState = {
  currentFrame: 1,
  zoom: 1,
  pan: { x: 0, y: 0 },
  showGrid: false,
  showSafeArea: false,
  colorSpace: 'sRGB',
  exposure: 0,
  gamma: 1,
  channels: 'rgb',
  overlays: [],
};

const viewerSlice = createSlice({
  name: 'viewer',
  initialState,
  reducers: {
    setCurrentFrame: (state, action: PayloadAction<number>) => {
      state.currentFrame = action.payload;
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = Math.max(0.1, Math.min(action.payload, 10));
    },
    setPan: (state, action: PayloadAction<{ x: number; y: number }>) => {
      state.pan = action.payload;
    },
    resetView: (state) => {
      state.zoom = 1;
      state.pan = { x: 0, y: 0 };
    },
    toggleGrid: (state) => {
      state.showGrid = !state.showGrid;
    },
    toggleSafeArea: (state) => {
      state.showSafeArea = !state.showSafeArea;
    },
    setColorSpace: (state, action: PayloadAction<string>) => {
      state.colorSpace = action.payload;
    },
    setExposure: (state, action: PayloadAction<number>) => {
      state.exposure = action.payload;
    },
    setGamma: (state, action: PayloadAction<number>) => {
      state.gamma = action.payload;
    },
    setChannels: (state, action: PayloadAction<'rgb' | 'red' | 'green' | 'blue' | 'alpha'>) => {
      state.channels = action.payload;
    },
    addOverlay: (state, action: PayloadAction<string>) => {
      if (!state.overlays.includes(action.payload)) {
        state.overlays.push(action.payload);
      }
    },
    removeOverlay: (state, action: PayloadAction<string>) => {
      state.overlays = state.overlays.filter(overlay => overlay !== action.payload);
    },
  },
});

export const {
  setCurrentFrame,
  setZoom,
  setPan,
  resetView,
  toggleGrid,
  toggleSafeArea,
  setColorSpace,
  setExposure,
  setGamma,
  setChannels,
  addOverlay,
  removeOverlay,
} = viewerSlice.actions;

export default viewerSlice.reducer;