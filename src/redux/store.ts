import { configureStore } from '@reduxjs/toolkit';
import currentFile from './features/currentFile-slice';
import recentFiles from './features/recentFiles-slice';
import { fetchFilesMiddleware } from './middleware/fetchFilesMiddelware';

export const store = configureStore({
  reducer: {
    currentFile,
    recentFiles,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(fetchFilesMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
