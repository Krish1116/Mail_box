import React from "react";
import classes from "./SentMail.module.css";
import { Table, Badge, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { mailUserAction } from "../Store/MailAction";
import { useNavigate } from "react-router-dom";

const SentMail = ({ sentMails }) => {
  const sentMail = useSelector((state) => state.userMail.sentUserMails);
  const selectMail = useSelector((state) => state.userMail.selectMail);
  const dispatch = useDispatch();

  const mail = localStorage.getItem("emailId");
  const email = mail.replace(".", "").replace("@", "");

  const navigation = useNavigate();

  const handleMailClick = (mailId) => {
    // Handle mail click logic
    console.log("Mail clicked:", mailId);
    const selected = sentMails.find((mail) => mail.id === mailId);
    dispatch(mailUserAction.setSelectMail(selected));
    // navigation("/details");

    const queryParams = new URLSearchParams({
      to: selected.to,
      from: selected.from,
      subject: selected.subject,
      body: selected.message,
      type: "sent",
    });
    navigation(`/details?${queryParams.toString()}`);
  };

  const handleDeleteClick = (mailId) => {
    console.log("Delete clicked:", mailId);
    fetch(
      `https://mailbox-761c7-default-rtdb.firebaseio.com/${email}/sent/${mailId}.json`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete mail");
        }
        dispatch(mailUserAction.deleteMail(mailId));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <h4 className={classes.mailBox}>Sent Mails</h4>
      <Table striped bordered hover className={classes.tableBox}>
        <thead>
          <tr>
            <th>From</th>
            <th>Subject</th>
            <th>Body</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sentMails
            .filter((mail) => Object.keys(mail).length !== 0)
            .map((mail, idx) => (
              <tr
                key={idx}
                style={{
                  cursor: "pointer",
                }}
                onClick={() => {
                  handleMailClick(mail.id);
                }}
              >
                <td>{mail.to}</td>
                <td>{mail.subject}</td>
                <td>{mail.message}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteClick(mail.id)}
                  >
                    Delete Mail
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </>
  );
};

export default SentMail;
