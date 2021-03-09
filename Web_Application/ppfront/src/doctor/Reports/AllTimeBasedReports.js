import { isEmpty } from "lodash";
import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import {
    getPathReportsOfPatientByDoctor as getPathReports,
    getUsersDropdown,
} from "./pathreportapi";
import { getReportsOfPatientByDoctor as getBloodReports } from "./reportapi";

export const AllTimeBasedReports = () => {
    const [AllPatients, setAllPatients] = React.useState([]);

    //
    const [SelectedPatient, setSelectedPatient] = React.useState();
    const [SelectedWeek, setSelectedWeek] = React.useState();
    const [SelectedType, setSelectedType] = React.useState();
    const [isLoading, setIsLoading] = React.useState(false);
    const [Error, setError] = React.useState("");

    const [BloodReports, setBloodReports] = React.useState([]);
    const [PathReports, setPathReports] = React.useState([]);

    React.useEffect(() => {
        getUsersDropdown().then((res) => {
            console.log(res);
            setAllPatients(res.data);
        });
    }, []);

    React.useEffect(() => {
        if (SelectedPatient && SelectedWeek && SelectedType) {
            let fromDate = moment(SelectedWeek || "");
            let toDate = moment(SelectedWeek || "");

            if (SelectedType === "week") {
                fromDate = fromDate.startOf("isoWeek");
                toDate = toDate.endOf("isoWeek");
            } else if (SelectedType === "month") {
                fromDate = fromDate.startOf("month");
                toDate = toDate.endOf("month");
            }
            fromDate = fromDate.format("YYYY-MM-DD");
            toDate = toDate.format("YYYY-MM-DD");

            setError("");
            setIsLoading(true);
            getBloodReports(SelectedPatient, fromDate, toDate)
                .then((data) => {
                    if (data.error) {
                        setError(String(data.error));
                        setBloodReports([]);
                    } else {
                        setBloodReports(data.results);
                    }
                })
                .catch((_) => {
                    setBloodReports([]);
                });
            getPathReports(SelectedPatient, fromDate, toDate)
                .then((data) => {
                    setIsLoading(false);

                    if (data.error) {
                        setError(String(data.error));
                        setPathReports([]);
                    } else {
                        setPathReports(data.results);
                    }
                })
                .catch((_) => {
                    setIsLoading(false);
                    setPathReports([]);
                });
        } else {
            if (!SelectedPatient) {
                setError("Please select a patient");
            } else if (!SelectedType) {
                setError("Please select report type");
            } else {
                setError("Please select a ".concat(SelectedType));
            }
        }
    }, [SelectedPatient, SelectedType, SelectedWeek]);

    return (
        <div className="container p-5">
            <h2 className=" mb-5">
                <i className="fas fa-clock text-info mr-2" />
                Time Based Reports
            </h2>

            <div className="row">
                {AllPatients && (
                    <>
                        <div className="col-md-4">
                            <select
                                id="inputPatient"
                                className="form-control"
                                placeholder="Enter Patient's name"
                                style={{ marginBottom: 10 }}
                                value={SelectedPatient}
                                required
                                onChange={(e) =>
                                    setSelectedPatient(e.target.value)
                                }
                            >
                                <option value="null">Select patient</option>
                                {AllPatients.map((r) => (
                                    <option key={r._id} value={r._id}>
                                        {r.firstname} {r.lastname} {r.phone}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-2">
                            <label className="mx-2 my-0">
                                <input
                                    className="mr-2"
                                    type="radio"
                                    name="type"
                                    value="day"
                                    checked={SelectedType === "day"}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedWeek(null);
                                            setSelectedType("day");
                                        }
                                    }}
                                />
                                Daily report
                            </label>
                            <label className="mx-2 my-0">
                                <input
                                    className="mr-2"
                                    type="radio"
                                    name="type"
                                    value="week"
                                    checked={SelectedType === "week"}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedWeek(null);
                                            setSelectedType("week");
                                        }
                                    }}
                                />
                                Weekly report
                            </label>
                            <label className="mx-2 my-0">
                                <input
                                    className="mr-2"
                                    type="radio"
                                    name="type"
                                    value="month"
                                    checked={SelectedType === "month"}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedWeek(null);
                                            setSelectedType("month");
                                        }
                                    }}
                                />
                                Monthly report
                            </label>
                        </div>
                        <div className="col-md-3">
                            {SelectedType === "day" ? (
                                <input
                                    className="form-control"
                                    type="date"
                                    name="SelectedType"
                                    onChange={(e) =>
                                        setSelectedWeek(e.target.value)
                                    }
                                />
                            ) : SelectedType === "week" ? (
                                <input
                                    className="form-control"
                                    type="week"
                                    name="SelectedType"
                                    onChange={(e) =>
                                        setSelectedWeek(e.target.value)
                                    }
                                />
                            ) : SelectedType === "month" ? (
                                <input
                                    className="form-control"
                                    type="month"
                                    name="SelectedType"
                                    onChange={(e) =>
                                        setSelectedWeek(e.target.value)
                                    }
                                />
                            ) : (
                                <></>
                            )}
                        </div>
                        {isLoading && (
                            <div className="col-auto">
                                <i className="fa fa-circle-notch fa-spin fa-2x" />
                            </div>
                        )}
                    </>
                )}
            </div>

            {!isEmpty(Error) ? (
                <div className="text-danger">{Error}</div>
            ) : isLoading ? (
                <></>
            ) : (
                <>
                    <h3>Blood Reports</h3>
                    {isEmpty(BloodReports) ? (
                        <>There are no blood reports for this {SelectedType}</>
                    ) : (
                        <>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Bloodpressure</th>
                                        <th>Glucose</th>
                                        <th>Hmg</th>
                                        <th>Date</th>
                                        <th width="180"></th>
                                    </tr>
                                    {BloodReports &&
                                        BloodReports.map((r) => (
                                            <tr>
                                                <td>{r.bloodpressure}</td>
                                                <td>{r.glucose}</td>
                                                <td>{r.hmg}</td>
                                                <td>
                                                    {moment(r.created).format(
                                                        "D MMM YYYY"
                                                    )}
                                                </td>
                                                <td>
                                                    <Link
                                                        className="btn btn-secondary"
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
                        </>
                    )}

                    {/* PATH REPORT */}
                    <h3>Pathology Reports</h3>
                    {isEmpty(PathReports) ? (
                        <>There are no blood reports for this {SelectedType}</>
                    ) : (
                        <>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Comment</th>
                                        <th>Date</th>
                                        <th width="180"></th>
                                    </tr>
                                    {PathReports &&
                                        PathReports.map((r) => (
                                            <tr>
                                                <td>{r?.Comments}</td>
                                                <td>
                                                    {moment(r?.created).format(
                                                        "D MMM YYYY"
                                                    )}
                                                </td>
                                                <td>
                                                    <Link
                                                        className="btn btn-secondary"
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
                        </>
                    )}
                </>
            )}
        </div>
    );
};
