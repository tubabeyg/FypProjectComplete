import React, { Component } from "react";
import { deleteHospital, getallhospitals } from "./superAdminapi";
import { isAuthenticated } from "../auth/index";
import { Button } from "antd";
import { Redirect } from "react-router-dom";
import swal from "sweetalert";
import EditHospital from "./EditHospital";

class displayHospital extends Component {
  constructor() {
    super();
    this.state = {
      hospitals: [],
      redirect: false,
    };
  }
  deleteAccount = (hospitalId) => {
    const token = isAuthenticated().token;
    deleteHospital(hospitalId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        swal("Deleted!", "Hospital is deleted!", "success");
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
    getallhospitals(token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          hospitals: data.results,
        });
      }
    });
  };
  renderHospital = (hospitals) => {
    return (
      <div className="row">
        {hospitals.map((hospital, i) => {
          return (
            <div
              class="card col-md-4"
              style={{ marginRight: 10, marginTop: 10 }}
              key={i}
            >
              <div class="card-body">
                <h5 class="card-title"> {hospital.Name}</h5>
                <p class="card-text">Email: {hospital.email}.</p>
                <p class="card-text">Phone: {hospital.phone}.</p>
                <Button
                  type="danger"
                  size="large"
                  ghost
                  onClick={() => this.deleteConfirmed(hospital._id)}
                >
                  Delete
                </Button>
                <Button
                  type="danger"
                  size="large"
                  ghost
                  // onClick={() => this.deleteConfirmed(hospital._id)}
                >
                  <a href={`/superAdmin/EditHospital/${hospital._id}`}>Edit </a>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  render() {
    const { hospitals } = this.state;
    if (this.state.redirect) {
      return <Redirect to="/superAdmin/superAdmindashboard" />;
    }
    return (
      <div>
        <div className="container">
          <h2 className="mt-5 mb-5">Hospitals</h2>
          {this.renderHospital(hospitals)}
        </div>
      </div>
    );
  }
}

export default displayHospital;
