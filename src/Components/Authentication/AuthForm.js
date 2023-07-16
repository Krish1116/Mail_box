import React, { useState, useRef } from "react";
import { Alert, FloatingLabel, Form, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { authAction } from "../Store/Auth";
import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const switchSignInToLogIn = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    const enteredConfirmPassword = isLogin
      ? ""
      : confirmPasswordInputRef.current.value;

    console.log(
      "Submitting form with data:",
      enteredEmail,
      enteredPassword,
      enteredConfirmPassword
    );

    if (!isLogin && enteredPassword !== enteredConfirmPassword) {
      setResponse("Passwords don't match. Please re-enter the password.");
      setTimeout(() => {
        setResponse(null);
        emailInputRef.current.value = "";
        passwordInputRef.current.value = "";
        confirmPasswordInputRef.current.value = "";
      }, 5000);
      return;
    }

    let url;
    if (isLogin) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCK5pcDOnCqqy8hqh7hMneHtRVKdqkj_Ns";
    } else {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCK5pcDOnCqqy8hqh7hMneHtRVKdqkj_Ns";
    }

    setIsLoading(true);

    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        confirm: enteredConfirmPassword,
        returnSecureToken: true,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        setIsLoading(false);
        emailInputRef.current.value = "";
        passwordInputRef.current.value = "";

        if (res.ok) {
          navigate("/inbox");
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessg = "Authentication Failed";

            setResponse(errorMessg);
            throw new Error(errorMessg);
          });
        }
      })
      .then((data) => {
        localStorage.setItem("token", data.idToken);
        localStorage.setItem("emailId", data.email);
        dispatch(authAction.login(data.idToken));

        if (!isLogin) {
          switchSignInToLogIn();
          setResponse(null);
        } else {
          navigate("/inbox");
        }
      })
      .catch((err) => {
        setResponse(err.message);
        setTimeout(() => {
          setResponse(null);
        }, 5000);
      });
  };

  return (
    <>
      <div className={classes.auth}>
        {!isLoading && (
          <h1 className={classes.text_title}>{isLogin ? "Login" : "Signup"}</h1>
        )}
        {response && <Alert variant="danger">{response}</Alert>}
        <Form
          onSubmit={submitHandler}
          className={isLoading ? classes.formLoad : classes.form_s}
        >
          <FloatingLabel
            controlId="floatingInput"
            label="Email address (required)"
            // className="mb-3 w-72 mx-auto"
            className={classes.lbl}
          >
            <Form.Control
              type="email"
              placeholder="name@example.com"
              ref={emailInputRef}
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingPassword"
            label="Password (required)"
            className={classes.lbl}
          >
            <Form.Control
              type="password"
              placeholder="password"
              ref={passwordInputRef}
            />
          </FloatingLabel>
          {!isLogin && (
            <FloatingLabel
              controlId="floatingConfirmPassword"
              label="Confirm Password (required)"
              className={classes.lbl}
            >
              <Form.Control
                type="password"
                placeholder="password"
                ref={confirmPasswordInputRef}
              />
            </FloatingLabel>
          )}
          <div>
            {isLogin && (
              <Link to="/forgotpassword" className={classes.pass}>
                Forgot Password?
              </Link>
            )}
          </div>
          <div>
            {!isLoading && (
              <button className={classes.bttn}>
                {isLogin ? "Login" : "Create Your Account"}
              </button>
            )}
            {isLoading && (
              // <div className="row align-items-center mt-4">
              <div className={classes.loading_container}>
                <div>
                  <h5>Loading</h5>
                </div>
                <div>
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden"></span>
                  </Spinner>
                </div>
              </div>
            )}
          </div>
          <div style={{ textAlign: "center" }}>
            <Link
              className={isLoading ? classes.changeLoad : classes.change}
              onClick={switchSignInToLogIn}
            >
              {isLogin
                ? "New Here? Sign up"
                : "If Already have an account? Login"}
            </Link>
          </div>
        </Form>
      </div>
    </>
  );
};

export default AuthForm;
