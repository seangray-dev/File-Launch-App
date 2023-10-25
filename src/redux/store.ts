import { configureStore } from '@reduxjs/toolkit';
import componentInView from './features/componentInView-slice.ts';
import currentFile from './features/currentFile-slice';
import recentFiles from './features/recentFiles-slice';
export const store = configureStore({
  reducer: {
    currentFile,
    recentFiles,
    componentInView,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
