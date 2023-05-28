import { createSlice } from "@reduxjs/toolkit";

const initialMailState = { recivedEmails: [], sentMail: [], unread: 0 };

const emailSlice = createSlice({
  name: "email",
  initialState: initialMailState,
  reducers: {
    recivedEmails(state, action) {
      const newEmail = action.payload;

      state.recivedEmails.push({
        id: newEmail.id,
        from: newEmail.from,
        subject: newEmail.subject,
        body: newEmail.body,
      });
    },
    sentEmails(state, action) {
      const sentEmail = action.payload;

      state.recivedEmails.push({
        id: sentEmail.id,
        from: sentEmail.from,
        subject: sentEmail.subject,
        body: sentEmail.body,
      });
    },
  },
});

export const emailActions = emailSlice.actions;
export default emailSlice.reducer;
