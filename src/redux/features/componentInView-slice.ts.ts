import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ComponentViewState = {
  currentView: string;
};

const initialState: ComponentViewState = {
  currentView: 'default-view',
};

const componentInView = createSlice({
  name: 'componentInView',
  initialState,
  reducers: {
    setCurrentView: (state, action: PayloadAction<string>) => {
      state.currentView = action.payload;
    },
  },
});

export const { setCurrentView } = componentInView.actions;

export default componentInView.reducer;
