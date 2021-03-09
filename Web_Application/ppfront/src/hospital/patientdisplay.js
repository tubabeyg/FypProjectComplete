import { Button } from "antd";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import swal from "sweetalert";
import { isAuthenticated } from "../auth/index";
import { deletePatient, getpatient } from "./hospitalapi";

class PatientDisplay extends Component {
  constructor() {
    super();
    this.state = {
      patients: [],
      redirect: false,
    };
  }
  deleteAccount = (patientId) => {
    const token = isAuthenticated().token;
    deletePatient(patientId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        swal("Deleted!", "Patient is deleted!", "success");
        this.setState({
          redirect: true,
        });
      }
    });
  };
  deleteConfirmed = (id) => {
    let answer = window.confirm("Are you sure you want to delete this account");

    if (answer) {
      this.deleteAccount(id);
    }
  };

  componentDidMount = () => {
    const token = isAuthenticated().token;
    getpatient(token).then((datares) => {
      if (datares.error) {
        console.log(datares.error);
      } else {
        this.setState({
          patients: datares.data,
        });
      }
    });
  };
  renderPatient = (patients) => {
    return (
      <div className="row">
        {patients.map((patient, i) => {
          return (
            <div
              class="card col-md-4"
              style={{ marginRight: 10, marginTop: 10 }}
              key={i}
            >
              <div class="card-body">
                <h5 class="card-title">
                  {" "}
                  {patient.firstname} {patient.lastname}
                </h5>
                <p class="card-text">Email: {patient.email}.</p>
                <p class="card-text">CNIC: {patient.cnic}.</p>
                <p class="card-text">Age: {patient.age} years.</p>
                <p class="card-text">Phone: {patient.phone}.</p>
                <Button
                  type="danger"
                  size="large"
                  ghost
                  onClick={() => this.deleteConfirmed(patient._id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  render() {
    const { patients } = this.state;
    if (this.state.redirect) {
      return <Redirect to="/hospital/dashboard" />;
    }
    return (
      <div>
        <div className="container">
          <h2 className="mt-5 mb-5">Patients</h2>
          {this.renderPatient(patients)}
        </div>
      </div>
    );
  }
}

export default PatientDisplay;
