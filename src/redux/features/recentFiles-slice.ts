import { FileObject } from '@/types';
import { appConfigStore } from '@/utils/appConfigStore';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { invoke } from '@tauri-apps/api';

export const fetchFiles = createAsyncThunk(
  'files/fetchFiles',
  async (baseFolder: string, { rejectWithValue }) => {
    try {
      let files: FileObject[] = await invoke('scan_directory', { baseFolder });
      return files;
    } catch (error) {
      console.error('Failed to scan directory:', error);
      return rejectWithValue(error);
    }
  }
);

const initialBaseFolder = (await appConfigStore.get('baseFolder')) as
  | string
  | null;

type RecentFilesState = {
  baseFolder: string | null;
  files: FileObject[];
  areFilesChecked: boolean;
  status: string;
};

const initialState: RecentFilesState = {
  baseFolder: initialBaseFolder,
  files: [],
  areFilesChecked: false,
  status: 'idle',
};

export const recentFilesSlice = createSlice({
  name: 'recentFiles',
  initialState,
  reducers: {
    setBaseFolder: (state, action: PayloadAction<string | null>) => {
      state.baseFolder = action.payload;
    },
  },
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

export const { setBaseFolder } = recentFilesSlice.actions;

export default recentFilesSlice.reducer;
