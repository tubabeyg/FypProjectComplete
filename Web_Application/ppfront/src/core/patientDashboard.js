import { SettingOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import "antd/dist/antd.css";
import SubMenu from "antd/lib/menu/SubMenu";
import React from "react";
import {
    BrowserRouter as Router,
    Link,
    Route,
    Switch as RouterSwitch
} from "react-router-dom";
import NewAppointment from "../appointment/newAppointment";
import { isAuthenticated, signout } from "../auth/index";
import AllBReports from "../patient/AllbReports";
import AllPReports from "../patient/AllpReports";
import AllReports from "../patient/allReport";
import appointments from "../patient/appointments";
import { BReport } from "../patient/BReport";
import EditPatient from "../patient/EditPatient";
import getAppointment from "../patient/getAppointment";
import Profile from "../patient/Profile";
import styles from "./patientdashboard.module.css";
const { Content, Sider } = Layout;

class patientDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.Signout = this.Signout.bind(this);
        console.log(isAuthenticated().patient);
    }
    Signout() {
        signout()
            .then((i) => this.props.history.push("/"))
            .catch((i) => this.props.history.push("/"));
    }

    render() {
        return (
            <Layout>
                <Router>
                    <Sider
                        breakpoint="lg"
                        collapsedWidth="0"
                        onBreakpoint={(broken) => {
                            console.log(broken);
                        }}
                        onCollapse={(collapsed, type) => {
                            console.log(collapsed, type);
                        }}
                    >
                        <div
                            className={styles.logo}
                            style={{
                                color: "navy-blue",
                                marginBottom: 500,
                                height: 50,
                                background: "rgba(255, 255, 255, 0.2)",
                                margin: 16,
                                padding: 6,
                                textAlign: "center",
                            }}
                        >
                            <Link className="text-blue">Patient's Portal</Link>
                        </div>

                        <Menu
                            theme="dark"
                            mode="inline"
                            style={{ minHeight: "500px" }}
                        >
                            <Menu.Item key="2" icon={<UserOutlined />}>
                                Doctors
                                <Link to={"/patientsportal"} />
                            </Menu.Item>

                            <Menu.Item key="3" icon={<UserOutlined />}>
                                Appointments
                                {/* <Link to={"/patientportal/appointments"} /> */}
                                <Link
                                    to={`/patientportal/appointments/${isAuthenticated().patient._id
                                        }`}
                                />
                            </Menu.Item>
                            <Menu.Item key="4" icon={<UserOutlined />}>
                                Profile
                                {/* <Link to={"/patients/Profile"} /> */}
                                <Link
                                    to={`/patientportal/${isAuthenticated().patient._id
                                        }`}
                                />
                            </Menu.Item>
                            <Menu.Item key="5" icon={<UserOutlined />}>
                                Reports
                                <Link
                                    to={`/patientportal1/allReport/${isAuthenticated().patient._id
                                        }`}
                                />
                                {/* <Link to={"/patientportal1/allReport"} /> */}
                            </Menu.Item>

                            <SubMenu
                                key="sub6"
                                icon={<SettingOutlined />}
                                title="Account"
                            >
                                <Menu.Item
                                    onClick={this.Signout}
                                    key="7"
                                    icon={<SettingOutlined />}
                                >
                                    Signout
                                </Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Sider>

                    <Content className={styles.ssl}>
                        <RouterSwitch>

                            <Route
                                exact
                                path="/patientportal/:id"
                                component={Profile}
                            />

                            <Route
                                exact
                                path="/patientportal/appointments/:id"
                                component={appointments}
                            />

                            <Route
                                exact
                                path="/patientportal/BReport/:id"
                                component={BReport}
                            />
                            <Route
                                exact
                                path="/patientportal1/allReport/:id"
                                component={AllReports}
                            />
                            <Route
                                exact
                                path="/patientportal1/allbReport/:id"
                                component={AllBReports}
                            />
                            <Route
                                exact
                                path="/patientportal1/allpReport/:id"
                                component={AllPReports}
                            />
                            <Route
                                exact
                                path="/patientportal1/alleReport/:id"
                                component={EditPatient}
                            />

                            <Route
                                exact
                                path="/patientsportal/appointment/create/:doctorId"
                                component={NewAppointment}
                            />

                            <Route
                                exact
                                path="/patientsportal"
                                component={getAppointment}
                            />

                        </RouterSwitch>
                    </Content>
                </Router>
            </Layout>
        );
    }
}

//    style={{
//        maxHeight: "180px",
//     maxWidth: "100%",
//                                     }}
//                                     variant="top"
//                                 />
//                                 <Card.Body>
//                                     <Card.Title>Patients</Card.Title>
//                                     <Card.Text>
//                                          To perform operations on patients,
//                                          please click on the button below{" "}
//                                     </Card.Text>
//         /                             <span class="btn btn-raised btn-primary ">
//         //                                 Patients
//         /                             </span>
//                                  </Card.Body>
//        /                     </Link>
//                       </div>
//                     </div>
//                      <div className="col-md-6">
//                         <div className="home-deck-card">
//                            <Link to={"/appointment/create"}>
//                                 <Card.Img
//                                   style={{
//                                          maxHeight: "180px",
//                                          maxWidth: "100%",
//                                      }}
//                                      variant="top"
//                                  />
//                                  <Card.Body>
//                                      <Card.Title>Appointment</Card.Title>
//                                     <Card.Text>
//                                         To perform operations on appointment,
//                                         please click on the button below{" "}
//                                     </Card.Text>
//         //                             <span class="btn btn-raised btn-primary ">
//         //                                 Appointment
//         //                             </span>
//         //                         </Card.Body>
//         //                     </Link>
//         </div>
//                      </div>

//                     {/* <div className="col-md-2">
//                         <div className="home-deck-card">
//                             <Link to={"/"}>
//                                 <Card.Img
//                                     style={{
//                                         maxHeight: "180px",
//                                         maxWidth: "50%",
//                                     }}
//                                     variant="top"
//                                 />
//                                 <Card.Body>
//                                     <span class="btn btn-raised btn-primary ">
//                                         Back
//                                     </span>
//                                 </Card.Body>
//                             </Link>
//                         </div>
//                     </div> */}

export default patientDashboard;
