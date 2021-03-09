import { get, isEmpty, isString } from "lodash";
import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "../../auth/index";
import "./Report1.css";
import { createReport, getUsersDropdown } from "./reportapi";

class Report1 extends Component {
    constructor() {
        super();
        this.state = {
            bloodpressure: "",
            glucose: "",
            hmg: "",
            patient: "",

            error: "",
            postSubmitted: false,
            redirectTo: false,
            loading: false,
        };
    }

    componentDidMount() {
        getUsersDropdown().then((res) => {
            console.log(res);
            this.setState({ allPatients: res.data });
        });
    }

    handleChange = (name) => (event) => {
        this.setState({ error: " " });
        this.setState({ [name]: event.target.value });
    };

    clickSubmit = (event) => {
        if (!this.state.glucose || !this.state.hmg || !this.state.patient) {
            alert("All fields are required!");
            event.preventDefault();
        } else {
        }

        event.preventDefault();
        this.setState({ loading: true });
        const token = isAuthenticated().token;

        const { patient, bloodpressure, glucose, hmg } = this.state;
        var report = {
            doctor: localStorage.getItem("doctor_id"),
            patient,
            bloodpressure,
            glucose,
            hmg,
        };

        createReport(report, token).then((res) => {
            if (get(res, "data.0._id")) {
                this.props.history.push(
                    "/doctor/reports/blood-report/".concat(
                        get(res, "data.0._id")
                    )
                );

                this.setState({
                    postSubmitted: true,
                });
            } else {
                this.setState({
                    error:
                        res.error && isString(res.error)
                            ? res.error
                            : "Couldn't save the report",
                });
            }
        });
    };

    render() {
        const { patient, bloodpressure, glucose, hmg, redirectTo } = this.state;

        if (redirectTo) {
            console.log(redirectTo);
            return <Redirect to="/doctor/reports" />;
        }

        return (
            <div className="container py-5">
                <div class="offset-md-3 col-md-6 offset-lg-4 col-lg-4 bg-light">
                    <h3>Blood Report</h3>
                    <select
                        id="inputPatient"
                        class="form-control"
                        placeholder="Enter Patient's name"
                        style={{
                            marginBottom: 10,
                        }}
                        value={patient}
                        required
                        onChange={this.handleChange("patient")}
                        disabled={isEmpty(this.state.allPatients)}
                    >
                        <option value="null">Select patient</option>
                        {(this.state.allPatients || []).map((r) => (
                            <option value={r._id}>
                                {r.firstname} {r.lastname} {r.phone}
                            </option>
                        ))}
                    </select>

                    <label className="mt-2 mb-0">Blood pressure</label>
                    <input
                        onChange={this.handleChange("bloodpressure")}
                        type="bloodpressure"
                        id="bloodpressure"
                        class="form-control"
                        placeholder="Blood pressure"
                        style={{ marginBottom: 10 }}
                        value={bloodpressure}
                        required
                    />

                    <label className="mt-2 mb-0">Enter glucose level</label>
                    <input
                        onChange={this.handleChange("glucose")}
                        type="glucose"
                        id="glucose"
                        name="glucose"
                        class="form-control"
                        placeholder="Enter glucose level"
                        style={{ marginBottom: 10 }}
                        value={glucose}
                        required
                    />

                    <label className="mt-2 mb-0">Enter heamoglobin</label>
                    <input
                        onChange={this.handleChange("hmg")}
                        type="hmg"
                        id="hmg"
                        name="hmg"
                        class="form-control"
                        placeholder="Enter Heamoglobin"
                        style={{ marginBottom: 10 }}
                        value={hmg}
                        required
                    />

                    <div>{this.state.error}</div>

                    <div className="d-flex justify-content-between">
                        <Link to={"/doctor/ViewReport"} class="btn">
                            Back
                        </Link>
                        <button
                            type="submit"
                            onClick={this.clickSubmit}
                            className="btn btn-primary"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Report1;
