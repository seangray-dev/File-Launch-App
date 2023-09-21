import { configureStore } from '@reduxjs/toolkit';
import currentFile from './features/currentFile-slice';

export const store = configureStore({
	reducer: {
		currentFile,
	},
});
