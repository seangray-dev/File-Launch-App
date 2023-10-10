import { FileObject } from '@/types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { invoke } from '@tauri-apps/api';
import { RootState } from '../store';

export const fetchFiles = createAsyncThunk(
	'files/fetchFiles',
	async (baseFolder: string, { getState, rejectWithValue }) => {
		const { files } = (getState() as RootState).recentFiles;
		if (files.length > 0) {
			return files;
		}
		try {
			let files: FileObject[] = await invoke('scan_directory', { baseFolder });
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
