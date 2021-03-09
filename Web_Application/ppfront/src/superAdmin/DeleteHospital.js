import React, { Component } from "react";
import { isAuthenticated } from "../auth/index";
import { deleteHospital } from "./superAdminapi";
import { superAdminsignout } from "../auth/index";
import { Redirect } from "react-router-dom";
class DeleteHospital extends Component {
  state = {
    redirect: false,
  };

  deleteAccount = () => {
    const token = isAuthenticated().token;
    const HospitalId = this.props.HospitalId;
    deleteHospital(HospitalId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        superAdminsignout(() => console.log("Deleted"));

        this.setState({
          redirect: true,
        });
      }
    });
  };

  deleteConfirmed = () => {
    let answer = window.confirm("Are you sure you want to delete this account");

    if (answer) {
      this.deleteAccount();
    }
  };
  render() {
    if (this.state.redirect) {
      return <Redirect to="/superAdmin/superAdmindashboard" />;
    }
    return (
      <button
        onClick={this.deleteConfirmed}
        className="btn btn-raised btn-danger m-5"
      >
        Delete Profile
      </button>
    );
  }
}

export default DeleteHospital;
