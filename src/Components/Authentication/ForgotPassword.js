import React, { useRef } from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const emailInputRef = useRef();

  const forgotPasswordHandler = async (e) => {
    e.preventDefault();
    console.log("clicked");
    try {
      const res = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyCK5pcDOnCqqy8hqh7hMneHtRVKdqkj_Ns",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requestType: "PASSWORD_RESET",
            email: emailInputRef.current.value,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        navigate("/");
        console.log(data);
      } else {
        throw data.error;
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <form onSubmit={forgotPasswordHandler}>
      <h2 className="text-center mt-5">Forgot Password</h2>
      <div>
        <FloatingLabel
          controlId="floatingInput"
          label="Email address (required)"
          className="mb-3 w-50 mx-auto  mt-5"
        >
          <Form.Control
            type="email"
            placeholder="name@example.com"
            className="lbl"
            ref={emailInputRef}
          />
        </FloatingLabel>
      </div>
      <Button
        type="submit"
        variant="outline-primary"
        className="w-50"
        style={{ position: "relative", top: "25px", right: "-25%" }}
      >
        Send Link
      </Button>{" "}
    </form>
  );
};

export default ForgotPassword;
