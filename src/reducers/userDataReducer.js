import { createSlice } from '@reduxjs/toolkit'
export const userDataSlice = createSlice({
  name: "userData",
  initialState: {
    value: null
  },
  reducers: {
    updateUserData: (state, action) => {
      state.value = action.payload;
    }
  }
})
export const {updateUserData} = userDataSlice.actions
export default userDataSlice.reducer
