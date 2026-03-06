import { IUser } from "@/src/GlobalTypes/User";
import { createSlice } from "@reduxjs/toolkit";

const user: IUser = {
  givenName: "",
  familyName: "",
  id: 0,
  accessToken: "",
  webSocketToken: "",
  email: "",
  weight: "",
  height: "",
  contactNumber: "",
  deviceCode: "",
  location: null,
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
    addWebSocketToken: (state, action) => {
      state.value = {
        ...state.value,
        webSocketToken: action.payload,
      };
    },
    addAccessToken: (state, action) => {
      state.value = {
        ...state.value,
        accessToken: action.payload,
      };
    },
    addEmail: (state, action) => {
      state.value = {
        ...state.value,
        email: action.payload,
      };
    },
    addWeight: (state, action) => {
      state.value = {
        ...state.value,
        weight: action.payload,
      };
    },
    addHeight: (state, action) => {
      state.value = {
        ...state.value,
        height: action.payload,
      };
    },
    addContactNumber: (state, action) => {
      state.value = {
        ...state.value,
        contactNumber: action.payload,
      };
    },
    addLocation: (state, action) => {
      state.value = {
        ...state.value,
        location: action.payload,
      };
    },
    addDeviceCode: (state, action) => {
      state.value = {
        ...state.value,
        deviceCode: action.payload,
      };
    },
  },
});
export const {
  addGivenName,
  addFamilyName,
  addUserId,
  addAccessToken,
  addEmail,
  addWeight,
  addHeight,
  addContactNumber,
  addLocation,
  addDeviceCode,
  addWebSocketToken,
} = userSlice.actions;
export default userSlice.reducer;
