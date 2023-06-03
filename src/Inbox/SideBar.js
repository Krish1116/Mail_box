import React, { useEffect, useState } from "react";
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from "cdbreact";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SentMail from "./SentMail";
import ReceivedMail from "./ReceivedMail";
import { mailUserAction } from "../Store/MailAction";

const Sidebar = () => {
  const email = localStorage.getItem("emailId");
  const emailsender = email.replace(".", "").replace("@", "");
  const dispatch = useDispatch();

  const [activeSection, setActiveSection] = useState("sent");
  const [sentMails, setSentMails] = useState([]);
  // const [receivedEmail, setReceivedMails] = useState([]);
  const receivedEmail = useSelector(
    (state) => state.userMail.receivedUserMails
  );
  // console.log(receivedEmail);

  useEffect(() => {
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
          const sentmail = Object.values(data);
          setSentMails(sentmail);
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
          const receivedMail = Object.values(data);
          dispatch(mailUserAction.updateReceivedMails(receivedMail));
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
  }, [emailsender]);

  const sentMailHandler = (e) => {
    console.log("clicked");
    e.preventDefault();

    try {
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
          if (data && typeof data === "object") {
            const sentMail = Object.values(data);
            console.log(sentMail);
            setActiveSection("sent");
          }
        });
    } catch (err) {
      console.log(err);
    }
  };
  const recivedMailHandler = (e) => {
    e.preventDefault();
    try {
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
          if (data && typeof data === "object") {
            const receivemail = Object.values(data).map((mail) => ({
              ...mail,
              read: false,
            }));
            setActiveSection("received");
            dispatch(mailUserAction.updateReceivedMails(receivemail)); // Dispatch the action with the updated received emails
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      style={{ display: "flex", height: "100vh", overflow: "scroll initial" }}
    >
      <CDBSidebar textColor="#fff" backgroundColor="#333">
        <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large" />}>
          <a
            href="/"
            className="text-decoration-none"
            style={{ color: "inherit" }}
          >
            Gmail
          </a>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <NavLink to="/composemail" activeclassname="activeClicked">
              <CDBSidebarMenuItem icon="pen">Compose</CDBSidebarMenuItem>
            </NavLink>
            <NavLink activeclassname="activeClicked">
              <CDBSidebarMenuItem icon="inbox" onClick={recivedMailHandler}>
                Inbox
              </CDBSidebarMenuItem>
            </NavLink>
            <NavLink to="/profile" activeclassname="activeClicked">
              <CDBSidebarMenuItem icon="star">Starred</CDBSidebarMenuItem>
            </NavLink>
            <NavLink activeclassname="activeClicked" onClick={sentMailHandler}>
              <CDBSidebarMenuItem icon="paper-plane">sent</CDBSidebarMenuItem>
            </NavLink>
          </CDBSidebarMenu>
        </CDBSidebarContent>
      </CDBSidebar>

      <div>
        {activeSection === "sent" && (
          <>
            {sentMails.length === 0 ? (
              <h1 style={{ padding: "6rem" }}>No New Mails</h1>
            ) : (
              <SentMail sentMails={sentMails} />
            )}
          </>
        )}
        {activeSection === "received" && (
          <>
            {receivedEmail.length === 0 ? (
              <h1 style={{ padding: "6rem" }}>No New Mails</h1>
            ) : (
              <ReceivedMail receivedMails={receivedEmail} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
