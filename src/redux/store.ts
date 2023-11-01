import { configureStore } from '@reduxjs/toolkit';
import baseFolderStatus from './features/baseFolderStatus-slice';
import currentFile from './features/currentFile-slice';
import navigation from './features/navigation-slice';
import recentFiles from './features/recentFiles-slice';
import { fetchFilesMiddleware } from './middleware/fetchFilesMiddelware';

export const store = configureStore({
  reducer: {
    currentFile,
    recentFiles,
    baseFolderStatus,
    navigation,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(fetchFilesMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
