import React from "react";
import { Container, Form, Navbar } from "react-bootstrap";
import { BiSearchAlt } from "react-icons/bi";
import classes from "./CustomNavbar.module.css";

const CustomNavbar = () => {
  return (
    <Navbar expand="lg" className={classes.navbox}>
      <Container fluid>
        <Navbar.Brand href="#" className="ms-auto">
          Yahoo!mail
        </Navbar.Brand>
        <Navbar.Collapse>
          <Form className="d-flex w-75 mx-auto">
            <BiSearchAlt className={classes.icon} />
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            ></Form.Control>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
