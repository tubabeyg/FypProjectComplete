import React, { Component } from "react";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.png";
import { list } from "./apiPatient";

class Patient extends Component {
    constructor() {
        super();
        this.state = {
            patients: [],
        };
    }

    componentDidMount = () => {
        list().then((data) => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({
                    patients: data,
                });
            }
        });
    };
    renderPatients = (patient) => {
        return (
            <div className="row">
                {patient.map((patient, i) => {
                    return (
                        <div class="card col-md-4" key={i}>
                            <img
                                style={{ height: "300px", width: "auto" }}
                                className="img-thumbnail"
                                src={`http://localhost:8080/patient/photo/${patient._id}`}
                                onError={(i) =>
                                    (i.target.src = `${DefaultProfile}`)
                                }
                                alt={patient.firstname}
                            />
                            <div class="card-body">
                                <h5 class="card-title">
                                    {patient.firstname} {patient.lastname}
                                </h5>
                                <p class="card-text">{patient.email}.</p>
                                <Link
                                    to={`/patient/${patient._id}`}
                                    class="btn btn-raised btn-primary "
                                >
                                    View Profile
                                </Link>
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

export default Patient;
