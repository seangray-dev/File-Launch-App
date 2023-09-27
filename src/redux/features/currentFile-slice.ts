import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { readBinaryFile } from '@tauri-apps/api/fs';

// Helper function to convert an array buffer to a Blob
const arrayBufferToBlob = (buffer: ArrayBuffer, type: string): Blob => {
	return new Blob([buffer], { type: type });
};

// Function to fetch a local file
const fetchLocalFile = async (path: string) => {
	const arrayBuffer = await readBinaryFile(path);

	// Create Blob object from the array buffer
	const blob = arrayBufferToBlob(arrayBuffer, 'audio/mpeg');

	return blob;
};

// Initialize Web Audio API
const audioContext = new window.AudioContext();
let audioBuffer: AudioBuffer | null = null;
let audioSource: AudioBufferSourceNode | undefined;

export const loadAudio = createAsyncThunk(
	'audio/load',
	async (path: string, { dispatch }) => {
		try {
			if (!path) {
				throw new Error('Path is not defined');
			}

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
		try {
			const fileBlob = await fetchLocalFile(path);
			const objectUrl = URL.createObjectURL(fileBlob);
			return objectUrl;
		} catch (error) {
			throw error;
		}
	}
);

export const playAudio = createAsyncThunk('audio/play', async () => {
	// Stop the currently playing audio if any
	if (audioSource) {
		audioSource.stop();
	}

	// Create a new audio source
	audioSource = audioContext.createBufferSource();

	if (audioBuffer) {
		audioSource.buffer = audioBuffer;
		audioSource.connect(audioContext.destination);
		audioSource.start(0);
		return true; // Return true to indicate successful playback
	}
	return false; // Return false if audioBuffer is null
});

export const pauseAudio = createAsyncThunk('audio/pause', async () => {
	if (audioSource) {
		audioSource.stop();
	}
	return false; // Return false to indicate successful pause
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
				state.duration = action.payload;
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
