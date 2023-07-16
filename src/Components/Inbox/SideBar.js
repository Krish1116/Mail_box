import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SentMail from "./SentMail";
import ReceivedMail from "./ReceivedMail";
import { mailUserAction } from "../Store/MailAction";
import { Badge } from "react-bootstrap";
import { motion } from "framer-motion";
import { FiLogOut } from "react-icons/fi";
import "./SideBar.css";
import { FaBars, FaInbox, FaPaperPlane, FaPen } from "react-icons/fa";

const Sidebar = () => {
  const email = localStorage.getItem("emailId");
  const emailsender = email.replace(".", "").replace("@", "");
  const dispatch = useDispatch();

  const [activeSection, setActiveSection] = useState("received");
  const [isOpen, setIsOpen] = useState(false);
  const sentMails = useSelector((state) => state.userMail.sentUserMails);
  const receivedEmail = useSelector(
    (state) => state.userMail.receivedUserMails
  );
  const unreadCount = receivedEmail.filter((mail) => !mail.read).length;

  useEffect(
    () => {
      const fetchSentMails = () => {
        fetch(
          `https://mailbox-761c7-default-rtdb.firebaseio.com/${emailsender}/sent.json`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then(async (res) => {
            if (!res.ok) {
              throw new Error("Failed to fetch sent mails");
            }
            const data = await res.json();
            if (
              data !== undefined &&
              data !== null &&
              typeof data === "object"
            ) {
              const sentmail = Object.values(data);
              dispatch(mailUserAction.updateSentMails(sentmail));
            }
          })
          .catch((err) => {
            console.log(err);
          });
      };

      const fetchReceivedMails = () => {
        fetch(
          `https://mailbox-761c7-default-rtdb.firebaseio.com/${emailsender}/received.json`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then(async (res) => {
            if (!res.ok) {
              throw new Error("Failed to fetch received mails");
            }
            const data = await res.json();
            if (
              data !== undefined &&
              data !== null &&
              typeof data === "object"
            ) {
              const receivedMail = Object.values(data);
              dispatch(mailUserAction.updateReceivedMails(receivedMail));
            }
          })
          .catch((err) => {
            console.log(err);
          });
      };

      const interval = setInterval(() => {
        fetchSentMails();
        fetchReceivedMails();
      }, 2000);

      // Cleanup the interval when the component unmounts
      return () => clearInterval(interval);
    },
    [emailsender],
    dispatch
  );

  const sentMailHandler = (e) => {
    // console.log("clicked");
    e.preventDefault();

    // try {
    fetch(
      `https://mailbox-761c7-default-rtdb.firebaseio.com/${emailsender}/sent.json`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch sent emails");
        }
        return res.json();
      })
      .then((data) => {
        // console.log(data);
        if (data !== undefined && data !== null && typeof data === "object") {
          const sentMail = Object.values(data);
          // console.log(sentMail);
          setActiveSection("sent");
          dispatch(mailUserAction.updateSentMails(sentMail));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const recivedMailHandler = (e) => {
    e.preventDefault();

    fetch(
      `https://mailbox-761c7-default-rtdb.firebaseio.com/${emailsender}/received.json`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch sent emails");
        }
        return res.json();
      })
      .then((data) => {
        // console.log(data);
        if (data && typeof data === "object") {
          const receivemail = Object.values(data).map((mail) => ({
            ...mail,
            read: mail.read || false,
          }));
          setActiveSection("received");
          dispatch(mailUserAction.updateReceivedMails(receivemail)); // Dispatch the action with the updated received emails
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <div className="main-container">
        <motion.div
          animate={{ width: isOpen ? "10rem" : "3rem" }}
          className="sidebar"
        >
          <div className="top_section">
            {isOpen && <h1 className="logo">Gmail</h1>}
            <div className="bars">
              <FaBars onClick={toggle} />
            </div>
          </div>
          <section className="routes">
            <NavLink to="/composemail" className="link">
              <div className="icon">
                <FaPen />
              </div>
              <div className="link_text">Compose</div>
            </NavLink>

            <NavLink className="link" onClick={recivedMailHandler}>
              <div className="icon">
                <FaInbox />
              </div>
              <div className="link_text">
                Inbox{" "}
                {receivedEmail.filter((mail) => !mail.read).length > 0 && (
                  <Badge
                    pill
                    variant="danger"
                    className={
                      isOpen
                        ? "counter d-flex align-items-center justify-content-center"
                        : "counterActive d-flex align-items-center justify-content-center"
                    }
                  >
                    {unreadCount}
                  </Badge>
                )}
              </div>
            </NavLink>

            <NavLink className="link" onClick={sentMailHandler}>
              <div className="icon">
                <FaPaperPlane />
              </div>
              <div className="link_text">Sent</div>
            </NavLink>

            <NavLink className="link" to="/">
              <div className="icon">
                <FiLogOut />
              </div>
              <div className="link_text">Logout</div>
            </NavLink>
          </section>
        </motion.div>
      </div>

      {activeSection === "sent" && (
        <>
          {sentMails.length === 0 ? (
            <h1 className="noMail">No New Mails</h1>
          ) : (
            <SentMail />
          )}
        </>
      )}
      {activeSection === "received" && (
        <>
          {receivedEmail.length === 0 ? (
            <h1 className="noMail">No New Mails</h1>
          ) : (
            <ReceivedMail />
          )}
        </>
      )}
    </div>
    // </div>
  );
};

export default Sidebar;
