import React from "react";
import { Badge } from "react-bootstrap";

const MailStatus = ({ isRead }) => {
  const badgeVariant = isRead ? "primary" : "danger";
  const badgeText = isRead ? "Read" : "UnRead";
  // console.log(isRead);
  return <Badge variant={badgeVariant}>{badgeText}</Badge>;
};

export default MailStatus;
