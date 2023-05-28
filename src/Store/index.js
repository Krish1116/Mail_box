import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Auth";
import mailReducer from "./mail";

const store = configureStore({
  reducer: {
    auth: authReducer,
    mail: mailReducer,
  },
});

export default store;
