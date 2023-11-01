import { createSlice } from '@reduxjs/toolkit';

const savedStartupView = window.localStorage.getItem('startupView');

const initialState = {
  currentView: savedStartupView ? savedStartupView : 'Recent Files',
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
