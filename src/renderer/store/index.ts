import { configureStore } from '@reduxjs/toolkit';

// Slices
import uiSlice from './slices/uiSlice';
import projectSlice from './slices/projectSlice';
import nodeGraphSlice from './slices/nodeGraphSlice';
import timelineSlice from './slices/timelineSlice';
import viewerSlice from './slices/viewerSlice';

export const store = configureStore({
  reducer: {
    ui: uiSlice,
    project: projectSlice,
    nodeGraph: nodeGraphSlice,
    timeline: timelineSlice,
    viewer: viewerSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;