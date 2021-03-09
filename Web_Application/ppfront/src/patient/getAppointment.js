import React, { Component } from "react";
import { Link } from "react-router-dom";
import { getalldoctors } from "../doctor/doctorapi";
import DefaultProfile from "../images/avatar.png";
// NewAppointment

export default class getAppointment extends Component {
    constructor() {
        super();
        this.state = {
            doctors: [],
            keyword: "",
        };
    }

    componentDidMount = () => {
        getalldoctors().then((data) => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({
                    doctors: data,
                });
            }
        });
    };

    handleChange = (name) => (event) => {
        this.setState({ error: " " });
        this.setState({ [name]: event.target.value });
    };

    renderDoctors = (doctor) => {
        return (
            <div className="row">
                {doctor.map((doctor, i) => {
                    return (
                        <div class="my-3 col-md-4 text-center" key={i}>
                            <div className="p-3 border rounded-lg shadow">
                                <img
                                    style={{
                                        height: "200px",
                                        width: "200px",
                                        border: 2,
                                    }}
                                    className="img-thumbnail"
                                    src={`http://localhost:8080/doctor/photo/${doctor._id}`}
                                    onError={(i) =>
                                        (i.target.src = `${DefaultProfile}`)
                                    }
                                    alt={doctor.firstname}
                                />
                                <div class="card-body">
                                    <h5 class="card-title">
                                        {doctor.firstname} {doctor.lastname}
                                    </h5>
                                    <p class="card-text">{doctor.email}.</p>
                                    <p class="card-text">
                                        {doctor.designation}.
                                    </p>
                                    <Link
                                        to={`/patientsportal/appointment/create/${doctor._id}`}
                                        class="btn btn-raised btn-primary "
                                    >
                                        Get Appointment
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };
    render() {
        const { keyword } = this.state;
        const doctors = this.state.doctors.filter((doctor) => {
            return doctor.firstname
                .toLowerCase()
                .includes(keyword.toLowerCase());
        });
        return (
            <div>
                <h2 className=" mb-5">Doctors</h2>
                <div className="row">
                    <div className="col-md-3">
                        <input
                            className="form-control"
                            onChange={this.handleChange("keyword")}
                            type="text"
                            id="inputKeyword"
                            placeholder="Search.."
                            style={{ marginBottom: 10 }}
                            value={keyword}
                        />
                    </div>
                </div>
                {this.renderDoctors(doctors)}
            </div>
        );
    }
}
