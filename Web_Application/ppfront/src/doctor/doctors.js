import React, { Component } from "react";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.png";
import { getalldoctors } from "./doctorapi";

export default class Doctors extends Component {
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
                console.log("No doctor found");
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
                            <div className="doctor-dibba">
                                <div
                                    className="d-flex align-items-center"
                                    style={{
                                        height: "200px",
                                        width: "200px",
                                        margin: "auto",
                                        borderRadius: "50%",
                                        overflow: "hidden",
                                    }}
                                >
                                    <img
                                        style={{
                                            width: "200px",
                                        }}
                                        src={`http://localhost:8080/doctor/photo/${doctor._id}`}
                                        onError={(i) =>
                                            (i.target.src = `${DefaultProfile}`)
                                        }
                                        alt={doctor.firstname}
                                    />
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title">
                                        {doctor.firstname} {doctor.lastname}
                                    </h5>
                                    <p class="card-text">{doctor.email}.</p>
                                    <p class="card-text">
                                        {doctor.designation}.
                                    </p>
                                    <Link
                                        to={`/doctor/profile/${doctor._id}`}
                                        class="btn btn-raised btn-primary "
                                    >
                                        View Profile
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
            <div className="container p-5">
                <h2 className=" mb-5">
                    <i className="fas fa-user-md text-success mr-2" />
                    Doctors
                </h2>
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
