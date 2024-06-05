import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const spaceId = import.meta.env.VITE_SPACE_ID;
const cmaToken = import.meta.env.VITE_CMA_TOKEN;
const accessToken = import.meta.env.VITE_ACCESS_TOKEN;
const databaseId = import.meta.env.VITE_DATABASE_ID;
const backupId = import.meta.env.VITE_BACKUP_ID;
const userInfoId = import.meta.env.VITE_USER_INFO_ID;

export const userDataSlice = createSlice({
  name: "userData",
  initialState: {
    items: null,
    status: "idle",
  },
  reducers: {
    updateUserData: (state, action) => {
      state.items = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      state.items = action.payload;
      state.status = "succeeded";
    });
  },
});

export const fetchUserData = createAsyncThunk(
  "userData/fetchUserData",
  async () => {
    const query = `{
    tutorsCollection {
      items {
        tutorInfo
        sys {
          id
        }
      }
    }
  }`;
    let response = await fetch(
      `https://graphql.contentful.com/content/v1/spaces/${spaceId}/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ query }),
      },
    );
    response = await response.json();
    const output = response.data.tutorsCollection.items.find(
      (e, i) => e.sys.id == userInfoId,
    ).tutorInfo;
    for (let user in output) {
      const currUser = output[user];
      delete currUser.password;
      delete currUser.resetPassword;
    }
    return output;
  },
);

export const selectUserData = (state) => state.userData;
export const { updateUserData } = userDataSlice.actions;
export default userDataSlice.reducer;
