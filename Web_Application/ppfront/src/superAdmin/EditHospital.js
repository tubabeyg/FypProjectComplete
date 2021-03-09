import React, { Component } from "react";
import { isAuthenticated } from "../auth//index";
import { getHospital, updated, updateHospital } from "./superAdminapi";
import { Link } from "react-router-dom";

// import { Redirect } from "react-router-dom";

class EditHospital extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      Name: "",
      email: "",
      password: "",
      redirectToProfile: false,
      error: "",
      fileSize: 0,
      loading: false,
    };
  }

  init = (hospitalId) => {
    const token = isAuthenticated().token;

    getHospital(hospitalId, token).then((data) => {
      console.log(data);
      if (data.error) {
        this.setState({
          redirectToProfile: true,
        });
      } else {
        this.setState({
          id: data.results._id,
          Name: data.results.Name,
          email: data.results.email,
          phone: data.results.phone,
          error: "",
        });
      }
    });
  };

  componentDidMount() {
    const hospitalId = this.props.id;
    this.init(hospitalId);
  }

  isValid = () => {
    const { Name, email } = this.state;

    if (Name.length === 0) {
      this.setState({
        error: "Name is required",
      });
      console.log(this.error);
      return false;
    }

    if (!/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/.test(email)) {
      this.setState({
        error: "Valid email is required",
      });
      console.log(this.error);
      return false;
    }

    return true;
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  clickSubmit = (event) => {
    event.preventDefault();
    this.setState({
      loading: true,
    });
    if (this.isValid()) {
      const hospitalId = this.props.id;
      // const HospitalData = {
      //   _id: this.props.id,
      //   Name: this.state.Name,
      //   phone: this.state.phone,
      //   email: this.state.email,
      // };
      const token = isAuthenticated().token;
      updated(
        token,
        this.props.id,
        this.state.Name,
        this.state.phone,
        this.state.email
      ).then((data) => {
        if (data.error) {
          console.log(data.error);
          this.setState({ error: data.error });
        } else {
          updateHospital(data, () => {
            this.setState({
              redirectToProfile: true,
            });
          });
        }
      });
    }
  };

  // handleSubmit = (eid) => {
  //   let Name = this.refs.Name.value;
  //   let email = this.refs.email.value;
  //   let phone = this.refs.phone.value;
  //   fetch("http://localhost:8080/superAdmin/EditHospital/" + eid, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       Name,
  //       email,
  //       phone,
  //     }),
  //   }).then(function (response) {
  //     if (response.ok) {
  //       alert("Item updated Successfully");
  //       //window.location.reload(false);
  //       return true;
  //     } else {
  //       var error = new Error(response.statusText);
  //       error.response = response;
  //       throw error;
  //     }
  //   });
  // };

  render() {
    const { Name, phone, email, password, error, loading } = this.state;

    return (
      <div>
        <div class="row mt-5">
          <div class="col-md-6 m-auto">
            <div class="card card-body">
              <h1 class="text-center mb-3">
                <i class="fas fa-user-edit"></i> Edit Profile
              </h1>
              <div
                class="alert alert-danger 
                            alert-dismissible fade show"
                role="alert"
                style={{ display: this.state.error ? "" : "none" }}
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
              {loading ? (
                <div className="jumbotron text-center">
                  <h2>Saved Successfully</h2>
                </div>
              ) : (
                ""
              )}

              <form>
                <div class="form-group">
                  <label className="text-muted" for="Name">
                    Name
                  </label>
                  <input
                    onChange={this.handleChange}
                    type="Name"
                    id="Name"
                    name="Name"
                    class="form-control"
                    placeholder="Enter Name"
                    value={Name}
                  />
                </div>
                <div class="form-group">
                  <label className="text-muted" for="phone">
                    Phone
                  </label>
                  <input
                    onChange={this.handleChange}
                    type="phone"
                    id="phone"
                    name="phone"
                    class="form-control"
                    placeholder="Enter  phone"
                    value={phone}
                  />
                </div>

                <div class="form-group">
                  <label className="text-muted" for="email">
                    Email
                  </label>
                  <input
                    onChange={this.handleChange}
                    type="email"
                    id="email"
                    name="email"
                    class="form-control"
                    placeholder="Enter Email"
                    value={email}
                  />
                </div>
                {/* <div class="form-group">
                  <label className="text-muted" for="Password">
                    Password
                  </label>
                  <input
                    onChange={this.handleChange}
                    type="password"
                    id="password"
                    name="password"
                    class="form-control"
                    placeholder="Create Password"
                    value={password}
                  />
                </div> */}

                <button
                  onClick={this.clickSubmit}
                  type="submit"
                  class="btn btn-primary btn-block"
                >
                  Update Settings
                </button>
                <Link
                  to={"/superAdmin/displayHospital"}
                  class="btn btn-lg btn-block btn-danger "
                >
                  Back
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EditHospital;
