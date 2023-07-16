import React from "react";
import Button from "react-bootstrap/Button";
import { useSearchParams, useNavigate } from "react-router-dom";

const MailDetails = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const to = searchParams.get("to");
  const from = searchParams.get("from");
  const subject = searchParams.get("subject");
  const body = searchParams.get("body");
  const type = searchParams.get("type");
  // console.log(body);
  // console.log(type);

  return (
    <div style={{ padding: "20px", backgroundColor: "#f5f5f5" }}>
      <Button
        variant="secondary"
        onClick={() => {
          navigate("/inbox");
        }}
        style={{ marginBottom: "20px" }}
      >
        Back
      </Button>
      <div style={{ backgroundColor: "white", padding: "20px" }}>
        {type === "received" && <p style={{ color: "black" }}>From: {from}</p>}
        {type === "sent" && <p style={{ color: "black" }}>To: {to}</p>}
        <p style={{ fontWeight: "bold", color: "black" }}>Subject: {subject}</p>
        <p style={{ whiteSpace: "pre-wrap", color: "black" }}>{body}</p>
      </div>
    </div>
  );
};

export default MailDetails;
