import React, { Component } from "react";
import { Link } from "react-router-dom";
import { getReportsByDoctor } from "./reportapi";

class patientReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reports: [],
            loading: true,
        };
    }

    componentDidMount = () => {
        getReportsByDoctor("").then((data) => {
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
                    <i className="fas fa-vials text-danger mr-2" />
                    Blood Report
                    {this.state.loading && (
                        <i className="fa fa-circle-notch fa-spin ml-2" />
                    )}
                </h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Patient</th>
                            <th>Bloodpressure</th>
                            <th>Glucose</th>
                            <th>Hmg</th>
                            <th width="180"></th>
                        </tr>
                        {this.state.reports &&
                            this.state.reports.map((r) => (
                                <tr>
                                    <td>
                                        {r.patients.firstname}{" "}
                                        {r.patients.lastname}
                                    </td>
                                    <td>{r.bloodpressure}</td>
                                    <td>{r.glucose}</td>
                                    <td>{r.hmg}</td>
                                    <td>
                                        <Link
                                            class="btn btn-secondary"
                                            to={"/doctor/reports/blood-report/".concat(
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
            </div>
        );
    }
}

export default patientReport;
