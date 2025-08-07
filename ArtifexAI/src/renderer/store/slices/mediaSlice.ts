import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MediaFile {
  id: string;
  name: string;
  path: string;
  type: 'video' | 'image' | 'audio';
  duration?: number;
  dimensions?: { width: number; height: number };
  size: number;
  thumbnail?: string;
  metadata?: any;
}

interface MediaState {
  files: MediaFile[];
  selectedFileId: string | null;
  isLoading: boolean;
  importProgress: number;
}

const initialState: MediaState = {
  files: [],
  selectedFileId: null,
  isLoading: false,
  importProgress: 0,
};

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    addMediaFile: (state, action: PayloadAction<MediaFile>) => {
      state.files.push(action.payload);
    },
    addMultipleFiles: (state, action: PayloadAction<MediaFile[]>) => {
      state.files.push(...action.payload);
    },
    removeMediaFile: (state, action: PayloadAction<string>) => {
      state.files = state.files.filter(f => f.id !== action.payload);
      if (state.selectedFileId === action.payload) {
        state.selectedFileId = null;
      }
    },
    selectMediaFile: (state, action: PayloadAction<string | null>) => {
      state.selectedFileId = action.payload;
    },
    updateMediaFile: (state, action: PayloadAction<{ id: string; updates: Partial<MediaFile> }>) => {
      const file = state.files.find(f => f.id === action.payload.id);
      if (file) {
        Object.assign(file, action.payload.updates);
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setImportProgress: (state, action: PayloadAction<number>) => {
      state.importProgress = action.payload;
    },
    clearMedia: (state) => {
      state.files = [];
      state.selectedFileId = null;
      state.importProgress = 0;
    },
  },
});

export const {
  addMediaFile,
  addMultipleFiles,
  removeMediaFile,
  selectMediaFile,
  updateMediaFile,
  setLoading,
  setImportProgress,
  clearMedia,
} = mediaSlice.actions;

export default mediaSlice.reducer;