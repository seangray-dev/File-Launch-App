import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type CurrentFileState = {
	isPlaying: boolean;
};

const initialState: CurrentFileState = {
	isPlaying: false,
};

export const currentFile = createSlice({
	name: 'currentFile',
	initialState,
	reducers: {
		setCurrentFile: (state, action: PayloadAction<CurrentFileState>) => {
			state.isPlaying = action.payload.isPlaying;
		},
		resetCurrentFile: (state) => {
			state.isPlaying = false;
		},
		togglePlay: (state) => {
			state.isPlaying = !state.isPlaying;
		},
	},
});

export const { setCurrentFile, resetCurrentFile, togglePlay } =
	currentFile.actions;
export default currentFile.reducer;
