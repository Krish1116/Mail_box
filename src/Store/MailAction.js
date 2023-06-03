// import { createSlice } from "@reduxjs/toolkit";

// const mailInitialState = {
//   sentUserMails: [],
//   receivedUserMails: [],
//   startingMail: [],
//   selectMail: null,
//   // readCount: 0,
//   // unreadCount: 0,
// };

// // mailInitialState.receivedUserMails = mailInitialState.receivedUserMails.map(
// //   (mail) => ({
// //     ...mail,
// //     isRead: false,
// //   })
// // );

// const mailUserSlice = createSlice({
//   name: "userEmail",
//   initialState: mailInitialState,
//   reducers: {
//     deleteMail(state, action) {
//       const updateMail = state.startingMail.filter(
//         (mail) => mail.id !== action.payload
//       );
//       state.startingMail = updateMail;
//     },

//     setSelectMail(state, action) {
//       state.selectMail = action.payload;
//     },

//     markMailAsRead(state, action) {
//       const mailId = action.payload;
//       const updatedReceivedMails = state.receivedUserMails.map((mail) =>
//         mail.id === mailId ? { ...mail, read: true } : mail
//       );
//       state.receivedUserMails = updatedReceivedMails;
//     },

//     updateReceivedMails(state, action) {
//       // state.receivedUserMails = [...action.payload];
//       state.receivedUserMails = action.payload;
//     },

//     // markMailAsRead(state, action) {
//     //   const mailId = action.payload;
//     //   console.log(mailId);
//     //   const mailToUpdate = state.receivedUserMails.filter(
//     //     (mail) => mail.id === mailId && !mail.isRead
//     //   );

//     //   if (mailToUpdate) {
//     //     state.readCount += 1;
//     //     state.unreadCount -= 1;

//     //     state.receivedUserMails = state.receivedUserMails.map((mail) => {
//     //       if (mail.id === mailId) {
//     //         return { ...mail, isRead: true };
//     //       }
//     //       return mail;
//     //     });
//     //   }
//     // },

//     // setReadCount(state, action) {
//     //   state.readCount = action.payload;
//     // },
//     // setUnreadCount(state, action) {
//     //   state.unreadCount = action.payload;
//     // },
//   },
// });

// export const mailUserAction = mailUserSlice.actions;
// export default mailUserSlice.reducer;

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
  },
});

export const mailUserAction = mailUserSlice.actions;
export default mailUserSlice.reducer;
