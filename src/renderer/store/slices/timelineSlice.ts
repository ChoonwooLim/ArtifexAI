import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TimelineClip {
  id: string;
  name: string;
  trackId: string;
  start: number;
  duration: number;
  type: 'video' | 'audio' | 'image' | 'effect';
  source?: string;
  properties: any;
}

export interface TimelineTrack {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'effect';
  enabled: boolean;
  locked: boolean;
  height: number;
}

interface TimelineState {
  tracks: TimelineTrack[];
  clips: TimelineClip[];
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  playbackRate: number;
  zoom: number;
  selectedClips: string[];
}

const initialState: TimelineState = {
  tracks: [
    { id: '1', name: 'Video 1', type: 'video', enabled: true, locked: false, height: 60 },
    { id: '2', name: 'Audio 1', type: 'audio', enabled: true, locked: false, height: 40 },
  ],
  clips: [],
  currentTime: 0,
  duration: 600,
  isPlaying: false,
  playbackRate: 1,
  zoom: 1,
  selectedClips: [],
};

const timelineSlice = createSlice({
  name: 'timeline',
  initialState,
  reducers: {
    addTrack: (state, action: PayloadAction<Omit<TimelineTrack, 'id'>>) => {
      const newTrack: TimelineTrack = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.tracks.push(newTrack);
    },
    removeTrack: (state, action: PayloadAction<string>) => {
      state.tracks = state.tracks.filter(track => track.id !== action.payload);
      state.clips = state.clips.filter(clip => clip.trackId !== action.payload);
    },
    addClip: (state, action: PayloadAction<TimelineClip>) => {
      state.clips.push(action.payload);
    },
    removeClip: (state, action: PayloadAction<string>) => {
      state.clips = state.clips.filter(clip => clip.id !== action.payload);
    },
    updateClip: (state, action: PayloadAction<{ id: string; data: Partial<TimelineClip> }>) => {
      const clipIndex = state.clips.findIndex(clip => clip.id === action.payload.id);
      if (clipIndex >= 0) {
        state.clips[clipIndex] = { ...state.clips[clipIndex], ...action.payload.data };
      }
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = Math.max(0, Math.min(action.payload, state.duration));
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    setPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setPlaybackRate: (state, action: PayloadAction<number>) => {
      state.playbackRate = action.payload;
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = action.payload;
    },
    setSelectedClips: (state, action: PayloadAction<string[]>) => {
      state.selectedClips = action.payload;
    },
  },
});

export const {
  addTrack,
  removeTrack,
  addClip,
  removeClip,
  updateClip,
  setCurrentTime,
  setDuration,
  setPlaying,
  setPlaybackRate,
  setZoom,
  setSelectedClips,
} = timelineSlice.actions;

export default timelineSlice.reducer;