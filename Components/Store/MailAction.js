import { createSlice } from "@reduxjs/toolkit";

const mailInitialState = {
  sentUserMails: [],
  receivedUserMails: [],
  startingMail: [],
  selectMail: null,
};

const mailUserSlice = createSlice({
  name: "userEmail",
  initialState: mailInitialState,
  reducers: {
    deleteMail(state, action) {
      const updatedStartingMail = state.startingMail.filter(
        (mail) => mail.id !== action.payload
      );
      state.startingMail = updatedStartingMail;
    },

    setSelectMail(state, action) {
      state.selectMail = action.payload;
    },

    markMailAsRead(state, action) {
      const mailId = action.payload;
      const updatedReceivedMails = state.receivedUserMails.map((mail) =>
        mail.id === mailId ? { ...mail, read: true } : mail
      );
      state.receivedUserMails = updatedReceivedMails;
    },

    updateReceivedMails(state, action) {
      state.receivedUserMails = action.payload;
    },

    updateSentMails(state, action) {
      state.sentUserMails = action.payload;
    },
  },
});

export const mailUserAction = mailUserSlice.actions;
export default mailUserSlice.reducer;
