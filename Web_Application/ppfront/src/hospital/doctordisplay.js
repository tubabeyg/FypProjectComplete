import { Button } from "antd";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import swal from "sweetalert";
import { isAuthenticated } from "../auth/index";
import { deleteDoctor, getdoctors } from "./hospitalapi";

class DoctorDisplay extends Component {
    constructor() {
        super();
        this.state = {
            doctors: [],
            redirect: false,
        };
    }
    deleteAccount = (doctorId) => {
        const token = isAuthenticated().token;
        deleteDoctor(doctorId, token).then((data) => {
            if (data.error) {
                console.log(data.error);
            } else {
                swal("Deleted!", "Doctor is deleted!", "success");
                this.setState({
                    redirect: true,
                });
            }
        });
    };
    deleteConfirmed = (id) => {
        let answer = window.confirm(
            "Are you sure you want to delete this account"
        );

        if (answer) {
            this.deleteAccount(id);
        }
    };

    componentDidMount = () => {
        const token = isAuthenticated().token;
        getdoctors(token).then((data) => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({
                    doctors: data.data,
                });
            }
        });
    };
    renderDoctor = (doctors) => {
        return (
            <div className="row">
                {doctors.map((doctor, i) => {
                    return (
                        <div
                            class="card col-md-4"
                            style={{ marginRight: 10, marginTop: 10 }}
                            key={i}
                        >
                            <div class="card-body">
                                <h5 class="card-title">
                                    {" "}
                                    {doctor.firstname} {doctor.lastname}
                                </h5>
                                <p class="card-text">Email: {doctor.email}.</p>
                                <p class="card-text">CNIC: {doctor.cnic}.</p>
                                <p class="card-text">
                                    Age: {doctor.age} years.
                                </p>
                                <p class="card-text">Phone: {doctor.phone}.</p>
                                <p class="card-text">
                                    Designation: {doctor.designation}.
                                </p>
                                <p class="card-text">
                                    Gender: {doctor.gender}.
                                </p>
                                <Button
                                    type="danger"
                                    size="large"
                                    ghost
                                    onClick={() =>
                                        this.deleteConfirmed(doctor._id)
                                    }
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
        const { doctors } = this.state;
        if (this.state.redirect) {
            return <Redirect to="/hospital/dashboard" />;
        }
        return (
            <div>
                <div className="container">
                    <h2 className="mt-5 mb-5">Doctors</h2>
                    {this.renderDoctor(doctors)}
                </div>
            </div>
        );
    }
}

export default DoctorDisplay;
