import { checkBaseFolderExistence } from '@/utils/baseFolderCheck';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BaseFolderStatusState {
  isAvailable: boolean | null;
  isLoading: boolean;
}

const initialState: BaseFolderStatusState = {
  isAvailable: null,
  isLoading: false,
};

export const checkBaseFolderStatus = createAsyncThunk(
  'baseFolderStatus/checkStatus',
  async (_, { dispatch }) => {
    dispatch(setLoading(true));
    const status = await checkBaseFolderExistence();
    dispatch(setAvailability(status === 'available'));
    dispatch(setLoading(false));
  }
);

const baseFolderStatus = createSlice({
  name: 'baseFolderStatus',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setAvailability(state, action: PayloadAction<boolean>) {
      state.isAvailable = action.payload;
    },
  },
});

export const { setLoading, setAvailability } = baseFolderStatus.actions;

export default baseFolderStatus.reducer;
