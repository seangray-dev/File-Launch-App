import { audioContext, blobCache, fetchLocalFile } from '@/utils/audioUtils';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

let audioBuffer: AudioBuffer | null = null;
let audioSource: AudioBufferSourceNode | undefined;
let offsetTime = 0;
let startTime = 0;

export const loadAudio = createAsyncThunk(
	'audio/load',
	async (path: string, { dispatch }) => {
		try {
			if (!path) {
				throw new Error('Path is not defined');
			}

			// Reset the offsetTime and startTime
			offsetTime = 0;
			startTime = 0;

			// Dispatch the createObjectUrlFromPath thunk and await its completion
			const action = await dispatch(createObjectUrlFromPath(path));

			// Extract the objectUrl from the action payload if the action is fulfilled
			let objectUrl: string;
			if (createObjectUrlFromPath.fulfilled.match(action)) {
				objectUrl = action.payload as string;
			} else {
				// Handle error (if you need to)
				throw new Error('Failed to create object URL');
			}

			return objectUrl;
		} catch (error) {
			throw error;
		}
	}
);

export const createObjectUrlFromPath = createAsyncThunk(
	'audio/createObjectUrl',
	async (path: string) => {
		let fileBlob: Blob;

		if (blobCache[path]) {
			fileBlob = blobCache[path];
		} else {
			fileBlob = await fetchLocalFile(path);
			blobCache[path] = fileBlob;
		}

		const objectUrl = URL.createObjectURL(fileBlob);
		return objectUrl;
	}
);

export const playAudio = createAsyncThunk(
	'audio/play',
	async (_, { getState }) => {
		const state = getState() as RootState;
		const objectUrl = state.currentFile.objectUrl;

		if (!objectUrl) return false;

		if (audioSource) {
			audioSource.stop();
		}

		const response = await fetch(objectUrl);
		const arrayBuffer = await response.arrayBuffer();
		audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

		audioSource = audioContext.createBufferSource();
		audioSource.buffer = audioBuffer;
		audioSource.connect(audioContext.destination);

		startTime = audioContext.currentTime - offsetTime; // Keep track of when we started
		audioSource.start(startTime, offsetTime);

		return true;
	}
);

export const pauseAudio = createAsyncThunk('audio/pause', async () => {
	if (audioSource) {
		offsetTime = audioContext.currentTime - startTime; // Calculate how much time passed
		audioSource.stop();
	}
	return false;
});

type CurrentFileState = {
	isPlaying: boolean;
	activeFileIndex: number | null;
	name: string;
	path: string;
	duration: number | null;
	objectUrl: string | null;
};

const initialState: CurrentFileState = {
	isPlaying: false,
	activeFileIndex: null,
	name: '',
	path: '',
	duration: null,
	objectUrl: null,
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
			if (action.payload.objectUrl !== undefined) {
				state.objectUrl = action.payload.objectUrl;
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
			.addCase(createObjectUrlFromPath.fulfilled, (state, action) => {
				state.objectUrl = action.payload;
			})
			.addCase(loadAudio.fulfilled, (state, action) => {
				state.objectUrl = action.payload;
			})
			.addCase(playAudio.fulfilled, (state) => {
				state.isPlaying = true;
			})
			.addCase(pauseAudio.fulfilled, (state) => {
				state.isPlaying = false;
			});
	},
});

export const { setCurrentFile, resetCurrentFile, togglePlay } =
	currentFile.actions;

export default currentFile.reducer;
