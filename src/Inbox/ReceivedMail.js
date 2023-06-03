import React from "react";
import classes from "./SentMail.module.css";
import { Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { mailUserAction } from "../Store/MailAction";

const ReceivedMail = () => {
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const receivedMails = useSelector(
    (state) => state.userMail.receivedUserMails
  );
  const mail = localStorage.getItem("emailId");
  const email = mail.replace(".", "").replace("@", "");

  const handleMailClick = (mailId) => {
    const selected = receivedMails.find((mail) => mail.id === mailId);

    if (selected && !selected.read) {
      // Create a copy of the receivedMails array with the updated read status
      const updatedReceivedMails = receivedMails.map((mail) =>
        mail.id === mailId ? { ...mail, read: true } : mail
      );

      // Update the receivedMails in the Redux store
      dispatch(mailUserAction.updateReceivedMails(updatedReceivedMails));

      // Dispatch the action to mark the mail as read in Redux store
      dispatch(mailUserAction.markMailAsRead(mailId));
    }

    const queryParams = new URLSearchParams({
      to: selected.to,
      from: selected.from,
      subject: selected.subject,
      body: selected.message,
      type: "received",
    });
    navigation(`/details?${queryParams.toString()}`);
  };

  const handleDeleteClick = (mailId) => {
    console.log("Delete clicked:", mailId);
    fetch(
      `https://mailbox-761c7-default-rtdb.firebaseio.com/${email}/received/${mailId}.json`,
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
      <h4 className={classes.mailBox}>Receive Mails</h4>

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
          {receivedMails
            .filter((mail) => Object.keys(mail).length !== 0)
            .map((mail, idx) => (
              <tr
                key={idx}
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  handleMailClick(mail.id, e);
                }}
              >
                <td>
                  {mail.read ? null : <span className={classes.blueDot} />}
                  {mail.from}
                </td>
                <td>{mail.subject}</td>
                <td>{mail.message}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => {
                      handleDeleteClick(mail.id);
                    }}
                  >
                    {" "}
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

export default ReceivedMail;
