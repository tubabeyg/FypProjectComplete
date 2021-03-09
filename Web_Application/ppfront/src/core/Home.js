import { Layout } from "antd";
import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import DoctorImage from "../images/doctor.jpg";
import HospitalImage from "../images/hospital.jpg";
import PatientImage from "../images/patient.jpg";
import superAdminImage from "../images/superAdmin.jpg";
import "./Home.css";
const { Content } = Layout;

function Home() {
    return (
        <div className="home-body">
            <div className="imgg">
                <h1 className="dash-head1">Right there with you</h1>
                <h6 className="dash-head1">
                    We're taking deliberate steps to help you
                </h6>

                <div
                    style={{
                        backgroundPosition: "top",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <div className="container">
                        <div className="row p-3 justify-content-center">
                            <div className="col-md-3">
                                <div className="home-deck-card">
                                    <Link to={"/superadmin/superadminsignin"}>
                                        <Card.Img
                                            style={{
                                                maxHeight: "56%",
                                                maxWidth: "100%",
                                            }}
                                            variant="top"
                                            src={superAdminImage}
                                        />
                                        <Card.Body>
                                            <Card.Title>
                                                Super Admin's Portal
                                            </Card.Title>
                                            <Card.Text>
                                                Welcome admin. Sign in and
                                                register the hospitals.
                                                <b>You're your own boss</b>{" "}
                                            </Card.Text>
                                        </Card.Body>
                                    </Link>
                                </div>
                            </div>

                            <div className="col-md-3">
                                <div className="home-deck-card">
                                    <Link to={"/hospital/signin"}>
                                        <Card.Img
                                            style={{
                                                maxHeight: "320px",
                                                maxWidth: "100%",
                                            }}
                                            variant="top"
                                            src={HospitalImage}
                                        />
                                        <Card.Body>
                                            <Card.Title>
                                                Hospital's Portal
                                            </Card.Title>
                                            <Card.Text>
                                                Hello hospital's admin. Register
                                                yourself with our software, or
                                                login using the given
                                                credentials.
                                            </Card.Text>
                                        </Card.Body>
                                    </Link>
                                </div>
                            </div>

                            <div className="col-md-3">
                                <div className="home-deck-card">
                                    <Link to={"/doctor/signin"}>
                                        <Card.Img
                                            variant="top"
                                            src={DoctorImage}
                                        />
                                        <Card.Body>
                                            <Card.Title>
                                                Doctor's Portal
                                            </Card.Title>
                                            <Card.Text>
                                                Hello Doctor. Sign in to your
                                                account to interact with your
                                                fellow doctors and manage your
                                                patients.{" "}
                                            </Card.Text>
                                        </Card.Body>
                                    </Link>
                                </div>
                            </div>

                            <div className="col-md-3">
                                <div className="home-deck-card">
                                    <Link to={"/signin"}>
                                        <Card.Img
                                            variant="top"
                                            src={PatientImage}
                                        />
                                        <Card.Body>
                                            <Card.Title>
                                                Patient's Portal
                                            </Card.Title>
                                            <Card.Text>
                                                Hello Patients. Signin to your
                                                accounts to interact with book
                                                an appointment.
                                            </Card.Text>
                                        </Card.Body>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
