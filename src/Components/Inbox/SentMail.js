import React from "react";
import classes from "./SentMail.module.css";
import { Table, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { mailUserAction } from "../Store/MailAction";
import { useNavigate } from "react-router-dom";
import { AiOutlineDelete } from "react-icons/ai";

const SentMail = () => {
  const navigation = useNavigate();
  const dispatch = useDispatch();

  const sentMails = useSelector((state) => state.userMail.sentUserMails);
  // console.log(sentMails);
  const mail = localStorage.getItem("emailId");
  const email = mail.replace(".", "").replace("@", "");
  let selected;
  const handleMailClick = (mailId) => {
    // Handle mail click logic
    console.log("Mail clicked:", mailId);
    // dispatch(mailUserAction.setSelectMail(selected));
    // navigation("/details");
    selected = sentMails.find((mail) => mail.id === mailId);
    if (selected && !selected.read) {
      fetch(
        `https://mailbox-761c7-default-rtdb.firebaseio.com/${email}/sent/${mailId}.json`,
        {
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

          dispatch(mailUserAction.markMailAsRead(mailId));
        })
        .catch((err) => {
          console.log(err);
        });
    }

    const messageText = selected.message.blocks[0].text;
    console.log("Message text:", messageText);

    const queryParams = new URLSearchParams({
      to: selected.to,
      from: selected.from,
      subject: selected.subject,
      body: messageText,
      type: "sent",
    });
    console.log(queryParams);
    navigation(`/details?${queryParams.toString()}`);
  };

  const handleDeleteClick = (mailId, e) => {
    e.stopPropagation();
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

  let mobile = window.innerWidth <= 567;

  return (
    <div>
      <h4 className={classes.mailBox}>Sent Mails</h4>
      {mobile ? (
        <div className={classes.mobileContainer}>
          {sentMails
            .filter((mail) => mail && Object.keys(mail).length !== 0)
            .map((mail, idx) => (
              <div
                key={idx}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  handleMailClick(mail.id);
                }}
              >
                <div className={classes.mailTitle}>{mail.to}</div>
                <div>{mail.subject}</div>
                <div className={classes.mailMassg}>
                  {mail.message.blocks[0].text}
                </div>
                <div className={classes.mailIcon}>
                  <AiOutlineDelete
                    onClick={(e) => handleDeleteClick(mail.id, e)}
                  />
                </div>
              </div>
            ))}
        </div>
      ) : (
        <>
          <Table striped bordered hover className={classes.tableBox}>
            <colgroup>
              <col className={classes.col_1} />
              <col className={classes.col_2} />
              <col className={classes.col_3} />
              <col className={classes.col_4} />
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
              {sentMails
                .filter((mail) => mail && Object.keys(mail).length !== 0)
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
                    <td
                      className={`${classes.oveflowCell} ${classes.bodyCell}`}
                    >
                      {mail.to}
                    </td>
                    <td
                      className={`${classes.oveflowCell} ${classes.bodyCell}`}
                    >
                      {mail.subject}
                    </td>
                    <td
                      className={`${classes.oveflowCell} ${classes.bodyCell}`}
                    >
                      {mail.message.blocks[0].text}
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={(e) => handleDeleteClick(mail.id, e)}
                      >
                        Delete Mail
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
};

export default SentMail;
