import React, { Component } from "react";
import { Link } from "react-router-dom";
class CreateReport extends Component {
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
                    Create Report
                </h2>
                <div className="row p-3 justify-content-center">
                    <div className="col-md-4">
                        <div className="home-deck-card">
                            <Link
                                className="report-link"
                                to="/doctor/reports/Report1"
                            >
                                <i className="fas fa-vials text-white fa-2x my-4" />
                                <br />
                                Blood Report
                            </Link>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="home-deck-card">
                            <Link
                                className="report-link"
                                to="/doctor/reports/Report2"
                            >
                                <i className="fas fa-lungs-virus text-white fa-2x my-4" />
                                <br />
                                Pathology Report
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateReport;
