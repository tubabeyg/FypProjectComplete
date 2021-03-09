import React, { Component } from "react";
import { acceptAppointment, getdoctorappoint } from "./doctorapi";

class appointmentRequests extends Component {
    constructor() {
        super();
        this.state = {
            patients: [],
        };
    }

    acceptAppointment = (id) => {
        acceptAppointment(id).then((data) => {
            if (data.err) {
                console.log("eroro");
            } else {
                window.location.href = "/doctor/requests";
            }
        });
    };

    componentDidMount = () => {
        var doctorId = this.props.match.params.doctorId;
        doctorId = doctorId ? doctorId : localStorage.getItem("doctor_id");

        getdoctorappoint(doctorId).then((data) => {
            if (data.error) {
                console.log(data.error);
            } else {
                console.log(data);
                this.setState({
                    patients: data,
                });
            }
        });
    };
    renderPatients = (patient) => {
        return (
            <div className="row">
                {patient.appointments?.map((patient, i) => {
                    return (
                        <div class="card col-md-4" key={i}>
                            <div class="card-body">
                                <h5 class="card-title">{patient.title} </h5>
                                <p class="card-text">{patient.status}.</p>
                                <p class="card-text">
                                    {new Date(
                                        patient.created
                                    ).toLocaleDateString()}
                                </p>
                                {patient.status == "pending" && (
                                    <button
                                        onClick={() => {
                                            this.acceptAppointment(patient._id);
                                        }}
                                        className={"btn btn-primary"}
                                    >
                                        {" "}
                                        Accept Appointmrnt
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };
    render() {
        const { patients } = this.state;

        return (
            <div>
                <div className="container">
                    <h2 className="mt-5 mb-5">Patients</h2>
                    {this.renderPatients(patients)}
                </div>
            </div>
        );
    }
}

export default appointmentRequests;
