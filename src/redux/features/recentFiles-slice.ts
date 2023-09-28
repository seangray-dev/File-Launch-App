import { FileObject } from '@/types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { invoke } from '@tauri-apps/api';

export const fetchFiles = createAsyncThunk(
	'files/fetchFiles',
	async (baseFolder: string, { rejectWithValue }) => {
		try {
			let files: FileObject[] = await invoke('scan_directory', { baseFolder });
			for (const file of files) {
				if (file.path) {
					try {
						file.audioType = await invoke('check_audio_channels', {
							path: file.path,
						});
					} catch (error) {
						console.error(
							`Failed to check audio type for file ${file.path}:`,
							error
						);
						file.audioType = 'unknown';
					}
				} else {
					console.warn('Path is undefined for file:', file);
					file.audioType = 'unknown';
				}
			}
			return files;
		} catch (error) {
			console.error('Failed to scan directory:', error);
			return rejectWithValue(error);
		}
	}
);

type RecentFilesState = {
	files: FileObject[];
	areFilesChecked: boolean;
	status: string;
};

const initialState: RecentFilesState = {
	files: [],
	areFilesChecked: false,
	status: 'idle',
};

export const recentFilesSlice = createSlice({
	name: 'recentFiles',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchFiles.pending, (state) => {
				state.status = 'loading';
				state.areFilesChecked = false;
			})
			.addCase(fetchFiles.fulfilled, (state, action) => {
				state.status = 'idle';
				state.files = action.payload;
				state.areFilesChecked = true;
			})
			.addCase(fetchFiles.rejected, (state, action) => {
				state.status = 'failed';
				state.areFilesChecked = false;
			});
	},
});

export default recentFilesSlice.reducer;
