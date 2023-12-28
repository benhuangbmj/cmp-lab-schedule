import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: null,
    status: 'idle',
  },
  reducers: {
    updateTasks: (state, action) => {
      state.items = action.payload;
    }
  }
});

export const selectTasks = state => state.tasks.items;
export const {updateTasks} = tasksSlice.actions;
export default tasksSlice.reducer;