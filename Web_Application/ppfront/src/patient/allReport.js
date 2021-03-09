import React, { Component } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/index";

class AllReports extends Component {
    constructor() {
        super();
        this.state = {
            doctors: [],
            keyword: "",
        };

        console.log("CreateReport");
    }

    componentDidMount = () => {};

    handleChange = (name) => (event) => {
        this.setState({ error: " " });
        this.setState({ [name]: event.target.value });
    };

    render() {
        const { keyword } = this.state;
        console.log(keyword);
        const doctors = this.state.doctors.filter((doctor) => {
            return doctor.firstname
                .toLowerCase()
                .includes(keyword.toLowerCase());
        });
        console.log(doctors);

        return (
            <div className="container p-5">
                <h2 className=" mb-5">
                    <i className="fas fa-chart-line text-danger mr-2" />
                    View Reports
                </h2>
                <div className="row p-3 justify-content-center">
                    <div className="col-md-4">
                        <div className="home-deck-card">
                            {/* <Link
                                className="report-link"
                                to="/patient/AllbReports"
                            > */}
                            <Link
                                className="report-link"
                                to={`/patientportal1/allbReport/${
                                    isAuthenticated().patient._id
                                }`}
                            >
                                <i className="fas fa-vials text-white fa-2x my-4" />
                                <br />
                                View Blood Reports
                            </Link>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="home-deck-card">
                            {/* <Link
                                className="report-link"
                                to="/patient/AllpReports"
                            > */}
                            <Link
                                className="report-link"
                                to={`/patientportal1/allpReport/${
                                    isAuthenticated().patient._id
                                }`}
                            >
                                <i className="fas fa-lungs-virus text-white fa-2x my-4" />
                                <br />
                                View Pathology Reports
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AllReports;
