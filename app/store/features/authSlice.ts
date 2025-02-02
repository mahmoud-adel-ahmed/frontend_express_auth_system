import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
}

interface InitState {
  user: User | null;
}

const initState: InitState = {
  user: null,
};

const authSlice = createSlice({
  name: "Auth",
  initialState: initState,
  reducers: {
    setUser: (state, { payload }: PayloadAction<User | null>) => {
      state.user = payload;
    },
  },
});

export const { setUser } = authSlice.actions;

export default authSlice.reducer;
