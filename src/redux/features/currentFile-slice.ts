import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { invoke } from '@tauri-apps/api';

export const playAudio = createAsyncThunk(
	'audio/play',
	async (path, { dispatch }) => {
		try {
			const result = await invoke('play_audio', { path });
			return result; // This will be automatically used as the action payload
		} catch (error) {
			throw error; // This will be automatically used as the rejected action error
		}
	}
);

type CurrentFileState = {
	isPlaying: boolean;
	activeFileIndex: number | null;
	name: string;
	path: string;
};

const initialState: CurrentFileState = {
	isPlaying: false,
	activeFileIndex: null,
	name: '',
	path: '',
};

export const currentFile = createSlice({
	name: 'currentFile',
	initialState,
	reducers: {
		setCurrentFile: (
			state,
			action: PayloadAction<Partial<CurrentFileState>>
		) => {
			if (action.payload.isPlaying !== undefined) {
				state.isPlaying = action.payload.isPlaying;
			}
			if (action.payload.activeFileIndex !== undefined) {
				state.activeFileIndex = action.payload.activeFileIndex;
				state.name = action.payload.name || '';
			}
		},
		resetCurrentFile: (state) => {
			state.isPlaying = false;
			state.activeFileIndex = null;
		},
		togglePlay: (state) => {
			state.isPlaying = !state.isPlaying;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(playAudio.pending, (state) => {
				// Handle pending state if needed, like setting a loading flag
			})
			.addCase(playAudio.fulfilled, (state, action) => {
				// The promise is resolved and we get the result in `action.payload`
				state.isPlaying = true;
			})
			.addCase(playAudio.rejected, (state, action) => {
				// The promise is rejected and we get the error in `action.error`
				state.isPlaying = false;
			});
	},
});

export const { setCurrentFile, resetCurrentFile, togglePlay } =
	currentFile.actions;
export default currentFile.reducer;
