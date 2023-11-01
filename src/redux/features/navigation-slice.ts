import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentView: 'Recent Files',
};

const navigation = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setCurrentView(state, action) {
      state.currentView = action.payload;
    },
  },
});

export const { setCurrentView } = navigation.actions;
export default navigation.reducer;
