import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const spaceId = import.meta.env.VITE_SPACE_ID;
const cmaToken = import.meta.env.VITE_CMA_TOKEN;
const accessToken = import.meta.env.VITE_ACCESS_TOKEN;
const databaseId = import.meta.env.VITE_DATABASE_ID;
const backupId = import.meta.env.VITE_BACKUP_ID;

export const userDataSlice = createSlice({
  name: "userData",
  initialState: {
    value: null
  },
  reducers: {
    updateUserData: (state, action) => {
      state.value = action.payload;
    }
  },
  extraReducers(builder) {
    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      state.value = action.payload;
    })
  }
})

export const fetchUserData = createAsyncThunk('userData/fetchUserData', async () => {
  const query = `{
    tutorsCollection {
      items {
        tutorInfo
      }
    }
  }`;
  let response = await fetch(`https://graphql.contentful.com/content/v1/spaces/${spaceId}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ query }),
  })
  response = await response.json();
  return response.data;
})

export const {updateUserData} = userDataSlice.actions
export default userDataSlice.reducer
