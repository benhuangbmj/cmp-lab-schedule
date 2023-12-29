import { createSlice } from '@reduxjs/toolkit';

export const activeSlice = createSlice(
  {
    name: 'active',
    initialState: {
      user: null
    },
    reducers: {
      updateActive: (state, action) => {
        state.user = action.payload;
      }
    }
  }
);

export const selectActive = (state) => state.active;
export const { updateActive } = activeSlice.actions;
export default activeSlice.reducer;