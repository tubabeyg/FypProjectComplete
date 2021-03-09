import React, { Component } from "react";
import { Link } from "react-router-dom";
import { getpathReportsOfPatient } from "../doctor/Reports/pathreportapi";

class AllPReports extends Component {
    constructor() {
        super();
        this.state = {
            reports: [],
            loading: true,
        };
    }

    componentDidMount = () => {
        getpathReportsOfPatient(this.props.match.params.id).then((data) => {
            this.setState({
                loading: false,
            });
            if (data.error) {
            } else {
                this.setState({
                    reports: data.results,
                });
            }
        });
    };

    render() {
        return (
            <div className="container p-5">
                <h2 className="mb-5">
                    <i className="fas fa-lungs-virus text-info mr-2" />
                    Pathology Report
                    {this.state.loading && (
                        <i className="fa fa-circle-notch fa-spin ml-2" />
                    )}
                </h2>
                {this.state.reports.length === 0 && <h3>No reports found.</h3>}
                {this.state.reports.length !== 0 && (
                    <table className="table">
                        <thead>
                            <tr>
                                <th width="200">Patient</th>
                                <th>Comments</th>
                                <th width="180"></th>
                            </tr>
                            {this.state.reports &&
                                this.state.reports.map((r) => (
                                    <tr>
                                        <td>
                                            {r.patients.firstname}{" "}
                                            {r.patients.lastname}
                                        </td>
                                        <td>{r.Comments}</td>
                                        <td>
                                            <Link
                                                class="btn btn-secondary"
                                                to={"/doctor/reports/path-report/".concat(
                                                    r._id
                                                )}
                                            >
                                                <i className="far fa-chart-bar mr-2"></i>
                                                Open Report
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                        </thead>
                    </table>
                )}
            </div>
        );
    }
}

export default AllPReports;
