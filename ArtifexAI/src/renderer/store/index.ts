/**
 * Redux Store Configuration
 */

import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './slices/projectSlice';
import nodeEditorReducer from './slices/nodeEditorSlice';
import timelineReducer from './slices/timelineSlice';
import mediaReducer from './slices/mediaSlice';
import previewReducer from './slices/previewSlice';
import uiReducer from './slices/uiSlice';
import aiGenerationReducer from './slices/aiGenerationSlice';

export const store = configureStore({
  reducer: {
    project: projectReducer,
    nodeEditor: nodeEditorReducer,
    timeline: timelineReducer,
    media: mediaReducer,
    preview: previewReducer,
    ui: uiReducer,
    aiGeneration: aiGenerationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['nodeEditor/updateNodeData', 'media/addMediaFile'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.file', 'payload.blob'],
        // Ignore these paths in the state
        ignoredPaths: ['media.files'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;