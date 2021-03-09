import { get } from "lodash";
import React from "react";
import { useParams } from "react-router-dom";
import Pdf from "react-to-pdf";
import styled from "styled-components";
import { getReportById } from "./reportapi";

export const BloodReport = (props) => {
    const { reportId } = useParams();
    const ref = React.createRef();
    const [Report, setReport] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        getReportById(reportId).then((res) => {
            console.log(`🚀 > getReportById > res`, res);
            setReport(get(res, "0"));
            setIsLoading(false);
        });
        //
    }, [reportId]);

    const BloodPressureConclusion = (value) => {
        if (!String(value)) {
            return "N/A";
        } else if (!String(value).includes("/")) {
            return "Invalid bloodpressure result";
        } else if (String(value).split("/").length != 2) {
            return "Invalid bloodpressure result";
        } else {
            const bp = String(value).split("/");
            const s = bp[0];
            const d = bp[1];

            let resp = "";

            if (s < 60) {
                resp += "Systolic low";
            } else if (s > 80) {
                resp += "Systolic high";
            } else {
                resp += "Systolic normal";
            }

            resp += "; ";

            if (d < 90) {
                resp += "Diastolic low";
            } else if (d > 120) {
                resp += "Diastolic high";
            } else {
                resp += "Diastolic normal";
            }

            return resp;
        }
    };

    const GlucoseConclusion = (value) => {
        let resp = "";

        if (!Number(value)) {
            resp = "N/A";
        } else if (value < 90) {
            resp += "Low";
        } else if (value > 140) {
            resp += "High";
        } else {
            resp += "Normal";
        }

        return resp;
    };

    const HeamoglobinConclusion = (value) => {
        let resp = "";

        if (!Number(value)) {
            resp = "N/A";
        } else if (value < 12) {
            resp += "Low";
        } else if (value > 17.5) {
            resp += "High";
        } else {
            resp += "Normal";
        }

        return resp;
    };

    return (
        <div className="container p-5">
            <Pdf targetRef={ref} filename="bloodreport?.pdf">
                {({ toPdf }) => (
                    <button className="btn btn-light" id="btn" onClick={toPdf}>
                        <i className="fa fa-file-pdf mr-2 text-danger"></i>
                        Export PDF
                    </button>
                )}
            </Pdf>
            {isLoading && <i className="fa fa-circle-notch fa-spin ml-2" />}
            <div
                style={{
                    overflowX: "auto",
                    width: "100%",
                }}
                className="py-3"
            >
                <A4Page ref={ref}>
                    <div className="header-div d-flex flex-reverse justify-content-between">
                        <span className="header-name">
                            3D Visualization & Modelling
                        </span>
                        <img
                            src="/assets/images/cube.svg"
                            class="header-logo d-inline-block align-top spinner"
                            alt=""
                        />
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <div className="patient-info">
                                <p>
                                    Patient name:
                                    <span>
                                        {Report?.patients.firstname}{" "}
                                        {Report?.patients.lastname}
                                    </span>
                                </p>
                                <p>
                                    Age:
                                    <span>{Report?.patients.age} years</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <h4 className="report-name">
                        {isLoading ? (
                            <i className="fa fa-circle-notch fa-spin ml-2" />
                        ) : (
                            "Blood Report"
                        )}
                    </h4>

                    <table>
                        <tr>
                            <th>Test</th>
                            <th>Result</th>
                            <th>Normal Ranges</th>
                            <th>Conclusion</th>
                        </tr>
                        <tr>
                            <td>Blood pressure</td>
                            <td> {Report?.bloodpressure} mmHg </td>
                            <td>
                                90/60 mmHg -<br /> 120/80 mmHg
                            </td>
                            <td>
                                {BloodPressureConclusion(Report?.bloodpressure)}
                            </td>
                        </tr>
                        <tr>
                            <td>Glucose</td>
                            <td>
                                {Report?.glucose}
                                mg/dL
                            </td>
                            <td>90 - 140 mg/dL</td>
                            <td> {GlucoseConclusion(Report?.glucose)} </td>
                        </tr>
                        <tr>
                            <td>Heamoglobin</td>
                            <td>
                                {Report?.hmg}
                                g/dL
                            </td>
                            <td>12.0 to 17.5 g/dL</td>
                            <td> {HeamoglobinConclusion(Report?.hmg)} </td>
                        </tr>
                    </table>
                    <div className="doctors-remarks">Doctor's Remarks</div>
                    <div className="patient-detail">
                        <div className="row">
                            <div className="col-6 ">
                                <h5>Patient detail:</h5>
                                <p>
                                    CNIC:
                                    <span> {Report?.patients.cnic} </span>
                                </p>
                                <p>
                                    Phone:
                                    <span> {Report?.patients.phone} </span>
                                </p>
                                <p>
                                    Email:
                                    <span> {Report?.patients.email} </span>
                                </p>
                            </div>
                            <div className="col-3 text-center">
                                <small className="text-muted">patient id</small>
                                <br />
                                <img
                                    height="125px"
                                    src={"http://barcodes4.me/barcode/qr/google.png?value=".concat(
                                        Report?.patients._id
                                    )}
                                    alt={Report?.patients._id}
                                />
                            </div>
                            <div className="col-3 text-center">
                                <small className="text-muted">report id</small>
                                <br />
                                <img
                                    height="125px"
                                    src={"http://barcodes4.me/barcode/qr/google.png?value=".concat(
                                        Report?._id
                                    )}
                                    alt={Report?._id}
                                />
                            </div>
                        </div>
                    </div>
                </A4Page>
            </div>
        </div>
    );
};

const A4Page = styled.div`
    background-color: white;
    height: 1120px;
    width: 800px;
    padding: 2rem;
    padding-top: 1rem;
    border: 2px solid gray;
    // box-shadow: 0 0 20px -5px black;

    .header-div {
        padding-bottom: 1rem;

        .header-logo {
            height: 100px;
        }

        .header-name {
            width: 100%;
            font-size: 28px;
            margin-top: 11px;
            font-weight: 600;
            border-top: 17px solid darkred;
        }
    }

    .patient-info {
        font-size: 1rem;

        span {
            margin-left: 0.25rem;
            font-weight: bold;
        }
    }

    .patient-detail {
        margin-top: 2rem;

        h5 {
            font-weight: bold;
        }
    }

    table {
        width: 100%;
        margin-top: 3rem;
        font-size: 1rem;

        td {
            border-top: 1px solid silver;
            width: 25%;
            padding: 1rem 0;
        }
    }

    .report-name {
        border-bottom: 1px solid gray;
        padding-bottom: 4px;
        text-align: center;
        margin: 2rem 0;
    }

    .doctors-remarks {
        margin-top: 3rem;
        padding: 1rem;
        height: 200px;
        border: 1px solid gray;
    }
`;
