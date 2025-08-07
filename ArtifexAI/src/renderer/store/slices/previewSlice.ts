import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PreviewState {
  source: 'timeline' | 'node' | null;
  nodeId: string | null;
  videoUrl: string | null;
  isLoading: boolean;
  isFullscreen: boolean;
  volume: number;
  isMuted: boolean;
  quality: 'auto' | 'high' | 'medium' | 'low';
  fps: number;
}

const initialState: PreviewState = {
  source: null,
  nodeId: null,
  videoUrl: null,
  isLoading: false,
  isFullscreen: false,
  volume: 1,
  isMuted: false,
  quality: 'auto',
  fps: 30,
};

const previewSlice = createSlice({
  name: 'preview',
  initialState,
  reducers: {
    setPreviewSource: (state, action: PayloadAction<{ source: 'timeline' | 'node'; nodeId?: string }>) => {
      state.source = action.payload.source;
      state.nodeId = action.payload.nodeId || null;
    },
    setVideoUrl: (state, action: PayloadAction<string | null>) => {
      state.videoUrl = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    toggleFullscreen: (state) => {
      state.isFullscreen = !state.isFullscreen;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = Math.max(0, Math.min(1, action.payload));
    },
    toggleMute: (state) => {
      state.isMuted = !state.isMuted;
    },
    setQuality: (state, action: PayloadAction<'auto' | 'high' | 'medium' | 'low'>) => {
      state.quality = action.payload;
    },
    setFps: (state, action: PayloadAction<number>) => {
      state.fps = action.payload;
    },
    clearPreview: (state) => {
      state.source = null;
      state.nodeId = null;
      state.videoUrl = null;
      state.isLoading = false;
    },
  },
});

export const {
  setPreviewSource,
  setVideoUrl,
  setLoading,
  toggleFullscreen,
  setVolume,
  toggleMute,
  setQuality,
  setFps,
  clearPreview,
} = previewSlice.actions;

export default previewSlice.reducer;