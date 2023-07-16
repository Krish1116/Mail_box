import React, { useRef, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import classes from "./ComposeMail.module.css";
import { useDispatch } from "react-redux";
import { emailActions } from "../Store/mail";
import { useNavigate } from "react-router-dom";

const ComposeMail = () => {
  const emailInputRef = useRef();
  const subInputRef = useRef();
  const [mssg, setMssg] = useState();
  const dispatch = useDispatch();
  const navigation = useNavigate();

  const refHandler = (conteState) => {
    setMssg(conteState);
  };

  const emailHandler = async (e) => {
    e.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredSub = subInputRef.current.value;

    const receivedEmail = enteredEmail.replace(".", "").replace("@", "");
    const sendEmail = localStorage.getItem("emailId");
    // console.log(sendEmail);
    const emailSender = sendEmail.replace(".", "").replace("@", "");

    const objSent = {
      to: enteredEmail,
      subject: enteredSub,
      message: mssg,
    };

    console.log(objSent);

    const objRecieved = {
      from: sendEmail,
      subject: enteredSub,
      message: mssg,
    };
    console.log(objRecieved);

    fetch(
      `https://mailbox-761c7-default-rtdb.firebaseio.com/${receivedEmail}/received.json`,
      {
        method: "POST",
        body: JSON.stringify({
          ...objRecieved,
        }),
        headers: {
          "Content-type": "application/json",
        },
      }
    ).then(async (res) => {
      const data = await res.json();
      console.log(data);
      fetch(
        `https://mailbox-761c7-default-rtdb.firebaseio.com/${receivedEmail}/received/${data.name}.json`,
        {
          method: "PATCH",
          body: JSON.stringify({
            id: data.name,
            read: false,
          }),
        }
      );

      dispatch(
        emailActions.recivedEmails({
          id: data.name,
          from: objRecieved.from,
          subject: objRecieved.subject,
          message: objRecieved.message,
          read: false,
        })
      );
    });

    fetch(
      `https://mailbox-761c7-default-rtdb.firebaseio.com/${emailSender}/sent.json`,
      {
        method: "POST",
        body: JSON.stringify({
          ...objSent,
        }),
        headers: {
          "Content-type": "application/json",
        },
      }
    ).then(async (res) => {
      const data = await res.json();
      console.log(data);

      fetch(
        `https://mailbox-761c7-default-rtdb.firebaseio.com/${emailSender}/sent/${data.name}.json`,
        {
          method: "PATCH",
          body: JSON.stringify({
            id: data.name,
          }),
        }
      );
      dispatch(
        emailActions.sentEmails({
          id: data.name,
          to: objSent.to,
          subject: objSent.subject,
          message: objSent.message,
        })
      );
    });

    alert("sent successfully");
    console.log("sent successfully");

    emailInputRef.current.value = "";
    subInputRef.current.value = "";
    setMssg(""); // Clear the editor content
    navigation("/inbox");
  };

  const goHomeHandler = () => {
    navigation("/inbox");
  };

  return (
    <Container className={classes.mainBox}>
      <Button onClick={goHomeHandler} className={classes.home}>
        Go To Home{" "}
      </Button>

      <Row>
        <Col xs={10}>
          <Form className={classes.formContainer}>
            <Form.Group>
              <Form.Label>To</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                required
                ref={emailInputRef}
                className="border-0 border-bottom border-dark"
              />
            </Form.Group>
            <Form.Group className="mt-4">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                type="text"
                placeholder="Subject"
                required
                ref={subInputRef}
                className="border-0 border-bottom border-dark"
              />
            </Form.Group>
            <Form.Group className="mt-4">
              <Form.Label>Message</Form.Label>

              <Editor
                onChange={refHandler}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                wrapperStyle={{
                  border: "1px solid black",
                  borderRadius: "5px",
                  minHeight: "250px",
                }}
              />
            </Form.Group>
            <Form.Group>
              <Button
                onClick={emailHandler}
                type="button"
                variant="primary"
                className="mt-4"
              >
                Submit
              </Button>{" "}
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ComposeMail;
