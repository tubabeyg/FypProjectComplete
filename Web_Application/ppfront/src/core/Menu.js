import React from "react";
import { Navbar } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";

// const isActive = (history, path) => {
//   if (history.location.pathname === path) {
//     return { color: "#ff9900" };
//   } else {
//     return { color: "#ffffff" };
//   }
// };

const Menu = ({ history }) => {
  return (
    <Navbar bg="dark" expand="lg" style={{ height: "60px" }}>
      <Navbar.Brand>
        <Link to={"/"} className="text-white">
          <img
            width="70"
            height="30"
            src="/assets/images/cube.svg"
            className="d-inline-block align-top spinner"
            alt=""
          />
          3D Visualization & Modelling
        </Link>
      </Navbar.Brand>
    </Navbar>
  );
};

export default withRouter(Menu);
