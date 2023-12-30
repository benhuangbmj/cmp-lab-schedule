import { createSlice } from '@reduxjs/toolkit';

export const activeSlice = createSlice(
  {
    name: 'active',
    initialState: {
      user: null,
      loaded: false,
    },
    reducers: {
      updateActive: (state, action) => {
        state.user = action.payload;
        state.loaded = true;
      }
    }
  }
);

export const selectActive = (state) => state.active;
export const { updateActive } = activeSlice.actions;
export default activeSlice.reducer;