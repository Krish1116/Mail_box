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
      // Make put request to update only the 'read' status
      fetch(
        `https://mailbox-761c7-default-rtdb.firebaseio.com/${email}/received/${mailId}.json`,
        {
          // the put request is typically used to completely replace an existing recource.
          // method: "PUT",
          // with the patch request it allows you to send only specific changes that need to be applied to the resource
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ read: true }),
        }
      )
        .then((res) => {
          console.log(res);
          if (!res.ok) {
            throw new Error("Failed to update mail read status");
          }

          // Dispatch the action to mark the mail as read in Redux store
          dispatch(mailUserAction.markMailAsRead(mailId));
        })
        .catch((err) => {
          console.log(err);
        });
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

  const handleDeleteClick = (mailId, e) => {
    e.stopPropagation();

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
        <colgroup>
          <col style={{ width: "2%" }} />
          <col style={{ width: "3%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "6%" }} />
        </colgroup>
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
                onClick={() => {
                  handleMailClick(mail.id);
                }}
              >
                <td className={`${classes.oveflowCell} ${classes.bodyCell}`}>
                  {mail.read ? null : <span className={classes.blueDot} />}
                  {mail.from}
                </td>
                <td className={`${classes.oveflowCell} ${classes.bodyCell}`}>
                  {mail.subject}
                </td>
                <td className={`${classes.oveflowCell} ${classes.bodyCell}`}>
                  {mail.message}
                </td>
                <td>
                  <Button
                    variant="danger"
                    onClick={(e) => {
                      handleDeleteClick(mail.id, e);
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
