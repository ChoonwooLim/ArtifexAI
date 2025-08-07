import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TimelineClip {
  id: string;
  mediaId: string;
  trackId: string;
  startTime: number;
  duration: number;
  inPoint: number;
  outPoint: number;
  opacity: number;
  volume: number;
  effects: any[];
}

export interface TimelineTrack {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'effect';
  muted: boolean;
  locked: boolean;
  height: number;
  clips: TimelineClip[];
}

interface TimelineState {
  tracks: TimelineTrack[];
  currentTime: number;
  duration: number;
  zoom: number;
  selectedClipId: string | null;
  selectedTrackId: string | null;
  isPlaying: boolean;
  playbackRate: number;
}

const initialState: TimelineState = {
  tracks: [
    { id: 'video-1', name: 'Video 1', type: 'video', muted: false, locked: false, height: 80, clips: [] },
    { id: 'video-2', name: 'Video 2', type: 'video', muted: false, locked: false, height: 80, clips: [] },
    { id: 'audio-1', name: 'Audio 1', type: 'audio', muted: false, locked: false, height: 60, clips: [] },
    { id: 'audio-2', name: 'Audio 2', type: 'audio', muted: false, locked: false, height: 60, clips: [] },
  ],
  currentTime: 0,
  duration: 300, // 5 minutes default
  zoom: 1,
  selectedClipId: null,
  selectedTrackId: null,
  isPlaying: false,
  playbackRate: 1,
};

const timelineSlice = createSlice({
  name: 'timeline',
  initialState,
  reducers: {
    addTrack: (state, action: PayloadAction<TimelineTrack>) => {
      state.tracks.push(action.payload);
    },
    removeTrack: (state, action: PayloadAction<string>) => {
      state.tracks = state.tracks.filter(t => t.id !== action.payload);
    },
    addClip: (state, action: PayloadAction<{ trackId: string; clip: TimelineClip }>) => {
      const track = state.tracks.find(t => t.id === action.payload.trackId);
      if (track) {
        track.clips.push(action.payload.clip);
      }
    },
    removeClip: (state, action: PayloadAction<{ trackId: string; clipId: string }>) => {
      const track = state.tracks.find(t => t.id === action.payload.trackId);
      if (track) {
        track.clips = track.clips.filter(c => c.id !== action.payload.clipId);
      }
    },
    updateClip: (state, action: PayloadAction<{ trackId: string; clipId: string; updates: Partial<TimelineClip> }>) => {
      const track = state.tracks.find(t => t.id === action.payload.trackId);
      if (track) {
        const clip = track.clips.find(c => c.id === action.payload.clipId);
        if (clip) {
          Object.assign(clip, action.payload.updates);
        }
      }
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = Math.max(0, Math.min(action.payload, state.duration));
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = Math.max(0.1, Math.min(10, action.payload));
    },
    selectClip: (state, action: PayloadAction<string | null>) => {
      state.selectedClipId = action.payload;
    },
    selectTrack: (state, action: PayloadAction<string | null>) => {
      state.selectedTrackId = action.payload;
    },
    setPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setPlaybackRate: (state, action: PayloadAction<number>) => {
      state.playbackRate = action.payload;
    },
    toggleTrackMute: (state, action: PayloadAction<string>) => {
      const track = state.tracks.find(t => t.id === action.payload);
      if (track) {
        track.muted = !track.muted;
      }
    },
    toggleTrackLock: (state, action: PayloadAction<string>) => {
      const track = state.tracks.find(t => t.id === action.payload);
      if (track) {
        track.locked = !track.locked;
      }
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
  setZoom,
  selectClip,
  selectTrack,
  setPlaying,
  setPlaybackRate,
  toggleTrackMute,
  toggleTrackLock,
} = timelineSlice.actions;

export default timelineSlice.reducer;