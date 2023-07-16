import React from "react";
import { Form } from "react-bootstrap";
import { BiSearchAlt } from "react-icons/bi";
import classes from "./CustomNavbar.module.css";

const CustomNavbar = () => {
  return (
    <div className={classes.navbox}>
      {/* <Container fluid> */}
      <div href="#" className={classes.mail}>
        Yahoo!mail
      </div>
      <div>
        <Form className={classes.search}>
          <BiSearchAlt className={classes.icon} />
          <Form.Control
            type="search"
            placeholder="Search"
            aria-label="Search"
          ></Form.Control>
        </Form>
      </div>
      {/* </Container> */}
    </div>
  );
};

export default CustomNavbar;
