import { get, isString } from "lodash";
import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "../../auth/index";
import { createpathReport, getUsersDropdown } from "./pathreportapi";

// const { Header, Content, Footer } = Layout;

class Report2 extends Component {
    constructor() {
        super();
        this.state = {
            allPatients: [],
            doctor: "",
            patient: "",
            MicroscopicExamination: "",
            GrossExamination: "",
            Specimen: "",
            PertinentHistory: "",
            Comments: "",
            error: "",
            image: "",
            fileSize: 0,

            redirectTo: false,
            loading: false,
        };
    }

    isValid = () => {
        const { fileSize } = this.state;
        if (fileSize > 1000000000000000) {
            this.setState({
                error: "File size should be less than 20MB",
            });
            return false;
        }
        return true;
    };

    componentDidMount() {
        getUsersDropdown().then((res) => {
            console.log(res);
            this.setState({ allPatients: res.data });
        });

        this.reportData = new FormData();
    }

    handleChange = (name) => (event) => {
        this.setState({ error: " " });
        this.reportData.set(name, event.target.value);
        this.setState({ [name]: event.target.value });
    };

    handleImageChange = (name) => (event) => {
        this.setState({
            error: "",
        });
        const value =
            name === "image" ? event.target.files[0] : event.target.value;
        const fileSize = name === "image" ? event.target.files[0].size : 0;
        this.reportData.set(name, value);
        this.setState({ [name]: value, fileSize });
    };

    clickSubmit = (event) => {
        event.preventDefault();

        if (
            !this.state.GrossExamination ||
            !this.state.MicroscopicExamination ||
            !this.state.patient ||
            !this.state.Comments ||
            !this.state.Specimen ||
            !this.state.PertinentHistory ||
            !this.state.image
        ) {
            alert("All fields are required!");
            return;
        }

        this.setState({ loading: true });
        const token = isAuthenticated().token;

        this.reportData.set("doctor", localStorage.getItem("doctor_id"));

        createpathReport(this.reportData, token).then((res) => {
            if (get(res, "id")) {
                this.props.history.push(
                    "/doctor/reports/path-report/".concat(get(res, "id"))
                );

                this.setState({
                    postSubmitted: true,
                });
            } else {
                this.setState({
                    error: isString(get(res, "error"))
                        ? get(res, "error")
                        : "Couldn't save the report",
                });
            }
        });
    };

    render() {
        const {
            patient,
            MicroscopicExamination,
            GrossExamination,
            Specimen,
            PertinentHistory,
            Comments,
            redirectTo,
        } = this.state;

        if (redirectTo) {
            console.log(redirectTo);
            return <Redirect to="/doctor/reports" />;
        }
        return (
            <div className="container py-5">
                <div class="offset-md-3 col-md-6 offset-lg-4 col-lg-4 bg-light">
                    <h3>Pathology Report</h3>
                    <label className="text-muted" htmlFor="photo">
                        Attach file/image:
                    </label>
                    <input
                        onChange={this.handleImageChange("image")}
                        type="file"
                        id="image"
                        accept="image/*"
                        class="form-control"
                    />
                    <label>Patients:</label>
                    <div>
                        {this.state.allPatients && (
                            <select
                                id="inputPatient"
                                class="form-control"
                                placeholder="Enter Patient's name"
                                style={{ marginBottom: 10 }}
                                value={patient}
                                required
                                onChange={this.handleChange("patient")}
                            >
                                <option value="null">Select patient</option>
                                {this.state.allPatients.map((r) => (
                                    <option value={r._id}>
                                        {r.firstname} {r.lastname} {r.phone}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div>
                        <label>Microscopic Examination: </label>
                    </div>
                    <div>
                        <textarea
                            className="form-control"
                            id="exampleFormControlTextarea1"
                            rows="5"
                            value={MicroscopicExamination}
                            onChange={this.handleChange(
                                "MicroscopicExamination"
                            )}
                            required
                        />
                    </div>
                    <div>
                        <label>Specimen: </label>
                    </div>
                    <div>
                        <textarea
                            className="form-control"
                            id="exampleFormControlTextarea1"
                            rows="5"
                            value={Specimen}
                            onChange={this.handleChange("Specimen")}
                        />
                    </div>
                    <div>
                        <label> Gross Examination: </label>
                    </div>
                    <div>
                        <textarea
                            className="form-control"
                            id="exampleFormControlTextarea1"
                            rows="5"
                            value={GrossExamination}
                            onChange={this.handleChange("GrossExamination")}
                        />
                    </div>
                    <div>
                        <label>Pertinent History: </label>
                    </div>
                    <div>
                        <textarea
                            className="form-control"
                            id="exampleFormControlTextarea1"
                            rows="5"
                            style={{ marginBottom: 10 }}
                            value={PertinentHistory}
                            onChange={this.handleChange("PertinentHistory")}
                        />
                    </div>
                    <div>
                        <label> Comments: </label>
                    </div>
                    <div>
                        <textarea
                            className="form-control"
                            id="exampleFormControlTextarea1"
                            rows="5"
                            style={{ marginBottom: 10 }}
                            value={Comments}
                            onChange={this.handleChange("Comments")}
                        />
                    </div>

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

export default Report2;
