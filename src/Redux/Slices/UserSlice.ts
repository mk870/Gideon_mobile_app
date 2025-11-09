import { IUser } from "@/src/GlobalTypes/UserTypes";
import { createSlice } from "@reduxjs/toolkit";

const user: IUser = {
  givenName: "",
  familyName: "",
  id: 0,
  accessToken: "",
  role:"user",
};

export const userSlice = createSlice({
  name: "user",
  initialState: {
    value: user,
  },
  reducers: {
    addGivenName: (state, action) => {
      state.value = {
        ...state.value,
        givenName: action.payload,
      };
    },
    addFamilyName: (state, action) => {
      state.value = {
        ...state.value,
        familyName: action.payload,
      };
    },
    addUserId: (state, action) => {
      state.value = {
        ...state.value,
        id: action.payload,
      };
    },
    addAccessToken: (state, action) => {
      state.value = {
        ...state.value,
        accessToken: action.payload,
      };
    }
  },
});
export const {
  addGivenName,
  addFamilyName,
  addUserId,
  addAccessToken,
} = userSlice.actions;
export default userSlice.reducer;