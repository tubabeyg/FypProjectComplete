import React, { Component } from "react";
// import { Form, Input, Button, Checkbox } from "antd";
import { hospitalsignup } from "./superAdminapi";
import { isAuthenticated } from "../auth/index";
// import { hospitalsignup } from "../../../PatientsPortal/controller/auht";

class RegisterHospital extends Component {
  constructor() {
    super();
    this.state = {
      Name: "",
      phone: "",
      email: "",
      password: "",
      error: "",
      open: false,
    };
  }

  handleChange = (name) => (event) => {
    console.log("In handleChange");
    this.setState({ error: " " });
    this.setState({ [name]: event.target.value });
    console.log(name);
    console.log(event.target.value);
    console.log(this.state);
  };
  clickSubmit = (event) => {
    event.preventDefault();
    const token = isAuthenticated().token;
    const { Name, phone, email, password } = this.state;
    var user = {
      Name,
      phone,
      email,
      password,
    };
    console.log(user);
    hospitalsignup(user, token).then((data) => {
      if (data.error) this.setState({ error: data.error });
      else {
        this.setState({
          Name: "",
          phone: "",
          email: "",
          password: "",
          open: true,
        });
      }
    });
  };

  render() {
    const { Name, phone, email, password, error, open } = this.state;
    return (
      <div class="row mt-5">
        <div class="col-md-8 m-auto">
          <div class="card card-body">
            <h1 class="text-center mb-3">
              <i class="fas fa-user-plus"></i> Hospital Registration
            </h1>
            <div
              class="alert alert-warning alert-dismissible fade show"
              role="alert"
              style={{ display: error ? "" : "none" }}
            >
              {error}
              <button
                type="button"
                class="close"
                data-dismiss="alert"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div
              class="alert alert-info fade show"
              role="alert"
              style={{ display: open ? "" : "none" }}
            >
              Hospital is successfully created.
              <button
                type="button"
                class="close"
                data-dismiss="alert"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <form action="/signup" method="POST">
              <div class="form-group">
                <input
                  onChange={this.handleChange("Name")}
                  type="Name"
                  id="Name"
                  name="Name"
                  class="form-control"
                  placeholder="Enter  Name"
                  value={Name}
                />
              </div>
              <div class="form-group">
                <input
                  onChange={this.handleChange("phone")}
                  type="phone"
                  id="phone"
                  name="phone"
                  class="form-control"
                  placeholder="Enter  phone"
                  value={phone}
                />
              </div>
              <div class="form-group">
                <input
                  onChange={this.handleChange("email")}
                  type="email"
                  id="email"
                  name="email"
                  class="form-control"
                  placeholder="Email Address"
                  value={email}
                />
              </div>

              <div class="form-group">
                <input
                  onChange={this.handleChange("password")}
                  type="password"
                  id="password"
                  name="password"
                  class="form-control"
                  placeholder="Create Password"
                  value={password}
                />
              </div>
              <button
                onClick={this.clickSubmit}
                type="submit"
                class="btn btn-primary btn-block"
              >
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default RegisterHospital;
