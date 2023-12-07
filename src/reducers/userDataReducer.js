import { createSlice } from '@reduxjs/toolkit'
export const userDataSlice = createSlice({
  name: "userData",
  initialState: {
    value: null
  },
  reducers: {
    fetchData: state => {
      state.value = "Hello World"
    }
  }
})
export const {fetchData} = userDataSlice.actions
export default userDataSlice.reducer
