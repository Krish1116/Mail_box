import { Route, Routes } from "react-router-dom";
import "./App.css";
import AuthForm from "./Components/Authentication/AuthForm";
import ForgotPassword from "./Components/Authentication/ForgotPassword";
import ComposeMail from "./Components/Pages/ComposeMail";
import Inbox from "./Components/Pages/Inbox";
import MailDetails from "./Components/Inbox/MailDetails";
// import SentMail from "./Components/Inbox/SentMail";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/composemail" element={<ComposeMail />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/details" element={<MailDetails />} />
      </Routes>
    </>
  );
}

export default App;
