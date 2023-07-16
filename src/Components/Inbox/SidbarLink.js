import React from "react";
import classes from "./SidbarLink.module.css";

const SidbarLink = ({ Icon, title, nav }) => {
  const iconName = nav ? classes.navActive : classes.nav;
  return (
    <div className={iconName}>
      {Icon && <Icon className={classes.icon} />}
      {!nav && <h2>{title ? title : null}</h2>}
    </div>
  );
};

export default SidbarLink;
