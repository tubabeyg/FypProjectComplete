import React, { Component } from "react";
import { isAuthenticated } from "../auth/index";
import { doctorsignup } from "./hospitalapi";

class DoctorSignup extends Component {
  constructor() {
    super();
    this.state = {
      firstname: "",
      lastname: "",
      designation: "",
      gender: "",
      cnic: "",
      age: "",
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
    if (!this.state.firstname ||
      !this.state.lastname ||
      !this.state.designation ||
      !this.state.gender ||
      !this.state.cnic ||
      !this.state.age ||
      !this.state.phone ||
      !this.state.email) {
      alert("All feilds required.")
      return;
    }
    if (this.state.age > 60 || this.state.age < 20) {
      alert("Age should be between 20 and 60")
      return;
    }
    var numbers = /^[0-9]+$/;
    if (!this.state.age.match(numbers) || !this.state.cnic.match(numbers) || !this.state.phone.match(numbers)) {
      alert("Age, Cnic and Phone no should be numeric.")
      return;
    }
    if (this.state.cnic.length != 13) {
      alert("Cnic should contain 13 digits.")
      return;
    }

    const {
      firstname,
      lastname,
      designation,
      gender,
      cnic,
      age,
      phone,
      email,
      password,
    } = this.state;
    var user = {
      firstname,
      lastname,
      designation,
      gender,
      cnic,
      age,
      phone,
      email,
      password,
    };
    console.log(user);
    doctorsignup(user, token).then((data) => {
      if (data.error) this.setState({ error: data.error });
      else {
        this.setState({
          firstname: "",
          lastname: "",
          designation: "",
          gender: "",
          cnic: "",
          age: "",
          phone: "",
          email: "",
          password: "",
          open: true,
        });
      }
    });
  };

  render() {
    const {
      firstname,
      lastname,
      designation,
      gender,
      cnic,
      age,
      phone,
      email,
      password,
      error,
      open,
    } = this.state;
    return (
      //            <div class="row mt-5">
      //         <div class="col-md-8 m-auto">
      //           <div class="card card-body"></div>
      //         form class="needs-validation" novalidate>
      //   <div class="form-row">
      //     <div class="col-md-8 m-auto">
      //       <label for="validationTooltip01">First name</label>
      //       <input type="text" class="form-control" id="validationTooltip01" placeholder="First name" value="Mark" required>
      //       <div class="valid-tooltip">
      //         Looks good!
      //       </div>
      //     </div>
      //    <div class="col-md-8 m-auto">
      //       <label for="validationTooltip02">Last name</label>
      //       <input type="text" class="form-control" id="validationTooltip02" placeholder="Last name" value="Otto" required>
      //       <div class="valid-tooltip">
      //         Looks good!
      //       </div>
      //     </div>
      //     <div class="col-md-8 m-auto">
      //       <label for="validationTooltipUsername">Username</label>
      //       <div class="input-group">
      //         <div class="input-group-prepend">
      //           <span class="input-group-text" id="validationTooltipUsernamePrepend">@</span>
      //         </div>
      //         <input type="text" class="form-control" id="validationTooltipUsername" placeholder="Username" aria-describedby="validationTooltipUsernamePrepend" required>
      //         <div class="invalid-tooltip">
      //           Please choose a unique and valid username.
      //         </div>
      //       </div>
      //     </div>
      //   </div>
      //   <div class="form-row">
      //     <div class="col-md-6 mb-3">
      //       <label for="validationTooltip03">City</label>
      //       <input type="text" class="form-control" id="validationTooltip03" placeholder="City" required>
      //       <div class="invalid-tooltip">
      //         Please provide a valid city.
      //       </div>
      //     </div>
      //     <div class="col-md-3 mb-3">
      //       <label for="validationTooltip04">State</label>
      //       <input type="text" class="form-control" id="validationTooltip04" placeholder="State" required>
      //       <div class="invalid-tooltip">
      //         Please provide a valid state.
      //       </div>
      //     </div>
      //     <div class="col-md-3 mb-3">
      //       <label for="validationTooltip05">Zip</label>
      //       <input type="text" class="form-control" id="validationTooltip05" placeholder="Zip" required>
      //       <div class="invalid-tooltip">
      //         Please provide a valid zip.
      //       </div>
      //     </div>
      //   </div>
      //   <button class="btn btn-primary" type="submit">Submit form</button>
      // </form>
      <div class="row mt-5">
        <div class="col-md-8 m-auto">
          <div class="card card-body">
            <h1 class="text-center mb-3">
              <i class="fad fa-user"> Doctor Registration</i>
            </h1>
            <div class="alert alert-primary" role="alert" role="alert">
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
              New account is suucessfully created. Please Sign in.
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
              <div class="col-auto">
                <label class="my-1 mr-2">First name</label>

                <input
                  onChange={this.handleChange("firstname")}
                  type="text"
                  id="firstname"
                  name="firstname"
                  class="form-control"
                  placeholder="Enter First Name"
                  value={firstname}
                />
              </div>
              <div class="col-auto">
                <label class="my-1 mr-2">Last name</label>

                <input
                  onChange={this.handleChange("lastname")}
                  type="text"
                  id="lastname"
                  name="lastname"
                  class="form-control"
                  placeholder="Enter Last Name"
                  value={lastname}
                />
              </div>
              <div class="col-auto">
                <label class="my-1 mr-2">Age</label>

                <input
                  onChange={this.handleChange("age")}
                  type="number"
                  id="age"
                  name="age"
                  min="23"
                  max="60"
                  class="form-control"
                  placeholder="Enter Age"
                  value={age}
                />
              </div>
              <div class="col-auto">
                <label class="my-1 mr-2">Designation</label>
                <input
                  onChange={this.handleChange("designation")}
                  type="text"
                  id="designation"
                  name="designation"
                  class="form-control"
                  placeholder="Enter Designation"
                  value={designation}
                />
              </div>
              <div class="col-auto">
                <label class="my-1 mr-2">CNIC</label>
                <input
                  onChange={this.handleChange("cnic")}
                  type="cnic"
                  id="cnic"
                  name="cnic"
                  class="form-control"
                  placeholder="Enter CNIC"
                  value={cnic}
                />
              </div>
              <div class="col-auto">
                <label class="my-1 mr-2">Phone</label>

                <div class="form-group">
                  <input
                    onChange={this.handleChange("phone")}
                    type="tel"
                    id="phone"
                    name="phone"
                    class="form-control"
                    placeholder="Phone number"
                    value={phone}
                  />
                </div>
              </div>
              <div class="form-group">
                <div class="col-auto">
                  <label class="sr-only" for="inlineFormInputGroup">
                    Email
                  </label>
                  <div class="input-group mb-2">
                    <div class="input-group-prepend">
                      <div class="input-group-text">@</div>
                    </div>
                    <input
                      onChange={this.handleChange("email")}
                      type="text"
                      id="inlineFormInputGroup"
                      name="email"
                      class="form-control"
                      placeholder="Email Address"
                      value={email}
                    />
                  </div>
                </div>
              </div>
              <div class="col-auto">
                <label class="my-1 mr-2">Gender:</label>
                <div>
                  <div class="form-check form-check-inline">
                    <input
                      onChange={this.handleChange("gender")}
                      class="form-check-input"
                      name="inlineRadioOptions"
                      type="radio"
                      id="male"
                      value="male"
                    />
                    <label class="form-check-label" for="male">
                      Male
                    </label>
                  </div>
                </div>
                <div>
                  <div class="form-check form-check-inline">
                    <input
                      onChange={this.handleChange("gender")}
                      class="form-check-input"
                      name="inlineRadioOptions"
                      type="radio"
                      id="female"
                      value="female"
                    />
                    <label class="form-check-label" for="female">
                      Female
                    </label>
                  </div>
                </div>
              </div>
              <div class="col-auto">
                <label class="my-1 mr-2" for="inputPassword5">
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
                <small id="passwordHelpBlock" class="form-text text-muted">
                  Your password must be 8-20 characters long, contain letters
                  and numbers, and must not contain spaces, special characters,
                  or emoji.
                </small>
              </div>
              <div class="form-group"></div>
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

export default DoctorSignup;
