import React, { useEffect, useState } from "react";
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from "cdbreact";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import SentMail from "./SentMail";
import ReceivedMail from "./ReceivedMail";

const Sidebar = () => {
  const email = localStorage.getItem("emailId");
  const emailsender = email.replace(".", "").replace("@", "");
  const dispatch = useDispatch();

  const [activeSection, setActiveSection] = useState("sent");
  const [sentMails, setSentMails] = useState([]);
  const [receivedEmail, setReceivedMails] = useState([]);

  useEffect(() => {
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
        setReceivedMails(receivedMail);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [emailsender]);

  const sentMailHandler = (e) => {
    e.preventDefault();
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
          throw new Error("Failed to fetch sent emails");
        }
        const data = await res.json();

        const sentEmails = Object.values(data);
        setSentMails(sentEmails); // Update the sent mails state
      })
      .catch((err) => {
        console.log(err);
      });
    setActiveSection("sent");
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
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch received emails");
        }
        const data = await res.json();
        const receivedEmails = Object.values(data);
        setReceivedMails(receivedEmails); // Update the received mails state
      })
      .catch((err) => {
        console.log(err);
      });
    setActiveSection("received");
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
        {/* Display sent mails */}
        {/* {sentMails.length === 0 ? (
          <h1 style={{ padding: "6rem" }}>No New Mails</h1>
        ) : (
          <SentMail sentMails={sentMails} />
        )} */}
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
