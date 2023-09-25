import { configureStore } from '@reduxjs/toolkit';
import currentFile from './features/currentFile-slice';

export const store = configureStore({
	reducer: {
		currentFile,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
