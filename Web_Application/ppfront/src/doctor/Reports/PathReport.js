import { get } from "lodash";
import React from "react";
import { useParams } from "react-router-dom";
import Pdf from "react-to-pdf";
import styled from "styled-components";
import { getpathReportById } from "./pathreportapi";

export const PathReport = (props) => {
    const { reportId } = useParams();
    const ref = React.createRef();
    const [Report, setReport] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        getpathReportById(reportId).then((res) => {
            console.log(`🚀 > getReportById > res`, res);
            setReport(get(res, "0"));
            setIsLoading(false);
        });
        //
    }, [reportId]);

    return (
        <div className="container p-5">
            <Pdf targetRef={ref} filename="pathreport.pdf">
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
                            "Pathology Report"
                        )}
                    </h4>

                    <div className="report-data">
                        {get(Report, "image.contentType") && (
                            <p>
                                <img
                                    src={
                                        "data:" +
                                        get(Report, "image.contentType") +
                                        ";base64," +
                                        get(Report, "image.data")
                                    }
                                    height="200px"
                                />
                            </p>
                        )}

                        <h3>Gross Examination:</h3>
                        <p>{Report?.GrossExamination}</p>
                        <h3>Microscopic Examination:</h3>
                        <p>{Report?.MicroscopicExamination}</p>
                        <h3>Specimen</h3>
                        <p>{Report?.Specimen}</p>
                        <h3>Pertinent History</h3>
                        <p>{Report?.PertinentHistory}</p>
                        <h3>Comments</h3>
                        <p>{Report?.Comments}</p>
                    </div>

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
    min-height: 1120px;
    width: 800px;
    padding: 2rem;
    padding-top: 1rem;
    border: 2px solid gray;
    // box-shadow: 0 0 20px -5px black;

    .header-div {
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
        span {
            margin-left: 0.25rem;
            font-weight: bold;
        }
    }

    .patient-detail,
    .patient-info {
        font-size: 1rem;

        p {
            margin-bottom: 0.25rem;
        }

        h5 {
            margin-top: 2rem;
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

    .doctors-remarks {
        margin-top: 3rem;
        padding: 1rem;
        height: 200px;
        border: 1px solid gray;
    }

    .report-name {
        border-bottom: 1px solid gray;
        padding-bottom: 4px;
        text-align: center;
        margin: 1rem 0;
    }

    .report-data {
        h3 {
            font-size: 1.2rem;
            font-weight: bold;
        }
    }
`;
