import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Auth";
import mailReducer from "./mail";
import userMailReducer from "./MailAction";

const store = configureStore({
  reducer: {
    auth: authReducer,
    mail: mailReducer,
    userMail: userMailReducer,
  },
});

export default store;
