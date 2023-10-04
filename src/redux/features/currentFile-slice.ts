import { FileObject } from '@/types';
import { blobCache, fetchLocalFile } from '@/utils/audioUtils';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

type CurrentFileState = {
	isPlaying: boolean;
	activeFileIndex: number | null;
	filteredFiles: FileObject[];
	name: string;
	path: string;
	duration: number | null;
	objectUrl: string | null;
	volume: number | null;
	isRepeating: boolean;
};

const initialState: CurrentFileState = {
	isPlaying: false,
	activeFileIndex: null,
	filteredFiles: [],
	name: '',
	path: '',
	duration: null,
	objectUrl: null,
	volume: null,
	isRepeating: false,
};

// Initialize Web Audio API
export const audioContext = new window.AudioContext();
let gainNode: GainNode = audioContext.createGain();

export let offsetTime = 0;
console.log('Initial offsetTime: ', offsetTime);
export let startTime = 0;
export let audioBuffer: AudioBuffer | null = null;
export let audioSource: AudioBufferSourceNode | undefined;

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
		audioSource.connect(gainNode);
		gainNode.connect(audioContext.destination);

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

export const restartAudio = createAsyncThunk(
	'audio/restart',
	async (_, { getState, dispatch }) => {
		const state = getState() as RootState;
		const objectUrl = state.currentFile.objectUrl;

		if (!objectUrl) return false;

		if (audioSource) {
			audioSource.stop();
		}

		offsetTime = 0; // Reset the offset time to start from the beginning

		const response = await fetch(objectUrl);
		const arrayBuffer = await response.arrayBuffer();
		audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

		audioSource = audioContext.createBufferSource();
		audioSource.buffer = audioBuffer;
		audioSource.connect(gainNode);
		gainNode.connect(audioContext.destination);

		startTime = audioContext.currentTime; // Reset the start time
		audioSource.start(startTime, offsetTime);

		return true;
	}
);

export const nextTrack = createAsyncThunk(
	'currentFile/nextTrack',
	async (_, { getState, dispatch }) => {
		const state = getState() as RootState;
		const { activeFileIndex, filteredFiles } = state.currentFile;

		if (activeFileIndex === null) {
			return null;
		}

		const nextIndex =
			activeFileIndex + 1 < filteredFiles.length
				? activeFileIndex + 1
				: activeFileIndex;

		const nextPath = filteredFiles[nextIndex].path;
		const nextName = filteredFiles[nextIndex].name;

		if (!nextPath) {
			throw new Error('Next path is not defined');
		}

		// Auto-load and play the new track
		await dispatch(loadAudio(nextPath));
		await dispatch(playAudio());

		// Update the current file's name
		dispatch(setCurrentFile({ name: nextName, activeFileIndex: nextIndex }));

		return nextIndex;
	}
);

export const prevTrack = createAsyncThunk(
	'currentFile/prevTrack',
	async (_, { getState, dispatch }) => {
		const state = getState() as RootState;
		const { activeFileIndex, filteredFiles } = state.currentFile;

		if (activeFileIndex === null) {
			return null;
		}

		const prevIndex =
			activeFileIndex - 1 >= 0 ? activeFileIndex - 1 : activeFileIndex;

		const prevPath = filteredFiles[prevIndex].path;
		const prevName = filteredFiles[prevIndex].name;

		if (!prevPath) {
			throw new Error('Previous path is not defined');
		}

		// Auto-load and play the new track
		await dispatch(loadAudio(prevPath));
		await dispatch(playAudio());

		// Update the current file's name
		dispatch(setCurrentFile({ name: prevName, activeFileIndex: prevIndex }));

		return prevIndex;
	}
);

export const skipBack = createAsyncThunk(
	'audio/skipBack',
	async (_, { dispatch }) => {
		// Decrease the offset by 15 seconds
		offsetTime -= 15;
		console.log('Updated offsetTime in skipAhead: ', offsetTime);
		// Don't allow negative offset
		if (offsetTime < 0) offsetTime = 0;
		// Re-initialize the playback
		await dispatch(updatePlaybackPosition(offsetTime));
	}
);

export const skipAhead = createAsyncThunk(
	'audio/skipAhead',
	async (_, { dispatch }) => {
		// Increase the offset by 15 seconds
		offsetTime += 15;
		// Re-initialize the playback
		await dispatch(updatePlaybackPosition(offsetTime));
	}
);

export const updatePlaybackPosition = createAsyncThunk(
	'audio/updatePlaybackPosition',
	async (newTime: number) => {
		offsetTime = newTime;

		if (audioSource) {
			audioSource.stop();
		}

		audioSource = audioContext.createBufferSource();
		audioSource.buffer = audioBuffer;
		audioSource.connect(gainNode).connect(audioContext.destination);

		startTime = audioContext.currentTime - offsetTime;
		audioSource.start(startTime, offsetTime);
	}
);

export const updateVolume = createAsyncThunk<number, number>(
	'audio/updateVolume',
	async (volume: number) => {
		gainNode.gain.value = volume / 100;
		return volume;
	}
);

export const currentFile = createSlice({
	name: 'currentFile',
	initialState,
	reducers: {
		setFilteredFiles: (state, action: PayloadAction<FileObject[]>) => {
			state.filteredFiles = action.payload;
		},
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
		toggleRepeat: (state) => {
			state.isRepeating = !state.isRepeating;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(createObjectUrlFromPath.fulfilled, (state, action) => {
				state.objectUrl = action.payload;
			})
			.addCase(loadAudio.fulfilled, (state, action) => {
				state.objectUrl = action.payload;
				// state.isLoading = false;
			})
			// .addCase(loadAudio.pending, (state) => {
			// 	state.isLoading = true; // Set loading state when loadAudio starts
			// })
			// .addCase(loadAudio.rejected, (state) => {
			// 	state.isLoading = false; // Unset loading state if loadAudio fails
			// })
			.addCase(playAudio.fulfilled, (state) => {
				state.isPlaying = true;
			})
			.addCase(pauseAudio.fulfilled, (state) => {
				state.isPlaying = false;
			})
			.addCase(updateVolume.fulfilled, (state, action) => {
				state.volume = action.payload;
			})
			.addCase(nextTrack.fulfilled, (state, action) => {
				state.activeFileIndex = action.payload;
			})
			.addCase(prevTrack.fulfilled, (state, action) => {
				state.activeFileIndex = action.payload;
			});
	},
});

export const {
	setCurrentFile,
	resetCurrentFile,
	togglePlay,
	setFilteredFiles,
	toggleRepeat,
} = currentFile.actions;

export default currentFile.reducer;
