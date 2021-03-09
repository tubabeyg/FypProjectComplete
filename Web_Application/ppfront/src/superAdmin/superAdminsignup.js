import React, { Component } from "react";
import { hospitalsignup } from "../auth/index";
import { Link } from "react-router-dom";

class SuperAdminSignup extends Component {
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
    this.setState({ error: " " });
    this.setState({ [name]: event.target.value });
  };
  clickSubmit = (event) => {
    event.preventDefault();
    const { Name, phone, email, password } = this.state;
    var user = {
      Name,
      phone,
      email,
      password,
    };
    console.log(user);
    hospitalsignup(user).then((data) => {
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
      <div class="row mt-5" className="clrbody">
        <div class="col-md-6 m-auto">
          <div class="card card-body bg-light">
            <h1 class="text-center mb-3">
              <i class="fas fa-briefcase-medical"></i> Register Admin
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
              New account is sucessfully created. Please Sign in.
              <button
                type="button"
                class="close"
                data-dismiss="alert"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <form action="/hospital/signup" method="POST">
              <div class="form-group">
                <label className="text-muted" for="Name">
                  Name
                </label>
                <input
                  onChange={this.handleChange("Name")}
                  type="Name"
                  id="Name"
                  name="Name"
                  class="form-control"
                  placeholder="Enter Admin's Name"
                  value={Name}
                />
              </div>
              <div class="form-group">
                <label className="text-muted" for="phone">
                  Phone
                </label>
                <input
                  onChange={this.handleChange("phone")}
                  type="phone"
                  id="phone"
                  name="phone"
                  class="form-control"
                  placeholder="Enter Phone Number"
                  value={phone}
                />
              </div>
              <div class="form-group">
                <label className="text-muted" for="email">
                  Email
                </label>
                <input
                  onChange={this.handleChange("email")}
                  type="email"
                  id="email"
                  name="email"
                  class="form-control"
                  placeholder="Enter Email address"
                  value={email}
                />
              </div>
              <div class="form-group">
                <label className="text-muted" for="password">
                  Password
                </label>
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
              <Link to={"/"} class="btn btn-block btn-danger ">
                Back
              </Link>
            </form>
            <p class="lead mt-4 text-dark">
              Already have an account?{" "}
              <a href="/superAdmin/superAdminsignin">Login</a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default SuperAdminSignup;
