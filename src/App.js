import { Route, Routes } from "react-router-dom";
import "./App.css";
import AuthForm from "./Authentication/AuthForm";
import ForgotPassword from "./Authentication/ForgotPassword";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
      </Routes>
    </>
  );
}

export default App;
