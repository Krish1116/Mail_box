import { createSlice } from "@reduxjs/toolkit";

const mailInitialState = { sentUserMails: [], startingMail: [] };

const mailUserSlice = createSlice({
  name: "userEmail",
  initialState: mailInitialState,
  reducers: {
    deleteMail(state, action) {
      const updateMail = state.startingMail.filter(
        (mail) => mail.id !== action.payload
      );
      state.startingMail = updateMail;
    },
  },
});

export const mailUserAction = mailUserSlice.actions;
export default mailUserSlice.reducer;
