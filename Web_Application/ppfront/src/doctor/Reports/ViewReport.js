import React, { Component } from "react";
import { Link } from "react-router-dom";

class ViewReport extends Component {
    render() {
        return (
            <div className="container p-5">
                <h2 className=" mb-5">
                    <i className="fas fa-chart-line text-danger mr-2" />
                    View Reports
                </h2>
                <div className="row p-3 justify-content-center">
                    <div className="col-md-4">
                        <div className="home-deck-card">
                            <Link
                                className="report-link"
                                to="/doctor/reports/blood-reports"
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
                                to="/doctor/reports/path-reports"
                            >
                                <i className="fas fa-lungs-virus text-white fa-2x my-4" />
                                <br />
                                Pathology Report
                            </Link>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="home-deck-card">
                            <Link
                                className="report-link"
                                to={"/doctor/reports/time-reports"}
                            >
                                <i className="fas fa-clock text-white fa-2x my-4" />
                                <br />
                                Time Based Reports
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ViewReport;
